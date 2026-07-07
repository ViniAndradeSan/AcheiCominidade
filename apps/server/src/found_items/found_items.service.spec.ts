import { NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateFoundItemDto } from "./dto/create-found_item.dto";
import type { UpdateFoundItemDto } from "./dto/update-found_item.dto";
import { FoundItemsService } from "./found_items.service";

describe("FoundItemsService", () => {
	let service: FoundItemsService;

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

	const mockFoundItemWithCategory = {
		...mockFoundItem,
		category: {
			id: "660e8400-e29b-41d4-a716-446655440001",
			name: "Eletrônico",
			slug: "eletronico",
			createdAt: mockDate,
		},
	};

	const mockPrisma = {
		foundItem: {
			create: jest.fn(),
			findMany: jest.fn(),
			findUnique: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FoundItemsService,
				{ provide: PrismaService, useValue: mockPrisma },
			],
		}).compile();

		service = module.get<FoundItemsService>(FoundItemsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should create a found item", async () => {
			const dto: CreateFoundItemDto = {
				title: "Carteira preta",
				description: "Carteira encontrada perto da biblioteca.",
				categoryId: "660e8400-e29b-41d4-a716-446655440001",
				photoUrl: "https://storage.exemplo.com/fotos/carteira.jpg",
				foundLocationText: "Biblioteca central",
				foundLatitude: -10.9472,
				foundLongitude: -37.0731,
			};

			mockPrisma.foundItem.create.mockResolvedValue(mockFoundItem);

			const result = await service.create(dto);

			expect(result).toEqual(mockFoundItem);
			expect(mockPrisma.foundItem.create).toHaveBeenCalledWith({
				data: dto,
			});
		});
	});

	describe("findAll", () => {
		it("should return all found items with category included", async () => {
			mockPrisma.foundItem.findMany.mockResolvedValue([
				mockFoundItemWithCategory,
			]);

			const result = await service.findAll();

			expect(result).toEqual([mockFoundItemWithCategory]);
			expect(mockPrisma.foundItem.findMany).toHaveBeenCalledWith({
				where: {},
				include: { category: true },
				orderBy: { foundAt: "desc" },
			});
		});

		it("should filter by status", async () => {
			mockPrisma.foundItem.findMany.mockResolvedValue([
				mockFoundItemWithCategory,
			]);

			await service.findAll({ status: "disponivel" });

			expect(mockPrisma.foundItem.findMany).toHaveBeenCalledWith({
				where: { status: "disponivel" },
				include: { category: true },
				orderBy: { foundAt: "desc" },
			});
		});

		it("should filter by category slug", async () => {
			mockPrisma.foundItem.findMany.mockResolvedValue([
				mockFoundItemWithCategory,
			]);

			await service.findAll({ category: "eletronico" });

			expect(mockPrisma.foundItem.findMany).toHaveBeenCalledWith({
				where: { category: { slug: "eletronico" } },
				include: { category: true },
				orderBy: { foundAt: "desc" },
			});
		});

		it("should search by title or description", async () => {
			mockPrisma.foundItem.findMany.mockResolvedValue([
				mockFoundItemWithCategory,
			]);

			await service.findAll({ search: "carteira" });

			expect(mockPrisma.foundItem.findMany).toHaveBeenCalledWith({
				where: {
					OR: [
						{ title: { contains: "carteira" } },
						{ description: { contains: "carteira" } },
					],
				},
				include: { category: true },
				orderBy: { foundAt: "desc" },
			});
		});

		it("should combine status and category filters", async () => {
			mockPrisma.foundItem.findMany.mockResolvedValue([
				mockFoundItemWithCategory,
			]);

			await service.findAll({ status: "disponivel", category: "eletronico" });

			expect(mockPrisma.foundItem.findMany).toHaveBeenCalledWith({
				where: {
					status: "disponivel",
					category: { slug: "eletronico" },
				},
				include: { category: true },
				orderBy: { foundAt: "desc" },
			});
		});
	});

	describe("findOne", () => {
		it("should return a found item by id", async () => {
			mockPrisma.foundItem.findUnique.mockResolvedValue(
				mockFoundItemWithCategory,
			);

			const result = await service.findOne(mockFoundItem.id);

			expect(result).toEqual(mockFoundItemWithCategory);
			expect(mockPrisma.foundItem.findUnique).toHaveBeenCalledWith({
				where: { id: mockFoundItem.id },
				include: { category: true },
			});
		});

		it("should throw NotFoundException when item not found", async () => {
			mockPrisma.foundItem.findUnique.mockResolvedValue(null);

			await expect(service.findOne("non-existent-id")).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("update", () => {
		it("should update a found item", async () => {
			const dto: UpdateFoundItemDto = { title: "Carteira marrom atualizada" };

			mockPrisma.foundItem.findUnique.mockResolvedValue(mockFoundItem);
			mockPrisma.foundItem.update.mockResolvedValue({
				...mockFoundItem,
				title: "Carteira marrom atualizada",
			});

			const result = await service.update(mockFoundItem.id, dto);

			expect(result.title).toBe("Carteira marrom atualizada");
			expect(mockPrisma.foundItem.update).toHaveBeenCalledWith({
				where: { id: mockFoundItem.id },
				data: dto,
			});
		});

		it("should throw NotFoundException when updating non-existent item", async () => {
			mockPrisma.foundItem.findUnique.mockResolvedValue(null);

			await expect(
				service.update("non-existent-id", { title: "test" }),
			).rejects.toThrow(NotFoundException);

			expect(mockPrisma.foundItem.update).not.toHaveBeenCalled();
		});
	});

	describe("remove", () => {
		it("should remove a found item", async () => {
			mockPrisma.foundItem.findUnique.mockResolvedValue(mockFoundItem);
			mockPrisma.foundItem.delete.mockResolvedValue(mockFoundItem);

			const result = await service.remove(mockFoundItem.id);

			expect(result).toEqual(mockFoundItem);
			expect(mockPrisma.foundItem.delete).toHaveBeenCalledWith({
				where: { id: mockFoundItem.id },
			});
		});

		it("should throw NotFoundException when removing non-existent item", async () => {
			mockPrisma.foundItem.findUnique.mockResolvedValue(null);

			await expect(service.remove("non-existent-id")).rejects.toThrow(
				NotFoundException,
			);

			expect(mockPrisma.foundItem.delete).not.toHaveBeenCalled();
		});
	});
});
