"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
const types_1 = require("../types");
// Base
//--------------------------------------------------------------------
class TestRunErrorBase {
    constructor(code) {
        this.code = code;
        this.isTestCafeError = true;
        this.callsite = null;
    }
}
class ActionOptionErrorBase extends TestRunErrorBase {
    constructor(code, optionName, actualValue) {
        super(code);
        this.optionName = optionName;
        this.actualValue = actualValue;
    }
}
class ActionArgumentErrorBase extends TestRunErrorBase {
    constructor(code, argumentName, actualValue) {
        super(code);
        this.argumentName = argumentName;
        this.actualValue = actualValue;
    }
}
// Synchronization errors
//--------------------------------------------------------------------
class MissingAwaitError extends TestRunErrorBase {
    constructor(callsite) {
        super(types_1.TEST_RUN_ERRORS.missingAwaitError);
        this.callsite = callsite;
    }
}
exports.MissingAwaitError = MissingAwaitError;
// Client function errors
//--------------------------------------------------------------------
class ClientFunctionExecutionInterruptionError extends TestRunErrorBase {
    constructor(instantiationCallsiteName) {
        super(types_1.TEST_RUN_ERRORS.clientFunctionExecutionInterruptionError);
        this.instantiationCallsiteName = instantiationCallsiteName;
    }
}
exports.ClientFunctionExecutionInterruptionError = ClientFunctionExecutionInterruptionError;
class DomNodeClientFunctionResultError extends TestRunErrorBase {
    constructor(instantiationCallsiteName) {
        super(types_1.TEST_RUN_ERRORS.domNodeClientFunctionResultError);
        this.instantiationCallsiteName = instantiationCallsiteName;
    }
}
exports.DomNodeClientFunctionResultError = DomNodeClientFunctionResultError;
// Selector errors
//--------------------------------------------------------------------
class SelectorErrorBase extends TestRunErrorBase {
    constructor(code, { apiFnChain, apiFnIndex }) {
        super(code);
        this.apiFnChain = apiFnChain;
        this.apiFnIndex = apiFnIndex;
    }
}
class InvalidSelectorResultError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.invalidSelectorResultError);
    }
}
exports.InvalidSelectorResultError = InvalidSelectorResultError;
class CannotObtainInfoForElementSpecifiedBySelectorError extends SelectorErrorBase {
    constructor(callsite, apiFnArgs) {
        super(types_1.TEST_RUN_ERRORS.cannotObtainInfoForElementSpecifiedBySelectorError, apiFnArgs);
        this.callsite = callsite;
    }
}
exports.CannotObtainInfoForElementSpecifiedBySelectorError = CannotObtainInfoForElementSpecifiedBySelectorError;
// Page errors
//--------------------------------------------------------------------
class PageLoadError extends TestRunErrorBase {
    constructor(errMsg, url) {
        super(types_1.TEST_RUN_ERRORS.pageLoadError);
        this.url = url;
        this.errMsg = errMsg;
    }
}
exports.PageLoadError = PageLoadError;
// Uncaught errors
//--------------------------------------------------------------------
class UncaughtErrorOnPage extends TestRunErrorBase {
    constructor(errStack, pageDestUrl) {
        super(types_1.TEST_RUN_ERRORS.uncaughtErrorOnPage);
        this.errStack = errStack;
        this.pageDestUrl = pageDestUrl;
    }
}
exports.UncaughtErrorOnPage = UncaughtErrorOnPage;
class UncaughtErrorInTestCode extends TestRunErrorBase {
    constructor(err, callsite) {
        super(types_1.TEST_RUN_ERRORS.uncaughtErrorInTestCode);
        this.errMsg = String(err.rawMessage || err);
        this.callsite = err.callsite || callsite;
        this.originError = err;
    }
}
exports.UncaughtErrorInTestCode = UncaughtErrorInTestCode;
class UncaughtNonErrorObjectInTestCode extends TestRunErrorBase {
    constructor(obj) {
        super(types_1.TEST_RUN_ERRORS.uncaughtNonErrorObjectInTestCode);
        this.objType = typeof obj;
        this.objStr = String(obj);
    }
}
exports.UncaughtNonErrorObjectInTestCode = UncaughtNonErrorObjectInTestCode;
class UncaughtErrorInClientFunctionCode extends TestRunErrorBase {
    constructor(instantiationCallsiteName, err) {
        super(types_1.TEST_RUN_ERRORS.uncaughtErrorInClientFunctionCode);
        this.errMsg = String(err);
        this.instantiationCallsiteName = instantiationCallsiteName;
    }
}
exports.UncaughtErrorInClientFunctionCode = UncaughtErrorInClientFunctionCode;
class UncaughtErrorInCustomDOMPropertyCode extends TestRunErrorBase {
    constructor(instantiationCallsiteName, err, prop) {
        super(types_1.TEST_RUN_ERRORS.uncaughtErrorInCustomDOMPropertyCode, err, prop);
        this.errMsg = String(err);
        this.property = prop;
        this.instantiationCallsiteName = instantiationCallsiteName;
    }
}
exports.UncaughtErrorInCustomDOMPropertyCode = UncaughtErrorInCustomDOMPropertyCode;
class UnhandledPromiseRejectionError extends TestRunErrorBase {
    constructor(err) {
        super(types_1.TEST_RUN_ERRORS.unhandledPromiseRejection);
        this.errMsg = String(err);
    }
}
exports.UnhandledPromiseRejectionError = UnhandledPromiseRejectionError;
class UncaughtExceptionError extends TestRunErrorBase {
    constructor(err) {
        super(types_1.TEST_RUN_ERRORS.uncaughtException);
        this.errMsg = String(err);
    }
}
exports.UncaughtExceptionError = UncaughtExceptionError;
class UncaughtErrorInCustomClientScriptCode extends TestRunErrorBase {
    constructor(err) {
        super(types_1.TEST_RUN_ERRORS.uncaughtErrorInCustomClientScriptCode);
        this.errMsg = String(err);
    }
}
exports.UncaughtErrorInCustomClientScriptCode = UncaughtErrorInCustomClientScriptCode;
class UncaughtErrorInCustomClientScriptLoadedFromModule extends TestRunErrorBase {
    constructor(err, moduleName) {
        super(types_1.TEST_RUN_ERRORS.uncaughtErrorInCustomClientScriptCodeLoadedFromModule);
        this.errMsg = String(err);
        this.moduleName = moduleName;
    }
}
exports.UncaughtErrorInCustomClientScriptLoadedFromModule = UncaughtErrorInCustomClientScriptLoadedFromModule;
// Assertion errors
//--------------------------------------------------------------------
class ExternalAssertionLibraryError extends TestRunErrorBase {
    constructor(err, callsite) {
        super(types_1.TEST_RUN_ERRORS.externalAssertionLibraryError);
        this.errMsg = String(err);
        this.callsite = callsite;
    }
}
exports.ExternalAssertionLibraryError = ExternalAssertionLibraryError;
class AssertionExecutableArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, argumentValue, err, isAPIError) {
        super(types_1.TEST_RUN_ERRORS.assertionExecutableArgumentError, argumentName, argumentValue);
        this.errMsg = isAPIError ? err.rawMessage : err.message;
        this.originError = err;
    }
}
exports.AssertionExecutableArgumentError = AssertionExecutableArgumentError;
class AssertionWithoutMethodCallError extends TestRunErrorBase {
    constructor(callsite) {
        super(types_1.TEST_RUN_ERRORS.assertionWithoutMethodCallError);
        this.callsite = callsite;
    }
}
exports.AssertionWithoutMethodCallError = AssertionWithoutMethodCallError;
class AssertionUnawaitedPromiseError extends TestRunErrorBase {
    constructor(callsite) {
        super(types_1.TEST_RUN_ERRORS.assertionUnawaitedPromiseError);
        this.callsite = callsite;
    }
}
exports.AssertionUnawaitedPromiseError = AssertionUnawaitedPromiseError;
// Action parameters errors
//--------------------------------------------------------------------
// Options errors
class ActionIntegerOptionError extends ActionOptionErrorBase {
    constructor(optionName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionIntegerOptionError, optionName, actualValue);
    }
}
exports.ActionIntegerOptionError = ActionIntegerOptionError;
class ActionPositiveIntegerOptionError extends ActionOptionErrorBase {
    constructor(optionName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionPositiveIntegerOptionError, optionName, actualValue);
    }
}
exports.ActionPositiveIntegerOptionError = ActionPositiveIntegerOptionError;
class ActionBooleanOptionError extends ActionOptionErrorBase {
    constructor(optionName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionBooleanOptionError, optionName, actualValue);
    }
}
exports.ActionBooleanOptionError = ActionBooleanOptionError;
class ActionBooleanArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionBooleanArgumentError, argumentName, actualValue);
    }
}
exports.ActionBooleanArgumentError = ActionBooleanArgumentError;
class ActionSpeedOptionError extends ActionOptionErrorBase {
    constructor(optionName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionSpeedOptionError, optionName, actualValue);
    }
}
exports.ActionSpeedOptionError = ActionSpeedOptionError;
class ActionOptionsTypeError extends TestRunErrorBase {
    constructor(actualType) {
        super(types_1.TEST_RUN_ERRORS.actionOptionsTypeError);
        this.actualType = actualType;
    }
}
exports.ActionOptionsTypeError = ActionOptionsTypeError;
// Arguments errors
class ActionStringArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionStringArgumentError, argumentName, actualValue);
    }
}
exports.ActionStringArgumentError = ActionStringArgumentError;
class ActionNullableStringArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionNullableStringArgumentError, argumentName, actualValue);
    }
}
exports.ActionNullableStringArgumentError = ActionNullableStringArgumentError;
class ActionIntegerArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionIntegerArgumentError, argumentName, actualValue);
    }
}
exports.ActionIntegerArgumentError = ActionIntegerArgumentError;
class ActionRoleArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionRoleArgumentError, argumentName, actualValue);
    }
}
exports.ActionRoleArgumentError = ActionRoleArgumentError;
class ActionPositiveIntegerArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionPositiveIntegerArgumentError, argumentName, actualValue);
    }
}
exports.ActionPositiveIntegerArgumentError = ActionPositiveIntegerArgumentError;
class ActionStringOrStringArrayArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.actionStringOrStringArrayArgumentError, argumentName, actualValue);
    }
}
exports.ActionStringOrStringArrayArgumentError = ActionStringOrStringArrayArgumentError;
class ActionStringArrayElementError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue, elementIndex) {
        super(types_1.TEST_RUN_ERRORS.actionStringArrayElementError, argumentName, actualValue);
        this.elementIndex = elementIndex;
    }
}
exports.ActionStringArrayElementError = ActionStringArrayElementError;
class SetTestSpeedArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(types_1.TEST_RUN_ERRORS.setTestSpeedArgumentError, argumentName, actualValue);
    }
}
exports.SetTestSpeedArgumentError = SetTestSpeedArgumentError;
class ActionUnsupportedDeviceTypeError extends ActionArgumentErrorBase {
    constructor(argumentName, argumentValue) {
        super(types_1.TEST_RUN_ERRORS.actionUnsupportedDeviceTypeError, argumentName, argumentValue);
    }
}
exports.ActionUnsupportedDeviceTypeError = ActionUnsupportedDeviceTypeError;
// Selector errors
class ActionSelectorError extends TestRunErrorBase {
    constructor(selectorName, err, isAPIError) {
        super(types_1.TEST_RUN_ERRORS.actionSelectorError);
        this.selectorName = selectorName;
        this.errMsg = isAPIError ? err.rawMessage : err.message;
        this.originError = err;
    }
}
exports.ActionSelectorError = ActionSelectorError;
// Action execution errors
//--------------------------------------------------------------------
class ActionElementNotFoundError extends SelectorErrorBase {
    constructor(apiFnArgs) {
        super(types_1.TEST_RUN_ERRORS.actionElementNotFoundError, apiFnArgs);
    }
}
exports.ActionElementNotFoundError = ActionElementNotFoundError;
class ActionElementIsInvisibleError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.actionElementIsInvisibleError);
    }
}
exports.ActionElementIsInvisibleError = ActionElementIsInvisibleError;
class ActionSelectorMatchesWrongNodeTypeError extends TestRunErrorBase {
    constructor(nodeDescription) {
        super(types_1.TEST_RUN_ERRORS.actionSelectorMatchesWrongNodeTypeError);
        this.nodeDescription = nodeDescription;
    }
}
exports.ActionSelectorMatchesWrongNodeTypeError = ActionSelectorMatchesWrongNodeTypeError;
class ActionAdditionalElementNotFoundError extends SelectorErrorBase {
    constructor(argumentName, apiFnArgs) {
        super(types_1.TEST_RUN_ERRORS.actionAdditionalElementNotFoundError, apiFnArgs);
        this.argumentName = argumentName;
    }
}
exports.ActionAdditionalElementNotFoundError = ActionAdditionalElementNotFoundError;
class ActionAdditionalElementIsInvisibleError extends TestRunErrorBase {
    constructor(argumentName) {
        super(types_1.TEST_RUN_ERRORS.actionAdditionalElementIsInvisibleError);
        this.argumentName = argumentName;
    }
}
exports.ActionAdditionalElementIsInvisibleError = ActionAdditionalElementIsInvisibleError;
class ActionAdditionalSelectorMatchesWrongNodeTypeError extends TestRunErrorBase {
    constructor(argumentName, nodeDescription) {
        super(types_1.TEST_RUN_ERRORS.actionAdditionalSelectorMatchesWrongNodeTypeError);
        this.argumentName = argumentName;
        this.nodeDescription = nodeDescription;
    }
}
exports.ActionAdditionalSelectorMatchesWrongNodeTypeError = ActionAdditionalSelectorMatchesWrongNodeTypeError;
class ActionElementNonEditableError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.actionElementNonEditableError);
    }
}
exports.ActionElementNonEditableError = ActionElementNonEditableError;
class ActionElementNotTextAreaError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.actionElementNotTextAreaError);
    }
}
exports.ActionElementNotTextAreaError = ActionElementNotTextAreaError;
class ActionElementNonContentEditableError extends TestRunErrorBase {
    constructor(argumentName) {
        super(types_1.TEST_RUN_ERRORS.actionElementNonContentEditableError);
        this.argumentName = argumentName;
    }
}
exports.ActionElementNonContentEditableError = ActionElementNonContentEditableError;
class ActionRootContainerNotFoundError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.actionRootContainerNotFoundError);
    }
}
exports.ActionRootContainerNotFoundError = ActionRootContainerNotFoundError;
class ActionIncorrectKeysError extends TestRunErrorBase {
    constructor(argumentName) {
        super(types_1.TEST_RUN_ERRORS.actionIncorrectKeysError);
        this.argumentName = argumentName;
    }
}
exports.ActionIncorrectKeysError = ActionIncorrectKeysError;
class ActionCannotFindFileToUploadError extends TestRunErrorBase {
    constructor(filePaths, scannedFilePaths) {
        super(types_1.TEST_RUN_ERRORS.actionCannotFindFileToUploadError);
        this.filePaths = filePaths;
        this.scannedFilePaths = scannedFilePaths;
    }
}
exports.ActionCannotFindFileToUploadError = ActionCannotFindFileToUploadError;
class ActionElementIsNotFileInputError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.actionElementIsNotFileInputError);
    }
}
exports.ActionElementIsNotFileInputError = ActionElementIsNotFileInputError;
class ActionInvalidScrollTargetError extends TestRunErrorBase {
    constructor(scrollTargetXValid, scrollTargetYValid) {
        super(types_1.TEST_RUN_ERRORS.actionInvalidScrollTargetError);
        if (!scrollTargetXValid) {
            if (!scrollTargetYValid)
                this.properties = 'scrollTargetX and scrollTargetY properties';
            else
                this.properties = 'scrollTargetX property';
        }
        else
            this.properties = 'scrollTargetY property';
    }
}
exports.ActionInvalidScrollTargetError = ActionInvalidScrollTargetError;
class UncaughtErrorInCustomScript extends TestRunErrorBase {
    constructor(err, expression, line, column, callsite) {
        super(types_1.TEST_RUN_ERRORS.uncaughtErrorInCustomScript);
        this.callsite = callsite;
        this.expression = expression;
        this.line = line;
        this.column = column;
        this.originError = err;
        this.errMsg = err.message || String(err);
    }
}
exports.UncaughtErrorInCustomScript = UncaughtErrorInCustomScript;
class UncaughtTestCafeErrorInCustomScript extends TestRunErrorBase {
    constructor(err, expression, line, column, callsite) {
        super(types_1.TEST_RUN_ERRORS.uncaughtTestCafeErrorInCustomScript);
        this.callsite = callsite;
        this.expression = expression;
        this.line = line;
        this.column = column;
        this.originError = err;
        this.errCallsite = err.callsite;
    }
}
exports.UncaughtTestCafeErrorInCustomScript = UncaughtTestCafeErrorInCustomScript;
class WindowDimensionsOverflowError extends TestRunErrorBase {
    constructor(callsite) {
        super(types_1.TEST_RUN_ERRORS.windowDimensionsOverflowError);
        this.callsite = callsite;
    }
}
exports.WindowDimensionsOverflowError = WindowDimensionsOverflowError;
class InvalidElementScreenshotDimensionsError extends TestRunErrorBase {
    constructor(width, height) {
        super(types_1.TEST_RUN_ERRORS.invalidElementScreenshotDimensionsError);
        const widthIsInvalid = width <= 0;
        const heightIsInvalid = height <= 0;
        if (widthIsInvalid) {
            if (heightIsInvalid) {
                this.verb = 'are';
                this.dimensions = 'width and height';
            }
            else {
                this.verb = 'is';
                this.dimensions = 'width';
            }
        }
        else {
            this.verb = 'is';
            this.dimensions = 'height';
        }
    }
}
exports.InvalidElementScreenshotDimensionsError = InvalidElementScreenshotDimensionsError;
class ForbiddenCharactersInScreenshotPathError extends TestRunErrorBase {
    constructor(screenshotPath, forbiddenCharsList) {
        super(types_1.TEST_RUN_ERRORS.forbiddenCharactersInScreenshotPathError);
        this.screenshotPath = screenshotPath;
        this.forbiddenCharsList = forbiddenCharsList;
    }
}
exports.ForbiddenCharactersInScreenshotPathError = ForbiddenCharactersInScreenshotPathError;
class RoleSwitchInRoleInitializerError extends TestRunErrorBase {
    constructor(callsite) {
        super(types_1.TEST_RUN_ERRORS.roleSwitchInRoleInitializerError);
        this.callsite = callsite;
    }
}
exports.RoleSwitchInRoleInitializerError = RoleSwitchInRoleInitializerError;
// Iframe errors
class ActionElementNotIframeError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.actionElementNotIframeError);
    }
}
exports.ActionElementNotIframeError = ActionElementNotIframeError;
class ActionIframeIsNotLoadedError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.actionIframeIsNotLoadedError);
    }
}
exports.ActionIframeIsNotLoadedError = ActionIframeIsNotLoadedError;
class CurrentIframeIsNotLoadedError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.currentIframeIsNotLoadedError);
    }
}
exports.CurrentIframeIsNotLoadedError = CurrentIframeIsNotLoadedError;
class ChildWindowNotFoundError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.childWindowNotFoundError);
    }
}
exports.ChildWindowNotFoundError = ChildWindowNotFoundError;
class ChildWindowIsNotLoadedError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.childWindowIsNotLoadedError);
    }
}
exports.ChildWindowIsNotLoadedError = ChildWindowIsNotLoadedError;
class CannotSwitchToWindowError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.cannotSwitchToWindowError);
    }
}
exports.CannotSwitchToWindowError = CannotSwitchToWindowError;
class CloseChildWindowError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.closeChildWindowError);
    }
}
exports.CloseChildWindowError = CloseChildWindowError;
class CurrentIframeNotFoundError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.currentIframeNotFoundError);
    }
}
exports.CurrentIframeNotFoundError = CurrentIframeNotFoundError;
class CurrentIframeIsInvisibleError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.currentIframeIsInvisibleError);
    }
}
exports.CurrentIframeIsInvisibleError = CurrentIframeIsInvisibleError;
// Native dialog errors
class NativeDialogNotHandledError extends TestRunErrorBase {
    constructor(dialogType, url) {
        super(types_1.TEST_RUN_ERRORS.nativeDialogNotHandledError);
        this.dialogType = dialogType;
        this.pageUrl = url;
    }
}
exports.NativeDialogNotHandledError = NativeDialogNotHandledError;
class UncaughtErrorInNativeDialogHandler extends TestRunErrorBase {
    constructor(dialogType, errMsg, url) {
        super(types_1.TEST_RUN_ERRORS.uncaughtErrorInNativeDialogHandler);
        this.dialogType = dialogType;
        this.errMsg = errMsg;
        this.pageUrl = url;
    }
}
exports.UncaughtErrorInNativeDialogHandler = UncaughtErrorInNativeDialogHandler;
class SetNativeDialogHandlerCodeWrongTypeError extends TestRunErrorBase {
    constructor(actualType) {
        super(types_1.TEST_RUN_ERRORS.setNativeDialogHandlerCodeWrongTypeError);
        this.actualType = actualType;
    }
}
exports.SetNativeDialogHandlerCodeWrongTypeError = SetNativeDialogHandlerCodeWrongTypeError;
class RequestHookUnhandledError extends TestRunErrorBase {
    constructor(err, hookClassName, methodName) {
        super(types_1.TEST_RUN_ERRORS.requestHookUnhandledError);
        this.errMsg = String(err);
        this.hookClassName = hookClassName;
        this.methodName = methodName;
    }
}
exports.RequestHookUnhandledError = RequestHookUnhandledError;
class RequestHookNotImplementedMethodError extends TestRunErrorBase {
    constructor(methodName, hookClassName) {
        super(types_1.TEST_RUN_ERRORS.requestHookNotImplementedError);
        this.methodName = methodName;
        this.hookClassName = hookClassName;
    }
}
exports.RequestHookNotImplementedMethodError = RequestHookNotImplementedMethodError;
class ChildWindowClosedBeforeSwitchingError extends TestRunErrorBase {
    constructor() {
        super(types_1.TEST_RUN_ERRORS.childWindowClosedBeforeSwitchingError);
    }
}
exports.ChildWindowClosedBeforeSwitchingError = ChildWindowClosedBeforeSwitchingError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXJyb3JzL3Rlc3QtcnVuL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0VBQWdFO0FBQ2hFLGdFQUFnRTtBQUNoRSwrQ0FBK0M7QUFDL0MsZ0VBQWdFO0FBQ2hFLG9DQUEyQztBQUUzQyxPQUFPO0FBQ1Asc0VBQXNFO0FBQ3RFLE1BQU0sZ0JBQWdCO0lBQ2xCLFlBQWEsSUFBSTtRQUNiLElBQUksQ0FBQyxJQUFJLEdBQWMsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQVUsSUFBSSxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQUVELE1BQU0scUJBQXNCLFNBQVEsZ0JBQWdCO0lBQ2hELFlBQWEsSUFBSSxFQUFFLFVBQVUsRUFBRSxXQUFXO1FBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVaLElBQUksQ0FBQyxVQUFVLEdBQUksVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQUVELE1BQU0sdUJBQXdCLFNBQVEsZ0JBQWdCO0lBQ2xELFlBQWEsSUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXO1FBQ3hDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVaLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUksV0FBVyxDQUFDO0lBQ3BDLENBQUM7Q0FDSjtBQUVELHlCQUF5QjtBQUN6QixzRUFBc0U7QUFDdEUsTUFBYSxpQkFBa0IsU0FBUSxnQkFBZ0I7SUFDbkQsWUFBYSxRQUFRO1FBQ2pCLEtBQUssQ0FBQyx1QkFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztDQUNK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LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBXQVJOSU5HOiB0aGlzIGZpbGUgaXMgdXNlZCBieSBib3RoIHRoZSBjbGllbnQgYW5kIHRoZSBzZXJ2ZXIuXG4vLyBEbyBub3QgdXNlIGFueSBicm93c2VyIG9yIG5vZGUtc3BlY2lmaWMgQVBJIVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuaW1wb3J0IHsgVEVTVF9SVU5fRVJST1JTIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyBCYXNlXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoY29kZSkge1xuICAgICAgICB0aGlzLmNvZGUgICAgICAgICAgICA9IGNvZGU7XG4gICAgICAgIHRoaXMuaXNUZXN0Q2FmZUVycm9yID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jYWxsc2l0ZSAgICAgICAgPSBudWxsO1xuICAgIH1cbn1cblxuY2xhc3MgQWN0aW9uT3B0aW9uRXJyb3JCYXNlIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGNvZGUsIG9wdGlvbk5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKGNvZGUpO1xuXG4gICAgICAgIHRoaXMub3B0aW9uTmFtZSAgPSBvcHRpb25OYW1lO1xuICAgICAgICB0aGlzLmFjdHVhbFZhbHVlID0gYWN0dWFsVmFsdWU7XG4gICAgfVxufVxuXG5jbGFzcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChjb2RlLCBhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKGNvZGUpO1xuXG4gICAgICAgIHRoaXMuYXJndW1lbnROYW1lID0gYXJndW1lbnROYW1lO1xuICAgICAgICB0aGlzLmFjdHVhbFZhbHVlICA9IGFjdHVhbFZhbHVlO1xuICAgIH1cbn1cblxuLy8gU3luY2hyb25pemF0aW9uIGVycm9yc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIE1pc3NpbmdBd2FpdEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGNhbGxzaXRlKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5taXNzaW5nQXdhaXRFcnJvcik7XG5cbiAgICAgICAgdGhpcy5jYWxsc2l0ZSA9IGNhbGxzaXRlO1xuICAgIH1cbn1cblxuXG4vLyBDbGllbnQgZnVuY3Rpb24gZXJyb3JzXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgQ2xpZW50RnVuY3Rpb25FeGVjdXRpb25JbnRlcnJ1cHRpb25FcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5jbGllbnRGdW5jdGlvbkV4ZWN1dGlvbkludGVycnVwdGlvbkVycm9yKTtcblxuICAgICAgICB0aGlzLmluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWUgPSBpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvbU5vZGVDbGllbnRGdW5jdGlvblJlc3VsdEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmRvbU5vZGVDbGllbnRGdW5jdGlvblJlc3VsdEVycm9yKTtcblxuICAgICAgICB0aGlzLmluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWUgPSBpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lO1xuICAgIH1cbn1cblxuLy8gU2VsZWN0b3IgZXJyb3JzXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBTZWxlY3RvckVycm9yQmFzZSBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChjb2RlLCB7IGFwaUZuQ2hhaW4sIGFwaUZuSW5kZXggfSkge1xuICAgICAgICBzdXBlcihjb2RlKTtcblxuICAgICAgICB0aGlzLmFwaUZuQ2hhaW4gPSBhcGlGbkNoYWluO1xuICAgICAgICB0aGlzLmFwaUZuSW5kZXggPSBhcGlGbkluZGV4O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludmFsaWRTZWxlY3RvclJlc3VsdEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuaW52YWxpZFNlbGVjdG9yUmVzdWx0RXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhbm5vdE9idGFpbkluZm9Gb3JFbGVtZW50U3BlY2lmaWVkQnlTZWxlY3RvckVycm9yIGV4dGVuZHMgU2VsZWN0b3JFcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChjYWxsc2l0ZSwgYXBpRm5BcmdzKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5jYW5ub3RPYnRhaW5JbmZvRm9yRWxlbWVudFNwZWNpZmllZEJ5U2VsZWN0b3JFcnJvciwgYXBpRm5BcmdzKTtcblxuICAgICAgICB0aGlzLmNhbGxzaXRlID0gY2FsbHNpdGU7XG4gICAgfVxufVxuXG4vLyBQYWdlIGVycm9yc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIFBhZ2VMb2FkRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoZXJyTXNnLCB1cmwpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLnBhZ2VMb2FkRXJyb3IpO1xuXG4gICAgICAgIHRoaXMudXJsICAgID0gdXJsO1xuICAgICAgICB0aGlzLmVyck1zZyA9IGVyck1zZztcbiAgICB9XG59XG5cblxuLy8gVW5jYXVnaHQgZXJyb3JzXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgVW5jYXVnaHRFcnJvck9uUGFnZSBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChlcnJTdGFjaywgcGFnZURlc3RVcmwpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLnVuY2F1Z2h0RXJyb3JPblBhZ2UpO1xuXG4gICAgICAgIHRoaXMuZXJyU3RhY2sgICAgPSBlcnJTdGFjaztcbiAgICAgICAgdGhpcy5wYWdlRGVzdFVybCA9IHBhZ2VEZXN0VXJsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuY2F1Z2h0RXJyb3JJblRlc3RDb2RlIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGVyciwgY2FsbHNpdGUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLnVuY2F1Z2h0RXJyb3JJblRlc3RDb2RlKTtcblxuICAgICAgICB0aGlzLmVyck1zZyAgICAgID0gU3RyaW5nKGVyci5yYXdNZXNzYWdlIHx8IGVycik7XG4gICAgICAgIHRoaXMuY2FsbHNpdGUgICAgPSBlcnIuY2FsbHNpdGUgfHwgY2FsbHNpdGU7XG4gICAgICAgIHRoaXMub3JpZ2luRXJyb3IgPSBlcnI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5jYXVnaHROb25FcnJvck9iamVjdEluVGVzdENvZGUgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAob2JqKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy51bmNhdWdodE5vbkVycm9yT2JqZWN0SW5UZXN0Q29kZSk7XG5cbiAgICAgICAgdGhpcy5vYmpUeXBlID0gdHlwZW9mIG9iajtcbiAgICAgICAgdGhpcy5vYmpTdHIgID0gU3RyaW5nKG9iaik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5jYXVnaHRFcnJvckluQ2xpZW50RnVuY3Rpb25Db2RlIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWUsIGVycikge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMudW5jYXVnaHRFcnJvckluQ2xpZW50RnVuY3Rpb25Db2RlKTtcblxuICAgICAgICB0aGlzLmVyck1zZyAgICAgICAgICAgICAgICAgICAgPSBTdHJpbmcoZXJyKTtcbiAgICAgICAgdGhpcy5pbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lID0gaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmNhdWdodEVycm9ySW5DdXN0b21ET01Qcm9wZXJ0eUNvZGUgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZSwgZXJyLCBwcm9wKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy51bmNhdWdodEVycm9ySW5DdXN0b21ET01Qcm9wZXJ0eUNvZGUsIGVyciwgcHJvcCk7XG5cbiAgICAgICAgdGhpcy5lcnJNc2cgICAgICAgICAgICAgICAgICAgID0gU3RyaW5nKGVycik7XG4gICAgICAgIHRoaXMucHJvcGVydHkgICAgICAgICAgICAgICAgICA9IHByb3A7XG4gICAgICAgIHRoaXMuaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZSA9IGluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbkVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGVycikge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMudW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbik7XG5cbiAgICAgICAgdGhpcy5lcnJNc2cgPSBTdHJpbmcoZXJyKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmNhdWdodEV4Y2VwdGlvbkVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGVycikge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMudW5jYXVnaHRFeGNlcHRpb24pO1xuXG4gICAgICAgIHRoaXMuZXJyTXNnID0gU3RyaW5nKGVycik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5jYXVnaHRFcnJvckluQ3VzdG9tQ2xpZW50U2NyaXB0Q29kZSBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChlcnIpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLnVuY2F1Z2h0RXJyb3JJbkN1c3RvbUNsaWVudFNjcmlwdENvZGUpO1xuXG4gICAgICAgIHRoaXMuZXJyTXNnID0gU3RyaW5nKGVycik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5jYXVnaHRFcnJvckluQ3VzdG9tQ2xpZW50U2NyaXB0TG9hZGVkRnJvbU1vZHVsZSBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChlcnIsIG1vZHVsZU5hbWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLnVuY2F1Z2h0RXJyb3JJbkN1c3RvbUNsaWVudFNjcmlwdENvZGVMb2FkZWRGcm9tTW9kdWxlKTtcblxuICAgICAgICB0aGlzLmVyck1zZyAgICAgPSBTdHJpbmcoZXJyKTtcbiAgICAgICAgdGhpcy5tb2R1bGVOYW1lID0gbW9kdWxlTmFtZTtcbiAgICB9XG59XG5cblxuLy8gQXNzZXJ0aW9uIGVycm9yc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIEV4dGVybmFsQXNzZXJ0aW9uTGlicmFyeUVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGVyciwgY2FsbHNpdGUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmV4dGVybmFsQXNzZXJ0aW9uTGlicmFyeUVycm9yKTtcblxuICAgICAgICB0aGlzLmVyck1zZyAgID0gU3RyaW5nKGVycik7XG4gICAgICAgIHRoaXMuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NlcnRpb25FeGVjdXRhYmxlQXJndW1lbnRFcnJvciBleHRlbmRzIEFjdGlvbkFyZ3VtZW50RXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lLCBhcmd1bWVudFZhbHVlLCBlcnIsIGlzQVBJRXJyb3IpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFzc2VydGlvbkV4ZWN1dGFibGVBcmd1bWVudEVycm9yLCBhcmd1bWVudE5hbWUsIGFyZ3VtZW50VmFsdWUpO1xuXG4gICAgICAgIHRoaXMuZXJyTXNnICAgICAgPSBpc0FQSUVycm9yID8gZXJyLnJhd01lc3NhZ2UgOiBlcnIubWVzc2FnZTtcbiAgICAgICAgdGhpcy5vcmlnaW5FcnJvciA9IGVycjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NlcnRpb25XaXRob3V0TWV0aG9kQ2FsbEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGNhbGxzaXRlKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hc3NlcnRpb25XaXRob3V0TWV0aG9kQ2FsbEVycm9yKTtcblxuICAgICAgICB0aGlzLmNhbGxzaXRlID0gY2FsbHNpdGU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXNzZXJ0aW9uVW5hd2FpdGVkUHJvbWlzZUVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGNhbGxzaXRlKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hc3NlcnRpb25VbmF3YWl0ZWRQcm9taXNlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICB9XG59XG5cbi8vIEFjdGlvbiBwYXJhbWV0ZXJzIGVycm9yc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3B0aW9ucyBlcnJvcnNcbmV4cG9ydCBjbGFzcyBBY3Rpb25JbnRlZ2VyT3B0aW9uRXJyb3IgZXh0ZW5kcyBBY3Rpb25PcHRpb25FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChvcHRpb25OYW1lLCBhY3R1YWxWYWx1ZSkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuYWN0aW9uSW50ZWdlck9wdGlvbkVycm9yLCBvcHRpb25OYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uUG9zaXRpdmVJbnRlZ2VyT3B0aW9uRXJyb3IgZXh0ZW5kcyBBY3Rpb25PcHRpb25FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChvcHRpb25OYW1lLCBhY3R1YWxWYWx1ZSkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuYWN0aW9uUG9zaXRpdmVJbnRlZ2VyT3B0aW9uRXJyb3IsIG9wdGlvbk5hbWUsIGFjdHVhbFZhbHVlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25Cb29sZWFuT3B0aW9uRXJyb3IgZXh0ZW5kcyBBY3Rpb25PcHRpb25FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChvcHRpb25OYW1lLCBhY3R1YWxWYWx1ZSkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuYWN0aW9uQm9vbGVhbk9wdGlvbkVycm9yLCBvcHRpb25OYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uQm9vbGVhbkFyZ3VtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbkJvb2xlYW5Bcmd1bWVudEVycm9yLCBhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25TcGVlZE9wdGlvbkVycm9yIGV4dGVuZHMgQWN0aW9uT3B0aW9uRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAob3B0aW9uTmFtZSwgYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvblNwZWVkT3B0aW9uRXJyb3IsIG9wdGlvbk5hbWUsIGFjdHVhbFZhbHVlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25PcHRpb25zVHlwZUVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFjdHVhbFR5cGUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbk9wdGlvbnNUeXBlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuYWN0dWFsVHlwZSA9IGFjdHVhbFR5cGU7XG4gICAgfVxufVxuXG5cbi8vIEFyZ3VtZW50cyBlcnJvcnNcbmV4cG9ydCBjbGFzcyBBY3Rpb25TdHJpbmdBcmd1bWVudEVycm9yIGV4dGVuZHMgQWN0aW9uQXJndW1lbnRFcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hY3Rpb25TdHJpbmdBcmd1bWVudEVycm9yLCBhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25OdWxsYWJsZVN0cmluZ0FyZ3VtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbk51bGxhYmxlU3RyaW5nQXJndW1lbnRFcnJvciwgYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uSW50ZWdlckFyZ3VtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbkludGVnZXJBcmd1bWVudEVycm9yLCBhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25Sb2xlQXJndW1lbnRFcnJvciBleHRlbmRzIEFjdGlvbkFyZ3VtZW50RXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuYWN0aW9uUm9sZUFyZ3VtZW50RXJyb3IsIGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvblBvc2l0aXZlSW50ZWdlckFyZ3VtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvblBvc2l0aXZlSW50ZWdlckFyZ3VtZW50RXJyb3IsIGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvblN0cmluZ09yU3RyaW5nQXJyYXlBcmd1bWVudEVycm9yIGV4dGVuZHMgQWN0aW9uQXJndW1lbnRFcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hY3Rpb25TdHJpbmdPclN0cmluZ0FycmF5QXJndW1lbnRFcnJvciwgYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uU3RyaW5nQXJyYXlFbGVtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUsIGVsZW1lbnRJbmRleCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuYWN0aW9uU3RyaW5nQXJyYXlFbGVtZW50RXJyb3IsIGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudEluZGV4ID0gZWxlbWVudEluZGV4O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldFRlc3RTcGVlZEFyZ3VtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLnNldFRlc3RTcGVlZEFyZ3VtZW50RXJyb3IsIGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvblVuc3VwcG9ydGVkRGV2aWNlVHlwZUVycm9yIGV4dGVuZHMgQWN0aW9uQXJndW1lbnRFcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhcmd1bWVudE5hbWUsIGFyZ3VtZW50VmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvblVuc3VwcG9ydGVkRGV2aWNlVHlwZUVycm9yLCBhcmd1bWVudE5hbWUsIGFyZ3VtZW50VmFsdWUpO1xuICAgIH1cbn1cblxuLy8gU2VsZWN0b3IgZXJyb3JzXG5leHBvcnQgY2xhc3MgQWN0aW9uU2VsZWN0b3JFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChzZWxlY3Rvck5hbWUsIGVyciwgaXNBUElFcnJvcikge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuYWN0aW9uU2VsZWN0b3JFcnJvcik7XG5cbiAgICAgICAgdGhpcy5zZWxlY3Rvck5hbWUgPSBzZWxlY3Rvck5hbWU7XG4gICAgICAgIHRoaXMuZXJyTXNnICAgICAgID0gaXNBUElFcnJvciA/IGVyci5yYXdNZXNzYWdlIDogZXJyLm1lc3NhZ2U7XG4gICAgICAgIHRoaXMub3JpZ2luRXJyb3IgID0gZXJyO1xuICAgIH1cbn1cblxuLy8gQWN0aW9uIGV4ZWN1dGlvbiBlcnJvcnNcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBBY3Rpb25FbGVtZW50Tm90Rm91bmRFcnJvciBleHRlbmRzIFNlbGVjdG9yRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBpRm5BcmdzKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hY3Rpb25FbGVtZW50Tm90Rm91bmRFcnJvciwgYXBpRm5BcmdzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25FbGVtZW50SXNJbnZpc2libGVFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbkVsZW1lbnRJc0ludmlzaWJsZUVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25TZWxlY3Rvck1hdGNoZXNXcm9uZ05vZGVUeXBlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAobm9kZURlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hY3Rpb25TZWxlY3Rvck1hdGNoZXNXcm9uZ05vZGVUeXBlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMubm9kZURlc2NyaXB0aW9uID0gbm9kZURlc2NyaXB0aW9uO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkFkZGl0aW9uYWxFbGVtZW50Tm90Rm91bmRFcnJvciBleHRlbmRzIFNlbGVjdG9yRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lLCBhcGlGbkFyZ3MpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbkFkZGl0aW9uYWxFbGVtZW50Tm90Rm91bmRFcnJvciwgYXBpRm5BcmdzKTtcblxuICAgICAgICB0aGlzLmFyZ3VtZW50TmFtZSA9IGFyZ3VtZW50TmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25BZGRpdGlvbmFsRWxlbWVudElzSW52aXNpYmxlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hY3Rpb25BZGRpdGlvbmFsRWxlbWVudElzSW52aXNpYmxlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuYXJndW1lbnROYW1lID0gYXJndW1lbnROYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkFkZGl0aW9uYWxTZWxlY3Rvck1hdGNoZXNXcm9uZ05vZGVUeXBlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lLCBub2RlRGVzY3JpcHRpb24pIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbkFkZGl0aW9uYWxTZWxlY3Rvck1hdGNoZXNXcm9uZ05vZGVUeXBlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuYXJndW1lbnROYW1lICAgID0gYXJndW1lbnROYW1lO1xuICAgICAgICB0aGlzLm5vZGVEZXNjcmlwdGlvbiA9IG5vZGVEZXNjcmlwdGlvbjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25FbGVtZW50Tm9uRWRpdGFibGVFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbkVsZW1lbnROb25FZGl0YWJsZUVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25FbGVtZW50Tm90VGV4dEFyZWFFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbkVsZW1lbnROb3RUZXh0QXJlYUVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25FbGVtZW50Tm9uQ29udGVudEVkaXRhYmxlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hY3Rpb25FbGVtZW50Tm9uQ29udGVudEVkaXRhYmxlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuYXJndW1lbnROYW1lID0gYXJndW1lbnROYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvblJvb3RDb250YWluZXJOb3RGb3VuZEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuYWN0aW9uUm9vdENvbnRhaW5lck5vdEZvdW5kRXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkluY29ycmVjdEtleXNFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhcmd1bWVudE5hbWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbkluY29ycmVjdEtleXNFcnJvcik7XG5cbiAgICAgICAgdGhpcy5hcmd1bWVudE5hbWUgPSBhcmd1bWVudE5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uQ2Fubm90RmluZEZpbGVUb1VwbG9hZEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGZpbGVQYXRocywgc2Nhbm5lZEZpbGVQYXRocykge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuYWN0aW9uQ2Fubm90RmluZEZpbGVUb1VwbG9hZEVycm9yKTtcblxuICAgICAgICB0aGlzLmZpbGVQYXRocyAgICAgICAgPSBmaWxlUGF0aHM7XG4gICAgICAgIHRoaXMuc2Nhbm5lZEZpbGVQYXRocyA9IHNjYW5uZWRGaWxlUGF0aHM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uRWxlbWVudElzTm90RmlsZUlucHV0RXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hY3Rpb25FbGVtZW50SXNOb3RGaWxlSW5wdXRFcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uSW52YWxpZFNjcm9sbFRhcmdldEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKHNjcm9sbFRhcmdldFhWYWxpZCwgc2Nyb2xsVGFyZ2V0WVZhbGlkKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5hY3Rpb25JbnZhbGlkU2Nyb2xsVGFyZ2V0RXJyb3IpO1xuXG4gICAgICAgIGlmICghc2Nyb2xsVGFyZ2V0WFZhbGlkKSB7XG4gICAgICAgICAgICBpZiAoIXNjcm9sbFRhcmdldFlWYWxpZClcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSAnc2Nyb2xsVGFyZ2V0WCBhbmQgc2Nyb2xsVGFyZ2V0WSBwcm9wZXJ0aWVzJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSAnc2Nyb2xsVGFyZ2V0WCBwcm9wZXJ0eSc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gJ3Njcm9sbFRhcmdldFkgcHJvcGVydHknO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuY2F1Z2h0RXJyb3JJbkN1c3RvbVNjcmlwdCBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChlcnIsIGV4cHJlc3Npb24sIGxpbmUsIGNvbHVtbiwgY2FsbHNpdGUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLnVuY2F1Z2h0RXJyb3JJbkN1c3RvbVNjcmlwdCk7XG5cbiAgICAgICAgdGhpcy5jYWxsc2l0ZSAgID0gY2FsbHNpdGU7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMubGluZSAgICAgICA9IGxpbmU7XG4gICAgICAgIHRoaXMuY29sdW1uICAgICA9IGNvbHVtbjtcblxuICAgICAgICB0aGlzLm9yaWdpbkVycm9yID0gZXJyO1xuICAgICAgICB0aGlzLmVyck1zZyAgICAgID0gZXJyLm1lc3NhZ2UgfHwgU3RyaW5nKGVycik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5jYXVnaHRUZXN0Q2FmZUVycm9ySW5DdXN0b21TY3JpcHQgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoZXJyLCBleHByZXNzaW9uLCBsaW5lLCBjb2x1bW4sIGNhbGxzaXRlKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy51bmNhdWdodFRlc3RDYWZlRXJyb3JJbkN1c3RvbVNjcmlwdCk7XG5cbiAgICAgICAgdGhpcy5jYWxsc2l0ZSAgID0gY2FsbHNpdGU7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMubGluZSAgICAgICA9IGxpbmU7XG4gICAgICAgIHRoaXMuY29sdW1uICAgICA9IGNvbHVtbjtcblxuICAgICAgICB0aGlzLm9yaWdpbkVycm9yID0gZXJyO1xuICAgICAgICB0aGlzLmVyckNhbGxzaXRlID0gZXJyLmNhbGxzaXRlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdpbmRvd0RpbWVuc2lvbnNPdmVyZmxvd0Vycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGNhbGxzaXRlKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy53aW5kb3dEaW1lbnNpb25zT3ZlcmZsb3dFcnJvcik7XG5cbiAgICAgICAgdGhpcy5jYWxsc2l0ZSA9IGNhbGxzaXRlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludmFsaWRFbGVtZW50U2NyZWVuc2hvdERpbWVuc2lvbnNFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5pbnZhbGlkRWxlbWVudFNjcmVlbnNob3REaW1lbnNpb25zRXJyb3IpO1xuXG4gICAgICAgIGNvbnN0IHdpZHRoSXNJbnZhbGlkICA9IHdpZHRoIDw9IDA7XG4gICAgICAgIGNvbnN0IGhlaWdodElzSW52YWxpZCA9IGhlaWdodCA8PSAwO1xuXG4gICAgICAgIGlmICh3aWR0aElzSW52YWxpZCkge1xuICAgICAgICAgICAgaWYgKGhlaWdodElzSW52YWxpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmVyYiAgICAgICA9ICdhcmUnO1xuICAgICAgICAgICAgICAgIHRoaXMuZGltZW5zaW9ucyA9ICd3aWR0aCBhbmQgaGVpZ2h0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudmVyYiAgICAgICA9ICdpcyc7XG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gJ3dpZHRoJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmVyYiAgICAgICA9ICdpcyc7XG4gICAgICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSAnaGVpZ2h0JztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvcmJpZGRlbkNoYXJhY3RlcnNJblNjcmVlbnNob3RQYXRoRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoc2NyZWVuc2hvdFBhdGgsIGZvcmJpZGRlbkNoYXJzTGlzdCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuZm9yYmlkZGVuQ2hhcmFjdGVyc0luU2NyZWVuc2hvdFBhdGhFcnJvcik7XG5cbiAgICAgICAgdGhpcy5zY3JlZW5zaG90UGF0aCAgICAgPSBzY3JlZW5zaG90UGF0aDtcbiAgICAgICAgdGhpcy5mb3JiaWRkZW5DaGFyc0xpc3QgPSBmb3JiaWRkZW5DaGFyc0xpc3Q7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBSb2xlU3dpdGNoSW5Sb2xlSW5pdGlhbGl6ZXJFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChjYWxsc2l0ZSkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMucm9sZVN3aXRjaEluUm9sZUluaXRpYWxpemVyRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICB9XG59XG5cblxuLy8gSWZyYW1lIGVycm9yc1xuZXhwb3J0IGNsYXNzIEFjdGlvbkVsZW1lbnROb3RJZnJhbWVFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbkVsZW1lbnROb3RJZnJhbWVFcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uSWZyYW1lSXNOb3RMb2FkZWRFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmFjdGlvbklmcmFtZUlzTm90TG9hZGVkRXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1cnJlbnRJZnJhbWVJc05vdExvYWRlZEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuY3VycmVudElmcmFtZUlzTm90TG9hZGVkRXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENoaWxkV2luZG93Tm90Rm91bmRFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmNoaWxkV2luZG93Tm90Rm91bmRFcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2hpbGRXaW5kb3dJc05vdExvYWRlZEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuY2hpbGRXaW5kb3dJc05vdExvYWRlZEVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYW5ub3RTd2l0Y2hUb1dpbmRvd0Vycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuY2Fubm90U3dpdGNoVG9XaW5kb3dFcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2xvc2VDaGlsZFdpbmRvd0Vycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMuY2xvc2VDaGlsZFdpbmRvd0Vycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXJyZW50SWZyYW1lTm90Rm91bmRFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmN1cnJlbnRJZnJhbWVOb3RGb3VuZEVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXJyZW50SWZyYW1lSXNJbnZpc2libGVFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9SVU5fRVJST1JTLmN1cnJlbnRJZnJhbWVJc0ludmlzaWJsZUVycm9yKTtcbiAgICB9XG59XG5cbi8vIE5hdGl2ZSBkaWFsb2cgZXJyb3JzXG5leHBvcnQgY2xhc3MgTmF0aXZlRGlhbG9nTm90SGFuZGxlZEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGRpYWxvZ1R5cGUsIHVybCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMubmF0aXZlRGlhbG9nTm90SGFuZGxlZEVycm9yKTtcblxuICAgICAgICB0aGlzLmRpYWxvZ1R5cGUgPSBkaWFsb2dUeXBlO1xuICAgICAgICB0aGlzLnBhZ2VVcmwgICAgPSB1cmw7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5jYXVnaHRFcnJvckluTmF0aXZlRGlhbG9nSGFuZGxlciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChkaWFsb2dUeXBlLCBlcnJNc2csIHVybCkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMudW5jYXVnaHRFcnJvckluTmF0aXZlRGlhbG9nSGFuZGxlcik7XG5cbiAgICAgICAgdGhpcy5kaWFsb2dUeXBlID0gZGlhbG9nVHlwZTtcbiAgICAgICAgdGhpcy5lcnJNc2cgICAgID0gZXJyTXNnO1xuICAgICAgICB0aGlzLnBhZ2VVcmwgICAgPSB1cmw7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0TmF0aXZlRGlhbG9nSGFuZGxlckNvZGVXcm9uZ1R5cGVFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhY3R1YWxUeXBlKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5zZXROYXRpdmVEaWFsb2dIYW5kbGVyQ29kZVdyb25nVHlwZUVycm9yKTtcblxuICAgICAgICB0aGlzLmFjdHVhbFR5cGUgPSBhY3R1YWxUeXBlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlcXVlc3RIb29rVW5oYW5kbGVkRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoZXJyLCBob29rQ2xhc3NOYW1lLCBtZXRob2ROYW1lKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5yZXF1ZXN0SG9va1VuaGFuZGxlZEVycm9yKTtcblxuICAgICAgICB0aGlzLmVyck1zZyAgICAgICAgPSBTdHJpbmcoZXJyKTtcbiAgICAgICAgdGhpcy5ob29rQ2xhc3NOYW1lID0gaG9va0NsYXNzTmFtZTtcbiAgICAgICAgdGhpcy5tZXRob2ROYW1lICAgID0gbWV0aG9kTmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZXF1ZXN0SG9va05vdEltcGxlbWVudGVkTWV0aG9kRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAobWV0aG9kTmFtZSwgaG9va0NsYXNzTmFtZSkge1xuICAgICAgICBzdXBlcihURVNUX1JVTl9FUlJPUlMucmVxdWVzdEhvb2tOb3RJbXBsZW1lbnRlZEVycm9yKTtcblxuICAgICAgICB0aGlzLm1ldGhvZE5hbWUgICAgPSBtZXRob2ROYW1lO1xuICAgICAgICB0aGlzLmhvb2tDbGFzc05hbWUgPSBob29rQ2xhc3NOYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENoaWxkV2luZG93Q2xvc2VkQmVmb3JlU3dpdGNoaW5nRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKFRFU1RfUlVOX0VSUk9SUy5jaGlsZFdpbmRvd0Nsb3NlZEJlZm9yZVN3aXRjaGluZ0Vycm9yKTtcbiAgICB9XG59XG5cbiJdfQ==