"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const dedent_1 = __importDefault(require("dedent"));
const client_function_builder_1 = __importDefault(require("../client-function-builder"));
const replicator_1 = require("../replicator");
const runtime_1 = require("../../errors/runtime");
const builder_symbol_1 = __importDefault(require("../builder-symbol"));
const types_1 = require("../../errors/types");
const type_assertions_1 = require("../../errors/runtime/type-assertions");
const observation_1 = require("../../test-run/commands/observation");
const define_lazy_property_1 = __importDefault(require("../../utils/define-lazy-property"));
const add_api_1 = require("./add-api");
const create_snapshot_methods_1 = __importDefault(require("./create-snapshot-methods"));
const prepare_api_args_1 = __importDefault(require("./prepare-api-args"));
const return_single_prop_mode_1 = __importDefault(require("../return-single-prop-mode"));
class SelectorBuilder extends client_function_builder_1.default {
    constructor(fn, options, callsiteNames) {
        const apiFn = options && options.apiFn;
        const apiFnID = options && options.apiFnID;
        const builderFromSelector = fn && fn[builder_symbol_1.default];
        const builderFromPromiseOrSnapshot = fn && fn.selector && fn.selector[builder_symbol_1.default];
        let builder = builderFromSelector || builderFromPromiseOrSnapshot;
        builder = builder instanceof SelectorBuilder ? builder : null;
        if (builder) {
            fn = builder.fn;
            if (options === void 0 || typeof options === 'object')
                options = lodash_1.merge({}, builder.options, options, { sourceSelectorBuilder: builder });
        }
        super(fn, options, callsiteNames);
        if (!this.options.apiFnChain) {
            const fnType = typeof this.fn;
            let item = fnType === 'string' ? `'${this.fn}'` : `[${fnType}]`;
            item = `Selector(${item})`;
            this.options.apiFn = item;
            this.options.apiFnChain = [item];
        }
        if (apiFn)
            this.options.apiFnChain.push(apiFn);
        this.options.apiFnID = typeof apiFnID === 'number' ? apiFnID : this.options.apiFnChain.length - 1;
    }
    _getCompiledFnCode() {
        // OPTIMIZATION: if selector was produced from another selector and
        // it has same dependencies as source selector, then we can
        // avoid recompilation and just re-use already compiled code.
        const hasSameDependenciesAsSourceSelector = this.options.sourceSelectorBuilder &&
            this.options.sourceSelectorBuilder.options.dependencies ===
                this.options.dependencies;
        if (hasSameDependenciesAsSourceSelector)
            return this.options.sourceSelectorBuilder.compiledFnCode;
        const code = typeof this.fn === 'string' ?
            `(function(){return document.querySelectorAll(${JSON.stringify(this.fn)});});` :
            super._getCompiledFnCode();
        if (code) {
            return dedent_1.default(`(function(){
                    var __f$=${code};
                    return function(){
                        var args           = __dependencies$.boundArgs || arguments;
                        var selectorFilter = window['%testCafeSelectorFilter%'];

                        var nodes = __f$.apply(this, args);
                        nodes     = selectorFilter.cast(nodes);

                        if (!nodes.length && !selectorFilter.error)
                            selectorFilter.error = __dependencies$.apiInfo.apiFnID;

                        return selectorFilter.filter(nodes, __dependencies$.filterOptions, __dependencies$.apiInfo);
                    };
                 })();`);
        }
        return null;
    }
    _createInvalidFnTypeError() {
        return new runtime_1.ClientFunctionAPIError(this.callsiteNames.instantiation, this.callsiteNames.instantiation, types_1.RUNTIME_ERRORS.selectorInitializedWithWrongType, typeof this.fn);
    }
    _executeCommand(args, testRun, callsite) {
        const resultPromise = super._executeCommand(args, testRun, callsite);
        this._addBoundArgsSelectorGetter(resultPromise, args);
        // OPTIMIZATION: use buffer function as selector not to trigger lazy property ahead of time
        add_api_1.addAPI(resultPromise, () => resultPromise.selector, SelectorBuilder, this.options.customDOMProperties, this.options.customMethods);
        return resultPromise;
    }
    _getSourceSelectorBuilderApiFnID() {
        let selectorAncestor = this;
        while (selectorAncestor.options.sourceSelectorBuilder)
            selectorAncestor = selectorAncestor.options.sourceSelectorBuilder;
        return selectorAncestor.options.apiFnID;
    }
    getFunctionDependencies() {
        const dependencies = super.getFunctionDependencies();
        const { filterVisible, filterHidden, counterMode, collectionMode, getVisibleValueMode, index, customDOMProperties, customMethods, apiFnChain, boundArgs } = this.options;
        return lodash_1.merge({}, dependencies, {
            filterOptions: {
                filterVisible,
                filterHidden,
                counterMode,
                collectionMode,
                index: lodash_1.isNil(index) ? null : index,
                getVisibleValueMode
            },
            apiInfo: {
                apiFnChain,
                apiFnID: this._getSourceSelectorBuilderApiFnID()
            },
            boundArgs,
            customDOMProperties,
            customMethods
        });
    }
    _createTestRunCommand(encodedArgs, encodedDependencies) {
        return new observation_1.ExecuteSelectorCommand({
            instantiationCallsiteName: this.callsiteNames.instantiation,
            fnCode: this.compiledFnCode,
            args: encodedArgs,
            dependencies: encodedDependencies,
            needError: this.options.needError,
            apiFnChain: this.options.apiFnChain,
            visibilityCheck: !!this.options.visibilityCheck,
            timeout: this.options.timeout
        });
    }
    _validateOptions(options) {
        super._validateOptions(options);
        if (!lodash_1.isNil(options.visibilityCheck))
            type_assertions_1.assertType(type_assertions_1.is.boolean, this.callsiteNames.instantiation, '"visibilityCheck" option', options.visibilityCheck);
        if (!lodash_1.isNil(options.timeout))
            type_assertions_1.assertType(type_assertions_1.is.nonNegativeNumber, this.callsiteNames.instantiation, '"timeout" option', options.timeout);
    }
    _getReplicatorTransforms() {
        const transforms = super._getReplicatorTransforms();
        transforms.push(new replicator_1.SelectorNodeTransform());
        return transforms;
    }
    _addBoundArgsSelectorGetter(obj, selectorArgs) {
        define_lazy_property_1.default(obj, 'selector', () => {
            const builder = new SelectorBuilder(this.getFunction(), { boundArgs: selectorArgs });
            return builder.getFunction();
        });
    }
    _decorateFunction(selectorFn) {
        super._decorateFunction(selectorFn);
        add_api_1.addAPI(selectorFn, () => selectorFn, SelectorBuilder, this.options.customDOMProperties, this.options.customMethods);
    }
    _getClientFnWithOverriddenOptions(options) {
        const apiFn = prepare_api_args_1.default('with', options);
        const previousSelectorID = this.options.apiFnChain.length - 1;
        return super._getClientFnWithOverriddenOptions(Object.assign(options, { apiFn, apiFnID: previousSelectorID }));
    }
    _processResult(result, selectorArgs) {
        const snapshot = super._processResult(result, selectorArgs);
        if (snapshot && !return_single_prop_mode_1.default(this.options)) {
            this._addBoundArgsSelectorGetter(snapshot, selectorArgs);
            create_snapshot_methods_1.default(snapshot);
            if (this.options.customMethods)
                add_api_1.addCustomMethods(snapshot, () => snapshot.selector, SelectorBuilder, this.options.customMethods);
        }
        return snapshot;
    }
}
exports.default = SelectorBuilder;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3ItYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQtZnVuY3Rpb25zL3NlbGVjdG9ycy9zZWxlY3Rvci1idWlsZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQTJEO0FBQzNELG9EQUE0QjtBQUM1Qix5RkFBK0Q7QUFDL0QsOENBQXNEO0FBQ3RELGtEQUE4RDtBQUM5RCx1RUFBc0Q7QUFDdEQsOENBQW9EO0FBQ3BELDBFQUFzRTtBQUN0RSxxRUFBNkU7QUFDN0UsNEZBQWtFO0FBQ2xFLHVDQUFxRDtBQUNyRCx3RkFBOEQ7QUFDOUQsMEVBQWtEO0FBQ2xELHlGQUE4RDtBQUU5RCxNQUFxQixlQUFnQixTQUFRLGlDQUFxQjtJQUM5RCxZQUFhLEVBQUUsRUFBRSxPQUFPLEVBQUUsYUFBYTtRQUNuQyxNQUFNLEtBQUssR0FBMEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDOUQsTUFBTSxPQUFPLEdBQXdCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ2hFLE1BQU0sbUJBQW1CLEdBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyx3QkFBcUIsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sNEJBQTRCLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyx3QkFBcUIsQ0FBQyxDQUFDO1FBQzdGLElBQUksT0FBTyxHQUEwQixtQkFBbUIsSUFBSSw0QkFBNEIsQ0FBQztRQUV6RixPQUFPLEdBQUcsT0FBTyxZQUFZLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFOUQsSUFBSSxPQUFPLEVBQUU7WUFDVCxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUVoQixJQUFJLE9BQU8sS0FBSyxLQUFLLENBQUMsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRO2dCQUNq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ZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDeEc7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0NBQ0o7QUFwTUQsa0NBb01DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNOaWwgYXMgaXNOdWxsT3JVbmRlZmluZWQsIG1lcmdlIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBkZWRlbnQgZnJvbSAnZGVkZW50JztcbmltcG9ydCBDbGllbnRGdW5jdGlvbkJ1aWxkZXIgZnJvbSAnLi4vY2xpZW50LWZ1bmN0aW9uLWJ1aWxkZXInO1xuaW1wb3J0IHsgU2VsZWN0b3JOb2RlVHJhbnNmb3JtIH0gZnJvbSAnLi4vcmVwbGljYXRvcic7XG5pbXBvcnQgeyBDbGllbnRGdW5jdGlvbkFQSUVycm9yIH0gZnJvbSAnLi4vLi4vZXJyb3JzL3J1bnRpbWUnO1xuaW1wb3J0IGZ1bmN0aW9uQnVpbGRlclN5bWJvbCBmcm9tICcuLi9idWlsZGVyLXN5bWJvbCc7XG5pbXBvcnQgeyBSVU5USU1FX0VSUk9SUyB9IGZyb20gJy4uLy4uL2Vycm9ycy90eXBlcyc7XG5pbXBvcnQgeyBhc3NlcnRUeXBlLCBpcyB9IGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lL3R5cGUtYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBFeGVjdXRlU2VsZWN0b3JDb21tYW5kIH0gZnJvbSAnLi4vLi4vdGVzdC1ydW4vY29tbWFuZHMvb2JzZXJ2YXRpb24nO1xuaW1wb3J0IGRlZmluZUxhenlQcm9wZXJ0eSBmcm9tICcuLi8uLi91dGlscy9kZWZpbmUtbGF6eS1wcm9wZXJ0eSc7XG5pbXBvcnQgeyBhZGRBUEksIGFkZEN1c3RvbU1ldGhvZHMgfSBmcm9tICcuL2FkZC1hcGknO1xuaW1wb3J0IGNyZWF0ZVNuYXBzaG90TWV0aG9kcyBmcm9tICcuL2NyZWF0ZS1zbmFwc2hvdC1tZXRob2RzJztcbmltcG9ydCBwcmVwYXJlQXBpRm5BcmdzIGZyb20gJy4vcHJlcGFyZS1hcGktYXJncyc7XG5pbXBvcnQgcmV0dXJuU2luZ2xlUHJvcE1vZGUgZnJvbSAnLi4vcmV0dXJuLXNpbmdsZS1wcm9wLW1vZGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RvckJ1aWxkZXIgZXh0ZW5kcyBDbGllbnRGdW5jdGlvbkJ1aWxkZXIge1xuICAgIGNvbnN0cnVjdG9yIChmbiwgb3B0aW9ucywgY2FsbHNpdGVOYW1lcykge1xuICAgICAgICBjb25zdCBhcGlGbiAgICAgICAgICAgICAgICAgICAgICAgID0gb3B0aW9ucyAmJiBvcHRpb25zLmFwaUZuO1xuICAgICAgICBjb25zdCBhcGlGbklEICAgICAgICAgICAgICAgICAgICAgID0gb3B0aW9ucyAmJiBvcHRpb25zLmFwaUZuSUQ7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXJGcm9tU2VsZWN0b3IgICAgICAgICAgPSBmbiAmJiBmbltmdW5jdGlvbkJ1aWxkZXJTeW1ib2xdO1xuICAgICAgICBjb25zdCBidWlsZGVyRnJvbVByb21pc2VPclNuYXBzaG90ID0gZm4gJiYgZm4uc2VsZWN0b3IgJiYgZm4uc2VsZWN0b3JbZnVuY3Rpb25CdWlsZGVyU3ltYm9sXTtcbiAgICAgICAgbGV0IGJ1aWxkZXIgICAgICAgICAgICAgICAgICAgICAgICA9IGJ1aWxkZXJGcm9tU2VsZWN0b3IgfHwgYnVpbGRlckZyb21Qcm9taXNlT3JTbmFwc2hvdDtcblxuICAgICAgICBidWlsZGVyID0gYnVpbGRlciBpbnN0YW5jZW9mIFNlbGVjdG9yQnVpbGRlciA/IGJ1aWxkZXIgOiBudWxsO1xuXG4gICAgICAgIGlmIChidWlsZGVyKSB7XG4gICAgICAgICAgICBmbiA9IGJ1aWxkZXIuZm47XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDAgfHwgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBtZXJnZSh7fSwgYnVpbGRlci5vcHRpb25zLCBvcHRpb25zLCB7IHNvdXJjZVNlbGVjdG9yQnVpbGRlcjogYnVpbGRlciB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyKGZuLCBvcHRpb25zLCBjYWxsc2l0ZU5hbWVzKTtcblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5hcGlGbkNoYWluKSB7XG4gICAgICAgICAgICBjb25zdCBmblR5cGUgPSB0eXBlb2YgdGhpcy5mbjtcbiAgICAgICAgICAgIGxldCBpdGVtICAgICA9IGZuVHlwZSA9PT0gJ3N0cmluZycgPyBgJyR7dGhpcy5mbn0nYCA6IGBbJHtmblR5cGV9XWA7XG5cbiAgICAgICAgICAgIGl0ZW0gICAgICAgICAgICAgICAgICAgID0gYFNlbGVjdG9yKCR7aXRlbX0pYDtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hcGlGbiAgICAgID0gaXRlbTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hcGlGbkNoYWluID0gW2l0ZW1dO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFwaUZuKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFwaUZuQ2hhaW4ucHVzaChhcGlGbik7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmFwaUZuSUQgPSB0eXBlb2YgYXBpRm5JRCA9PT0gJ251bWJlcicgPyBhcGlGbklEIDogdGhpcy5vcHRpb25zLmFwaUZuQ2hhaW4ubGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBfZ2V0Q29tcGlsZWRGbkNvZGUgKCkge1xuICAgICAgICAvLyBPUFRJTUlaQVRJT046IGlmIHNlbGVjdG9yIHdhcyBwcm9kdWNlZCBmcm9tIGFub3RoZXIgc2VsZWN0b3IgYW5kXG4gICAgICAgIC8vIGl0IGhhcyBzYW1lIGRlcGVuZGVuY2llcyBhcyBzb3VyY2Ugc2VsZWN0b3IsIHRoZW4gd2UgY2FuXG4gICAgICAgIC8vIGF2b2lkIHJlY29tcGlsYXRpb24gYW5kIGp1c3QgcmUtdXNlIGFscmVhZHkgY29tcGlsZWQgY29kZS5cbiAgICAgICAgY29uc3QgaGFzU2FtZURlcGVuZGVuY2llc0FzU291cmNlU2VsZWN0b3IgPSB0aGlzLm9wdGlvbnMuc291cmNlU2VsZWN0b3JCdWlsZGVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNvdXJjZVNlbGVjdG9yQnVpbGRlci5vcHRpb25zLmRlcGVuZGVuY2llcyA9PT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzO1xuXG4gICAgICAgIGlmIChoYXNTYW1lRGVwZW5kZW5jaWVzQXNTb3VyY2VTZWxlY3RvcilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc291cmNlU2VsZWN0b3JCdWlsZGVyLmNvbXBpbGVkRm5Db2RlO1xuXG4gICAgICAgIGNvbnN0IGNvZGUgPSB0eXBlb2YgdGhpcy5mbiA9PT0gJ3N0cmluZycgP1xuICAgICAgICAgICAgYChmdW5jdGlvbigpe3JldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCR7SlNPTi5zdHJpbmdpZnkodGhpcy5mbil9KTt9KTtgIDpcbiAgICAgICAgICAgIHN1cGVyLl9nZXRDb21waWxlZEZuQ29kZSgpO1xuXG4gICAgICAgIGlmIChjb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVkZW50KFxuICAgICAgICAgICAgICAgIGAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9fZiQ9JHtjb2RlfTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyAgICAgICAgICAgPSBfX2RlcGVuZGVuY2llcyQuYm91bmRBcmdzIHx8IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RvckZpbHRlciA9IHdpbmRvd1snJXRlc3RDYWZlU2VsZWN0b3JGaWx0ZXIlJ107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub2RlcyA9IF9fZiQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlcyAgICAgPSBzZWxlY3RvckZpbHRlci5jYXN0KG5vZGVzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFub2Rlcy5sZW5ndGggJiYgIXNlbGVjdG9yRmlsdGVyLmVycm9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yRmlsdGVyLmVycm9yID0gX19kZXBlbmRlbmNpZXMkLmFwaUluZm8uYXBpRm5JRDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9yRmlsdGVyLmZpbHRlcihub2RlcywgX19kZXBlbmRlbmNpZXMkLmZpbHRlck9wdGlvbnMsIF9fZGVwZW5kZW5jaWVzJC5hcGlJbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgfSkoKTtgXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUludmFsaWRGblR5cGVFcnJvciAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2xpZW50RnVuY3Rpb25BUElFcnJvcih0aGlzLmNhbGxzaXRlTmFtZXMuaW5zdGFudGlhdGlvbiwgdGhpcy5jYWxsc2l0ZU5hbWVzLmluc3RhbnRpYXRpb24sIFJVTlRJTUVfRVJST1JTLnNlbGVjdG9ySW5pdGlhbGl6ZWRXaXRoV3JvbmdUeXBlLCB0eXBlb2YgdGhpcy5mbik7XG4gICAgfVxuXG4gICAgX2V4ZWN1dGVDb21tYW5kIChhcmdzLCB0ZXN0UnVuLCBjYWxsc2l0ZSkge1xuICAgICAgICBjb25zdCByZXN1bHRQcm9taXNlID0gc3VwZXIuX2V4ZWN1dGVDb21tYW5kKGFyZ3MsIHRlc3RSdW4sIGNhbGxzaXRlKTtcblxuICAgICAgICB0aGlzLl9hZGRCb3VuZEFyZ3NTZWxlY3RvckdldHRlcihyZXN1bHRQcm9taXNlLCBhcmdzKTtcblxuICAgICAgICAvLyBPUFRJTUlaQVRJT046IHVzZSBidWZmZXIgZnVuY3Rpb24gYXMgc2VsZWN0b3Igbm90IHRvIHRyaWdnZXIgbGF6eSBwcm9wZXJ0eSBhaGVhZCBvZiB0aW1lXG4gICAgICAgIGFkZEFQSShyZXN1bHRQcm9taXNlLCAoKSA9PiByZXN1bHRQcm9taXNlLnNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIsIHRoaXMub3B0aW9ucy5jdXN0b21ET01Qcm9wZXJ0aWVzLCB0aGlzLm9wdGlvbnMuY3VzdG9tTWV0aG9kcyk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFByb21pc2U7XG4gICAgfVxuXG4gICAgX2dldFNvdXJjZVNlbGVjdG9yQnVpbGRlckFwaUZuSUQgKCkge1xuICAgICAgICBsZXQgc2VsZWN0b3JBbmNlc3RvciA9IHRoaXM7XG5cbiAgICAgICAgd2hpbGUgKHNlbGVjdG9yQW5jZXN0b3Iub3B0aW9ucy5zb3VyY2VTZWxlY3RvckJ1aWxkZXIpXG4gICAgICAgICAgICBzZWxlY3RvckFuY2VzdG9yID0gc2VsZWN0b3JBbmNlc3Rvci5vcHRpb25zLnNvdXJjZVNlbGVjdG9yQnVpbGRlcjtcblxuICAgICAgICByZXR1cm4gc2VsZWN0b3JBbmNlc3Rvci5vcHRpb25zLmFwaUZuSUQ7XG4gICAgfVxuXG4gICAgZ2V0RnVuY3Rpb25EZXBlbmRlbmNpZXMgKCkge1xuICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBzdXBlci5nZXRGdW5jdGlvbkRlcGVuZGVuY2llcygpO1xuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGZpbHRlclZpc2libGUsXG4gICAgICAgICAgICBmaWx0ZXJIaWRkZW4sXG4gICAgICAgICAgICBjb3VudGVyTW9kZSxcbiAgICAgICAgICAgIGNvbGxlY3Rpb25Nb2RlLFxuICAgICAgICAgICAgZ2V0VmlzaWJsZVZhbHVlTW9kZSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY3VzdG9tRE9NUHJvcGVydGllcyxcbiAgICAgICAgICAgIGN1c3RvbU1ldGhvZHMsXG4gICAgICAgICAgICBhcGlGbkNoYWluLFxuICAgICAgICAgICAgYm91bmRBcmdzXG4gICAgICAgIH0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgICAgcmV0dXJuIG1lcmdlKHt9LCBkZXBlbmRlbmNpZXMsIHtcbiAgICAgICAgICAgIGZpbHRlck9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJWaXNpYmxlLFxuICAgICAgICAgICAgICAgIGZpbHRlckhpZGRlbixcbiAgICAgICAgICAgICAgICBjb3VudGVyTW9kZSxcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uTW9kZSxcbiAgICAgICAgICAgICAgICBpbmRleDogaXNOdWxsT3JVbmRlZmluZWQoaW5kZXgpID8gbnVsbCA6IGluZGV4LFxuICAgICAgICAgICAgICAgIGdldFZpc2libGVWYWx1ZU1vZGVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcGlJbmZvOiB7XG4gICAgICAgICAgICAgICAgYXBpRm5DaGFpbixcbiAgICAgICAgICAgICAgICBhcGlGbklEOiB0aGlzLl9nZXRTb3VyY2VTZWxlY3RvckJ1aWxkZXJBcGlGbklEKClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib3VuZEFyZ3MsXG4gICAgICAgICAgICBjdXN0b21ET01Qcm9wZXJ0aWVzLFxuICAgICAgICAgICAgY3VzdG9tTWV0aG9kc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfY3JlYXRlVGVzdFJ1bkNvbW1hbmQgKGVuY29kZWRBcmdzLCBlbmNvZGVkRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXhlY3V0ZVNlbGVjdG9yQ29tbWFuZCh7XG4gICAgICAgICAgICBpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lOiB0aGlzLmNhbGxzaXRlTmFtZXMuaW5zdGFudGlhdGlvbixcbiAgICAgICAgICAgIGZuQ29kZTogICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZWRGbkNvZGUsXG4gICAgICAgICAgICBhcmdzOiAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVkQXJncyxcbiAgICAgICAgICAgIGRlcGVuZGVuY2llczogICAgICAgICAgICAgIGVuY29kZWREZXBlbmRlbmNpZXMsXG4gICAgICAgICAgICBuZWVkRXJyb3I6ICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMubmVlZEVycm9yLFxuICAgICAgICAgICAgYXBpRm5DaGFpbjogICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFwaUZuQ2hhaW4sXG4gICAgICAgICAgICB2aXNpYmlsaXR5Q2hlY2s6ICAgICAgICAgICAhIXRoaXMub3B0aW9ucy52aXNpYmlsaXR5Q2hlY2ssXG4gICAgICAgICAgICB0aW1lb3V0OiAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMudGltZW91dFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfdmFsaWRhdGVPcHRpb25zIChvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyLl92YWxpZGF0ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChvcHRpb25zLnZpc2liaWxpdHlDaGVjaykpXG4gICAgICAgICAgICBhc3NlcnRUeXBlKGlzLmJvb2xlYW4sIHRoaXMuY2FsbHNpdGVOYW1lcy5pbnN0YW50aWF0aW9uLCAnXCJ2aXNpYmlsaXR5Q2hlY2tcIiBvcHRpb24nLCBvcHRpb25zLnZpc2liaWxpdHlDaGVjayk7XG5cbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChvcHRpb25zLnRpbWVvdXQpKVxuICAgICAgICAgICAgYXNzZXJ0VHlwZShpcy5ub25OZWdhdGl2ZU51bWJlciwgdGhpcy5jYWxsc2l0ZU5hbWVzLmluc3RhbnRpYXRpb24sICdcInRpbWVvdXRcIiBvcHRpb24nLCBvcHRpb25zLnRpbWVvdXQpO1xuICAgIH1cblxuICAgIF9nZXRSZXBsaWNhdG9yVHJhbnNmb3JtcyAoKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybXMgPSBzdXBlci5fZ2V0UmVwbGljYXRvclRyYW5zZm9ybXMoKTtcblxuICAgICAgICB0cmFuc2Zvcm1zLnB1c2gobmV3IFNlbGVjdG9yTm9kZVRyYW5zZm9ybSgpKTtcblxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtcztcbiAgICB9XG5cbiAgICBfYWRkQm91bmRBcmdzU2VsZWN0b3JHZXR0ZXIgKG9iaiwgc2VsZWN0b3JBcmdzKSB7XG4gICAgICAgIGRlZmluZUxhenlQcm9wZXJ0eShvYmosICdzZWxlY3RvcicsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKHRoaXMuZ2V0RnVuY3Rpb24oKSwgeyBib3VuZEFyZ3M6IHNlbGVjdG9yQXJncyB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuZ2V0RnVuY3Rpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2RlY29yYXRlRnVuY3Rpb24gKHNlbGVjdG9yRm4pIHtcbiAgICAgICAgc3VwZXIuX2RlY29yYXRlRnVuY3Rpb24oc2VsZWN0b3JGbik7XG5cbiAgICAgICAgYWRkQVBJKHNlbGVjdG9yRm4sICgpID0+IHNlbGVjdG9yRm4sIFNlbGVjdG9yQnVpbGRlciwgdGhpcy5vcHRpb25zLmN1c3RvbURPTVByb3BlcnRpZXMsIHRoaXMub3B0aW9ucy5jdXN0b21NZXRob2RzKTtcbiAgICB9XG5cbiAgICBfZ2V0Q2xpZW50Rm5XaXRoT3ZlcnJpZGRlbk9wdGlvbnMgKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgYXBpRm4gICAgICAgICAgICAgID0gcHJlcGFyZUFwaUZuQXJncygnd2l0aCcsIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCBwcmV2aW91c1NlbGVjdG9ySUQgPSB0aGlzLm9wdGlvbnMuYXBpRm5DaGFpbi5sZW5ndGggLSAxO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5fZ2V0Q2xpZW50Rm5XaXRoT3ZlcnJpZGRlbk9wdGlvbnMoT2JqZWN0LmFzc2lnbihvcHRpb25zLCB7IGFwaUZuLCBhcGlGbklEOiBwcmV2aW91c1NlbGVjdG9ySUQgfSkpO1xuICAgIH1cblxuICAgIF9wcm9jZXNzUmVzdWx0IChyZXN1bHQsIHNlbGVjdG9yQXJncykge1xuICAgICAgICBjb25zdCBzbmFwc2hvdCA9IHN1cGVyLl9wcm9jZXNzUmVzdWx0KHJlc3VsdCwgc2VsZWN0b3JBcmdzKTtcblxuICAgICAgICBpZiAoc25hcHNob3QgJiYgIXJldHVyblNpbmdsZVByb3BNb2RlKHRoaXMub3B0aW9ucykpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEJvdW5kQXJnc1NlbGVjdG9yR2V0dGVyKHNuYXBzaG90LCBzZWxlY3RvckFyZ3MpO1xuICAgICAgICAgICAgY3JlYXRlU25hcHNob3RNZXRob2RzKHNuYXBzaG90KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21NZXRob2RzKVxuICAgICAgICAgICAgICAgIGFkZEN1c3RvbU1ldGhvZHMoc25hcHNob3QsICgpID0+IHNuYXBzaG90LnNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIsIHRoaXMub3B0aW9ucy5jdXN0b21NZXRob2RzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzbmFwc2hvdDtcbiAgICB9XG59XG5cbiJdfQ==