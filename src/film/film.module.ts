import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FilmSchema } from "./Models/Film";
import { Episode } from "./Models/Episode";
import { FilmService } from './film';
import { FilmController } from './film.controller';
import { SerieSchema } from './Models/Serie';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Serie", schema: SerieSchema }]),
    MongooseModule.forFeature([{ name: "Film", schema: FilmSchema }]),
    MongooseModule.forFeature([{ name: "Episode", schema: Episode }])

  ],
  controllers: [FilmController],
  providers: [FilmService]
})
export class FilmModule {}
