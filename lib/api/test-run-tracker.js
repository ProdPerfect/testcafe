"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const callsite_1 = __importDefault(require("callsite"));
const promise_1 = __importDefault(require("babel-runtime/core-js/promise"));
const TRACKING_MARK_RE = /^\$\$testcafe_test_run\$\$(\S+)\$\$$/;
const STACK_CAPACITY = 5000;
// Tracker
exports.default = {
    enabled: false,
    activeTestRuns: {},
    _createContextSwitchingFunctionHook(ctxSwitchingFn, patchedArgsCount) {
        const tracker = this;
        return function () {
            const testRunId = tracker.getContextTestRunId();
            if (testRunId) {
                for (let i = 0; i < patchedArgsCount; i++) {
                    if (typeof arguments[i] === 'function')
                        arguments[i] = tracker.addTrackingMarkerToFunction(testRunId, arguments[i]);
                }
            }
            return ctxSwitchingFn.apply(this, arguments);
        };
    },
    _getStackFrames() {
        // NOTE: increase stack capacity to seek deep stack entries
        const savedLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = STACK_CAPACITY;
        const frames = callsite_1.default();
        Error.stackTraceLimit = savedLimit;
        return frames;
    },
    ensureEnabled() {
        if (!this.enabled) {
            global.setTimeout = this._createContextSwitchingFunctionHook(global.setTimeout, 1);
            global.setInterval = this._createContextSwitchingFunctionHook(global.setInterval, 1);
            global.setImmediate = this._createContextSwitchingFunctionHook(global.setImmediate, 1);
            process.nextTick = this._createContextSwitchingFunctionHook(process.nextTick, 1);
            promise_1.default.prototype.then = this._createContextSwitchingFunctionHook(promise_1.default.prototype.then, 2);
            promise_1.default.prototype.catch = this._createContextSwitchingFunctionHook(promise_1.default.prototype.catch, 1);
            if (global.Promise) {
                global.Promise.prototype.then = this._createContextSwitchingFunctionHook(global.Promise.prototype.then, 2);
                global.Promise.prototype.catch = this._createContextSwitchingFunctionHook(global.Promise.prototype.catch, 1);
            }
            this.enabled = true;
        }
    },
    addTrackingMarkerToFunction(testRunId, fn) {
        const markerFactoryBody = `
            return function $$testcafe_test_run$$${testRunId}$$ () {
                switch (arguments.length) {
                    case 0: return fn.call(this);
                    case 1: return fn.call(this, arguments[0]);
                    case 2: return fn.call(this, arguments[0], arguments[1]);
                    case 3: return fn.call(this, arguments[0], arguments[1], arguments[2]);
                    case 4: return fn.call(this, arguments[0], arguments[1], arguments[2], arguments[3]);
                    default: return fn.apply(this, arguments);
                }
            };
        `;
        return new Function('fn', markerFactoryBody)(fn);
    },
    getContextTestRunId() {
        const frames = this._getStackFrames();
        // OPTIMIZATION: we start traversing from the bottom of the stack,
        // because we'll more likely encounter a marker there.
        // Async/await and Promise machinery executes lots of intrinsics
        // on timers (where we have a marker). And, since a timer initiates a new
        // stack, the marker will be at the very bottom of it.
        for (let i = frames.length - 1; i >= 0; i--) {
            const fnName = frames[i].getFunctionName();
            const match = fnName && fnName.match(TRACKING_MARK_RE);
            if (match)
                return match[1];
        }
        return null;
    },
    resolveContextTestRun() {
        const testRunId = this.getContextTestRunId();
        return this.activeTestRuns[testRunId];
    }
};
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1ydW4tdHJhY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvdGVzdC1ydW4tdHJhY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUFzQztBQUN0Qyw0RUFBeUQ7QUFFekQsTUFBTSxnQkFBZ0IsR0FBRyxzQ0FBc0MsQ0FBQztBQUNoRSxNQUFNLGNBQWMsR0FBSyxJQUFJLENBQUM7QUFFOUIsVUFBVTtBQUNWLGtCQUFlO0lBQ1gsT0FBTyxFQUFFLEtBQUs7SUFFZCxjQUFjLEVBQUUsRUFBRTtJQUVsQixtQ0FBbUMsQ0FBRSxjQUFjLEVBQUUsZ0JBQWdCO1FBQ2pFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQztRQUVyQixPQUFPO1lBQ0gsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFFaEQsSUFBSSxTQUFTLEVBQUU7Z0JBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN2QyxJQUFJLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVU7d0JBQ2xDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuRjthQUNKO1lBRUQsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsZUFBZTtRQUNYLDJEQUEyRDtRQUMzRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO1FBRXpDLEtBQUssQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBRXZDLE1BQU0sTUFBTSxHQUFHLGtCQUFjLEVBQUUsQ0FBQztRQUVoQyxLQUFLLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQztRQUVuQyxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsYUFBYTtRQUNULElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2YsTUFBTSxDQUFDLFVBQVUsR0FBSyxJQUFJLENBQUMsbUNBQW1DLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyRixNQUFNLENBQUMsV0FBVyxHQUFJLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RGLE1BQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkYsT0FBTyxDQUFDLFFBQVEsR0FBTSxJQUFJLENBQUMsbUNBQW1DLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVwRixpQkFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUksSUFBSSxDQUFDLG1DQUFtQyxDQUFDLGlCQUFZLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4RyxpQkFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLGlCQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUV6RyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBSSxJQUFJLENBQUMsbUNBQW1DLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM1RyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNoSDtZQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCO0lBQ0wsQ0FBQztJQUVELDJCQUEyQixDQUFFLFNBQVMsRUFBRSxFQUFFO1FBQ3RDLE1BQU0saUJBQWlCLEdBQUc7bURBQ2lCLFNBQVM7Ozs7Ozs7Ozs7U0FVbkQsQ0FBQztRQUVGLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELG1CQUFtQjtRQUNmLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUV0QyxrRUFBa0U7UUFDbEUsc0RBQXNEO1FBQ3RELGdFQUFnRTtRQUNoRSx5RUFBeUU7UUFDekUsc0RBQXNEO1FBQ3RELEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDM0MsTUFBTSxLQUFLLEdBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUV4RCxJQUFJLEtBQUs7Z0JBQ0wsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQscUJBQXFCO1FBQ2pCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRTdDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZXRTdGFja0ZyYW1lcyBmcm9tICdjYWxsc2l0ZSc7XG5pbXBvcnQgQmFiZWxQcm9taXNlIGZyb20gJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlJztcblxuY29uc3QgVFJBQ0tJTkdfTUFSS19SRSA9IC9eXFwkXFwkdGVzdGNhZmVfdGVzdF9ydW5cXCRcXCQoXFxTKylcXCRcXCQkLztcbmNvbnN0IFNUQUNLX0NBUEFDSVRZICAgPSA1MDAwO1xuXG4vLyBUcmFja2VyXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG5cbiAgICBhY3RpdmVUZXN0UnVuczoge30sXG5cbiAgICBfY3JlYXRlQ29udGV4dFN3aXRjaGluZ0Z1bmN0aW9uSG9vayAoY3R4U3dpdGNoaW5nRm4sIHBhdGNoZWRBcmdzQ291bnQpIHtcbiAgICAgICAgY29uc3QgdHJhY2tlciA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RSdW5JZCA9IHRyYWNrZXIuZ2V0Q29udGV4dFRlc3RSdW5JZCgpO1xuXG4gICAgICAgICAgICBpZiAodGVzdFJ1bklkKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRjaGVkQXJnc0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbaV0gPSB0cmFja2VyLmFkZFRyYWNraW5nTWFya2VyVG9GdW5jdGlvbih0ZXN0UnVuSWQsIGFyZ3VtZW50c1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3R4U3dpdGNoaW5nRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2dldFN0YWNrRnJhbWVzICgpIHtcbiAgICAgICAgLy8gTk9URTogaW5jcmVhc2Ugc3RhY2sgY2FwYWNpdHkgdG8gc2VlayBkZWVwIHN0YWNrIGVudHJpZXNcbiAgICAgICAgY29uc3Qgc2F2ZWRMaW1pdCA9IEVycm9yLnN0YWNrVHJhY2VMaW1pdDtcblxuICAgICAgICBFcnJvci5zdGFja1RyYWNlTGltaXQgPSBTVEFDS19DQVBBQ0lUWTtcblxuICAgICAgICBjb25zdCBmcmFtZXMgPSBnZXRTdGFja0ZyYW1lcygpO1xuXG4gICAgICAgIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IHNhdmVkTGltaXQ7XG5cbiAgICAgICAgcmV0dXJuIGZyYW1lcztcbiAgICB9LFxuXG4gICAgZW5zdXJlRW5hYmxlZCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkKSB7XG4gICAgICAgICAgICBnbG9iYWwuc2V0VGltZW91dCAgID0gdGhpcy5fY3JlYXRlQ29udGV4dFN3aXRjaGluZ0Z1bmN0aW9uSG9vayhnbG9iYWwuc2V0VGltZW91dCwgMSk7XG4gICAgICAgICAgICBnbG9iYWwuc2V0SW50ZXJ2YWwgID0gdGhpcy5fY3JlYXRlQ29udGV4dFN3aXRjaGluZ0Z1bmN0aW9uSG9vayhnbG9iYWwuc2V0SW50ZXJ2YWwsIDEpO1xuICAgICAgICAgICAgZ2xvYmFsLnNldEltbWVkaWF0ZSA9IHRoaXMuX2NyZWF0ZUNvbnRleHRTd2l0Y2hpbmdGdW5jdGlvbkhvb2soZ2xvYmFsLnNldEltbWVkaWF0ZSwgMSk7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrICAgID0gdGhpcy5fY3JlYXRlQ29udGV4dFN3aXRjaGluZ0Z1bmN0aW9uSG9vayhwcm9jZXNzLm5leHRUaWNrLCAxKTtcblxuICAgICAgICAgICAgQmFiZWxQcm9taXNlLnByb3RvdHlwZS50aGVuICA9IHRoaXMuX2NyZWF0ZUNvbnRleHRTd2l0Y2hpbmdGdW5jdGlvbkhvb2soQmFiZWxQcm9taXNlLnByb3RvdHlwZS50aGVuLCAyKTtcbiAgICAgICAgICAgIEJhYmVsUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSB0aGlzLl9jcmVhdGVDb250ZXh0U3dpdGNoaW5nRnVuY3Rpb25Ib29rKEJhYmVsUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gsIDEpO1xuXG4gICAgICAgICAgICBpZiAoZ2xvYmFsLlByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBnbG9iYWwuUHJvbWlzZS5wcm90b3R5cGUudGhlbiAgPSB0aGlzLl9jcmVhdGVDb250ZXh0U3dpdGNoaW5nRnVuY3Rpb25Ib29rKGdsb2JhbC5Qcm9taXNlLnByb3RvdHlwZS50aGVuLCAyKTtcbiAgICAgICAgICAgICAgICBnbG9iYWwuUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSB0aGlzLl9jcmVhdGVDb250ZXh0U3dpdGNoaW5nRnVuY3Rpb25Ib29rKGdsb2JhbC5Qcm9taXNlLnByb3RvdHlwZS5jYXRjaCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRkVHJhY2tpbmdNYXJrZXJUb0Z1bmN0aW9uICh0ZXN0UnVuSWQsIGZuKSB7XG4gICAgICAgIGNvbnN0IG1hcmtlckZhY3RvcnlCb2R5ID0gYFxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICQkdGVzdGNhZmVfdGVzdF9ydW4kJCR7dGVzdFJ1bklkfSQkICgpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gZm4uY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gZm4uY2FsbCh0aGlzLCBhcmd1bWVudHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiBmbi5jYWxsKHRoaXMsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gZm4uY2FsbCh0aGlzLCBhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gZm4uY2FsbCh0aGlzLCBhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdLCBhcmd1bWVudHNbM10pO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICBgO1xuXG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ2ZuJywgbWFya2VyRmFjdG9yeUJvZHkpKGZuKTtcbiAgICB9LFxuXG4gICAgZ2V0Q29udGV4dFRlc3RSdW5JZCAoKSB7XG4gICAgICAgIGNvbnN0IGZyYW1lcyA9IHRoaXMuX2dldFN0YWNrRnJhbWVzKCk7XG5cbiAgICAgICAgLy8gT1BUSU1JWkFUSU9OOiB3ZSBzdGFydCB0cmF2ZXJzaW5nIGZyb20gdGhlIGJvdHRvbSBvZiB0aGUgc3RhY2ssXG4gICAgICAgIC8vIGJlY2F1c2Ugd2UnbGwgbW9yZSBsaWtlbHkgZW5jb3VudGVyIGEgbWFya2VyIHRoZXJlLlxuICAgICAgICAvLyBBc3luYy9hd2FpdCBhbmQgUHJvbWlzZSBtYWNoaW5lcnkgZXhlY3V0ZXMgbG90cyBvZiBpbnRyaW5zaWNzXG4gICAgICAgIC8vIG9uIHRpbWVycyAod2hlcmUgd2UgaGF2ZSBhIG1hcmtlcikuIEFuZCwgc2luY2UgYSB0aW1lciBpbml0aWF0ZXMgYSBuZXdcbiAgICAgICAgLy8gc3RhY2ssIHRoZSBtYXJrZXIgd2lsbCBiZSBhdCB0aGUgdmVyeSBib3R0b20gb2YgaXQuXG4gICAgICAgIGZvciAobGV0IGkgPSBmcmFtZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGZuTmFtZSA9IGZyYW1lc1tpXS5nZXRGdW5jdGlvbk5hbWUoKTtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoICA9IGZuTmFtZSAmJiBmbk5hbWUubWF0Y2goVFJBQ0tJTkdfTUFSS19SRSk7XG5cbiAgICAgICAgICAgIGlmIChtYXRjaClcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVzb2x2ZUNvbnRleHRUZXN0UnVuICgpIHtcbiAgICAgICAgY29uc3QgdGVzdFJ1bklkID0gdGhpcy5nZXRDb250ZXh0VGVzdFJ1bklkKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlVGVzdFJ1bnNbdGVzdFJ1bklkXTtcbiAgICB9XG59O1xuIl19