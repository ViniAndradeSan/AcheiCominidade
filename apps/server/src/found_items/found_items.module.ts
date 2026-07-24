import { Module } from "@nestjs/common";
import { FoundItemsController } from "./found_items.controller";
import { FoundItemsService } from "./found_items.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [FoundItemsController],
	providers: [FoundItemsService],
})
export class FoundItemsModule {}
