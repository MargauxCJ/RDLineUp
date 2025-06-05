import {Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import {map, Observable} from 'rxjs';
import {ClubService} from '../services/club.service';
import {CreateClubDto} from '../entity/dto/create-club.dto';
import {ClubEntity} from '../entity/club.entity';
import {UpdateClubDto} from '../entity/dto/update-club.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {uploadConfig} from '../../common/utils/upload.utils';

@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  create(@Body() dto: CreateClubDto): Observable<ClubEntity> {
    return this.clubService.create(dto);
  }

  @Get()
  findAll(): Observable<ClubEntity[]> {
    return this.clubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<ClubEntity> {
    return this.clubService.findOneByField('id', +id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Observable<any> {
    return this.clubService.deleteOneByField('id', +id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateClubDto: UpdateClubDto,
  ): Observable<any> {
    return this.clubService.updateOneByField('id', id, updateClubDto);
  }

  @Post('upload/:clubId')
  @UseInterceptors(FileInterceptor('file', uploadConfig('clubs/profile-image')))
  uploadImgProfile(
    @Param('clubId') clubId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Observable<{ imgProfile: string }> {
    return this.clubService
      .updateOneByField('id', Number(clubId), { imgProfile: file.filename })
      .pipe(
        map(() => ({
          imgProfile: file.filename,
        })),
      );
  }
}
