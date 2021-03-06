"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const lodash_1 = require("lodash");
const log_update_async_hook_1 = __importDefault(require("log-update-async-hook"));
const render_callsite_sync_1 = __importDefault(require("../utils/render-callsite-sync"));
const create_stack_filter_1 = __importDefault(require("../errors/create-stack-filter"));
exports.default = {
    messages: [],
    debugLogging: false,
    streamsOverridden: false,
    _overrideStream(stream) {
        const initialWrite = stream.write;
        stream.write = (chunk, encoding, cb) => {
            if (this.debugLogging)
                initialWrite.call(stream, chunk, encoding, cb);
            else {
                this.debugLogging = true;
                log_update_async_hook_1.default.clear();
                log_update_async_hook_1.default.done();
                initialWrite.call(stream, chunk, encoding, cb);
                setTimeout(() => this._showAllBreakpoints(), 0);
                this.debugLogging = false;
            }
        };
    },
    _overrideStreams() {
        this._overrideStream(process.stdout);
        this._overrideStream(process.stderr);
        this.streamsOverridden = true;
    },
    _getMessageAsString() {
        let string = '';
        for (const message of this.messages)
            string += message.frame;
        return string;
    },
    _showAllBreakpoints() {
        if (!this.messages.length)
            return;
        this.debugLogging = true;
        log_update_async_hook_1.default(this._getMessageAsString());
        this.debugLogging = false;
    },
    showBreakpoint(testRunId, userAgent, callsite, testError) {
        if (!this.streamsOverridden)
            this._overrideStreams();
        const callsiteStr = render_callsite_sync_1.default(callsite, {
            frameSize: 1,
            stackFilter: create_stack_filter_1.default(Error.stackTraceLimit),
            stack: false
        });
        const frame = `\n` +
            `----\n` +
            `${userAgent}\n` +
            chalk_1.default.yellow(testError ? 'DEBUGGER PAUSE ON FAILED TEST:' : 'DEBUGGER PAUSE:') +
            `${testError ? `\n${testError}` : ''}` +
            `${!testError && callsiteStr ? `\n${callsiteStr}` : ''}` +
            '\n' +
            `----\n`;
        const message = { testRunId, frame };
        const index = lodash_1.findIndex(this.messages, { testRunId });
        if (index === -1)
            this.messages.push(message);
        else
            this.messages[index] = message;
        this._showAllBreakpoints();
    },
    hideBreakpoint(testRunId) {
        const index = lodash_1.findIndex(this.messages, { testRunId });
        if (index !== -1)
            this.messages.splice(index, 1);
        this._showAllBreakpoints();
    }
};
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWctbG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL25vdGlmaWNhdGlvbnMvZGVidWctbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLG1DQUFtQztBQUNuQyxrRkFBOEM7QUFDOUMseUZBQStEO0FBQy9ELHdGQUE4RDtBQUU5RCxrQkFBZTtJQUNYLFFBQVEsRUFBRSxFQUFFO0lBRVosWUFBWSxFQUFFLEtBQUs7SUFFbkIsaUJBQWlCLEVBQUUsS0FBSztJQUV4QixlQUFlLENBQUUsTUFBTTtRQUNuQixNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRWxDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQ25DLElBQUksSUFBSSxDQUFDLFlBQVk7Z0JBQ2pCLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQzlDO2dCQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUV6QiwrQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNsQiwrQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUVqQixZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUUvQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRWhELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2FBQzdCO1FBQ0wsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELGdCQUFnQjtRQUNaLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDbEMsQ0FBQztJQUVELG1CQUFtQjtRQUNmLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQy9CLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDO1FBRTVCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxtQkFBbUI7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNO1lBQ3JCLE9BQU87UUFFWCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QiwrQkFBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVELGNBQWMsQ0FBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTO1FBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCO1lBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRTVCLE1BQU0sV0FBVyxHQUFHLDhCQUFrQixDQUFDLFFBQVEsRUFBRTtZQUM3QyxTQUFTLEVBQUksQ0FBQztZQUNkLFdBQVcsRUFBRSw2QkFBaUIsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO1lBQ3JELEtBQUssRUFBUSxLQUFLO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUk7WUFDSixRQUFRO1lBQ1IsR0FBRyxTQUFTLElBQUk7WUFDaEIsZUFBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztZQUM5RSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3RDLEdBQUcsQ0FBQyxTQUFTLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDeEQsSUFBSTtZQUNKLFFBQVEsQ0FBQztRQUV2QixNQUFNLE9BQU8sR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNyQyxNQUFNLEtBQUssR0FBSyxrQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBRXhELElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQztZQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztZQUU1QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUVuQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRUQsY0FBYyxDQUFFLFNBQVM7UUFDckIsTUFBTSxLQUFLLEdBQUcsa0JBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUV0RCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUM7WUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDL0IsQ0FBQztDQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IHsgZmluZEluZGV4IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBsb2dVcGRhdGUgZnJvbSAnbG9nLXVwZGF0ZS1hc3luYy1ob29rJztcbmltcG9ydCByZW5kZXJDYWxsc2l0ZVN5bmMgZnJvbSAnLi4vdXRpbHMvcmVuZGVyLWNhbGxzaXRlLXN5bmMnO1xuaW1wb3J0IGNyZWF0ZVN0YWNrRmlsdGVyIGZyb20gJy4uL2Vycm9ycy9jcmVhdGUtc3RhY2stZmlsdGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIG1lc3NhZ2VzOiBbXSxcblxuICAgIGRlYnVnTG9nZ2luZzogZmFsc2UsXG5cbiAgICBzdHJlYW1zT3ZlcnJpZGRlbjogZmFsc2UsXG5cbiAgICBfb3ZlcnJpZGVTdHJlYW0gKHN0cmVhbSkge1xuICAgICAgICBjb25zdCBpbml0aWFsV3JpdGUgPSBzdHJlYW0ud3JpdGU7XG5cbiAgICAgICAgc3RyZWFtLndyaXRlID0gKGNodW5rLCBlbmNvZGluZywgY2IpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRlYnVnTG9nZ2luZylcbiAgICAgICAgICAgICAgICBpbml0aWFsV3JpdGUuY2FsbChzdHJlYW0sIGNodW5rLCBlbmNvZGluZywgY2IpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1Z0xvZ2dpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgbG9nVXBkYXRlLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgbG9nVXBkYXRlLmRvbmUoKTtcblxuICAgICAgICAgICAgICAgIGluaXRpYWxXcml0ZS5jYWxsKHN0cmVhbSwgY2h1bmssIGVuY29kaW5nLCBjYik7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX3Nob3dBbGxCcmVha3BvaW50cygpLCAwKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZGVidWdMb2dnaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9vdmVycmlkZVN0cmVhbXMgKCkge1xuICAgICAgICB0aGlzLl9vdmVycmlkZVN0cmVhbShwcm9jZXNzLnN0ZG91dCk7XG4gICAgICAgIHRoaXMuX292ZXJyaWRlU3RyZWFtKHByb2Nlc3Muc3RkZXJyKTtcblxuICAgICAgICB0aGlzLnN0cmVhbXNPdmVycmlkZGVuID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2dldE1lc3NhZ2VBc1N0cmluZyAoKSB7XG4gICAgICAgIGxldCBzdHJpbmcgPSAnJztcblxuICAgICAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgdGhpcy5tZXNzYWdlcylcbiAgICAgICAgICAgIHN0cmluZyArPSBtZXNzYWdlLmZyYW1lO1xuXG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfSxcblxuICAgIF9zaG93QWxsQnJlYWtwb2ludHMgKCkge1xuICAgICAgICBpZiAoIXRoaXMubWVzc2FnZXMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZGVidWdMb2dnaW5nID0gdHJ1ZTtcbiAgICAgICAgbG9nVXBkYXRlKHRoaXMuX2dldE1lc3NhZ2VBc1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5kZWJ1Z0xvZ2dpbmcgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgc2hvd0JyZWFrcG9pbnQgKHRlc3RSdW5JZCwgdXNlckFnZW50LCBjYWxsc2l0ZSwgdGVzdEVycm9yKSB7XG4gICAgICAgIGlmICghdGhpcy5zdHJlYW1zT3ZlcnJpZGRlbilcbiAgICAgICAgICAgIHRoaXMuX292ZXJyaWRlU3RyZWFtcygpO1xuXG4gICAgICAgIGNvbnN0IGNhbGxzaXRlU3RyID0gcmVuZGVyQ2FsbHNpdGVTeW5jKGNhbGxzaXRlLCB7XG4gICAgICAgICAgICBmcmFtZVNpemU6ICAgMSxcbiAgICAgICAgICAgIHN0YWNrRmlsdGVyOiBjcmVhdGVTdGFja0ZpbHRlcihFcnJvci5zdGFja1RyYWNlTGltaXQpLFxuICAgICAgICAgICAgc3RhY2s6ICAgICAgIGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGZyYW1lID0gYFxcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgIGAtLS0tXFxuYCArXG4gICAgICAgICAgICAgICAgICAgICAgYCR7dXNlckFnZW50fVxcbmAgK1xuICAgICAgICAgICAgICAgICAgICAgIGNoYWxrLnllbGxvdyh0ZXN0RXJyb3IgPyAnREVCVUdHRVIgUEFVU0UgT04gRkFJTEVEIFRFU1Q6JyA6ICdERUJVR0dFUiBQQVVTRTonKSArXG4gICAgICAgICAgICAgICAgICAgICAgYCR7dGVzdEVycm9yID8gYFxcbiR7dGVzdEVycm9yfWAgOiAnJ31gICtcbiAgICAgICAgICAgICAgICAgICAgICBgJHshdGVzdEVycm9yICYmIGNhbGxzaXRlU3RyID8gYFxcbiR7Y2FsbHNpdGVTdHJ9YCA6ICcnfWAgK1xuICAgICAgICAgICAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICBgLS0tLVxcbmA7XG5cbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHsgdGVzdFJ1bklkLCBmcmFtZSB9O1xuICAgICAgICBjb25zdCBpbmRleCAgID0gZmluZEluZGV4KHRoaXMubWVzc2FnZXMsIHsgdGVzdFJ1bklkIH0pO1xuXG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZXNbaW5kZXhdID0gbWVzc2FnZTtcblxuICAgICAgICB0aGlzLl9zaG93QWxsQnJlYWtwb2ludHMoKTtcbiAgICB9LFxuXG4gICAgaGlkZUJyZWFrcG9pbnQgKHRlc3RSdW5JZCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IGZpbmRJbmRleCh0aGlzLm1lc3NhZ2VzLCB7IHRlc3RSdW5JZCB9KTtcblxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgIHRoaXMuX3Nob3dBbGxCcmVha3BvaW50cygpO1xuICAgIH1cbn07XG4iXX0=