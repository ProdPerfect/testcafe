"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phase_1 = __importDefault(require("../test-run/phase"));
const process_test_fn_error_1 = __importDefault(require("../errors/process-test-fn-error"));
class FixtureHookController {
    constructor(tests, browserConnectionCount) {
        this.fixtureMap = FixtureHookController._createFixtureMap(tests, browserConnectionCount);
    }
    static _ensureFixtureMapItem(fixtureMap, fixture) {
        if (!fixtureMap.has(fixture)) {
            const item = {
                started: false,
                runningFixtureBeforeHook: false,
                fixtureBeforeHookErr: null,
                pendingTestRunCount: 0,
                fixtureCtx: Object.create(null)
            };
            fixtureMap.set(fixture, item);
        }
    }
    static _createFixtureMap(tests, browserConnectionCount) {
        return tests.reduce((fixtureMap, test) => {
            const fixture = test.fixture;
            if (!test.skip) {
                FixtureHookController._ensureFixtureMapItem(fixtureMap, fixture);
                const item = fixtureMap.get(fixture);
                item.pendingTestRunCount += browserConnectionCount;
            }
            return fixtureMap;
        }, new Map());
    }
    _getFixtureMapItem(test) {
        return test.skip ? null : this.fixtureMap.get(test.fixture);
    }
    isTestBlocked(test) {
        const item = this._getFixtureMapItem(test);
        return item && item.runningFixtureBeforeHook;
    }
    async runFixtureBeforeHookIfNecessary(testRun) {
        const fixture = testRun.test.fixture;
        const item = this._getFixtureMapItem(testRun.test);
        if (item) {
            const shouldRunBeforeHook = !item.started && fixture.beforeFn;
            item.started = true;
            if (shouldRunBeforeHook) {
                item.runningFixtureBeforeHook = true;
                try {
                    await fixture.beforeFn(item.fixtureCtx);
                }
                catch (err) {
                    item.fixtureBeforeHookErr = process_test_fn_error_1.default(err);
                }
                item.runningFixtureBeforeHook = false;
            }
            // NOTE: fail all tests in fixture if fixture.before hook has error
            if (item.fixtureBeforeHookErr) {
                testRun.phase = phase_1.default.inFixtureBeforeHook;
                testRun.addError(item.fixtureBeforeHookErr);
                return false;
            }
            testRun.fixtureCtx = item.fixtureCtx;
        }
        return true;
    }
    async runFixtureAfterHookIfNecessary(testRun) {
        const fixture = testRun.test.fixture;
        const item = this._getFixtureMapItem(testRun.test);
        if (item) {
            item.pendingTestRunCount--;
            if (item.pendingTestRunCount === 0 && fixture.afterFn) {
                testRun.phase = phase_1.default.inFixtureAfterHook;
                try {
                    await fixture.afterFn(item.fixtureCtx);
                }
                catch (err) {
                    testRun.addError(process_test_fn_error_1.default(err));
                }
            }
        }
    }
}
exports.default = FixtureHookController;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4dHVyZS1ob29rLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnVubmVyL2ZpeHR1cmUtaG9vay1jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQStDO0FBQy9DLDRGQUFpRTtBQUVqRSxNQUFxQixxQkFBcUI7SUFDdEMsWUFBYSxLQUFLLEVBQUUsc0JBQXNCO1FBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcscUJBQXFCLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLHNCQUFzQixDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBRSxVQUFVLEVBQUUsT0FBTztRQUM3QyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMxQixNQUFNLElBQUksR0FBRztnQkFDVCxPQUFPLEVBQW1CLEtBQUs7Z0JBQy9CLHdCQUF3QixFQUFFLEtBQUs7Z0JBQy9CLG9CQUFvQixFQUFNLElBQUk7Z0JBQzlCLG1CQUFtQixFQUFPLENBQUM7Z0JBQzNCLFVBQVUsRUFBZ0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDaEQsQ0FBQztZQUVGLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBRSxLQUFLLEVBQUUsc0JBQXNCO1FBQ25ELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBRTdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNaLHFCQUFxQixDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFakUsTUFBTSxJQUFJLEdB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dGVzdC1ydW4vcGhhc2UnO1xuaW1wb3J0IHByb2Nlc3NUZXN0Rm5FcnJvciBmcm9tICcuLi9lcnJvcnMvcHJvY2Vzcy10ZXN0LWZuLWVycm9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRml4dHVyZUhvb2tDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvciAodGVzdHMsIGJyb3dzZXJDb25uZWN0aW9uQ291bnQpIHtcbiAgICAgICAgdGhpcy5maXh0dXJlTWFwID0gRml4dHVyZUhvb2tDb250cm9sbGVyLl9jcmVhdGVGaXh0dXJlTWFwKHRlc3RzLCBicm93c2VyQ29ubmVjdGlvbkNvdW50KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2Vuc3VyZUZpeHR1cmVNYXBJdGVtIChmaXh0dXJlTWFwLCBmaXh0dXJlKSB7XG4gICAgICAgIGlmICghZml4dHVyZU1hcC5oYXMoZml4dHVyZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgc3RhcnRlZDogICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICBydW5uaW5nRml4dHVyZUJlZm9yZUhvb2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZpeHR1cmVCZWZvcmVIb29rRXJyOiAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBwZW5kaW5nVGVzdFJ1bkNvdW50OiAgICAgIDAsXG4gICAgICAgICAgICAgICAgZml4dHVyZUN0eDogICAgICAgICAgICAgICBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmaXh0dXJlTWFwLnNldChmaXh0dXJlLCBpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBfY3JlYXRlRml4dHVyZU1hcCAodGVzdHMsIGJyb3dzZXJDb25uZWN0aW9uQ291bnQpIHtcbiAgICAgICAgcmV0dXJuIHRlc3RzLnJlZHVjZSgoZml4dHVyZU1hcCwgdGVzdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZml4dHVyZSA9IHRlc3QuZml4dHVyZTtcblxuICAgICAgICAgICAgaWYgKCF0ZXN0LnNraXApIHtcbiAgICAgICAgICAgICAgICBGaXh0dXJlSG9va0NvbnRyb2xsZXIuX2Vuc3VyZUZpeHR1cmVNYXBJdGVtKGZpeHR1cmVNYXAsIGZpeHR1cmUpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGZpeHR1cmVNYXAuZ2V0KGZpeHR1cmUpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5wZW5kaW5nVGVzdFJ1bkNvdW50ICs9IGJyb3dzZXJDb25uZWN0aW9uQ291bnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmaXh0dXJlTWFwO1xuICAgICAgICB9LCBuZXcgTWFwKCkpO1xuICAgIH1cblxuICAgIF9nZXRGaXh0dXJlTWFwSXRlbSAodGVzdCkge1xuICAgICAgICByZXR1cm4gdGVzdC5za2lwID8gbnVsbCA6IHRoaXMuZml4dHVyZU1hcC5nZXQodGVzdC5maXh0dXJlKTtcbiAgICB9XG5cbiAgICBpc1Rlc3RCbG9ja2VkICh0ZXN0KSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9nZXRGaXh0dXJlTWFwSXRlbSh0ZXN0KTtcblxuICAgICAgICByZXR1cm4gaXRlbSAmJiBpdGVtLnJ1bm5pbmdGaXh0dXJlQmVmb3JlSG9vaztcbiAgICB9XG5cbiAgICBhc3luYyBydW5GaXh0dXJlQmVmb3JlSG9va0lmTmVjZXNzYXJ5ICh0ZXN0UnVuKSB7XG4gICAgICAgIGNvbnN0IGZpeHR1cmUgPSB0ZXN0UnVuLnRlc3QuZml4dHVyZTtcbiAgICAgICAgY29uc3QgaXRlbSAgICA9IHRoaXMuX2dldEZpeHR1cmVNYXBJdGVtKHRlc3RSdW4udGVzdCk7XG5cbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZFJ1bkJlZm9yZUhvb2sgPSAhaXRlbS5zdGFydGVkICYmIGZpeHR1cmUuYmVmb3JlRm47XG5cbiAgICAgICAgICAgIGl0ZW0uc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChzaG91bGRSdW5CZWZvcmVIb29rKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5ydW5uaW5nRml4dHVyZUJlZm9yZUhvb2sgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZml4dHVyZS5iZWZvcmVGbihpdGVtLmZpeHR1cmVDdHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZml4dHVyZUJlZm9yZUhvb2tFcnIgPSBwcm9jZXNzVGVzdEZuRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpdGVtLnJ1bm5pbmdGaXh0dXJlQmVmb3JlSG9vayA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBOT1RFOiBmYWlsIGFsbCB0ZXN0cyBpbiBmaXh0dXJlIGlmIGZpeHR1cmUuYmVmb3JlIGhvb2sgaGFzIGVycm9yXG4gICAgICAgICAgICBpZiAoaXRlbS5maXh0dXJlQmVmb3JlSG9va0Vycikge1xuICAgICAgICAgICAgICAgIHRlc3RSdW4ucGhhc2UgPSBURVNUX1JVTl9QSEFTRS5pbkZpeHR1cmVCZWZvcmVIb29rO1xuXG4gICAgICAgICAgICAgICAgdGVzdFJ1bi5hZGRFcnJvcihpdGVtLmZpeHR1cmVCZWZvcmVIb29rRXJyKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGVzdFJ1bi5maXh0dXJlQ3R4ID0gaXRlbS5maXh0dXJlQ3R4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgcnVuRml4dHVyZUFmdGVySG9va0lmTmVjZXNzYXJ5ICh0ZXN0UnVuKSB7XG4gICAgICAgIGNvbnN0IGZpeHR1cmUgPSB0ZXN0UnVuLnRlc3QuZml4dHVyZTtcbiAgICAgICAgY29uc3QgaXRlbSAgICA9IHRoaXMuX2dldEZpeHR1cmVNYXBJdGVtKHRlc3RSdW4udGVzdCk7XG5cbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW0ucGVuZGluZ1Rlc3RSdW5Db3VudC0tO1xuXG4gICAgICAgICAgICBpZiAoaXRlbS5wZW5kaW5nVGVzdFJ1bkNvdW50ID09PSAwICYmIGZpeHR1cmUuYWZ0ZXJGbikge1xuICAgICAgICAgICAgICAgIHRlc3RSdW4ucGhhc2UgPSBURVNUX1JVTl9QSEFTRS5pbkZpeHR1cmVBZnRlckhvb2s7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaXh0dXJlLmFmdGVyRm4oaXRlbS5maXh0dXJlQ3R4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0ZXN0UnVuLmFkZEVycm9yKHByb2Nlc3NUZXN0Rm5FcnJvcihlcnIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=