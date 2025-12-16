import { Injectable } from '@nestjs/common';

export interface Page {
  name: string;
  path: string;
  description: string;
  module?: string;
}

@Injectable()
export class PagesService {
  private readonly pages: Page[] = [
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

  getPages(): Page[] {
    return this.pages;
  }

  getPageByPath(path: string): Page | undefined {
    return this.pages.find(page => page.path === path);
  }
}
