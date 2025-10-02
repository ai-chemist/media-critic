import { SetMetadata } from '@nestjs/common';

// Metadata Key Name 상수화
export const IS_PUBLIC_KEY = 'isPublic';

// SetMetadata() 사용하여 커스텀 데코레이터 생성
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);