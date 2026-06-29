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
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_SERVER_ERROR';
        let details = null;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object') {
                message = exceptionResponse.message || message;
                code = exceptionResponse.error || this.mapStatusToCode(status);
                if (Array.isArray(exceptionResponse.message)) {
                    message = 'Validation failed';
                    code = 'VALIDATION_ERROR';
                    details = exceptionResponse.message.map((msg) => {
                        return {
                            message: msg,
                        };
                    });
                }
            }
            else {
                message = exceptionResponse;
                code = this.mapStatusToCode(status);
            }
        }
        else if (exception instanceof Error) {
            console.error('Unhandled Exception:', exception);
            message = 'An unexpected error occurred. Please try again later.';
        }
        response.status(status).json({
            success: false,
            message,
            error: {
                code,
                ...(details && { details }),
            },
        });
    }
    mapStatusToCode(status) {
        switch (status) {
            case common_1.HttpStatus.BAD_REQUEST:
                return 'BAD_REQUEST';
            case common_1.HttpStatus.UNAUTHORIZED:
                return 'UNAUTHORIZED';
            case common_1.HttpStatus.FORBIDDEN:
                return 'FORBIDDEN';
            case common_1.HttpStatus.NOT_FOUND:
                return 'NOT_FOUND';
            case common_1.HttpStatus.CONFLICT:
                return 'CONFLICT';
            case common_1.HttpStatus.TOO_MANY_REQUESTS:
                return 'RATE_LIMITED';
            default:
                return 'INTERNAL_SERVER_ERROR';
        }
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map