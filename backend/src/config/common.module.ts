import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

// Filters
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

// Guards
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';

// Interceptors
import { TransformInterceptor } from './interceptors/transform.interceptor';

// Pipes
import { ValidationPipe } from './pipes/validation.pipe';

@Module({
  providers: [
    // Filters
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    // Guards
    LocalAuthGuard,
    RolesGuard,

    // Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    // Pipes
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [LocalAuthGuard, RolesGuard],
})
export class CommonModule {}
