import { Module } from "@nestjs/common";
import { FoundItemsController } from "./found_items.controller";
import { FoundItemsService } from "./found_items.service";

@Module({
	controllers: [FoundItemsController],
	providers: [FoundItemsService],
})
export class FoundItemsModule {}
