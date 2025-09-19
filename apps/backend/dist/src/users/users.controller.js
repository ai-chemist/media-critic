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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const optional_jwt_guard_1 = require("../auth/optional-jwt.guard");
const update_user_self_dto_1 = require("./dto/update-user.self.dto");
const update_user_password_dto_1 = require("./dto/update-user-password.dto");
let UsersController = class UsersController {
    users;
    constructor(users) {
        this.users = users;
    }
    getMyProfile(req) {
        return this.users.getSelf(req.user.sub);
    }
    updateMyProfile(req, dto) {
        return this.users.updateSelf(req.user.sub, dto);
    }
    changeMyPassword(req, dto) {
        return this.users.changePassword(req.user.sub, dto);
    }
    softDeleteUser(req) {
        return this.users.softDeleteUser(req.user.sub);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_self_dto_1.UpdateUserSelfDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, common_1.Patch)('me/password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_password_dto_1.UpdateUserPasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changeMyPassword", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    (0, common_1.Delete)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "softDeleteUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map