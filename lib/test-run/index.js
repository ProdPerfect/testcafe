"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const read_file_relative_1 = require("read-file-relative");
const promisify_event_1 = __importDefault(require("promisify-event"));
const mustache_1 = __importDefault(require("mustache"));
const async_event_emitter_1 = __importDefault(require("../utils/async-event-emitter"));
const debug_log_1 = __importDefault(require("./debug-log"));
const formattable_adapter_1 = __importDefault(require("../errors/test-run/formattable-adapter"));
const error_list_1 = __importDefault(require("../errors/error-list"));
const runtime_1 = require("../errors/runtime");
const test_run_1 = require("../errors/test-run/");
const phase_1 = __importDefault(require("./phase"));
const client_messages_1 = __importDefault(require("./client-messages"));
const type_1 = __importDefault(require("./commands/type"));
const delay_1 = __importDefault(require("../utils/delay"));
const marker_symbol_1 = __importDefault(require("./marker-symbol"));
const test_run_tracker_1 = __importDefault(require("../api/test-run-tracker"));
const phase_2 = __importDefault(require("../role/phase"));
const plugin_host_1 = __importDefault(require("../reporter/plugin-host"));
const browser_console_messages_1 = __importDefault(require("./browser-console-messages"));
const warning_log_1 = __importDefault(require("../notifications/warning-log"));
const warning_message_1 = __importDefault(require("../notifications/warning-message"));
const testcafe_hammerhead_1 = require("testcafe-hammerhead");
const INJECTABLES = __importStar(require("../assets/injectables"));
const utils_1 = require("../custom-client-scripts/utils");
const get_url_1 = __importDefault(require("../custom-client-scripts/get-url"));
const string_1 = require("../utils/string");
const utils_2 = require("./commands/utils");
const actions_1 = require("./commands/actions");
const types_1 = require("../errors/types");
const process_test_fn_error_1 = __importDefault(require("../errors/process-test-fn-error"));
const lazyRequire = require('import-lazy')(require);
const SessionController = lazyRequire('./session-controller');
const ObservedCallsitesStorage = lazyRequire('./observed-callsites-storage');
const ClientFunctionBuilder = lazyRequire('../client-functions/client-function-builder');
const BrowserManipulationQueue = lazyRequire('./browser-manipulation-queue');
const TestRunBookmark = lazyRequire('./bookmark');
const AssertionExecutor = lazyRequire('../assertions/executor');
const actionCommands = lazyRequire('./commands/actions');
const browserManipulationCommands = lazyRequire('./commands/browser-manipulation');
const serviceCommands = lazyRequire('./commands/service');
const observationCommands = lazyRequire('./commands/observation');
const { executeJsExpression, executeAsyncJsExpression } = lazyRequire('./execute-js-expression');
const TEST_RUN_TEMPLATE = read_file_relative_1.readSync('../client/test-run/index.js.mustache');
const IFRAME_TEST_RUN_TEMPLATE = read_file_relative_1.readSync('../client/test-run/iframe.js.mustache');
const TEST_DONE_CONFIRMATION_RESPONSE = 'test-done-confirmation';
const MAX_RESPONSE_DELAY = 3000;
const CHILD_WINDOW_READY_TIMEOUT = 30 * 1000;
const ALL_DRIVER_TASKS_ADDED_TO_QUEUE_EVENT = 'all-driver-tasks-added-to-queue';
class TestRun extends async_event_emitter_1.default {
    constructor(test, browserConnection, screenshotCapturer, globalWarningLog, opts) {
        super();
        this[marker_symbol_1.default] = true;
        this.warningLog = new warning_log_1.default(globalWarningLog);
        this.opts = opts;
        this.test = test;
        this.browserConnection = browserConnection;
        this.phase = phase_1.default.initial;
        this.driverTaskQueue = [];
        this.testDoneCommandQueued = false;
        this.activeDialogHandler = null;
        this.activeIframeSelector = null;
        this.speed = this.opts.speed;
        this.pageLoadTimeout = this.opts.pageLoadTimeout;
        this.disablePageReloads = test.disablePageReloads || opts.disablePageReloads && test.disablePageReloads !== false;
        this.disablePageCaching = test.disablePageCaching || opts.disablePageCaching;
        this.disableMultipleWindows = opts.disableMultipleWindows;
        this.requestTimeout = this._getRequestTimeout(test, opts);
        this.session = SessionController.getSession(this);
        this.consoleMessages = new browser_console_messages_1.default();
        this.pendingRequest = null;
        this.pendingPageError = null;
        this.controller = null;
        this.ctx = Object.create(null);
        this.fixtureCtx = null;
        this.currentRoleId = null;
        this.usedRoleStates = Object.create(null);
        this.errs = [];
        this.lastDriverStatusId = null;
        this.lastDriverStatusResponse = null;
        this.fileDownloadingHandled = false;
        this.resolveWaitForFileDownloadingPromise = null;
        this.addingDriverTasksCount = 0;
        this.debugging = this.opts.debugMode;
        this.debugOnFail = this.opts.debugOnFail;
        this.disableDebugBreakpoints = false;
        this.debugReporterPluginHost = new plugin_host_1.default({ noColors: false });
        this.browserManipulationQueue = new BrowserManipulationQueue(browserConnection, screenshotCapturer, this.warningLog);
        this.debugLog = new debug_log_1.default(this.browserConnection.userAgent);
        this.quarantine = null;
        this.debugLogger = this.opts.debugLogger;
        this.observedCallsites = new ObservedCallsitesStorage();
        this._addInjectables();
        this._initRequestHooks();
    }
    _getRequestTimeout(test, opts) {
        var _a, _b;
        return {
            page: opts.pageRequestTimeout || ((_a = test.timeouts) === null || _a === void 0 ? void 0 : _a.pageRequestTimeout),
            ajax: opts.ajaxRequestTimeout || ((_b = test.timeouts) === null || _b === void 0 ? void 0 : _b.ajaxRequestTimeout)
        };
    }
    _addClientScriptContentWarningsIfNecessary() {
        const { empty, duplicatedContent } = utils_1.findProblematicScripts(this.test.clientScripts);
        if (empty.length)
            this.warningLog.addWarning(warning_message_1.default.clientScriptsWithEmptyContent);
        if (duplicatedContent.length) {
            const suffix = string_1.getPluralSuffix(duplicatedContent);
            const duplicatedContentClientScriptsStr = string_1.getConcatenatedValuesString(duplicatedContent, '\n');
            this.warningLog.addWarning(warning_message_1.default.clientScriptsWithDuplicatedContent, suffix, duplicatedContentClientScriptsStr);
        }
    }
    _addInjectables() {
        this._addClientScriptContentWarningsIfNecessary();
        this.injectable.scripts.push(...INJECTABLES.SCRIPTS);
        this.injectable.userScripts.push(...this.test.clientScripts.map(script => {
            return {
                url: get_url_1.default(script),
                page: script.page
            };
        }));
        this.injectable.styles.push(INJECTABLES.TESTCAFE_UI_STYLES);
    }
    get id() {
        return this.session.id;
    }
    get injectable() {
        return this.session.injectable;
    }
    addQuarantineInfo(quarantine) {
        this.quarantine = quarantine;
    }
    addRequestHook(hook) {
        if (this.requestHooks.indexOf(hook) !== -1)
            return;
        this.requestHooks.push(hook);
        this._initRequestHook(hook);
    }
    removeRequestHook(hook) {
        if (this.requestHooks.indexOf(hook) === -1)
            return;
        lodash_1.pull(this.requestHooks, hook);
        this._disposeRequestHook(hook);
    }
    _initRequestHook(hook) {
        hook.warningLog = this.warningLog;
        hook._instantiateRequestFilterRules();
        hook._instantiatedRequestFilterRules.forEach(rule => {
            this.session.addRequestEventListeners(rule, {
                onRequest: hook.onRequest.bind(hook),
                onConfigureResponse: hook._onConfigureResponse.bind(hook),
                onResponse: hook.onResponse.bind(hook)
            }, err => this._onRequestHookMethodError(err, hook));
        });
    }
    _onRequestHookMethodError(event, hook) {
        let err = event.error;
        const isRequestHookNotImplementedMethodError = err instanceof test_run_1.RequestHookNotImplementedMethodError;
        if (!isRequestHookNotImplementedMethodError) {
            const hookClassName = hook.constructor.name;
            err = new test_run_1.RequestHookUnhandledError(err, hookClassName, event.methodName);
        }
        this.addError(err);
    }
    _disposeRequestHook(hook) {
        hook.warningLog = null;
        hook._instantiatedRequestFilterRules.forEach(rule => {
            this.session.removeRequestEventListeners(rule);
        });
    }
    _initRequestHooks() {
        this.requestHooks = Array.from(this.test.requestHooks);
        this.requestHooks.forEach(hook => this._initRequestHook(hook));
    }
    // Hammerhead payload
    async getPayloadScript() {
        this.fileDownloadingHandled = false;
        this.resolveWaitForFileDownloadingPromise = null;
        return mustache_1.default.render(TEST_RUN_TEMPLATE, {
            testRunId: JSON.stringify(this.session.id),
            browserId: JSON.stringify(this.browserConnection.id),
            browserHeartbeatRelativeUrl: JSON.stringify(this.browserConnection.heartbeatRelativeUrl),
            browserStatusRelativeUrl: JSON.stringify(this.browserConnection.statusRelativeUrl),
            browserStatusDoneRelativeUrl: JSON.stringify(this.browserConnection.statusDoneRelativeUrl),
            browserActiveWindowIdUrl: JSON.stringify(this.browserConnection.activeWindowIdUrl),
            userAgent: JSON.stringify(this.browserConnection.userAgent),
            testName: JSON.stringify(this.test.name),
            fixtureName: JSON.stringify(this.test.fixture.name),
            selectorTimeout: this.opts.selectorTimeout,
            pageLoadTimeout: this.pageLoadTimeout,
            childWindowReadyTimeout: CHILD_WINDOW_READY_TIMEOUT,
            skipJsErrors: this.opts.skipJsErrors,
            retryTestPages: this.opts.retryTestPages,
            speed: this.speed,
            dialogHandler: JSON.stringify(this.activeDialogHandler),
            canUseDefaultWindowActions: JSON.stringify(await this.browserConnection.canUseDefaultWindowActions())
        });
    }
    async getIframePayloadScript() {
        return mustache_1.default.render(IFRAME_TEST_RUN_TEMPLATE, {
            testRunId: JSON.stringify(this.session.id),
            selectorTimeout: this.opts.selectorTimeout,
            pageLoadTimeout: this.pageLoadTimeout,
            retryTestPages: !!this.opts.retryTestPages,
            speed: this.speed,
            dialogHandler: JSON.stringify(this.activeDialogHandler)
        });
    }
    // Hammerhead handlers
    getAuthCredentials() {
        return this.test.authCredentials;
    }
    handleFileDownload() {
        if (this.resolveWaitForFileDownloadingPromise) {
            this.resolveWaitForFileDownloadingPromise(true);
            this.resolveWaitForFileDownloadingPromise = null;
        }
        else
            this.fileDownloadingHandled = true;
    }
    handlePageError(ctx, err) {
        this.pendingPageError = new test_run_1.PageLoadError(err, ctx.reqOpts.url);
        ctx.redirect(ctx.toProxyUrl(testcafe_hammerhead_1.SPECIAL_ERROR_PAGE));
    }
    // Test function execution
    async _executeTestFn(phase, fn) {
        this.phase = phase;
        try {
            await fn(this);
        }
        catch (err) {
            await this._makeScreenshotOnFail();
            this.addError(err);
            return false;
        }
        finally {
            this.errScreenshotPath = null;
        }
        return !this._addPendingPageErrorIfAny();
    }
    async _runBeforeHook() {
        if (this.test.beforeFn)
            return await this._executeTestFn(phase_1.default.inTestBeforeHook, this.test.beforeFn);
        if (this.test.fixture.beforeEachFn)
            return await this._executeTestFn(phase_1.default.inFixtureBeforeEachHook, this.test.fixture.beforeEachFn);
        return true;
    }
    async _runAfterHook() {
        if (this.test.afterFn)
            return await this._executeTestFn(phase_1.default.inTestAfterHook, this.test.afterFn);
        if (this.test.fixture.afterEachFn)
            return await this._executeTestFn(phase_1.default.inFixtureAfterEachHook, this.test.fixture.afterEachFn);
        return true;
    }
    async start() {
        test_run_tracker_1.default.activeTestRuns[this.session.id] = this;
        await this.emit('start');
        const onDisconnected = err => this._disconnect(err);
        this.browserConnection.once('disconnected', onDisconnected);
        await this.once('connected');
        await this.emit('ready');
        if (await this._runBeforeHook()) {
            await this._executeTestFn(phase_1.default.inTest, this.test.fn);
            await this._runAfterHook();
        }
        if (this.disconnected)
            return;
        this.browserConnection.removeListener('disconnected', onDisconnected);
        if (this.errs.length && this.debugOnFail)
            await this._enqueueSetBreakpointCommand(null, this.debugReporterPluginHost.formatError(this.errs[0]));
        await this.emit('before-done');
        await this.executeCommand(new serviceCommands.TestDoneCommand());
        this._addPendingPageErrorIfAny();
        this.session.clearRequestEventListeners();
        this.normalizeRequestHookErrors();
        delete test_run_tracker_1.default.activeTestRuns[this.session.id];
        await this.emit('done');
    }
    // Errors
    _addPendingPageErrorIfAny() {
        if (this.pendingPageError) {
            this.addError(this.pendingPageError);
            this.pendingPageError = null;
            return true;
        }
        return false;
    }
    _createErrorAdapter(err) {
        return new formattable_adapter_1.default(err, {
            userAgent: this.browserConnection.userAgent,
            screenshotPath: this.errScreenshotPath || '',
            testRunId: this.id,
            testRunPhase: this.phase
        });
    }
    addError(err) {
        const errList = err instanceof error_list_1.default ? err.items : [err];
        errList.forEach(item => {
            const adapter = this._createErrorAdapter(item);
            this.errs.push(adapter);
        });
    }
    normalizeRequestHookErrors() {
        const requestHookErrors = lodash_1.remove(this.errs, e => e.code === types_1.TEST_RUN_ERRORS.requestHookNotImplementedError ||
            e.code === types_1.TEST_RUN_ERRORS.requestHookUnhandledError);
        if (!requestHookErrors.length)
            return;
        const uniqRequestHookErrors = lodash_1.chain(requestHookErrors)
            .uniqBy(e => e.hookClassName + e.methodName)
            .sortBy(['hookClassName', 'methodName'])
            .value();
        this.errs = this.errs.concat(uniqRequestHookErrors);
    }
    // Task queue
    _enqueueCommand(command, callsite) {
        if (this.pendingRequest)
            this._resolvePendingRequest(command);
        return new Promise(async (resolve, reject) => {
            this.addingDriverTasksCount--;
            this.driverTaskQueue.push({ command, resolve, reject, callsite });
            if (!this.addingDriverTasksCount)
                await this.emit(ALL_DRIVER_TASKS_ADDED_TO_QUEUE_EVENT, this.driverTaskQueue.length);
        });
    }
    get driverTaskQueueLength() {
        return this.addingDriverTasksCount ? promisify_event_1.default(this, ALL_DRIVER_TASKS_ADDED_TO_QUEUE_EVENT) : Promise.resolve(this.driverTaskQueue.length);
    }
    async _enqueueBrowserConsoleMessagesCommand(command, callsite) {
        await this._enqueueCommand(command, callsite);
        const consoleMessageCopy = this.consoleMessages.getCopy();
        return consoleMessageCopy[this.browserConnection.activeWindowId];
    }
    async _enqueueSetBreakpointCommand(callsite, error) {
        if (this.browserConnection.isHeadlessBrowser()) {
            this.warningLog.addWarning(warning_message_1.default.debugInHeadlessError);
            return;
        }
        if (this.debugLogger)
            this.debugLogger.showBreakpoint(this.session.id, this.browserConnection.userAgent, callsite, error);
        this.debugging = await this.executeCommand(new serviceCommands.SetBreakpointCommand(!!error), callsite);
    }
    _removeAllNonServiceTasks() {
        this.driverTaskQueue = this.driverTaskQueue.filter(driverTask => utils_2.isServiceCommand(driverTask.command));
        this.browserManipulationQueue.removeAllNonServiceManipulations();
    }
    // Current driver task
    get currentDriverTask() {
        return this.driverTaskQueue[0];
    }
    _resolveCurrentDriverTask(result) {
        this.currentDriverTask.resolve(result);
        this.driverTaskQueue.shift();
        if (this.testDoneCommandQueued)
            this._removeAllNonServiceTasks();
    }
    _rejectCurrentDriverTask(err) {
        err.callsite = err.callsite || this.currentDriverTask.callsite;
        this.currentDriverTask.reject(err);
        this._removeAllNonServiceTasks();
    }
    // Pending request
    _clearPendingRequest() {
        if (this.pendingRequest) {
            clearTimeout(this.pendingRequest.responseTimeout);
            this.pendingRequest = null;
        }
    }
    _resolvePendingRequest(command) {
        this.lastDriverStatusResponse = command;
        this.pendingRequest.resolve(command);
        this._clearPendingRequest();
    }
    // Handle driver request
    _shouldResolveCurrentDriverTask(driverStatus) {
        const currentCommand = this.currentDriverTask.command;
        const isExecutingObservationCommand = currentCommand instanceof observationCommands.ExecuteSelectorCommand ||
            currentCommand instanceof observationCommands.ExecuteClientFunctionCommand;
        const isDebugActive = currentCommand instanceof serviceCommands.SetBreakpointCommand;
        const shouldExecuteCurrentCommand = driverStatus.isFirstRequestAfterWindowSwitching && (isExecutingObservationCommand || isDebugActive);
        return !shouldExecuteCurrentCommand;
    }
    _fulfillCurrentDriverTask(driverStatus) {
        if (!this.currentDriverTask)
            return;
        if (driverStatus.executionError)
            this._rejectCurrentDriverTask(driverStatus.executionError);
        else if (this._shouldResolveCurrentDriverTask(driverStatus))
            this._resolveCurrentDriverTask(driverStatus.result);
    }
    _handlePageErrorStatus(pageError) {
        if (this.currentDriverTask && utils_2.isCommandRejectableByPageError(this.currentDriverTask.command)) {
            this._rejectCurrentDriverTask(pageError);
            this.pendingPageError = null;
            return true;
        }
        this.pendingPageError = this.pendingPageError || pageError;
        return false;
    }
    _handleDriverRequest(driverStatus) {
        const isTestDone = this.currentDriverTask && this.currentDriverTask.command.type ===
            type_1.default.testDone;
        const pageError = this.pendingPageError || driverStatus.pageError;
        const currentTaskRejectedByError = pageError && this._handlePageErrorStatus(pageError);
        this.consoleMessages.concat(driverStatus.consoleMessages);
        if (!currentTaskRejectedByError && driverStatus.isCommandResult) {
            if (isTestDone) {
                this._resolveCurrentDriverTask();
                return TEST_DONE_CONFIRMATION_RESPONSE;
            }
            this._fulfillCurrentDriverTask(driverStatus);
            if (driverStatus.isPendingWindowSwitching)
                return null;
        }
        return this._getCurrentDriverTaskCommand();
    }
    _getCurrentDriverTaskCommand() {
        if (!this.currentDriverTask)
            return null;
        const command = this.currentDriverTask.command;
        if (command.type === type_1.default.navigateTo && command.stateSnapshot)
            this.session.useStateSnapshot(JSON.parse(command.stateSnapshot));
        return command;
    }
    // Execute command
    _executeJsExpression(command) {
        const resultVariableName = command.resultVariableName;
        let expression = command.expression;
        if (resultVariableName)
            expression = `${resultVariableName} = ${expression}, ${resultVariableName}`;
        return executeJsExpression(expression, this, { skipVisibilityCheck: false });
    }
    async _executeAssertion(command, callsite) {
        const assertionTimeout = command.options.timeout ===
            void 0 ? this.opts.assertionTimeout : command.options.timeout;
        const executor = new AssertionExecutor(command, assertionTimeout, callsite);
        executor.once('start-assertion-retries', timeout => this.executeCommand(new serviceCommands.ShowAssertionRetriesStatusCommand(timeout)));
        executor.once('end-assertion-retries', success => this.executeCommand(new serviceCommands.HideAssertionRetriesStatusCommand(success)));
        const executeFn = this.decoratePreventEmitActionEvents(() => executor.run(), { prevent: true });
        return await executeFn();
    }
    _adjustConfigurationWithCommand(command) {
        if (command.type === type_1.default.testDone) {
            this.testDoneCommandQueued = true;
            if (this.debugLogger)
                this.debugLogger.hideBreakpoint(this.session.id);
        }
        else if (command.type === type_1.default.setNativeDialogHandler)
            this.activeDialogHandler = command.dialogHandler;
        else if (command.type === type_1.default.switchToIframe)
            this.activeIframeSelector = command.selector;
        else if (command.type === type_1.default.switchToMainWindow)
            this.activeIframeSelector = null;
        else if (command.type === type_1.default.setTestSpeed)
            this.speed = command.speed;
        else if (command.type === type_1.default.setPageLoadTimeout)
            this.pageLoadTimeout = command.duration;
        else if (command.type === type_1.default.debug)
            this.debugging = true;
    }
    async _adjustScreenshotCommand(command) {
        const browserId = this.browserConnection.id;
        const { hasChromelessScreenshots } = await this.browserConnection.provider.hasCustomActionForBrowser(browserId);
        if (!hasChromelessScreenshots)
            command.generateScreenshotMark();
    }
    async _setBreakpointIfNecessary(command, callsite) {
        if (!this.disableDebugBreakpoints && this.debugging && utils_2.canSetDebuggerBreakpointBeforeCommand(command))
            await this._enqueueSetBreakpointCommand(callsite);
    }
    async executeAction(apiActionName, command, callsite) {
        const actionArgs = { apiActionName, command };
        let errorAdapter = null;
        let error = null;
        let result = null;
        await this.emitActionEvent('action-start', actionArgs);
        const start = new Date();
        try {
            result = await this.executeCommand(command, callsite);
        }
        catch (err) {
            error = err;
        }
        const duration = new Date() - start;
        if (error) {
            // NOTE: check if error is TestCafeErrorList is specific for the `useRole` action
            // if error is TestCafeErrorList we do not need to create an adapter,
            // since error is already was processed in role initializer
            if (!(error instanceof error_list_1.default)) {
                await this._makeScreenshotOnFail();
                errorAdapter = this._createErrorAdapter(process_test_fn_error_1.default(error));
            }
        }
        Object.assign(actionArgs, {
            result,
            duration,
            err: errorAdapter
        });
        await this.emitActionEvent('action-done', actionArgs);
        if (error)
            throw error;
        return result;
    }
    async executeCommand(command, callsite) {
        this.debugLog.command(command);
        if (this.pendingPageError && utils_2.isCommandRejectableByPageError(command))
            return this._rejectCommandWithPageError(callsite);
        if (utils_2.isExecutableOnClientCommand(command))
            this.addingDriverTasksCount++;
        this._adjustConfigurationWithCommand(command);
        await this._setBreakpointIfNecessary(command, callsite);
        if (utils_2.isScreenshotCommand(command)) {
            if (this.opts.disableScreenshots) {
                this.warningLog.addWarning(warning_message_1.default.screenshotsDisabled);
                return null;
            }
            await this._adjustScreenshotCommand(command);
        }
        if (utils_2.isBrowserManipulationCommand(command)) {
            this.browserManipulationQueue.push(command);
            if (utils_2.isResizeWindowCommand(command) && this.opts.videoPath)
                this.warningLog.addWarning(warning_message_1.default.videoBrowserResizing, this.test.name);
        }
        if (command.type === type_1.default.wait)
            return delay_1.default(command.timeout);
        if (command.type === type_1.default.setPageLoadTimeout)
            return null;
        if (command.type === type_1.default.debug)
            return await this._enqueueSetBreakpointCommand(callsite);
        if (command.type === type_1.default.useRole) {
            let fn = () => this._useRole(command.role, callsite);
            fn = this.decoratePreventEmitActionEvents(fn, { prevent: true });
            fn = this.decorateDisableDebugBreakpoints(fn, { disable: true });
            return await fn();
        }
        if (command.type === type_1.default.assertion)
            return this._executeAssertion(command, callsite);
        if (command.type === type_1.default.executeExpression)
            return await this._executeJsExpression(command, callsite);
        if (command.type === type_1.default.executeAsyncExpression)
            return await executeAsyncJsExpression(command.expression, this, callsite);
        if (command.type === type_1.default.getBrowserConsoleMessages)
            return await this._enqueueBrowserConsoleMessagesCommand(command, callsite);
        if (command.type === type_1.default.switchToPreviousWindow)
            command.windowId = this.browserConnection.previousActiveWindowId;
        if (command.type === type_1.default.switchToWindowByPredicate)
            return this._switchToWindowByPredicate(command);
        return this._enqueueCommand(command, callsite);
    }
    _rejectCommandWithPageError(callsite) {
        const err = this.pendingPageError;
        err.callsite = callsite;
        this.pendingPageError = null;
        return Promise.reject(err);
    }
    async _makeScreenshotOnFail() {
        const { screenshots } = this.opts;
        if (!this.errScreenshotPath && screenshots && screenshots.takeOnFails)
            this.errScreenshotPath = await this.executeCommand(new browserManipulationCommands.TakeScreenshotOnFailCommand());
    }
    _decorateWithFlag(fn, flagName, value) {
        return async () => {
            this[flagName] = value;
            try {
                return await fn();
            }
            catch (err) {
                throw err;
            }
            finally {
                this[flagName] = !value;
            }
        };
    }
    decoratePreventEmitActionEvents(fn, { prevent }) {
        return this._decorateWithFlag(fn, 'preventEmitActionEvents', prevent);
    }
    decorateDisableDebugBreakpoints(fn, { disable }) {
        return this._decorateWithFlag(fn, 'disableDebugBreakpoints', disable);
    }
    // Role management
    async getStateSnapshot() {
        const state = this.session.getStateSnapshot();
        state.storages = await this.executeCommand(new serviceCommands.BackupStoragesCommand());
        return state;
    }
    async switchToCleanRun(url) {
        this.ctx = Object.create(null);
        this.fixtureCtx = Object.create(null);
        this.consoleMessages = new browser_console_messages_1.default();
        this.session.useStateSnapshot(testcafe_hammerhead_1.StateSnapshot.empty());
        if (this.speed !== this.opts.speed) {
            const setSpeedCommand = new actionCommands.SetTestSpeedCommand({ speed: this.opts.speed });
            await this.executeCommand(setSpeedCommand);
        }
        if (this.pageLoadTimeout !== this.opts.pageLoadTimeout) {
            const setPageLoadTimeoutCommand = new actionCommands.SetPageLoadTimeoutCommand({ duration: this.opts.pageLoadTimeout });
            await this.executeCommand(setPageLoadTimeoutCommand);
        }
        await this.navigateToUrl(url, true);
        if (this.activeDialogHandler) {
            const removeDialogHandlerCommand = new actionCommands.SetNativeDialogHandlerCommand({ dialogHandler: { fn: null } });
            await this.executeCommand(removeDialogHandlerCommand);
        }
    }
    async navigateToUrl(url, forceReload, stateSnapshot) {
        const navigateCommand = new actionCommands.NavigateToCommand({ url, forceReload, stateSnapshot });
        await this.executeCommand(navigateCommand);
    }
    async _getStateSnapshotFromRole(role) {
        const prevPhase = this.phase;
        this.phase = phase_1.default.inRoleInitializer;
        if (role.phase === phase_2.default.uninitialized)
            await role.initialize(this);
        else if (role.phase === phase_2.default.pendingInitialization)
            await promisify_event_1.default(role, 'initialized');
        if (role.initErr)
            throw role.initErr;
        this.phase = prevPhase;
        return role.stateSnapshot;
    }
    async _useRole(role, callsite) {
        if (this.phase === phase_1.default.inRoleInitializer)
            throw new test_run_1.RoleSwitchInRoleInitializerError(callsite);
        const bookmark = new TestRunBookmark(this, role);
        await bookmark.init();
        if (this.currentRoleId)
            this.usedRoleStates[this.currentRoleId] = await this.getStateSnapshot();
        const stateSnapshot = this.usedRoleStates[role.id] || await this._getStateSnapshotFromRole(role);
        this.session.useStateSnapshot(stateSnapshot);
        this.currentRoleId = role.id;
        await bookmark.restore(callsite, stateSnapshot);
    }
    async getCurrentUrl() {
        const builder = new ClientFunctionBuilder(() => {
            /* eslint-disable no-undef */
            return window.location.href;
            /* eslint-enable no-undef */
        }, { boundTestRun: this });
        const getLocation = builder.getFunction();
        return await getLocation();
    }
    async _switchToWindowByPredicate(command) {
        const currentWindows = await this.executeCommand(new actions_1.GetCurrentWindowsCommand({}, this));
        const windows = currentWindows.filter(wnd => {
            try {
                const url = new URL(wnd.url);
                return command.findWindow({ url, title: wnd.title });
            }
            catch (e) {
                throw new test_run_1.SwitchToWindowPredicateError(e.message);
            }
        });
        if (!windows.length)
            throw new test_run_1.WindowNotFoundError();
        if (windows.length > 1)
            this.warningLog.addWarning(warning_message_1.default.multipleWindowsFoundByPredicate);
        await this.executeCommand(new actions_1.SwitchToWindowCommand({ windowId: windows[0].id }), this);
    }
    _disconnect(err) {
        this.disconnected = true;
        if (this.currentDriverTask)
            this._rejectCurrentDriverTask(err);
        this.emit('disconnected', err);
        delete test_run_tracker_1.default.activeTestRuns[this.session.id];
    }
    async emitActionEvent(eventName, args) {
        if (!this.preventEmitActionEvents)
            await this.emit(eventName, args);
    }
    static isMultipleWindowsAllowed(testRun) {
        const { disableMultipleWindows, test, browserConnection } = testRun;
        return !disableMultipleWindows && !test.isLegacy && !!browserConnection.activeWindowId;
    }
}
exports.default = TestRun;
// Service message handlers
const ServiceMessages = TestRun.prototype;
// NOTE: this function is time-critical and must return ASAP to avoid client disconnection
ServiceMessages[client_messages_1.default.ready] = function (msg) {
    this.debugLog.driverMessage(msg);
    if (this.disconnected)
        return Promise.reject(new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.testRunRequestInDisconnectedBrowser, this.browserConnection.browserInfo.alias));
    this.emit('connected');
    this._clearPendingRequest();
    // NOTE: the driver sends the status for the second time if it didn't get a response at the
    // first try. This is possible when the page was unloaded after the driver sent the status.
    if (msg.status.id === this.lastDriverStatusId)
        return this.lastDriverStatusResponse;
    this.lastDriverStatusId = msg.status.id;
    this.lastDriverStatusResponse = this._handleDriverRequest(msg.status);
    if (this.lastDriverStatusResponse || msg.status.isPendingWindowSwitching)
        return this.lastDriverStatusResponse;
    // NOTE: we send an empty response after the MAX_RESPONSE_DELAY timeout is exceeded to keep connection
    // with the client and prevent the response timeout exception on the client side
    const responseTimeout = setTimeout(() => this._resolvePendingRequest(null), MAX_RESPONSE_DELAY);
    return new Promise((resolve, reject) => {
        this.pendingRequest = { resolve, reject, responseTimeout };
    });
};
ServiceMessages[client_messages_1.default.readyForBrowserManipulation] = async function (msg) {
    this.debugLog.driverMessage(msg);
    let result = null;
    let error = null;
    try {
        result = await this.browserManipulationQueue.executePendingManipulation(msg);
    }
    catch (err) {
        error = err;
    }
    return { result, error };
};
ServiceMessages[client_messages_1.default.waitForFileDownload] = function (msg) {
    this.debugLog.driverMessage(msg);
    return new Promise(resolve => {
        if (this.fileDownloadingHandled) {
            this.fileDownloadingHandled = false;
            resolve(true);
        }
        else
            this.resolveWaitForFileDownloadingPromise = resolve;
    });
};
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVzdC1ydW4vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBSWdCO0FBRWhCLDJEQUFzRDtBQUN0RCxzRUFBNkM7QUFDN0Msd0RBQWdDO0FBQ2hDLHVGQUE2RDtBQUM3RCw0REFBMEM7QUFDMUMsaUdBQW9GO0FBQ3BGLHNFQUFxRDtBQUNyRCwrQ0FBaUQ7QUFDakQsa0RBTzZCO0FBRTdCLG9EQUE0QjtBQUM1Qix3RUFBZ0Q7QUFDaEQsMkRBQTJDO0FBQzNDLDJEQUFtQztBQUNuQyxvRUFBNEM7QUFDNUMsK0VBQXFEO0FBQ3JELDBEQUF1QztBQUN2QywwRUFBeUQ7QUFDekQsMEZBQWdFO0FBQ2hFLCtFQUFzRDtBQUN0RCx1RkFBK0Q7QUFDL0QsNkRBQXdFO0FBQ3hFLG1FQUFxRDtBQUNyRCwwREFBd0U7QUFDeEUsK0VBQXdFO0FBQ3hFLDRDQUErRTtBQUUvRSw0Q0FRMEI7QUFFMUIsZ0RBQXFGO0FBRXJGLDJDQUFrRTtBQUNsRSw0RkFBaUU7QUFFakUsTUFBTSxXQUFXLEdBQW1CLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwRSxNQUFNLGlCQUFpQixHQUFhLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3hFLE1BQU0sd0JBQXdCLEdBQU0sV0FBVyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDaEYsTUFBTSxxQkFBcUIsR0FBUyxXQUFXLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUMvRixNQUFNLHdCQUF3QixHQUFNLFdBQVcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2hGLE1BQU0sZUFBZSxHQUFlLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM5RCxNQUFNLGlCQUFpQixHQUFhLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQzFFLE1BQU0sY0FBYyxH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R0FBRyxPQUFPLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIHB1bGwsXG4gICAgcmVtb3ZlLFxuICAgIGNoYWluXG59IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IHJlYWRTeW5jIGFzIHJlYWQgfSBmcm9tICdyZWFkLWZpbGUtcmVsYXRpdmUnO1xuaW1wb3J0IHByb21pc2lmeUV2ZW50IGZyb20gJ3Byb21pc2lmeS1ldmVudCc7XG5pbXBvcnQgTXVzdGFjaGUgZnJvbSAnbXVzdGFjaGUnO1xuaW1wb3J0IEFzeW5jRXZlbnRFbWl0dGVyIGZyb20gJy4uL3V0aWxzL2FzeW5jLWV2ZW50LWVtaXR0ZXInO1xuaW1wb3J0IFRlc3RSdW5EZWJ1Z0xvZyBmcm9tICcuL2RlYnVnLWxvZyc7XG5pbXBvcnQgVGVzdFJ1bkVycm9yRm9ybWF0dGFibGVBZGFwdGVyIGZyb20gJy4uL2Vycm9ycy90ZXN0LXJ1bi9mb3JtYXR0YWJsZS1hZGFwdGVyJztcbmltcG9ydCBUZXN0Q2FmZUVycm9yTGlzdCBmcm9tICcuLi9lcnJvcnMvZXJyb3ItbGlzdCc7XG5pbXBvcnQgeyBHZW5lcmFsRXJyb3IgfSBmcm9tICcuLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQge1xuICAgIFJlcXVlc3RIb29rVW5oYW5kbGVkRXJyb3IsXG4gICAgUGFnZUxvYWRFcnJvcixcbiAgICBSZXF1ZXN0SG9va05vdEltcGxlbWVudGVkTWV0aG9kRXJyb3IsXG4gICAgUm9sZVN3aXRjaEluUm9sZUluaXRpYWxpemVyRXJyb3IsXG4gICAgU3dpdGNoVG9XaW5kb3dQcmVkaWNhdGVFcnJvcixcbiAgICBXaW5kb3dOb3RGb3VuZEVycm9yXG59IGZyb20gJy4uL2Vycm9ycy90ZXN0LXJ1bi8nO1xuXG5pbXBvcnQgUEhBU0UgZnJvbSAnLi9waGFzZSc7XG5pbXBvcnQgQ0xJRU5UX01FU1NBR0VTIGZyb20gJy4vY2xpZW50LW1lc3NhZ2VzJztcbmltcG9ydCBDT01NQU5EX1RZUEUgZnJvbSAnLi9jb21tYW5kcy90eXBlJztcbmltcG9ydCBkZWxheSBmcm9tICcuLi91dGlscy9kZWxheSc7XG5pbXBvcnQgdGVzdFJ1bk1hcmtlciBmcm9tICcuL21hcmtlci1zeW1ib2wnO1xuaW1wb3J0IHRlc3RSdW5UcmFja2VyIGZyb20gJy4uL2FwaS90ZXN0LXJ1bi10cmFja2VyJztcbmltcG9ydCBST0xFX1BIQVNFIGZyb20gJy4uL3JvbGUvcGhhc2UnO1xuaW1wb3J0IFJlcG9ydGVyUGx1Z2luSG9zdCBmcm9tICcuLi9yZXBvcnRlci9wbHVnaW4taG9zdCc7XG5pbXBvcnQgQnJvd3NlckNvbnNvbGVNZXNzYWdlcyBmcm9tICcuL2Jyb3dzZXItY29uc29sZS1tZXNzYWdlcyc7XG5pbXBvcnQgV2FybmluZ0xvZyBmcm9tICcuLi9ub3RpZmljYXRpb25zL3dhcm5pbmctbG9nJztcbmltcG9ydCBXQVJOSU5HX01FU1NBR0UgZnJvbSAnLi4vbm90aWZpY2F0aW9ucy93YXJuaW5nLW1lc3NhZ2UnO1xuaW1wb3J0IHsgU3RhdGVTbmFwc2hvdCwgU1BFQ0lBTF9FUlJPUl9QQUdFIH0gZnJvbSAndGVzdGNhZmUtaGFtbWVyaGVhZCc7XG5pbXBvcnQgKiBhcyBJTkpFQ1RBQkxFUyBmcm9tICcuLi9hc3NldHMvaW5qZWN0YWJsZXMnO1xuaW1wb3J0IHsgZmluZFByb2JsZW1hdGljU2NyaXB0cyB9IGZyb20gJy4uL2N1c3RvbS1jbGllbnQtc2NyaXB0cy91dGlscyc7XG5pbXBvcnQgZ2V0Q3VzdG9tQ2xpZW50U2NyaXB0VXJsIGZyb20gJy4uL2N1c3RvbS1jbGllbnQtc2NyaXB0cy9nZXQtdXJsJztcbmltcG9ydCB7IGdldFBsdXJhbFN1ZmZpeCwgZ2V0Q29uY2F0ZW5hdGVkVmFsdWVzU3RyaW5nIH0gZnJvbSAnLi4vdXRpbHMvc3RyaW5nJztcblxuaW1wb3J0IHtcbiAgICBpc0NvbW1hbmRSZWplY3RhYmxlQnlQYWdlRXJyb3IsXG4gICAgaXNCcm93c2VyTWFuaXB1bGF0aW9uQ29tbWFuZCxcbiAgICBpc1NjcmVlbnNob3RDb21tYW5kLFxuICAgIGlzU2VydmljZUNvbW1hbmQsXG4gICAgY2FuU2V0RGVidWdnZXJCcmVha3BvaW50QmVmb3JlQ29tbWFuZCxcbiAgICBpc0V4ZWN1dGFibGVPbkNsaWVudENvbW1hbmQsXG4gICAgaXNSZXNpemVXaW5kb3dDb21tYW5kXG59IGZyb20gJy4vY29tbWFuZHMvdXRpbHMnO1xuXG5pbXBvcnQgeyBHZXRDdXJyZW50V2luZG93c0NvbW1hbmQsIFN3aXRjaFRvV2luZG93Q29tbWFuZCB9IGZyb20gJy4vY29tbWFuZHMvYWN0aW9ucyc7XG5cbmltcG9ydCB7IFJVTlRJTUVfRVJST1JTLCBURVNUX1JVTl9FUlJPUlMgfSBmcm9tICcuLi9lcnJvcnMvdHlwZXMnO1xuaW1wb3J0IHByb2Nlc3NUZXN0Rm5FcnJvciBmcm9tICcuLi9lcnJvcnMvcHJvY2Vzcy10ZXN0LWZuLWVycm9yJztcblxuY29uc3QgbGF6eVJlcXVpcmUgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnaW1wb3J0LWxhenknKShyZXF1aXJlKTtcbmNvbnN0IFNlc3Npb25Db250cm9sbGVyICAgICAgICAgICA9IGxhenlSZXF1aXJlKCcuL3Nlc3Npb24tY29udHJvbGxlcicpO1xuY29uc3QgT2JzZXJ2ZWRDYWxsc2l0ZXNTdG9yYWdlICAgID0gbGF6eVJlcXVpcmUoJy4vb2JzZXJ2ZWQtY2FsbHNpdGVzLXN0b3JhZ2UnKTtcbmNvbnN0IENsaWVudEZ1bmN0aW9uQnVpbGRlciAgICAgICA9IGxhenlSZXF1aXJlKCcuLi9jbGllbnQtZnVuY3Rpb25zL2NsaWVudC1mdW5jdGlvbi1idWlsZGVyJyk7XG5jb25zdCBCcm93c2VyTWFuaXB1bGF0aW9uUXVldWUgICAgPSBsYXp5UmVxdWlyZSgnLi9icm93c2VyLW1hbmlwdWxhdGlvbi1xdWV1ZScpO1xuY29uc3QgVGVzdFJ1bkJvb2ttYXJrICAgICAgICAgICAgID0gbGF6eVJlcXVpcmUoJy4vYm9va21hcmsnKTtcbmNvbnN0IEFzc2VydGlvbkV4ZWN1dG9yICAgICAgICAgICA9IGxhenlSZXF1aXJlKCcuLi9hc3NlcnRpb25zL2V4ZWN1dG9yJyk7XG5jb25zdCBhY3Rpb25Db21tYW5kcyAgICAgICAgICAgICAgPSBsYXp5UmVxdWlyZSgnLi9jb21tYW5kcy9hY3Rpb25zJyk7XG5jb25zdCBicm93c2VyTWFuaXB1bGF0aW9uQ29tbWFuZHMgPSBsYXp5UmVxdWlyZSgnLi9jb21tYW5kcy9icm93c2VyLW1hbmlwdWxhdGlvbicpO1xuY29uc3Qgc2VydmljZUNvbW1hbmRzICAgICAgICAgICAgID0gbGF6eVJlcXVpcmUoJy4vY29tbWFuZHMvc2VydmljZScpO1xuY29uc3Qgb2JzZXJ2YXRpb25Db21tYW5kcyAgICAgICAgID0gbGF6eVJlcXVpcmUoJy4vY29tbWFuZHMvb2JzZXJ2YXRpb24nKTtcblxuY29uc3QgeyBleGVjdXRlSnNFeHByZXNzaW9uLCBleGVjdXRlQXN5bmNKc0V4cHJlc3Npb24gfSA9IGxhenlSZXF1aXJlKCcuL2V4ZWN1dGUtanMtZXhwcmVzc2lvbicpO1xuXG5jb25zdCBURVNUX1JVTl9URU1QTEFURSAgICAgICAgICAgICAgID0gcmVhZCgnLi4vY2xpZW50L3Rlc3QtcnVuL2luZGV4LmpzLm11c3RhY2hlJyk7XG5jb25zdCBJRlJBTUVfVEVTVF9SVU5fVEVNUExBVEUgICAgICAgID0gcmVhZCgnLi4vY2xpZW50L3Rlc3QtcnVuL2lmcmFtZS5qcy5tdXN0YWNoZScpO1xuY29uc3QgVEVTVF9ET05FX0NPTkZJUk1BVElPTl9SRVNQT05TRSA9ICd0ZXN0LWRvbmUtY29uZmlybWF0aW9uJztcbmNvbnN0IE1BWF9SRVNQT05TRV9ERUxBWSAgICAgICAgICAgICAgPSAzMDAwO1xuY29uc3QgQ0hJTERfV0lORE9XX1JFQURZX1RJTUVPVVQgICAgICA9IDMwICogMTAwMDtcblxuY29uc3QgQUxMX0RSSVZFUl9UQVNLU19BRERFRF9UT19RVUVVRV9FVkVOVCA9ICdhbGwtZHJpdmVyLXRhc2tzLWFkZGVkLXRvLXF1ZXVlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVzdFJ1biBleHRlbmRzIEFzeW5jRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvciAodGVzdCwgYnJvd3NlckNvbm5lY3Rpb24sIHNjcmVlbnNob3RDYXB0dXJlciwgZ2xvYmFsV2FybmluZ0xvZywgb3B0cykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXNbdGVzdFJ1bk1hcmtlcl0gPSB0cnVlO1xuXG4gICAgICAgIHRoaXMud2FybmluZ0xvZyA9IG5ldyBXYXJuaW5nTG9nKGdsb2JhbFdhcm5pbmdMb2cpO1xuXG4gICAgICAgIHRoaXMub3B0cyAgICAgICAgICAgICAgPSBvcHRzO1xuICAgICAgICB0aGlzLnRlc3QgICAgICAgICAgICAgID0gdGVzdDtcbiAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbiA9IGJyb3dzZXJDb25uZWN0aW9uO1xuXG4gICAgICAgIHRoaXMucGhhc2UgPSBQSEFTRS5pbml0aWFsO1xuXG4gICAgICAgIHRoaXMuZHJpdmVyVGFza1F1ZXVlICAgICAgID0gW107XG4gICAgICAgIHRoaXMudGVzdERvbmVDb21tYW5kUXVldWVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5hY3RpdmVEaWFsb2dIYW5kbGVyICA9IG51bGw7XG4gICAgICAgIHRoaXMuYWN0aXZlSWZyYW1lU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICB0aGlzLnNwZWVkICAgICAgICAgICAgICAgID0gdGhpcy5vcHRzLnNwZWVkO1xuICAgICAgICB0aGlzLnBhZ2VMb2FkVGltZW91dCAgICAgID0gdGhpcy5vcHRzLnBhZ2VMb2FkVGltZW91dDtcblxuICAgICAgICB0aGlzLmRpc2FibGVQYWdlUmVsb2FkcyAgID0gdGVzdC5kaXNhYmxlUGFnZVJlbG9hZHMgfHwgb3B0cy5kaXNhYmxlUGFnZVJlbG9hZHMgJiYgdGVzdC5kaXNhYmxlUGFnZVJlbG9hZHMgIT09IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc2FibGVQYWdlQ2FjaGluZyAgID0gdGVzdC5kaXNhYmxlUGFnZUNhY2hpbmcgfHwgb3B0cy5kaXNhYmxlUGFnZUNhY2hpbmc7XG5cbiAgICAgICAgdGhpcy5kaXNhYmxlTXVsdGlwbGVXaW5kb3dzID0gb3B0cy5kaXNhYmxlTXVsdGlwbGVXaW5kb3dzO1xuXG4gICAgICAgIHRoaXMucmVxdWVzdFRpbWVvdXQgPSB0aGlzLl9nZXRSZXF1ZXN0VGltZW91dCh0ZXN0LCBvcHRzKTtcblxuICAgICAgICB0aGlzLnNlc3Npb24gPSBTZXNzaW9uQ29udHJvbGxlci5nZXRTZXNzaW9uKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuY29uc29sZU1lc3NhZ2VzID0gbmV3IEJyb3dzZXJDb25zb2xlTWVzc2FnZXMoKTtcblxuICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0ICAgPSBudWxsO1xuICAgICAgICB0aGlzLnBlbmRpbmdQYWdlRXJyb3IgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gICAgICAgIHRoaXMuY3R4ICAgICAgICA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuZml4dHVyZUN0eCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50Um9sZUlkICA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlZFJvbGVTdGF0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgICAgIHRoaXMuZXJycyA9IFtdO1xuXG4gICAgICAgIHRoaXMubGFzdERyaXZlclN0YXR1c0lkICAgICAgID0gbnVsbDtcbiAgICAgICAgdGhpcy5sYXN0RHJpdmVyU3RhdHVzUmVzcG9uc2UgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuZmlsZURvd25sb2FkaW5nSGFuZGxlZCAgICAgICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVzb2x2ZVdhaXRGb3JGaWxlRG93bmxvYWRpbmdQcm9taXNlID0gbnVsbDtcblxuICAgICAgICB0aGlzLmFkZGluZ0RyaXZlclRhc2tzQ291bnQgPSAwO1xuXG4gICAgICAgIHRoaXMuZGVidWdnaW5nICAgICAgICAgICAgICAgPSB0aGlzLm9wdHMuZGVidWdNb2RlO1xuICAgICAgICB0aGlzLmRlYnVnT25GYWlsICAgICAgICAgICAgID0gdGhpcy5vcHRzLmRlYnVnT25GYWlsO1xuICAgICAgICB0aGlzLmRpc2FibGVEZWJ1Z0JyZWFrcG9pbnRzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGVidWdSZXBvcnRlclBsdWdpbkhvc3QgPSBuZXcgUmVwb3J0ZXJQbHVnaW5Ib3N0KHsgbm9Db2xvcnM6IGZhbHNlIH0pO1xuXG4gICAgICAgIHRoaXMuYnJvd3Nlck1hbmlwdWxhdGlvblF1ZXVlID0gbmV3IEJyb3dzZXJNYW5pcHVsYXRpb25RdWV1ZShicm93c2VyQ29ubmVjdGlvbiwgc2NyZWVuc2hvdENhcHR1cmVyLCB0aGlzLndhcm5pbmdMb2cpO1xuXG4gICAgICAgIHRoaXMuZGVidWdMb2cgPSBuZXcgVGVzdFJ1bkRlYnVnTG9nKHRoaXMuYnJvd3NlckNvbm5lY3Rpb24udXNlckFnZW50KTtcblxuICAgICAgICB0aGlzLnF1YXJhbnRpbmUgID0gbnVsbDtcblxuICAgICAgICB0aGlzLmRlYnVnTG9nZ2VyID0gdGhpcy5vcHRzLmRlYnVnTG9nZ2VyO1xuXG4gICAgICAgIHRoaXMub2JzZXJ2ZWRDYWxsc2l0ZXMgPSBuZXcgT2JzZXJ2ZWRDYWxsc2l0ZXNTdG9yYWdlKCk7XG5cbiAgICAgICAgdGhpcy5fYWRkSW5qZWN0YWJsZXMoKTtcbiAgICAgICAgdGhpcy5faW5pdFJlcXVlc3RIb29rcygpO1xuICAgIH1cblxuICAgIF9nZXRSZXF1ZXN0VGltZW91dCAodGVzdCwgb3B0cykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFnZTogb3B0cy5wYWdlUmVxdWVzdFRpbWVvdXQgfHwgdGVzdC50aW1lb3V0cz8ucGFnZVJlcXVlc3RUaW1lb3V0LFxuICAgICAgICAgICAgYWpheDogb3B0cy5hamF4UmVxdWVzdFRpbWVvdXQgfHwgdGVzdC50aW1lb3V0cz8uYWpheFJlcXVlc3RUaW1lb3V0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX2FkZENsaWVudFNjcmlwdENvbnRlbnRXYXJuaW5nc0lmTmVjZXNzYXJ5ICgpIHtcbiAgICAgICAgY29uc3QgeyBlbXB0eSwgZHVwbGljYXRlZENvbnRlbnQgfSA9IGZpbmRQcm9ibGVtYXRpY1NjcmlwdHModGhpcy50ZXN0LmNsaWVudFNjcmlwdHMpO1xuXG4gICAgICAgIGlmIChlbXB0eS5sZW5ndGgpXG4gICAgICAgICAgICB0aGlzLndhcm5pbmdMb2cuYWRkV2FybmluZyhXQVJOSU5HX01FU1NBR0UuY2xpZW50U2NyaXB0c1dpdGhFbXB0eUNvbnRlbnQpO1xuXG4gICAgICAgIGlmIChkdXBsaWNhdGVkQ29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1ZmZpeCAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGdldFBsdXJhbFN1ZmZpeChkdXBsaWNhdGVkQ29udGVudCk7XG4gICAgICAgICAgICBjb25zdCBkdXBsaWNhdGVkQ29udGVudENsaWVudFNjcmlwdHNTdHIgPSBnZXRDb25jYXRlbmF0ZWRWYWx1ZXNTdHJpbmcoZHVwbGljYXRlZENvbnRlbnQsICdcXG4nKTtcblxuICAgICAgICAgICAgdGhpcy53YXJuaW5nTG9nLmFkZFdhcm5pbmcoV0FSTklOR19NRVNTQUdFLmNsaWVudFNjcmlwdHNXaXRoRHVwbGljYXRlZENvbnRlbnQsIHN1ZmZpeCwgZHVwbGljYXRlZENvbnRlbnRDbGllbnRTY3JpcHRzU3RyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9hZGRJbmplY3RhYmxlcyAoKSB7XG4gICAgICAgIHRoaXMuX2FkZENsaWVudFNjcmlwdENvbnRlbnRXYXJuaW5nc0lmTmVjZXNzYXJ5KCk7XG4gICAgICAgIHRoaXMuaW5qZWN0YWJsZS5zY3JpcHRzLnB1c2goLi4uSU5KRUNUQUJMRVMuU0NSSVBUUyk7XG4gICAgICAgIHRoaXMuaW5qZWN0YWJsZS51c2VyU2NyaXB0cy5wdXNoKC4uLnRoaXMudGVzdC5jbGllbnRTY3JpcHRzLm1hcChzY3JpcHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1cmw6ICBnZXRDdXN0b21DbGllbnRTY3JpcHRVcmwoc2NyaXB0KSxcbiAgICAgICAgICAgICAgICBwYWdlOiBzY3JpcHQucGFnZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLmluamVjdGFibGUuc3R5bGVzLnB1c2goSU5KRUNUQUJMRVMuVEVTVENBRkVfVUlfU1RZTEVTKTtcbiAgICB9XG5cbiAgICBnZXQgaWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmlkO1xuICAgIH1cblxuICAgIGdldCBpbmplY3RhYmxlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5pbmplY3RhYmxlO1xuICAgIH1cblxuICAgIGFkZFF1YXJhbnRpbmVJbmZvIChxdWFyYW50aW5lKSB7XG4gICAgICAgIHRoaXMucXVhcmFudGluZSA9IHF1YXJhbnRpbmU7XG4gICAgfVxuXG4gICAgYWRkUmVxdWVzdEhvb2sgKGhvb2spIHtcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdEhvb2tzLmluZGV4T2YoaG9vaykgIT09IC0xKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucmVxdWVzdEhvb2tzLnB1c2goaG9vayk7XG4gICAgICAgIHRoaXMuX2luaXRSZXF1ZXN0SG9vayhob29rKTtcbiAgICB9XG5cbiAgICByZW1vdmVSZXF1ZXN0SG9vayAoaG9vaykge1xuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0SG9va3MuaW5kZXhPZihob29rKSA9PT0gLTEpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcHVsbCh0aGlzLnJlcXVlc3RIb29rcywgaG9vayk7XG4gICAgICAgIHRoaXMuX2Rpc3Bvc2VSZXF1ZXN0SG9vayhob29rKTtcbiAgICB9XG5cbiAgICBfaW5pdFJlcXVlc3RIb29rIChob29rKSB7XG4gICAgICAgIGhvb2sud2FybmluZ0xvZyA9IHRoaXMud2FybmluZ0xvZztcblxuICAgICAgICBob29rLl9pbnN0YW50aWF0ZVJlcXVlc3RGaWx0ZXJSdWxlcygpO1xuICAgICAgICBob29rLl9pbnN0YW50aWF0ZWRSZXF1ZXN0RmlsdGVyUnVsZXMuZm9yRWFjaChydWxlID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbi5hZGRSZXF1ZXN0RXZlbnRMaXN0ZW5lcnMocnVsZSwge1xuICAgICAgICAgICAgICAgIG9uUmVxdWVzdDogICAgICAgICAgIGhvb2sub25SZXF1ZXN0LmJpbmQoaG9vayksXG4gICAgICAgICAgICAgICAgb25Db25maWd1cmVSZXNwb25zZTogaG9vay5fb25Db25maWd1cmVSZXNwb25zZS5iaW5kKGhvb2spLFxuICAgICAgICAgICAgICAgIG9uUmVzcG9uc2U6ICAgICAgICAgIGhvb2sub25SZXNwb25zZS5iaW5kKGhvb2spXG4gICAgICAgICAgICB9LCBlcnIgPT4gdGhpcy5fb25SZXF1ZXN0SG9va01ldGhvZEVycm9yKGVyciwgaG9vaykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfb25SZXF1ZXN0SG9va01ldGhvZEVycm9yIChldmVudCwgaG9vaykge1xuICAgICAgICBsZXQgZXJyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGV2ZW50LmVycm9yO1xuICAgICAgICBjb25zdCBpc1JlcXVlc3RIb29rTm90SW1wbGVtZW50ZWRNZXRob2RFcnJvciA9IGVyciBpbnN0YW5jZW9mIFJlcXVlc3RIb29rTm90SW1wbGVtZW50ZWRNZXRob2RFcnJvcjtcblxuICAgICAgICBpZiAoIWlzUmVxdWVzdEhvb2tOb3RJbXBsZW1lbnRlZE1ldGhvZEVycm9yKSB7XG4gICAgICAgICAgICBjb25zdCBob29rQ2xhc3NOYW1lID0gaG9vay5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gICAgICAgICAgICBlcnIgPSBuZXcgUmVxdWVzdEhvb2tVbmhhbmRsZWRFcnJvcihlcnIsIGhvb2tDbGFzc05hbWUsIGV2ZW50Lm1ldGhvZE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRFcnJvcihlcnIpO1xuICAgIH1cblxuICAgIF9kaXNwb3NlUmVxdWVzdEhvb2sgKGhvb2spIHtcbiAgICAgICAgaG9vay53YXJuaW5nTG9nID0gbnVsbDtcblxuICAgICAgICBob29rLl9pbnN0YW50aWF0ZWRSZXF1ZXN0RmlsdGVyUnVsZXMuZm9yRWFjaChydWxlID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbi5yZW1vdmVSZXF1ZXN0RXZlbnRMaXN0ZW5lcnMocnVsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9pbml0UmVxdWVzdEhvb2tzICgpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0SG9va3MgPSBBcnJheS5mcm9tKHRoaXMudGVzdC5yZXF1ZXN0SG9va3MpO1xuXG4gICAgICAgIHRoaXMucmVxdWVzdEhvb2tzLmZvckVhY2goaG9vayA9PiB0aGlzLl9pbml0UmVxdWVzdEhvb2soaG9vaykpO1xuICAgIH1cblxuICAgIC8vIEhhbW1lcmhlYWQgcGF5bG9hZFxuICAgIGFzeW5jIGdldFBheWxvYWRTY3JpcHQgKCkge1xuICAgICAgICB0aGlzLmZpbGVEb3dubG9hZGluZ0hhbmRsZWQgICAgICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlc29sdmVXYWl0Rm9yRmlsZURvd25sb2FkaW5nUHJvbWlzZSA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIE11c3RhY2hlLnJlbmRlcihURVNUX1JVTl9URU1QTEFURSwge1xuICAgICAgICAgICAgdGVzdFJ1bklkOiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5zZXNzaW9uLmlkKSxcbiAgICAgICAgICAgIGJyb3dzZXJJZDogICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuYnJvd3NlckNvbm5lY3Rpb24uaWQpLFxuICAgICAgICAgICAgYnJvd3NlckhlYXJ0YmVhdFJlbGF0aXZlVXJsOiAgSlNPTi5zdHJpbmdpZnkodGhpcy5icm93c2VyQ29ubmVjdGlvbi5oZWFydGJlYXRSZWxhdGl2ZVVybCksXG4gICAgICAgICAgICBicm93c2VyU3RhdHVzUmVsYXRpdmVVcmw6ICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLmJyb3dzZXJDb25uZWN0aW9uLnN0YXR1c1JlbGF0aXZlVXJsKSxcbiAgICAgICAgICAgIGJyb3dzZXJTdGF0dXNEb25lUmVsYXRpdmVVcmw6IEpTT04uc3RyaW5naWZ5KHRoaXMuYnJvd3NlckNvbm5lY3Rpb24uc3RhdHVzRG9uZVJlbGF0aXZlVXJsKSxcbiAgICAgICAgICAgIGJyb3dzZXJBY3RpdmVXaW5kb3dJZFVybDogICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuYnJvd3NlckNvbm5lY3Rpb24uYWN0aXZlV2luZG93SWRVcmwpLFxuICAgICAgICAgICAgdXNlckFnZW50OiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5icm93c2VyQ29ubmVjdGlvbi51c2VyQWdlbnQpLFxuICAgICAgICAgICAgdGVzdE5hbWU6ICAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy50ZXN0Lm5hbWUpLFxuICAgICAgICAgICAgZml4dHVyZU5hbWU6ICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy50ZXN0LmZpeHR1cmUubmFtZSksXG4gICAgICAgICAgICBzZWxlY3RvclRpbWVvdXQ6ICAgICAgICAgICAgICB0aGlzLm9wdHMuc2VsZWN0b3JUaW1lb3V0LFxuICAgICAgICAgICAgcGFnZUxvYWRUaW1lb3V0OiAgICAgICAgICAgICAgdGhpcy5wYWdlTG9hZFRpbWVvdXQsXG4gICAgICAgICAgICBjaGlsZFdpbmRvd1JlYWR5VGltZW91dDogICAgICBDSElMRF9XSU5ET1dfUkVBRFlfVElNRU9VVCxcbiAgICAgICAgICAgIHNraXBKc0Vycm9yczogICAgICAgICAgICAgICAgIHRoaXMub3B0cy5za2lwSnNFcnJvcnMsXG4gICAgICAgICAgICByZXRyeVRlc3RQYWdlczogICAgICAgICAgICAgICB0aGlzLm9wdHMucmV0cnlUZXN0UGFnZXMsXG4gICAgICAgICAgICBzcGVlZDogICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWVkLFxuICAgICAgICAgICAgZGlhbG9nSGFuZGxlcjogICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5hY3RpdmVEaWFsb2dIYW5kbGVyKSxcbiAgICAgICAgICAgIGNhblVzZURlZmF1bHRXaW5kb3dBY3Rpb25zOiAgIEpTT04uc3RyaW5naWZ5KGF3YWl0IHRoaXMuYnJvd3NlckNvbm5lY3Rpb24uY2FuVXNlRGVmYXVsdFdpbmRvd0FjdGlvbnMoKSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0SWZyYW1lUGF5bG9hZFNjcmlwdCAoKSB7XG4gICAgICAgIHJldHVybiBNdXN0YWNoZS5yZW5kZXIoSUZSQU1FX1RFU1RfUlVOX1RFTVBMQVRFLCB7XG4gICAgICAgICAgICB0ZXN0UnVuSWQ6ICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuc2Vzc2lvbi5pZCksXG4gICAgICAgICAgICBzZWxlY3RvclRpbWVvdXQ6IHRoaXMub3B0cy5zZWxlY3RvclRpbWVvdXQsXG4gICAgICAgICAgICBwYWdlTG9hZFRpbWVvdXQ6IHRoaXMucGFnZUxvYWRUaW1lb3V0LFxuICAgICAgICAgICAgcmV0cnlUZXN0UGFnZXM6ICAhIXRoaXMub3B0cy5yZXRyeVRlc3RQYWdlcyxcbiAgICAgICAgICAgIHNwZWVkOiAgICAgICAgICAgdGhpcy5zcGVlZCxcbiAgICAgICAgICAgIGRpYWxvZ0hhbmRsZXI6ICAgSlNPTi5zdHJpbmdpZnkodGhpcy5hY3RpdmVEaWFsb2dIYW5kbGVyKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBIYW1tZXJoZWFkIGhhbmRsZXJzXG4gICAgZ2V0QXV0aENyZWRlbnRpYWxzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVzdC5hdXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgaGFuZGxlRmlsZURvd25sb2FkICgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzb2x2ZVdhaXRGb3JGaWxlRG93bmxvYWRpbmdQcm9taXNlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVXYWl0Rm9yRmlsZURvd25sb2FkaW5nUHJvbWlzZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZVdhaXRGb3JGaWxlRG93bmxvYWRpbmdQcm9taXNlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmZpbGVEb3dubG9hZGluZ0hhbmRsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGhhbmRsZVBhZ2VFcnJvciAoY3R4LCBlcnIpIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nUGFnZUVycm9yID0gbmV3IFBhZ2VMb2FkRXJyb3IoZXJyLCBjdHgucmVxT3B0cy51cmwpO1xuXG4gICAgICAgIGN0eC5yZWRpcmVjdChjdHgudG9Qcm94eVVybChTUEVDSUFMX0VSUk9SX1BBR0UpKTtcbiAgICB9XG5cbiAgICAvLyBUZXN0IGZ1bmN0aW9uIGV4ZWN1dGlvblxuICAgIGFzeW5jIF9leGVjdXRlVGVzdEZuIChwaGFzZSwgZm4pIHtcbiAgICAgICAgdGhpcy5waGFzZSA9IHBoYXNlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBmbih0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9tYWtlU2NyZWVuc2hvdE9uRmFpbCgpO1xuXG4gICAgICAgICAgICB0aGlzLmFkZEVycm9yKGVycik7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMuZXJyU2NyZWVuc2hvdFBhdGggPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICF0aGlzLl9hZGRQZW5kaW5nUGFnZUVycm9ySWZBbnkoKTtcbiAgICB9XG5cbiAgICBhc3luYyBfcnVuQmVmb3JlSG9vayAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3QuYmVmb3JlRm4pXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fZXhlY3V0ZVRlc3RGbihQSEFTRS5pblRlc3RCZWZvcmVIb29rLCB0aGlzLnRlc3QuYmVmb3JlRm4pO1xuXG4gICAgICAgIGlmICh0aGlzLnRlc3QuZml4dHVyZS5iZWZvcmVFYWNoRm4pXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fZXhlY3V0ZVRlc3RGbihQSEFTRS5pbkZpeHR1cmVCZWZvcmVFYWNoSG9vaywgdGhpcy50ZXN0LmZpeHR1cmUuYmVmb3JlRWFjaEZuKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyBfcnVuQWZ0ZXJIb29rICgpIHtcbiAgICAgICAgaWYgKHRoaXMudGVzdC5hZnRlckZuKVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX2V4ZWN1dGVUZXN0Rm4oUEhBU0UuaW5UZXN0QWZ0ZXJIb29rLCB0aGlzLnRlc3QuYWZ0ZXJGbik7XG5cbiAgICAgICAgaWYgKHRoaXMudGVzdC5maXh0dXJlLmFmdGVyRWFjaEZuKVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX2V4ZWN1dGVUZXN0Rm4oUEhBU0UuaW5GaXh0dXJlQWZ0ZXJFYWNoSG9vaywgdGhpcy50ZXN0LmZpeHR1cmUuYWZ0ZXJFYWNoRm4pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHN0YXJ0ICgpIHtcbiAgICAgICAgdGVzdFJ1blRyYWNrZXIuYWN0aXZlVGVzdFJ1bnNbdGhpcy5zZXNzaW9uLmlkXSA9IHRoaXM7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCdzdGFydCcpO1xuXG4gICAgICAgIGNvbnN0IG9uRGlzY29ubmVjdGVkID0gZXJyID0+IHRoaXMuX2Rpc2Nvbm5lY3QoZXJyKTtcblxuICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9uLm9uY2UoJ2Rpc2Nvbm5lY3RlZCcsIG9uRGlzY29ubmVjdGVkKTtcblxuICAgICAgICBhd2FpdCB0aGlzLm9uY2UoJ2Nvbm5lY3RlZCcpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuZW1pdCgncmVhZHknKTtcblxuICAgICAgICBpZiAoYXdhaXQgdGhpcy5fcnVuQmVmb3JlSG9vaygpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9leGVjdXRlVGVzdEZuKFBIQVNFLmluVGVzdCwgdGhpcy50ZXN0LmZuKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3J1bkFmdGVySG9vaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGlzY29ubmVjdGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYnJvd3NlckNvbm5lY3Rpb24ucmVtb3ZlTGlzdGVuZXIoJ2Rpc2Nvbm5lY3RlZCcsIG9uRGlzY29ubmVjdGVkKTtcblxuICAgICAgICBpZiAodGhpcy5lcnJzLmxlbmd0aCAmJiB0aGlzLmRlYnVnT25GYWlsKVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fZW5xdWV1ZVNldEJyZWFrcG9pbnRDb21tYW5kKG51bGwsIHRoaXMuZGVidWdSZXBvcnRlclBsdWdpbkhvc3QuZm9ybWF0RXJyb3IodGhpcy5lcnJzWzBdKSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCdiZWZvcmUtZG9uZScpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuZXhlY3V0ZUNvbW1hbmQobmV3IHNlcnZpY2VDb21tYW5kcy5UZXN0RG9uZUNvbW1hbmQoKSk7XG5cbiAgICAgICAgdGhpcy5fYWRkUGVuZGluZ1BhZ2VFcnJvcklmQW55KCk7XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5jbGVhclJlcXVlc3RFdmVudExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZVJlcXVlc3RIb29rRXJyb3JzKCk7XG5cbiAgICAgICAgZGVsZXRlIHRlc3RSdW5UcmFja2VyLmFjdGl2ZVRlc3RSdW5zW3RoaXMuc2Vzc2lvbi5pZF07XG5cbiAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCdkb25lJyk7XG4gICAgfVxuXG4gICAgLy8gRXJyb3JzXG4gICAgX2FkZFBlbmRpbmdQYWdlRXJyb3JJZkFueSAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBlbmRpbmdQYWdlRXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRXJyb3IodGhpcy5wZW5kaW5nUGFnZUVycm9yKTtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1BhZ2VFcnJvciA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfY3JlYXRlRXJyb3JBZGFwdGVyIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUZXN0UnVuRXJyb3JGb3JtYXR0YWJsZUFkYXB0ZXIoZXJyLCB7XG4gICAgICAgICAgICB1c2VyQWdlbnQ6ICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbi51c2VyQWdlbnQsXG4gICAgICAgICAgICBzY3JlZW5zaG90UGF0aDogdGhpcy5lcnJTY3JlZW5zaG90UGF0aCB8fCAnJyxcbiAgICAgICAgICAgIHRlc3RSdW5JZDogICAgICB0aGlzLmlkLFxuICAgICAgICAgICAgdGVzdFJ1blBoYXNlOiAgIHRoaXMucGhhc2VcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkRXJyb3IgKGVycikge1xuICAgICAgICBjb25zdCBlcnJMaXN0ID0gZXJyIGluc3RhbmNlb2YgVGVzdENhZmVFcnJvckxpc3QgPyBlcnIuaXRlbXMgOiBbZXJyXTtcblxuICAgICAgICBlcnJMaXN0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhZGFwdGVyID0gdGhpcy5fY3JlYXRlRXJyb3JBZGFwdGVyKGl0ZW0pO1xuXG4gICAgICAgICAgICB0aGlzLmVycnMucHVzaChhZGFwdGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplUmVxdWVzdEhvb2tFcnJvcnMgKCkge1xuICAgICAgICBjb25zdCByZXF1ZXN0SG9va0Vycm9ycyA9IHJlbW92ZSh0aGlzLmVycnMsIGUgPT5cbiAgICAgICAgICAgIGUuY29kZSA9PT0gVEVTVF9SVU5fRVJST1JTLnJlcXVlc3RIb29rTm90SW1wbGVtZW50ZWRFcnJvciB8fFxuICAgICAgICAgICAgZS5jb2RlID09PSBURVNUX1JVTl9FUlJPUlMucmVxdWVzdEhvb2tVbmhhbmRsZWRFcnJvcik7XG5cbiAgICAgICAgaWYgKCFyZXF1ZXN0SG9va0Vycm9ycy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgY29uc3QgdW5pcVJlcXVlc3RIb29rRXJyb3JzID0gY2hhaW4ocmVxdWVzdEhvb2tFcnJvcnMpXG4gICAgICAgICAgICAudW5pcUJ5KGUgPT4gZS5ob29rQ2xhc3NOYW1lICsgZS5tZXRob2ROYW1lKVxuICAgICAgICAgICAgLnNvcnRCeShbJ2hvb2tDbGFzc05hbWUnLCAnbWV0aG9kTmFtZSddKVxuICAgICAgICAgICAgLnZhbHVlKCk7XG5cbiAgICAgICAgdGhpcy5lcnJzID0gdGhpcy5lcnJzLmNvbmNhdCh1bmlxUmVxdWVzdEhvb2tFcnJvcnMpO1xuICAgIH1cblxuICAgIC8vIFRhc2sgcXVldWVcbiAgICBfZW5xdWV1ZUNvbW1hbmQgKGNvbW1hbmQsIGNhbGxzaXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnBlbmRpbmdSZXF1ZXN0KVxuICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZVBlbmRpbmdSZXF1ZXN0KGNvbW1hbmQpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZGluZ0RyaXZlclRhc2tzQ291bnQtLTtcbiAgICAgICAgICAgIHRoaXMuZHJpdmVyVGFza1F1ZXVlLnB1c2goeyBjb21tYW5kLCByZXNvbHZlLCByZWplY3QsIGNhbGxzaXRlIH0pO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuYWRkaW5nRHJpdmVyVGFza3NDb3VudClcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVtaXQoQUxMX0RSSVZFUl9UQVNLU19BRERFRF9UT19RVUVVRV9FVkVOVCwgdGhpcy5kcml2ZXJUYXNrUXVldWUubGVuZ3RoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGRyaXZlclRhc2tRdWV1ZUxlbmd0aCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZGluZ0RyaXZlclRhc2tzQ291bnQgPyBwcm9taXNpZnlFdmVudCh0aGlzLCBBTExfRFJJVkVSX1RBU0tTX0FEREVEX1RPX1FVRVVFX0VWRU5UKSA6IFByb21pc2UucmVzb2x2ZSh0aGlzLmRyaXZlclRhc2tRdWV1ZS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGFzeW5jIF9lbnF1ZXVlQnJvd3NlckNvbnNvbGVNZXNzYWdlc0NvbW1hbmQgKGNvbW1hbmQsIGNhbGxzaXRlKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuX2VucXVldWVDb21tYW5kKGNvbW1hbmQsIGNhbGxzaXRlKTtcblxuICAgICAgICBjb25zdCBjb25zb2xlTWVzc2FnZUNvcHkgPSB0aGlzLmNvbnNvbGVNZXNzYWdlcy5nZXRDb3B5KCk7XG5cbiAgICAgICAgcmV0dXJuIGNvbnNvbGVNZXNzYWdlQ29weVt0aGlzLmJyb3dzZXJDb25uZWN0aW9uLmFjdGl2ZVdpbmRvd0lkXTtcbiAgICB9XG5cbiAgICBhc3luYyBfZW5xdWV1ZVNldEJyZWFrcG9pbnRDb21tYW5kIChjYWxsc2l0ZSwgZXJyb3IpIHtcbiAgICAgICAgaWYgKHRoaXMuYnJvd3NlckNvbm5lY3Rpb24uaXNIZWFkbGVzc0Jyb3dzZXIoKSkge1xuICAgICAgICAgICAgdGhpcy53YXJuaW5nTG9nLmFkZFdhcm5pbmcoV0FSTklOR19NRVNTQUdFLmRlYnVnSW5IZWFkbGVzc0Vycm9yKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRlYnVnTG9nZ2VyKVxuICAgICAgICAgICAgdGhpcy5kZWJ1Z0xvZ2dlci5zaG93QnJlYWtwb2ludCh0aGlzLnNlc3Npb24uaWQsIHRoaXMuYnJvd3NlckNvbm5lY3Rpb24udXNlckFnZW50LCBjYWxsc2l0ZSwgZXJyb3IpO1xuXG4gICAgICAgIHRoaXMuZGVidWdnaW5nID0gYXdhaXQgdGhpcy5leGVjdXRlQ29tbWFuZChuZXcgc2VydmljZUNvbW1hbmRzLlNldEJyZWFrcG9pbnRDb21tYW5kKCEhZXJyb3IpLCBjYWxsc2l0ZSk7XG4gICAgfVxuXG4gICAgX3JlbW92ZUFsbE5vblNlcnZpY2VUYXNrcyAoKSB7XG4gICAgICAgIHRoaXMuZHJpdmVyVGFza1F1ZXVlID0gdGhpcy5kcml2ZXJUYXNrUXVldWUuZmlsdGVyKGRyaXZlclRhc2sgPT4gaXNTZXJ2aWNlQ29tbWFuZChkcml2ZXJUYXNrLmNvbW1hbmQpKTtcblxuICAgICAgICB0aGlzLmJyb3dzZXJNYW5pcHVsYXRpb25RdWV1ZS5yZW1vdmVBbGxOb25TZXJ2aWNlTWFuaXB1bGF0aW9ucygpO1xuICAgIH1cblxuICAgIC8vIEN1cnJlbnQgZHJpdmVyIHRhc2tcbiAgICBnZXQgY3VycmVudERyaXZlclRhc2sgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kcml2ZXJUYXNrUXVldWVbMF07XG4gICAgfVxuXG4gICAgX3Jlc29sdmVDdXJyZW50RHJpdmVyVGFzayAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMuY3VycmVudERyaXZlclRhc2sucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB0aGlzLmRyaXZlclRhc2tRdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLnRlc3REb25lQ29tbWFuZFF1ZXVlZClcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUFsbE5vblNlcnZpY2VUYXNrcygpO1xuICAgIH1cblxuICAgIF9yZWplY3RDdXJyZW50RHJpdmVyVGFzayAoZXJyKSB7XG4gICAgICAgIGVyci5jYWxsc2l0ZSA9IGVyci5jYWxsc2l0ZSB8fCB0aGlzLmN1cnJlbnREcml2ZXJUYXNrLmNhbGxzaXRlO1xuXG4gICAgICAgIHRoaXMuY3VycmVudERyaXZlclRhc2sucmVqZWN0KGVycik7XG4gICAgICAgIHRoaXMuX3JlbW92ZUFsbE5vblNlcnZpY2VUYXNrcygpO1xuICAgIH1cblxuICAgIC8vIFBlbmRpbmcgcmVxdWVzdFxuICAgIF9jbGVhclBlbmRpbmdSZXF1ZXN0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMucGVuZGluZ1JlcXVlc3QpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnBlbmRpbmdSZXF1ZXN0LnJlc3BvbnNlVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9yZXNvbHZlUGVuZGluZ1JlcXVlc3QgKGNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5sYXN0RHJpdmVyU3RhdHVzUmVzcG9uc2UgPSBjb21tYW5kO1xuICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0LnJlc29sdmUoY29tbWFuZCk7XG4gICAgICAgIHRoaXMuX2NsZWFyUGVuZGluZ1JlcXVlc3QoKTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgZHJpdmVyIHJlcXVlc3RcbiAgICBfc2hvdWxkUmVzb2x2ZUN1cnJlbnREcml2ZXJUYXNrIChkcml2ZXJTdGF0dXMpIHtcbiAgICAgICAgY29uc3QgY3VycmVudENvbW1hbmQgPSB0aGlzLmN1cnJlbnREcml2ZXJUYXNrLmNvbW1hbmQ7XG5cbiAgICAgICAgY29uc3QgaXNFeGVjdXRpbmdPYnNlcnZhdGlvbkNvbW1hbmQgPSBjdXJyZW50Q29tbWFuZCBpbnN0YW5jZW9mIG9ic2VydmF0aW9uQ29tbWFuZHMuRXhlY3V0ZVNlbGVjdG9yQ29tbWFuZCB8fFxuICAgICAgICAgICAgY3VycmVudENvbW1hbmQgaW5zdGFuY2VvZiBvYnNlcnZhdGlvbkNvbW1hbmRzLkV4ZWN1dGVDbGllbnRGdW5jdGlvbkNvbW1hbmQ7XG5cbiAgICAgICAgY29uc3QgaXNEZWJ1Z0FjdGl2ZSA9IGN1cnJlbnRDb21tYW5kIGluc3RhbmNlb2Ygc2VydmljZUNvbW1hbmRzLlNldEJyZWFrcG9pbnRDb21tYW5kO1xuXG4gICAgICAgIGNvbnN0IHNob3VsZEV4ZWN1dGVDdXJyZW50Q29tbWFuZCA9XG4gICAgICAgICAgICBkcml2ZXJTdGF0dXMuaXNGaXJzdFJlcXVlc3RBZnRlcldpbmRvd1N3aXRjaGluZyAmJiAoaXNFeGVjdXRpbmdPYnNlcnZhdGlvbkNvbW1hbmQgfHwgaXNEZWJ1Z0FjdGl2ZSk7XG5cbiAgICAgICAgcmV0dXJuICFzaG91bGRFeGVjdXRlQ3VycmVudENvbW1hbmQ7XG4gICAgfVxuXG4gICAgX2Z1bGZpbGxDdXJyZW50RHJpdmVyVGFzayAoZHJpdmVyU3RhdHVzKSB7XG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50RHJpdmVyVGFzaylcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAoZHJpdmVyU3RhdHVzLmV4ZWN1dGlvbkVycm9yKVxuICAgICAgICAgICAgdGhpcy5fcmVqZWN0Q3VycmVudERyaXZlclRhc2soZHJpdmVyU3RhdHVzLmV4ZWN1dGlvbkVycm9yKTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc2hvdWxkUmVzb2x2ZUN1cnJlbnREcml2ZXJUYXNrKGRyaXZlclN0YXR1cykpXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHZlQ3VycmVudERyaXZlclRhc2soZHJpdmVyU3RhdHVzLnJlc3VsdCk7XG4gICAgfVxuXG4gICAgX2hhbmRsZVBhZ2VFcnJvclN0YXR1cyAocGFnZUVycm9yKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnREcml2ZXJUYXNrICYmIGlzQ29tbWFuZFJlamVjdGFibGVCeVBhZ2VFcnJvcih0aGlzLmN1cnJlbnREcml2ZXJUYXNrLmNvbW1hbmQpKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWplY3RDdXJyZW50RHJpdmVyVGFzayhwYWdlRXJyb3IpO1xuICAgICAgICAgICAgdGhpcy5wZW5kaW5nUGFnZUVycm9yID0gbnVsbDtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBlbmRpbmdQYWdlRXJyb3IgPSB0aGlzLnBlbmRpbmdQYWdlRXJyb3IgfHwgcGFnZUVycm9yO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfaGFuZGxlRHJpdmVyUmVxdWVzdCAoZHJpdmVyU3RhdHVzKSB7XG4gICAgICAgIGNvbnN0IGlzVGVzdERvbmUgICAgICAgICAgICAgICAgID0gdGhpcy5jdXJyZW50RHJpdmVyVGFzayAmJiB0aGlzLmN1cnJlbnREcml2ZXJUYXNrLmNvbW1hbmQudHlwZSA9PT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDT01NQU5EX1RZUEUudGVzdERvbmU7XG4gICAgICAgIGNvbnN0IHBhZ2VFcnJvciAgICAgICAgICAgICAgICAgID0gdGhpcy5wZW5kaW5nUGFnZUVycm9yIHx8IGRyaXZlclN0YXR1cy5wYWdlRXJyb3I7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrUmVqZWN0ZWRCeUVycm9yID0gcGFnZUVycm9yICYmIHRoaXMuX2hhbmRsZVBhZ2VFcnJvclN0YXR1cyhwYWdlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuY29uc29sZU1lc3NhZ2VzLmNvbmNhdChkcml2ZXJTdGF0dXMuY29uc29sZU1lc3NhZ2VzKTtcblxuICAgICAgICBpZiAoIWN1cnJlbnRUYXNrUmVqZWN0ZWRCeUVycm9yICYmIGRyaXZlclN0YXR1cy5pc0NvbW1hbmRSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChpc1Rlc3REb25lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZUN1cnJlbnREcml2ZXJUYXNrKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gVEVTVF9ET05FX0NPTkZJUk1BVElPTl9SRVNQT05TRTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZnVsZmlsbEN1cnJlbnREcml2ZXJUYXNrKGRyaXZlclN0YXR1cyk7XG5cbiAgICAgICAgICAgIGlmIChkcml2ZXJTdGF0dXMuaXNQZW5kaW5nV2luZG93U3dpdGNoaW5nKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldEN1cnJlbnREcml2ZXJUYXNrQ29tbWFuZCgpO1xuICAgIH1cblxuICAgIF9nZXRDdXJyZW50RHJpdmVyVGFza0NvbW1hbmQgKCkge1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudERyaXZlclRhc2spXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5jdXJyZW50RHJpdmVyVGFzay5jb21tYW5kO1xuXG4gICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT09IENPTU1BTkRfVFlQRS5uYXZpZ2F0ZVRvICYmIGNvbW1hbmQuc3RhdGVTbmFwc2hvdClcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbi51c2VTdGF0ZVNuYXBzaG90KEpTT04ucGFyc2UoY29tbWFuZC5zdGF0ZVNuYXBzaG90KSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgLy8gRXhlY3V0ZSBjb21tYW5kXG4gICAgX2V4ZWN1dGVKc0V4cHJlc3Npb24gKGNvbW1hbmQpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0VmFyaWFibGVOYW1lID0gY29tbWFuZC5yZXN1bHRWYXJpYWJsZU5hbWU7XG4gICAgICAgIGxldCBleHByZXNzaW9uICAgICAgICAgICA9IGNvbW1hbmQuZXhwcmVzc2lvbjtcblxuICAgICAgICBpZiAocmVzdWx0VmFyaWFibGVOYW1lKVxuICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGAke3Jlc3VsdFZhcmlhYmxlTmFtZX0gPSAke2V4cHJlc3Npb259LCAke3Jlc3VsdFZhcmlhYmxlTmFtZX1gO1xuXG4gICAgICAgIHJldHVybiBleGVjdXRlSnNFeHByZXNzaW9uKGV4cHJlc3Npb24sIHRoaXMsIHsgc2tpcFZpc2liaWxpdHlDaGVjazogZmFsc2UgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2V4ZWN1dGVBc3NlcnRpb24gKGNvbW1hbmQsIGNhbGxzaXRlKSB7XG4gICAgICAgIGNvbnN0IGFzc2VydGlvblRpbWVvdXQgPSBjb21tYW5kLm9wdGlvbnMudGltZW91dCA9PT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvaWQgMCA/IHRoaXMub3B0cy5hc3NlcnRpb25UaW1lb3V0IDogY29tbWFuZC5vcHRpb25zLnRpbWVvdXQ7XG4gICAgICAgIGNvbnN0IGV4ZWN1dG9yICAgICAgICAgPSBuZXcgQXNzZXJ0aW9uRXhlY3V0b3IoY29tbWFuZCwgYXNzZXJ0aW9uVGltZW91dCwgY2FsbHNpdGUpO1xuXG4gICAgICAgIGV4ZWN1dG9yLm9uY2UoJ3N0YXJ0LWFzc2VydGlvbi1yZXRyaWVzJywgdGltZW91dCA9PiB0aGlzLmV4ZWN1dGVDb21tYW5kKG5ldyBzZXJ2aWNlQ29tbWFuZHMuU2hvd0Fzc2VydGlvblJldHJpZXNTdGF0dXNDb21tYW5kKHRpbWVvdXQpKSk7XG4gICAgICAgIGV4ZWN1dG9yLm9uY2UoJ2VuZC1hc3NlcnRpb24tcmV0cmllcycsIHN1Y2Nlc3MgPT4gdGhpcy5leGVjdXRlQ29tbWFuZChuZXcgc2VydmljZUNvbW1hbmRzLkhpZGVBc3NlcnRpb25SZXRyaWVzU3RhdHVzQ29tbWFuZChzdWNjZXNzKSkpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWN1dGVGbiA9IHRoaXMuZGVjb3JhdGVQcmV2ZW50RW1pdEFjdGlvbkV2ZW50cygoKSA9PiBleGVjdXRvci5ydW4oKSwgeyBwcmV2ZW50OiB0cnVlIH0pO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCBleGVjdXRlRm4oKTtcbiAgICB9XG5cbiAgICBfYWRqdXN0Q29uZmlndXJhdGlvbldpdGhDb21tYW5kIChjb21tYW5kKSB7XG4gICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT09IENPTU1BTkRfVFlQRS50ZXN0RG9uZSkge1xuICAgICAgICAgICAgdGhpcy50ZXN0RG9uZUNvbW1hbmRRdWV1ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVidWdMb2dnZXIpXG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1Z0xvZ2dlci5oaWRlQnJlYWtwb2ludCh0aGlzLnNlc3Npb24uaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC50eXBlID09PSBDT01NQU5EX1RZUEUuc2V0TmF0aXZlRGlhbG9nSGFuZGxlcilcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlRGlhbG9nSGFuZGxlciA9IGNvbW1hbmQuZGlhbG9nSGFuZGxlcjtcblxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLnR5cGUgPT09IENPTU1BTkRfVFlQRS5zd2l0Y2hUb0lmcmFtZSlcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSWZyYW1lU2VsZWN0b3IgPSBjb21tYW5kLnNlbGVjdG9yO1xuXG4gICAgICAgIGVsc2UgaWYgKGNvbW1hbmQudHlwZSA9PT0gQ09NTUFORF9UWVBFLnN3aXRjaFRvTWFpbldpbmRvdylcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSWZyYW1lU2VsZWN0b3IgPSBudWxsO1xuXG4gICAgICAgIGVsc2UgaWYgKGNvbW1hbmQudHlwZSA9PT0gQ09NTUFORF9UWVBFLnNldFRlc3RTcGVlZClcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSBjb21tYW5kLnNwZWVkO1xuXG4gICAgICAgIGVsc2UgaWYgKGNvbW1hbmQudHlwZSA9PT0gQ09NTUFORF9UWVBFLnNldFBhZ2VMb2FkVGltZW91dClcbiAgICAgICAgICAgIHRoaXMucGFnZUxvYWRUaW1lb3V0ID0gY29tbWFuZC5kdXJhdGlvbjtcblxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLnR5cGUgPT09IENPTU1BTkRfVFlQRS5kZWJ1ZylcbiAgICAgICAgICAgIHRoaXMuZGVidWdnaW5nID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyBfYWRqdXN0U2NyZWVuc2hvdENvbW1hbmQgKGNvbW1hbmQpIHtcbiAgICAgICAgY29uc3QgYnJvd3NlcklkICAgICAgICAgICAgICAgICAgICA9IHRoaXMuYnJvd3NlckNvbm5lY3Rpb24uaWQ7XG4gICAgICAgIGNvbnN0IHsgaGFzQ2hyb21lbGVzc1NjcmVlbnNob3RzIH0gPSBhd2FpdCB0aGlzLmJyb3dzZXJDb25uZWN0aW9uLnByb3ZpZGVyLmhhc0N1c3RvbUFjdGlvbkZvckJyb3dzZXIoYnJvd3NlcklkKTtcblxuICAgICAgICBpZiAoIWhhc0Nocm9tZWxlc3NTY3JlZW5zaG90cylcbiAgICAgICAgICAgIGNvbW1hbmQuZ2VuZXJhdGVTY3JlZW5zaG90TWFyaygpO1xuICAgIH1cblxuICAgIGFzeW5jIF9zZXRCcmVha3BvaW50SWZOZWNlc3NhcnkgKGNvbW1hbmQsIGNhbGxzaXRlKSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlRGVidWdCcmVha3BvaW50cyAmJiB0aGlzLmRlYnVnZ2luZyAmJiBjYW5TZXREZWJ1Z2dlckJyZWFrcG9pbnRCZWZvcmVDb21tYW5kKGNvbW1hbmQpKVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fZW5xdWV1ZVNldEJyZWFrcG9pbnRDb21tYW5kKGNhbGxzaXRlKTtcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlQWN0aW9uIChhcGlBY3Rpb25OYW1lLCBjb21tYW5kLCBjYWxsc2l0ZSkge1xuICAgICAgICBjb25zdCBhY3Rpb25BcmdzID0geyBhcGlBY3Rpb25OYW1lLCBjb21tYW5kIH07XG5cbiAgICAgICAgbGV0IGVycm9yQWRhcHRlciA9IG51bGw7XG4gICAgICAgIGxldCBlcnJvciAgICAgICAgPSBudWxsO1xuICAgICAgICBsZXQgcmVzdWx0ICAgICAgID0gbnVsbDtcblxuICAgICAgICBhd2FpdCB0aGlzLmVtaXRBY3Rpb25FdmVudCgnYWN0aW9uLXN0YXJ0JywgYWN0aW9uQXJncyk7XG5cbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCB0aGlzLmV4ZWN1dGVDb21tYW5kKGNvbW1hbmQsIGNhbGxzaXRlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gbmV3IERhdGUoKSAtIHN0YXJ0O1xuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgLy8gTk9URTogY2hlY2sgaWYgZXJyb3IgaXMgVGVzdENhZmVFcnJvckxpc3QgaXMgc3BlY2lmaWMgZm9yIHRoZSBgdXNlUm9sZWAgYWN0aW9uXG4gICAgICAgICAgICAvLyBpZiBlcnJvciBpcyBUZXN0Q2FmZUVycm9yTGlzdCB3ZSBkbyBub3QgbmVlZCB0byBjcmVhdGUgYW4gYWRhcHRlcixcbiAgICAgICAgICAgIC8vIHNpbmNlIGVycm9yIGlzIGFscmVhZHkgd2FzIHByb2Nlc3NlZCBpbiByb2xlIGluaXRpYWxpemVyXG4gICAgICAgICAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIFRlc3RDYWZlRXJyb3JMaXN0KSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX21ha2VTY3JlZW5zaG90T25GYWlsKCk7XG5cbiAgICAgICAgICAgICAgICBlcnJvckFkYXB0ZXIgPSB0aGlzLl9jcmVhdGVFcnJvckFkYXB0ZXIocHJvY2Vzc1Rlc3RGbkVycm9yKGVycm9yKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuYXNzaWduKGFjdGlvbkFyZ3MsIHtcbiAgICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgICAgZXJyOiBlcnJvckFkYXB0ZXJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5lbWl0QWN0aW9uRXZlbnQoJ2FjdGlvbi1kb25lJywgYWN0aW9uQXJncyk7XG5cbiAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlQ29tbWFuZCAoY29tbWFuZCwgY2FsbHNpdGUpIHtcbiAgICAgICAgdGhpcy5kZWJ1Z0xvZy5jb21tYW5kKGNvbW1hbmQpO1xuXG4gICAgICAgIGlmICh0aGlzLnBlbmRpbmdQYWdlRXJyb3IgJiYgaXNDb21tYW5kUmVqZWN0YWJsZUJ5UGFnZUVycm9yKGNvbW1hbmQpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlamVjdENvbW1hbmRXaXRoUGFnZUVycm9yKGNhbGxzaXRlKTtcblxuICAgICAgICBpZiAoaXNFeGVjdXRhYmxlT25DbGllbnRDb21tYW5kKGNvbW1hbmQpKVxuICAgICAgICAgICAgdGhpcy5hZGRpbmdEcml2ZXJUYXNrc0NvdW50Kys7XG5cbiAgICAgICAgdGhpcy5fYWRqdXN0Q29uZmlndXJhdGlvbldpdGhDb21tYW5kKGNvbW1hbmQpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuX3NldEJyZWFrcG9pbnRJZk5lY2Vzc2FyeShjb21tYW5kLCBjYWxsc2l0ZSk7XG5cbiAgICAgICAgaWYgKGlzU2NyZWVuc2hvdENvbW1hbmQoY29tbWFuZCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMuZGlzYWJsZVNjcmVlbnNob3RzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXJuaW5nTG9nLmFkZFdhcm5pbmcoV0FSTklOR19NRVNTQUdFLnNjcmVlbnNob3RzRGlzYWJsZWQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2FkanVzdFNjcmVlbnNob3RDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQnJvd3Nlck1hbmlwdWxhdGlvbkNvbW1hbmQoY29tbWFuZCkpIHtcbiAgICAgICAgICAgIHRoaXMuYnJvd3Nlck1hbmlwdWxhdGlvblF1ZXVlLnB1c2goY29tbWFuZCk7XG5cbiAgICAgICAgICAgIGlmIChpc1Jlc2l6ZVdpbmRvd0NvbW1hbmQoY29tbWFuZCkgJiYgdGhpcy5vcHRzLnZpZGVvUGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmdMb2cuYWRkV2FybmluZyhXQVJOSU5HX01FU1NBR0UudmlkZW9Ccm93c2VyUmVzaXppbmcsIHRoaXMudGVzdC5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT09IENPTU1BTkRfVFlQRS53YWl0KVxuICAgICAgICAgICAgcmV0dXJuIGRlbGF5KGNvbW1hbmQudGltZW91dCk7XG5cbiAgICAgICAgaWYgKGNvbW1hbmQudHlwZSA9PT0gQ09NTUFORF9UWVBFLnNldFBhZ2VMb2FkVGltZW91dClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT09IENPTU1BTkRfVFlQRS5kZWJ1ZylcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9lbnF1ZXVlU2V0QnJlYWtwb2ludENvbW1hbmQoY2FsbHNpdGUpO1xuXG4gICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT09IENPTU1BTkRfVFlQRS51c2VSb2xlKSB7XG4gICAgICAgICAgICBsZXQgZm4gPSAoKSA9PiB0aGlzLl91c2VSb2xlKGNvbW1hbmQucm9sZSwgY2FsbHNpdGUpO1xuXG4gICAgICAgICAgICBmbiA9IHRoaXMuZGVjb3JhdGVQcmV2ZW50RW1pdEFjdGlvbkV2ZW50cyhmbiwgeyBwcmV2ZW50OiB0cnVlIH0pO1xuICAgICAgICAgICAgZm4gPSB0aGlzLmRlY29yYXRlRGlzYWJsZURlYnVnQnJlYWtwb2ludHMoZm4sIHsgZGlzYWJsZTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tbWFuZC50eXBlID09PSBDT01NQU5EX1RZUEUuYXNzZXJ0aW9uKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4ZWN1dGVBc3NlcnRpb24oY29tbWFuZCwgY2FsbHNpdGUpO1xuXG4gICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT09IENPTU1BTkRfVFlQRS5leGVjdXRlRXhwcmVzc2lvbilcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9leGVjdXRlSnNFeHByZXNzaW9uKGNvbW1hbmQsIGNhbGxzaXRlKTtcblxuICAgICAgICBpZiAoY29tbWFuZC50eXBlID09PSBDT01NQU5EX1RZUEUuZXhlY3V0ZUFzeW5jRXhwcmVzc2lvbilcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBleGVjdXRlQXN5bmNKc0V4cHJlc3Npb24oY29tbWFuZC5leHByZXNzaW9uLCB0aGlzLCBjYWxsc2l0ZSk7XG5cbiAgICAgICAgaWYgKGNvbW1hbmQudHlwZSA9PT0gQ09NTUFORF9UWVBFLmdldEJyb3dzZXJDb25zb2xlTWVzc2FnZXMpXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fZW5xdWV1ZUJyb3dzZXJDb25zb2xlTWVzc2FnZXNDb21tYW5kKGNvbW1hbmQsIGNhbGxzaXRlKTtcblxuICAgICAgICBpZiAoY29tbWFuZC50eXBlID09PSBDT01NQU5EX1RZUEUuc3dpdGNoVG9QcmV2aW91c1dpbmRvdylcbiAgICAgICAgICAgIGNvbW1hbmQud2luZG93SWQgPSB0aGlzLmJyb3dzZXJDb25uZWN0aW9uLnByZXZpb3VzQWN0aXZlV2luZG93SWQ7XG5cbiAgICAgICAgaWYgKGNvbW1hbmQudHlwZSA9PT0gQ09NTUFORF9UWVBFLnN3aXRjaFRvV2luZG93QnlQcmVkaWNhdGUpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3dpdGNoVG9XaW5kb3dCeVByZWRpY2F0ZShjb21tYW5kKTtcblxuXG4gICAgICAgIHJldHVybiB0aGlzLl9lbnF1ZXVlQ29tbWFuZChjb21tYW5kLCBjYWxsc2l0ZSk7XG4gICAgfVxuXG4gICAgX3JlamVjdENvbW1hbmRXaXRoUGFnZUVycm9yIChjYWxsc2l0ZSkge1xuICAgICAgICBjb25zdCBlcnIgPSB0aGlzLnBlbmRpbmdQYWdlRXJyb3I7XG5cbiAgICAgICAgZXJyLmNhbGxzaXRlICAgICAgICAgID0gY2FsbHNpdGU7XG4gICAgICAgIHRoaXMucGVuZGluZ1BhZ2VFcnJvciA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgfVxuXG4gICAgYXN5bmMgX21ha2VTY3JlZW5zaG90T25GYWlsICgpIHtcbiAgICAgICAgY29uc3QgeyBzY3JlZW5zaG90cyB9ID0gdGhpcy5vcHRzO1xuXG4gICAgICAgIGlmICghdGhpcy5lcnJTY3JlZW5zaG90UGF0aCAmJiBzY3JlZW5zaG90cyAmJiBzY3JlZW5zaG90cy50YWtlT25GYWlscylcbiAgICAgICAgICAgIHRoaXMuZXJyU2NyZWVuc2hvdFBhdGggPSBhd2FpdCB0aGlzLmV4ZWN1dGVDb21tYW5kKG5ldyBicm93c2VyTWFuaXB1bGF0aW9uQ29tbWFuZHMuVGFrZVNjcmVlbnNob3RPbkZhaWxDb21tYW5kKCkpO1xuICAgIH1cblxuICAgIF9kZWNvcmF0ZVdpdGhGbGFnIChmbiwgZmxhZ05hbWUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzW2ZsYWdOYW1lXSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBmbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHRoaXNbZmxhZ05hbWVdID0gIXZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGRlY29yYXRlUHJldmVudEVtaXRBY3Rpb25FdmVudHMgKGZuLCB7IHByZXZlbnQgfSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVjb3JhdGVXaXRoRmxhZyhmbiwgJ3ByZXZlbnRFbWl0QWN0aW9uRXZlbnRzJywgcHJldmVudCk7XG4gICAgfVxuXG4gICAgZGVjb3JhdGVEaXNhYmxlRGVidWdCcmVha3BvaW50cyAoZm4sIHsgZGlzYWJsZSB9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWNvcmF0ZVdpdGhGbGFnKGZuLCAnZGlzYWJsZURlYnVnQnJlYWtwb2ludHMnLCBkaXNhYmxlKTtcbiAgICB9XG5cbiAgICAvLyBSb2xlIG1hbmFnZW1lbnRcbiAgICBhc3luYyBnZXRTdGF0ZVNuYXBzaG90ICgpIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnNlc3Npb24uZ2V0U3RhdGVTbmFwc2hvdCgpO1xuXG4gICAgICAgIHN0YXRlLnN0b3JhZ2VzID0gYXdhaXQgdGhpcy5leGVjdXRlQ29tbWFuZChuZXcgc2VydmljZUNvbW1hbmRzLkJhY2t1cFN0b3JhZ2VzQ29tbWFuZCgpKTtcblxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgYXN5bmMgc3dpdGNoVG9DbGVhblJ1biAodXJsKSB7XG4gICAgICAgIHRoaXMuY3R4ICAgICAgICAgICAgID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5maXh0dXJlQ3R4ICAgICAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLmNvbnNvbGVNZXNzYWdlcyA9IG5ldyBCcm93c2VyQ29uc29sZU1lc3NhZ2VzKCk7XG5cbiAgICAgICAgdGhpcy5zZXNzaW9uLnVzZVN0YXRlU25hcHNob3QoU3RhdGVTbmFwc2hvdC5lbXB0eSgpKTtcblxuICAgICAgICBpZiAodGhpcy5zcGVlZCAhPT0gdGhpcy5vcHRzLnNwZWVkKSB7XG4gICAgICAgICAgICBjb25zdCBzZXRTcGVlZENvbW1hbmQgPSBuZXcgYWN0aW9uQ29tbWFuZHMuU2V0VGVzdFNwZWVkQ29tbWFuZCh7IHNwZWVkOiB0aGlzLm9wdHMuc3BlZWQgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZXhlY3V0ZUNvbW1hbmQoc2V0U3BlZWRDb21tYW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnBhZ2VMb2FkVGltZW91dCAhPT0gdGhpcy5vcHRzLnBhZ2VMb2FkVGltZW91dCkge1xuICAgICAgICAgICAgY29uc3Qgc2V0UGFnZUxvYWRUaW1lb3V0Q29tbWFuZCA9IG5ldyBhY3Rpb25Db21tYW5kcy5TZXRQYWdlTG9hZFRpbWVvdXRDb21tYW5kKHsgZHVyYXRpb246IHRoaXMub3B0cy5wYWdlTG9hZFRpbWVvdXQgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZXhlY3V0ZUNvbW1hbmQoc2V0UGFnZUxvYWRUaW1lb3V0Q29tbWFuZCk7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCB0aGlzLm5hdmlnYXRlVG9VcmwodXJsLCB0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVEaWFsb2dIYW5kbGVyKSB7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVEaWFsb2dIYW5kbGVyQ29tbWFuZCA9IG5ldyBhY3Rpb25Db21tYW5kcy5TZXROYXRpdmVEaWFsb2dIYW5kbGVyQ29tbWFuZCh7IGRpYWxvZ0hhbmRsZXI6IHsgZm46IG51bGwgfSB9KTtcblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5leGVjdXRlQ29tbWFuZChyZW1vdmVEaWFsb2dIYW5kbGVyQ29tbWFuZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBuYXZpZ2F0ZVRvVXJsICh1cmwsIGZvcmNlUmVsb2FkLCBzdGF0ZVNuYXBzaG90KSB7XG4gICAgICAgIGNvbnN0IG5hdmlnYXRlQ29tbWFuZCA9IG5ldyBhY3Rpb25Db21tYW5kcy5OYXZpZ2F0ZVRvQ29tbWFuZCh7IHVybCwgZm9yY2VSZWxvYWQsIHN0YXRlU25hcHNob3QgfSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5leGVjdXRlQ29tbWFuZChuYXZpZ2F0ZUNvbW1hbmQpO1xuICAgIH1cblxuICAgIGFzeW5jIF9nZXRTdGF0ZVNuYXBzaG90RnJvbVJvbGUgKHJvbGUpIHtcbiAgICAgICAgY29uc3QgcHJldlBoYXNlID0gdGhpcy5waGFzZTtcblxuICAgICAgICB0aGlzLnBoYXNlID0gUEhBU0UuaW5Sb2xlSW5pdGlhbGl6ZXI7XG5cbiAgICAgICAgaWYgKHJvbGUucGhhc2UgPT09IFJPTEVfUEhBU0UudW5pbml0aWFsaXplZClcbiAgICAgICAgICAgIGF3YWl0IHJvbGUuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgICAgICBlbHNlIGlmIChyb2xlLnBoYXNlID09PSBST0xFX1BIQVNFLnBlbmRpbmdJbml0aWFsaXphdGlvbilcbiAgICAgICAgICAgIGF3YWl0IHByb21pc2lmeUV2ZW50KHJvbGUsICdpbml0aWFsaXplZCcpO1xuXG4gICAgICAgIGlmIChyb2xlLmluaXRFcnIpXG4gICAgICAgICAgICB0aHJvdyByb2xlLmluaXRFcnI7XG5cbiAgICAgICAgdGhpcy5waGFzZSA9IHByZXZQaGFzZTtcblxuICAgICAgICByZXR1cm4gcm9sZS5zdGF0ZVNuYXBzaG90O1xuICAgIH1cblxuICAgIGFzeW5jIF91c2VSb2xlIChyb2xlLCBjYWxsc2l0ZSkge1xuICAgICAgICBpZiAodGhpcy5waGFzZSA9PT0gUEhBU0UuaW5Sb2xlSW5pdGlhbGl6ZXIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgUm9sZVN3aXRjaEluUm9sZUluaXRpYWxpemVyRXJyb3IoY2FsbHNpdGUpO1xuXG4gICAgICAgIGNvbnN0IGJvb2ttYXJrID0gbmV3IFRlc3RSdW5Cb29rbWFyayh0aGlzLCByb2xlKTtcblxuICAgICAgICBhd2FpdCBib29rbWFyay5pbml0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFJvbGVJZClcbiAgICAgICAgICAgIHRoaXMudXNlZFJvbGVTdGF0ZXNbdGhpcy5jdXJyZW50Um9sZUlkXSA9IGF3YWl0IHRoaXMuZ2V0U3RhdGVTbmFwc2hvdCgpO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlU25hcHNob3QgPSB0aGlzLnVzZWRSb2xlU3RhdGVzW3JvbGUuaWRdIHx8IGF3YWl0IHRoaXMuX2dldFN0YXRlU25hcHNob3RGcm9tUm9sZShyb2xlKTtcblxuICAgICAgICB0aGlzLnNlc3Npb24udXNlU3RhdGVTbmFwc2hvdChzdGF0ZVNuYXBzaG90KTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRSb2xlSWQgPSByb2xlLmlkO1xuXG4gICAgICAgIGF3YWl0IGJvb2ttYXJrLnJlc3RvcmUoY2FsbHNpdGUsIHN0YXRlU25hcHNob3QpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEN1cnJlbnRVcmwgKCkge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IENsaWVudEZ1bmN0aW9uQnVpbGRlcigoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bmRlZiAqL1xuICAgICAgICB9LCB7IGJvdW5kVGVzdFJ1bjogdGhpcyB9KTtcblxuICAgICAgICBjb25zdCBnZXRMb2NhdGlvbiA9IGJ1aWxkZXIuZ2V0RnVuY3Rpb24oKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TG9jYXRpb24oKTtcbiAgICB9XG5cbiAgICBhc3luYyBfc3dpdGNoVG9XaW5kb3dCeVByZWRpY2F0ZSAoY29tbWFuZCkge1xuICAgICAgICBjb25zdCBjdXJyZW50V2luZG93cyA9IGF3YWl0IHRoaXMuZXhlY3V0ZUNvbW1hbmQobmV3IEdldEN1cnJlbnRXaW5kb3dzQ29tbWFuZCh7fSwgdGhpcykpO1xuXG4gICAgICAgIGNvbnN0IHdpbmRvd3MgPSBjdXJyZW50V2luZG93cy5maWx0ZXIod25kID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCh3bmQudXJsKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjb21tYW5kLmZpbmRXaW5kb3coeyB1cmwsIHRpdGxlOiB3bmQudGl0bGUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTd2l0Y2hUb1dpbmRvd1ByZWRpY2F0ZUVycm9yKGUubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghd2luZG93cy5sZW5ndGgpXG4gICAgICAgICAgICB0aHJvdyBuZXcgV2luZG93Tm90Rm91bmRFcnJvcigpO1xuXG4gICAgICAgIGlmICh3aW5kb3dzLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICB0aGlzLndhcm5pbmdMb2cuYWRkV2FybmluZyhXQVJOSU5HX01FU1NBR0UubXVsdGlwbGVXaW5kb3dzRm91bmRCeVByZWRpY2F0ZSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5leGVjdXRlQ29tbWFuZChuZXcgU3dpdGNoVG9XaW5kb3dDb21tYW5kKHsgd2luZG93SWQ6IHdpbmRvd3NbMF0uaWQgfSksIHRoaXMpO1xuICAgIH1cblxuICAgIF9kaXNjb25uZWN0IChlcnIpIHtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnREcml2ZXJUYXNrKVxuICAgICAgICAgICAgdGhpcy5fcmVqZWN0Q3VycmVudERyaXZlclRhc2soZXJyKTtcblxuICAgICAgICB0aGlzLmVtaXQoJ2Rpc2Nvbm5lY3RlZCcsIGVycik7XG5cbiAgICAgICAgZGVsZXRlIHRlc3RSdW5UcmFja2VyLmFjdGl2ZVRlc3RSdW5zW3RoaXMuc2Vzc2lvbi5pZF07XG4gICAgfVxuXG4gICAgYXN5bmMgZW1pdEFjdGlvbkV2ZW50IChldmVudE5hbWUsIGFyZ3MpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByZXZlbnRFbWl0QWN0aW9uRXZlbnRzKVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KGV2ZW50TmFtZSwgYXJncyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzTXVsdGlwbGVXaW5kb3dzQWxsb3dlZCAodGVzdFJ1bikge1xuICAgICAgICBjb25zdCB7IGRpc2FibGVNdWx0aXBsZVdpbmRvd3MsIHRlc3QsIGJyb3dzZXJDb25uZWN0aW9uIH0gPSB0ZXN0UnVuO1xuXG4gICAgICAgIHJldHVybiAhZGlzYWJsZU11bHRpcGxlV2luZG93cyAmJiAhdGVzdC5pc0xlZ2FjeSAmJiAhIWJyb3dzZXJDb25uZWN0aW9uLmFjdGl2ZVdpbmRvd0lkO1xuICAgIH1cbn1cblxuLy8gU2VydmljZSBtZXNzYWdlIGhhbmRsZXJzXG5jb25zdCBTZXJ2aWNlTWVzc2FnZXMgPSBUZXN0UnVuLnByb3RvdHlwZTtcblxuLy8gTk9URTogdGhpcyBmdW5jdGlvbiBpcyB0aW1lLWNyaXRpY2FsIGFuZCBtdXN0IHJldHVybiBBU0FQIHRvIGF2b2lkIGNsaWVudCBkaXNjb25uZWN0aW9uXG5TZXJ2aWNlTWVzc2FnZXNbQ0xJRU5UX01FU1NBR0VTLnJlYWR5XSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICB0aGlzLmRlYnVnTG9nLmRyaXZlck1lc3NhZ2UobXNnKTtcblxuICAgIGlmICh0aGlzLmRpc2Nvbm5lY3RlZClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBHZW5lcmFsRXJyb3IoUlVOVElNRV9FUlJPUlMudGVzdFJ1blJlcXVlc3RJbkRpc2Nvbm5lY3RlZEJyb3dzZXIsIHRoaXMuYnJvd3NlckNvbm5lY3Rpb24uYnJvd3NlckluZm8uYWxpYXMpKTtcblxuICAgIHRoaXMuZW1pdCgnY29ubmVjdGVkJyk7XG5cbiAgICB0aGlzLl9jbGVhclBlbmRpbmdSZXF1ZXN0KCk7XG5cbiAgICAvLyBOT1RFOiB0aGUgZHJpdmVyIHNlbmRzIHRoZSBzdGF0dXMgZm9yIHRoZSBzZWNvbmQgdGltZSBpZiBpdCBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UgYXQgdGhlXG4gICAgLy8gZmlyc3QgdHJ5LiBUaGlzIGlzIHBvc3NpYmxlIHdoZW4gdGhlIHBhZ2Ugd2FzIHVubG9hZGVkIGFmdGVyIHRoZSBkcml2ZXIgc2VudCB0aGUgc3RhdHVzLlxuICAgIGlmIChtc2cuc3RhdHVzLmlkID09PSB0aGlzLmxhc3REcml2ZXJTdGF0dXNJZClcbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdERyaXZlclN0YXR1c1Jlc3BvbnNlO1xuXG4gICAgdGhpcy5sYXN0RHJpdmVyU3RhdHVzSWQgICAgICAgPSBtc2cuc3RhdHVzLmlkO1xuICAgIHRoaXMubGFzdERyaXZlclN0YXR1c1Jlc3BvbnNlID0gdGhpcy5faGFuZGxlRHJpdmVyUmVxdWVzdChtc2cuc3RhdHVzKTtcblxuICAgIGlmICh0aGlzLmxhc3REcml2ZXJTdGF0dXNSZXNwb25zZSB8fCBtc2cuc3RhdHVzLmlzUGVuZGluZ1dpbmRvd1N3aXRjaGluZylcbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdERyaXZlclN0YXR1c1Jlc3BvbnNlO1xuXG4gICAgLy8gTk9URTogd2Ugc2VuZCBhbiBlbXB0eSByZXNwb25zZSBhZnRlciB0aGUgTUFYX1JFU1BPTlNFX0RFTEFZIHRpbWVvdXQgaXMgZXhjZWVkZWQgdG8ga2VlcCBjb25uZWN0aW9uXG4gICAgLy8gd2l0aCB0aGUgY2xpZW50IGFuZCBwcmV2ZW50IHRoZSByZXNwb25zZSB0aW1lb3V0IGV4Y2VwdGlvbiBvbiB0aGUgY2xpZW50IHNpZGVcbiAgICBjb25zdCByZXNwb25zZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX3Jlc29sdmVQZW5kaW5nUmVxdWVzdChudWxsKSwgTUFYX1JFU1BPTlNFX0RFTEFZKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3QgPSB7IHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2VUaW1lb3V0IH07XG4gICAgfSk7XG59O1xuXG5TZXJ2aWNlTWVzc2FnZXNbQ0xJRU5UX01FU1NBR0VTLnJlYWR5Rm9yQnJvd3Nlck1hbmlwdWxhdGlvbl0gPSBhc3luYyBmdW5jdGlvbiAobXNnKSB7XG4gICAgdGhpcy5kZWJ1Z0xvZy5kcml2ZXJNZXNzYWdlKG1zZyk7XG5cbiAgICBsZXQgcmVzdWx0ID0gbnVsbDtcbiAgICBsZXQgZXJyb3IgID0gbnVsbDtcblxuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IHRoaXMuYnJvd3Nlck1hbmlwdWxhdGlvblF1ZXVlLmV4ZWN1dGVQZW5kaW5nTWFuaXB1bGF0aW9uKG1zZyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgZXJyb3IgPSBlcnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcmVzdWx0LCBlcnJvciB9O1xufTtcblxuU2VydmljZU1lc3NhZ2VzW0NMSUVOVF9NRVNTQUdFUy53YWl0Rm9yRmlsZURvd25sb2FkXSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICB0aGlzLmRlYnVnTG9nLmRyaXZlck1lc3NhZ2UobXNnKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZmlsZURvd25sb2FkaW5nSGFuZGxlZCkge1xuICAgICAgICAgICAgdGhpcy5maWxlRG93bmxvYWRpbmdIYW5kbGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZVdhaXRGb3JGaWxlRG93bmxvYWRpbmdQcm9taXNlID0gcmVzb2x2ZTtcbiAgICB9KTtcbn07XG4iXX0=