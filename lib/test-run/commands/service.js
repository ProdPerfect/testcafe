"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = __importDefault(require("./type"));
// Commands
class ShowAssertionRetriesStatusCommand {
    constructor(timeout) {
        this.type = type_1.default.showAssertionRetriesStatus;
        this.timeout = timeout;
    }
}
exports.ShowAssertionRetriesStatusCommand = ShowAssertionRetriesStatusCommand;
class HideAssertionRetriesStatusCommand {
    constructor(success) {
        this.type = type_1.default.hideAssertionRetriesStatus;
        this.success = success;
    }
}
exports.HideAssertionRetriesStatusCommand = HideAssertionRetriesStatusCommand;
class SetBreakpointCommand {
    constructor(isTestError) {
        this.type = type_1.default.setBreakpoint;
        this.isTestError = isTestError;
    }
}
exports.SetBreakpointCommand = SetBreakpointCommand;
class TestDoneCommand {
    constructor() {
        this.type = type_1.default.testDone;
    }
}
exports.TestDoneCommand = TestDoneCommand;
class BackupStoragesCommand {
    constructor() {
        this.type = type_1.default.backupStorages;
    }
}
exports.BackupStoragesCommand = BackupStoragesCommand;
class UnlockPageCommand {
    constructor() {
        this.type = type_1.default.unlockPage;
    }
}
exports.UnlockPageCommand = UnlockPageCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0LXJ1bi9jb21tYW5kcy9zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBRTFCLFdBQVc7QUFDWCxNQUFhLGlDQUFpQztJQUMxQyxZQUFhLE9BQU87UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBTSxjQUFJLENBQUMsMEJBQTBCLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBTEQsOEVBS0M7QUFFRCxNQUFhLGlDQUFpQztJQUMxQyxZQUFhLE9BQU87UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBTSxjQUFJLENBQUMsMEJBQTBCLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBTEQsOEVBS0M7QUFFRCxNQUFhLG9CQUFvQjtJQUM3QixZQUFhLFdBQVc7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBVSxjQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQUxELG9EQUtDO0FBRUQsTUFBYSxlQUFlO0lBQ3hCO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxjQUFJLENBQUMsUUFBUSxDQUFDO0lBQzlCLENBQUM7Q0FDSjtBQUpELDBDQUlDO0FBRUQsTUFBYSxxQkFBcUI7SUFDOUI7UUFDSSxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQUksQ0FBQyxjQUFjLENBQUM7SUFDcEMsQ0FBQztDQUNKO0FBSkQsc0RBSUM7QUFFRCxNQUFhLGlCQUFpQjtJQUMxQjtRQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBSSxDQUFDLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0NBQ0o7QUFKRCw4Q0FJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUWVBFIGZyb20gJy4vdHlwZSc7XG5cbi8vIENvbW1hbmRzXG5leHBvcnQgY2xhc3MgU2hvd0Fzc2VydGlvblJldHJpZXNTdGF0dXNDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvciAodGltZW91dCkge1xuICAgICAgICB0aGlzLnR5cGUgICAgPSBUWVBFLnNob3dBc3NlcnRpb25SZXRyaWVzU3RhdHVzO1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEhpZGVBc3NlcnRpb25SZXRyaWVzU3RhdHVzQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IgKHN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy50eXBlICAgID0gVFlQRS5oaWRlQXNzZXJ0aW9uUmV0cmllc1N0YXR1cztcbiAgICAgICAgdGhpcy5zdWNjZXNzID0gc3VjY2VzcztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXRCcmVha3BvaW50Q29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IgKGlzVGVzdEVycm9yKSB7XG4gICAgICAgIHRoaXMudHlwZSAgICAgICAgPSBUWVBFLnNldEJyZWFrcG9pbnQ7XG4gICAgICAgIHRoaXMuaXNUZXN0RXJyb3IgPSBpc1Rlc3RFcnJvcjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXN0RG9uZUNvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy50eXBlID0gVFlQRS50ZXN0RG9uZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYWNrdXBTdG9yYWdlc0NvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy50eXBlID0gVFlQRS5iYWNrdXBTdG9yYWdlcztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmxvY2tQYWdlQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBUWVBFLnVubG9ja1BhZ2U7XG4gICAgfVxufVxuXG4iXX0=