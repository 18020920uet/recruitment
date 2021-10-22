import { AccountService } from './account.service';
import { RegisterRequest, LoginRequest } from './dtos/requests.dto';
import { ActivateAccountResponse, RegisterResponse, LoginResponse } from './dtos/responses.dto';
export declare class AccountController {
    private accountService;
    constructor(accountService: AccountService);
    register(registerRequest: RegisterRequest): Promise<RegisterResponse>;
    login(loginRequest: LoginRequest): Promise<LoginResponse>;
    activate(encryptedString: string): Promise<ActivateAccountResponse>;
    resetPassword(email: string): Promise<void>;
    unlock(unlockToken: string): Promise<void>;
}
