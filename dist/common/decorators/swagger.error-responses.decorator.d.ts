declare class ErrorResponse {
    readonly status: number;
    message: string;
}
export declare class ConflictResponse extends ErrorResponse {
    statusCode: number;
}
export declare class NotFoundResponse extends ErrorResponse {
    statusCode: number;
}
export declare class InternalServerErrorResponse extends ErrorResponse {
    statusCode: number;
}
export declare class ForbiddenResponse extends ErrorResponse {
    statusCode: number;
}
export declare class UnauthorizedResponse extends ErrorResponse {
    statusCode: number;
}
export declare class NotAcceptableResponse extends ErrorResponse {
    statusCode: number;
}
export {};
