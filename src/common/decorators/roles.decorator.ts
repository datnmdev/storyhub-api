import { Role } from "../constants/account.constants";
import { SetMetadata } from "@nestjs/common";
import { METADATA_ROLE_KEY } from "../constants/metadata.constant";

export const Roles = (...roles: Role[]) => SetMetadata(METADATA_ROLE_KEY, roles);