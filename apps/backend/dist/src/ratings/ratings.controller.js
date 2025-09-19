"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsController = void 0;
const common_1 = require("@nestjs/common");
const rating_service_1 = require("./rating.service");
const find_rating_query_dto_1 = require("./dto/find-rating.query.dto");
const create_rating_dto_1 = require("./dto/create-rating.dto");
const update_rating_dto_1 = require("./dto/update-rating.dto");
const optional_jwt_guard_1 = require("../auth/optional-jwt.guard");
let RatingsController = class RatingsController {
    ratings;
    constructor(ratings) {
        this.ratings = ratings;
    }
    async findAll(query) {
        return await this.ratings.findAll(query);
    }
    async findOne(id) {
        return await this.ratings.findOne(id);
    }
    async createFromUser(mediaId, req, dto) {
        const fixed = { ...dto, mediaId };
        return await this.ratings.createFromUser(req.user.sub, fixed);
    }
    async updateFromUser(id, req, dto) {
        return await this.ratings.updateFromUser(req.user.sub, id, dto);
    }
    async removeFromUser(id, req) {
        return await this.ratings.removeFromUser(req.user.sub, id);
    }
};
exports.RatingsController = RatingsController;
__decorate([
    (0, common_1.Get)('ratings'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_rating_query_dto_1.FindRatingQueryDto]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('ratings/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, common_1.Post)('media/:mediaId/create-ratings'),
    __param(0, (0, common_1.Param)('mediaId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, create_rating_dto_1.CreateRatingDto]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "createFromUser", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, common_1.Patch)('ratings/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, update_rating_dto_1.UpdateRatingDto]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "updateFromUser", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, common_1.Delete)('ratings/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "removeFromUser", null);
exports.RatingsController = RatingsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [rating_service_1.RatingsService])
], RatingsController);
//# sourceMappingURL=ratings.controller.js.map