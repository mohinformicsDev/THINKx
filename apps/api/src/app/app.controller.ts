import {
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiResponseProperty,
  ApiSecurity,
} from '@nestjs/swagger';
import { Message } from '@thinkx/api-interfaces';
import { environment } from '../environments/environment';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { imageOptions } from './image-uplaod.options';
import { ImageUploadResponse } from './models/image-upload-response.model';
import { Roles } from './models/roles.decorator';
import { Role } from './models/roles.enum';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @ApiBearerAuth('JWT-auth') // This is the one that needs to match the name in main.ts
  @ApiSecurity('JWT-auth') // this is the name you set in Document builder
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getData(): Message {
    return this.appService.getData();
  }

  @Get('dashboard')
  getDashboard() {
    return this.appService.getDashboard();
  }

  @Get('image/:id')
  async getImage(@Param('id') id, @Res() res): Promise<any> {
    this.logger.log('calling image id', id);
    const url = environment.host;
    this.logger.log('Image host url : ', url);
    return res.sendFile(id, { root: './images' });
  }

  @Post('image')
  @UseInterceptors(FilesInterceptor('file', 20, imageOptions))
  uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>
  ): ImageUploadResponse {
    const url = environment.host;
    this.logger.log('Image host url : ' + url);
    if (files == undefined) {
      throw new HttpException('No files found', 402);
    }
    if (files.length < 1) {
      throw new HttpException('No files found', 402);
    }
    const imageNames = files.map((f) => `${url}/image/` + f.filename);
    this.logger.log('post image url' + imageNames);
    const response: ImageUploadResponse = {
      imageUrls: [...imageNames],
    };
    return response;
  }
}
