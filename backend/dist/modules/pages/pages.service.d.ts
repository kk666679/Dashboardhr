export interface Page {
    name: string;
    path: string;
    description: string;
    module?: string;
}
export declare class PagesService {
    private readonly pages;
    getPages(): Page[];
    getPageByPath(path: string): Page | undefined;
}
