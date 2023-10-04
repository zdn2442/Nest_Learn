import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!!request.query.page === false) {   //memberikan nilai default 1 jika tidak dikirim client
      request.query.page = 1;
    }
    if (!!request.query.pageSize === false) { //memberikan nilai default 10 jika tidak dikirim client
      request.query.pageSize = 10;
    }

    request.limit =
      (Number(request.query.page) - 1) * Number(request.query.pageSize);
    request.pageSize = Number(request.query.pageSize);
    request.page = Number(request.page);
    return request.query;
  },
);
