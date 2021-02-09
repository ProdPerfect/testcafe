"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phase_1 = __importDefault(require("../test-run/phase"));
const types_1 = require("../errors/types");
const testcafe_hammerhead_1 = require("testcafe-hammerhead");
const actions_1 = require("./commands/actions");
const test_run_1 = require("../errors/test-run");
class TestRunBookmark {
    constructor(testRun, role) {
        this.testRun = testRun;
        this.role = role;
        this.url = testcafe_hammerhead_1.SPECIAL_BLANK_PAGE;
        this.dialogHandler = testRun.activeDialogHandler;
        this.iframeSelector = testRun.activeIframeSelector;
        this.speed = testRun.speed;
        this.pageLoadTimeout = testRun.pageLoadTimeout;
        this.ctx = testRun.ctx;
        this.fixtureCtx = testRun.fixtureCtx;
        this.consoleMessages = testRun.consoleMessages;
    }
    async init() {
        if (this.testRun.activeIframeSelector)
            await this.testRun.executeCommand(new actions_1.SwitchToMainWindowCommand());
        if (!this.role.opts.preserveUrl)
            await this.role.setCurrentUrlAsRedirectUrl(this.testRun);
    }
    async _restoreDialogHandler() {
        if (this.testRun.activeDialogHandler !== this.dialogHandler) {
            const restoreDialogCommand = new actions_1.SetNativeDialogHandlerCommand({ dialogHandler: { fn: this.dialogHandler } });
            await this.testRun.executeCommand(restoreDialogCommand);
        }
    }
    async _restoreSpeed() {
        if (this.testRun.speed !== this.speed) {
            const restoreSpeedCommand = new actions_1.SetTestSpeedCommand({ speed: this.speed });
            await this.testRun.executeCommand(restoreSpeedCommand);
        }
    }
    async _restorePageLoadTimeout() {
        if (this.testRun.pageLoadTimeout !== this.pageLoadTimeout) {
            const restorePageLoadTimeoutCommand = new actions_1.SetPageLoadTimeoutCommand({ duration: this.pageLoadTimeout });
            await this.testRun.executeCommand(restorePageLoadTimeoutCommand);
        }
    }
    async _restoreWorkingFrame() {
        if (this.testRun.activeIframeSelector !== this.iframeSelector) {
            const switchWorkingFrameCommand = this.iframeSelector ?
                new actions_1.SwitchToIframeCommand({ selector: this.iframeSelector }) :
                new actions_1.SwitchToMainWindowCommand();
            try {
                await this.testRun.executeCommand(switchWorkingFrameCommand);
            }
            catch (err) {
                if (err.code === types_1.TEST_RUN_ERRORS.actionElementNotFoundError)
                    throw new test_run_1.CurrentIframeNotFoundError();
                if (err.code === types_1.TEST_RUN_ERRORS.actionIframeIsNotLoadedError)
                    throw new test_run_1.CurrentIframeIsNotLoadedError();
                throw err;
            }
        }
    }
    async _restorePage(url, stateSnapshot) {
        await this.testRun.navigateToUrl(url, true, JSON.stringify(stateSnapshot));
    }
    async restore(callsite, stateSnapshot) {
        const prevPhase = this.testRun.phase;
        this.testRun.phase = phase_1.default.inBookmarkRestore;
        this.testRun.ctx = this.ctx;
        this.testRun.fixtureCtx = this.fixtureCtx;
        this.testRun.consoleMessages = this.consoleMessages;
        try {
            await this._restoreSpeed();
            await this._restorePageLoadTimeout();
            await this._restoreDialogHandler();
            const preserveUrl = this.role.opts.preserveUrl;
            await this._restorePage(this.role.redirectUrl, stateSnapshot);
            if (!preserveUrl)
                await this._restoreWorkingFrame();
        }
        catch (err) {
            err.callsite = callsite;
            throw err;
        }
        this.testRun.phase = prevPhase;
    }
}
exports.default = TestRunBookmark;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va21hcmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVzdC1ydW4vYm9va21hcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4REFBK0M7QUFDL0MsMkNBQWtEO0FBQ2xELDZEQUF5RDtBQUV6RCxnREFNNEI7QUFFNUIsaURBQStGO0FBRS9GLE1BQXFCLGVBQWU7SUFDaEMsWUFBYSxPQUFPLEVBQUUsSUFBSTtRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFNLElBQUksQ0FBQztRQUVwQixJQUFJLENBQUMsR0FBRyxHQUFlLHdDQUFrQixDQUFDO1FBQzFDLElBQUksQ0FBQyxhQUFhLEdBQUssT0FBTyxDQUFDLG1CQUFtQixDQUFDO1FBQ25ELElBQUksQ0FBQyxjQUFjLEdBQUksT0FBTyxDQUFDLG9CQUFvQixDQUFDO1FBQ3BELElBQUksQ0FBQyxLQUFLLEdBQWEsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNyQyxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDL0MsSUFBSSxDQUFDLEdBQUcsR0FBZSxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ25DLElBQUksQ0FBQyxVQUFVLEdBQVEsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUMxQyxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ04sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQjtZQUNqQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksbUNBQXlCLEVBQUUsQ0FBQyxDQUFDO1FBRXZFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQzNCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJ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QSxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMzQixNQUFNLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQ3JDLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFFbkMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBRS9DLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUU5RCxJQUFJLENBQUMsV0FBVztnQkFDWixNQUFNLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxHQUFHLEVBQUU7WUFDUixHQUFHLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUV4QixNQUFNLEdBQUcsQ0FBQztTQUNiO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQXJHRCxrQ0FxR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVEVTVF9SVU5fUEhBU0UgZnJvbSAnLi4vdGVzdC1ydW4vcGhhc2UnO1xuaW1wb3J0IHsgVEVTVF9SVU5fRVJST1JTIH0gZnJvbSAnLi4vZXJyb3JzL3R5cGVzJztcbmltcG9ydCB7IFNQRUNJQUxfQkxBTktfUEFHRSB9IGZyb20gJ3Rlc3RjYWZlLWhhbW1lcmhlYWQnO1xuXG5pbXBvcnQge1xuICAgIFN3aXRjaFRvTWFpbldpbmRvd0NvbW1hbmQsXG4gICAgU3dpdGNoVG9JZnJhbWVDb21tYW5kLFxuICAgIFNldE5hdGl2ZURpYWxvZ0hhbmRsZXJDb21tYW5kLFxuICAgIFNldFRlc3RTcGVlZENvbW1hbmQsXG4gICAgU2V0UGFnZUxvYWRUaW1lb3V0Q29tbWFuZFxufSBmcm9tICcuL2NvbW1hbmRzL2FjdGlvbnMnO1xuXG5pbXBvcnQgeyBDdXJyZW50SWZyYW1lTm90Rm91bmRFcnJvciwgQ3VycmVudElmcmFtZUlzTm90TG9hZGVkRXJyb3IgfSBmcm9tICcuLi9lcnJvcnMvdGVzdC1ydW4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0UnVuQm9va21hcmsge1xuICAgIGNvbnN0cnVjdG9yICh0ZXN0UnVuLCByb2xlKSB7XG4gICAgICAgIHRoaXMudGVzdFJ1biA9IHRlc3RSdW47XG4gICAgICAgIHRoaXMucm9sZSAgICA9IHJvbGU7XG5cbiAgICAgICAgdGhpcy51cmwgICAgICAgICAgICAgPSBTUEVDSUFMX0JMQU5LX1BBR0U7XG4gICAgICAgIHRoaXMuZGlhbG9nSGFuZGxlciAgID0gdGVzdFJ1bi5hY3RpdmVEaWFsb2dIYW5kbGVyO1xuICAgICAgICB0aGlzLmlmcmFtZVNlbGVjdG9yICA9IHRlc3RSdW4uYWN0aXZlSWZyYW1lU2VsZWN0b3I7XG4gICAgICAgIHRoaXMuc3BlZWQgICAgICAgICAgID0gdGVzdFJ1bi5zcGVlZDtcbiAgICAgICAgdGhpcy5wYWdlTG9hZFRpbWVvdXQgPSB0ZXN0UnVuLnBhZ2VMb2FkVGltZW91dDtcbiAgICAgICAgdGhpcy5jdHggICAgICAgICAgICAgPSB0ZXN0UnVuLmN0eDtcbiAgICAgICAgdGhpcy5maXh0dXJlQ3R4ICAgICAgPSB0ZXN0UnVuLmZpeHR1cmVDdHg7XG4gICAgICAgIHRoaXMuY29uc29sZU1lc3NhZ2VzID0gdGVzdFJ1bi5jb25zb2xlTWVzc2FnZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RSdW4uYWN0aXZlSWZyYW1lU2VsZWN0b3IpXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnRlc3RSdW4uZXhlY3V0ZUNvbW1hbmQobmV3IFN3aXRjaFRvTWFpbldpbmRvd0NvbW1hbmQoKSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnJvbGUub3B0cy5wcmVzZXJ2ZVVybClcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucm9sZS5zZXRDdXJyZW50VXJsQXNSZWRpcmVjdFVybCh0aGlzLnRlc3RSdW4pO1xuICAgIH1cblxuICAgIGFzeW5jIF9yZXN0b3JlRGlhbG9nSGFuZGxlciAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RSdW4uYWN0aXZlRGlhbG9nSGFuZGxlciAhPT0gdGhpcy5kaWFsb2dIYW5kbGVyKSB7XG4gICAgICAgICAgICBjb25zdCByZXN0b3JlRGlhbG9nQ29tbWFuZCA9IG5ldyBTZXROYXRpdmVEaWFsb2dIYW5kbGVyQ29tbWFuZCh7IGRpYWxvZ0hhbmRsZXI6IHsgZm46IHRoaXMuZGlhbG9nSGFuZGxlciB9IH0pO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnRlc3RSdW4uZXhlY3V0ZUNvbW1hbmQocmVzdG9yZURpYWxvZ0NvbW1hbmQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgX3Jlc3RvcmVTcGVlZCAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RSdW4uc3BlZWQgIT09IHRoaXMuc3BlZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3RvcmVTcGVlZENvbW1hbmQgPSBuZXcgU2V0VGVzdFNwZWVkQ29tbWFuZCh7IHNwZWVkOiB0aGlzLnNwZWVkIH0pO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnRlc3RSdW4uZXhlY3V0ZUNvbW1hbmQocmVzdG9yZVNwZWVkQ29tbWFuZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfcmVzdG9yZVBhZ2VMb2FkVGltZW91dCAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RSdW4ucGFnZUxvYWRUaW1lb3V0ICE9PSB0aGlzLnBhZ2VMb2FkVGltZW91dCkge1xuICAgICAgICAgICAgY29uc3QgcmVzdG9yZVBhZ2VMb2FkVGltZW91dENvbW1hbmQgPSBuZXcgU2V0UGFnZUxvYWRUaW1lb3V0Q29tbWFuZCh7IGR1cmF0aW9uOiB0aGlzLnBhZ2VMb2FkVGltZW91dCB9KTtcblxuICAgICAgICAgICAgYXdhaXQgdGhpcy50ZXN0UnVuLmV4ZWN1dGVDb21tYW5kKHJlc3RvcmVQYWdlTG9hZFRpbWVvdXRDb21tYW5kKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIF9yZXN0b3JlV29ya2luZ0ZyYW1lICgpIHtcbiAgICAgICAgaWYgKHRoaXMudGVzdFJ1bi5hY3RpdmVJZnJhbWVTZWxlY3RvciAhPT0gdGhpcy5pZnJhbWVTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc3Qgc3dpdGNoV29ya2luZ0ZyYW1lQ29tbWFuZCA9IHRoaXMuaWZyYW1lU2VsZWN0b3IgP1xuICAgICAgICAgICAgICAgIG5ldyBTd2l0Y2hUb0lmcmFtZUNvbW1hbmQoeyBzZWxlY3RvcjogdGhpcy5pZnJhbWVTZWxlY3RvciB9KSA6XG4gICAgICAgICAgICAgICAgbmV3IFN3aXRjaFRvTWFpbldpbmRvd0NvbW1hbmQoKTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnRlc3RSdW4uZXhlY3V0ZUNvbW1hbmQoc3dpdGNoV29ya2luZ0ZyYW1lQ29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSBURVNUX1JVTl9FUlJPUlMuYWN0aW9uRWxlbWVudE5vdEZvdW5kRXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBDdXJyZW50SWZyYW1lTm90Rm91bmRFcnJvcigpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSBURVNUX1JVTl9FUlJPUlMuYWN0aW9uSWZyYW1lSXNOb3RMb2FkZWRFcnJvcilcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEN1cnJlbnRJZnJhbWVJc05vdExvYWRlZEVycm9yKCk7XG5cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfcmVzdG9yZVBhZ2UgKHVybCwgc3RhdGVTbmFwc2hvdCkge1xuICAgICAgICBhd2FpdCB0aGlzLnRlc3RSdW4ubmF2aWdhdGVUb1VybCh1cmwsIHRydWUsIEpTT04uc3RyaW5naWZ5KHN0YXRlU25hcHNob3QpKTtcbiAgICB9XG5cbiAgICBhc3luYyByZXN0b3JlIChjYWxsc2l0ZSwgc3RhdGVTbmFwc2hvdCkge1xuICAgICAgICBjb25zdCBwcmV2UGhhc2UgPSB0aGlzLnRlc3RSdW4ucGhhc2U7XG5cbiAgICAgICAgdGhpcy50ZXN0UnVuLnBoYXNlID0gVEVTVF9SVU5fUEhBU0UuaW5Cb29rbWFya1Jlc3RvcmU7XG5cbiAgICAgICAgdGhpcy50ZXN0UnVuLmN0eCAgICAgICAgICAgICA9IHRoaXMuY3R4O1xuICAgICAgICB0aGlzLnRlc3RSdW4uZml4dHVyZUN0eCAgICAgID0gdGhpcy5maXh0dXJlQ3R4O1xuICAgICAgICB0aGlzLnRlc3RSdW4uY29uc29sZU1lc3NhZ2VzID0gdGhpcy5jb25zb2xlTWVzc2FnZXM7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3Jlc3RvcmVTcGVlZCgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVzdG9yZVBhZ2VMb2FkVGltZW91dCgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVzdG9yZURpYWxvZ0hhbmRsZXIoKTtcblxuICAgICAgICAgICAgY29uc3QgcHJlc2VydmVVcmwgPSB0aGlzLnJvbGUub3B0cy5wcmVzZXJ2ZVVybDtcblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVzdG9yZVBhZ2UodGhpcy5yb2xlLnJlZGlyZWN0VXJsLCBzdGF0ZVNuYXBzaG90KTtcblxuICAgICAgICAgICAgaWYgKCFwcmVzZXJ2ZVVybClcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9yZXN0b3JlV29ya2luZ0ZyYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZXJyLmNhbGxzaXRlID0gY2FsbHNpdGU7XG5cbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGVzdFJ1bi5waGFzZSA9IHByZXZQaGFzZTtcbiAgICB9XG59XG4iXX0=