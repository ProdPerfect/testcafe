"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const delay_1 = __importDefault(require("../utils/delay"));
const thennable_1 = require("../utils/thennable");
const test_run_1 = require("../errors/test-run");
const re_executable_promise_1 = __importDefault(require("../utils/re-executable-promise"));
const get_fn_1 = __importDefault(require("./get-fn"));
const ASSERTION_DELAY = 200;
class AssertionExecutor extends events_1.EventEmitter {
    constructor(command, timeout, callsite) {
        super();
        this.command = command;
        this.timeout = timeout;
        this.callsite = callsite;
        this.startTime = null;
        this.passed = false;
        this.inRetry = false;
        const fn = get_fn_1.default(this.command);
        const actualCommand = this.command.actual;
        if (actualCommand instanceof re_executable_promise_1.default)
            this.fn = this._wrapFunction(fn);
        else if (!this.command.options.allowUnawaitedPromise && thennable_1.isThennable(actualCommand))
            throw new test_run_1.AssertionUnawaitedPromiseError(this.callsite);
        else
            this.fn = fn;
    }
    _getTimeLeft() {
        return this.timeout - (new Date() - this.startTime);
    }
    _onExecutionFinished() {
        if (this.inRetry)
            this.emit('end-assertion-retries', this.passed);
    }
    _wrapFunction(fn) {
        return async () => {
            const resultPromise = this.command.actual;
            while (!this.passed) {
                this.command.actual = await resultPromise._reExecute();
                try {
                    fn();
                    this.passed = true;
                    this._onExecutionFinished();
                }
                catch (err) {
                    if (this._getTimeLeft() <= 0) {
                        this._onExecutionFinished();
                        throw err;
                    }
                    await delay_1.default(ASSERTION_DELAY);
                    this.inRetry = true;
                    this.emit('start-assertion-retries', this._getTimeLeft());
                }
            }
        };
    }
    async run() {
        this.startTime = new Date();
        try {
            await this.fn();
        }
        catch (err) {
            if (err.name === 'AssertionError' || err.constructor.name === 'AssertionError')
                throw new test_run_1.ExternalAssertionLibraryError(err, this.callsite);
            if (err.isTestCafeError)
                err.callsite = this.callsite;
            throw err;
        }
    }
}
exports.default = AssertionExecutor;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXNzZXJ0aW9ucy9leGVjdXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1DQUFzQztBQUN0QywyREFBbUM7QUFDbkMsa0RBQWlEO0FBQ2pELGlEQUFtRztBQUNuRywyRkFBaUU7QUFDakUsc0RBQTZCO0FBRTdCLE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQztBQUU1QixNQUFxQixpQkFBa0IsU0FBUSxxQkFBWTtJQUN2RCxZQUFhLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUTtRQUNuQyxLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxPQUFPLEdBQUksT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUksT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQU0sS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUssS0FBSyxDQUFDO1FBRXZCLE1BQU0sRUFBRSxHQUFjLGdCQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBRTFDLElBQUksYUFBYSxZQUFZLCtCQUFtQjtZQUM1QyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLHFCQUFxQixJQUFJLHVCQUFXLENBQUMsYUFBYSxDQUFDO1lBQzlFLE1BQU0sSUFBSSx5Q0FBOEIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O1lBRXhELElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxZQUFZO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELG9CQUFvQjtRQUNoQixJQUFJLElBQUksQ0FBQyxPQUFPO1lBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELGFBQWEsQ0FBRSxFQUFFO1FBQ2IsT0FBTyxLQUFLLElBQUksRUFBRTtZQUNkLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBRTFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFFdkQsSUFBSTtvQkFDQSxFQUFFLEVBQUUsQ0FBQztvQkFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDbkIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7aUJBQy9CO2dCQUVELE9BQU8sR0FBRyxFQUFFO29CQUNSLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBRTt3QkFDMUIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7d0JBQzVCLE1BQU0sR0FBRyxDQUFDO3FCQUNiO29CQUVELE1BQU0sZUFBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUU3QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztpQkFDN0Q7YUFDSjtRQUNMLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRztRQUNMLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUU1QixJQUFJO1lBQ0EsTUFBTSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDbkI7UUFFRCxPQUFPLEdBQUcsRUFBRTtZQUNSLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxnQkFBZ0IsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxnQkFBZ0I7Z0JBQzFFLE1BQU0sSUFBSSx3Q0FBNkIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWhFLElBQUksR0FBRyxDQUFDLGVBQWU7Z0JBQ25CLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUVqQyxNQUFNLEdBQUcsQ0FBQztTQUNiO0lBQ0wsQ0FBQztDQUNKO0FBN0VELG9DQTZFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgZGVsYXkgZnJvbSAnLi4vdXRpbHMvZGVsYXknO1xuaW1wb3J0IHsgaXNUaGVubmFibGUgfSBmcm9tICcuLi91dGlscy90aGVubmFibGUnO1xuaW1wb3J0IHsgRXh0ZXJuYWxBc3NlcnRpb25MaWJyYXJ5RXJyb3IsIEFzc2VydGlvblVuYXdhaXRlZFByb21pc2VFcnJvciB9IGZyb20gJy4uL2Vycm9ycy90ZXN0LXJ1bic7XG5pbXBvcnQgUmVFeGVjdXRhYmxlUHJvbWlzZSBmcm9tICcuLi91dGlscy9yZS1leGVjdXRhYmxlLXByb21pc2UnO1xuaW1wb3J0IGdldEZuIGZyb20gJy4vZ2V0LWZuJztcblxuY29uc3QgQVNTRVJUSU9OX0RFTEFZID0gMjAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3NlcnRpb25FeGVjdXRvciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IgKGNvbW1hbmQsIHRpbWVvdXQsIGNhbGxzaXRlKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5jb21tYW5kICA9IGNvbW1hbmQ7XG4gICAgICAgIHRoaXMudGltZW91dCAgPSB0aW1lb3V0O1xuICAgICAgICB0aGlzLmNhbGxzaXRlID0gY2FsbHNpdGU7XG5cbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnBhc3NlZCAgICA9IGZhbHNlO1xuICAgICAgICB0aGlzLmluUmV0cnkgICA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGZuICAgICAgICAgICAgPSBnZXRGbih0aGlzLmNvbW1hbmQpO1xuICAgICAgICBjb25zdCBhY3R1YWxDb21tYW5kID0gdGhpcy5jb21tYW5kLmFjdHVhbDtcblxuICAgICAgICBpZiAoYWN0dWFsQ29tbWFuZCBpbnN0YW5jZW9mIFJlRXhlY3V0YWJsZVByb21pc2UpXG4gICAgICAgICAgICB0aGlzLmZuID0gdGhpcy5fd3JhcEZ1bmN0aW9uKGZuKTtcbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuY29tbWFuZC5vcHRpb25zLmFsbG93VW5hd2FpdGVkUHJvbWlzZSAmJiBpc1RoZW5uYWJsZShhY3R1YWxDb21tYW5kKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBBc3NlcnRpb25VbmF3YWl0ZWRQcm9taXNlRXJyb3IodGhpcy5jYWxsc2l0ZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuZm4gPSBmbjtcbiAgICB9XG5cbiAgICBfZ2V0VGltZUxlZnQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50aW1lb3V0IC0gKG5ldyBEYXRlKCkgLSB0aGlzLnN0YXJ0VGltZSk7XG4gICAgfVxuXG4gICAgX29uRXhlY3V0aW9uRmluaXNoZWQgKCkge1xuICAgICAgICBpZiAodGhpcy5pblJldHJ5KVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdlbmQtYXNzZXJ0aW9uLXJldHJpZXMnLCB0aGlzLnBhc3NlZCk7XG4gICAgfVxuXG4gICAgX3dyYXBGdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdFByb21pc2UgPSB0aGlzLmNvbW1hbmQuYWN0dWFsO1xuXG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMucGFzc2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21tYW5kLmFjdHVhbCA9IGF3YWl0IHJlc3VsdFByb21pc2UuX3JlRXhlY3V0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXNzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkV4ZWN1dGlvbkZpbmlzaGVkKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ2V0VGltZUxlZnQoKSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkV4ZWN1dGlvbkZpbmlzaGVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkZWxheShBU1NFUlRJT05fREVMQVkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5SZXRyeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnc3RhcnQtYXNzZXJ0aW9uLXJldHJpZXMnLCB0aGlzLl9nZXRUaW1lTGVmdCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXN5bmMgcnVuICgpIHtcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmZuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyLm5hbWUgPT09ICdBc3NlcnRpb25FcnJvcicgfHwgZXJyLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBc3NlcnRpb25FcnJvcicpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4dGVybmFsQXNzZXJ0aW9uTGlicmFyeUVycm9yKGVyciwgdGhpcy5jYWxsc2l0ZSk7XG5cbiAgICAgICAgICAgIGlmIChlcnIuaXNUZXN0Q2FmZUVycm9yKVxuICAgICAgICAgICAgICAgIGVyci5jYWxsc2l0ZSA9IHRoaXMuY2FsbHNpdGU7XG5cbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==