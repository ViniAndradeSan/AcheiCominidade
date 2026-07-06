import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FoundItemsModule } from "./found_items/found_items.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
	imports: [PrismaModule, FoundItemsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
