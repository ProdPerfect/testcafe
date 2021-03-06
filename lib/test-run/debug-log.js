"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const debug_1 = __importDefault(require("debug"));
const indent_string_1 = __importDefault(require("indent-string"));
class TestRunDebugLog {
    constructor(userAgent) {
        this.driverMessageLogger = debug_1.default(`testcafe:test-run:${userAgent}:driver-message`);
        this.commandLogger = debug_1.default(`testcafe:test-run:${userAgent}:command`);
    }
    static _addEntry(logger, data) {
        try {
            const entry = data ?
                indent_string_1.default(`\n${util_1.inspect(data, { compact: false })}\n`, ' ', 4) :
                '';
            logger(entry);
        }
        catch (e) {
            logger(e.stack ? e.stack : String(e));
        }
    }
    driverMessage(msg) {
        TestRunDebugLog._addEntry(this.driverMessageLogger, msg);
    }
    command(cmd) {
        TestRunDebugLog._addEntry(this.commandLogger, cmd);
    }
}
exports.default = TestRunDebugLog;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWctbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3QtcnVuL2RlYnVnLWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtCQUErQjtBQUMvQixrREFBZ0M7QUFDaEMsa0VBQXlDO0FBRXpDLE1BQXFCLGVBQWU7SUFDaEMsWUFBYSxTQUFTO1FBQ2xCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxlQUFXLENBQUMscUJBQXFCLFNBQVMsaUJBQWlCLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsYUFBYSxHQUFTLGVBQVcsQ0FBQyxxQkFBcUIsU0FBUyxVQUFVLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBRSxNQUFNLEVBQUUsSUFBSTtRQUMxQixJQUFJO1lBQ0EsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQ2hCLHVCQUFZLENBQUMsS0FBSyxjQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsRUFBRSxDQUFDO1lBRVAsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2pCO1FBQ0QsT0FBTyxDQUFDLEVBQUU7WUFDTixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekM7SUFDTCxDQUFDO0lBRUQsYUFBYSxDQUFFLEdBQUc7UUFDZCxlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsT0FBTyxDQUFFLEdBQUc7UUFDUixlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQUNKO0FBMUJELGtDQTBCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluc3BlY3QgfSBmcm9tICd1dGlsJztcbmltcG9ydCBkZWJ1Z0xvZ2dlciBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgaW5kZW50U3RyaW5nIGZyb20gJ2luZGVudC1zdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0UnVuRGVidWdMb2cge1xuICAgIGNvbnN0cnVjdG9yICh1c2VyQWdlbnQpIHtcbiAgICAgICAgdGhpcy5kcml2ZXJNZXNzYWdlTG9nZ2VyID0gZGVidWdMb2dnZXIoYHRlc3RjYWZlOnRlc3QtcnVuOiR7dXNlckFnZW50fTpkcml2ZXItbWVzc2FnZWApO1xuICAgICAgICB0aGlzLmNvbW1hbmRMb2dnZXIgICAgICAgPSBkZWJ1Z0xvZ2dlcihgdGVzdGNhZmU6dGVzdC1ydW46JHt1c2VyQWdlbnR9OmNvbW1hbmRgKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2FkZEVudHJ5IChsb2dnZXIsIGRhdGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZGF0YSA/XG4gICAgICAgICAgICAgICAgaW5kZW50U3RyaW5nKGBcXG4ke2luc3BlY3QoZGF0YSwgeyBjb21wYWN0OiBmYWxzZSB9KX1cXG5gLCAnICcsIDQpIDpcbiAgICAgICAgICAgICAgICAnJztcblxuICAgICAgICAgICAgbG9nZ2VyKGVudHJ5KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbG9nZ2VyKGUuc3RhY2sgPyBlLnN0YWNrIDogU3RyaW5nKGUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyaXZlck1lc3NhZ2UgKG1zZykge1xuICAgICAgICBUZXN0UnVuRGVidWdMb2cuX2FkZEVudHJ5KHRoaXMuZHJpdmVyTWVzc2FnZUxvZ2dlciwgbXNnKTtcbiAgICB9XG5cbiAgICBjb21tYW5kIChjbWQpIHtcbiAgICAgICAgVGVzdFJ1bkRlYnVnTG9nLl9hZGRFbnRyeSh0aGlzLmNvbW1hbmRMb2dnZXIsIGNtZCk7XG4gICAgfVxufVxuIl19