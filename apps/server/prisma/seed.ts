import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.DATABASE_URL as string,
	}),
});

const categories = [
	{ name: "Eletrônico", slug: "eletronico" },
	{ name: "Documento", slug: "documento" },
	{ name: "Vestuário", slug: "vestuario" },
	{ name: "Outro", slug: "outro" },
];

async function main() {
	for (const category of categories) {
		await prisma.itemCategory.upsert({
			where: { slug: category.slug },
			update: {},
			create: category,
		});
	}

	console.log("Seed completed successfully");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
