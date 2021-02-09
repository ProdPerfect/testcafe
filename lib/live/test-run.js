"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRunCtorFactory = void 0;
const test_run_1 = __importDefault(require("../test-run"));
const test_run_state_1 = __importDefault(require("./test-run-state"));
const type_1 = __importDefault(require("../test-run/commands/type"));
const service_1 = require("../test-run/commands/service");
const TEST_RUN_ABORTED_MESSAGE = 'The test run has been aborted.';
exports.TestRunCtorFactory = function (callbacks) {
    const { created, done, readyToNext } = callbacks;
    return class LiveModeTestRun extends test_run_1.default {
        constructor(test, browserConnection, screenshotCapturer, warningLog, opts) {
            super(test, browserConnection, screenshotCapturer, warningLog, opts);
            created(this, test);
            this.state = test_run_state_1.default.created;
            this.finish = null;
            this.stopping = false;
            this.isInRoleInitializing = false;
            this.stopped = false;
        }
        stop() {
            this.stopped = true;
        }
        _useRole(...args) {
            this.isInRoleInitializing = true;
            return super._useRole.apply(this, args)
                .then(res => {
                this.isInRoleInitializing = false;
                return res;
            })
                .catch(err => {
                this.isInRoleInitializing = false;
                throw err;
            });
        }
        executeCommand(commandToExec, callsite, forced) {
            // NOTE: don't close the page and the session when the last test in the queue is done
            if (commandToExec.type === type_1.default.testDone && !forced) {
                done(this, this.stopped)
                    .then(() => this.executeCommand(commandToExec, callsite, true))
                    .then(() => readyToNext(this));
                this.executeCommand(new service_1.UnlockPageCommand(), null);
                return Promise.resolve();
            }
            if (this.stopped && !this.stopping &&
                !this.isInRoleInitializing) {
                this.stopping = true;
                return Promise.reject(new Error(TEST_RUN_ABORTED_MESSAGE));
            }
            return super.executeCommand(commandToExec, callsite);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1ydW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGl2ZS90ZXN0LXJ1bi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyREFBa0M7QUFDbEMsc0VBQThDO0FBQzlDLHFFQUFxRDtBQUNyRCwwREFBaUU7QUFFakUsTUFBTSx3QkFBd0IsR0FBRyxnQ0FBZ0MsQ0FBQztBQUVyRCxRQUFBLGtCQUFrQixHQUFHLFVBQVUsU0FBUztJQUNqRCxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxTQUFTLENBQUM7SUFFakQsT0FBTyxNQUFNLGVBQWdCLFNBQVEsa0JBQU87UUFDeEMsWUFBYSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLElBQUk7WUFDdEUsS0FBSyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFckUsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVwQixJQUFJLENBQUMsS0FBSyxHQUFrQix3QkFBYyxDQUFDLE9BQU8sQ0FBQztZQUNuRCxJQUFJLENBQUMsTUFBTSxHQUFpQixJQUFJLENBQUM7WUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBZSxLQUFLLENBQUM7WUFDbEMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztZQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFnQixLQUFLLENBQUM7UUFDdEMsQ0FBQztRQUVELElBQUk7WUFDQSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUN4QixDQUFDO1FBRUQsUUFBUSxDQUFFLEdBQUcsSUFBSTtZQUNiLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7WUFFakMsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2lCQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztnQkFFbEMsT0FBTyxHQUFHLENBQUM7WUFDZixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNULElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7Z0JBRWxDLE1BQU0sR0FBRyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUQsY0FBYyxDQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTTtZQUMzQyxxRkFBcUY7WUFDckYsSUFBSSxhQUFhLENBQUMsSUFBSSxLQUFLLGNBQVksQ0FBQyxRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3pELElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztxQkFDbkIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDOUQsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUVuQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksMkJBQWlCLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFbkQsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDNUI7WUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtnQkFDOUIsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUVyQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO2FBQzlEO1lBRUQsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6RCxDQUFDO0tBQ0osQ0FBQztBQUNOLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXN0UnVuIGZyb20gJy4uL3Rlc3QtcnVuJztcbmltcG9ydCBURVNUX1JVTl9TVEFURSBmcm9tICcuL3Rlc3QtcnVuLXN0YXRlJztcbmltcG9ydCBDT01NQU5EX1RZUEUgZnJvbSAnLi4vdGVzdC1ydW4vY29tbWFuZHMvdHlwZSc7XG5pbXBvcnQgeyBVbmxvY2tQYWdlQ29tbWFuZCB9IGZyb20gJy4uL3Rlc3QtcnVuL2NvbW1hbmRzL3NlcnZpY2UnO1xuXG5jb25zdCBURVNUX1JVTl9BQk9SVEVEX01FU1NBR0UgPSAnVGhlIHRlc3QgcnVuIGhhcyBiZWVuIGFib3J0ZWQuJztcblxuZXhwb3J0IGNvbnN0IFRlc3RSdW5DdG9yRmFjdG9yeSA9IGZ1bmN0aW9uIChjYWxsYmFja3MpIHtcbiAgICBjb25zdCB7IGNyZWF0ZWQsIGRvbmUsIHJlYWR5VG9OZXh0IH0gPSBjYWxsYmFja3M7XG5cbiAgICByZXR1cm4gY2xhc3MgTGl2ZU1vZGVUZXN0UnVuIGV4dGVuZHMgVGVzdFJ1biB7XG4gICAgICAgIGNvbnN0cnVjdG9yICh0ZXN0LCBicm93c2VyQ29ubmVjdGlvbiwgc2NyZWVuc2hvdENhcHR1cmVyLCB3YXJuaW5nTG9nLCBvcHRzKSB7XG4gICAgICAgICAgICBzdXBlcih0ZXN0LCBicm93c2VyQ29ubmVjdGlvbiwgc2NyZWVuc2hvdENhcHR1cmVyLCB3YXJuaW5nTG9nLCBvcHRzKTtcblxuICAgICAgICAgICAgY3JlYXRlZCh0aGlzLCB0ZXN0KTtcblxuICAgICAgICAgICAgdGhpcy5zdGF0ZSAgICAgICAgICAgICAgICA9IFRFU1RfUlVOX1NUQVRFLmNyZWF0ZWQ7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCAgICAgICAgICAgICAgID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuc3RvcHBpbmcgICAgICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNJblJvbGVJbml0aWFsaXppbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3RvcHBlZCAgICAgICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AgKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF91c2VSb2xlICguLi5hcmdzKSB7XG4gICAgICAgICAgICB0aGlzLmlzSW5Sb2xlSW5pdGlhbGl6aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl91c2VSb2xlLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0luUm9sZUluaXRpYWxpemluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0luUm9sZUluaXRpYWxpemluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4ZWN1dGVDb21tYW5kIChjb21tYW5kVG9FeGVjLCBjYWxsc2l0ZSwgZm9yY2VkKSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBkb24ndCBjbG9zZSB0aGUgcGFnZSBhbmQgdGhlIHNlc3Npb24gd2hlbiB0aGUgbGFzdCB0ZXN0IGluIHRoZSBxdWV1ZSBpcyBkb25lXG4gICAgICAgICAgICBpZiAoY29tbWFuZFRvRXhlYy50eXBlID09PSBDT01NQU5EX1RZUEUudGVzdERvbmUgJiYgIWZvcmNlZCkge1xuICAgICAgICAgICAgICAgIGRvbmUodGhpcywgdGhpcy5zdG9wcGVkKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLmV4ZWN1dGVDb21tYW5kKGNvbW1hbmRUb0V4ZWMsIGNhbGxzaXRlLCB0cnVlKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVhZHlUb05leHQodGhpcykpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZChuZXcgVW5sb2NrUGFnZUNvbW1hbmQoKSwgbnVsbCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnN0b3BwZWQgJiYgIXRoaXMuc3RvcHBpbmcgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5pc0luUm9sZUluaXRpYWxpemluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcHBpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihURVNUX1JVTl9BQk9SVEVEX01FU1NBR0UpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmV4ZWN1dGVDb21tYW5kKGNvbW1hbmRUb0V4ZWMsIGNhbGxzaXRlKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIl19