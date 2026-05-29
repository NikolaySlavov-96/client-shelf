import { type IAuthor } from '~/Store/Slicers/ProductSlicer.interface';

const DEFAULT_SEPARATOR = ', ';

export function formatAuthors(authors: IAuthor[] | undefined | null, separator: string = DEFAULT_SEPARATOR): string {
    if (!authors?.length) return '';
    return authors.map((a) => a.name).join(separator);
}
