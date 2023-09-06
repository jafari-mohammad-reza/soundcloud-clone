import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const date = new Date();
        const errorDetail = `${date.toISOString()} - Request to: ${request.url} - Response status: ${status} - Error message: ${exception.message}\n`;
        const logFileName = `errors-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;

        fs.appendFile(path.join(__dirname, './logs', logFileName), errorDetail, 'utf8', (err) => {
            if (err) throw err;
        });

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: exception.message,
            });
    }
}