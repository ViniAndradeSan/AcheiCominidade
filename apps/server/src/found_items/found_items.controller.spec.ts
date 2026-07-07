import { Test, type TestingModule } from "@nestjs/testing";
import { FoundItemsController } from "./found_items.controller";
import { FoundItemsService } from "./found_items.service";

describe("FoundItemsController", () => {
	let controller: FoundItemsController;

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

	const mockService = {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FoundItemsController],
			providers: [{ provide: FoundItemsService, useValue: mockService }],
		}).compile();

		controller = module.get<FoundItemsController>(FoundItemsController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should create a found item", async () => {
			const dto = {
				title: "Carteira preta",
				description: "Carteira encontrada perto da biblioteca.",
				categoryId: "660e8400-e29b-41d4-a716-446655440001",
				photoUrl: "https://storage.exemplo.com/fotos/carteira.jpg",
				foundLocationText: "Biblioteca central",
				foundLatitude: -10.9472,
				foundLongitude: -37.0731,
			};

			mockService.create.mockResolvedValue(mockFoundItem);

			const result = await controller.create(dto);

			expect(result).toEqual(mockFoundItem);
			expect(mockService.create).toHaveBeenCalledWith(dto);
		});
	});

	describe("findAll", () => {
		it("should return all found items", async () => {
			mockService.findAll.mockResolvedValue([mockFoundItem]);

			const result = await controller.findAll({});

			expect(result).toEqual([mockFoundItem]);
			expect(mockService.findAll).toHaveBeenCalledWith({});
		});

		it("should pass query filters through to the service", async () => {
			mockService.findAll.mockResolvedValue([mockFoundItem]);

			const result = await controller.findAll({
				status: "disponivel",
				category: "eletronico",
			});

			expect(result).toEqual([mockFoundItem]);
			expect(mockService.findAll).toHaveBeenCalledWith({
				status: "disponivel",
				category: "eletronico",
			});
		});
	});

	describe("findOne", () => {
		it("should return a found item by id", async () => {
			mockService.findOne.mockResolvedValue(mockFoundItem);

			const result = await controller.findOne(mockFoundItem.id);

			expect(result).toEqual(mockFoundItem);
			expect(mockService.findOne).toHaveBeenCalledWith(mockFoundItem.id);
		});
	});

	describe("update", () => {
		it("should update a found item", async () => {
			const dto = { title: "Carteira marrom atualizada" };
			const updatedItem = { ...mockFoundItem, ...dto };

			mockService.update.mockResolvedValue(updatedItem);

			const result = await controller.update(mockFoundItem.id, dto);

			expect(result).toEqual(updatedItem);
			expect(mockService.update).toHaveBeenCalledWith(mockFoundItem.id, dto);
		});
	});

	describe("remove", () => {
		it("should remove a found item", async () => {
			mockService.remove.mockResolvedValue(mockFoundItem);

			const result = await controller.remove(mockFoundItem.id);

			expect(result).toEqual(mockFoundItem);
			expect(mockService.remove).toHaveBeenCalledWith(mockFoundItem.id);
		});
	});
});
