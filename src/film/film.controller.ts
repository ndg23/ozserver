import {
  Controller,
  Post,
  UploadedFiles,
  Body,
  UseInterceptors,
  Req,
  Res,
  HttpStatus
} from "@nestjs/common";
import { AnyFilesInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { Express, Request, Response } from "express";
import { FilmDto } from "./Dto/film.dto";
import { FilmService } from "./film";
import { SerieDto } from "./Dto/serie.dto";
@Controller("media")
export class FilmController {
  constructor(private readonly filmS: FilmService) {}
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "video", maxCount: 1 },
      { name: "cover", maxCount: 1 }
    ])
  )
  @Post("create/film")
  async createFilm(
    @Body() film: FilmDto,
    @Req() req: Request,
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; cover?: Express.Multer.File[] }
  ) {
    const dataFilm = {
      createdBy: req["user"]._id,
      title: film.title,
      desc: film.desc,
      type: film.type,
      lng: film.lng,
      country: film.country,
      created_date: Date.now() + "",
      video: files.video[0].filename,
      cover: files.cover[0].filename
    };
    try {
      const myFilm = await this.filmS.uploadFilm(dataFilm);
    } catch (err) {}
  }

  async streamFilm(id: string, @Req() req, @Res() res) {
    try {
      const stream = await this.filmS.streamFilm(id, res, req);
      return stream;
    } catch (error) {}
  }
  /*@UseInterceptors(
    FileFieldsInterceptor([
      { name: "video", maxCount: 1 },
      { name: "cover", maxCount: 1 }
    ])
  )*/
  @UseInterceptors(AnyFilesInterceptor())

  @Post("create/serie")
  createSerie(
    @UploadedFiles()
    files: Express.Multer.File
    ,
    @Req() req,
    @Res() res,
    @Body() serie: SerieDto
  ) {
    try {
      console.log(files);
      
      const userId = "45fd4gfd";
      const s = this.filmS.uploadSerie(userId, serie, req);
      return res.status(HttpStatus.OK).json(s);
    } catch (err) {
      console.log(err);
    }
  }
}
