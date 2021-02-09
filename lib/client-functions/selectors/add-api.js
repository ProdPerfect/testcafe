"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAPI = exports.addCustomMethods = void 0;
const util_1 = require("util");
const lodash_1 = require("lodash");
const builder_symbol_1 = __importDefault(require("../builder-symbol"));
const snapshot_properties_1 = require("./snapshot-properties");
const get_callsite_1 = require("../../errors/get-callsite");
const client_function_builder_1 = __importDefault(require("../client-function-builder"));
const re_executable_promise_1 = __importDefault(require("../../utils/re-executable-promise"));
const type_assertions_1 = require("../../errors/runtime/type-assertions");
const make_reg_exp_1 = __importDefault(require("../../utils/make-reg-exp"));
const selector_text_filter_1 = __importDefault(require("./selector-text-filter"));
const selector_attribute_filter_1 = __importDefault(require("./selector-attribute-filter"));
const prepare_api_args_1 = __importDefault(require("./prepare-api-args"));
const callsite_1 = require("../../utils/callsite");
const VISIBLE_PROP_NAME = 'visible';
const SNAPSHOT_PROP_PRIMITIVE = `[object ${re_executable_promise_1.default.name}]`;
const filterNodes = (new client_function_builder_1.default((nodes, filter, querySelectorRoot, originNode, ...filterArgs) => {
    if (typeof filter === 'number') {
        const matchingNode = filter < 0 ? nodes[nodes.length + filter] : nodes[filter];
        return matchingNode ? [matchingNode] : [];
    }
    const result = [];
    if (typeof filter === 'string') {
        // NOTE: we can search for elements only in document/element/shadow root.
        if (querySelectorRoot.nodeType !== 1 && querySelectorRoot.nodeType !== 9 && querySelectorRoot.nodeType !== 11)
            return null;
        const matching = querySelectorRoot.querySelectorAll(filter);
        const matchingArr = [];
        for (let i = 0; i < matching.length; i++)
            matchingArr.push(matching[i]);
        filter = node => matchingArr.indexOf(node) > -1;
    }
    if (typeof filter === 'function') {
        for (let j = 0; j < nodes.length; j++) {
            if (filter(nodes[j], j, originNode, ...filterArgs))
                result.push(nodes[j]);
        }
    }
    return result;
})).getFunction();
const expandSelectorResults = (new client_function_builder_1.default((selector, populateDerivativeNodes) => {
    const nodes = selector();
    if (!nodes.length)
        return null;
    const result = [];
    for (let i = 0; i < nodes.length; i++) {
        const derivativeNodes = populateDerivativeNodes(nodes[i]);
        if (derivativeNodes) {
            for (let j = 0; j < derivativeNodes.length; j++) {
                if (result.indexOf(derivativeNodes[j]) < 0)
                    result.push(derivativeNodes[j]);
            }
        }
    }
    return result;
})).getFunction();
async function getSnapshot(getSelector, callsite, SelectorBuilder, getVisibleValueMode) {
    let node = null;
    const selector = new SelectorBuilder(getSelector(), { getVisibleValueMode, needError: true }, { instantiation: 'Selector' }).getFunction();
    try {
        node = await selector();
    }
    catch (err) {
        err.callsite = callsite;
        throw err;
    }
    return node;
}
function assertAddCustomDOMPropertiesOptions(properties) {
    type_assertions_1.assertType(type_assertions_1.is.nonNullObject, 'addCustomDOMProperties', '"addCustomDOMProperties" option', properties);
    Object.keys(properties).forEach(prop => {
        type_assertions_1.assertType(type_assertions_1.is.function, 'addCustomDOMProperties', `Custom DOM properties method '${prop}'`, properties[prop]);
    });
}
function assertAddCustomMethods(properties, opts) {
    type_assertions_1.assertType(type_assertions_1.is.nonNullObject, 'addCustomMethods', '"addCustomMethods" option', properties);
    if (opts !== void 0)
        type_assertions_1.assertType(type_assertions_1.is.nonNullObject, 'addCustomMethods', '"addCustomMethods" option', opts);
    Object.keys(properties).forEach(prop => {
        type_assertions_1.assertType(type_assertions_1.is.function, 'addCustomMethods', `Custom method '${prop}'`, properties[prop]);
    });
}
function getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, additionalDependencies) {
    return Object.assign({}, options, { selectorFn, apiFn, filter, additionalDependencies });
}
function createPrimitiveGetterWrapper(observedCallsites, callsite) {
    return () => {
        if (observedCallsites)
            observedCallsites.unawaitedSnapshotCallsites.add(callsite);
        return SNAPSHOT_PROP_PRIMITIVE;
    };
}
function checkForExcessiveAwaits(snapshotPropertyCallsites, checkedCallsite) {
    const callsiteId = callsite_1.getCallsiteId(checkedCallsite);
    // NOTE: If there is an asserted callsite, it means that .expect() was already called.
    // We don't raise a warning and delete the callsite.
    if (snapshotPropertyCallsites[callsiteId] && snapshotPropertyCallsites[callsiteId].checked)
        delete snapshotPropertyCallsites[callsiteId];
    // NOTE: If the calliste already exists, but is not asserted, it means that there are
    // multiple awaited callsites in one assertion. We raise a warning for each of them.
    else if (snapshotPropertyCallsites[callsiteId] && !snapshotPropertyCallsites[callsiteId].checked)
        snapshotPropertyCallsites[callsiteId].callsites.push(checkedCallsite);
    else
        snapshotPropertyCallsites[callsiteId] = { callsites: [checkedCallsite], checked: false };
}
function addSnapshotProperties(obj, getSelector, SelectorBuilder, properties, observedCallsites) {
    properties.forEach(prop => {
        Object.defineProperty(obj, prop, {
            get: () => {
                const callsite = get_callsite_1.getCallsiteForMethod('get');
                const propertyPromise = re_executable_promise_1.default.fromFn(async () => {
                    const snapshot = await getSnapshot(getSelector, callsite, SelectorBuilder);
                    return snapshot[prop];
                });
                const primitiveGetterWrapper = createPrimitiveGetterWrapper(observedCallsites, callsite);
                propertyPromise[Symbol.toPrimitive] = primitiveGetterWrapper;
                propertyPromise[util_1.inspect.custom] = primitiveGetterWrapper;
                propertyPromise.then = function (onFulfilled, onRejected) {
                    if (observedCallsites) {
                        checkForExcessiveAwaits(observedCallsites.snapshotPropertyCallsites, callsite);
                        observedCallsites.unawaitedSnapshotCallsites.delete(callsite);
                    }
                    this._ensureExecuting();
                    return this._taskPromise.then(onFulfilled, onRejected);
                };
                return propertyPromise;
            }
        });
    });
}
function addVisibleProperty({ obj, getSelector, SelectorBuilder }) {
    Object.defineProperty(obj, VISIBLE_PROP_NAME, {
        get: () => {
            const callsite = get_callsite_1.getCallsiteForMethod('get');
            return re_executable_promise_1.default.fromFn(async () => {
                const snapshot = await getSnapshot(getSelector, callsite, SelectorBuilder, true);
                return !!snapshot && snapshot[VISIBLE_PROP_NAME];
            });
        }
    });
}
function addCustomMethods(obj, getSelector, SelectorBuilder, customMethods) {
    const customMethodProps = customMethods ? Object.keys(customMethods) : [];
    customMethodProps.forEach(prop => {
        const { returnDOMNodes = false, method } = customMethods[prop];
        const dependencies = {
            customMethod: method,
            selector: getSelector()
        };
        const callsiteNames = { instantiation: prop };
        if (returnDOMNodes) {
            obj[prop] = (...args) => {
                const selectorFn = () => {
                    /* eslint-disable no-undef */
                    const nodes = selector();
                    return customMethod.apply(customMethod, [nodes].concat(args));
                    /* eslint-enable no-undef */
                };
                const apiFn = prepare_api_args_1.default(prop, ...args);
                const filter = () => true;
                const additionalDependencies = {
                    args,
                    customMethod: method
                };
                return createDerivativeSelectorWithFilter({ getSelector, SelectorBuilder, selectorFn, apiFn, filter, additionalDependencies });
            };
        }
        else {
            obj[prop] = (new client_function_builder_1.default((...args) => {
                /* eslint-disable no-undef */
                const node = selector();
                return customMethod.apply(customMethod, [node].concat(args));
                /* eslint-enable no-undef */
            }, { dependencies }, callsiteNames)).getFunction();
        }
    });
}
exports.addCustomMethods = addCustomMethods;
function prepareSnapshotPropertyList(customDOMProperties) {
    let properties = [...snapshot_properties_1.SNAPSHOT_PROPERTIES];
    // NOTE: The 'visible' snapshot property has a separate handler.
    lodash_1.pull(properties, VISIBLE_PROP_NAME);
    if (customDOMProperties)
        properties = properties.concat(Object.keys(customDOMProperties));
    return properties;
}
function addSnapshotPropertyShorthands({ obj, getSelector, SelectorBuilder, customDOMProperties, customMethods, observedCallsites }) {
    const properties = prepareSnapshotPropertyList(customDOMProperties);
    addSnapshotProperties(obj, getSelector, SelectorBuilder, properties, observedCallsites);
    addCustomMethods(obj, getSelector, SelectorBuilder, customMethods);
    obj.getStyleProperty = prop => {
        const callsite = get_callsite_1.getCallsiteForMethod('getStyleProperty');
        return re_executable_promise_1.default.fromFn(async () => {
            const snapshot = await getSnapshot(getSelector, callsite, SelectorBuilder);
            return snapshot.style ? snapshot.style[prop] : void 0;
        });
    };
    obj.getAttribute = attrName => {
        const callsite = get_callsite_1.getCallsiteForMethod('getAttribute');
        return re_executable_promise_1.default.fromFn(async () => {
            const snapshot = await getSnapshot(getSelector, callsite, SelectorBuilder);
            return snapshot.attributes ? snapshot.attributes[attrName] : void 0;
        });
    };
    obj.hasAttribute = attrName => {
        const callsite = get_callsite_1.getCallsiteForMethod('hasAttribute');
        return re_executable_promise_1.default.fromFn(async () => {
            const snapshot = await getSnapshot(getSelector, callsite, SelectorBuilder);
            return snapshot.attributes ? snapshot.attributes.hasOwnProperty(attrName) : false;
        });
    };
    obj.getBoundingClientRectProperty = prop => {
        const callsite = get_callsite_1.getCallsiteForMethod('getBoundingClientRectProperty');
        return re_executable_promise_1.default.fromFn(async () => {
            const snapshot = await getSnapshot(getSelector, callsite, SelectorBuilder);
            return snapshot.boundingClientRect ? snapshot.boundingClientRect[prop] : void 0;
        });
    };
    obj.hasClass = name => {
        const callsite = get_callsite_1.getCallsiteForMethod('hasClass');
        return re_executable_promise_1.default.fromFn(async () => {
            const snapshot = await getSnapshot(getSelector, callsite, SelectorBuilder);
            return snapshot.classNames ? snapshot.classNames.indexOf(name) > -1 : false;
        });
    };
}
function createCounter(getSelector, SelectorBuilder) {
    const builder = new SelectorBuilder(getSelector(), { counterMode: true }, { instantiation: 'Selector' });
    const counter = builder.getFunction();
    const callsite = get_callsite_1.getCallsiteForMethod('get');
    return async () => {
        try {
            return await counter();
        }
        catch (err) {
            err.callsite = callsite;
            throw err;
        }
    };
}
function addCounterProperties({ obj, getSelector, SelectorBuilder }) {
    Object.defineProperty(obj, 'count', {
        get: () => {
            const counter = createCounter(getSelector, SelectorBuilder);
            return re_executable_promise_1.default.fromFn(() => counter());
        }
    });
    Object.defineProperty(obj, 'exists', {
        get: () => {
            const counter = createCounter(getSelector, SelectorBuilder);
            return re_executable_promise_1.default.fromFn(async () => await counter() > 0);
        }
    });
}
function convertFilterToClientFunctionIfNecessary(callsiteName, filter, dependencies) {
    if (typeof filter === 'function') {
        const builder = filter[builder_symbol_1.default];
        const fn = builder ? builder.fn : filter;
        const options = builder ? lodash_1.assign({}, builder.options, { dependencies }) : { dependencies };
        return (new client_function_builder_1.default(fn, options, { instantiation: callsiteName })).getFunction();
    }
    return filter;
}
function createDerivativeSelectorWithFilter({ getSelector, SelectorBuilder, selectorFn, apiFn, filter, additionalDependencies }) {
    const collectionModeSelectorBuilder = new SelectorBuilder(getSelector(), { collectionMode: true });
    const customDOMProperties = collectionModeSelectorBuilder.options.customDOMProperties;
    const customMethods = collectionModeSelectorBuilder.options.customMethods;
    let dependencies = {
        selector: collectionModeSelectorBuilder.getFunction(),
        filter: filter,
        filterNodes: filterNodes
    };
    const { boundTestRun, timeout, visibilityCheck, apiFnChain } = collectionModeSelectorBuilder.options;
    dependencies = lodash_1.assign(dependencies, additionalDependencies);
    const builder = new SelectorBuilder(selectorFn, {
        dependencies,
        customDOMProperties,
        customMethods,
        boundTestRun,
        timeout,
        visibilityCheck,
        apiFnChain,
        apiFn
    }, { instantiation: 'Selector' });
    return builder.getFunction();
}
const filterByText = convertFilterToClientFunctionIfNecessary('filter', selector_text_filter_1.default);
const filterByAttr = convertFilterToClientFunctionIfNecessary('filter', selector_attribute_filter_1.default);
function ensureRegExpContext(str) {
    // NOTE: if a regexp is created in a separate context (via the 'vm' module) we
    // should wrap it with new RegExp() to make the `instanceof RegExp` check successful.
    if (typeof str !== 'string' && !(str instanceof RegExp))
        return new RegExp(str);
    return str;
}
function addFilterMethods(options) {
    const { obj, getSelector, SelectorBuilder } = options;
    obj.nth = index => {
        type_assertions_1.assertType(type_assertions_1.is.number, 'nth', '"index" argument', index);
        const apiFn = prepare_api_args_1.default('nth', index);
        const builder = new SelectorBuilder(getSelector(), { index, apiFn }, { instantiation: 'Selector' });
        return builder.getFunction();
    };
    obj.withText = text => {
        type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.regExp], 'withText', '"text" argument', text);
        const apiFn = prepare_api_args_1.default('withText', text);
        text = ensureRegExpContext(text);
        const selectorFn = () => {
            /* eslint-disable no-undef */
            const nodes = selector();
            if (!nodes.length)
                return null;
            return filterNodes(nodes, filter, document, void 0, textRe);
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filterByText, { textRe: make_reg_exp_1.default(text) });
        return createDerivativeSelectorWithFilter(args);
    };
    obj.withExactText = text => {
        type_assertions_1.assertType(type_assertions_1.is.string, 'withExactText', '"text" argument', text);
        const selectorFn = () => {
            /* eslint-disable no-undef */
            const nodes = selector();
            if (!nodes.length)
                return null;
            return filterNodes(nodes, filter, document, void 0, exactText);
            /* eslint-enable no-undef */
        };
        const apiFn = prepare_api_args_1.default('withExactText', text);
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filterByText, { exactText: text });
        return createDerivativeSelectorWithFilter(args);
    };
    obj.withAttribute = (attrName, attrValue) => {
        type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.regExp], 'withAttribute', '"attrName" argument', attrName);
        const apiFn = prepare_api_args_1.default('withAttribute', attrName, attrValue);
        attrName = ensureRegExpContext(attrName);
        if (attrValue !== void 0) {
            type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.regExp], 'withAttribute', '"attrValue" argument', attrValue);
            attrValue = ensureRegExpContext(attrValue);
        }
        const selectorFn = () => {
            /* eslint-disable no-undef */
            const nodes = selector();
            if (!nodes.length)
                return null;
            return filterNodes(nodes, filter, document, void 0, attrName, attrValue);
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filterByAttr, {
            attrName,
            attrValue
        });
        return createDerivativeSelectorWithFilter(args);
    };
    obj.filter = (filter, dependencies) => {
        type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.function], 'filter', '"filter" argument', filter);
        const apiFn = prepare_api_args_1.default('filter', filter);
        filter = convertFilterToClientFunctionIfNecessary('filter', filter, dependencies);
        const selectorFn = () => {
            /* eslint-disable no-undef */
            const nodes = selector();
            if (!nodes.length)
                return null;
            return filterNodes(nodes, filter, document, void 0);
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter);
        return createDerivativeSelectorWithFilter(args);
    };
    obj.filterVisible = () => {
        const apiFn = prepare_api_args_1.default('filterVisible');
        const builder = new SelectorBuilder(getSelector(), { filterVisible: true, apiFn }, { instantiation: 'Selector' });
        return builder.getFunction();
    };
    obj.filterHidden = () => {
        const apiFn = prepare_api_args_1.default('filterHidden');
        const builder = new SelectorBuilder(getSelector(), { filterHidden: true, apiFn }, { instantiation: 'Selector' });
        return builder.getFunction();
    };
}
function addCustomDOMPropertiesMethod({ obj, getSelector, SelectorBuilder }) {
    obj.addCustomDOMProperties = customDOMProperties => {
        assertAddCustomDOMPropertiesOptions(customDOMProperties);
        const builder = new SelectorBuilder(getSelector(), { customDOMProperties }, { instantiation: 'Selector' });
        return builder.getFunction();
    };
}
function addCustomMethodsMethod({ obj, getSelector, SelectorBuilder }) {
    obj.addCustomMethods = function (methods, opts) {
        assertAddCustomMethods(methods, opts);
        const customMethods = {};
        Object.keys(methods).forEach(methodName => {
            customMethods[methodName] = {
                method: methods[methodName],
                returnDOMNodes: opts && !!opts.returnDOMNodes
            };
        });
        const builder = new SelectorBuilder(getSelector(), { customMethods }, { instantiation: 'Selector' });
        return builder.getFunction();
    };
}
function addHierarchicalSelectors(options) {
    const { obj } = options;
    // Find
    obj.find = (filter, dependencies) => {
        type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.function], 'find', '"filter" argument', filter);
        const apiFn = prepare_api_args_1.default('find', filter);
        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);
        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                if (typeof filter === 'string') {
                    return typeof node.querySelectorAll === 'function' ?
                        node.querySelectorAll(filter) :
                        null;
                }
                const results = [];
                const visitNode = currentNode => {
                    const cnLength = currentNode.childNodes.length;
                    for (let i = 0; i < cnLength; i++) {
                        const child = currentNode.childNodes[i];
                        results.push(child);
                        visitNode(child);
                    }
                };
                visitNode(node);
                return filterNodes(results, filter, null, node);
            });
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });
        return createDerivativeSelectorWithFilter(args);
    };
    // Parent
    obj.parent = (filter, dependencies) => {
        if (filter !== void 0)
            type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.function, type_assertions_1.is.number], 'parent', '"filter" argument', filter);
        const apiFn = prepare_api_args_1.default('parent', filter);
        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);
        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const parents = [];
                for (let parent = node.parentNode; parent; parent = parent.parentNode)
                    parents.push(parent);
                return filter !== void 0 ? filterNodes(parents, filter, document, node) : parents;
            });
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });
        return createDerivativeSelectorWithFilter(args);
    };
    // Child
    obj.child = (filter, dependencies) => {
        if (filter !== void 0)
            type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.function, type_assertions_1.is.number], 'child', '"filter" argument', filter);
        const apiFn = prepare_api_args_1.default('child', filter);
        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);
        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const childElements = [];
                const cnLength = node.childNodes.length;
                for (let i = 0; i < cnLength; i++) {
                    const child = node.childNodes[i];
                    if (child.nodeType === 1)
                        childElements.push(child);
                }
                return filter !== void 0 ? filterNodes(childElements, filter, node, node) : childElements;
            });
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });
        return createDerivativeSelectorWithFilter(args);
    };
    // Sibling
    obj.sibling = (filter, dependencies) => {
        if (filter !== void 0)
            type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.function, type_assertions_1.is.number], 'sibling', '"filter" argument', filter);
        const apiFn = prepare_api_args_1.default('sibling', filter);
        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);
        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const parent = node.parentNode;
                if (!parent)
                    return null;
                const siblings = [];
                const cnLength = parent.childNodes.length;
                for (let i = 0; i < cnLength; i++) {
                    const child = parent.childNodes[i];
                    if (child.nodeType === 1 && child !== node)
                        siblings.push(child);
                }
                return filter !== void 0 ? filterNodes(siblings, filter, parent, node) : siblings;
            });
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });
        return createDerivativeSelectorWithFilter(args);
    };
    // Next sibling
    obj.nextSibling = (filter, dependencies) => {
        if (filter !== void 0)
            type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.function, type_assertions_1.is.number], 'nextSibling', '"filter" argument', filter);
        const apiFn = prepare_api_args_1.default('nextSibling', filter);
        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);
        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const parent = node.parentNode;
                if (!parent)
                    return null;
                const siblings = [];
                const cnLength = parent.childNodes.length;
                let afterNode = false;
                for (let i = 0; i < cnLength; i++) {
                    const child = parent.childNodes[i];
                    if (child === node)
                        afterNode = true;
                    else if (afterNode && child.nodeType === 1)
                        siblings.push(child);
                }
                return filter !== void 0 ? filterNodes(siblings, filter, parent, node) : siblings;
            });
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });
        return createDerivativeSelectorWithFilter(args);
    };
    // Prev sibling
    obj.prevSibling = (filter, dependencies) => {
        if (filter !== void 0)
            type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.function, type_assertions_1.is.number], 'prevSibling', '"filter" argument', filter);
        const apiFn = prepare_api_args_1.default('prevSibling', filter);
        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);
        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const parent = node.parentNode;
                if (!parent)
                    return null;
                const siblings = [];
                const cnLength = parent.childNodes.length;
                for (let i = 0; i < cnLength; i++) {
                    const child = parent.childNodes[i];
                    if (child === node)
                        break;
                    if (child.nodeType === 1)
                        siblings.push(child);
                }
                return filter !== void 0 ? filterNodes(siblings, filter, parent, node) : siblings;
            });
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });
        return createDerivativeSelectorWithFilter(args);
    };
    // ShadowRoot
    obj.shadowRoot = () => {
        const apiFn = prepare_api_args_1.default('shadowRoot');
        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                return !node.shadowRoot ? null : [node.shadowRoot];
            });
            /* eslint-enable no-undef */
        };
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, void 0, { expandSelectorResults });
        return createDerivativeSelectorWithFilter(args);
    };
}
function addAPI(selector, getSelector, SelectorBuilder, customDOMProperties, customMethods, observedCallsites) {
    const options = { obj: selector, getSelector, SelectorBuilder, customDOMProperties, customMethods, observedCallsites };
    addFilterMethods(options);
    addHierarchicalSelectors(options);
    addSnapshotPropertyShorthands(options);
    addCustomDOMPropertiesMethod(options);
    addCustomMethodsMethod(options);
    addCounterProperties(options);
    addVisibleProperty(options);
}
exports.addAPI = addAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQtZnVuY3Rpb25zL3NlbGVjdG9ycy9hZGQtYXBpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtCQUErQjtBQUMvQixtQ0FBZ0Q7QUFDaEQsdUVBQTREO0FBQzVELCtEQUE0RDtBQUM1RCw0REFBaUU7QUFDakUseUZBQStEO0FBQy9ELDhGQUFvRTtBQUNwRSwwRUFBc0U7QUFDdEUsNEVBQWtEO0FBQ2xELGtGQUF3RDtBQUN4RCw0RkFBa0U7QUFDbEUsMEVBQWtEO0FBQ2xELG1EQUFxRDtBQUVyRCxNQUFNLGlCQUFpQixHQUFTLFNBQVMsQ0FBQztBQUMxQyxNQUFNLHVCQUF1QixHQUFHLFdBQVcsK0JBQW1CLENBQUMsSUFBSSxHQUFHLENBQUM7QUFFdkUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFJLGlDQUFxQixDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsR0FBRyxVQUFVLEVBQUUsRUFBRTtJQUMzRyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUM1QixNQUFNLFlBQVksR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9FLE9BQU8sWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDN0M7SUFFRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFFbEIsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDNUIseUVBQXlFO1FBQ3pFLElBQUksaUJBQWlCLENBQUMsUUFBUSxLQUFLLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxRQUFRLEtBQUssQ0FB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LElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7WUFDSCw0QkFBNEI7UUFDaEMsQ0FBQyxDQUFDO1FBRUYsTUFBTSxJQUFJLEdBQUcseUJBQXlCLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7UUFFdEcsT0FBTyxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBZ0IsTUFBTSxDQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxpQkFBaUI7SUFDakgsTUFBTSxPQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLENBQUM7SUFFdkgsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUIsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsNkJBQTZCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsNEJBQTRCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQVZELHdCQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5zcGVjdCB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IHsgYXNzaWduLCBwdWxsIGFzIHJlbW92ZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgY2xpZW50RnVuY3Rpb25CdWlsZGVyU3ltYm9sIGZyb20gJy4uL2J1aWxkZXItc3ltYm9sJztcbmltcG9ydCB7IFNOQVBTSE9UX1BST1BFUlRJRVMgfSBmcm9tICcuL3NuYXBzaG90LXByb3BlcnRpZXMnO1xuaW1wb3J0IHsgZ2V0Q2FsbHNpdGVGb3JNZXRob2QgfSBmcm9tICcuLi8uLi9lcnJvcnMvZ2V0LWNhbGxzaXRlJztcbmltcG9ydCBDbGllbnRGdW5jdGlvbkJ1aWxkZXIgZnJvbSAnLi4vY2xpZW50LWZ1bmN0aW9uLWJ1aWxkZXInO1xuaW1wb3J0IFJlRXhlY3V0YWJsZVByb21pc2UgZnJvbSAnLi4vLi4vdXRpbHMvcmUtZXhlY3V0YWJsZS1wcm9taXNlJztcbmltcG9ydCB7IGFzc2VydFR5cGUsIGlzIH0gZnJvbSAnLi4vLi4vZXJyb3JzL3J1bnRpbWUvdHlwZS1hc3NlcnRpb25zJztcbmltcG9ydCBtYWtlUmVnRXhwIGZyb20gJy4uLy4uL3V0aWxzL21ha2UtcmVnLWV4cCc7XG5pbXBvcnQgc2VsZWN0b3JUZXh0RmlsdGVyIGZyb20gJy4vc2VsZWN0b3ItdGV4dC1maWx0ZXInO1xuaW1wb3J0IHNlbGVjdG9yQXR0cmlidXRlRmlsdGVyIGZyb20gJy4vc2VsZWN0b3ItYXR0cmlidXRlLWZpbHRlcic7XG5pbXBvcnQgcHJlcGFyZUFwaUZuQXJncyBmcm9tICcuL3ByZXBhcmUtYXBpLWFyZ3MnO1xuaW1wb3J0IHsgZ2V0Q2FsbHNpdGVJZCB9IGZyb20gJy4uLy4uL3V0aWxzL2NhbGxzaXRlJztcblxuY29uc3QgVklTSUJMRV9QUk9QX05BTUUgICAgICAgPSAndmlzaWJsZSc7XG5jb25zdCBTTkFQU0hPVF9QUk9QX1BSSU1JVElWRSA9IGBbb2JqZWN0ICR7UmVFeGVjdXRhYmxlUHJvbWlzZS5uYW1lfV1gO1xuXG5jb25zdCBmaWx0ZXJOb2RlcyA9IChuZXcgQ2xpZW50RnVuY3Rpb25CdWlsZGVyKChub2RlcywgZmlsdGVyLCBxdWVyeVNlbGVjdG9yUm9vdCwgb3JpZ2luTm9kZSwgLi4uZmlsdGVyQXJncykgPT4ge1xuICAgIGlmICh0eXBlb2YgZmlsdGVyID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb25zdCBtYXRjaGluZ05vZGUgPSBmaWx0ZXIgPCAwID8gbm9kZXNbbm9kZXMubGVuZ3RoICsgZmlsdGVyXSA6IG5vZGVzW2ZpbHRlcl07XG5cbiAgICAgICAgcmV0dXJuIG1hdGNoaW5nTm9kZSA/IFttYXRjaGluZ05vZGVdIDogW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG5cbiAgICBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gTk9URTogd2UgY2FuIHNlYXJjaCBmb3IgZWxlbWVudHMgb25seSBpbiBkb2N1bWVudC9lbGVtZW50L3NoYWRvdyByb290LlxuICAgICAgICBpZiAocXVlcnlTZWxlY3RvclJvb3Qubm9kZVR5cGUgIT09IDEgJiYgcXVlcnlTZWxlY3RvclJvb3Qubm9kZVR5cGUgIT09IDkgJiYgcXVlcnlTZWxlY3RvclJvb3Qubm9kZVR5cGUgIT09IDExKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgbWF0Y2hpbmcgICAgPSBxdWVyeVNlbGVjdG9yUm9vdC5xdWVyeVNlbGVjdG9yQWxsKGZpbHRlcik7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRjaGluZy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIG1hdGNoaW5nQXJyLnB1c2gobWF0Y2hpbmdbaV0pO1xuXG4gICAgICAgIGZpbHRlciA9IG5vZGUgPT4gbWF0Y2hpbmdBcnIuaW5kZXhPZihub2RlKSA+IC0xO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIobm9kZXNbal0sIGosIG9yaWdpbk5vZGUsIC4uLmZpbHRlckFyZ3MpKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5vZGVzW2pdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59KSkuZ2V0RnVuY3Rpb24oKTtcblxuY29uc3QgZXhwYW5kU2VsZWN0b3JSZXN1bHRzID0gKG5ldyBDbGllbnRGdW5jdGlvbkJ1aWxkZXIoKHNlbGVjdG9yLCBwb3B1bGF0ZURlcml2YXRpdmVOb2RlcykgPT4ge1xuICAgIGNvbnN0IG5vZGVzID0gc2VsZWN0b3IoKTtcblxuICAgIGlmICghbm9kZXMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBkZXJpdmF0aXZlTm9kZXMgPSBwb3B1bGF0ZURlcml2YXRpdmVOb2Rlcyhub2Rlc1tpXSk7XG5cbiAgICAgICAgaWYgKGRlcml2YXRpdmVOb2Rlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkZXJpdmF0aXZlTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmluZGV4T2YoZGVyaXZhdGl2ZU5vZGVzW2pdKSA8IDApXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRlcml2YXRpdmVOb2Rlc1tqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG59KSkuZ2V0RnVuY3Rpb24oKTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0U25hcHNob3QgKGdldFNlbGVjdG9yLCBjYWxsc2l0ZSwgU2VsZWN0b3JCdWlsZGVyLCBnZXRWaXNpYmxlVmFsdWVNb2RlKSB7XG4gICAgbGV0IG5vZGUgICAgICAgPSBudWxsO1xuICAgIGNvbnN0IHNlbGVjdG9yID0gbmV3IFNlbGVjdG9yQnVpbGRlcihnZXRTZWxlY3RvcigpLCB7IGdldFZpc2libGVWYWx1ZU1vZGUsIG5lZWRFcnJvcjogdHJ1ZSB9LCB7IGluc3RhbnRpYXRpb246ICdTZWxlY3RvcicgfSkuZ2V0RnVuY3Rpb24oKTtcblxuICAgIHRyeSB7XG4gICAgICAgIG5vZGUgPSBhd2FpdCBzZWxlY3RvcigpO1xuICAgIH1cblxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgZXJyLmNhbGxzaXRlID0gY2FsbHNpdGU7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0QWRkQ3VzdG9tRE9NUHJvcGVydGllc09wdGlvbnMgKHByb3BlcnRpZXMpIHtcbiAgICBhc3NlcnRUeXBlKGlzLm5vbk51bGxPYmplY3QsICdhZGRDdXN0b21ET01Qcm9wZXJ0aWVzJywgJ1wiYWRkQ3VzdG9tRE9NUHJvcGVydGllc1wiIG9wdGlvbicsIHByb3BlcnRpZXMpO1xuXG4gICAgT2JqZWN0LmtleXMocHJvcGVydGllcykuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5mdW5jdGlvbiwgJ2FkZEN1c3RvbURPTVByb3BlcnRpZXMnLCBgQ3VzdG9tIERPTSBwcm9wZXJ0aWVzIG1ldGhvZCAnJHtwcm9wfSdgLCBwcm9wZXJ0aWVzW3Byb3BdKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0QWRkQ3VzdG9tTWV0aG9kcyAocHJvcGVydGllcywgb3B0cykge1xuICAgIGFzc2VydFR5cGUoaXMubm9uTnVsbE9iamVjdCwgJ2FkZEN1c3RvbU1ldGhvZHMnLCAnXCJhZGRDdXN0b21NZXRob2RzXCIgb3B0aW9uJywgcHJvcGVydGllcyk7XG5cbiAgICBpZiAob3B0cyAhPT0gdm9pZCAwKVxuICAgICAgICBhc3NlcnRUeXBlKGlzLm5vbk51bGxPYmplY3QsICdhZGRDdXN0b21NZXRob2RzJywgJ1wiYWRkQ3VzdG9tTWV0aG9kc1wiIG9wdGlvbicsIG9wdHMpO1xuXG4gICAgT2JqZWN0LmtleXMocHJvcGVydGllcykuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5mdW5jdGlvbiwgJ2FkZEN1c3RvbU1ldGhvZHMnLCBgQ3VzdG9tIG1ldGhvZCAnJHtwcm9wfSdgLCBwcm9wZXJ0aWVzW3Byb3BdKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyAob3B0aW9ucywgc2VsZWN0b3JGbiwgYXBpRm4sIGZpbHRlciwgYWRkaXRpb25hbERlcGVuZGVuY2llcykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7IHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXIsIGFkZGl0aW9uYWxEZXBlbmRlbmNpZXMgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZUdldHRlcldyYXBwZXIgKG9ic2VydmVkQ2FsbHNpdGVzLCBjYWxsc2l0ZSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChvYnNlcnZlZENhbGxzaXRlcylcbiAgICAgICAgICAgIG9ic2VydmVkQ2FsbHNpdGVzLnVuYXdhaXRlZFNuYXBzaG90Q2FsbHNpdGVzLmFkZChjYWxsc2l0ZSk7XG5cbiAgICAgICAgcmV0dXJuIFNOQVBTSE9UX1BST1BfUFJJTUlUSVZFO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yRXhjZXNzaXZlQXdhaXRzIChzbmFwc2hvdFByb3BlcnR5Q2FsbHNpdGVzLCBjaGVja2VkQ2FsbHNpdGUpIHtcbiAgICBjb25zdCBjYWxsc2l0ZUlkID0gZ2V0Q2FsbHNpdGVJZChjaGVja2VkQ2FsbHNpdGUpO1xuXG4gICAgLy8gTk9URTogSWYgdGhlcmUgaXMgYW4gYXNzZXJ0ZWQgY2FsbHNpdGUsIGl0IG1lYW5zIHRoYXQgLmV4cGVjdCgpIHdhcyBhbHJlYWR5IGNhbGxlZC5cbiAgICAvLyBXZSBkb24ndCByYWlzZSBhIHdhcm5pbmcgYW5kIGRlbGV0ZSB0aGUgY2FsbHNpdGUuXG4gICAgaWYgKHNuYXBzaG90UHJvcGVydHlDYWxsc2l0ZXNbY2FsbHNpdGVJZF0gJiYgc25hcHNob3RQcm9wZXJ0eUNhbGxzaXRlc1tjYWxsc2l0ZUlkXS5jaGVja2VkKVxuICAgICAgICBkZWxldGUgc25hcHNob3RQcm9wZXJ0eUNhbGxzaXRlc1tjYWxsc2l0ZUlkXTtcbiAgICAvLyBOT1RFOiBJZiB0aGUgY2FsbGlzdGUgYWxyZWFkeSBleGlzdHMsIGJ1dCBpcyBub3QgYXNzZXJ0ZWQsIGl0IG1lYW5zIHRoYXQgdGhlcmUgYXJlXG4gICAgLy8gbXVsdGlwbGUgYXdhaXRlZCBjYWxsc2l0ZXMgaW4gb25lIGFzc2VydGlvbi4gV2UgcmFpc2UgYSB3YXJuaW5nIGZvciBlYWNoIG9mIHRoZW0uXG4gICAgZWxzZSBpZiAoc25hcHNob3RQcm9wZXJ0eUNhbGxzaXRlc1tjYWxsc2l0ZUlkXSAmJiAhc25hcHNob3RQcm9wZXJ0eUNhbGxzaXRlc1tjYWxsc2l0ZUlkXS5jaGVja2VkKVxuICAgICAgICBzbmFwc2hvdFByb3BlcnR5Q2FsbHNpdGVzW2NhbGxzaXRlSWRdLmNhbGxzaXRlcy5wdXNoKGNoZWNrZWRDYWxsc2l0ZSk7XG4gICAgZWxzZVxuICAgICAgICBzbmFwc2hvdFByb3BlcnR5Q2FsbHNpdGVzW2NhbGxzaXRlSWRdID0geyBjYWxsc2l0ZXM6IFsgY2hlY2tlZENhbGxzaXRlIF0sIGNoZWNrZWQ6IGZhbHNlIH07XG59XG5cbmZ1bmN0aW9uIGFkZFNuYXBzaG90UHJvcGVydGllcyAob2JqLCBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyLCBwcm9wZXJ0aWVzLCBvYnNlcnZlZENhbGxzaXRlcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FsbHNpdGUgPSBnZXRDYWxsc2l0ZUZvck1ldGhvZCgnZ2V0Jyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eVByb21pc2UgPSBSZUV4ZWN1dGFibGVQcm9taXNlLmZyb21Gbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBzaG90ID0gYXdhaXQgZ2V0U25hcHNob3QoZ2V0U2VsZWN0b3IsIGNhbGxzaXRlLCBTZWxlY3RvckJ1aWxkZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHByaW1pdGl2ZUdldHRlcldyYXBwZXIgPSBjcmVhdGVQcmltaXRpdmVHZXR0ZXJXcmFwcGVyKG9ic2VydmVkQ2FsbHNpdGVzLCBjYWxsc2l0ZSk7XG5cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVByb21pc2VbU3ltYm9sLnRvUHJpbWl0aXZlXSA9IHByaW1pdGl2ZUdldHRlcldyYXBwZXI7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlQcm9taXNlW2luc3BlY3QuY3VzdG9tXSAgICAgPSBwcmltaXRpdmVHZXR0ZXJXcmFwcGVyO1xuXG4gICAgICAgICAgICAgICAgcHJvcGVydHlQcm9taXNlLnRoZW4gPSBmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ic2VydmVkQ2FsbHNpdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0ZvckV4Y2Vzc2l2ZUF3YWl0cyhvYnNlcnZlZENhbGxzaXRlcy5zbmFwc2hvdFByb3BlcnR5Q2FsbHNpdGVzLCBjYWxsc2l0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVkQ2FsbHNpdGVzLnVuYXdhaXRlZFNuYXBzaG90Q2FsbHNpdGVzLmRlbGV0ZShjYWxsc2l0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbnN1cmVFeGVjdXRpbmcoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFza1Byb21pc2UudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRWaXNpYmxlUHJvcGVydHkgKHsgb2JqLCBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyIH0pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBWSVNJQkxFX1BST1BfTkFNRSwge1xuICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxzaXRlID0gZ2V0Q2FsbHNpdGVGb3JNZXRob2QoJ2dldCcpO1xuXG4gICAgICAgICAgICByZXR1cm4gUmVFeGVjdXRhYmxlUHJvbWlzZS5mcm9tRm4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBzaG90ID0gYXdhaXQgZ2V0U25hcHNob3QoZ2V0U2VsZWN0b3IsIGNhbGxzaXRlLCBTZWxlY3RvckJ1aWxkZXIsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhc25hcHNob3QgJiYgc25hcHNob3RbVklTSUJMRV9QUk9QX05BTUVdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEN1c3RvbU1ldGhvZHMgKG9iaiwgZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlciwgY3VzdG9tTWV0aG9kcykge1xuICAgIGNvbnN0IGN1c3RvbU1ldGhvZFByb3BzID0gY3VzdG9tTWV0aG9kcyA/IE9iamVjdC5rZXlzKGN1c3RvbU1ldGhvZHMpIDogW107XG5cbiAgICBjdXN0b21NZXRob2RQcm9wcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBjb25zdCB7IHJldHVybkRPTU5vZGVzID0gZmFsc2UsIG1ldGhvZCB9ID0gY3VzdG9tTWV0aG9kc1twcm9wXTtcblxuICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSB7XG4gICAgICAgICAgICBjdXN0b21NZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIHNlbGVjdG9yOiAgICAgZ2V0U2VsZWN0b3IoKVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNhbGxzaXRlTmFtZXMgPSB7IGluc3RhbnRpYXRpb246IHByb3AgfTtcblxuICAgICAgICBpZiAocmV0dXJuRE9NTm9kZXMpIHtcbiAgICAgICAgICAgIG9ialtwcm9wXSA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3JGbiA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBzZWxlY3RvcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXN0b21NZXRob2QuYXBwbHkoY3VzdG9tTWV0aG9kLCBbbm9kZXNdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYXBpRm4gPSBwcmVwYXJlQXBpRm5BcmdzKHByb3AsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9ICgpID0+IHRydWU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhZGRpdGlvbmFsRGVwZW5kZW5jaWVzID0ge1xuICAgICAgICAgICAgICAgICAgICBhcmdzLFxuICAgICAgICAgICAgICAgICAgICBjdXN0b21NZXRob2Q6IG1ldGhvZFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlcih7IGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIsIHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXIsIGFkZGl0aW9uYWxEZXBlbmRlbmNpZXMgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb2JqW3Byb3BdID0gKG5ldyBDbGllbnRGdW5jdGlvbkJ1aWxkZXIoKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBzZWxlY3RvcigpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1c3RvbU1ldGhvZC5hcHBseShjdXN0b21NZXRob2QsIFtub2RlXS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgICAgIH0sIHsgZGVwZW5kZW5jaWVzIH0sIGNhbGxzaXRlTmFtZXMpKS5nZXRGdW5jdGlvbigpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVTbmFwc2hvdFByb3BlcnR5TGlzdCAoY3VzdG9tRE9NUHJvcGVydGllcykge1xuICAgIGxldCBwcm9wZXJ0aWVzID0gWy4uLlNOQVBTSE9UX1BST1BFUlRJRVNdO1xuXG4gICAgLy8gTk9URTogVGhlICd2aXNpYmxlJyBzbmFwc2hvdCBwcm9wZXJ0eSBoYXMgYSBzZXBhcmF0ZSBoYW5kbGVyLlxuICAgIHJlbW92ZShwcm9wZXJ0aWVzLCBWSVNJQkxFX1BST1BfTkFNRSk7XG5cbiAgICBpZiAoY3VzdG9tRE9NUHJvcGVydGllcylcbiAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KE9iamVjdC5rZXlzKGN1c3RvbURPTVByb3BlcnRpZXMpKTtcblxuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xufVxuXG5mdW5jdGlvbiBhZGRTbmFwc2hvdFByb3BlcnR5U2hvcnRoYW5kcyAoeyBvYmosIGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIsIGN1c3RvbURPTVByb3BlcnRpZXMsIGN1c3RvbU1ldGhvZHMsIG9ic2VydmVkQ2FsbHNpdGVzIH0pIHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJlcGFyZVNuYXBzaG90UHJvcGVydHlMaXN0KGN1c3RvbURPTVByb3BlcnRpZXMpO1xuXG4gICAgYWRkU25hcHNob3RQcm9wZXJ0aWVzKG9iaiwgZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlciwgcHJvcGVydGllcywgb2JzZXJ2ZWRDYWxsc2l0ZXMpO1xuICAgIGFkZEN1c3RvbU1ldGhvZHMob2JqLCBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyLCBjdXN0b21NZXRob2RzKTtcblxuICAgIG9iai5nZXRTdHlsZVByb3BlcnR5ID0gcHJvcCA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxzaXRlID0gZ2V0Q2FsbHNpdGVGb3JNZXRob2QoJ2dldFN0eWxlUHJvcGVydHknKTtcblxuICAgICAgICByZXR1cm4gUmVFeGVjdXRhYmxlUHJvbWlzZS5mcm9tRm4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc25hcHNob3QgPSBhd2FpdCBnZXRTbmFwc2hvdChnZXRTZWxlY3RvciwgY2FsbHNpdGUsIFNlbGVjdG9yQnVpbGRlcik7XG5cbiAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdC5zdHlsZSA/IHNuYXBzaG90LnN0eWxlW3Byb3BdIDogdm9pZCAwO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JqLmdldEF0dHJpYnV0ZSA9IGF0dHJOYW1lID0+IHtcbiAgICAgICAgY29uc3QgY2FsbHNpdGUgPSBnZXRDYWxsc2l0ZUZvck1ldGhvZCgnZ2V0QXR0cmlidXRlJyk7XG5cbiAgICAgICAgcmV0dXJuIFJlRXhlY3V0YWJsZVByb21pc2UuZnJvbUZuKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNuYXBzaG90ID0gYXdhaXQgZ2V0U25hcHNob3QoZ2V0U2VsZWN0b3IsIGNhbGxzaXRlLCBTZWxlY3RvckJ1aWxkZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gc25hcHNob3QuYXR0cmlidXRlcyA/IHNuYXBzaG90LmF0dHJpYnV0ZXNbYXR0ck5hbWVdIDogdm9pZCAwO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JqLmhhc0F0dHJpYnV0ZSA9IGF0dHJOYW1lID0+IHtcbiAgICAgICAgY29uc3QgY2FsbHNpdGUgPSBnZXRDYWxsc2l0ZUZvck1ldGhvZCgnaGFzQXR0cmlidXRlJyk7XG5cbiAgICAgICAgcmV0dXJuIFJlRXhlY3V0YWJsZVByb21pc2UuZnJvbUZuKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNuYXBzaG90ID0gYXdhaXQgZ2V0U25hcHNob3QoZ2V0U2VsZWN0b3IsIGNhbGxzaXRlLCBTZWxlY3RvckJ1aWxkZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gc25hcHNob3QuYXR0cmlidXRlcyA/IHNuYXBzaG90LmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpIDogZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYmouZ2V0Qm91bmRpbmdDbGllbnRSZWN0UHJvcGVydHkgPSBwcm9wID0+IHtcbiAgICAgICAgY29uc3QgY2FsbHNpdGUgPSBnZXRDYWxsc2l0ZUZvck1ldGhvZCgnZ2V0Qm91bmRpbmdDbGllbnRSZWN0UHJvcGVydHknKTtcblxuICAgICAgICByZXR1cm4gUmVFeGVjdXRhYmxlUHJvbWlzZS5mcm9tRm4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc25hcHNob3QgPSBhd2FpdCBnZXRTbmFwc2hvdChnZXRTZWxlY3RvciwgY2FsbHNpdGUsIFNlbGVjdG9yQnVpbGRlcik7XG5cbiAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdC5ib3VuZGluZ0NsaWVudFJlY3QgPyBzbmFwc2hvdC5ib3VuZGluZ0NsaWVudFJlY3RbcHJvcF0gOiB2b2lkIDA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYmouaGFzQ2xhc3MgPSBuYW1lID0+IHtcbiAgICAgICAgY29uc3QgY2FsbHNpdGUgPSBnZXRDYWxsc2l0ZUZvck1ldGhvZCgnaGFzQ2xhc3MnKTtcblxuICAgICAgICByZXR1cm4gUmVFeGVjdXRhYmxlUHJvbWlzZS5mcm9tRm4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc25hcHNob3QgPSBhd2FpdCBnZXRTbmFwc2hvdChnZXRTZWxlY3RvciwgY2FsbHNpdGUsIFNlbGVjdG9yQnVpbGRlcik7XG5cbiAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdC5jbGFzc05hbWVzID8gc25hcHNob3QuY2xhc3NOYW1lcy5pbmRleE9mKG5hbWUpID4gLTEgOiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ291bnRlciAoZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlcikge1xuICAgIGNvbnN0IGJ1aWxkZXIgID0gbmV3IFNlbGVjdG9yQnVpbGRlcihnZXRTZWxlY3RvcigpLCB7IGNvdW50ZXJNb2RlOiB0cnVlIH0sIHsgaW5zdGFudGlhdGlvbjogJ1NlbGVjdG9yJyB9KTtcbiAgICBjb25zdCBjb3VudGVyICA9IGJ1aWxkZXIuZ2V0RnVuY3Rpb24oKTtcbiAgICBjb25zdCBjYWxsc2l0ZSA9IGdldENhbGxzaXRlRm9yTWV0aG9kKCdnZXQnKTtcblxuICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgY291bnRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZXJyLmNhbGxzaXRlID0gY2FsbHNpdGU7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhZGRDb3VudGVyUHJvcGVydGllcyAoeyBvYmosIGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIgfSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosICdjb3VudCcsIHtcbiAgICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb3VudGVyID0gY3JlYXRlQ291bnRlcihnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIFJlRXhlY3V0YWJsZVByb21pc2UuZnJvbUZuKCgpID0+IGNvdW50ZXIoKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosICdleGlzdHMnLCB7XG4gICAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY291bnRlciA9IGNyZWF0ZUNvdW50ZXIoZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlcik7XG5cbiAgICAgICAgICAgIHJldHVybiBSZUV4ZWN1dGFibGVQcm9taXNlLmZyb21Gbihhc3luYyAoKSA9PiBhd2FpdCBjb3VudGVyKCkgPiAwKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5IChjYWxsc2l0ZU5hbWUsIGZpbHRlciwgZGVwZW5kZW5jaWVzKSB7XG4gICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgYnVpbGRlciA9IGZpbHRlcltjbGllbnRGdW5jdGlvbkJ1aWxkZXJTeW1ib2xdO1xuICAgICAgICBjb25zdCBmbiAgICAgID0gYnVpbGRlciA/IGJ1aWxkZXIuZm4gOiBmaWx0ZXI7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBidWlsZGVyID8gYXNzaWduKHt9LCBidWlsZGVyLm9wdGlvbnMsIHsgZGVwZW5kZW5jaWVzIH0pIDogeyBkZXBlbmRlbmNpZXMgfTtcblxuICAgICAgICByZXR1cm4gKG5ldyBDbGllbnRGdW5jdGlvbkJ1aWxkZXIoZm4sIG9wdGlvbnMsIHsgaW5zdGFudGlhdGlvbjogY2FsbHNpdGVOYW1lIH0pKS5nZXRGdW5jdGlvbigpO1xuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZURlcml2YXRpdmVTZWxlY3RvcldpdGhGaWx0ZXIgKHsgZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlciwgc2VsZWN0b3JGbiwgYXBpRm4sIGZpbHRlciwgYWRkaXRpb25hbERlcGVuZGVuY2llcyB9KSB7XG4gICAgY29uc3QgY29sbGVjdGlvbk1vZGVTZWxlY3RvckJ1aWxkZXIgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKGdldFNlbGVjdG9yKCksIHsgY29sbGVjdGlvbk1vZGU6IHRydWUgfSk7XG4gICAgY29uc3QgY3VzdG9tRE9NUHJvcGVydGllcyAgICAgICAgICAgPSBjb2xsZWN0aW9uTW9kZVNlbGVjdG9yQnVpbGRlci5vcHRpb25zLmN1c3RvbURPTVByb3BlcnRpZXM7XG4gICAgY29uc3QgY3VzdG9tTWV0aG9kcyAgICAgICAgICAgICAgICAgPSBjb2xsZWN0aW9uTW9kZVNlbGVjdG9yQnVpbGRlci5vcHRpb25zLmN1c3RvbU1ldGhvZHM7XG5cbiAgICBsZXQgZGVwZW5kZW5jaWVzID0ge1xuICAgICAgICBzZWxlY3RvcjogICAgY29sbGVjdGlvbk1vZGVTZWxlY3RvckJ1aWxkZXIuZ2V0RnVuY3Rpb24oKSxcbiAgICAgICAgZmlsdGVyOiAgICAgIGZpbHRlcixcbiAgICAgICAgZmlsdGVyTm9kZXM6IGZpbHRlck5vZGVzXG4gICAgfTtcblxuICAgIGNvbnN0IHsgYm91bmRUZXN0UnVuLCB0aW1lb3V0LCB2aXNpYmlsaXR5Q2hlY2ssIGFwaUZuQ2hhaW4gfSA9IGNvbGxlY3Rpb25Nb2RlU2VsZWN0b3JCdWlsZGVyLm9wdGlvbnM7XG5cbiAgICBkZXBlbmRlbmNpZXMgPSBhc3NpZ24oZGVwZW5kZW5jaWVzLCBhZGRpdGlvbmFsRGVwZW5kZW5jaWVzKTtcblxuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKHNlbGVjdG9yRm4sIHtcbiAgICAgICAgZGVwZW5kZW5jaWVzLFxuICAgICAgICBjdXN0b21ET01Qcm9wZXJ0aWVzLFxuICAgICAgICBjdXN0b21NZXRob2RzLFxuICAgICAgICBib3VuZFRlc3RSdW4sXG4gICAgICAgIHRpbWVvdXQsXG4gICAgICAgIHZpc2liaWxpdHlDaGVjayxcbiAgICAgICAgYXBpRm5DaGFpbixcbiAgICAgICAgYXBpRm5cbiAgICB9LCB7IGluc3RhbnRpYXRpb246ICdTZWxlY3RvcicgfSk7XG5cbiAgICByZXR1cm4gYnVpbGRlci5nZXRGdW5jdGlvbigpO1xufVxuXG5jb25zdCBmaWx0ZXJCeVRleHQgPSBjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5KCdmaWx0ZXInLCBzZWxlY3RvclRleHRGaWx0ZXIpO1xuY29uc3QgZmlsdGVyQnlBdHRyID0gY29udmVydEZpbHRlclRvQ2xpZW50RnVuY3Rpb25JZk5lY2Vzc2FyeSgnZmlsdGVyJywgc2VsZWN0b3JBdHRyaWJ1dGVGaWx0ZXIpO1xuXG5mdW5jdGlvbiBlbnN1cmVSZWdFeHBDb250ZXh0IChzdHIpIHtcbiAgICAvLyBOT1RFOiBpZiBhIHJlZ2V4cCBpcyBjcmVhdGVkIGluIGEgc2VwYXJhdGUgY29udGV4dCAodmlhIHRoZSAndm0nIG1vZHVsZSkgd2VcbiAgICAvLyBzaG91bGQgd3JhcCBpdCB3aXRoIG5ldyBSZWdFeHAoKSB0byBtYWtlIHRoZSBgaW5zdGFuY2VvZiBSZWdFeHBgIGNoZWNrIHN1Y2Nlc3NmdWwuXG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnICYmICEoc3RyIGluc3RhbmNlb2YgUmVnRXhwKSlcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoc3RyKTtcblxuICAgIHJldHVybiBzdHI7XG59XG5cbmZ1bmN0aW9uIGFkZEZpbHRlck1ldGhvZHMgKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IG9iaiwgZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlciB9ID0gb3B0aW9ucztcblxuICAgIG9iai5udGggPSBpbmRleCA9PiB7XG4gICAgICAgIGFzc2VydFR5cGUoaXMubnVtYmVyLCAnbnRoJywgJ1wiaW5kZXhcIiBhcmd1bWVudCcsIGluZGV4KTtcblxuICAgICAgICBjb25zdCBhcGlGbiAgID0gcHJlcGFyZUFwaUZuQXJncygnbnRoJywgaW5kZXgpO1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IFNlbGVjdG9yQnVpbGRlcihnZXRTZWxlY3RvcigpLCB7IGluZGV4LCBhcGlGbiB9LCB7IGluc3RhbnRpYXRpb246ICdTZWxlY3RvcicgfSk7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIuZ2V0RnVuY3Rpb24oKTtcbiAgICB9O1xuXG4gICAgb2JqLndpdGhUZXh0ID0gdGV4dCA9PiB7XG4gICAgICAgIGFzc2VydFR5cGUoW2lzLnN0cmluZywgaXMucmVnRXhwXSwgJ3dpdGhUZXh0JywgJ1widGV4dFwiIGFyZ3VtZW50JywgdGV4dCk7XG5cbiAgICAgICAgY29uc3QgYXBpRm4gPSBwcmVwYXJlQXBpRm5BcmdzKCd3aXRoVGV4dCcsIHRleHQpO1xuXG4gICAgICAgIHRleHQgPSBlbnN1cmVSZWdFeHBDb250ZXh0KHRleHQpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBzZWxlY3RvcigpO1xuXG4gICAgICAgICAgICBpZiAoIW5vZGVzLmxlbmd0aClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlck5vZGVzKG5vZGVzLCBmaWx0ZXIsIGRvY3VtZW50LCB2b2lkIDAsIHRleHRSZSk7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYXJncyA9IGdldERlcml2YXRpdmVTZWxlY3RvckFyZ3Mob3B0aW9ucywgc2VsZWN0b3JGbiwgYXBpRm4sIGZpbHRlckJ5VGV4dCwgeyB0ZXh0UmU6IG1ha2VSZWdFeHAodGV4dCkgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZURlcml2YXRpdmVTZWxlY3RvcldpdGhGaWx0ZXIoYXJncyk7XG4gICAgfTtcblxuICAgIG9iai53aXRoRXhhY3RUZXh0ID0gdGV4dCA9PiB7XG4gICAgICAgIGFzc2VydFR5cGUoaXMuc3RyaW5nLCAnd2l0aEV4YWN0VGV4dCcsICdcInRleHRcIiBhcmd1bWVudCcsIHRleHQpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBzZWxlY3RvcigpO1xuXG4gICAgICAgICAgICBpZiAoIW5vZGVzLmxlbmd0aClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlck5vZGVzKG5vZGVzLCBmaWx0ZXIsIGRvY3VtZW50LCB2b2lkIDAsIGV4YWN0VGV4dCk7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYXBpRm4gPSBwcmVwYXJlQXBpRm5BcmdzKCd3aXRoRXhhY3RUZXh0JywgdGV4dCk7XG4gICAgICAgIGNvbnN0IGFyZ3MgID0gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyhvcHRpb25zLCBzZWxlY3RvckZuLCBhcGlGbiwgZmlsdGVyQnlUZXh0LCB7IGV4YWN0VGV4dDogdGV4dCB9KTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlcihhcmdzKTtcbiAgICB9O1xuXG4gICAgb2JqLndpdGhBdHRyaWJ1dGUgPSAoYXR0ck5hbWUsIGF0dHJWYWx1ZSkgPT4ge1xuICAgICAgICBhc3NlcnRUeXBlKFtpcy5zdHJpbmcsIGlzLnJlZ0V4cF0sICd3aXRoQXR0cmlidXRlJywgJ1wiYXR0ck5hbWVcIiBhcmd1bWVudCcsIGF0dHJOYW1lKTtcblxuICAgICAgICBjb25zdCBhcGlGbiA9IHByZXBhcmVBcGlGbkFyZ3MoJ3dpdGhBdHRyaWJ1dGUnLCBhdHRyTmFtZSwgYXR0clZhbHVlKTtcblxuICAgICAgICBhdHRyTmFtZSA9IGVuc3VyZVJlZ0V4cENvbnRleHQoYXR0ck5hbWUpO1xuXG4gICAgICAgIGlmIChhdHRyVmFsdWUgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgYXNzZXJ0VHlwZShbaXMuc3RyaW5nLCBpcy5yZWdFeHBdLCAnd2l0aEF0dHJpYnV0ZScsICdcImF0dHJWYWx1ZVwiIGFyZ3VtZW50JywgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIGF0dHJWYWx1ZSA9IGVuc3VyZVJlZ0V4cENvbnRleHQoYXR0clZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBzZWxlY3RvcigpO1xuXG4gICAgICAgICAgICBpZiAoIW5vZGVzLmxlbmd0aClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlck5vZGVzKG5vZGVzLCBmaWx0ZXIsIGRvY3VtZW50LCB2b2lkIDAsIGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bmRlZiAqL1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBnZXREZXJpdmF0aXZlU2VsZWN0b3JBcmdzKG9wdGlvbnMsIHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXJCeUF0dHIsIHtcbiAgICAgICAgICAgIGF0dHJOYW1lLFxuICAgICAgICAgICAgYXR0clZhbHVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVEZXJpdmF0aXZlU2VsZWN0b3JXaXRoRmlsdGVyKGFyZ3MpO1xuICAgIH07XG5cbiAgICBvYmouZmlsdGVyID0gKGZpbHRlciwgZGVwZW5kZW5jaWVzKSA9PiB7XG4gICAgICAgIGFzc2VydFR5cGUoW2lzLnN0cmluZywgaXMuZnVuY3Rpb25dLCAnZmlsdGVyJywgJ1wiZmlsdGVyXCIgYXJndW1lbnQnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGNvbnN0IGFwaUZuID0gcHJlcGFyZUFwaUZuQXJncygnZmlsdGVyJywgZmlsdGVyKTtcblxuICAgICAgICBmaWx0ZXIgPSBjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5KCdmaWx0ZXInLCBmaWx0ZXIsIGRlcGVuZGVuY2llcyk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JGbiA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICBjb25zdCBub2RlcyA9IHNlbGVjdG9yKCk7XG5cbiAgICAgICAgICAgIGlmICghbm9kZXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyTm9kZXMobm9kZXMsIGZpbHRlciwgZG9jdW1lbnQsIHZvaWQgMCk7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgIH07XG5cblxuICAgICAgICBjb25zdCBhcmdzID0gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyhvcHRpb25zLCBzZWxlY3RvckZuLCBhcGlGbiwgZmlsdGVyKTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlcihhcmdzKTtcbiAgICB9O1xuXG4gICAgb2JqLmZpbHRlclZpc2libGUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwaUZuICAgPSBwcmVwYXJlQXBpRm5BcmdzKCdmaWx0ZXJWaXNpYmxlJyk7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKGdldFNlbGVjdG9yKCksIHsgZmlsdGVyVmlzaWJsZTogdHJ1ZSwgYXBpRm4gfSwgeyBpbnN0YW50aWF0aW9uOiAnU2VsZWN0b3InIH0pO1xuXG4gICAgICAgIHJldHVybiBidWlsZGVyLmdldEZ1bmN0aW9uKCk7XG4gICAgfTtcblxuICAgIG9iai5maWx0ZXJIaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwaUZuICAgPSBwcmVwYXJlQXBpRm5BcmdzKCdmaWx0ZXJIaWRkZW4nKTtcbiAgICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBTZWxlY3RvckJ1aWxkZXIoZ2V0U2VsZWN0b3IoKSwgeyBmaWx0ZXJIaWRkZW46IHRydWUsIGFwaUZuIH0sIHsgaW5zdGFudGlhdGlvbjogJ1NlbGVjdG9yJyB9KTtcblxuICAgICAgICByZXR1cm4gYnVpbGRlci5nZXRGdW5jdGlvbigpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFkZEN1c3RvbURPTVByb3BlcnRpZXNNZXRob2QgKHsgb2JqLCBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyIH0pIHtcbiAgICBvYmouYWRkQ3VzdG9tRE9NUHJvcGVydGllcyA9IGN1c3RvbURPTVByb3BlcnRpZXMgPT4ge1xuICAgICAgICBhc3NlcnRBZGRDdXN0b21ET01Qcm9wZXJ0aWVzT3B0aW9ucyhjdXN0b21ET01Qcm9wZXJ0aWVzKTtcblxuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IFNlbGVjdG9yQnVpbGRlcihnZXRTZWxlY3RvcigpLCB7IGN1c3RvbURPTVByb3BlcnRpZXMgfSwgeyBpbnN0YW50aWF0aW9uOiAnU2VsZWN0b3InIH0pO1xuXG4gICAgICAgIHJldHVybiBidWlsZGVyLmdldEZ1bmN0aW9uKCk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYWRkQ3VzdG9tTWV0aG9kc01ldGhvZCAoeyBvYmosIGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIgfSkge1xuICAgIG9iai5hZGRDdXN0b21NZXRob2RzID0gZnVuY3Rpb24gKG1ldGhvZHMsIG9wdHMpIHtcbiAgICAgICAgYXNzZXJ0QWRkQ3VzdG9tTWV0aG9kcyhtZXRob2RzLCBvcHRzKTtcblxuICAgICAgICBjb25zdCBjdXN0b21NZXRob2RzID0ge307XG5cbiAgICAgICAgT2JqZWN0LmtleXMobWV0aG9kcykuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgICAgICAgIGN1c3RvbU1ldGhvZHNbbWV0aG9kTmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAgICAgICAgIG1ldGhvZHNbbWV0aG9kTmFtZV0sXG4gICAgICAgICAgICAgICAgcmV0dXJuRE9NTm9kZXM6IG9wdHMgJiYgISFvcHRzLnJldHVybkRPTU5vZGVzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IFNlbGVjdG9yQnVpbGRlcihnZXRTZWxlY3RvcigpLCB7IGN1c3RvbU1ldGhvZHMgfSwgeyBpbnN0YW50aWF0aW9uOiAnU2VsZWN0b3InIH0pO1xuXG4gICAgICAgIHJldHVybiBidWlsZGVyLmdldEZ1bmN0aW9uKCk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYWRkSGllcmFyY2hpY2FsU2VsZWN0b3JzIChvcHRpb25zKSB7XG4gICAgY29uc3QgeyBvYmogfSA9IG9wdGlvbnM7XG5cbiAgICAvLyBGaW5kXG4gICAgb2JqLmZpbmQgPSAoZmlsdGVyLCBkZXBlbmRlbmNpZXMpID0+IHtcbiAgICAgICAgYXNzZXJ0VHlwZShbaXMuc3RyaW5nLCBpcy5mdW5jdGlvbl0sICdmaW5kJywgJ1wiZmlsdGVyXCIgYXJndW1lbnQnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGNvbnN0IGFwaUZuID0gcHJlcGFyZUFwaUZuQXJncygnZmluZCcsIGZpbHRlcik7XG5cbiAgICAgICAgZmlsdGVyID0gY29udmVydEZpbHRlclRvQ2xpZW50RnVuY3Rpb25JZk5lY2Vzc2FyeSgnZmluZCcsIGZpbHRlciwgZGVwZW5kZW5jaWVzKTtcblxuICAgICAgICBjb25zdCBzZWxlY3RvckZuID0gKCkgPT4ge1xuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgICAgIHJldHVybiBleHBhbmRTZWxlY3RvclJlc3VsdHMoc2VsZWN0b3IsIG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZmlsdGVyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIG5vZGUucXVlcnlTZWxlY3RvckFsbCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoZmlsdGVyKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHZpc2l0Tm9kZSA9IGN1cnJlbnROb2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY25MZW5ndGggPSBjdXJyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNuTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gY3VycmVudE5vZGUuY2hpbGROb2Rlc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaXROb2RlKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2aXNpdE5vZGUobm9kZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyTm9kZXMocmVzdWx0cywgZmlsdGVyLCBudWxsLCBub2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bmRlZiAqL1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBnZXREZXJpdmF0aXZlU2VsZWN0b3JBcmdzKG9wdGlvbnMsIHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXIsIHsgZXhwYW5kU2VsZWN0b3JSZXN1bHRzIH0pO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVEZXJpdmF0aXZlU2VsZWN0b3JXaXRoRmlsdGVyKGFyZ3MpO1xuICAgIH07XG5cbiAgICAvLyBQYXJlbnRcbiAgICBvYmoucGFyZW50ID0gKGZpbHRlciwgZGVwZW5kZW5jaWVzKSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXIgIT09IHZvaWQgMClcbiAgICAgICAgICAgIGFzc2VydFR5cGUoW2lzLnN0cmluZywgaXMuZnVuY3Rpb24sIGlzLm51bWJlcl0sICdwYXJlbnQnLCAnXCJmaWx0ZXJcIiBhcmd1bWVudCcsIGZpbHRlcik7XG5cbiAgICAgICAgY29uc3QgYXBpRm4gPSBwcmVwYXJlQXBpRm5BcmdzKCdwYXJlbnQnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGZpbHRlciA9IGNvbnZlcnRGaWx0ZXJUb0NsaWVudEZ1bmN0aW9uSWZOZWNlc3NhcnkoJ2ZpbmQnLCBmaWx0ZXIsIGRlcGVuZGVuY2llcyk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JGbiA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICByZXR1cm4gZXhwYW5kU2VsZWN0b3JSZXN1bHRzKHNlbGVjdG9yLCBub2RlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRzID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7IHBhcmVudDsgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudHMucHVzaChwYXJlbnQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlciAhPT0gdm9pZCAwID8gZmlsdGVyTm9kZXMocGFyZW50cywgZmlsdGVyLCBkb2N1bWVudCwgbm9kZSkgOiBwYXJlbnRzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYXJncyA9IGdldERlcml2YXRpdmVTZWxlY3RvckFyZ3Mob3B0aW9ucywgc2VsZWN0b3JGbiwgYXBpRm4sIGZpbHRlciwgeyBleHBhbmRTZWxlY3RvclJlc3VsdHMgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZURlcml2YXRpdmVTZWxlY3RvcldpdGhGaWx0ZXIoYXJncyk7XG4gICAgfTtcblxuICAgIC8vIENoaWxkXG4gICAgb2JqLmNoaWxkID0gKGZpbHRlciwgZGVwZW5kZW5jaWVzKSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXIgIT09IHZvaWQgMClcbiAgICAgICAgICAgIGFzc2VydFR5cGUoW2lzLnN0cmluZywgaXMuZnVuY3Rpb24sIGlzLm51bWJlcl0sICdjaGlsZCcsICdcImZpbHRlclwiIGFyZ3VtZW50JywgZmlsdGVyKTtcblxuICAgICAgICBjb25zdCBhcGlGbiA9IHByZXBhcmVBcGlGbkFyZ3MoJ2NoaWxkJywgZmlsdGVyKTtcblxuICAgICAgICBmaWx0ZXIgPSBjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5KCdmaW5kJywgZmlsdGVyLCBkZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZFNlbGVjdG9yUmVzdWx0cyhzZWxlY3Rvciwgbm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRFbGVtZW50cyA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNuTGVuZ3RoICAgICAgPSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbkxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gbm9kZS5jaGlsZE5vZGVzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkRWxlbWVudHMucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlciAhPT0gdm9pZCAwID8gZmlsdGVyTm9kZXMoY2hpbGRFbGVtZW50cywgZmlsdGVyLCBub2RlLCBub2RlKSA6IGNoaWxkRWxlbWVudHM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhcmdzID0gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyhvcHRpb25zLCBzZWxlY3RvckZuLCBhcGlGbiwgZmlsdGVyLCB7IGV4cGFuZFNlbGVjdG9yUmVzdWx0cyB9KTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlcihhcmdzKTtcbiAgICB9O1xuXG4gICAgLy8gU2libGluZ1xuICAgIG9iai5zaWJsaW5nID0gKGZpbHRlciwgZGVwZW5kZW5jaWVzKSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXIgIT09IHZvaWQgMClcbiAgICAgICAgICAgIGFzc2VydFR5cGUoW2lzLnN0cmluZywgaXMuZnVuY3Rpb24sIGlzLm51bWJlcl0sICdzaWJsaW5nJywgJ1wiZmlsdGVyXCIgYXJndW1lbnQnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGNvbnN0IGFwaUZuID0gcHJlcGFyZUFwaUZuQXJncygnc2libGluZycsIGZpbHRlcik7XG5cbiAgICAgICAgZmlsdGVyID0gY29udmVydEZpbHRlclRvQ2xpZW50RnVuY3Rpb25JZk5lY2Vzc2FyeSgnZmluZCcsIGZpbHRlciwgZGVwZW5kZW5jaWVzKTtcblxuICAgICAgICBjb25zdCBzZWxlY3RvckZuID0gKCkgPT4ge1xuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgICAgIHJldHVybiBleHBhbmRTZWxlY3RvclJlc3VsdHMoc2VsZWN0b3IsIG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgICAgIGlmICghcGFyZW50KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNpYmxpbmdzID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgY25MZW5ndGggPSBwYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNuTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBwYXJlbnQuY2hpbGROb2Rlc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDEgJiYgY2hpbGQgIT09IG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWJsaW5ncy5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyICE9PSB2b2lkIDAgPyBmaWx0ZXJOb2RlcyhzaWJsaW5ncywgZmlsdGVyLCBwYXJlbnQsIG5vZGUpIDogc2libGluZ3M7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhcmdzID0gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyhvcHRpb25zLCBzZWxlY3RvckZuLCBhcGlGbiwgZmlsdGVyLCB7IGV4cGFuZFNlbGVjdG9yUmVzdWx0cyB9KTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlcihhcmdzKTtcbiAgICB9O1xuXG4gICAgLy8gTmV4dCBzaWJsaW5nXG4gICAgb2JqLm5leHRTaWJsaW5nID0gKGZpbHRlciwgZGVwZW5kZW5jaWVzKSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXIgIT09IHZvaWQgMClcbiAgICAgICAgICAgIGFzc2VydFR5cGUoW2lzLnN0cmluZywgaXMuZnVuY3Rpb24sIGlzLm51bWJlcl0sICduZXh0U2libGluZycsICdcImZpbHRlclwiIGFyZ3VtZW50JywgZmlsdGVyKTtcblxuICAgICAgICBjb25zdCBhcGlGbiA9IHByZXBhcmVBcGlGbkFyZ3MoJ25leHRTaWJsaW5nJywgZmlsdGVyKTtcblxuICAgICAgICBmaWx0ZXIgPSBjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5KCdmaW5kJywgZmlsdGVyLCBkZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZFNlbGVjdG9yUmVzdWx0cyhzZWxlY3Rvciwgbm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2libGluZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbkxlbmd0aCA9IHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBsZXQgYWZ0ZXJOb2RlICA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbkxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gcGFyZW50LmNoaWxkTm9kZXNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkID09PSBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJOb2RlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChhZnRlck5vZGUgJiYgY2hpbGQubm9kZVR5cGUgPT09IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWJsaW5ncy5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyICE9PSB2b2lkIDAgPyBmaWx0ZXJOb2RlcyhzaWJsaW5ncywgZmlsdGVyLCBwYXJlbnQsIG5vZGUpIDogc2libGluZ3M7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhcmdzID0gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyhvcHRpb25zLCBzZWxlY3RvckZuLCBhcGlGbiwgZmlsdGVyLCB7IGV4cGFuZFNlbGVjdG9yUmVzdWx0cyB9KTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlcihhcmdzKTtcbiAgICB9O1xuXG4gICAgLy8gUHJldiBzaWJsaW5nXG4gICAgb2JqLnByZXZTaWJsaW5nID0gKGZpbHRlciwgZGVwZW5kZW5jaWVzKSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXIgIT09IHZvaWQgMClcbiAgICAgICAgICAgIGFzc2VydFR5cGUoW2lzLnN0cmluZywgaXMuZnVuY3Rpb24sIGlzLm51bWJlcl0sICdwcmV2U2libGluZycsICdcImZpbHRlclwiIGFyZ3VtZW50JywgZmlsdGVyKTtcblxuICAgICAgICBjb25zdCBhcGlGbiA9IHByZXBhcmVBcGlGbkFyZ3MoJ3ByZXZTaWJsaW5nJywgZmlsdGVyKTtcblxuICAgICAgICBmaWx0ZXIgPSBjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5KCdmaW5kJywgZmlsdGVyLCBkZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZFNlbGVjdG9yUmVzdWx0cyhzZWxlY3Rvciwgbm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2libGluZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbkxlbmd0aCA9IHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY25MZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IHBhcmVudC5jaGlsZE5vZGVzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmdzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIgIT09IHZvaWQgMCA/IGZpbHRlck5vZGVzKHNpYmxpbmdzLCBmaWx0ZXIsIHBhcmVudCwgbm9kZSkgOiBzaWJsaW5ncztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bmRlZiAqL1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBnZXREZXJpdmF0aXZlU2VsZWN0b3JBcmdzKG9wdGlvbnMsIHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXIsIHsgZXhwYW5kU2VsZWN0b3JSZXN1bHRzIH0pO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVEZXJpdmF0aXZlU2VsZWN0b3JXaXRoRmlsdGVyKGFyZ3MpO1xuICAgIH07XG5cbiAgICAvLyBTaGFkb3dSb290XG4gICAgb2JqLnNoYWRvd1Jvb3QgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwaUZuID0gcHJlcGFyZUFwaUZuQXJncygnc2hhZG93Um9vdCcpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZFNlbGVjdG9yUmVzdWx0cyhzZWxlY3Rvciwgbm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFub2RlLnNoYWRvd1Jvb3QgPyBudWxsIDogW25vZGUuc2hhZG93Um9vdF07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhcmdzID0gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyhvcHRpb25zLCBzZWxlY3RvckZuLCBhcGlGbiwgdm9pZCAwLCB7IGV4cGFuZFNlbGVjdG9yUmVzdWx0cyB9KTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlcihhcmdzKTtcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQVBJIChzZWxlY3RvciwgZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlciwgY3VzdG9tRE9NUHJvcGVydGllcywgY3VzdG9tTWV0aG9kcywgb2JzZXJ2ZWRDYWxsc2l0ZXMpIHtcbiAgICBjb25zdCBvcHRpb25zID0geyBvYmo6IHNlbGVjdG9yLCBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyLCBjdXN0b21ET01Qcm9wZXJ0aWVzLCBjdXN0b21NZXRob2RzLCBvYnNlcnZlZENhbGxzaXRlcyB9O1xuXG4gICAgYWRkRmlsdGVyTWV0aG9kcyhvcHRpb25zKTtcbiAgICBhZGRIaWVyYXJjaGljYWxTZWxlY3RvcnMob3B0aW9ucyk7XG4gICAgYWRkU25hcHNob3RQcm9wZXJ0eVNob3J0aGFuZHMob3B0aW9ucyk7XG4gICAgYWRkQ3VzdG9tRE9NUHJvcGVydGllc01ldGhvZChvcHRpb25zKTtcbiAgICBhZGRDdXN0b21NZXRob2RzTWV0aG9kKG9wdGlvbnMpO1xuICAgIGFkZENvdW50ZXJQcm9wZXJ0aWVzKG9wdGlvbnMpO1xuICAgIGFkZFZpc2libGVQcm9wZXJ0eShvcHRpb25zKTtcbn1cbiJdfQ==