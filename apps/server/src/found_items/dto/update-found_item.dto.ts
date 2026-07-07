import { PartialType } from "@nestjs/mapped-types";
import { CreateFoundItemDto } from "./create-found_item.dto";

export class UpdateFoundItemDto extends PartialType(CreateFoundItemDto) {}
