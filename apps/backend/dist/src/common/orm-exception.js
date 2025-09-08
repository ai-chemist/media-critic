"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOrmError = mapOrmError;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
function mapOrmError(err) {
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                throw new common_1.ConflictException('Unique Constraint Failed');
            case 'P2025':
                throw new common_1.NotFoundException('Record Not found');
        }
    }
    throw new common_1.BadRequestException('Database Error');
}
//# sourceMappingURL=orm-exception.js.map