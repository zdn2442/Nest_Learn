import { ResponseSuccess, ResponsePagination } from '../../interface/response/response.interface';

class BaseResponse {
  _success(message: string, data?: any): ResponseSuccess {
    return {
      status: 'Success',
      message: message,
      data: data || {},
    };
  }

  _pagination(
    message: string,
    data: any,
    totalData: number,
    page: number,
    pageSize: number,
  ): ResponsePagination {
    return {
      status: 'Success',
      message: message,
      data: data,
      pagination: {
        total: totalData,
        page: page,
        pageSize: pageSize,
      },
    };
  }
}

export default BaseResponse;
