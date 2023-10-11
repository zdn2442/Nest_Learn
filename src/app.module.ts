import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthController } from './app/auth/auth.controller';
import { AuthService } from './app/auth/auth.service';
import { AuthModule } from './app/auth/auth.module';
import { MailService } from './app/mail/mail.service';
import { MailModule } from './app/mail/mail.module';
import { KategoriModule } from './app/kategori/kategori.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), BookModule, AuthModule, KategoriModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
