import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            employee: any;
        };
    }>;
    register(email: string, password: string, role?: string): Promise<Prisma.UserCreateInput>;
}
