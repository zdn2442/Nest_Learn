import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { CreateBulkKategoriDto, CreateKategoriDto, UpdateKategoriDto, findAllKategori } from './kategori.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator'; //import disini
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';

@UseGuards(JwtGuard)
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKategoriDto) { //ganti @Body() dengan @InjectCreatedBy()
    return this.kategoriService.create(payload);
  }

  @Post('createBulk')
  async createBulk(@InjectCreatedBy() createCategoryDtos: CreateKategoriDto[]) {
    return this.kategoriService.createBulk(createCategoryDtos);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    return this.kategoriService.getAllCategory(query);
  }

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.kategoriService.getDetail(Number(id));
  }

  @Put('update/:id')
  updateKategori(@Param('id') id: string, @InjectUpdatedBy() updateKategoriDto: UpdateKategoriDto) {
    return this.kategoriService.updateKategori(Number(id), updateKategoriDto);
  }

  @Delete('delete/:id')
  deleteKategori(@Param('id') id: string) {
    return this.kategoriService.deleteKategori(+id);
  }
}
