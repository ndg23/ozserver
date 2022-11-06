import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Request, Response } from "express";
import { createReadStream, statSync } from "fs";
import { Model } from "mongoose";
import { join } from "path";
import { Ifilm } from "./Interface/interface.films";
import { Iserie } from "./Interface/interface.serie";
import { SerieDto } from "./Dto/serie.dto";
import { Iepisode } from "../film/Interface/interface.episode";

@Injectable()
export class FilmService {
  constructor(
    @InjectModel("Film") private film: Model<Ifilm>,
    @InjectModel("Episode") private epi: Model<Iepisode>,
    @InjectModel("Serie") private serie: Model<Iserie>
  ) {}
  updateFilm(id: string, data: any) {
    this.film.findByIdAndUpdate(id, { $set: data }).then((res) => {
      return res;
    });
  }
  async uploadFilm(data: Ifilm) {
    const f = new this.film(data);
    return f.save();
  }

  async streamFilm(id: string, response: Response, request: Request) {
    try {
      const data = await this.film.findOne({ _id: id });
      if (!data) {
        throw new NotFoundException(null, "VideoNotFound");
      }
      //get range for send by step to clent
      const { range } = request.headers;
      if (range) {
        const { video } = data;
        const videoPath = statSync(
          join(process.cwd(), `./public/${video}`)
        );
        const CHUNK_SIZE = 1 * 1e6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoPath.size - 1);
        const videoLength = end - start + 1;
        response.status(206);
        response.header({
          "Content-Range": `bytes ${start}-${end}/${videoPath.size}`,
          "Accept-Ranges": "bytes",
          "Content-length": videoLength,
          "Content-Type": "video/mp4"
        });
        const vidoeStream = createReadStream(
          join(process.cwd(), `./public/${video}`),
          { start, end }
        );
        vidoeStream.pipe(response);
      } else {
        throw new NotFoundException(null, "range not found");
      }
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException();
    }
  }

  removeFilm(userId: string, filmId: string) {
    this.film
      .findByIdAndRemove(filmId)
      .where({ createdBy: userId })
      .then((res) => {
        return res;
      });
  }
  watchSerie() {}
  updateSerie() {}
  async uploadSerie(userId: string, serie: SerieDto, req: Request) {
    console.log(req.files['cover']. originalname);
    
    //get episode from serie form
    const { Epidesc, Epititle } = serie;
    //build a object epi
    const objetEpi = {
      title: Epititle,
      desc: Epidesc,
      video: req.files['video']?.originalname
    };
    //retrieve an episode
    const createEpi = await this.epi.create(objetEpi);
    //save serie
    const new_serie = new this.serie({
      ...serie,
      createdBy: userId,
      episodeId: [createEpi._id]
    });
   await new_serie.save();
  }

  async addEpisode(idSerie: string, data: any, req: Request) {
    const episode = {
      title: data.Epititle,
      desc: data?.Epitdesc,
      video: req.file.originalname
    };
    const episodeCreate =await this.epi.create(episode);
    this.serie
      .findOneAndUpdate(
        { _id: idSerie, $addToSet: { episodeId: episodeCreate._id } },
        { new: true }
      )
      .then((res) => {
        return res;
      });
  }
  removeSerie() {}
}
