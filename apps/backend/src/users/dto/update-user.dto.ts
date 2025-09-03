import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

// nestjs swagger 에서 지원하는 PartialType을 사용하여 CreateUserDto 부분 사용 허용
export class UpdateUserDto extends PartialType(CreateUserDto) {}