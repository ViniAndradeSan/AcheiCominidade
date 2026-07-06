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
import type { CreateFoundItemDto } from "./dto/create-found_item.dto";
import type { UpdateFoundItemDto } from "./dto/update-found_item.dto";
import { FoundItemsService } from "./found_items.service";

@Controller("found-items")
export class FoundItemsController {
	constructor(
		@Inject(FoundItemsService)
		private readonly foundItemsService: FoundItemsService,
	) {}

	@Post()
	create(@Body() createFoundItemDto: CreateFoundItemDto) {
		return this.foundItemsService.create(createFoundItemDto);
	}

	@Get()
	findAll() {
		return this.foundItemsService.findAll();
	}

	@Get(":id")
	findOne(@Param("id", ParseUUIDPipe) id: string) {
		return this.foundItemsService.findOne(id);
	}

	@Patch(":id")
	update(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() updateFoundItemDto: UpdateFoundItemDto,
	) {
		return this.foundItemsService.update(id, updateFoundItemDto);
	}

	@Delete(":id")
	remove(@Param("id", ParseUUIDPipe) id: string) {
		return this.foundItemsService.remove(id);
	}
}
