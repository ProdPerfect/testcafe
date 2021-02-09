"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const testcafe_browser_tools_1 = require("testcafe-browser-tools");
const warning_message_1 = __importDefault(require("../../../notifications/warning-message"));
const DEBUG_LOGGER = debug_1.default('testcafe:browser:provider:built-in:remote');
exports.default = {
    canDetectLocalBrowsers: true,
    localBrowsersFlags: {},
    async openBrowser(browserId) {
        if (!this.canDetectLocalBrowsers)
            return;
        await this.waitForConnectionReady(browserId);
        let localBrowserWindow = null;
        try {
            localBrowserWindow = await testcafe_browser_tools_1.findWindow(browserId);
        }
        catch (err) {
            // NOTE: We can suppress the error here since we can just disable window manipulation functions
            // when the browser is truly remote and we cannot find a local window descriptor
            DEBUG_LOGGER(err);
        }
        this.localBrowsersFlags[browserId] = localBrowserWindow !== null;
    },
    async closeBrowser(browserId) {
        delete this.localBrowsersFlags[browserId];
    },
    async isLocalBrowser(browserId) {
        // NOTE:
        // if browserId is not specified, then it means that a browser is not yet started
        // we may assume that it's not local, because
        // otherwise we'll just disable window manipulation function's after the browser will be started
        return !!browserId && this.localBrowsersFlags[browserId];
    },
    // NOTE: we must try to do a local screenshot or resize, if browser is accessible, and emit warning otherwise
    async hasCustomActionForBrowser(browserId) {
        const isLocalBrowser = this.localBrowsersFlags[browserId];
        return {
            hasCloseBrowser: true,
            hasResizeWindow: !isLocalBrowser,
            hasMaximizeWindow: !isLocalBrowser,
            hasTakeScreenshot: !isLocalBrowser,
            hasCanResizeWindowToDimensions: !isLocalBrowser
        };
    },
    async takeScreenshot(browserId) {
        this.reportWarning(browserId, warning_message_1.default.browserManipulationsOnRemoteBrowser);
    },
    async resizeWindow(browserId) {
        this.reportWarning(browserId, warning_message_1.default.browserManipulationsOnRemoteBrowser);
    },
    async maximizeWindow(browserId) {
        this.reportWarning(browserId, warning_message_1.default.browserManipulationsOnRemoteBrowser);
    }
};
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2Jyb3dzZXIvcHJvdmlkZXIvYnVpbHQtaW4vcmVtb3RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLG1FQUFvRDtBQUNwRCw2RkFBcUU7QUFHckUsTUFBTSxZQUFZLEdBQUcsZUFBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7QUFFeEUsa0JBQWU7SUFDWCxzQkFBc0IsRUFBRSxJQUFJO0lBRTVCLGtCQUFrQixFQUFFLEVBQUU7SUFFdEIsS0FBSyxDQUFDLFdBQVcsQ0FBRSxTQUFTO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCO1lBQzVCLE9BQU87UUFFWCxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU3QyxJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQztRQUU5QixJQUFJO1lBQ0Esa0JBQWtCLEdBQUcsTUFBTSxtQ0FBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsT0FBTyxHQUFHLEVBQUU7WUFDUiwrRkFBK0Y7WUFDL0YsZ0ZBQWdGO1lBQ2hGLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQjtRQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxrQkFBa0IsS0FBSyxJQUFJLENBQUM7SUFDckUsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUUsU0FBUztRQUN6QixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBRSxTQUFTO1FBQzNCLFFBQVE7UUFDUixpRkFBaUY7UUFDakYsNkNBQTZDO1FBQzdDLGdHQUFnRztRQUNoRyxPQUFPLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCw2R0FBNkc7SUFDN0csS0FBSyxDQUFDLHlCQUF5QixDQUFFLFNBQVM7UUFDdEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFELE9BQU87WUFDSCxlQUFlLEVBQWlCLElBQUk7WUFDcEMsZUFBZSxFQUFpQixDQUFDLGNBQWM7WUFDL0MsaUJBQWlCLEVBQWUsQ0FBQyxjQUFjO1lBQy9DLGlCQUFpQixFQUFlLENBQUMsY0FBYztZQUMvQyw4QkFBOEIsRUFBRSxDQUFDLGNBQWM7U0FDbEQsQ0FBQztJQUNOLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYyxDQUFFLFNBQVM7UUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUseUJBQWUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFFLFNBQVM7UUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUseUJBQWUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYyxDQUFFLFNBQVM7UUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUseUJBQWUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7Q0FDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCB7IGZpbmRXaW5kb3cgfSBmcm9tICd0ZXN0Y2FmZS1icm93c2VyLXRvb2xzJztcbmltcG9ydCBXQVJOSU5HX01FU1NBR0UgZnJvbSAnLi4vLi4vLi4vbm90aWZpY2F0aW9ucy93YXJuaW5nLW1lc3NhZ2UnO1xuXG5cbmNvbnN0IERFQlVHX0xPR0dFUiA9IGRlYnVnKCd0ZXN0Y2FmZTpicm93c2VyOnByb3ZpZGVyOmJ1aWx0LWluOnJlbW90ZScpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgY2FuRGV0ZWN0TG9jYWxCcm93c2VyczogdHJ1ZSxcblxuICAgIGxvY2FsQnJvd3NlcnNGbGFnczoge30sXG5cbiAgICBhc3luYyBvcGVuQnJvd3NlciAoYnJvd3NlcklkKSB7XG4gICAgICAgIGlmICghdGhpcy5jYW5EZXRlY3RMb2NhbEJyb3dzZXJzKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdEZvckNvbm5lY3Rpb25SZWFkeShicm93c2VySWQpO1xuXG4gICAgICAgIGxldCBsb2NhbEJyb3dzZXJXaW5kb3cgPSBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbEJyb3dzZXJXaW5kb3cgPSBhd2FpdCBmaW5kV2luZG93KGJyb3dzZXJJZCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gTk9URTogV2UgY2FuIHN1cHByZXNzIHRoZSBlcnJvciBoZXJlIHNpbmNlIHdlIGNhbiBqdXN0IGRpc2FibGUgd2luZG93IG1hbmlwdWxhdGlvbiBmdW5jdGlvbnNcbiAgICAgICAgICAgIC8vIHdoZW4gdGhlIGJyb3dzZXIgaXMgdHJ1bHkgcmVtb3RlIGFuZCB3ZSBjYW5ub3QgZmluZCBhIGxvY2FsIHdpbmRvdyBkZXNjcmlwdG9yXG4gICAgICAgICAgICBERUJVR19MT0dHRVIoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9jYWxCcm93c2Vyc0ZsYWdzW2Jyb3dzZXJJZF0gPSBsb2NhbEJyb3dzZXJXaW5kb3cgIT09IG51bGw7XG4gICAgfSxcblxuICAgIGFzeW5jIGNsb3NlQnJvd3NlciAoYnJvd3NlcklkKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmxvY2FsQnJvd3NlcnNGbGFnc1ticm93c2VySWRdO1xuICAgIH0sXG5cbiAgICBhc3luYyBpc0xvY2FsQnJvd3NlciAoYnJvd3NlcklkKSB7XG4gICAgICAgIC8vIE5PVEU6XG4gICAgICAgIC8vIGlmIGJyb3dzZXJJZCBpcyBub3Qgc3BlY2lmaWVkLCB0aGVuIGl0IG1lYW5zIHRoYXQgYSBicm93c2VyIGlzIG5vdCB5ZXQgc3RhcnRlZFxuICAgICAgICAvLyB3ZSBtYXkgYXNzdW1lIHRoYXQgaXQncyBub3QgbG9jYWwsIGJlY2F1c2VcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHdlJ2xsIGp1c3QgZGlzYWJsZSB3aW5kb3cgbWFuaXB1bGF0aW9uIGZ1bmN0aW9uJ3MgYWZ0ZXIgdGhlIGJyb3dzZXIgd2lsbCBiZSBzdGFydGVkXG4gICAgICAgIHJldHVybiAhIWJyb3dzZXJJZCAmJiB0aGlzLmxvY2FsQnJvd3NlcnNGbGFnc1ticm93c2VySWRdO1xuICAgIH0sXG5cbiAgICAvLyBOT1RFOiB3ZSBtdXN0IHRyeSB0byBkbyBhIGxvY2FsIHNjcmVlbnNob3Qgb3IgcmVzaXplLCBpZiBicm93c2VyIGlzIGFjY2Vzc2libGUsIGFuZCBlbWl0IHdhcm5pbmcgb3RoZXJ3aXNlXG4gICAgYXN5bmMgaGFzQ3VzdG9tQWN0aW9uRm9yQnJvd3NlciAoYnJvd3NlcklkKSB7XG4gICAgICAgIGNvbnN0IGlzTG9jYWxCcm93c2VyID0gdGhpcy5sb2NhbEJyb3dzZXJzRmxhZ3NbYnJvd3NlcklkXTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGFzQ2xvc2VCcm93c2VyOiAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgaGFzUmVzaXplV2luZG93OiAgICAgICAgICAgICAgICAhaXNMb2NhbEJyb3dzZXIsXG4gICAgICAgICAgICBoYXNNYXhpbWl6ZVdpbmRvdzogICAgICAgICAgICAgICFpc0xvY2FsQnJvd3NlcixcbiAgICAgICAgICAgIGhhc1Rha2VTY3JlZW5zaG90OiAgICAgICAgICAgICAgIWlzTG9jYWxCcm93c2VyLFxuICAgICAgICAgICAgaGFzQ2FuUmVzaXplV2luZG93VG9EaW1lbnNpb25zOiAhaXNMb2NhbEJyb3dzZXJcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgYXN5bmMgdGFrZVNjcmVlbnNob3QgKGJyb3dzZXJJZCkge1xuICAgICAgICB0aGlzLnJlcG9ydFdhcm5pbmcoYnJvd3NlcklkLCBXQVJOSU5HX01FU1NBR0UuYnJvd3Nlck1hbmlwdWxhdGlvbnNPblJlbW90ZUJyb3dzZXIpO1xuICAgIH0sXG5cbiAgICBhc3luYyByZXNpemVXaW5kb3cgKGJyb3dzZXJJZCkge1xuICAgICAgICB0aGlzLnJlcG9ydFdhcm5pbmcoYnJvd3NlcklkLCBXQVJOSU5HX01FU1NBR0UuYnJvd3Nlck1hbmlwdWxhdGlvbnNPblJlbW90ZUJyb3dzZXIpO1xuICAgIH0sXG5cbiAgICBhc3luYyBtYXhpbWl6ZVdpbmRvdyAoYnJvd3NlcklkKSB7XG4gICAgICAgIHRoaXMucmVwb3J0V2FybmluZyhicm93c2VySWQsIFdBUk5JTkdfTUVTU0FHRS5icm93c2VyTWFuaXB1bGF0aW9uc09uUmVtb3RlQnJvd3Nlcik7XG4gICAgfVxufTtcbiJdfQ==