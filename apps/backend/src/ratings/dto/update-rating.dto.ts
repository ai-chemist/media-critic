import { PartialType } from '@nestjs/swagger';

import { CreateRatingDto } from './create-rating.dto';

// nest swagger 에서 지원하는 PartialType 사용하여 CreateRatingDto 부분 사용
export class UpdateRatingDto extends PartialType(CreateRatingDto) {}