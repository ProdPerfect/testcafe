"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
        super({ captureRejections: true });
        this._timeStamp = moment_1.default();
        this._running = false;
        this.browserConnectionGroups = browserConnectionGroups;
        this.tests = tests;
        this.opts = opts;
        this._proxy = proxy;
        this.warningLog = new warning_log_1.default();
        const { path, pathPattern, fullPage } = this.opts.screenshots;
        this.screenshots = new screenshots_1.default({
            enabled: !this.opts.disableScreenshots,
            path,
            pathPattern,
            fullPage
        });
        this.fixtureHookController = new fixture_hook_controller_1.default(tests, browserConnectionGroups.length);
        this._pendingBrowserJobs = this._createBrowserJobs(proxy, this.opts);
        this._clientScriptRoutes = clientScriptsRouting.register(proxy, tests);
        this.testStructure = this._prepareTestStructure(tests);
        if (this.opts.videoPath) {
            const { videoPath, videoOptions, videoEncodingOptions } = this.opts;
            this.videos = new videos_1.default(this._pendingBrowserJobs, { videoPath, videoOptions, videoEncodingOptions }, this.warningLog, this._timeStamp);
        }
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
            if (!this._running) {
                this._running = true;
                await this.emit('start');
            }
        });
        job.once('done', async () => {
            await this.emit('browser-job-done', job);
            lodash_1.pull(this._pendingBrowserJobs, job);
            if (!this._pendingBrowserJobs.length)
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
        clientScriptsRouting.unRegister(this._proxy, this._clientScriptRoutes);
    }
    // API
    abort() {
        this._pendingBrowserJobs.forEach(job => job.abort());
    }
}
exports.default = Task;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvdGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBaUQ7QUFDakQsb0RBQTRCO0FBQzVCLHVGQUE2RDtBQUM3RCxnRUFBdUM7QUFDdkMsaUVBQXlDO0FBQ3pDLCtFQUFzRDtBQUN0RCx3RkFBOEQ7QUFDOUQsdUZBQXlFO0FBQ3pFLHNFQUE4QztBQVM5QyxNQUFxQixJQUFLLFNBQVEsNkJBQWlCO0lBZS9DLFlBQW9CLEtBQWEsRUFBRSx1QkFBOEMsRUFBRSxLQUFZLEVBQUUsSUFBNkI7UUFDMUgsS0FBSyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsVUFBVSxHQUFnQixnQkFBTSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBa0IsS0FBSyxDQUFDO1FBQ3JDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyx1QkFBdUIsQ0FBQztRQUN2RCxJQUFJLENBQUMsS0FBSyxHQUFxQixLQUFLLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUksR0FBc0IsSUFBSSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQW9CLEtBQUssQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFnQixJQUFJLHFCQUFVLEVBQUUsQ0FBQztRQUVoRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQW9DLENBQUM7UUFFdkYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHFCQUFXLENBQUM7WUFDL0IsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0I7WUFDdEMsSUFBSTtZQUNKLFdBQVc7WUFDWCxRQUFRO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFCQUFxQixH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LENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFakQsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSw2QkFBNkI7UUFDaEMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELE1BQU07SUFDQyxLQUFLO1FBQ1IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDSjtBQWxJRCx1QkFrSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWxsIGFzIHJlbW92ZSwgZ3JvdXBCeSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgQXN5bmNFdmVudEVtaXR0ZXIgZnJvbSAnLi4vdXRpbHMvYXN5bmMtZXZlbnQtZW1pdHRlcic7XG5pbXBvcnQgQnJvd3NlckpvYiBmcm9tICcuL2Jyb3dzZXItam9iJztcbmltcG9ydCBTY3JlZW5zaG90cyBmcm9tICcuLi9zY3JlZW5zaG90cyc7XG5pbXBvcnQgV2FybmluZ0xvZyBmcm9tICcuLi9ub3RpZmljYXRpb25zL3dhcm5pbmctbG9nJztcbmltcG9ydCBGaXh0dXJlSG9va0NvbnRyb2xsZXIgZnJvbSAnLi9maXh0dXJlLWhvb2stY29udHJvbGxlcic7XG5pbXBvcnQgKiBhcyBjbGllbnRTY3JpcHRzUm91dGluZyBmcm9tICcuLi9jdXN0b20tY2xpZW50LXNjcmlwdHMvcm91dGluZyc7XG5pbXBvcnQgVmlkZW9zIGZyb20gJy4uL3ZpZGVvLXJlY29yZGVyL3ZpZGVvcyc7XG5pbXBvcnQgVGVzdFJ1biBmcm9tICcuLi90ZXN0LXJ1bic7XG5pbXBvcnQgeyBQcm94eSB9IGZyb20gJ3Rlc3RjYWZlLWhhbW1lcmhlYWQnO1xuaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gJy4uL2NvbmZpZ3VyYXRpb24vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBBY3Rpb25FdmVudEFyZywgUmVwb3J0ZWRUZXN0U3RydWN0dXJlSXRlbSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgQnJvd3NlckNvbm5lY3Rpb24gZnJvbSAnLi4vYnJvd3Nlci9jb25uZWN0aW9uJztcbmltcG9ydCBUZXN0IGZyb20gJy4uL2FwaS9zdHJ1Y3R1cmUvdGVzdCc7XG5pbXBvcnQgeyBWaWRlb09wdGlvbnMgfSBmcm9tICcuLi92aWRlby1yZWNvcmRlci9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFzayBleHRlbmRzIEFzeW5jRXZlbnRFbWl0dGVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90aW1lU3RhbXA6IG1vbWVudC5Nb21lbnQ7XG4gICAgcHJpdmF0ZSBfcnVubmluZzogYm9vbGVhbjtcbiAgICBwdWJsaWMgYnJvd3NlckNvbm5lY3Rpb25Hcm91cHM6IEJyb3dzZXJDb25uZWN0aW9uW11bXTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgdGVzdHM6IFRlc3RbXTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgb3B0czogRGljdGlvbmFyeTxPcHRpb25WYWx1ZT47XG4gICAgcHJpdmF0ZSByZWFkb25seSBfcHJveHk6IFByb3h5O1xuICAgIHB1YmxpYyByZWFkb25seSB3YXJuaW5nTG9nOiBXYXJuaW5nTG9nO1xuICAgIHB1YmxpYyByZWFkb25seSBzY3JlZW5zaG90czogU2NyZWVuc2hvdHM7XG4gICAgcHVibGljIHJlYWRvbmx5IGZpeHR1cmVIb29rQ29udHJvbGxlcjogRml4dHVyZUhvb2tDb250cm9sbGVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX3BlbmRpbmdCcm93c2VySm9iczogQnJvd3NlckpvYltdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2NsaWVudFNjcmlwdFJvdXRlczogc3RyaW5nW107XG4gICAgcHVibGljIHJlYWRvbmx5IHRlc3RTdHJ1Y3R1cmU6IFJlcG9ydGVkVGVzdFN0cnVjdHVyZUl0ZW1bXTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgdmlkZW9zPzogVmlkZW9zO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yICh0ZXN0czogVGVzdFtdLCBicm93c2VyQ29ubmVjdGlvbkdyb3VwczogQnJvd3NlckNvbm5lY3Rpb25bXVtdLCBwcm94eTogUHJveHksIG9wdHM6IERpY3Rpb25hcnk8T3B0aW9uVmFsdWU+KSB7XG4gICAgICAgIHN1cGVyKHsgY2FwdHVyZVJlamVjdGlvbnM6IHRydWUgfSk7XG5cbiAgICAgICAgdGhpcy5fdGltZVN0YW1wICAgICAgICAgICAgICA9IG1vbWVudCgpO1xuICAgICAgICB0aGlzLl9ydW5uaW5nICAgICAgICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMgPSBicm93c2VyQ29ubmVjdGlvbkdyb3VwcztcbiAgICAgICAgdGhpcy50ZXN0cyAgICAgICAgICAgICAgICAgICA9IHRlc3RzO1xuICAgICAgICB0aGlzLm9wdHMgICAgICAgICAgICAgICAgICAgID0gb3B0cztcbiAgICAgICAgdGhpcy5fcHJveHkgICAgICAgICAgICAgICAgICA9IHByb3h5O1xuICAgICAgICB0aGlzLndhcm5pbmdMb2cgICAgICAgICAgICAgID0gbmV3IFdhcm5pbmdMb2coKTtcblxuICAgICAgICBjb25zdCB7IHBhdGgsIHBhdGhQYXR0ZXJuLCBmdWxsUGFnZSB9ID0gdGhpcy5vcHRzLnNjcmVlbnNob3RzIGFzIFNjcmVlbnNob3RPcHRpb25WYWx1ZTtcblxuICAgICAgICB0aGlzLnNjcmVlbnNob3RzID0gbmV3IFNjcmVlbnNob3RzKHtcbiAgICAgICAgICAgIGVuYWJsZWQ6ICF0aGlzLm9wdHMuZGlzYWJsZVNjcmVlbnNob3RzLFxuICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgIHBhdGhQYXR0ZXJuLFxuICAgICAgICAgICAgZnVsbFBhZ2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5maXh0dXJlSG9va0NvbnRyb2xsZXIgPSBuZXcgRml4dHVyZUhvb2tDb250cm9sbGVyKHRlc3RzLCBicm93c2VyQ29ubmVjdGlvbkdyb3Vwcy5sZW5ndGgpO1xuICAgICAgICB0aGlzLl9wZW5kaW5nQnJvd3NlckpvYnMgICA9IHRoaXMuX2NyZWF0ZUJyb3dzZXJKb2JzKHByb3h5LCB0aGlzLm9wdHMpO1xuICAgICAgICB0aGlzLl9jbGllbnRTY3JpcHRSb3V0ZXMgICA9IGNsaWVudFNjcmlwdHNSb3V0aW5nLnJlZ2lzdGVyKHByb3h5LCB0ZXN0cyk7XG4gICAgICAgIHRoaXMudGVzdFN0cnVjdHVyZSAgICAgICAgID0gdGhpcy5fcHJlcGFyZVRlc3RTdHJ1Y3R1cmUodGVzdHMpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdHMudmlkZW9QYXRoKSB7XG4gICAgICAgICAgICBjb25zdCB7IHZpZGVvUGF0aCwgdmlkZW9PcHRpb25zLCB2aWRlb0VuY29kaW5nT3B0aW9ucyB9ID0gdGhpcy5vcHRzO1xuXG4gICAgICAgICAgICB0aGlzLnZpZGVvcyA9IG5ldyBWaWRlb3ModGhpcy5fcGVuZGluZ0Jyb3dzZXJKb2JzLCB7IHZpZGVvUGF0aCwgdmlkZW9PcHRpb25zLCB2aWRlb0VuY29kaW5nT3B0aW9ucyB9IGFzIHVua25vd24gYXMgVmlkZW9PcHRpb25zLCB0aGlzLndhcm5pbmdMb2csIHRoaXMuX3RpbWVTdGFtcCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9hc3NpZ25Ccm93c2VySm9iRXZlbnRIYW5kbGVycyAoam9iOiBCcm93c2VySm9iKTogdm9pZCB7XG4gICAgICAgIGpvYi5vbigndGVzdC1ydW4tc3RhcnQnLCBhc3luYyAodGVzdFJ1bjogVGVzdFJ1bikgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCd0ZXN0LXJ1bi1zdGFydCcsIHRlc3RSdW4pO1xuICAgICAgICB9KTtcblxuICAgICAgICBqb2Iub24oJ3Rlc3QtcnVuLWRvbmUnLCBhc3luYyAodGVzdFJ1bjogVGVzdFJ1bikgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCd0ZXN0LXJ1bi1kb25lJywgdGVzdFJ1bik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMuc3RvcE9uRmlyc3RGYWlsICYmIHRlc3RSdW4uZXJycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFib3J0KCk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVtaXQoJ2RvbmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgam9iLm9uY2UoJ3N0YXJ0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9ydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCdzdGFydCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBqb2Iub25jZSgnZG9uZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZW1pdCgnYnJvd3Nlci1qb2ItZG9uZScsIGpvYik7XG5cbiAgICAgICAgICAgIHJlbW92ZSh0aGlzLl9wZW5kaW5nQnJvd3NlckpvYnMsIGpvYik7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fcGVuZGluZ0Jyb3dzZXJKb2JzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVtaXQoJ2RvbmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgam9iLm9uKCd0ZXN0LWFjdGlvbi1zdGFydCcsIGFzeW5jIChhcmdzOiBBY3Rpb25FdmVudEFyZykgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCd0ZXN0LWFjdGlvbi1zdGFydCcsIGFyZ3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICBqb2Iub24oJ3Rlc3QtYWN0aW9uLWRvbmUnLCBhc3luYyAoYXJnczogQWN0aW9uRXZlbnRBcmcpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZW1pdCgndGVzdC1hY3Rpb24tZG9uZScsIGFyZ3MpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgX3ByZXBhcmVUZXN0U3RydWN0dXJlICh0ZXN0czogVGVzdFtdKTogUmVwb3J0ZWRUZXN0U3RydWN0dXJlSXRlbVtdIHtcbiAgICAgICAgY29uc3QgZ3JvdXBzID0gZ3JvdXBCeSh0ZXN0cywgJ2ZpeHR1cmUuaWQnKTtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZ3JvdXBzKS5tYXAoZml4dHVyZUlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RzQnlHcm91cCA9IGdyb3Vwc1tmaXh0dXJlSWRdO1xuICAgICAgICAgICAgY29uc3QgZml4dHVyZSAgICAgID0gdGVzdHNCeUdyb3VwWzBdLmZpeHR1cmU7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZml4dHVyZToge1xuICAgICAgICAgICAgICAgICAgICBpZDogICAgZml4dHVyZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogIGZpeHR1cmUubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRlc3RzOiB0ZXN0c0J5R3JvdXAubWFwKHRlc3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogICB0ZXN0LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRlc3QubmFtZSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2tpcDogdGVzdC5za2lwXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NyZWF0ZUJyb3dzZXJKb2JzIChwcm94eTogUHJveHksIG9wdHM6IERpY3Rpb25hcnk8T3B0aW9uVmFsdWU+KTogQnJvd3NlckpvYltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMubWFwKGJyb3dzZXJDb25uZWN0aW9uR3JvdXAgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9iID0gbmV3IEJyb3dzZXJKb2IodGhpcy50ZXN0cywgYnJvd3NlckNvbm5lY3Rpb25Hcm91cCwgcHJveHksIHRoaXMuc2NyZWVuc2hvdHMsIHRoaXMud2FybmluZ0xvZywgdGhpcy5maXh0dXJlSG9va0NvbnRyb2xsZXIsIG9wdHMpO1xuXG4gICAgICAgICAgICB0aGlzLl9hc3NpZ25Ccm93c2VySm9iRXZlbnRIYW5kbGVycyhqb2IpO1xuICAgICAgICAgICAgYnJvd3NlckNvbm5lY3Rpb25Hcm91cC5tYXAoYmMgPT4gYmMuYWRkSm9iKGpvYikpO1xuXG4gICAgICAgICAgICByZXR1cm4gam9iO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5SZWdpc3RlckNsaWVudFNjcmlwdFJvdXRpbmcgKCk6IHZvaWQge1xuICAgICAgICBjbGllbnRTY3JpcHRzUm91dGluZy51blJlZ2lzdGVyKHRoaXMuX3Byb3h5LCB0aGlzLl9jbGllbnRTY3JpcHRSb3V0ZXMpO1xuICAgIH1cblxuICAgIC8vIEFQSVxuICAgIHB1YmxpYyBhYm9ydCAoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdCcm93c2VySm9icy5mb3JFYWNoKGpvYiA9PiBqb2IuYWJvcnQoKSk7XG4gICAgfVxufVxuIl19