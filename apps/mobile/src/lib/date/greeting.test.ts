import { getGreeting } from "@/lib/date/greeting";

describe("getGreeting", () => {
	it("retorna Bom dia pela manha", () => {
		expect(getGreeting(5)).toBe("Bom dia");
		expect(getGreeting(8)).toBe("Bom dia");
		expect(getGreeting(11)).toBe("Bom dia");
	});

	it("retorna Boa tarde pela tarde", () => {
		expect(getGreeting(12)).toBe("Boa tarde");
		expect(getGreeting(15)).toBe("Boa tarde");
		expect(getGreeting(17)).toBe("Boa tarde");
	});

	it("retorna Boa noite a noite e madrugada", () => {
		expect(getGreeting(18)).toBe("Boa noite");
		expect(getGreeting(22)).toBe("Boa noite");
		expect(getGreeting(0)).toBe("Boa noite");
		expect(getGreeting(4)).toBe("Boa noite");
	});
});
