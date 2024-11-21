import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});
	app.setGlobalPrefix('api/v1');
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors({
		origin: 'http://localhost:5173',
	});
	await app.listen(process.env.PORT);
}
bootstrap();
