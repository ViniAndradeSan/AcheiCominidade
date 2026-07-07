import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger(bootstrap.name);
	const PORT = process.env.PORT ?? 3000;

	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

	await app.listen(PORT, () => {
		logger.log(`Server is listening at port ${PORT}`);
		logger.log(`Current environment is: ${process.env.NODE_ENV}`);
	});
}

bootstrap().catch((error) => {
	new Logger("bootstrap").error("Failed to start server", error);
	process.exit(1);
});
