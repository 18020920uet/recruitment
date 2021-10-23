export declare class UserEntity {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActivated: boolean;
    lastResetPassword: Date;
    activateCode: string;
    activateDate: Date;
    iv: string;
    resetCode: string;
    isLock: boolean;
    lastLogin: Date;
    loginFailedStrike: number;
}
