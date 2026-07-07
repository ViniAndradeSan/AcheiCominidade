import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateItemReturnDto } from "./dto/create-item_return.dto";
import type { UpdateItemReturnDto } from "./dto/update-item_return.dto";
import { ItemReturnsService } from "./item_returns.service";

describe("ItemReturnsService", () => {
	let service: ItemReturnsService;

	const mockDate = new Date("2025-01-01T00:00:00Z");

	const mockFoundItem = {
		id: "550e8400-e29b-41d4-a716-446655440000",
		title: "Carteira preta",
		description: "Carteira encontrada perto da biblioteca.",
		categoryId: "660e8400-e29b-41d4-a716-446655440001",
		status: "disponivel",
		photoUrl: "https://storage.exemplo.com/fotos/carteira.jpg",
		foundLocationText: "Biblioteca central",
		foundLatitude: -10.9472,
		foundLongitude: -37.0731,
		foundAt: mockDate,
		createdAt: mockDate,
		updatedAt: mockDate,
	};

	const mockItemReturn = {
		id: "770e8400-e29b-41d4-a716-446655440002",
		itemId: mockFoundItem.id,
		returnedAt: mockDate,
		observation: "Item retirado pelo aluno após confirmação.",
		createdAt: mockDate,
	};

	const mockItemReturnWithItem = {
		...mockItemReturn,
		item: mockFoundItem,
	};

	const mockPrisma = {
		itemReturn: {
			create: jest.fn(),
			findMany: jest.fn(),
			findUnique: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
		foundItem: {
			findUnique: jest.fn(),
			update: jest.fn(),
		},
		$transaction: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ItemReturnsService,
				{ provide: PrismaService, useValue: mockPrisma },
			],
		}).compile();

		service = module.get<ItemReturnsService>(ItemReturnsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should create an item return and mark the item as devolvido", async () => {
			const dto: CreateItemReturnDto = {
				itemId: mockFoundItem.id,
				observation: "Item retirado pelo aluno após confirmação.",
			};

			mockPrisma.foundItem.findUnique.mockResolvedValue(mockFoundItem);
			mockPrisma.$transaction.mockResolvedValue([
				mockItemReturn,
				{ ...mockFoundItem, status: "devolvido" },
			]);

			const result = await service.create(dto);

			expect(result).toEqual(mockItemReturn);
			expect(mockPrisma.foundItem.findUnique).toHaveBeenCalledWith({
				where: { id: dto.itemId },
			});
			expect(mockPrisma.itemReturn.create).toHaveBeenCalledWith({
				data: dto,
			});
			expect(mockPrisma.foundItem.update).toHaveBeenCalledWith({
				where: { id: dto.itemId },
				data: { status: "devolvido" },
			});
			expect(mockPrisma.$transaction).toHaveBeenCalled();
		});

		it("should throw NotFoundException when the found item does not exist", async () => {
			mockPrisma.foundItem.findUnique.mockResolvedValue(null);

			await expect(
				service.create({ itemId: "non-existent-id" }),
			).rejects.toThrow(NotFoundException);

			expect(mockPrisma.$transaction).not.toHaveBeenCalled();
		});

		it("should throw ConflictException when the item has already been returned", async () => {
			mockPrisma.foundItem.findUnique.mockResolvedValue({
				...mockFoundItem,
				status: "devolvido",
			});

			await expect(
				service.create({ itemId: mockFoundItem.id }),
			).rejects.toThrow(ConflictException);

			expect(mockPrisma.$transaction).not.toHaveBeenCalled();
		});
	});

	describe("findAll", () => {
		it("should return all item returns with item included", async () => {
			mockPrisma.itemReturn.findMany.mockResolvedValue([
				mockItemReturnWithItem,
			]);

			const result = await service.findAll();

			expect(result).toEqual([mockItemReturnWithItem]);
			expect(mockPrisma.itemReturn.findMany).toHaveBeenCalledWith({
				include: { item: true },
				orderBy: { returnedAt: "desc" },
			});
		});
	});

	describe("findOne", () => {
		it("should return an item return by id", async () => {
			mockPrisma.itemReturn.findUnique.mockResolvedValue(
				mockItemReturnWithItem,
			);

			const result = await service.findOne(mockItemReturn.id);

			expect(result).toEqual(mockItemReturnWithItem);
			expect(mockPrisma.itemReturn.findUnique).toHaveBeenCalledWith({
				where: { id: mockItemReturn.id },
				include: { item: true },
			});
		});

		it("should throw NotFoundException when item return not found", async () => {
			mockPrisma.itemReturn.findUnique.mockResolvedValue(null);

			await expect(service.findOne("non-existent-id")).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("update", () => {
		it("should update an item return", async () => {
			const dto: UpdateItemReturnDto = { observation: "Observação atualizada" };

			mockPrisma.itemReturn.findUnique.mockResolvedValue(mockItemReturn);
			mockPrisma.itemReturn.update.mockResolvedValue({
				...mockItemReturn,
				observation: "Observação atualizada",
			});

			const result = await service.update(mockItemReturn.id, dto);

			expect(result.observation).toBe("Observação atualizada");
			expect(mockPrisma.itemReturn.update).toHaveBeenCalledWith({
				where: { id: mockItemReturn.id },
				data: dto,
			});
		});

		it("should throw NotFoundException when updating non-existent item return", async () => {
			mockPrisma.itemReturn.findUnique.mockResolvedValue(null);

			await expect(
				service.update("non-existent-id", { observation: "test" }),
			).rejects.toThrow(NotFoundException);

			expect(mockPrisma.itemReturn.update).not.toHaveBeenCalled();
		});
	});

	describe("remove", () => {
		it("should remove an item return and revert the item to disponivel", async () => {
			mockPrisma.itemReturn.findUnique.mockResolvedValue(
				mockItemReturnWithItem,
			);
			mockPrisma.$transaction.mockResolvedValue([
				mockItemReturn,
				{ ...mockFoundItem, status: "disponivel" },
			]);

			const result = await service.remove(mockItemReturn.id);

			expect(result).toEqual(mockItemReturn);
			expect(mockPrisma.itemReturn.delete).toHaveBeenCalledWith({
				where: { id: mockItemReturn.id },
			});
			expect(mockPrisma.foundItem.update).toHaveBeenCalledWith({
				where: { id: mockItemReturn.itemId },
				data: { status: "disponivel" },
			});
			expect(mockPrisma.$transaction).toHaveBeenCalled();
		});

		it("should throw NotFoundException when removing non-existent item return", async () => {
			mockPrisma.itemReturn.findUnique.mockResolvedValue(null);

			await expect(service.remove("non-existent-id")).rejects.toThrow(
				NotFoundException,
			);

			expect(mockPrisma.$transaction).not.toHaveBeenCalled();
		});
	});
});
