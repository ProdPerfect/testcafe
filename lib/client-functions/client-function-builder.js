"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const test_run_tracker_1 = __importDefault(require("../api/test-run-tracker"));
const builder_symbol_1 = __importDefault(require("./builder-symbol"));
const replicator_1 = require("./replicator");
const observation_1 = require("../test-run/commands/observation");
const compile_client_function_1 = __importDefault(require("../compiler/compile-client-function"));
const runtime_1 = require("../errors/runtime");
const type_assertions_1 = require("../errors/runtime/type-assertions");
const types_1 = require("../errors/types");
const get_callsite_1 = require("../errors/get-callsite");
const re_executable_promise_1 = __importDefault(require("../utils/re-executable-promise"));
const marker_symbol_1 = __importDefault(require("../test-run/marker-symbol"));
const DEFAULT_EXECUTION_CALLSITE_NAME = '__$$clientFunction$$';
class ClientFunctionBuilder {
    constructor(fn, options, callsiteNames = {}) {
        this.callsiteNames = {
            instantiation: callsiteNames.instantiation,
            execution: callsiteNames.execution || DEFAULT_EXECUTION_CALLSITE_NAME
        };
        if (lodash_1.isNil(options))
            options = {};
        this._validateOptions(options);
        this.fn = fn;
        this.options = options;
        this.compiledFnCode = this._getCompiledFnCode();
        if (!this.compiledFnCode)
            throw this._createInvalidFnTypeError();
        this.replicator = replicator_1.createReplicator(this._getReplicatorTransforms());
    }
    _decorateFunction(clientFn) {
        clientFn[builder_symbol_1.default] = this;
        clientFn.with = options => {
            return this._getClientFnWithOverriddenOptions(options);
        };
    }
    _getClientFnWithOverriddenOptions(options) {
        if (typeof options === 'object')
            options = lodash_1.assign({}, this.options, options);
        const builder = new this.constructor(this.fn, options, {
            instantiation: 'with',
            execution: this.callsiteNames.execution
        });
        return builder.getFunction();
    }
    getBoundTestRun() {
        // NOTE: `boundTestRun` can be either TestController or TestRun instance.
        if (this.options.boundTestRun)
            return this.options.boundTestRun.testRun || this.options.boundTestRun;
        return null;
    }
    _getTestRun() {
        return this.getBoundTestRun() || test_run_tracker_1.default.resolveContextTestRun();
    }
    getFunction() {
        const builder = this;
        const clientFn = function __$$clientFunction$$() {
            const testRun = builder._getTestRun();
            const callsite = get_callsite_1.getCallsiteForMethod(builder.callsiteNames.execution);
            const args = [];
            // OPTIMIZATION: don't leak `arguments` object.
            for (let i = 0; i < arguments.length; i++)
                args.push(arguments[i]);
            return builder._executeCommand(args, testRun, callsite);
        };
        this._decorateFunction(clientFn);
        return clientFn;
    }
    getCommand(args) {
        const encodedArgs = this.replicator.encode(args);
        const encodedDependencies = this.replicator.encode(this.getFunctionDependencies());
        return this._createTestRunCommand(encodedArgs, encodedDependencies);
    }
    // Overridable methods
    getFunctionDependencies() {
        return this.options.dependencies || {};
    }
    _createTestRunCommand(encodedArgs, encodedDependencies) {
        return new observation_1.ExecuteClientFunctionCommand({
            instantiationCallsiteName: this.callsiteNames.instantiation,
            fnCode: this.compiledFnCode,
            args: encodedArgs,
            dependencies: encodedDependencies
        }, this._getTestRun());
    }
    _getCompiledFnCode() {
        if (typeof this.fn === 'function')
            return compile_client_function_1.default(this.fn.toString(), this.options.dependencies, this.callsiteNames.instantiation, this.callsiteNames.instantiation);
        return null;
    }
    _createInvalidFnTypeError() {
        return new runtime_1.ClientFunctionAPIError(this.callsiteNames.instantiation, this.callsiteNames.instantiation, types_1.RUNTIME_ERRORS.clientFunctionCodeIsNotAFunction, typeof this.fn);
    }
    _executeCommand(args, testRun, callsite) {
        // NOTE: should be kept outside of lazy promise to preserve
        // correct callsite in case of replicator error.
        const command = this.getCommand(args);
        return re_executable_promise_1.default.fromFn(async () => {
            if (!testRun) {
                const err = new runtime_1.ClientFunctionAPIError(this.callsiteNames.execution, this.callsiteNames.instantiation, types_1.RUNTIME_ERRORS.clientFunctionCannotResolveTestRun);
                // NOTE: force callsite here, because more likely it will
                // be impossible to resolve it by method name from a lazy promise.
                err.callsite = callsite;
                throw err;
            }
            const result = await testRun.executeAction(command.type, command, callsite);
            return this._processResult(result, args);
        });
    }
    _processResult(result) {
        return this.replicator.decode(result);
    }
    _validateOptions(options) {
        type_assertions_1.assertType(type_assertions_1.is.nonNullObject, this.callsiteNames.instantiation, '"options" argument', options);
        if (!lodash_1.isNil(options.boundTestRun)) {
            // NOTE: `boundTestRun` can be either TestController or TestRun instance.
            const boundTestRun = options.boundTestRun.testRun || options.boundTestRun;
            if (!boundTestRun[marker_symbol_1.default])
                throw new runtime_1.APIError(this.callsiteNames.instantiation, types_1.RUNTIME_ERRORS.invalidClientFunctionTestRunBinding);
        }
        if (!lodash_1.isNil(options.dependencies))
            type_assertions_1.assertType(type_assertions_1.is.nonNullObject, this.callsiteNames.instantiation, '"dependencies" option', options.dependencies);
    }
    _getReplicatorTransforms() {
        return [
            new replicator_1.FunctionTransform(this.callsiteNames)
        ];
    }
}
exports.default = ClientFunctionBuilder;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LWZ1bmN0aW9uLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpZW50LWZ1bmN0aW9ucy9jbGllbnQtZnVuY3Rpb24tYnVpbGRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1DQUE0RDtBQUM1RCwrRUFBcUQ7QUFDckQsc0VBQXFEO0FBQ3JELDZDQUFtRTtBQUNuRSxrRUFBZ0Y7QUFDaEYsa0dBQXdFO0FBQ3hFLCtDQUFxRTtBQUNyRSx1RUFBbUU7QUFDbkUsMkNBQWlEO0FBQ2pELHlEQUE4RDtBQUM5RCwyRkFBaUU7QUFDakUsOEVBQXNEO0FBRXRELE1BQU0sK0JBQStCLEdBQUcsc0JBQXNCLENBQUM7QUFFL0QsTUFBcUIscUJBQXFCO0lBQ3RDLFlBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxhQUFhLEdBQUcsRUFBRTtRQUN4QyxJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ2pCLGFBQWEsRUFBRSxhQUFhLENBQUMsYUFBYTtZQUMxQyxTQUFTLEVBQU0sYUFBYSxDQUFDLFNBQVMsSUFBSSwrQkFBK0I7U0FDNUUsQ0FBQztRQUVGLElBQUksY0FBaUIsQ0FBQyxPQUFPLENBQUM7WUFDMUIsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLEVBQUUsR0FBZSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBVSxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUVoRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFDcEIsTUFBTSxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUUzQyxJQUFJLENBQUMsVUFBVSxHQUFHLDZCQUFnQixDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUM7SUFDeEUsQ0FB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c05pbCBhcyBpc051bGxPclVuZGVmaW5lZCwgYXNzaWduIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB0ZXN0UnVuVHJhY2tlciBmcm9tICcuLi9hcGkvdGVzdC1ydW4tdHJhY2tlcic7XG5pbXBvcnQgZnVuY3Rpb25CdWlsZGVyU3ltYm9sIGZyb20gJy4vYnVpbGRlci1zeW1ib2wnO1xuaW1wb3J0IHsgY3JlYXRlUmVwbGljYXRvciwgRnVuY3Rpb25UcmFuc2Zvcm0gfSBmcm9tICcuL3JlcGxpY2F0b3InO1xuaW1wb3J0IHsgRXhlY3V0ZUNsaWVudEZ1bmN0aW9uQ29tbWFuZCB9IGZyb20gJy4uL3Rlc3QtcnVuL2NvbW1hbmRzL29ic2VydmF0aW9uJztcbmltcG9ydCBjb21waWxlQ2xpZW50RnVuY3Rpb24gZnJvbSAnLi4vY29tcGlsZXIvY29tcGlsZS1jbGllbnQtZnVuY3Rpb24nO1xuaW1wb3J0IHsgQVBJRXJyb3IsIENsaWVudEZ1bmN0aW9uQVBJRXJyb3IgfSBmcm9tICcuLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgeyBhc3NlcnRUeXBlLCBpcyB9IGZyb20gJy4uL2Vycm9ycy9ydW50aW1lL3R5cGUtYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBSVU5USU1FX0VSUk9SUyB9IGZyb20gJy4uL2Vycm9ycy90eXBlcyc7XG5pbXBvcnQgeyBnZXRDYWxsc2l0ZUZvck1ldGhvZCB9IGZyb20gJy4uL2Vycm9ycy9nZXQtY2FsbHNpdGUnO1xuaW1wb3J0IFJlRXhlY3V0YWJsZVByb21pc2UgZnJvbSAnLi4vdXRpbHMvcmUtZXhlY3V0YWJsZS1wcm9taXNlJztcbmltcG9ydCB0ZXN0UnVuTWFya2VyIGZyb20gJy4uL3Rlc3QtcnVuL21hcmtlci1zeW1ib2wnO1xuXG5jb25zdCBERUZBVUxUX0VYRUNVVElPTl9DQUxMU0lURV9OQU1FID0gJ19fJCRjbGllbnRGdW5jdGlvbiQkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50RnVuY3Rpb25CdWlsZGVyIHtcbiAgICBjb25zdHJ1Y3RvciAoZm4sIG9wdGlvbnMsIGNhbGxzaXRlTmFtZXMgPSB7fSkge1xuICAgICAgICB0aGlzLmNhbGxzaXRlTmFtZXMgPSB7XG4gICAgICAgICAgICBpbnN0YW50aWF0aW9uOiBjYWxsc2l0ZU5hbWVzLmluc3RhbnRpYXRpb24sXG4gICAgICAgICAgICBleGVjdXRpb246ICAgICBjYWxsc2l0ZU5hbWVzLmV4ZWN1dGlvbiB8fCBERUZBVUxUX0VYRUNVVElPTl9DQUxMU0lURV9OQU1FXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMpKVxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlT3B0aW9ucyhvcHRpb25zKTtcblxuICAgICAgICB0aGlzLmZuICAgICAgICAgICAgID0gZm47XG4gICAgICAgIHRoaXMub3B0aW9ucyAgICAgICAgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmNvbXBpbGVkRm5Db2RlID0gdGhpcy5fZ2V0Q29tcGlsZWRGbkNvZGUoKTtcblxuICAgICAgICBpZiAoIXRoaXMuY29tcGlsZWRGbkNvZGUpXG4gICAgICAgICAgICB0aHJvdyB0aGlzLl9jcmVhdGVJbnZhbGlkRm5UeXBlRXJyb3IoKTtcblxuICAgICAgICB0aGlzLnJlcGxpY2F0b3IgPSBjcmVhdGVSZXBsaWNhdG9yKHRoaXMuX2dldFJlcGxpY2F0b3JUcmFuc2Zvcm1zKCkpO1xuICAgIH1cblxuICAgIF9kZWNvcmF0ZUZ1bmN0aW9uIChjbGllbnRGbikge1xuICAgICAgICBjbGllbnRGbltmdW5jdGlvbkJ1aWxkZXJTeW1ib2xdID0gdGhpcztcblxuICAgICAgICBjbGllbnRGbi53aXRoID0gb3B0aW9ucyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0Q2xpZW50Rm5XaXRoT3ZlcnJpZGRlbk9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX2dldENsaWVudEZuV2l0aE92ZXJyaWRkZW5PcHRpb25zIChvcHRpb25zKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpXG4gICAgICAgICAgICBvcHRpb25zID0gYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLmZuLCBvcHRpb25zLCB7XG4gICAgICAgICAgICBpbnN0YW50aWF0aW9uOiAnd2l0aCcsXG4gICAgICAgICAgICBleGVjdXRpb246ICAgICB0aGlzLmNhbGxzaXRlTmFtZXMuZXhlY3V0aW9uXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBidWlsZGVyLmdldEZ1bmN0aW9uKCk7XG4gICAgfVxuXG4gICAgZ2V0Qm91bmRUZXN0UnVuICgpIHtcbiAgICAgICAgLy8gTk9URTogYGJvdW5kVGVzdFJ1bmAgY2FuIGJlIGVpdGhlciBUZXN0Q29udHJvbGxlciBvciBUZXN0UnVuIGluc3RhbmNlLlxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5kVGVzdFJ1bilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm91bmRUZXN0UnVuLnRlc3RSdW4gfHwgdGhpcy5vcHRpb25zLmJvdW5kVGVzdFJ1bjtcblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBfZ2V0VGVzdFJ1biAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kVGVzdFJ1bigpIHx8IHRlc3RSdW5UcmFja2VyLnJlc29sdmVDb250ZXh0VGVzdFJ1bigpO1xuICAgIH1cblxuICAgIGdldEZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgYnVpbGRlciA9IHRoaXM7XG5cbiAgICAgICAgY29uc3QgY2xpZW50Rm4gPSBmdW5jdGlvbiBfXyQkY2xpZW50RnVuY3Rpb24kJCAoKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXN0UnVuICA9IGJ1aWxkZXIuX2dldFRlc3RSdW4oKTtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxzaXRlID0gZ2V0Q2FsbHNpdGVGb3JNZXRob2QoYnVpbGRlci5jYWxsc2l0ZU5hbWVzLmV4ZWN1dGlvbik7XG4gICAgICAgICAgICBjb25zdCBhcmdzICAgICA9IFtdO1xuXG4gICAgICAgICAgICAvLyBPUFRJTUlaQVRJT046IGRvbid0IGxlYWsgYGFyZ3VtZW50c2Agb2JqZWN0LlxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG5cbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLl9leGVjdXRlQ29tbWFuZChhcmdzLCB0ZXN0UnVuLCBjYWxsc2l0ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fZGVjb3JhdGVGdW5jdGlvbihjbGllbnRGbik7XG5cbiAgICAgICAgcmV0dXJuIGNsaWVudEZuO1xuICAgIH1cblxuICAgIGdldENvbW1hbmQgKGFyZ3MpIHtcbiAgICAgICAgY29uc3QgZW5jb2RlZEFyZ3MgICAgICAgICA9IHRoaXMucmVwbGljYXRvci5lbmNvZGUoYXJncyk7XG4gICAgICAgIGNvbnN0IGVuY29kZWREZXBlbmRlbmNpZXMgPSB0aGlzLnJlcGxpY2F0b3IuZW5jb2RlKHRoaXMuZ2V0RnVuY3Rpb25EZXBlbmRlbmNpZXMoKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZVRlc3RSdW5Db21tYW5kKGVuY29kZWRBcmdzLCBlbmNvZGVkRGVwZW5kZW5jaWVzKTtcbiAgICB9XG5cblxuICAgIC8vIE92ZXJyaWRhYmxlIG1ldGhvZHNcbiAgICBnZXRGdW5jdGlvbkRlcGVuZGVuY2llcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzIHx8IHt9O1xuICAgIH1cblxuICAgIF9jcmVhdGVUZXN0UnVuQ29tbWFuZCAoZW5jb2RlZEFyZ3MsIGVuY29kZWREZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFeGVjdXRlQ2xpZW50RnVuY3Rpb25Db21tYW5kKHtcbiAgICAgICAgICAgIGluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWU6IHRoaXMuY2FsbHNpdGVOYW1lcy5pbnN0YW50aWF0aW9uLFxuICAgICAgICAgICAgZm5Db2RlOiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21waWxlZEZuQ29kZSxcbiAgICAgICAgICAgIGFyZ3M6ICAgICAgICAgICAgICAgICAgICAgIGVuY29kZWRBcmdzLFxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiAgICAgICAgICAgICAgZW5jb2RlZERlcGVuZGVuY2llc1xuICAgICAgICB9LCB0aGlzLl9nZXRUZXN0UnVuKCkpO1xuICAgIH1cblxuICAgIF9nZXRDb21waWxlZEZuQ29kZSAoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5mbiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHJldHVybiBjb21waWxlQ2xpZW50RnVuY3Rpb24odGhpcy5mbi50b1N0cmluZygpLCB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzLCB0aGlzLmNhbGxzaXRlTmFtZXMuaW5zdGFudGlhdGlvbiwgdGhpcy5jYWxsc2l0ZU5hbWVzLmluc3RhbnRpYXRpb24pO1xuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIF9jcmVhdGVJbnZhbGlkRm5UeXBlRXJyb3IgKCkge1xuICAgICAgICByZXR1cm4gbmV3IENsaWVudEZ1bmN0aW9uQVBJRXJyb3IodGhpcy5jYWxsc2l0ZU5hbWVzLmluc3RhbnRpYXRpb24sIHRoaXMuY2FsbHNpdGVOYW1lcy5pbnN0YW50aWF0aW9uLCBSVU5USU1FX0VSUk9SUy5jbGllbnRGdW5jdGlvbkNvZGVJc05vdEFGdW5jdGlvbiwgdHlwZW9mIHRoaXMuZm4pO1xuICAgIH1cblxuICAgIF9leGVjdXRlQ29tbWFuZCAoYXJncywgdGVzdFJ1biwgY2FsbHNpdGUpIHtcbiAgICAgICAgLy8gTk9URTogc2hvdWxkIGJlIGtlcHQgb3V0c2lkZSBvZiBsYXp5IHByb21pc2UgdG8gcHJlc2VydmVcbiAgICAgICAgLy8gY29ycmVjdCBjYWxsc2l0ZSBpbiBjYXNlIG9mIHJlcGxpY2F0b3IgZXJyb3IuXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLmdldENvbW1hbmQoYXJncyk7XG5cbiAgICAgICAgcmV0dXJuIFJlRXhlY3V0YWJsZVByb21pc2UuZnJvbUZuKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGVzdFJ1bikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBDbGllbnRGdW5jdGlvbkFQSUVycm9yKHRoaXMuY2FsbHNpdGVOYW1lcy5leGVjdXRpb24sIHRoaXMuY2FsbHNpdGVOYW1lcy5pbnN0YW50aWF0aW9uLCBSVU5USU1FX0VSUk9SUy5jbGllbnRGdW5jdGlvbkNhbm5vdFJlc29sdmVUZXN0UnVuKTtcblxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IGZvcmNlIGNhbGxzaXRlIGhlcmUsIGJlY2F1c2UgbW9yZSBsaWtlbHkgaXQgd2lsbFxuICAgICAgICAgICAgICAgIC8vIGJlIGltcG9zc2libGUgdG8gcmVzb2x2ZSBpdCBieSBtZXRob2QgbmFtZSBmcm9tIGEgbGF6eSBwcm9taXNlLlxuICAgICAgICAgICAgICAgIGVyci5jYWxsc2l0ZSA9IGNhbGxzaXRlO1xuXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0ZXN0UnVuLmV4ZWN1dGVBY3Rpb24oY29tbWFuZC50eXBlLCBjb21tYW5kLCBjYWxsc2l0ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9jZXNzUmVzdWx0KHJlc3VsdCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9wcm9jZXNzUmVzdWx0IChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGljYXRvci5kZWNvZGUocmVzdWx0KTtcbiAgICB9XG5cbiAgICBfdmFsaWRhdGVPcHRpb25zIChvcHRpb25zKSB7XG4gICAgICAgIGFzc2VydFR5cGUoaXMubm9uTnVsbE9iamVjdCwgdGhpcy5jYWxsc2l0ZU5hbWVzLmluc3RhbnRpYXRpb24sICdcIm9wdGlvbnNcIiBhcmd1bWVudCcsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5ib3VuZFRlc3RSdW4pKSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBgYm91bmRUZXN0UnVuYCBjYW4gYmUgZWl0aGVyIFRlc3RDb250cm9sbGVyIG9yIFRlc3RSdW4gaW5zdGFuY2UuXG4gICAgICAgICAgICBjb25zdCBib3VuZFRlc3RSdW4gPSBvcHRpb25zLmJvdW5kVGVzdFJ1bi50ZXN0UnVuIHx8IG9wdGlvbnMuYm91bmRUZXN0UnVuO1xuXG4gICAgICAgICAgICBpZiAoIWJvdW5kVGVzdFJ1blt0ZXN0UnVuTWFya2VyXSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQVBJRXJyb3IodGhpcy5jYWxsc2l0ZU5hbWVzLmluc3RhbnRpYXRpb24sIFJVTlRJTUVfRVJST1JTLmludmFsaWRDbGllbnRGdW5jdGlvblRlc3RSdW5CaW5kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5kZXBlbmRlbmNpZXMpKVxuICAgICAgICAgICAgYXNzZXJ0VHlwZShpcy5ub25OdWxsT2JqZWN0LCB0aGlzLmNhbGxzaXRlTmFtZXMuaW5zdGFudGlhdGlvbiwgJ1wiZGVwZW5kZW5jaWVzXCIgb3B0aW9uJywgb3B0aW9ucy5kZXBlbmRlbmNpZXMpO1xuICAgIH1cblxuICAgIF9nZXRSZXBsaWNhdG9yVHJhbnNmb3JtcyAoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBuZXcgRnVuY3Rpb25UcmFuc2Zvcm0odGhpcy5jYWxsc2l0ZU5hbWVzKVxuICAgICAgICBdO1xuICAgIH1cbn1cbiJdfQ==