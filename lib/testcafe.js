"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./errors/runtime");
const types_1 = require("./errors/types");
const content_types_1 = __importDefault(require("./assets/content-types"));
const option_names_1 = __importDefault(require("./configuration/option-names"));
const INJECTABLES = __importStar(require("./assets/injectables"));
const lazyRequire = require('import-lazy')(require);
const sourceMapSupport = lazyRequire('source-map-support');
const hammerhead = lazyRequire('testcafe-hammerhead');
const loadAssets = lazyRequire('./load-assets');
const errorHandlers = lazyRequire('./utils/handle-errors');
const BrowserConnectionGateway = lazyRequire('./browser/connection/gateway');
const BrowserConnection = lazyRequire('./browser/connection');
const browserProviderPool = lazyRequire('./browser/provider/pool');
const CompilerHost = lazyRequire('./services/compiler/host');
const Runner = lazyRequire('./runner');
const LiveModeRunner = lazyRequire('./live/test-runner');
// NOTE: CoffeeScript can't be loaded lazily, because it will break stack traces
require('coffeescript');
class TestCafe {
    constructor(configuration) {
        this._setupSourceMapsSupport();
        errorHandlers.registerErrorHandlers();
        const { hostname, port1, port2, options } = configuration.startOptions;
        this.closed = false;
        this.proxy = new hammerhead.Proxy(hostname, port1, port2, options);
        this.browserConnectionGateway = new BrowserConnectionGateway(this.proxy, { retryTestPages: configuration.getOption(option_names_1.default.retryTestPages) });
        this.runners = [];
        this.configuration = configuration;
        this.compilerService = configuration.getOption(option_names_1.default.experimentalCompilerService) ? new CompilerHost() : void 0;
        this._registerAssets(options.developmentMode);
    }
    _registerAssets(developmentMode) {
        const { favIcon, coreScript, driverScript, uiScript, uiStyle, uiSprite, uiSpriteSvg, automationScript, legacyRunnerScript } = loadAssets(developmentMode);
        this.proxy.GET(INJECTABLES.TESTCAFE_CORE, { content: coreScript, contentType: content_types_1.default.javascript });
        this.proxy.GET(INJECTABLES.TESTCAFE_DRIVER, { content: driverScript, contentType: content_types_1.default.javascript });
        this.proxy.GET(INJECTABLES.TESTCAFE_LEGACY_RUNNER, {
            content: legacyRunnerScript,
            contentType: content_types_1.default.javascript
        });
        this.proxy.GET(INJECTABLES.TESTCAFE_AUTOMATION, { content: automationScript, contentType: content_types_1.default.javascript });
        this.proxy.GET(INJECTABLES.TESTCAFE_UI, { content: uiScript, contentType: content_types_1.default.javascript });
        this.proxy.GET(INJECTABLES.TESTCAFE_UI_SPRITE, { content: uiSprite, contentType: content_types_1.default.png });
        this.proxy.GET(INJECTABLES.TESTCAFE_UI_SPRITE_SVG, { content: uiSpriteSvg, contentType: content_types_1.default.svg });
        this.proxy.GET(INJECTABLES.TESTCAFE_ICON, { content: favIcon, contentType: content_types_1.default.icon });
        this.proxy.GET(INJECTABLES.TESTCAFE_UI_STYLES, {
            content: uiStyle,
            contentType: content_types_1.default.css,
            isShadowUIStylesheet: true
        });
    }
    _setupSourceMapsSupport() {
        sourceMapSupport.install({
            hookRequire: true,
            handleUncaughtExceptions: false,
            environment: 'node'
        });
    }
    _createRunner(isLiveMode) {
        const Ctor = isLiveMode ? LiveModeRunner : Runner;
        const newRunner = new Ctor(this.proxy, this.browserConnectionGateway, this.configuration.clone(), this.compilerService);
        this.runners.push(newRunner);
        return newRunner;
    }
    // API
    async createBrowserConnection() {
        const browserInfo = await browserProviderPool.getBrowserInfo('remote');
        return new BrowserConnection(this.browserConnectionGateway, browserInfo, true);
    }
    createRunner() {
        return this._createRunner(false);
    }
    createLiveModeRunner() {
        if (this.runners.some(runner => runner instanceof LiveModeRunner))
            throw new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.cannotCreateMultipleLiveModeRunners);
        return this._createRunner(true);
    }
    async close() {
        if (this.closed)
            return;
        this.closed = true;
        await Promise.all(this.runners.map(runner => runner.stop()));
        await browserProviderPool.dispose();
        if (this.compilerService)
            this.compilerService.stop();
        this.browserConnectionGateway.close();
        this.proxy.close();
    }
}
exports.default = TestCafe;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGNhZmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdGVzdGNhZmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsOENBQWdEO0FBQ2hELDBDQUFnRDtBQUNoRCwyRUFBbUQ7QUFDbkQsZ0ZBQXdEO0FBQ3hELGtFQUFvRDtBQUVwRCxNQUFNLFdBQVcsR0FBZ0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sZ0JBQWdCLEdBQVcsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDbkUsTUFBTSxVQUFVLEdBQWlCLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3BFLE1BQU0sVUFBVSxHQUFpQixXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDOUQsTUFBTSxhQUFhLEdBQWMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdEUsTUFBTSx3QkFBd0IsR0FBRyxXQUFXLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUM3RSxNQUFNLGlCQUFpQixHQUFVLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3JFLE1BQU0sbUJBQW1CLEdBQVEsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDeEUsTUFBTSxZQUFZLEdBQWUsV0FBVyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDekUsTUFBTSxNQUFNLEdBQXFCLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN6RCxNQUFNLGNBQWMsR0FBYSxXQUFXLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUVuRSxnRkFBZ0Y7QUFDaEYsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRXhCLE1BQXFCLFFBQVE7SUFDekIsWUFBYSxhQUFhO1FBQ3RCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRXRDLE1BQU0sRUFBRSxRQUFRLEVBQUUs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QkFBWSxDQUFDLHNCQUFjLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUUvRSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1AsSUFBSSxJQUFJLENBQUMsTUFBTTtZQUNYLE9BQU87UUFFWCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUVuQixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTdELE1BQU0sbUJBQW1CLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFcEMsSUFBSSxJQUFJLENBQUMsZUFBZTtZQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWhDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSjtBQTlGRCwyQkE4RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHZW5lcmFsRXJyb3IgfSBmcm9tICcuL2Vycm9ycy9ydW50aW1lJztcbmltcG9ydCB7IFJVTlRJTUVfRVJST1JTIH0gZnJvbSAnLi9lcnJvcnMvdHlwZXMnO1xuaW1wb3J0IENPTlRFTlRfVFlQRVMgZnJvbSAnLi9hc3NldHMvY29udGVudC10eXBlcyc7XG5pbXBvcnQgT1BUSU9OX05BTUVTIGZyb20gJy4vY29uZmlndXJhdGlvbi9vcHRpb24tbmFtZXMnO1xuaW1wb3J0ICogYXMgSU5KRUNUQUJMRVMgZnJvbSAnLi9hc3NldHMvaW5qZWN0YWJsZXMnO1xuXG5jb25zdCBsYXp5UmVxdWlyZSAgICAgICAgICAgICAgPSByZXF1aXJlKCdpbXBvcnQtbGF6eScpKHJlcXVpcmUpO1xuY29uc3Qgc291cmNlTWFwU3VwcG9ydCAgICAgICAgID0gbGF6eVJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpO1xuY29uc3QgaGFtbWVyaGVhZCAgICAgICAgICAgICAgID0gbGF6eVJlcXVpcmUoJ3Rlc3RjYWZlLWhhbW1lcmhlYWQnKTtcbmNvbnN0IGxvYWRBc3NldHMgICAgICAgICAgICAgICA9IGxhenlSZXF1aXJlKCcuL2xvYWQtYXNzZXRzJyk7XG5jb25zdCBlcnJvckhhbmRsZXJzICAgICAgICAgICAgPSBsYXp5UmVxdWlyZSgnLi91dGlscy9oYW5kbGUtZXJyb3JzJyk7XG5jb25zdCBCcm93c2VyQ29ubmVjdGlvbkdhdGV3YXkgPSBsYXp5UmVxdWlyZSgnLi9icm93c2VyL2Nvbm5lY3Rpb24vZ2F0ZXdheScpO1xuY29uc3QgQnJvd3NlckNvbm5lY3Rpb24gICAgICAgID0gbGF6eVJlcXVpcmUoJy4vYnJvd3Nlci9jb25uZWN0aW9uJyk7XG5jb25zdCBicm93c2VyUHJvdmlkZXJQb29sICAgICAgPSBsYXp5UmVxdWlyZSgnLi9icm93c2VyL3Byb3ZpZGVyL3Bvb2wnKTtcbmNvbnN0IENvbXBpbGVySG9zdCAgICAgICAgICAgICA9IGxhenlSZXF1aXJlKCcuL3NlcnZpY2VzL2NvbXBpbGVyL2hvc3QnKTtcbmNvbnN0IFJ1bm5lciAgICAgICAgICAgICAgICAgICA9IGxhenlSZXF1aXJlKCcuL3J1bm5lcicpO1xuY29uc3QgTGl2ZU1vZGVSdW5uZXIgICAgICAgICAgID0gbGF6eVJlcXVpcmUoJy4vbGl2ZS90ZXN0LXJ1bm5lcicpO1xuXG4vLyBOT1RFOiBDb2ZmZWVTY3JpcHQgY2FuJ3QgYmUgbG9hZGVkIGxhemlseSwgYmVjYXVzZSBpdCB3aWxsIGJyZWFrIHN0YWNrIHRyYWNlc1xucmVxdWlyZSgnY29mZmVlc2NyaXB0Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlc3RDYWZlIHtcbiAgICBjb25zdHJ1Y3RvciAoY29uZmlndXJhdGlvbikge1xuICAgICAgICB0aGlzLl9zZXR1cFNvdXJjZU1hcHNTdXBwb3J0KCk7XG4gICAgICAgIGVycm9ySGFuZGxlcnMucmVnaXN0ZXJFcnJvckhhbmRsZXJzKCk7XG5cbiAgICAgICAgY29uc3QgeyBob3N0bmFtZSwgcG9ydDEsIHBvcnQyLCBvcHRpb25zIH0gPSBjb25maWd1cmF0aW9uLnN0YXJ0T3B0aW9ucztcblxuICAgICAgICB0aGlzLmNsb3NlZCAgICAgICAgICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICB0aGlzLnByb3h5ICAgICAgICAgICAgICAgICAgICA9IG5ldyBoYW1tZXJoZWFkLlByb3h5KGhvc3RuYW1lLCBwb3J0MSwgcG9ydDIsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheSA9IG5ldyBCcm93c2VyQ29ubmVjdGlvbkdhdGV3YXkodGhpcy5wcm94eSwgeyByZXRyeVRlc3RQYWdlczogY29uZmlndXJhdGlvbi5nZXRPcHRpb24oT1BUSU9OX05BTUVTLnJldHJ5VGVzdFBhZ2VzKSB9KTtcbiAgICAgICAgdGhpcy5ydW5uZXJzICAgICAgICAgICAgICAgICAgPSBbXTtcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uICAgICAgICAgICAgPSBjb25maWd1cmF0aW9uO1xuXG4gICAgICAgIHRoaXMuY29tcGlsZXJTZXJ2aWNlID0gY29uZmlndXJhdGlvbi5nZXRPcHRpb24oT1BUSU9OX05BTUVTLmV4cGVyaW1lbnRhbENvbXBpbGVyU2VydmljZSkgPyBuZXcgQ29tcGlsZXJIb3N0KCkgOiB2b2lkIDA7XG5cbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJBc3NldHMob3B0aW9ucy5kZXZlbG9wbWVudE1vZGUpO1xuICAgIH1cblxuICAgIF9yZWdpc3RlckFzc2V0cyAoZGV2ZWxvcG1lbnRNb2RlKSB7XG4gICAgICAgIGNvbnN0IHsgZmF2SWNvbiwgY29yZVNjcmlwdCwgZHJpdmVyU2NyaXB0LCB1aVNjcmlwdCxcbiAgICAgICAgICAgIHVpU3R5bGUsIHVpU3ByaXRlLCB1aVNwcml0ZVN2ZywgYXV0b21hdGlvblNjcmlwdCwgbGVnYWN5UnVubmVyU2NyaXB0IH0gPSBsb2FkQXNzZXRzKGRldmVsb3BtZW50TW9kZSk7XG5cbiAgICAgICAgdGhpcy5wcm94eS5HRVQoSU5KRUNUQUJMRVMuVEVTVENBRkVfQ09SRSwgeyBjb250ZW50OiBjb3JlU2NyaXB0LCBjb250ZW50VHlwZTogQ09OVEVOVF9UWVBFUy5qYXZhc2NyaXB0IH0pO1xuICAgICAgICB0aGlzLnByb3h5LkdFVChJTkpFQ1RBQkxFUy5URVNUQ0FGRV9EUklWRVIsIHsgY29udGVudDogZHJpdmVyU2NyaXB0LCBjb250ZW50VHlwZTogQ09OVEVOVF9UWVBFUy5qYXZhc2NyaXB0IH0pO1xuXG4gICAgICAgIHRoaXMucHJveHkuR0VUKElOSkVDVEFCTEVTLlRFU1RDQUZFX0xFR0FDWV9SVU5ORVIsIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6ICAgICBsZWdhY3lSdW5uZXJTY3JpcHQsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogQ09OVEVOVF9UWVBFUy5qYXZhc2NyaXB0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucHJveHkuR0VUKElOSkVDVEFCTEVTLlRFU1RDQUZFX0FVVE9NQVRJT04sIHsgY29udGVudDogYXV0b21hdGlvblNjcmlwdCwgY29udGVudFR5cGU6IENPTlRFTlRfVFlQRVMuamF2YXNjcmlwdCB9KTtcbiAgICAgICAgdGhpcy5wcm94eS5HRVQoSU5KRUNUQUJMRVMuVEVTVENBRkVfVUksIHsgY29udGVudDogdWlTY3JpcHQsIGNvbnRlbnRUeXBlOiBDT05URU5UX1RZUEVTLmphdmFzY3JpcHQgfSk7XG4gICAgICAgIHRoaXMucHJveHkuR0VUKElOSkVDVEFCTEVTLlRFU1RDQUZFX1VJX1NQUklURSwgeyBjb250ZW50OiB1aVNwcml0ZSwgY29udGVudFR5cGU6IENPTlRFTlRfVFlQRVMucG5nIH0pO1xuICAgICAgICB0aGlzLnByb3h5LkdFVChJTkpFQ1RBQkxFUy5URVNUQ0FGRV9VSV9TUFJJVEVfU1ZHLCB7IGNvbnRlbnQ6IHVpU3ByaXRlU3ZnLCBjb250ZW50VHlwZTogQ09OVEVOVF9UWVBFUy5zdmcgfSk7XG4gICAgICAgIHRoaXMucHJveHkuR0VUKElOSkVDVEFCTEVTLlRFU1RDQUZFX0lDT04sIHsgY29udGVudDogZmF2SWNvbiwgY29udGVudFR5cGU6IENPTlRFTlRfVFlQRVMuaWNvbiB9KTtcblxuICAgICAgICB0aGlzLnByb3h5LkdFVChJTkpFQ1RBQkxFUy5URVNUQ0FGRV9VSV9TVFlMRVMsIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6ICAgICAgICAgICAgICB1aVN0eWxlLFxuICAgICAgICAgICAgY29udGVudFR5cGU6ICAgICAgICAgIENPTlRFTlRfVFlQRVMuY3NzLFxuICAgICAgICAgICAgaXNTaGFkb3dVSVN0eWxlc2hlZXQ6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3NldHVwU291cmNlTWFwc1N1cHBvcnQgKCkge1xuICAgICAgICBzb3VyY2VNYXBTdXBwb3J0Lmluc3RhbGwoe1xuICAgICAgICAgICAgaG9va1JlcXVpcmU6ICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgaGFuZGxlVW5jYXVnaHRFeGNlcHRpb25zOiBmYWxzZSxcbiAgICAgICAgICAgIGVudmlyb25tZW50OiAgICAgICAgICAgICAgJ25vZGUnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9jcmVhdGVSdW5uZXIgKGlzTGl2ZU1vZGUpIHtcbiAgICAgICAgY29uc3QgQ3RvciAgICAgID0gaXNMaXZlTW9kZSA/IExpdmVNb2RlUnVubmVyIDogUnVubmVyO1xuICAgICAgICBjb25zdCBuZXdSdW5uZXIgPSBuZXcgQ3Rvcih0aGlzLnByb3h5LCB0aGlzLmJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheSwgdGhpcy5jb25maWd1cmF0aW9uLmNsb25lKCksIHRoaXMuY29tcGlsZXJTZXJ2aWNlKTtcblxuICAgICAgICB0aGlzLnJ1bm5lcnMucHVzaChuZXdSdW5uZXIpO1xuXG4gICAgICAgIHJldHVybiBuZXdSdW5uZXI7XG4gICAgfVxuXG4gICAgLy8gQVBJXG4gICAgYXN5bmMgY3JlYXRlQnJvd3NlckNvbm5lY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBicm93c2VySW5mbyA9IGF3YWl0IGJyb3dzZXJQcm92aWRlclBvb2wuZ2V0QnJvd3NlckluZm8oJ3JlbW90ZScpO1xuXG4gICAgICAgIHJldHVybiBuZXcgQnJvd3NlckNvbm5lY3Rpb24odGhpcy5icm93c2VyQ29ubmVjdGlvbkdhdGV3YXksIGJyb3dzZXJJbmZvLCB0cnVlKTtcbiAgICB9XG5cbiAgICBjcmVhdGVSdW5uZXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlUnVubmVyKGZhbHNlKTtcbiAgICB9XG5cbiAgICBjcmVhdGVMaXZlTW9kZVJ1bm5lciAoKSB7XG4gICAgICAgIGlmICh0aGlzLnJ1bm5lcnMuc29tZShydW5uZXIgPT4gcnVubmVyIGluc3RhbmNlb2YgTGl2ZU1vZGVSdW5uZXIpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihSVU5USU1FX0VSUk9SUy5jYW5ub3RDcmVhdGVNdWx0aXBsZUxpdmVNb2RlUnVubmVycyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZVJ1bm5lcih0cnVlKTtcbiAgICB9XG5cbiAgICBhc3luYyBjbG9zZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5ydW5uZXJzLm1hcChydW5uZXIgPT4gcnVubmVyLnN0b3AoKSkpO1xuXG4gICAgICAgIGF3YWl0IGJyb3dzZXJQcm92aWRlclBvb2wuZGlzcG9zZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbXBpbGVyU2VydmljZSlcbiAgICAgICAgICAgIHRoaXMuY29tcGlsZXJTZXJ2aWNlLnN0b3AoKTtcblxuICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheS5jbG9zZSgpO1xuICAgICAgICB0aGlzLnByb3h5LmNsb3NlKCk7XG4gICAgfVxufVxuIl19