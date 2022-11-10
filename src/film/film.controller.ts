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
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor
} from "@nestjs/platform-express";
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
    @Req() req,
    @Res() res,
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; cover?: Express.Multer.File[] }
  ) {
    const dataFilm = {
      createdBy: "45df47fg74",
      title: film.title,
      desc: film.desc,
      type: film.type,
      lng: film.lng,
      country: film.country,
      created_date: Date.now().toLocaleString(),
      media: null,
      video: "",
      cover: ""
    };

    try {
      const myFilm = await this.filmS.saveFilm(dataFilm, files.video[0], res);
    } catch (err) {}
  }

  async streamFilm(id: string, @Req() req, @Res() res) {
    try {
      const stream = await this.filmS.streamFilm(id, res, req);
      return stream;
    } catch (error) {}
  }
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "video", maxCount: 1 },
      { name: "cover", maxCount: 1 }
    ])
  )
  //@UseInterceptors(AnyFilesInterceptor())
  @Post("create/serie")
  createSerie(
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    @Req() req,
    @Res() res,
    @Body() serie: SerieDto
  ) {
    try {
      const userId = "45fd4gfd";
      const dataSerie = {
        title: serie.title,
        desc: serie.desc,
        cover: serie.cover,
        lng: serie.lng,
        country: serie.country,
        type: serie.type,
        createdBy: "red",
        created_date: Date.now()
      };
      const s = this.filmS.saveSerie(dataSerie,files.video[0], res);
    } catch (err) {
      console.log(err);
    }
  }
}
