"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_family_1 = __importDefault(require("os-family"));
const url_1 = require("url");
const base_1 = __importDefault(require("../base"));
const runtime_info_1 = __importDefault(require("./runtime-info"));
const config_1 = __importDefault(require("./config"));
const local_chrome_1 = require("./local-chrome");
const client_functions_1 = require("../../../utils/client-functions");
const browser_client_1 = require("./browser-client");
const MIN_AVAILABLE_DIMENSION = 50;
exports.default = Object.assign(Object.assign({}, base_1.default), { _getConfig(name) {
        return config_1.default(name);
    },
    _getBrowserProtocolClient(runtimeInfo) {
        return runtimeInfo.browserClient;
    },
    async _createRunTimeInfo(hostName, configString, disableMultipleWindows) {
        return runtime_info_1.default.create(hostName, configString, disableMultipleWindows);
    },
    _setUserAgentMetaInfoForEmulatingDevice(browserId, config) {
        const { emulation, deviceName } = config;
        const isDeviceEmulation = emulation && deviceName;
        if (!isDeviceEmulation)
            return;
        const metaInfo = `Emulating ${deviceName}`;
        const options = {
            appendToUserAgent: true
        };
        this.setUserAgentMetaInfo(browserId, metaInfo, options);
    },
    async openBrowser(browserId, pageUrl, configString, disableMultipleWindows) {
        const parsedPageUrl = url_1.parse(pageUrl);
        const runtimeInfo = await this._createRunTimeInfo(parsedPageUrl.hostname, configString, disableMultipleWindows);
        runtimeInfo.browserName = this._getBrowserName();
        runtimeInfo.browserId = browserId;
        runtimeInfo.providerMethods = {
            resizeLocalBrowserWindow: (...args) => this.resizeLocalBrowserWindow(...args),
            reportWarning: (...args) => this.reportWarning(browserId, ...args)
        };
        await local_chrome_1.start(pageUrl, runtimeInfo);
        await this.waitForConnectionReady(browserId);
        runtimeInfo.viewportSize = await this.runInitScript(browserId, client_functions_1.GET_WINDOW_DIMENSIONS_INFO_SCRIPT);
        runtimeInfo.activeWindowId = null;
        runtimeInfo.windowDescriptors = {};
        if (!disableMultipleWindows)
            runtimeInfo.activeWindowId = this.calculateWindowId();
        const browserClient = new browser_client_1.BrowserClient(runtimeInfo);
        this.openedBrowsers[browserId] = runtimeInfo;
        await browserClient.init();
        await this._ensureWindowIsExpanded(browserId, runtimeInfo.viewportSize);
        this._setUserAgentMetaInfoForEmulatingDevice(browserId, runtimeInfo.config);
    },
    async closeBrowser(browserId) {
        const runtimeInfo = this.openedBrowsers[browserId];
        if (runtimeInfo.browserClient.isHeadlessTab())
            await runtimeInfo.browserClient.closeTab();
        else
            await this.closeLocalBrowser(browserId);
        if (os_family_1.default.mac || runtimeInfo.config.headless)
            await local_chrome_1.stop(runtimeInfo);
        if (runtimeInfo.tempProfileDir)
            await runtimeInfo.tempProfileDir.dispose();
        delete this.openedBrowsers[browserId];
    },
    async resizeWindow(browserId, width, height, currentWidth, currentHeight) {
        const runtimeInfo = this.openedBrowsers[browserId];
        if (runtimeInfo.config.mobile)
            await runtimeInfo.browserClient.updateMobileViewportSize();
        else {
            runtimeInfo.viewportSize.width = currentWidth;
            runtimeInfo.viewportSize.height = currentHeight;
        }
        await runtimeInfo.browserClient.resizeWindow({ width, height });
    },
    async getVideoFrameData(browserId) {
        const { browserClient } = this.openedBrowsers[browserId];
        return browserClient.getScreenshotData();
    },
    async hasCustomActionForBrowser(browserId) {
        const { config, browserClient } = this.openedBrowsers[browserId];
        const client = await browserClient.getActiveClient();
        return {
            hasCloseBrowser: true,
            hasResizeWindow: !!client && (config.emulation || config.headless),
            hasMaximizeWindow: !!client && config.headless,
            hasTakeScreenshot: !!client,
            hasChromelessScreenshots: !!client,
            hasGetVideoFrameData: !!client,
            hasCanResizeWindowToDimensions: false
        };
    },
    async _ensureWindowIsExpanded(browserId, { height, width, availableHeight, availableWidth, outerWidth, outerHeight }) {
        if (height < MIN_AVAILABLE_DIMENSION || width < MIN_AVAILABLE_DIMENSION) {
            const newHeight = Math.max(availableHeight, MIN_AVAILABLE_DIMENSION);
            const newWidth = Math.max(Math.floor(availableWidth / 2), MIN_AVAILABLE_DIMENSION);
            await this.resizeWindow(browserId, newWidth, newHeight, outerWidth, outerHeight);
        }
    } });
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYnJvd3Nlci9wcm92aWRlci9idWlsdC1pbi9kZWRpY2F0ZWQvY2hyb21lL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMERBQTJCO0FBQzNCLDZCQUF3QztBQUN4QyxtREFBNEM7QUFDNUMsa0VBQStDO0FBQy9DLHNEQUFpQztBQUNqQyxpREFBb0Y7QUFDcEYsc0VBQW9GO0FBQ3BGLHFEQUFpRDtBQUVqRCxNQUFNLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztBQUVuQyxrREFDTyxjQUFxQixLQUV4QixVQUFVLENBQUUsSUFBSTtRQUNaLE9BQU8sZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQseUJBQXlCLENBQUUsV0FBVztRQUNsQyxPQUFPLFdBQVcsQ0FBQyxhQUFhLENBQUM7SUFDckMsQ0FBQztJQUVELEtBQUssQ0FBQyxrQkFBa0IsQ0FBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLHNCQUFzQjtRQUNwRSxPQUFPLHNCQUFpQixDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLHNCQUFzQixDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELHVDQUF1QyxDQUFFLFNBQVMsRUFBRSxNQUFNO1FBQ3RELE1BQU0sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ3pDLE1BQU0saUJBQWlCLEdBQVcsU0FBUyxJQUFJLFVBQVUsQ0FBQztRQUUxRCxJQUFJLENBQUMsaUJBQWlCO1lBQ2xCLE9BQU87UUFFWCxNQUFNLFFBQVEsR0FBRyxhQUFhLFVBQVUsRUFBRSxDQUFDO1FBQzNDLE1BQU0sT0FBTyxHQUFJO1lBQ2IsaUJBQWlCLEVBQUUsSUFBSTtTQUMxQixDQUFDO1FBRUYsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7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Ryx1QkFBdUIsSUFBSSxLQUFLLEdBQUcsdUJBQXVCLEVBQUU7WUFDckUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUNyRSxNQUFNLFFBQVEsR0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFFcEYsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztTQUNwRjtJQUNMLENBQUMsSUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPUyBmcm9tICdvcy1mYW1pbHknO1xuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VVcmwgfSBmcm9tICd1cmwnO1xuaW1wb3J0IGRlZGljYXRlZFByb3ZpZGVyQmFzZSBmcm9tICcuLi9iYXNlJztcbmltcG9ydCBDaHJvbWVSdW5UaW1lSW5mbyBmcm9tICcuL3J1bnRpbWUtaW5mbyc7XG5pbXBvcnQgZ2V0Q29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IHN0YXJ0IGFzIHN0YXJ0TG9jYWxDaHJvbWUsIHN0b3AgYXMgc3RvcExvY2FsQ2hyb21lIH0gZnJvbSAnLi9sb2NhbC1jaHJvbWUnO1xuaW1wb3J0IHsgR0VUX1dJTkRPV19ESU1FTlNJT05TX0lORk9fU0NSSVBUIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvY2xpZW50LWZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBCcm93c2VyQ2xpZW50IH0gZnJvbSAnLi9icm93c2VyLWNsaWVudCc7XG5cbmNvbnN0IE1JTl9BVkFJTEFCTEVfRElNRU5TSU9OID0gNTA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5kZWRpY2F0ZWRQcm92aWRlckJhc2UsXG5cbiAgICBfZ2V0Q29uZmlnIChuYW1lKSB7XG4gICAgICAgIHJldHVybiBnZXRDb25maWcobmFtZSk7XG4gICAgfSxcblxuICAgIF9nZXRCcm93c2VyUHJvdG9jb2xDbGllbnQgKHJ1bnRpbWVJbmZvKSB7XG4gICAgICAgIHJldHVybiBydW50aW1lSW5mby5icm93c2VyQ2xpZW50O1xuICAgIH0sXG5cbiAgICBhc3luYyBfY3JlYXRlUnVuVGltZUluZm8gKGhvc3ROYW1lLCBjb25maWdTdHJpbmcsIGRpc2FibGVNdWx0aXBsZVdpbmRvd3MpIHtcbiAgICAgICAgcmV0dXJuIENocm9tZVJ1blRpbWVJbmZvLmNyZWF0ZShob3N0TmFtZSwgY29uZmlnU3RyaW5nLCBkaXNhYmxlTXVsdGlwbGVXaW5kb3dzKTtcbiAgICB9LFxuXG4gICAgX3NldFVzZXJBZ2VudE1ldGFJbmZvRm9yRW11bGF0aW5nRGV2aWNlIChicm93c2VySWQsIGNvbmZpZykge1xuICAgICAgICBjb25zdCB7IGVtdWxhdGlvbiwgZGV2aWNlTmFtZSB9ID0gY29uZmlnO1xuICAgICAgICBjb25zdCBpc0RldmljZUVtdWxhdGlvbiAgICAgICAgID0gZW11bGF0aW9uICYmIGRldmljZU5hbWU7XG5cbiAgICAgICAgaWYgKCFpc0RldmljZUVtdWxhdGlvbilcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBjb25zdCBtZXRhSW5mbyA9IGBFbXVsYXRpbmcgJHtkZXZpY2VOYW1lfWA7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgID0ge1xuICAgICAgICAgICAgYXBwZW5kVG9Vc2VyQWdlbnQ6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNldFVzZXJBZ2VudE1ldGFJbmZvKGJyb3dzZXJJZCwgbWV0YUluZm8sIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBhc3luYyBvcGVuQnJvd3NlciAoYnJvd3NlcklkLCBwYWdlVXJsLCBjb25maWdTdHJpbmcsIGRpc2FibGVNdWx0aXBsZVdpbmRvd3MpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkUGFnZVVybCA9IHBhcnNlVXJsKHBhZ2VVcmwpO1xuICAgICAgICBjb25zdCBydW50aW1lSW5mbyAgID0gYXdhaXQgdGhpcy5fY3JlYXRlUnVuVGltZUluZm8ocGFyc2VkUGFnZVVybC5ob3N0bmFtZSwgY29uZmlnU3RyaW5nLCBkaXNhYmxlTXVsdGlwbGVXaW5kb3dzKTtcblxuICAgICAgICBydW50aW1lSW5mby5icm93c2VyTmFtZSA9IHRoaXMuX2dldEJyb3dzZXJOYW1lKCk7XG4gICAgICAgIHJ1bnRpbWVJbmZvLmJyb3dzZXJJZCAgID0gYnJvd3NlcklkO1xuXG4gICAgICAgIHJ1bnRpbWVJbmZvLnByb3ZpZGVyTWV0aG9kcyA9IHtcbiAgICAgICAgICAgIHJlc2l6ZUxvY2FsQnJvd3NlcldpbmRvdzogKC4uLmFyZ3MpID0+IHRoaXMucmVzaXplTG9jYWxCcm93c2VyV2luZG93KC4uLmFyZ3MpLFxuICAgICAgICAgICAgcmVwb3J0V2FybmluZzogICAgICAgICAgICAoLi4uYXJncykgPT4gdGhpcy5yZXBvcnRXYXJuaW5nKGJyb3dzZXJJZCwgLi4uYXJncylcbiAgICAgICAgfTtcblxuICAgICAgICBhd2FpdCBzdGFydExvY2FsQ2hyb21lKHBhZ2VVcmwsIHJ1bnRpbWVJbmZvKTtcblxuICAgICAgICBhd2FpdCB0aGlzLndhaXRGb3JDb25uZWN0aW9uUmVhZHkoYnJvd3NlcklkKTtcblxuICAgICAgICBydW50aW1lSW5mby52aWV3cG9ydFNpemUgICAgICA9IGF3YWl0IHRoaXMucnVuSW5pdFNjcmlwdChicm93c2VySWQsIEdFVF9XSU5ET1dfRElNRU5TSU9OU19JTkZPX1NDUklQVCk7XG4gICAgICAgIHJ1bnRpbWVJbmZvLmFjdGl2ZVdpbmRvd0lkICAgID0gbnVsbDtcbiAgICAgICAgcnVudGltZUluZm8ud2luZG93RGVzY3JpcHRvcnMgPSB7fTtcblxuICAgICAgICBpZiAoIWRpc2FibGVNdWx0aXBsZVdpbmRvd3MpXG4gICAgICAgICAgICBydW50aW1lSW5mby5hY3RpdmVXaW5kb3dJZCA9IHRoaXMuY2FsY3VsYXRlV2luZG93SWQoKTtcblxuICAgICAgICBjb25zdCBicm93c2VyQ2xpZW50ID0gbmV3IEJyb3dzZXJDbGllbnQocnVudGltZUluZm8pO1xuXG4gICAgICAgIHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXSA9IHJ1bnRpbWVJbmZvO1xuXG4gICAgICAgIGF3YWl0IGJyb3dzZXJDbGllbnQuaW5pdCgpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuX2Vuc3VyZVdpbmRvd0lzRXhwYW5kZWQoYnJvd3NlcklkLCBydW50aW1lSW5mby52aWV3cG9ydFNpemUpO1xuXG4gICAgICAgIHRoaXMuX3NldFVzZXJBZ2VudE1ldGFJbmZvRm9yRW11bGF0aW5nRGV2aWNlKGJyb3dzZXJJZCwgcnVudGltZUluZm8uY29uZmlnKTtcbiAgICB9LFxuXG4gICAgYXN5bmMgY2xvc2VCcm93c2VyIChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgcnVudGltZUluZm8gPSB0aGlzLm9wZW5lZEJyb3dzZXJzW2Jyb3dzZXJJZF07XG5cbiAgICAgICAgaWYgKHJ1bnRpbWVJbmZvLmJyb3dzZXJDbGllbnQuaXNIZWFkbGVzc1RhYigpKVxuICAgICAgICAgICAgYXdhaXQgcnVudGltZUluZm8uYnJvd3NlckNsaWVudC5jbG9zZVRhYigpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNsb3NlTG9jYWxCcm93c2VyKGJyb3dzZXJJZCk7XG5cbiAgICAgICAgaWYgKE9TLm1hYyB8fCBydW50aW1lSW5mby5jb25maWcuaGVhZGxlc3MpXG4gICAgICAgICAgICBhd2FpdCBzdG9wTG9jYWxDaHJvbWUocnVudGltZUluZm8pO1xuXG4gICAgICAgIGlmIChydW50aW1lSW5mby50ZW1wUHJvZmlsZURpcilcbiAgICAgICAgICAgIGF3YWl0IHJ1bnRpbWVJbmZvLnRlbXBQcm9maWxlRGlyLmRpc3Bvc2UoKTtcblxuICAgICAgICBkZWxldGUgdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdO1xuICAgIH0sXG5cbiAgICBhc3luYyByZXNpemVXaW5kb3cgKGJyb3dzZXJJZCwgd2lkdGgsIGhlaWdodCwgY3VycmVudFdpZHRoLCBjdXJyZW50SGVpZ2h0KSB7XG4gICAgICAgIGNvbnN0IHJ1bnRpbWVJbmZvID0gdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdO1xuXG4gICAgICAgIGlmIChydW50aW1lSW5mby5jb25maWcubW9iaWxlKVxuICAgICAgICAgICAgYXdhaXQgcnVudGltZUluZm8uYnJvd3NlckNsaWVudC51cGRhdGVNb2JpbGVWaWV3cG9ydFNpemUoKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBydW50aW1lSW5mby52aWV3cG9ydFNpemUud2lkdGggID0gY3VycmVudFdpZHRoO1xuICAgICAgICAgICAgcnVudGltZUluZm8udmlld3BvcnRTaXplLmhlaWdodCA9IGN1cnJlbnRIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBydW50aW1lSW5mby5icm93c2VyQ2xpZW50LnJlc2l6ZVdpbmRvdyh7IHdpZHRoLCBoZWlnaHQgfSk7XG4gICAgfSxcblxuICAgIGFzeW5jIGdldFZpZGVvRnJhbWVEYXRhIChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgeyBicm93c2VyQ2xpZW50IH0gPSB0aGlzLm9wZW5lZEJyb3dzZXJzW2Jyb3dzZXJJZF07XG5cbiAgICAgICAgcmV0dXJuIGJyb3dzZXJDbGllbnQuZ2V0U2NyZWVuc2hvdERhdGEoKTtcbiAgICB9LFxuXG4gICAgYXN5bmMgaGFzQ3VzdG9tQWN0aW9uRm9yQnJvd3NlciAoYnJvd3NlcklkKSB7XG4gICAgICAgIGNvbnN0IHsgY29uZmlnLCBicm93c2VyQ2xpZW50IH0gPSB0aGlzLm9wZW5lZEJyb3dzZXJzW2Jyb3dzZXJJZF07XG4gICAgICAgIGNvbnN0IGNsaWVudCAgICAgICAgICAgICAgICAgICAgPSBhd2FpdCBicm93c2VyQ2xpZW50LmdldEFjdGl2ZUNsaWVudCgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoYXNDbG9zZUJyb3dzZXI6ICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICBoYXNSZXNpemVXaW5kb3c6ICAgICAgICAgICAgICAgICEhY2xpZW50ICYmIChjb25maWcuZW11bGF0aW9uIHx8IGNvbmZpZy5oZWFkbGVzcyksXG4gICAgICAgICAgICBoYXNNYXhpbWl6ZVdpbmRvdzogICAgICAgICAgICAgICEhY2xpZW50ICYmIGNvbmZpZy5oZWFkbGVzcyxcbiAgICAgICAgICAgIGhhc1Rha2VTY3JlZW5zaG90OiAgICAgICAgICAgICAgISFjbGllbnQsXG4gICAgICAgICAgICBoYXNDaHJvbWVsZXNzU2NyZWVuc2hvdHM6ICAgICAgICEhY2xpZW50LFxuICAgICAgICAgICAgaGFzR2V0VmlkZW9GcmFtZURhdGE6ICAgICAgICAgICAhIWNsaWVudCxcbiAgICAgICAgICAgIGhhc0NhblJlc2l6ZVdpbmRvd1RvRGltZW5zaW9uczogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgYXN5bmMgX2Vuc3VyZVdpbmRvd0lzRXhwYW5kZWQgKGJyb3dzZXJJZCwgeyBoZWlnaHQsIHdpZHRoLCBhdmFpbGFibGVIZWlnaHQsIGF2YWlsYWJsZVdpZHRoLCBvdXRlcldpZHRoLCBvdXRlckhlaWdodCB9KSB7XG4gICAgICAgIGlmIChoZWlnaHQgPCBNSU5fQVZBSUxBQkxFX0RJTUVOU0lPTiB8fCB3aWR0aCA8IE1JTl9BVkFJTEFCTEVfRElNRU5TSU9OKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdIZWlnaHQgPSBNYXRoLm1heChhdmFpbGFibGVIZWlnaHQsIE1JTl9BVkFJTEFCTEVfRElNRU5TSU9OKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1dpZHRoICA9IE1hdGgubWF4KE1hdGguZmxvb3IoYXZhaWxhYmxlV2lkdGggLyAyKSwgTUlOX0FWQUlMQUJMRV9ESU1FTlNJT04pO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnJlc2l6ZVdpbmRvdyhicm93c2VySWQsIG5ld1dpZHRoLCBuZXdIZWlnaHQsIG91dGVyV2lkdGgsIG91dGVySGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iXX0=