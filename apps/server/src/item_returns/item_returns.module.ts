import { Module } from "@nestjs/common";
import { ItemReturnsController } from "./item_returns.controller";
import { ItemReturnsService } from "./item_returns.service";

@Module({
	controllers: [ItemReturnsController],
	providers: [ItemReturnsService],
})
export class ItemReturnsModule {}
