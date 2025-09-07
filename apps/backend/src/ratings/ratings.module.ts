import { Module } from '@nestjs/common';
import { RatingsService } from './rating.service';
import { RatingsController } from './ratings.controller';

@Module({
    providers: [RatingsService],
    controllers: [RatingsController],
})
export class RatingsModule {}