import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response/response.interface';
import { CreateBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import { InjectRepository } from '@nestjs/typeorm'; // import injectReposity
import { Book } from './book.entity'; // import Book Entiy
import { Between, Like, Repository } from 'typeorm'; //import repository
import BaseResponse from 'src/utils/response/base.response';
@Injectable()
export class BookService extends BaseResponse {
  [x: string]: any;

  //inject book repository ke service

  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {
    super();
  }

   //inject book repository ke service

   private books: {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] = [
    {
      id: 1,
      title: "BSW",
      author: "Hypergriph",
      year: 2023,
    },
  ];

  async getAllBooks(query: FindBookDto): Promise<ResponsePagination> {
    const { page, pageSize, limit, title, author, to_year, from_year } = query;
    const total = await this.bookRepository.count();
    const filter : { [Key: string]: any } = {}
    if (title) {
      filter.title = Like(`%${title}%`)
    }
    if (author) {
      filter.author = Like(`%${author}%`)
    }
    if (from_year && to_year) {
      filter.year = Between(from_year, to_year)
    }
    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, to_year)
    }

    const result = await this.bookRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });

    return {
      status: 'Success',
      message: 'List Buku ditemukan',
      data: result,
      pagination: {
        total: total,
        page: page,
        pageSize: pageSize,
      },
    };
  }

  async createBook(createBookDto: CreateBookDto): Promise<ResponseSuccess> {
    const { title, author, year } = createBookDto;

    try {
      const result = await this.bookRepository.save({
        title: title,
        author: author,
        year: year,
      });
     return this._success('berhasil', result)
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailBook = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (detailBook === null) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 'Success',
      message: 'Detail Buku ditermukan',
      data: detailBook,
    };
  }

  async updateBook(
    id: number,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);

    const update = await this.bookRepository.save({ ...updateBookDto, id: id });
    return {
      status: `Success `,
      message: 'Buku berhasil di update',
      data: update,
    };
  }

  async deleteBook(id: number): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    await this.bookRepository.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus buku',
    };
  }


}
