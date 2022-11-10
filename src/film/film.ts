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

import * as aws from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { v4 as uuid } from "uuid";
import { FilmDto } from "./Dto/film.dto";
import { HttpStatus } from "@nestjs/common";

@Injectable()
export class FilmService {
  constructor(
    private configService: ConfigService,
    @InjectModel("Film") private film: Model<Ifilm>,
    @InjectModel("Episode") private epi: Model<Iepisode>,
    @InjectModel("Serie") private serie: Model<Iserie>
  ) {}
  updateFilm(id: string, data: any) {
    this.film.findByIdAndUpdate(id, { $set: data }).then((res) => {
      return res;
    });
  }
  async uploadMedia(dataBuffer: Buffer, filename: string) {
    const s3 = new aws.S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get("AWS_PUBLIC_BUCKET_NAME"),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`
      })
      .promise();

    return uploadResult;
  }
  async saveFilm(film: FilmDto, media: any, res) {
    const { originalname, buffer } = media;

    try {
      const upload = await this.uploadMedia(buffer, originalname);
      const media = {
        url: upload.Location,
        key: upload.Key
      };
      const dataToset = {
        media,
        film
      };
      Object.assign(film, media);
      const f = new this.film({ ...film, media });

      f.save(async (err, data) => {
        if (err) {
          const s3 = new aws.S3();
          await s3
            .deleteObject({
              Bucket: this.configService.get("AWS_PUBLIC_BUCKET_NAME"),
              Key: upload.Key
            })
            .promise();
          return res.status(HttpStatus.NOT_MODIFIED).json("Film error upload");
        }
        console.log(data);

        return res.status(HttpStatus.OK).json("Film uploaded");
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async saveSerie(serie: any, media: any, res) {
    const { originalname, buffer } = media;
    const { epititle, epidesc } = serie;
    try {
      const upload = await this.uploadMedia(buffer, originalname);
      const media = {
        url: upload.Location,
        key: upload.Key
      };
      const episode = {
        title: epititle,
        desc: epidesc,
        url: media.url,
        key: media.key
      };
      const f = new this.serie(serie);
      f.episode.push(episode);
      console.log(f);

      f.save(async (err, data) => {
        if (err) {
          const s3 = new aws.S3();
          await s3
            .deleteObject({
              Bucket: this.configService.get("AWS_PUBLIC_BUCKET_NAME"),
              Key: upload.Key
            })
            .promise();
          return res.status(HttpStatus.NOT_MODIFIED).json("Serie error upload");
        }
        console.log(data);

        return res.status(HttpStatus.OK).json("Serie uploaded");
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
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
        const videoPath = statSync(join(process.cwd(), `./public/${video}`));
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

  async uploadSerie(userId: string, serie: any, req: any, video: any) {
    //get episode from serie form
    const { epidesc, epititle } = serie;

    //build a object epi
    const objetEpi = {
      title: epititle,
      desc: epidesc
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
    const episodeCreate = await this.epi.create(episode);
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
