-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('disponivel', 'devolvido');

-- CreateTable
CREATE TABLE "item_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "found_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category_id" TEXT NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'disponivel',
    "photo_url" TEXT NOT NULL,
    "found_location_text" TEXT NOT NULL,
    "found_latitude" DOUBLE PRECISION,
    "found_longitude" DOUBLE PRECISION,
    "found_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "found_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_returns" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "returned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_returns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_categories_name_key" ON "item_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_categories_slug_key" ON "item_categories"("slug");

-- CreateIndex
CREATE INDEX "found_items_status_idx" ON "found_items"("status");

-- CreateIndex
CREATE INDEX "found_items_category_id_idx" ON "found_items"("category_id");

-- CreateIndex
CREATE INDEX "found_items_status_category_id_idx" ON "found_items"("status", "category_id");

-- CreateIndex
CREATE INDEX "found_items_found_at_idx" ON "found_items"("found_at");

-- CreateIndex
CREATE UNIQUE INDEX "item_returns_item_id_key" ON "item_returns"("item_id");

-- AddForeignKey
ALTER TABLE "found_items" ADD CONSTRAINT "found_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "item_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_returns" ADD CONSTRAINT "item_returns_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "found_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
