"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const all_exceptions_filter_1 = require("./filters/all-exceptions.filter");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const validation_pipe_1 = require("./pipes/validation.pipe");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
            local_auth_guard_1.LocalAuthGuard,
            roles_guard_1.RolesGuard,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_PIPE,
                useClass: validation_pipe_1.ValidationPipe,
            },
        ],
        exports: [local_auth_guard_1.LocalAuthGuard, roles_guard_1.RolesGuard],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map