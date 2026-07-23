import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger(bootstrap.name);
	const portEnv = process.env.PORT ?? "";
	const parsedPort = Number.parseInt(portEnv, 10);
	const PORT =
		Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000;

	if (portEnv && String(PORT) !== portEnv) {
		logger.warn(`Invalid PORT value "${portEnv}". Falling back to ${PORT}.`);
	}

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
