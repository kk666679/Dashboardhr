"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use(helmet());
    app.use(cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            configService.get('FRONTEND_URL', 'http://localhost:3000'),
        ],
        credentials: true,
    }));
    app.use(compression());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
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
//# sourceMappingURL=main.js.map