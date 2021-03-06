"use strict";
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
class BrowserConsoleMessages {
    constructor(data) {
        this.concat(data);
    }
    ensureMessageContainer(windowId) {
        if (this[windowId])
            return;
        this[windowId] = {
            log: [],
            info: [],
            warn: [],
            error: []
        };
    }
    concat(consoleMessages) {
        if (!consoleMessages)
            return this;
        Object.keys(consoleMessages).forEach(windowId => {
            this.ensureMessageContainer(windowId);
            this[windowId].log = this[windowId].log.concat(consoleMessages[windowId].log);
            this[windowId].info = this[windowId].info.concat(consoleMessages[windowId].info);
            this[windowId].warn = this[windowId].warn.concat(consoleMessages[windowId].warn);
            this[windowId].error = this[windowId].error.concat(consoleMessages[windowId].error);
        });
        return this;
    }
    addMessage(type, msg, windowId) {
        this.ensureMessageContainer(windowId);
        this[windowId][type].push(msg);
    }
    getCopy() {
        const copy = {};
        Object.keys(this).forEach(windowId => {
            copy[windowId] = {
                log: this[windowId].log.slice(),
                info: this[windowId].info.slice(),
                warn: this[windowId].warn.slice(),
                error: this[windowId].error.slice()
            };
        });
        return copy;
    }
}
exports.default = BrowserConsoleMessages;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci1jb25zb2xlLW1lc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3QtcnVuL2Jyb3dzZXItY29uc29sZS1tZXNzYWdlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZ0VBQWdFO0FBQ2hFLGdFQUFnRTtBQUNoRSwrQ0FBK0M7QUFDL0MsZ0VBQWdFOztBQUVoRSxNQUFxQixzQkFBc0I7SUFDdkMsWUFBYSxJQUFJO1FBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsc0JBQXNCLENBQUUsUUFBUTtRQUM1QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDZCxPQUFPO1FBRVgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHO1lBQ2IsR0FBRyxFQUFJLEVBQUU7WUFDVCxJQUFJLEVBQUcsRUFBRTtZQUNULElBQUksRUFBRyxFQUFFO1lBQ1QsS0FBSyxFQUFFLEVBQUU7U0FDWixDQUFDO0lBQ04sQ0FBQztJQUVELE1BQU0sQ0FBRSxlQUFlO1FBQ25CLElBQUksQ0FBQyxlQUFlO1lBQ2hCLE9BQU8sSUFBSSxDQUFDO1FBRWhCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV0QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoRixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxVQUFVLENBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRO1FBQzNCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPO1FBQ0gsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRWhCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRztnQkFDYixHQUFHLEVBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pDLElBQUksRUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDbEMsSUFBSSxFQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNsQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7YUFDdEMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBckRELHlDQXFEQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFdBUk5JTkc6IHRoaXMgZmlsZSBpcyB1c2VkIGJ5IGJvdGggdGhlIGNsaWVudCBhbmQgdGhlIHNlcnZlci5cbi8vIERvIG5vdCB1c2UgYW55IGJyb3dzZXIgb3Igbm9kZS1zcGVjaWZpYyBBUEkhXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyb3dzZXJDb25zb2xlTWVzc2FnZXMge1xuICAgIGNvbnN0cnVjdG9yIChkYXRhKSB7XG4gICAgICAgIHRoaXMuY29uY2F0KGRhdGEpO1xuICAgIH1cblxuICAgIGVuc3VyZU1lc3NhZ2VDb250YWluZXIgKHdpbmRvd0lkKSB7XG4gICAgICAgIGlmICh0aGlzW3dpbmRvd0lkXSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzW3dpbmRvd0lkXSA9IHtcbiAgICAgICAgICAgIGxvZzogICBbXSxcbiAgICAgICAgICAgIGluZm86ICBbXSxcbiAgICAgICAgICAgIHdhcm46ICBbXSxcbiAgICAgICAgICAgIGVycm9yOiBbXVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbmNhdCAoY29uc29sZU1lc3NhZ2VzKSB7XG4gICAgICAgIGlmICghY29uc29sZU1lc3NhZ2VzKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoY29uc29sZU1lc3NhZ2VzKS5mb3JFYWNoKHdpbmRvd0lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW5zdXJlTWVzc2FnZUNvbnRhaW5lcih3aW5kb3dJZCk7XG5cbiAgICAgICAgICAgIHRoaXNbd2luZG93SWRdLmxvZyAgID0gdGhpc1t3aW5kb3dJZF0ubG9nLmNvbmNhdChjb25zb2xlTWVzc2FnZXNbd2luZG93SWRdLmxvZyk7XG4gICAgICAgICAgICB0aGlzW3dpbmRvd0lkXS5pbmZvICA9IHRoaXNbd2luZG93SWRdLmluZm8uY29uY2F0KGNvbnNvbGVNZXNzYWdlc1t3aW5kb3dJZF0uaW5mbyk7XG4gICAgICAgICAgICB0aGlzW3dpbmRvd0lkXS53YXJuICA9IHRoaXNbd2luZG93SWRdLndhcm4uY29uY2F0KGNvbnNvbGVNZXNzYWdlc1t3aW5kb3dJZF0ud2Fybik7XG4gICAgICAgICAgICB0aGlzW3dpbmRvd0lkXS5lcnJvciA9IHRoaXNbd2luZG93SWRdLmVycm9yLmNvbmNhdChjb25zb2xlTWVzc2FnZXNbd2luZG93SWRdLmVycm9yKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWRkTWVzc2FnZSAodHlwZSwgbXNnLCB3aW5kb3dJZCkge1xuICAgICAgICB0aGlzLmVuc3VyZU1lc3NhZ2VDb250YWluZXIod2luZG93SWQpO1xuXG4gICAgICAgIHRoaXNbd2luZG93SWRdW3R5cGVdLnB1c2gobXNnKTtcbiAgICB9XG5cbiAgICBnZXRDb3B5ICgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IHt9O1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMpLmZvckVhY2god2luZG93SWQgPT4ge1xuICAgICAgICAgICAgY29weVt3aW5kb3dJZF0gPSB7XG4gICAgICAgICAgICAgICAgbG9nOiAgIHRoaXNbd2luZG93SWRdLmxvZy5zbGljZSgpLFxuICAgICAgICAgICAgICAgIGluZm86ICB0aGlzW3dpbmRvd0lkXS5pbmZvLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgd2FybjogIHRoaXNbd2luZG93SWRdLndhcm4uc2xpY2UoKSxcbiAgICAgICAgICAgICAgICBlcnJvcjogdGhpc1t3aW5kb3dJZF0uZXJyb3Iuc2xpY2UoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxufVxuIl19