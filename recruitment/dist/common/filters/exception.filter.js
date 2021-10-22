"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        if (exception instanceof common_1.HttpException) {
            const statusCode = exception.getStatus();
            const message = exception.message;
            const exceptionResponse = {
                statusCode: statusCode,
                message: message,
                status: 0,
            };
            return response.status(statusCode).json(exceptionResponse);
        }
        else {
            const statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = exception.message;
            const exceptionResponse = {
                statusCode: statusCode,
                status: 0,
                message: message,
                path: request.path,
                method: request.method,
                timestamp: new Date().toISOString(),
            };
            const logDirectory = './logs';
            if (!fs.existsSync(logDirectory)) {
                fs.mkdirSync(logDirectory);
            }
            const log = Object.assign(Object.assign({}, exceptionResponse), { request: request.body, ip: request.ip });
            fs.appendFile('logs/error.log', JSON.stringify(log) + '\n', { flag: 'a' }, (err) => {
                if (err) {
                    throw err;
                }
                console.log('Internal server error has been saved!');
            });
            if (process.env.NODE_ENV == 'production') {
                return response.status(statusCode).json({
                    statusCode: statusCode,
                    message: 'Internal server error',
                    status: 0,
                });
            }
            else {
                return response.status(statusCode).json(exceptionResponse);
            }
        }
    }
};
AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
//# sourceMappingURL=exception.filter.js.map