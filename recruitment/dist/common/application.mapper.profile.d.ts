import { AutomapperProfile } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
export declare class ApplicationMapperProfile extends AutomapperProfile {
    constructor(mapper: Mapper);
    mapProfile(): (mapper: any) => void;
}
