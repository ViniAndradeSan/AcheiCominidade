import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@/generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateFoundItemDto } from "./dto/create-found_item.dto";
import type { QueryFoundItemDto } from "./dto/query-found_item.dto";
import type { UpdateFoundItemDto } from "./dto/update-found_item.dto";

@Injectable()
export class FoundItemsService {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

	async create(createFoundItemDto: CreateFoundItemDto) {
		return this.prisma.foundItem.create({
			data: createFoundItemDto,
		});
	}

	async findAll(query: QueryFoundItemDto = {}) {
		const where: Prisma.FoundItemWhereInput = {};

		if (query.status) {
			where.status = query.status;
		}

		if (query.category) {
			where.category = { slug: query.category };
		}

		if (query.search) {
			where.OR = [
				{ title: { contains: query.search } },
				{ description: { contains: query.search } },
			];
		}

		return this.prisma.foundItem.findMany({
			where,
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
