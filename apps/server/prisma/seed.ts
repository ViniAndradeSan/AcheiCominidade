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
	const createdCategories: Record<string, string> = {};

	for (const category of categories) {
		const result = await prisma.itemCategory.upsert({
			where: { slug: category.slug },
			update: {},
			create: category,
		});
		createdCategories[category.slug] = result.id;
	}

	const items = [
		{
			title: "iPhone 14 Pro Max",
			description: "Encontrado no estacionamento do Shopping Norte, pertinho da praça de alimentação. Tela trincada mas funciona normal.",
			categoryId: createdCategories["eletronico"],
			photoUrl: "https://placehold.co/400x300/1a1a2e/e94560?text=iPhone+14",
			foundLocationText: "Shopping Norte - Estacionamento A3",
			foundLatitude: -23.5505,
			foundLongitude: -46.6333,
		},
		{
			title: "Carteira de couro marrom",
			description: "Carteira marrom com documentos. Não abri para ver nome, mas tem RG e cartões dentro.",
			categoryId: createdCategories["documento"],
			photoUrl: "https://placehold.co/400x300/0f3460/e94560?text=Carteira",
			foundLocationText: "Praça da Sé, bancada perto da fonte",
			foundLatitude: -23.5504,
			foundLongitude: -46.6340,
		},
		{
			title: "Jaqueta jeans azul",
			description: "Jaqueta jeans tamanho M, sem dono. Ficou pendurada no banco da praça.",
			categoryId: createdCategories["vestuario"],
			photoUrl: "https://placehold.co/400x300/16213e/e94560?text=Jaqueta",
			foundLocationText: "Parque Municipal - Banco próximo à lagoa",
			foundLatitude: -23.5489,
			foundLongitude: -46.6388,
		},
		{
			title: "Fone de ouvido Bluetooth",
			description: "Fone intra-auricular preto, caixa de carregamento incluída. Marca não identificada.",
			categoryId: createdCategories["eletronico"],
			photoUrl: "https://placehold.co/400x300/533483/e94560?text=Fone",
			foundLocationText: "Estação de metrô - Linha 3 Vermelha",
			foundLatitude: -23.5516,
			foundLongitude: -46.6345,
		},
		{
			title: "Chaveiro com chave de carro",
			description: "Chaveiro prata com chave de Toyota e miniatura de cavalo. Sem identificação.",
			categoryId: createdCategories["outro"],
			photoUrl: "https://placehold.co/400x300/1a1a2e/e94560?text=Chaveiro",
			foundLocationText: "Bar do Zé - Rua Augusta, 1200",
			foundLatitude: -23.5530,
			foundLongitude: -46.6620,
		},
	];

	const existingCount = await prisma.foundItem.count();
	if (existingCount === 0) {
		await prisma.foundItem.createMany({ data: items });
		console.log("Found items seeded successfully");
	} else {
		console.log(`Found items table already has ${existingCount} records, skipping`);
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
