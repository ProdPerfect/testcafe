"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const testcafe_hammerhead_1 = require("testcafe-hammerhead");
const unstable_network_mode_1 = require("../browser/connection/unstable-network-mode");
const ACTIVE_SESSIONS_MAP = {};
const UPLOADS_DIR_NAME = '_uploads_';
class SessionController extends testcafe_hammerhead_1.Session {
    constructor(uploadRoots) {
        super(uploadRoots);
        this.currentTestRun = null;
    }
    // Hammerhead payload
    _getPayloadScript() {
        return this.currentTestRun._getPayloadScript();
    }
    _getIframePayloadScript() {
        return this.currentTestRun._getIframePayloadScript();
    }
    // Hammerhead handlers
    handleServiceMessage(msg, serverInfo) {
        if (this.currentTestRun[msg.cmd])
            return super.handleServiceMessage.call(this.currentTestRun, msg, serverInfo);
        return super.handleServiceMessage(msg, serverInfo);
    }
    getAuthCredentials() {
        return this.currentTestRun.getAuthCredentials();
    }
    handleFileDownload() {
        return this.currentTestRun.handleFileDownload();
    }
    handlePageError(ctx, err) {
        return this.currentTestRun.handlePageError(ctx, err);
    }
    onPageRequest(ctx) {
        const pendingStateSnapshot = this.pendingStateSnapshot;
        super.onPageRequest(ctx);
        if (pendingStateSnapshot && ctx.req.headers[unstable_network_mode_1.UNSTABLE_NETWORK_MODE_HEADER])
            this.pendingStateSnapshot = pendingStateSnapshot;
    }
    // API
    static getSession(testRun) {
        let sessionInfo = ACTIVE_SESSIONS_MAP[testRun.browserConnection.id];
        if (!sessionInfo || !testRun.disablePageReloads) {
            if (sessionInfo && sessionInfo.url)
                SessionController.closeSession(testRun);
            let session = null;
            if (testRun.test.isLegacy)
                session = testRun;
            else {
                const fixtureDir = path_1.default.dirname(testRun.test.fixture.path);
                session = new SessionController([
                    path_1.default.resolve(UPLOADS_DIR_NAME),
                    path_1.default.resolve(fixtureDir, UPLOADS_DIR_NAME),
                    fixtureDir
                ]);
                session.currentTestRun = testRun;
            }
            session.disablePageCaching = testRun.disablePageCaching;
            session.allowMultipleWindows = testRun.allowMultipleWindows;
            if (session.allowMultipleWindows)
                session.windowId = testRun.browserConnection.activeWindowId;
            sessionInfo = {
                session: session,
                proxy: null,
                url: null
            };
            ACTIVE_SESSIONS_MAP[testRun.browserConnection.id] = sessionInfo;
        }
        else if (!testRun.test.isLegacy)
            sessionInfo.session.currentTestRun = testRun;
        return sessionInfo.session;
    }
    static getSessionUrl(testRun, proxy) {
        let sessionInfo = ACTIVE_SESSIONS_MAP[testRun.browserConnection.id];
        if (!sessionInfo || testRun.test.isLegacy) {
            SessionController.getSession(testRun);
            sessionInfo = ACTIVE_SESSIONS_MAP[testRun.browserConnection.id];
        }
        if (!sessionInfo.url) {
            const pageUrl = testRun.test.pageUrl;
            const externalProxyHost = testRun.opts.proxy;
            let externalProxySettings = null;
            if (externalProxyHost) {
                externalProxySettings = {
                    url: externalProxyHost,
                    bypassRules: testRun.opts.proxyBypass
                };
            }
            sessionInfo.proxy = proxy;
            sessionInfo.url = proxy.openSession(pageUrl, sessionInfo.session, externalProxySettings);
        }
        return sessionInfo.url;
    }
    static closeSession(testRun) {
        const sessionInfo = ACTIVE_SESSIONS_MAP[testRun.browserConnection.id];
        if (!sessionInfo || !sessionInfo.url || !sessionInfo.proxy)
            return;
        sessionInfo.proxy.closeSession(sessionInfo.session);
        delete ACTIVE_SESSIONS_MAP[testRun.browserConnection.id];
    }
}
exports.default = SessionController;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3QtcnVuL3Nlc3Npb24tY29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4Qiw2REFBOEM7QUFDOUMsdUZBQTJGO0FBRzNGLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBQy9CLE1BQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO0FBRXJDLE1BQXFCLGlCQUFrQixTQUFRLDZCQUFPO0lBQ2xELFlBQWEsV0FBVztRQUNwQixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDL0IsQ0FBQztJQUVELHFCQUFxQjtJQUNyQixpQkFBaUI7UUFDYixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBRUQsdUJBQXVCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFHRCxzQkFBc0I7SUFDdEIsb0JBQW9CLENBQUUsR0FBRyxFQUFFLFVBQVU7UUFDakMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7WUFDNUIsT0FBTyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWpGLE9BQU8sS0FBSyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVELGtCQUFrQjtRQUNkLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFB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QUFPLENBQUM7WUFDakQsTUFBTSxpQkFBaUIsR0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMvQyxJQUFJLHFCQUFxQixHQUFHLElBQUksQ0FBQztZQUVqQyxJQUFJLGlCQUFpQixFQUFFO2dCQUNuQixxQkFBcUIsR0FBRztvQkFDcEIsR0FBRyxFQUFVLGlCQUFpQjtvQkFDOUIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVztpQkFDeEMsQ0FBQzthQUNMO1lBRUQsV0FBVyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDMUIsV0FBVyxDQUFDLEdBQUcsR0FBSyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLHFCQUFxQixDQUFDLENBQUM7U0FDOUY7UUFFRCxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUM7SUFDM0IsQ0FBQztJQUVELE1BQU0sQ0FBQyxZQUFZLENBQUUsT0FBTztRQUN4QixNQUFNLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdEUsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSztZQUN0RCxPQUFPO1FBRVgsV0FBVyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBELE9BQU8sbUJBQW1CLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FDSjtBQS9IRCxvQ0ErSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFNlc3Npb24gfSBmcm9tICd0ZXN0Y2FmZS1oYW1tZXJoZWFkJztcbmltcG9ydCB7IFVOU1RBQkxFX05FVFdPUktfTU9ERV9IRUFERVIgfSBmcm9tICcuLi9icm93c2VyL2Nvbm5lY3Rpb24vdW5zdGFibGUtbmV0d29yay1tb2RlJztcblxuXG5jb25zdCBBQ1RJVkVfU0VTU0lPTlNfTUFQID0ge307XG5jb25zdCBVUExPQURTX0RJUl9OQU1FID0gJ191cGxvYWRzXyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlc3Npb25Db250cm9sbGVyIGV4dGVuZHMgU2Vzc2lvbiB7XG4gICAgY29uc3RydWN0b3IgKHVwbG9hZFJvb3RzKSB7XG4gICAgICAgIHN1cGVyKHVwbG9hZFJvb3RzKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRUZXN0UnVuID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBIYW1tZXJoZWFkIHBheWxvYWRcbiAgICBfZ2V0UGF5bG9hZFNjcmlwdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUZXN0UnVuLl9nZXRQYXlsb2FkU2NyaXB0KCk7XG4gICAgfVxuXG4gICAgX2dldElmcmFtZVBheWxvYWRTY3JpcHQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGVzdFJ1bi5fZ2V0SWZyYW1lUGF5bG9hZFNjcmlwdCgpO1xuICAgIH1cblxuXG4gICAgLy8gSGFtbWVyaGVhZCBoYW5kbGVyc1xuICAgIGhhbmRsZVNlcnZpY2VNZXNzYWdlIChtc2csIHNlcnZlckluZm8pIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRlc3RSdW5bbXNnLmNtZF0pXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlU2VydmljZU1lc3NhZ2UuY2FsbCh0aGlzLmN1cnJlbnRUZXN0UnVuLCBtc2csIHNlcnZlckluZm8pO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGVTZXJ2aWNlTWVzc2FnZShtc2csIHNlcnZlckluZm8pO1xuICAgIH1cblxuICAgIGdldEF1dGhDcmVkZW50aWFscyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUZXN0UnVuLmdldEF1dGhDcmVkZW50aWFscygpO1xuICAgIH1cblxuICAgIGhhbmRsZUZpbGVEb3dubG9hZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUZXN0UnVuLmhhbmRsZUZpbGVEb3dubG9hZCgpO1xuICAgIH1cblxuICAgIGhhbmRsZVBhZ2VFcnJvciAoY3R4LCBlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRlc3RSdW4uaGFuZGxlUGFnZUVycm9yKGN0eCwgZXJyKTtcbiAgICB9XG5cbiAgICBvblBhZ2VSZXF1ZXN0IChjdHgpIHtcbiAgICAgICAgY29uc3QgcGVuZGluZ1N0YXRlU25hcHNob3QgPSB0aGlzLnBlbmRpbmdTdGF0ZVNuYXBzaG90O1xuXG4gICAgICAgIHN1cGVyLm9uUGFnZVJlcXVlc3QoY3R4KTtcblxuICAgICAgICBpZiAocGVuZGluZ1N0YXRlU25hcHNob3QgJiYgY3R4LnJlcS5oZWFkZXJzW1VOU1RBQkxFX05FVFdPUktfTU9ERV9IRUFERVJdKVxuICAgICAgICAgICAgdGhpcy5wZW5kaW5nU3RhdGVTbmFwc2hvdCA9IHBlbmRpbmdTdGF0ZVNuYXBzaG90O1xuICAgIH1cbiAgICAvLyBBUElcbiAgICBzdGF0aWMgZ2V0U2Vzc2lvbiAodGVzdFJ1bikge1xuICAgICAgICBsZXQgc2Vzc2lvbkluZm8gPSBBQ1RJVkVfU0VTU0lPTlNfTUFQW3Rlc3RSdW4uYnJvd3NlckNvbm5lY3Rpb24uaWRdO1xuXG4gICAgICAgIGlmICghc2Vzc2lvbkluZm8gfHwgIXRlc3RSdW4uZGlzYWJsZVBhZ2VSZWxvYWRzKSB7XG4gICAgICAgICAgICBpZiAoc2Vzc2lvbkluZm8gJiYgc2Vzc2lvbkluZm8udXJsKVxuICAgICAgICAgICAgICAgIFNlc3Npb25Db250cm9sbGVyLmNsb3NlU2Vzc2lvbih0ZXN0UnVuKTtcblxuICAgICAgICAgICAgbGV0IHNlc3Npb24gPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAodGVzdFJ1bi50ZXN0LmlzTGVnYWN5KVxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSB0ZXN0UnVuO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZml4dHVyZURpciA9IHBhdGguZGlybmFtZSh0ZXN0UnVuLnRlc3QuZml4dHVyZS5wYXRoKTtcblxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSBuZXcgU2Vzc2lvbkNvbnRyb2xsZXIoW1xuICAgICAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoVVBMT0FEU19ESVJfTkFNRSksXG4gICAgICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShmaXh0dXJlRGlyLCBVUExPQURTX0RJUl9OQU1FKSxcbiAgICAgICAgICAgICAgICAgICAgZml4dHVyZURpclxuICAgICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICAgICAgc2Vzc2lvbi5jdXJyZW50VGVzdFJ1biA9IHRlc3RSdW47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlc3Npb24uZGlzYWJsZVBhZ2VDYWNoaW5nICAgPSB0ZXN0UnVuLmRpc2FibGVQYWdlQ2FjaGluZztcbiAgICAgICAgICAgIHNlc3Npb24uYWxsb3dNdWx0aXBsZVdpbmRvd3MgPSB0ZXN0UnVuLmFsbG93TXVsdGlwbGVXaW5kb3dzO1xuXG4gICAgICAgICAgICBpZiAoc2Vzc2lvbi5hbGxvd011bHRpcGxlV2luZG93cylcbiAgICAgICAgICAgICAgICBzZXNzaW9uLndpbmRvd0lkID0gdGVzdFJ1bi5icm93c2VyQ29ubmVjdGlvbi5hY3RpdmVXaW5kb3dJZDtcblxuICAgICAgICAgICAgc2Vzc2lvbkluZm8gPSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbjogc2Vzc2lvbixcbiAgICAgICAgICAgICAgICBwcm94eTogICBudWxsLFxuICAgICAgICAgICAgICAgIHVybDogICAgIG51bGxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFDVElWRV9TRVNTSU9OU19NQVBbdGVzdFJ1bi5icm93c2VyQ29ubmVjdGlvbi5pZF0gPSBzZXNzaW9uSW5mbztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGVzdFJ1bi50ZXN0LmlzTGVnYWN5KVxuICAgICAgICAgICAgc2Vzc2lvbkluZm8uc2Vzc2lvbi5jdXJyZW50VGVzdFJ1biA9IHRlc3RSdW47XG5cbiAgICAgICAgcmV0dXJuIHNlc3Npb25JbmZvLnNlc3Npb247XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFNlc3Npb25VcmwgKHRlc3RSdW4sIHByb3h5KSB7XG4gICAgICAgIGxldCBzZXNzaW9uSW5mbyA9IEFDVElWRV9TRVNTSU9OU19NQVBbdGVzdFJ1bi5icm93c2VyQ29ubmVjdGlvbi5pZF07XG5cbiAgICAgICAgaWYgKCFzZXNzaW9uSW5mbyB8fCB0ZXN0UnVuLnRlc3QuaXNMZWdhY3kpIHtcbiAgICAgICAgICAgIFNlc3Npb25Db250cm9sbGVyLmdldFNlc3Npb24odGVzdFJ1bik7XG5cbiAgICAgICAgICAgIHNlc3Npb25JbmZvID0gQUNUSVZFX1NFU1NJT05TX01BUFt0ZXN0UnVuLmJyb3dzZXJDb25uZWN0aW9uLmlkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2Vzc2lvbkluZm8udXJsKSB7XG4gICAgICAgICAgICBjb25zdCBwYWdlVXJsICAgICAgICAgICAgID0gdGVzdFJ1bi50ZXN0LnBhZ2VVcmw7XG4gICAgICAgICAgICBjb25zdCBleHRlcm5hbFByb3h5SG9zdCAgID0gdGVzdFJ1bi5vcHRzLnByb3h5O1xuICAgICAgICAgICAgbGV0IGV4dGVybmFsUHJveHlTZXR0aW5ncyA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChleHRlcm5hbFByb3h5SG9zdCkge1xuICAgICAgICAgICAgICAgIGV4dGVybmFsUHJveHlTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAgICAgICAgIGV4dGVybmFsUHJveHlIb3N0LFxuICAgICAgICAgICAgICAgICAgICBieXBhc3NSdWxlczogdGVzdFJ1bi5vcHRzLnByb3h5QnlwYXNzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2Vzc2lvbkluZm8ucHJveHkgPSBwcm94eTtcbiAgICAgICAgICAgIHNlc3Npb25JbmZvLnVybCAgID0gcHJveHkub3BlblNlc3Npb24ocGFnZVVybCwgc2Vzc2lvbkluZm8uc2Vzc2lvbiwgZXh0ZXJuYWxQcm94eVNldHRpbmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXNzaW9uSW5mby51cmw7XG4gICAgfVxuXG4gICAgc3RhdGljIGNsb3NlU2Vzc2lvbiAodGVzdFJ1bikge1xuICAgICAgICBjb25zdCBzZXNzaW9uSW5mbyA9IEFDVElWRV9TRVNTSU9OU19NQVBbdGVzdFJ1bi5icm93c2VyQ29ubmVjdGlvbi5pZF07XG5cbiAgICAgICAgaWYgKCFzZXNzaW9uSW5mbyB8fCAhc2Vzc2lvbkluZm8udXJsIHx8ICFzZXNzaW9uSW5mby5wcm94eSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBzZXNzaW9uSW5mby5wcm94eS5jbG9zZVNlc3Npb24oc2Vzc2lvbkluZm8uc2Vzc2lvbik7XG5cbiAgICAgICAgZGVsZXRlIEFDVElWRV9TRVNTSU9OU19NQVBbdGVzdFJ1bi5icm93c2VyQ29ubmVjdGlvbi5pZF07XG4gICAgfVxufVxuXG4iXX0=