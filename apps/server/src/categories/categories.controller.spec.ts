import { Test, type TestingModule } from "@nestjs/testing";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";

describe("CategoriesController", () => {
	let controller: CategoriesController;

	const mockService = {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoriesController],
			providers: [{ provide: CategoriesService, useValue: mockService }],
		}).compile();

		controller = module.get<CategoriesController>(CategoriesController);

		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("create", () => {
		it("should call service.create with dto", async () => {
			const dto: CreateCategoryDto = { name: "Teste", slug: "teste" };
			const expected = { id: "uuid", ...dto, createdAt: new Date() };

			mockService.create.mockResolvedValue(expected);

			const result = await controller.create(dto);

			expect(result).toEqual(expected);
			expect(mockService.create).toHaveBeenCalledWith(dto);
		});
	});

	describe("findAll", () => {
		it("should return paginated categories", async () => {
			const expected = {
				data: [],
				meta: { total: 0, page: 1, limit: 10 },
			};

			mockService.findAll.mockResolvedValue(expected);

			const result = await controller.findAll("1", "10");

			expect(result).toEqual(expected);
			expect(mockService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
		});

		it("should use default pagination when no query params", async () => {
			const expected = {
				data: [],
				meta: { total: 0, page: 1, limit: 10 },
			};

			mockService.findAll.mockResolvedValue(expected);

			await controller.findAll();

			expect(mockService.findAll).toHaveBeenCalledWith({
				page: undefined,
				limit: undefined,
			});
		});
	});

	describe("findOne", () => {
		it("should return a category by id", async () => {
			const expected = {
				id: "uuid",
				name: "Teste",
				slug: "teste",
				createdAt: new Date(),
			};

			mockService.findOne.mockResolvedValue(expected);

			const result = await controller.findOne("uuid");

			expect(result).toEqual(expected);
			expect(mockService.findOne).toHaveBeenCalledWith("uuid");
		});
	});

	describe("update", () => {
		it("should update a category", async () => {
			const dto: UpdateCategoryDto = { name: "Atualizado" };
			const expected = {
				id: "uuid",
				name: "Atualizado",
				slug: "teste",
				createdAt: new Date(),
			};

			mockService.update.mockResolvedValue(expected);

			const result = await controller.update("uuid", dto);

			expect(result).toEqual(expected);
			expect(mockService.update).toHaveBeenCalledWith("uuid", dto);
		});
	});

	describe("remove", () => {
		it("should remove a category", async () => {
			mockService.remove.mockResolvedValue(undefined);

			await controller.remove("uuid");

			expect(mockService.remove).toHaveBeenCalledWith("uuid");
		});
	});
});
