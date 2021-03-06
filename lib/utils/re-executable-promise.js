"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Fix https://github.com/DevExpress/testcafe/issues/4139 to get rid of Pinkie
const pinkie_1 = __importDefault(require("pinkie"));
const lodash_1 = require("lodash");
const test_run_tracker_1 = __importDefault(require("../api/test-run-tracker"));
class ReExecutablePromise extends pinkie_1.default {
    constructor(executorFn) {
        super(lodash_1.noop);
        this._fn = executorFn;
        this._taskPromise = null;
    }
    _ensureExecuting() {
        if (!this._taskPromise)
            this._taskPromise = new pinkie_1.default(this._fn);
    }
    _reExecute() {
        this._taskPromise = null;
        return this;
    }
    then(onFulfilled, onRejected) {
        this._ensureExecuting();
        return this._taskPromise.then(onFulfilled, onRejected);
    }
    catch(onRejected) {
        this._ensureExecuting();
        return this._taskPromise.catch(onRejected);
    }
    static fromFn(asyncExecutorFn) {
        const testRunId = test_run_tracker_1.default.getContextTestRunId();
        if (testRunId)
            asyncExecutorFn = test_run_tracker_1.default.addTrackingMarkerToFunction(testRunId, asyncExecutorFn);
        return new ReExecutablePromise(resolve => resolve(asyncExecutorFn()));
    }
}
exports.default = ReExecutablePromise;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmUtZXhlY3V0YWJsZS1wcm9taXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3JlLWV4ZWN1dGFibGUtcHJvbWlzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9GQUFvRjtBQUNwRixvREFBNkI7QUFDN0IsbUNBQThCO0FBQzlCLCtFQUFxRDtBQUVyRCxNQUFxQixtQkFBb0IsU0FBUSxnQkFBTztJQUNwRCxZQUFhLFVBQVU7UUFDbkIsS0FBSyxDQUFDLGFBQUksQ0FBQyxDQUFDO1FBRVosSUFBSSxDQUFDLEdBQUcsR0FBWSxVQUFVLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELGdCQUFnQjtRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksZ0JBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUV6QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxDQUFFLFdBQVcsRUFBRSxVQUFVO1FBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxLQUFLLENBQUUsVUFBVTtRQUNiLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUUsZUFBZTtRQUMxQixNQUFNLFNBQVMsR0FBRywwQkFBYyxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFdkQsSUFBSSxTQUFTO1lBQ1QsZUFBZSxHQUFHLDBCQUFjLENBQUMsMkJBQTJCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBRTdGLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztDQUNKO0FBdkNELHNDQXVDQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRPRE86IEZpeCBodHRwczovL2dpdGh1Yi5jb20vRGV2RXhwcmVzcy90ZXN0Y2FmZS9pc3N1ZXMvNDEzOSB0byBnZXQgcmlkIG9mIFBpbmtpZVxuaW1wb3J0IFByb21pc2UgZnJvbSAncGlua2llJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHRlc3RSdW5UcmFja2VyIGZyb20gJy4uL2FwaS90ZXN0LXJ1bi10cmFja2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVFeGVjdXRhYmxlUHJvbWlzZSBleHRlbmRzIFByb21pc2Uge1xuICAgIGNvbnN0cnVjdG9yIChleGVjdXRvckZuKSB7XG4gICAgICAgIHN1cGVyKG5vb3ApO1xuXG4gICAgICAgIHRoaXMuX2ZuICAgICAgICAgID0gZXhlY3V0b3JGbjtcbiAgICAgICAgdGhpcy5fdGFza1Byb21pc2UgPSBudWxsO1xuICAgIH1cblxuICAgIF9lbnN1cmVFeGVjdXRpbmcgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3Rhc2tQcm9taXNlKVxuICAgICAgICAgICAgdGhpcy5fdGFza1Byb21pc2UgPSBuZXcgUHJvbWlzZSh0aGlzLl9mbik7XG4gICAgfVxuXG4gICAgX3JlRXhlY3V0ZSAoKSB7XG4gICAgICAgIHRoaXMuX3Rhc2tQcm9taXNlID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGVuIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgICAgICB0aGlzLl9lbnN1cmVFeGVjdXRpbmcoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fdGFza1Byb21pc2UudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgfVxuXG4gICAgY2F0Y2ggKG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlRXhlY3V0aW5nKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3Rhc2tQcm9taXNlLmNhdGNoKG9uUmVqZWN0ZWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tRm4gKGFzeW5jRXhlY3V0b3JGbikge1xuICAgICAgICBjb25zdCB0ZXN0UnVuSWQgPSB0ZXN0UnVuVHJhY2tlci5nZXRDb250ZXh0VGVzdFJ1bklkKCk7XG5cbiAgICAgICAgaWYgKHRlc3RSdW5JZClcbiAgICAgICAgICAgIGFzeW5jRXhlY3V0b3JGbiA9IHRlc3RSdW5UcmFja2VyLmFkZFRyYWNraW5nTWFya2VyVG9GdW5jdGlvbih0ZXN0UnVuSWQsIGFzeW5jRXhlY3V0b3JGbik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZUV4ZWN1dGFibGVQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZShhc3luY0V4ZWN1dG9yRm4oKSkpO1xuICAgIH1cbn1cbiJdfQ==