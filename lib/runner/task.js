"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const moment_1 = __importDefault(require("moment"));
const async_event_emitter_1 = __importDefault(require("../utils/async-event-emitter"));
const browser_job_1 = __importDefault(require("./browser-job"));
const screenshots_1 = __importDefault(require("../screenshots"));
const warning_log_1 = __importDefault(require("../notifications/warning-log"));
const fixture_hook_controller_1 = __importDefault(require("./fixture-hook-controller"));
const clientScriptsRouting = __importStar(require("../custom-client-scripts/routing"));
const videos_1 = __importDefault(require("../video-recorder/videos"));
class Task extends async_event_emitter_1.default {
    constructor(tests, browserConnectionGroups, proxy, opts) {
        super();
        this.timeStamp = moment_1.default();
        this.running = false;
        this.browserConnectionGroups = browserConnectionGroups;
        this.tests = tests;
        this.opts = opts;
        this.proxy = proxy;
        this.warningLog = new warning_log_1.default();
        this.screenshots = new screenshots_1.default(Object.assign({ enabled: !this.opts.disableScreenshots }, this.opts.screenshots));
        this.fixtureHookController = new fixture_hook_controller_1.default(tests, browserConnectionGroups.length);
        this.pendingBrowserJobs = this._createBrowserJobs(proxy, this.opts);
        this.clientScriptRoutes = clientScriptsRouting.register(proxy, tests);
        this.testStructure = this._prepareTestStructure(tests);
        if (this.opts.videoPath)
            this.videos = new videos_1.default(this.pendingBrowserJobs, this.opts, this.warningLog, this.timeStamp);
    }
    _assignBrowserJobEventHandlers(job) {
        job.on('test-run-start', async (testRun) => {
            await this.emit('test-run-start', testRun);
        });
        job.on('test-run-done', async (testRun) => {
            await this.emit('test-run-done', testRun);
            if (this.opts.stopOnFirstFail && testRun.errs.length) {
                this.abort();
                await this.emit('done');
            }
        });
        job.once('start', async () => {
            if (!this.running) {
                this.running = true;
                await this.emit('start');
            }
        });
        job.once('done', async () => {
            await this.emit('browser-job-done', job);
            lodash_1.pull(this.pendingBrowserJobs, job);
            if (!this.pendingBrowserJobs.length)
                await this.emit('done');
        });
        job.on('test-action-start', async (args) => {
            await this.emit('test-action-start', args);
        });
        job.on('test-action-done', async (args) => {
            await this.emit('test-action-done', args);
        });
    }
    _prepareTestStructure(tests) {
        const groups = lodash_1.groupBy(tests, 'fixture.id');
        return Object.keys(groups).map(fixtureId => {
            const testsByGroup = groups[fixtureId];
            const fixture = testsByGroup[0].fixture;
            return {
                fixture: {
                    id: fixture.id,
                    name: fixture.name,
                    tests: testsByGroup.map(test => {
                        return {
                            id: test.id,
                            name: test.name,
                            skip: test.skip
                        };
                    })
                }
            };
        });
    }
    _createBrowserJobs(proxy, opts) {
        return this.browserConnectionGroups.map(browserConnectionGroup => {
            const job = new browser_job_1.default(this.tests, browserConnectionGroup, proxy, this.screenshots, this.warningLog, this.fixtureHookController, opts);
            this._assignBrowserJobEventHandlers(job);
            browserConnectionGroup.map(bc => bc.addJob(job));
            return job;
        });
    }
    unRegisterClientScriptRouting() {
        clientScriptsRouting.unRegister(this.proxy, this.clientScriptRoutes);
    }
    // API
    abort() {
        this.pendingBrowserJobs.forEach(job => job.abort());
    }
}
exports.default = Task;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvdGFzay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBaUQ7QUFDakQsb0RBQTRCO0FBQzVCLHVGQUE2RDtBQUM3RCxnRUFBdUM7QUFDdkMsaUVBQXlDO0FBQ3pDLCtFQUFzRDtBQUN0RCx3RkFBOEQ7QUFDOUQsdUZBQXlFO0FBQ3pFLHNFQUE4QztBQUU5QyxNQUFxQixJQUFLLFNBQVEsNkJBQWlCO0lBQy9DLFlBQWEsS0FBSyxFQUFFLHVCQUF1QixFQUFFLEtBQUssRUFBRSxJQUFJO1FBQ3BELEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLFNBQVMsR0FBaUIsZ0JBQU0sRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLEdBQW1CLEtBQUssQ0FBQztRQUNyQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsdUJBQXVCLENBQUM7UUFDdkQsSUFBSSxDQUFDLEtBQUssR0FBcUIsS0FBSyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEdBQXNCLElBQUksQ0FBQztRQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFxQixLQUFLLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBZ0IsSUFBSSxxQkFBVSxFQUFFLENBQUM7UUFFaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHFCQUFXLGlCQUM5QixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixJQUVuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFDMUIsQ0FBQztRQUVILElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLGlDQUFxQixDQUFDLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5RixJQUFJLENBQUMsa0JBQWtCLEdBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFD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QyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNKO0FBN0dELHVCQTZHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1bGwgYXMgcmVtb3ZlLCBncm91cEJ5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBBc3luY0V2ZW50RW1pdHRlciBmcm9tICcuLi91dGlscy9hc3luYy1ldmVudC1lbWl0dGVyJztcbmltcG9ydCBCcm93c2VySm9iIGZyb20gJy4vYnJvd3Nlci1qb2InO1xuaW1wb3J0IFNjcmVlbnNob3RzIGZyb20gJy4uL3NjcmVlbnNob3RzJztcbmltcG9ydCBXYXJuaW5nTG9nIGZyb20gJy4uL25vdGlmaWNhdGlvbnMvd2FybmluZy1sb2cnO1xuaW1wb3J0IEZpeHR1cmVIb29rQ29udHJvbGxlciBmcm9tICcuL2ZpeHR1cmUtaG9vay1jb250cm9sbGVyJztcbmltcG9ydCAqIGFzIGNsaWVudFNjcmlwdHNSb3V0aW5nIGZyb20gJy4uL2N1c3RvbS1jbGllbnQtc2NyaXB0cy9yb3V0aW5nJztcbmltcG9ydCBWaWRlb3MgZnJvbSAnLi4vdmlkZW8tcmVjb3JkZXIvdmlkZW9zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFzayBleHRlbmRzIEFzeW5jRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvciAodGVzdHMsIGJyb3dzZXJDb25uZWN0aW9uR3JvdXBzLCBwcm94eSwgb3B0cykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMudGltZVN0YW1wICAgICAgICAgICAgICAgPSBtb21lbnQoKTtcbiAgICAgICAgdGhpcy5ydW5uaW5nICAgICAgICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9uR3JvdXBzID0gYnJvd3NlckNvbm5lY3Rpb25Hcm91cHM7XG4gICAgICAgIHRoaXMudGVzdHMgICAgICAgICAgICAgICAgICAgPSB0ZXN0cztcbiAgICAgICAgdGhpcy5vcHRzICAgICAgICAgICAgICAgICAgICA9IG9wdHM7XG4gICAgICAgIHRoaXMucHJveHkgICAgICAgICAgICAgICAgICAgPSBwcm94eTtcbiAgICAgICAgdGhpcy53YXJuaW5nTG9nICAgICAgICAgICAgICA9IG5ldyBXYXJuaW5nTG9nKCk7XG5cbiAgICAgICAgdGhpcy5zY3JlZW5zaG90cyA9IG5ldyBTY3JlZW5zaG90cyh7XG4gICAgICAgICAgICBlbmFibGVkOiAhdGhpcy5vcHRzLmRpc2FibGVTY3JlZW5zaG90cyxcblxuICAgICAgICAgICAgLi4udGhpcy5vcHRzLnNjcmVlbnNob3RzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZml4dHVyZUhvb2tDb250cm9sbGVyID0gbmV3IEZpeHR1cmVIb29rQ29udHJvbGxlcih0ZXN0cywgYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5wZW5kaW5nQnJvd3NlckpvYnMgICAgPSB0aGlzLl9jcmVhdGVCcm93c2VySm9icyhwcm94eSwgdGhpcy5vcHRzKTtcbiAgICAgICAgdGhpcy5jbGllbnRTY3JpcHRSb3V0ZXMgICAgPSBjbGllbnRTY3JpcHRzUm91dGluZy5yZWdpc3Rlcihwcm94eSwgdGVzdHMpO1xuICAgICAgICB0aGlzLnRlc3RTdHJ1Y3R1cmUgICAgICAgICA9IHRoaXMuX3ByZXBhcmVUZXN0U3RydWN0dXJlKHRlc3RzKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRzLnZpZGVvUGF0aClcbiAgICAgICAgICAgIHRoaXMudmlkZW9zID0gbmV3IFZpZGVvcyh0aGlzLnBlbmRpbmdCcm93c2VySm9icywgdGhpcy5vcHRzLCB0aGlzLndhcm5pbmdMb2csIHRoaXMudGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICBfYXNzaWduQnJvd3NlckpvYkV2ZW50SGFuZGxlcnMgKGpvYikge1xuICAgICAgICBqb2Iub24oJ3Rlc3QtcnVuLXN0YXJ0JywgYXN5bmMgdGVzdFJ1biA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmVtaXQoJ3Rlc3QtcnVuLXN0YXJ0JywgdGVzdFJ1bik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGpvYi5vbigndGVzdC1ydW4tZG9uZScsIGFzeW5jIHRlc3RSdW4gPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCd0ZXN0LXJ1bi1kb25lJywgdGVzdFJ1bik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMuc3RvcE9uRmlyc3RGYWlsICYmIHRlc3RSdW4uZXJycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCdkb25lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGpvYi5vbmNlKCdzdGFydCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVtaXQoJ3N0YXJ0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGpvYi5vbmNlKCdkb25lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCdicm93c2VyLWpvYi1kb25lJywgam9iKTtcblxuICAgICAgICAgICAgcmVtb3ZlKHRoaXMucGVuZGluZ0Jyb3dzZXJKb2JzLCBqb2IpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMucGVuZGluZ0Jyb3dzZXJKb2JzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVtaXQoJ2RvbmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgam9iLm9uKCd0ZXN0LWFjdGlvbi1zdGFydCcsIGFzeW5jIGFyZ3MgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCd0ZXN0LWFjdGlvbi1zdGFydCcsIGFyZ3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICBqb2Iub24oJ3Rlc3QtYWN0aW9uLWRvbmUnLCBhc3luYyBhcmdzID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZW1pdCgndGVzdC1hY3Rpb24tZG9uZScsIGFyZ3MpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIF9wcmVwYXJlVGVzdFN0cnVjdHVyZSAodGVzdHMpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBzID0gZ3JvdXBCeSh0ZXN0cywgJ2ZpeHR1cmUuaWQnKTtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZ3JvdXBzKS5tYXAoZml4dHVyZUlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RzQnlHcm91cCA9IGdyb3Vwc1tmaXh0dXJlSWRdO1xuICAgICAgICAgICAgY29uc3QgZml4dHVyZSAgICAgID0gdGVzdHNCeUdyb3VwWzBdLmZpeHR1cmU7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZml4dHVyZToge1xuICAgICAgICAgICAgICAgICAgICBpZDogICAgZml4dHVyZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogIGZpeHR1cmUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdGVzdHM6IHRlc3RzQnlHcm91cC5tYXAodGVzdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAgIHRlc3QuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGVzdC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraXA6IHRlc3Quc2tpcFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQnJvd3NlckpvYnMgKHByb3h5LCBvcHRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJyb3dzZXJDb25uZWN0aW9uR3JvdXBzLm1hcChicm93c2VyQ29ubmVjdGlvbkdyb3VwID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvYiA9IG5ldyBCcm93c2VySm9iKHRoaXMudGVzdHMsIGJyb3dzZXJDb25uZWN0aW9uR3JvdXAsIHByb3h5LCB0aGlzLnNjcmVlbnNob3RzLCB0aGlzLndhcm5pbmdMb2csIHRoaXMuZml4dHVyZUhvb2tDb250cm9sbGVyLCBvcHRzKTtcblxuICAgICAgICAgICAgdGhpcy5fYXNzaWduQnJvd3NlckpvYkV2ZW50SGFuZGxlcnMoam9iKTtcbiAgICAgICAgICAgIGJyb3dzZXJDb25uZWN0aW9uR3JvdXAubWFwKGJjID0+IGJjLmFkZEpvYihqb2IpKTtcblxuICAgICAgICAgICAgcmV0dXJuIGpvYjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5SZWdpc3RlckNsaWVudFNjcmlwdFJvdXRpbmcgKCkge1xuICAgICAgICBjbGllbnRTY3JpcHRzUm91dGluZy51blJlZ2lzdGVyKHRoaXMucHJveHksIHRoaXMuY2xpZW50U2NyaXB0Um91dGVzKTtcbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICBhYm9ydCAoKSB7XG4gICAgICAgIHRoaXMucGVuZGluZ0Jyb3dzZXJKb2JzLmZvckVhY2goam9iID0+IGpvYi5hYm9ydCgpKTtcbiAgICB9XG59XG4iXX0=