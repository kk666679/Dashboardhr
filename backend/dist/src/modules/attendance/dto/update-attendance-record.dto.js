"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAttendanceRecordDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_attendance_record_dto_1 = require("./create-attendance-record.dto");
class UpdateAttendanceRecordDto extends (0, mapped_types_1.PartialType)(create_attendance_record_dto_1.CreateAttendanceRecordDto) {
}
exports.UpdateAttendanceRecordDto = UpdateAttendanceRecordDto;
//# sourceMappingURL=update-attendance-record.dto.js.map