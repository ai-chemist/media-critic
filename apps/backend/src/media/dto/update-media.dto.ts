import { PartialType } from '@nestjs/swagger';

import { CreateMediaDto } from './create-media.dto';

// nest swagger 에서 지원하는 PartialType 사용하여 CreateMediaDto 부분 사용
export class UpdateMediaDto extends PartialType(CreateMediaDto) {}