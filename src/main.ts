import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { port } from "./common/constants/index";
import { ConfigService } from "@nestjs/config";
import { config } from "aws-sdk";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  app.enableCors();
  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY"),
    region: configService.get("AWS_REGION")
  });
  const ports = port || 2002;
  await app.listen(ports, () => {
    console.log(`Server is running at PORT: ${ports} `);
  });
}
bootstrap();
