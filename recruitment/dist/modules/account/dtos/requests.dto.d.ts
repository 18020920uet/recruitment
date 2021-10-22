export declare class RegisterRequest {
    readonly email: string;
    readonly password: string;
    readonly firstName: string;
    readonly lastName: string;
}
export declare class LoginRequest {
    email: string;
    password: string;
}
export declare class ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
