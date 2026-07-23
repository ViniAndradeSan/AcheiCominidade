import { apiFetch } from "./client";
import { foundItemsKeys, getFoundItems } from "./found-items.queries";

jest.mock("./client", () => ({
	apiFetch: jest.fn(),
}));

const mockedApiFetch = jest.mocked(apiFetch);

describe("getFoundItems — buildQueryString", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("usa category (slug) em vez de categoryId quando filtro category é passado", async () => {
		await getFoundItems({ category: "eletronico" });

		expect(mockedApiFetch).toHaveBeenCalledWith(
			expect.stringContaining("?category=eletronico"),
		);
		expect(mockedApiFetch).not.toHaveBeenCalledWith(
			expect.stringContaining("categoryId"),
		);
	});

	it("combina status e category com o separador &", async () => {
		await getFoundItems({ status: "disponivel", category: "documento" });

		expect(mockedApiFetch).toHaveBeenCalledWith(
			expect.stringContaining("?status=disponivel&category=documento"),
		);
		expect(mockedApiFetch).not.toHaveBeenCalledWith(
			expect.stringContaining("categoryId"),
		);
	});

	it("retorna string vazia quando nenhum filtro é passado", async () => {
		await getFoundItems();

		expect(mockedApiFetch).toHaveBeenCalledWith("/found-items");
	});

	it("retorna string vazia quando objeto vazio é passado", async () => {
		await getFoundItems({});

		expect(mockedApiFetch).toHaveBeenCalledWith("/found-items");
	});

	it("inclui search na query string quando filtro search é passado", async () => {
		await getFoundItems({ search: "fone" });

		expect(mockedApiFetch).toHaveBeenCalledWith(
			expect.stringContaining("?search=fone"),
		);
	});

	it("combina search com status e category", async () => {
		await getFoundItems({
			search: "fone",
			status: "disponivel",
			category: "eletronico",
		});

		const call = mockedApiFetch.mock.calls[0][0] as string;
		expect(call).toContain("search=fone");
		expect(call).toContain("status=disponivel");
		expect(call).toContain("category=eletronico");
	});

	it("nao inclui search vazio na query string", async () => {
		await getFoundItems({ search: "" });

		expect(mockedApiFetch).toHaveBeenCalledWith("/found-items");
	});
});

describe("foundItemsKeys", () => {
	it("all returns base key", () => {
		expect(foundItemsKeys.all).toEqual(["found-items"]);
	});

	it("list returns key with filters", () => {
		expect(foundItemsKeys.list({ status: "disponivel" })).toEqual([
			"found-items",
			"list",
			{ status: "disponivel" },
		]);
	});

	it("list with empty filters", () => {
		expect(foundItemsKeys.list()).toEqual(["found-items", "list", {}]);
	});

	it("detail returns key with id", () => {
		expect(foundItemsKeys.detail("abc-123")).toEqual([
			"found-items",
			"detail",
			"abc-123",
		]);
	});
});
