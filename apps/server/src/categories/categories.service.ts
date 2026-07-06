import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@/generated/prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

	async create(dto: CreateCategoryDto) {
		try {
			return await this.prisma.itemCategory.create({ data: dto });
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new BadRequestException("Category name or slug already exists");
			}
			throw error;
		}
	}

	async findAll(params: { page?: number; limit?: number }) {
		const page = params.page ?? 1;
		const limit = params.limit ?? 10;
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			this.prisma.itemCategory.findMany({
				skip,
				take: limit,
				orderBy: { name: "asc" },
			}),
			this.prisma.itemCategory.count(),
		]);

		return {
			data,
			meta: { total, page, limit },
		};
	}

	async findOne(id: string) {
		const category = await this.prisma.itemCategory.findUnique({
			where: { id },
		});

		if (!category) {
			throw new NotFoundException(`Category #${id} not found`);
		}

		return category;
	}

	async update(id: string, dto: UpdateCategoryDto) {
		await this.findOne(id);

		try {
			return await this.prisma.itemCategory.update({
				where: { id },
				data: dto,
			});
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new BadRequestException("Category name or slug already exists");
			}
			throw error;
		}
	}

	async remove(id: string) {
		await this.findOne(id);

		await this.prisma.itemCategory.delete({ where: { id } });
	}
}
