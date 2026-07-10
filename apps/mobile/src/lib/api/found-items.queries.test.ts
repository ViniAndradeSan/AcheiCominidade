import { apiFetch } from "./client";
import { getFoundItems } from "./found-items.queries";

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
});
