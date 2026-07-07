import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from "@nestjs/common";
import type { CreateItemReturnDto } from "./dto/create-item_return.dto";
import type { UpdateItemReturnDto } from "./dto/update-item_return.dto";
import { ItemReturnsService } from "./item_returns.service";

@Controller("item-returns")
export class ItemReturnsController {
	constructor(
		@Inject(ItemReturnsService)
		private readonly itemReturnsService: ItemReturnsService,
	) {}

	@Post()
	create(@Body() createItemReturnDto: CreateItemReturnDto) {
		return this.itemReturnsService.create(createItemReturnDto);
	}

	@Get()
	findAll() {
		return this.itemReturnsService.findAll();
	}

	@Get(":id")
	findOne(@Param("id", ParseUUIDPipe) id: string) {
		return this.itemReturnsService.findOne(id);
	}

	@Patch(":id")
	update(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() updateItemReturnDto: UpdateItemReturnDto,
	) {
		return this.itemReturnsService.update(id, updateItemReturnDto);
	}

	@Delete(":id")
	remove(@Param("id", ParseUUIDPipe) id: string) {
		return this.itemReturnsService.remove(id);
	}
}
