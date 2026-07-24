import { Module } from "@nestjs/common";
import { ItemReturnsController } from "./item_returns.controller";
import { ItemReturnsService } from "./item_returns.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [ItemReturnsController],
	providers: [ItemReturnsService],
})
export class ItemReturnsModule {}
