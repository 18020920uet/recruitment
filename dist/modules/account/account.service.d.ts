import type { Mapper } from '@automapper/types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@Repositories/user.repository';
import { RegisterRequest, LoginRequest } from './dtos/requests.dto';
import { ActivateAccountResponse, LoginResponse, RegisterResponse } from './dtos/responses.dto';
export declare class AccountService {
    private readonly mapper;
    private userRepository;
    private configService;
    private jwtService;
    constructor(mapper: Mapper, userRepository: UserRepository, configService: ConfigService, jwtService: JwtService);
    register(request: RegisterRequest): Promise<RegisterResponse>;
    login(request: LoginRequest): Promise<LoginResponse>;
    activate(encryptedString: string): Promise<ActivateAccountResponse>;
    private signToken;
    private encrypt;
    private decrypt;
}
