import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateItemReturnDto } from "./dto/create-item_return.dto";
import type { UpdateItemReturnDto } from "./dto/update-item_return.dto";

@Injectable()
export class ItemReturnsService {
	constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

	async create(createItemReturnDto: CreateItemReturnDto) {
		const { itemId } = createItemReturnDto;

		const item = await this.prisma.foundItem.findUnique({
			where: { id: itemId },
		});

		if (!item) {
			throw new NotFoundException(`Found item with id "${itemId}" not found`);
		}

		if (item.status === "devolvido") {
			throw new ConflictException(
				`Found item with id "${itemId}" has already been returned`,
			);
		}

		const [itemReturn] = await this.prisma.$transaction([
			this.prisma.itemReturn.create({
				data: createItemReturnDto,
			}),
			this.prisma.foundItem.update({
				where: { id: itemId },
				data: { status: "devolvido" },
			}),
		]);

		return itemReturn;
	}

	async findAll() {
		return this.prisma.itemReturn.findMany({
			include: { item: true },
			orderBy: { returnedAt: "desc" },
		});
	}

	async findOne(id: string) {
		const itemReturn = await this.prisma.itemReturn.findUnique({
			where: { id },
			include: { item: true },
		});

		if (!itemReturn) {
			throw new NotFoundException(`Item return with id "${id}" not found`);
		}

		return itemReturn;
	}

	async update(id: string, updateItemReturnDto: UpdateItemReturnDto) {
		await this.findOne(id);

		return this.prisma.itemReturn.update({
			where: { id },
			data: updateItemReturnDto,
		});
	}

	async remove(id: string) {
		const itemReturn = await this.findOne(id);

		const [removed] = await this.prisma.$transaction([
			this.prisma.itemReturn.delete({
				where: { id },
			}),
			this.prisma.foundItem.update({
				where: { id: itemReturn.itemId },
				data: { status: "disponivel" },
			}),
		]);

		return removed;
	}
}
