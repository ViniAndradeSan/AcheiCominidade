import { describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";

describe("AppModule", () => {
	it("compiles the module", async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(PrismaService)
			.useValue({})
			.compile();

		expect(moduleRef).toBeDefined();
	});
});
