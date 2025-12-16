"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
let PagesService = class PagesService {
    constructor() {
        this.pages = [
            {
                name: 'Dashboard',
                path: '/',
                description: 'Main dashboard page',
            },
            {
                name: 'Attendance',
                path: '/attendance',
                description: 'Attendance tracking and management',
                module: 'attendance',
            },
            {
                name: 'Compliance',
                path: '/compliance',
                description: 'Compliance center and reports',
                module: 'compliance',
            },
            {
                name: 'Employees',
                path: '/employees',
                description: 'Employee directory and management',
                module: 'employees',
            },
            {
                name: 'Payroll',
                path: '/payroll',
                description: 'Payroll processing and management',
                module: 'payroll',
            },
            {
                name: 'Reports',
                path: '/reports',
                description: 'Analytics and reporting',
                module: 'analytics',
            },
            {
                name: 'Talent',
                path: '/talent',
                description: 'Talent acquisition and management',
                module: 'users',
            },
        ];
    }
    getPages() {
        return this.pages;
    }
    getPageByPath(path) {
        return this.pages.find(page => page.path === path);
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)()
], PagesService);
//# sourceMappingURL=pages.service.js.map