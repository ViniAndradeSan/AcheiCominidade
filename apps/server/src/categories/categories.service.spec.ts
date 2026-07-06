import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client";
import { CategoriesService } from "./categories.service";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";

describe("CategoriesService", () => {
	let service: CategoriesService;

	const mockPrisma = {
		itemCategory: {
			create: jest.fn(),
			findMany: jest.fn(),
			findUnique: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			count: jest.fn(),
		},
	};

	beforeEach(() => {
		service = new CategoriesService(mockPrisma as any);
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should create a category", async () => {
			const dto: CreateCategoryDto = { name: "Eletrônico", slug: "eletronico" };
			const expected = { id: "uuid", ...dto, createdAt: new Date() };

			mockPrisma.itemCategory.create.mockResolvedValue(expected);

			const result = await service.create(dto);

			expect(result).toEqual(expected);
			expect(mockPrisma.itemCategory.create).toHaveBeenCalledWith({
				data: dto,
			});
		});

		it("should throw when name already exists", async () => {
			const dto: CreateCategoryDto = { name: "Eletrônico", slug: "eletronico" };

			mockPrisma.itemCategory.create.mockRejectedValue(
				new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
					code: "P2002",
					clientVersion: "7.8.0",
				}),
			);

			await expect(service.create(dto)).rejects.toThrow(BadRequestException);
		});
	});

	describe("findAll", () => {
		it("should return paginated categories", async () => {
			const categories = [
				{ id: "1", name: "A", slug: "a", createdAt: new Date() },
				{ id: "2", name: "B", slug: "b", createdAt: new Date() },
			];

			mockPrisma.itemCategory.findMany.mockResolvedValue(categories);
			mockPrisma.itemCategory.count.mockResolvedValue(2);

			const result = await service.findAll({ page: 1, limit: 10 });

			expect(result.data).toEqual(categories);
			expect(result.meta.total).toBe(2);
			expect(result.meta.page).toBe(1);
			expect(result.meta.limit).toBe(10);
		});
	});

	describe("findOne", () => {
		it("should return a category by id", async () => {
			const expected = {
				id: "uuid",
				name: "Eletrônico",
				slug: "eletronico",
				createdAt: new Date(),
			};

			mockPrisma.itemCategory.findUnique.mockResolvedValue(expected);

			const result = await service.findOne("uuid");

			expect(result).toEqual(expected);
		});

		it("should throw NotFoundException when category not found", async () => {
			mockPrisma.itemCategory.findUnique.mockResolvedValue(null);

			await expect(service.findOne("nonexistent")).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("update", () => {
		it("should update a category", async () => {
			const dto: UpdateCategoryDto = { name: "Novo Nome" };
			const existing = {
				id: "uuid",
				name: "Antigo",
				slug: "antigo",
				createdAt: new Date(),
			};
			const updated = { ...existing, ...dto };

			mockPrisma.itemCategory.findUnique.mockResolvedValue(existing);
			mockPrisma.itemCategory.update.mockResolvedValue(updated);

			const result = await service.update("uuid", dto);

			expect(result).toEqual(updated);
			expect(mockPrisma.itemCategory.update).toHaveBeenCalledWith({
				where: { id: "uuid" },
				data: dto,
			});
		});

		it("should throw NotFoundException when updating non-existent category", async () => {
			mockPrisma.itemCategory.findUnique.mockResolvedValue(null);

			await expect(
				service.update("nonexistent", { name: "Novo" }),
			).rejects.toThrow(NotFoundException);
		});

		it("should throw BadRequestException on unique constraint violation", async () => {
			const dto = { name: "Eletrônico" };
			const existing = {
				id: "uuid",
				name: "Antigo",
				slug: "antigo",
				createdAt: new Date(),
			};

			mockPrisma.itemCategory.findUnique.mockResolvedValue(existing);
			mockPrisma.itemCategory.update.mockRejectedValue(
				new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
					code: "P2002",
					clientVersion: "7.8.0",
				}),
			);

			await expect(service.update("uuid", dto)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("remove", () => {
		it("should delete a category", async () => {
			const existing = {
				id: "uuid",
				name: "Eletrônico",
				slug: "eletronico",
				createdAt: new Date(),
			};

			mockPrisma.itemCategory.findUnique.mockResolvedValue(existing);
			mockPrisma.itemCategory.delete.mockResolvedValue(existing);

			await service.remove("uuid");

			expect(mockPrisma.itemCategory.delete).toHaveBeenCalledWith({
				where: { id: "uuid" },
			});
		});

		it("should throw NotFoundException when deleting non-existent category", async () => {
			mockPrisma.itemCategory.findUnique.mockResolvedValue(null);

			await expect(service.remove("nonexistent")).rejects.toThrow(
				NotFoundException,
			);
		});
	});
});
