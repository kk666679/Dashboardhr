import { PagesService } from './pages.service';
export declare class PagesController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
    getPages(): import("./pages.service").Page[];
}
