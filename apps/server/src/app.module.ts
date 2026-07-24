import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CategoriesModule } from "./categories/categories.module";
import { FoundItemsModule } from "./found_items/found_items.module";
import { GeocodingModule } from "./geocoding/geocoding.module";
import { ItemReturnsModule } from "./item_returns/item_returns.module";
import { PrismaModule } from "./prisma/prisma.module";
import { StorageModule } from "./storage/storage.module";

@Module({
    imports: [
        PrismaModule,
        CategoriesModule,
        FoundItemsModule,
        ItemReturnsModule,
        StorageModule,
        GeocodingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
