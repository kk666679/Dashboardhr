"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePayrollRecordDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_payroll_record_dto_1 = require("./create-payroll-record.dto");
class UpdatePayrollRecordDto extends (0, mapped_types_1.PartialType)(create_payroll_record_dto_1.CreatePayrollRecordDto) {
}
exports.UpdatePayrollRecordDto = UpdatePayrollRecordDto;
//# sourceMappingURL=update-payroll-record.dto.js.map