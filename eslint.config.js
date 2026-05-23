// ESLint 9 flat config — Client (React 19 / Vite / TypeScript)
// Prettier runs INSIDE ESLint (eslint-plugin-prettier), so `npm run lint`
// covers both code quality AND formatting.
//
// Note: type-aware linting is NOT enabled here (to keep the editor fast).
// If you want no-floating-promises and similar type-aware rules — let me know
// and I'll add them following the API config model.
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'ai-blueprint/**',
            '.github/**',
            '.vscode/**',
            '.idea/**',
            '.zed/**',
            '.claude/**',
            'public/**',
            '**/*.yml',
            '**/*.yaml',
            '**/*.md',
            '**/*.json',
            '**/*.html',
        ],
    },

    js.configs.recommended,

    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        settings: {
            react: { version: 'detect' },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...react.configs.recommended.rules,

            // React 19 / new JSX transform — no need to import React, nor prop-types
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            'react/prop-types': 'off',

            // ── Hooks (critical because of 33 useEffect / 58 useState) ⭐ ──
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

            // ── React best practices (from code review) ──
            'react/no-array-index-key': 'warn',
            'react/self-closing-comp': 'warn',
            'react/jsx-boolean-value': ['warn', 'never'],
            'react/jsx-no-useless-fragment': 'warn',
            'react/jsx-no-target-blank': 'warn',
            'react/jsx-pascal-case': 'warn',
            'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],

            // ── TypeScript ──
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            // FC and other types get imported alongside values → split them apart
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],

            // ── code quality ──
            eqeqeq: ['error', 'always'],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-var': 'error',
            'prefer-const': 'error',
            'object-shorthand': ['warn', 'always'],
            'no-unused-expressions': 'error',
            'require-await': 'warn',
            'no-await-in-loop': 'warn',

            // ── object destructuring ──
            'prefer-destructuring': [
                'warn',
                {
                    VariableDeclarator: { array: false, object: true },
                    AssignmentExpression: { array: false, object: false },
                },
                { enforceForRenamedProperties: false },
            ],

            // ── use the "~" alias instead of deep relative imports ──
            'no-restricted-imports': [
                'warn',
                {
                    patterns: [
                        {
                            group: ['../../**'],
                            message:
                                'Use the "~" alias instead of deep relative imports (../../). E.g.: "~/component/atoms".',
                        },
                    ],
                },
            ],

            // ── import ordering by atomic layers ──
            // external libraries → atom → molecule → organism → constants → utils
            // → other internal (~ alias) → styles/current folder
            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [
                        ['^node:', '^react', '^react-dom', '^@?\\w'], // 1. external libraries
                        ['atoms(/|$)'], // 2. atoms
                        ['molecules(/|$)'], // 3. molecules
                        ['organisms(/|$)'], // 4. organisms
                        ['constants(/|$)'], // 5. constants
                        ['(Utils|utils|Helpers)(/|$)'], // 6. utils / helpers
                        ['^~/', '^\\.\\.'], // 7. other internal (~ alias + ../)
                        ['^\\.'], // 8. current folder + styles (.css)
                    ],
                },
            ],
            'simple-import-sort/exports': 'warn',
        },
    },

    // .js/.cjs config files (vite.config, jest setup, etc.) — Node environment
    {
        files: ['**/*.{js,cjs,mjs}'],
        languageOptions: {
            globals: { ...globals.node },
        },
    },

    // IMPORTANT: last — disables formatting rules that conflict with Prettier,
    // and activates `prettier/prettier`.
    prettierRecommended,
];
