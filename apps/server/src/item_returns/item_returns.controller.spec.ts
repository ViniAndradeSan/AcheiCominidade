import { Test, type TestingModule } from "@nestjs/testing";
import { ItemReturnsController } from "./item_returns.controller";
import { ItemReturnsService } from "./item_returns.service";

describe("ItemReturnsController", () => {
	let controller: ItemReturnsController;

	const mockDate = new Date("2025-01-01T00:00:00Z");

	const mockItemReturn = {
		id: "770e8400-e29b-41d4-a716-446655440002",
		itemId: "550e8400-e29b-41d4-a716-446655440000",
		returnedAt: mockDate,
		observation: "Item retirado pelo aluno após confirmação.",
		createdAt: mockDate,
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
			controllers: [ItemReturnsController],
			providers: [{ provide: ItemReturnsService, useValue: mockService }],
		}).compile();

		controller = module.get<ItemReturnsController>(ItemReturnsController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should create an item return", async () => {
			const dto = {
				itemId: mockItemReturn.itemId,
				observation: "Item retirado pelo aluno após confirmação.",
			};

			mockService.create.mockResolvedValue(mockItemReturn);

			const result = await controller.create(dto);

			expect(result).toEqual(mockItemReturn);
			expect(mockService.create).toHaveBeenCalledWith(dto);
		});
	});

	describe("findAll", () => {
		it("should return all item returns", async () => {
			mockService.findAll.mockResolvedValue([mockItemReturn]);

			const result = await controller.findAll();

			expect(result).toEqual([mockItemReturn]);
			expect(mockService.findAll).toHaveBeenCalled();
		});
	});

	describe("findOne", () => {
		it("should return an item return by id", async () => {
			mockService.findOne.mockResolvedValue(mockItemReturn);

			const result = await controller.findOne(mockItemReturn.id);

			expect(result).toEqual(mockItemReturn);
			expect(mockService.findOne).toHaveBeenCalledWith(mockItemReturn.id);
		});
	});

	describe("update", () => {
		it("should update an item return", async () => {
			const dto = { observation: "Observação atualizada" };
			const updatedItemReturn = { ...mockItemReturn, ...dto };

			mockService.update.mockResolvedValue(updatedItemReturn);

			const result = await controller.update(mockItemReturn.id, dto);

			expect(result).toEqual(updatedItemReturn);
			expect(mockService.update).toHaveBeenCalledWith(mockItemReturn.id, dto);
		});
	});

	describe("remove", () => {
		it("should remove an item return", async () => {
			mockService.remove.mockResolvedValue(mockItemReturn);

			const result = await controller.remove(mockItemReturn.id);

			expect(result).toEqual(mockItemReturn);
			expect(mockService.remove).toHaveBeenCalledWith(mockItemReturn.id);
		});
	});
});
