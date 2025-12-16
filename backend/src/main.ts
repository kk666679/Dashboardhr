import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({
    origin: [
      'http://localhost:3000', // Next.js dev server
      'http://localhost:3001', // Alternative Next.js port
      configService.get('FRONTEND_URL', 'http://localhost:3000'),
    ],
    credentials: true,
  }));

  // Compression
  app.use(compression());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('AI-HRMS API')
    .setDescription('AI-powered HR Management System API for Malaysian companies')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('Users')
    .addTag('Employees')
    .addTag('Leave Management')
    .addTag('Attendance')
    .addTag('Payroll')
    .addTag('Compliance')
    .addTag('Analytics')
    .addTag('Malaysian Tax & Finance')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT', 3001);
  await app.listen(port);
  
  console.log(`🚀 AI-HRMS Backend running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🔗 API Base URL: http://localhost:${port}/api/v1`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});

