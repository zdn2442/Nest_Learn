import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Kategori } from './kategori.entity';
import { CreateBulkKategoriDto, CreateKategoriDto, UpdateKategoriDto, findAllKategori } from './kategori.dto';
import { ResponsePagination, ResponseSuccess } from '../../interface/response/response.interface';
import { Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @Inject(REQUEST) private req: any,  // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }

  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      await this.kategoriRepository.save(payload);  // cukup payload tanpa manipulasi object

      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }


  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_kategori } = query;

    // const filterQuery = {}
    const filterQuery: {
        [key: string]: any;
      } = {};
    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'], // relasi yang aka ditampilkan saat menampilkan list kategori
      select: {   // pilih data mana saja yang akan ditampilkan dari tabel kategori
        id: true,
        nama_kategori: true,
        created_by: {   
          id: true,   // pilih field  yang akan ditampilkan dari tabel user
          nama: true,
        },
        updated_by: {
          id: true, // pilih field yang akan ditampilkan dari tabel user
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const kategoriDetail = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (kategoriDetail === null) {
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 'Success',
      message: 'Detail Kategori ditermukan',
      data: kategoriDetail,
    };
  }

  async updateKategori(
    id: number,
    updateKategoriDto: UpdateKategoriDto,
  ): Promise<ResponseSuccess> {
    const check = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);

    const update = await this.kategoriRepository.save({ ...updateKategoriDto, id: id });
    return {
      status: `Success `,
      message: 'Kategori berhasil di update',
      data: update,
    };
  }

  async deleteKategori(id: number): Promise<ResponseSuccess> {
    const check = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
    await this.kategoriRepository.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus Kategori',
    };
  }

  async createBulk(createCategoryDtos: CreateKategoriDto[]): Promise<ResponseSuccess> {
    const kategoris = createCategoryDtos.map(
        (kategoriDto) => (
          console.log(kategoriDto),
          {
            ...kategoriDto,
            created_by: { id: this.req.user.id },
          }
        ),
      );
    await this.kategoriRepository.save(kategoris);
    return {
        status: `Success `,
        message: 'Berhasil menambah bulk Kategori',
      };
  }
}

