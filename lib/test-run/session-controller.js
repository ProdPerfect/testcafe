"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const testcafe_hammerhead_1 = require("testcafe-hammerhead");
const _1 = __importDefault(require("./"));
const ACTIVE_SESSIONS_MAP = {};
const UPLOADS_DIR_NAME = '_uploads_';
class SessionController extends testcafe_hammerhead_1.Session {
    constructor(uploadRoots, options) {
        super(uploadRoots, options);
        this.currentTestRun = null;
    }
    // Hammerhead payload
    async getPayloadScript() {
        return this.currentTestRun.getPayloadScript();
    }
    async getIframePayloadScript() {
        return this.currentTestRun.getIframePayloadScript();
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
                const uploadRoots = [
                    path_1.default.resolve(UPLOADS_DIR_NAME),
                    path_1.default.resolve(fixtureDir, UPLOADS_DIR_NAME),
                    fixtureDir
                ];
                const options = {
                    disablePageCaching: testRun.disablePageCaching,
                    allowMultipleWindows: _1.default.isMultipleWindowsAllowed(testRun),
                    requestTimeout: testRun.requestTimeout
                };
                if (options.allowMultipleWindows)
                    options.windowId = testRun.browserConnection.activeWindowId;
                session = new SessionController(uploadRoots, options);
                session.currentTestRun = testRun;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3QtcnVuL3Nlc3Npb24tY29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4Qiw2REFBOEM7QUFDOUMsMENBQXlCO0FBR3pCLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBQy9CLE1BQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO0FBRXJDLE1BQXFCLGlCQUFrQixTQUFRLDZCQUFPO0lBQ2xELFlBQWEsV0FBVyxFQUFFLE9BQU87UUFDN0IsS0FBSyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU1QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQscUJBQXFCO0lBQ3JCLEtBQUssQ0FBQyxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVELEtBQUssQ0FBQyxzQkFBc0I7UUFDeEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUdELHNCQUFzQjtJQUN0QixvQkFBb0IsQ0FBRSxHQUFHLEVBQUUsVUFBVTtRQUNqQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztZQUM1QixPQUFPLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFakYsT0FBTyxLQUFLLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxrQkFBa0I7UUFDZCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNwRCxDQUFDO0lBRUQsa0JBQWtC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QUFJLENBQUM7WUFFakMsSUFBSSxpQkFBaUIsRUFBRTtnQkFDbkIscUJBQXFCLEdBQUc7b0JBQ3BCLEdBQUcsRUFBVSxpQkFBaUI7b0JBQzlCLFdBQVcsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVc7aUJBQ3hDLENBQUM7YUFDTDtZQUVELFdBQVcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQzFCLFdBQVcsQ0FBQyxHQUFHLEdBQUssS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1NBQzlGO1FBRUQsT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDO0lBQzNCLENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFFLE9BQU87UUFDeEIsTUFBTSxXQUFXLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXRFLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUs7WUFDdEQsT0FBTztRQUVYLFdBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVwRCxPQUFPLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3RCxDQUFDO0NBQ0o7QUE1SEQsb0NBNEhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTZXNzaW9uIH0gZnJvbSAndGVzdGNhZmUtaGFtbWVyaGVhZCc7XG5pbXBvcnQgVGVzdFJ1biBmcm9tICcuLyc7XG5cblxuY29uc3QgQUNUSVZFX1NFU1NJT05TX01BUCA9IHt9O1xuY29uc3QgVVBMT0FEU19ESVJfTkFNRSA9ICdfdXBsb2Fkc18nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXNzaW9uQ29udHJvbGxlciBleHRlbmRzIFNlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yICh1cGxvYWRSb290cywgb3B0aW9ucykge1xuICAgICAgICBzdXBlcih1cGxvYWRSb290cywgb3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VGVzdFJ1biA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gSGFtbWVyaGVhZCBwYXlsb2FkXG4gICAgYXN5bmMgZ2V0UGF5bG9hZFNjcmlwdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUZXN0UnVuLmdldFBheWxvYWRTY3JpcHQoKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRJZnJhbWVQYXlsb2FkU2NyaXB0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRlc3RSdW4uZ2V0SWZyYW1lUGF5bG9hZFNjcmlwdCgpO1xuICAgIH1cblxuXG4gICAgLy8gSGFtbWVyaGVhZCBoYW5kbGVyc1xuICAgIGhhbmRsZVNlcnZpY2VNZXNzYWdlIChtc2csIHNlcnZlckluZm8pIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRlc3RSdW5bbXNnLmNtZF0pXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlU2VydmljZU1lc3NhZ2UuY2FsbCh0aGlzLmN1cnJlbnRUZXN0UnVuLCBtc2csIHNlcnZlckluZm8pO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGVTZXJ2aWNlTWVzc2FnZShtc2csIHNlcnZlckluZm8pO1xuICAgIH1cblxuICAgIGdldEF1dGhDcmVkZW50aWFscyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUZXN0UnVuLmdldEF1dGhDcmVkZW50aWFscygpO1xuICAgIH1cblxuICAgIGhhbmRsZUZpbGVEb3dubG9hZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUZXN0UnVuLmhhbmRsZUZpbGVEb3dubG9hZCgpO1xuICAgIH1cblxuICAgIGhhbmRsZVBhZ2VFcnJvciAoY3R4LCBlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRlc3RSdW4uaGFuZGxlUGFnZUVycm9yKGN0eCwgZXJyKTtcbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICBzdGF0aWMgZ2V0U2Vzc2lvbiAodGVzdFJ1bikge1xuICAgICAgICBsZXQgc2Vzc2lvbkluZm8gPSBBQ1RJVkVfU0VTU0lPTlNfTUFQW3Rlc3RSdW4uYnJvd3NlckNvbm5lY3Rpb24uaWRdO1xuXG4gICAgICAgIGlmICghc2Vzc2lvbkluZm8gfHwgIXRlc3RSdW4uZGlzYWJsZVBhZ2VSZWxvYWRzKSB7XG4gICAgICAgICAgICBpZiAoc2Vzc2lvbkluZm8gJiYgc2Vzc2lvbkluZm8udXJsKVxuICAgICAgICAgICAgICAgIFNlc3Npb25Db250cm9sbGVyLmNsb3NlU2Vzc2lvbih0ZXN0UnVuKTtcblxuICAgICAgICAgICAgbGV0IHNlc3Npb24gPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAodGVzdFJ1bi50ZXN0LmlzTGVnYWN5KVxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSB0ZXN0UnVuO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZml4dHVyZURpciA9IHBhdGguZGlybmFtZSh0ZXN0UnVuLnRlc3QuZml4dHVyZS5wYXRoKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHVwbG9hZFJvb3RzID0gW1xuICAgICAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoVVBMT0FEU19ESVJfTkFNRSksXG4gICAgICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShmaXh0dXJlRGlyLCBVUExPQURTX0RJUl9OQU1FKSxcbiAgICAgICAgICAgICAgICAgICAgZml4dHVyZURpclxuICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlUGFnZUNhY2hpbmc6ICAgdGVzdFJ1bi5kaXNhYmxlUGFnZUNhY2hpbmcsXG4gICAgICAgICAgICAgICAgICAgIGFsbG93TXVsdGlwbGVXaW5kb3dzOiBUZXN0UnVuLmlzTXVsdGlwbGVXaW5kb3dzQWxsb3dlZCh0ZXN0UnVuKSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFRpbWVvdXQ6ICAgICAgIHRlc3RSdW4ucmVxdWVzdFRpbWVvdXRcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWxsb3dNdWx0aXBsZVdpbmRvd3MpXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMud2luZG93SWQgPSB0ZXN0UnVuLmJyb3dzZXJDb25uZWN0aW9uLmFjdGl2ZVdpbmRvd0lkO1xuXG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IG5ldyBTZXNzaW9uQ29udHJvbGxlcih1cGxvYWRSb290cywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICBzZXNzaW9uLmN1cnJlbnRUZXN0UnVuID0gdGVzdFJ1bjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2Vzc2lvbkluZm8gPSB7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbjogc2Vzc2lvbixcbiAgICAgICAgICAgICAgICBwcm94eTogICBudWxsLFxuICAgICAgICAgICAgICAgIHVybDogICAgIG51bGxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFDVElWRV9TRVNTSU9OU19NQVBbdGVzdFJ1bi5icm93c2VyQ29ubmVjdGlvbi5pZF0gPSBzZXNzaW9uSW5mbztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGVzdFJ1bi50ZXN0LmlzTGVnYWN5KVxuICAgICAgICAgICAgc2Vzc2lvbkluZm8uc2Vzc2lvbi5jdXJyZW50VGVzdFJ1biA9IHRlc3RSdW47XG5cbiAgICAgICAgcmV0dXJuIHNlc3Npb25JbmZvLnNlc3Npb247XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFNlc3Npb25VcmwgKHRlc3RSdW4sIHByb3h5KSB7XG4gICAgICAgIGxldCBzZXNzaW9uSW5mbyA9IEFDVElWRV9TRVNTSU9OU19NQVBbdGVzdFJ1bi5icm93c2VyQ29ubmVjdGlvbi5pZF07XG5cbiAgICAgICAgaWYgKCFzZXNzaW9uSW5mbyB8fCB0ZXN0UnVuLnRlc3QuaXNMZWdhY3kpIHtcbiAgICAgICAgICAgIFNlc3Npb25Db250cm9sbGVyLmdldFNlc3Npb24odGVzdFJ1bik7XG5cbiAgICAgICAgICAgIHNlc3Npb25JbmZvID0gQUNUSVZFX1NFU1NJT05TX01BUFt0ZXN0UnVuLmJyb3dzZXJDb25uZWN0aW9uLmlkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2Vzc2lvbkluZm8udXJsKSB7XG4gICAgICAgICAgICBjb25zdCBwYWdlVXJsICAgICAgICAgICAgID0gdGVzdFJ1bi50ZXN0LnBhZ2VVcmw7XG4gICAgICAgICAgICBjb25zdCBleHRlcm5hbFByb3h5SG9zdCAgID0gdGVzdFJ1bi5vcHRzLnByb3h5O1xuICAgICAgICAgICAgbGV0IGV4dGVybmFsUHJveHlTZXR0aW5ncyA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChleHRlcm5hbFByb3h5SG9zdCkge1xuICAgICAgICAgICAgICAgIGV4dGVybmFsUHJveHlTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAgICAgICAgIGV4dGVybmFsUHJveHlIb3N0LFxuICAgICAgICAgICAgICAgICAgICBieXBhc3NSdWxlczogdGVzdFJ1bi5vcHRzLnByb3h5QnlwYXNzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2Vzc2lvbkluZm8ucHJveHkgPSBwcm94eTtcbiAgICAgICAgICAgIHNlc3Npb25JbmZvLnVybCAgID0gcHJveHkub3BlblNlc3Npb24ocGFnZVVybCwgc2Vzc2lvbkluZm8uc2Vzc2lvbiwgZXh0ZXJuYWxQcm94eVNldHRpbmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXNzaW9uSW5mby51cmw7XG4gICAgfVxuXG4gICAgc3RhdGljIGNsb3NlU2Vzc2lvbiAodGVzdFJ1bikge1xuICAgICAgICBjb25zdCBzZXNzaW9uSW5mbyA9IEFDVElWRV9TRVNTSU9OU19NQVBbdGVzdFJ1bi5icm93c2VyQ29ubmVjdGlvbi5pZF07XG5cbiAgICAgICAgaWYgKCFzZXNzaW9uSW5mbyB8fCAhc2Vzc2lvbkluZm8udXJsIHx8ICFzZXNzaW9uSW5mby5wcm94eSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBzZXNzaW9uSW5mby5wcm94eS5jbG9zZVNlc3Npb24oc2Vzc2lvbkluZm8uc2Vzc2lvbik7XG5cbiAgICAgICAgZGVsZXRlIEFDVElWRV9TRVNTSU9OU19NQVBbdGVzdFJ1bi5icm93c2VyQ29ubmVjdGlvbi5pZF07XG4gICAgfVxufVxuXG4iXX0=