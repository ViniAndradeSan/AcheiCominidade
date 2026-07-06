import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateFoundItemDto } from "./dto/create-found_item.dto";
import type { UpdateFoundItemDto } from "./dto/update-found_item.dto";

@Injectable()
export class FoundItemsService {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

	async create(createFoundItemDto: CreateFoundItemDto) {
		return this.prisma.foundItem.create({
			data: createFoundItemDto,
		});
	}

	async findAll() {
		return this.prisma.foundItem.findMany({
			include: { category: true },
			orderBy: { foundAt: "desc" },
		});
	}

	async findOne(id: string) {
		const item = await this.prisma.foundItem.findUnique({
			where: { id },
			include: { category: true },
		});

		if (!item) {
			throw new NotFoundException(`Found item with id "${id}" not found`);
		}

		return item;
	}

	async update(id: string, updateFoundItemDto: UpdateFoundItemDto) {
		await this.findOne(id);

		return this.prisma.foundItem.update({
			where: { id },
			data: updateFoundItemDto,
		});
	}

	async remove(id: string) {
		await this.findOne(id);

		return this.prisma.foundItem.delete({
			where: { id },
		});
	}
}
