import { PartialType } from "@nestjs/mapped-types";
import { CreateItemReturnDto } from "./create-item_return.dto";

export class UpdateItemReturnDto extends PartialType(CreateItemReturnDto) {}
