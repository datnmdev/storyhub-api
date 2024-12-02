import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});
	app.setGlobalPrefix('api/v1', { exclude: [''] });
	app.useGlobalPipes(new ValidationPipe());
	
  //config cors
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
