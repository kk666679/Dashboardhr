import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any, loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            employee: any;
        };
    }>;
    register(body: {
        email: string;
        password: string;
        role?: string;
    }): Promise<Prisma.UserCreateInput>;
}
