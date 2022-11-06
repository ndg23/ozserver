import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { FilmModule } from "./film/film.module";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { FilmSchema } from "./film/Models/Film";
import { extname } from "path";
import { ConfigModule } from '@nestjs/config';

import { SerieSchema } from "./film/Models/Serie";
import { UserSchema } from "./user/Model/User";
import { AuthMiddleware } from "./common/middleware/checkAuth";
import config from "./common/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    UserModule,
    FilmModule,
    AuthModule,
    MongooseModule.forFeature([{ name: "Film", schema: FilmSchema }]),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    MongooseModule.forFeature([{ name: "Serie", schema: SerieSchema }]),
    MongooseModule.forRoot(
      `mongodb+srv://Ndg:antoine19@ndgcl.dgwur.mongodb.net/oz?retryWrites=true&w=majority`
    ),
    MulterModule.register({
      storage: diskStorage({
        destination: "./media"
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "/auth/signin", method: RequestMethod.POST },
        { path: "/user/signup", method: RequestMethod.POST },
        { path: "/signup", method: RequestMethod.POST },
        { path: "/seeds/entityTypes", method: RequestMethod.GET },
        { path: "/seeds/entities", method: RequestMethod.GET }
      )
      .forRoutes({
        path: "*",
        method: RequestMethod.GET
      });
  }
}
