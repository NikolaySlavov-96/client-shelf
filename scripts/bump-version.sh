#!/usr/bin/env bash
#
# bump-version.sh <major|minor|patch> [path-to-package.json]
#
set -euo pipefail

BUMP_TYPE="${1:-}"
PKG="${2:-package.json}"

case "$BUMP_TYPE" in
  major | minor | patch) ;;
  *)
    echo "Usage: $0 <major|minor|patch> [package.json]" >&2
    exit 1
    ;;
esac

if [ ! -f "$PKG" ]; then
  echo "Not found: $PKG" >&2
  exit 1
fi

# Only the top-level "version" key counts. Matching the first "version" anywhere
# in the file picks up "scripts": { "version": ... } (npm's own lifecycle script)
# or any nested config block, and would bump the wrong key while reporting a
# version the manifest never had. Quoted strings are stripped before braces are
# counted, so a brace inside a string value cannot skew the depth.
top_level_version() {
  file=$1
  action=$2
  new=${3:-}
  awk -v action="$action" -v new="$new" '
    {
      line = $0
      if (!done && match(line, /"version"[[:space:]]*:[[:space:]]*"/)) {
        prefix = substr(line, 1, RSTART - 1)
        gsub(/"(\\.|[^"\\])*"/, "", prefix)
        prefix_depth = depth + gsub(/\{/, "{", prefix) - gsub(/\}/, "}", prefix)

        if (prefix_depth == 1) {
          head = substr(line, 1, RSTART + RLENGTH - 1)
          tail = substr(line, RSTART + RLENGTH)
          value = tail
          sub(/".*/, "", value)
          done = 1

          if (action == "read") {
            print value
            exit
          }

          sub(/^[^"]*/, "", tail)
          line = head new tail
        }
      }

      stripped = $0
      gsub(/"(\\.|[^"\\])*"/, "", stripped)
      depth += gsub(/\{/, "{", stripped) - gsub(/\}/, "}", stripped)

      if (action != "read") {
        print line
      }
    }
  ' "$file"
}

CURRENT="$(top_level_version "$PKG" read)"

CORE="${CURRENT%%-*}"
CORE="${CORE%%+*}"

IFS='.' read -r MAJOR MINOR PATCH <<<"$CORE"

if ! [[ "$MAJOR" =~ ^[0-9]+$ && "$MINOR" =~ ^[0-9]+$ && "$PATCH" =~ ^[0-9]+$ ]]; then
  echo "Version '$CURRENT' is not semver (x.y.z)" >&2
  exit 1
fi

case "$BUMP_TYPE" in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
esac

NEW="${MAJOR}.${MINOR}.${PATCH}"

replace_lock_root_version() {
  file=$1
  awk -v new="$NEW" '
    {
      line = $0

      if (!in_packages && depth == 1 && line ~ /^[[:space:]]*"packages"[[:space:]]*:[[:space:]]*\{/) {
        in_packages = 1
      } else if (in_packages && !in_root && depth == 2 && line ~ /^[[:space:]]*""[[:space:]]*:[[:space:]]*\{/) {
        in_root = 1
      } else if (in_root && depth == 3 && match(line, /"version"[[:space:]]*:[[:space:]]*"/)) {
        head = substr(line, 1, RSTART + RLENGTH - 1)
        tail = substr(line, RSTART + RLENGTH)
        sub(/^[^"]*/, "", tail)
        line = head new tail
      }

      print line

      stripped = $0
      gsub(/"(\\.|[^"\\])*"/, "", stripped)
      depth += gsub(/\{/, "{", stripped) - gsub(/\}/, "}", stripped)

      if (in_root && depth <= 2) {
        in_root = 0
      }
      if (in_packages && depth <= 1) {
        in_packages = 0
      }
    }
  ' "$file" >"$file.tmp" && mv "$file.tmp" "$file"
}

top_level_version "$PKG" write "$NEW" >"$PKG.tmp" && mv "$PKG.tmp" "$PKG"

# Only npm writes the project's own version into its lock file. Update only the top-level version
# and packages[""].version when those keys exist. A workspace root lock can omit both; in that case
# it must stay unchanged rather than rewriting a child workspace or dependency version.
# yarn.lock and pnpm-lock.yaml hold no project version, so there is nothing to update in them.
LOCK="$(dirname "$PKG")/package-lock.json"
if [ -f "$LOCK" ]; then
  top_level_version "$LOCK" write "$NEW" >"$LOCK.tmp" && mv "$LOCK.tmp" "$LOCK"
  replace_lock_root_version "$LOCK"
fi

echo "$CURRENT -> $NEW ($BUMP_TYPE)" >&2
echo "$NEW"

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "version=$NEW"
    echo "previous_version=$CURRENT"
  } >>"$GITHUB_OUTPUT"
fi
