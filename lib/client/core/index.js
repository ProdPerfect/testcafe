// NOTE: We should have the capability to initialize scripts with different contexts.
// This is required for iframes without the src attribute because Hammerhead does not
// inject scripts into such iframes. So, we wrap all scripts in initialization functions.
(function () {
    function initTestCafeCore(window, isIFrameWithoutSrc) {
        var document = window.document;

        (function (hammerhead) {
    var hammerhead__default = 'default' in hammerhead ? hammerhead['default'] : hammerhead;

    var browserUtils = hammerhead__default.utils.browser;
    var MODIFIERS = {
        alt: 18,
        ctrl: 17,
        meta: 91,
        shift: 16
    };
    var SHIFT_MAP = {
        '~': '`',
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '_': '-',
        '+': '=',
        '{': '[',
        '}': ']',
        ':': ';',
        '"': '\'',
        '|': '\\',
        '<': ',',
        '>': '.',
        '?': '/',
        '±': '§'
    };
    var SPECIAL_KEYS = {
        backspace: 8,
        capslock: 20,
        delete: 46,
        down: 40,
        end: 35,
        enter: 13,
        esc: 27,
        home: 36,
        ins: 45,
        left: 37,
        pagedown: 34,
        pageup: 33,
        right: 39,
        space: 32,
        tab: 9,
        up: 38
    };
    function reverseMap(map) {
        var reversed = {};
        for (var key in map) {
            if (map.hasOwnProperty(key))
                reversed[map[key]] = key;
        }
        return reversed;
    }
    var KEY_MAPS = {
        modifiers: MODIFIERS,
        shiftMap: SHIFT_MAP,
        specialKeys: SPECIAL_KEYS,
        reversedModifiers: reverseMap(MODIFIERS),
        reversedShiftMap: reverseMap(SHIFT_MAP),
        reversedSpecialKeys: reverseMap(SPECIAL_KEYS),
        modifiersMap: {
            option: 'alt'
        },
        keyProperty: {
            left: browserUtils.isIE ? 'Left' : 'ArrowLeft',
            down: browserUtils.isIE ? 'Down' : 'ArrowDown',
            right: browserUtils.isIE ? 'Right' : 'ArrowRight',
            up: browserUtils.isIE ? 'Up' : 'ArrowUp',
            backspace: 'Backspace',
            capslock: 'CapsLock',
            delete: 'Delete',
            end: 'End',
            enter: 'Enter',
            esc: 'Escape',
            home: 'Home',
            ins: 'Insert',
            pagedown: 'PageDown',
            pageup: 'PageUp',
            space: ' ',
            tab: 'Tab',
            alt: 'Alt',
            ctrl: 'Control',
            meta: 'Meta',
            shift: 'Shift'
        },
        symbolCharCodeToKeyCode: {
            96: 192,
            91: 219,
            93: 221,
            92: 220,
            59: 186,
            39: 222,
            44: 188,
            45: browserUtils.isFirefox ? 173 : 189,
            46: 190,
            47: 191 // /
        },
        symbolKeysCharCodes: {
            109: 45,
            173: 45,
            186: 59,
            187: 61,
            188: 44,
            189: 45,
            190: 46,
            191: 47,
            192: 96,
            219: 91,
            220: 92,
            221: 93,
            222: 39,
            110: 46,
            96: 48,
            97: 49,
            98: 50,
            99: 51,
            100: 52,
            101: 53,
            102: 54,
            103: 55,
            104: 56,
            105: 57,
            107: 43,
            106: 42,
            111: 47
        }
    };

    // NOTE: node description by node type
    var NODE_TYPE_DESCRIPTIONS = {
        1: 'element',
        2: 'attribute',
        3: 'text',
        4: 'cdata section',
        5: 'entity reference',
        6: 'entity node',
        7: 'processing instruction',
        8: 'comment',
        9: 'document',
        10: 'document type',
        11: 'document fragment',
        12: 'notation'
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Promise = hammerhead__default.Promise;
    var nativeMethods = hammerhead__default.nativeMethods;
    function delay (ms) {
        return new Promise(function (resolve) { return nativeMethods.setTimeout.call(window, resolve, ms); });
    }

    var nativeIndexOf = Array.prototype.indexOf;
    var nativeForEach = Array.prototype.forEach;
    var nativeSome = Array.prototype.some;
    var nativeMap = Array.prototype.map;
    var nativeFilter = Array.prototype.filter;
    var nativeReverse = Array.prototype.reverse;
    var nativeReduce = Array.prototype.reduce;
    var nativeSplice = Array.prototype.splice;
    function toArray(arg) {
        var arr = [];
        var length = arg.length;
        for (var i = 0; i < length; i++)
            arr.push(arg[i]);
        return arr;
    }
    function reverse(arr) {
        return nativeReverse.call(arr);
    }
    function isArray(arg) {
        return hammerhead__default.nativeMethods.objectToString.call(arg) === '[object Array]';
    }
    function find(arr, callback) {
        var length = arr.length;
        for (var i = 0; i < length; i++) {
            if (callback(arr[i], i, arr))
                return arr[i];
        }
        return null;
    }
    function indexOf(arr, arg) {
        return nativeIndexOf.call(arr, arg);
    }
    function forEach(arr, callback) {
        nativeForEach.call(arr, callback);
    }
    function some(arr, callback) {
        return nativeSome.call(arr, callback);
    }
    function map(arr, callback) {
        return nativeMap.call(arr, callback);
    }
    function filter(arr, callback) {
        return nativeFilter.call(arr, callback);
    }
    function reduce(arr, callback, initialValue) {
        return nativeReduce.call(arr, callback, initialValue);
    }
    function remove(arr, item) {
        var index = indexOf(arr, item);
        if (index > -1)
            nativeSplice.call(arr, index, 1);
    }
    function equals(arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        for (var i = 0, l = arr1.length; i < l; i++) {
            if (arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }
    function getCommonElement(arr1, arr2) {
        for (var i = 0; i < arr1.length; i++) {
            for (var t = 0; t < arr2.length; t++) {
                if (arr1[i] === arr2[t])
                    return arr1[i];
            }
        }
        return null;
    }

    var arrayUtils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        toArray: toArray,
        reverse: reverse,
        isArray: isArray,
        find: find,
        indexOf: indexOf,
        forEach: forEach,
        some: some,
        map: map,
        filter: filter,
        reduce: reduce,
        remove: remove,
        equals: equals,
        getCommonElement: getCommonElement
    });

    function inherit(Child, Parent) {
        var Func = function () {
        };
        Func.prototype = Parent.prototype;
        hammerhead__default.utils.extend(Child.prototype, new Func());
        Child.prototype.constructor = Child;
        Child.base = Parent.prototype;
    }
    var EventEmitter = function () {
        this.eventsListeners = [];
    };
    EventEmitter.prototype.emit = function (evt) {
        var listeners = this.eventsListeners[evt];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                try {
                    if (listeners[i])
                        listeners[i].apply(this, Array.prototype.slice.apply(arguments, [1]));
                }
                catch (e) {
                    // Hack for IE: after document.write calling IFrameSandbox event handlers
                    // rises 'Can't execute code from a freed script' exception because document has been
                    // recreated
                    if (e.message && e.message.indexOf('freed script') > -1)
                        listeners[i] = null;
                    else
                        throw e;
                }
            }
        }
    };
    EventEmitter.prototype.off = function (evt, listener) {
        var listeners = this.eventsListeners[evt];
        if (listeners)
            this.eventsListeners[evt] = filter(listeners, function (item) { return item !== listener; });
    };
    EventEmitter.prototype.on = function (evt, listener) {
        if (!this.eventsListeners[evt])
            this.eventsListeners[evt] = [];
        this.eventsListeners[evt].push(listener);
    };
    EventEmitter.prototype.once = function (evt, listener) {
        var _this = this;
        this.on(evt, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off(evt, listener);
            return listener.apply(void 0, args);
        });
    };

    var serviceUtils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        inherit: inherit,
        EventEmitter: EventEmitter
    });

    var Promise$1 = hammerhead__default.Promise;
    var nativeMethods$1 = hammerhead__default.nativeMethods;
    var REQUESTS_COLLECTION_DELAY_DEFAULT = 50;
    var REQUESTS_FINISHED_EVENT = 'requests-finished';
    var GLOBAL_REQUEST_BARRIER_FIELD = 'testcafe|request-barrier';
    var RequestBarrier = /** @class */ (function (_super) {
        __extends(RequestBarrier, _super);
        function RequestBarrier(delays) {
            if (delays === void 0) { delays = {}; }
            var _this = _super.call(this) || this;
            _this.BARRIER_TIMEOUT = 3000;
            _this.delays = {
                requestsCollection: delays.requestsCollection === void 0 ?
                    REQUESTS_COLLECTION_DELAY_DEFAULT : delays.requestsCollection,
                additionalRequestsCollection: delays.additionalRequestsCollection === void 0 ?
                    REQUESTS_COLLECTION_DELAY_DEFAULT : delays.additionalRequestsCollection,
                pageInitialRequestsCollection: delays.pageInitialRequestsCollection === void 0 ?
                    REQUESTS_COLLECTION_DELAY_DEFAULT : delays.pageInitialRequestsCollection
            };
            _this.collectingReqs = true;
            _this.requests = [];
            _this.watchdog = null;
            _this._unbindHandlers = null;
            _this._init();
            return _this;
        }
        RequestBarrier.prototype._init = function () {
            var _this = this;
            var onXhrSend = function (e) { return _this._onXhrSend(e.xhr); };
            var onXhrCompleted = function (e) { return _this._onRequestCompleted(e.xhr); };
            var onXhrError = function (e) { return _this._onRequestError(e.xhr, e.err); };
            var onFetchSend = function (e) { return _this._onFetchSend(e); };
            hammerhead__default.on(hammerhead__default.EVENTS.beforeXhrSend, onXhrSend);
            hammerhead__default.on(hammerhead__default.EVENTS.xhrCompleted, onXhrCompleted);
            hammerhead__default.on(hammerhead__default.EVENTS.xhrError, onXhrError);
            hammerhead__default.on(hammerhead__default.EVENTS.fetchSent, onFetchSend);
            this._unbindHandlers = function () {
                hammerhead__default.off(hammerhead__default.EVENTS.beforeXhrSend, onXhrSend);
                hammerhead__default.off(hammerhead__default.EVENTS.xhrCompleted, onXhrCompleted);
                hammerhead__default.off(hammerhead__default.EVENTS.xhrError, onXhrError);
                hammerhead__default.off(hammerhead__default.EVENTS.fetchSent, onFetchSend);
            };
        };
        RequestBarrier.prototype._onXhrSend = function (request) {
            if (this.collectingReqs)
                this.requests.push(request);
        };
        RequestBarrier.prototype._onRequestCompleted = function (request) {
            var _this = this;
            // NOTE: let the last real XHR handler finish its job and try to obtain
            // any additional requests if they were initiated by this handler
            delay(this.delays.additionalRequestsCollection)
                .then(function () { return _this._onRequestFinished(request); });
        };
        RequestBarrier.prototype._onRequestError = function (request) {
            this._onRequestFinished(request);
        };
        RequestBarrier.prototype._onRequestFinished = function (request) {
            if (indexOf(this.requests, request) > -1) {
                remove(this.requests, request);
                if (!this.collectingReqs && !this.requests.length)
                    this.emit(REQUESTS_FINISHED_EVENT);
            }
        };
        RequestBarrier.prototype._onFetchSend = function (request) {
            var _this = this;
            if (this.collectingReqs) {
                this.requests.push(request);
                request
                    .then(function () { return _this._onRequestCompleted(request); })
                    .catch(function () { return _this._onRequestError(request); });
            }
        };
        RequestBarrier.prototype.wait = function (isPageLoad) {
            var _this = this;
            return new Promise$1(function (resolve) {
                delay(isPageLoad ? _this.delays.pageInitialRequestsCollection : _this.delays.requestsCollection)
                    .then(function () {
                    _this.collectingReqs = false;
                    var onRequestsFinished = function () {
                        if (_this.watchdog)
                            nativeMethods$1.clearTimeout.call(window, _this.watchdog);
                        _this._unbindHandlers();
                        resolve();
                    };
                    if (_this.requests.length) {
                        _this.watchdog = nativeMethods$1.setTimeout.call(window, onRequestsFinished, _this.BARRIER_TIMEOUT);
                        _this.on(REQUESTS_FINISHED_EVENT, onRequestsFinished);
                    }
                    else
                        onRequestsFinished();
                });
            });
        };
        return RequestBarrier;
    }(EventEmitter));
    RequestBarrier.GLOBAL_REQUEST_BARRIER_FIELD = GLOBAL_REQUEST_BARRIER_FIELD;
    window[RequestBarrier.GLOBAL_REQUEST_BARRIER_FIELD] = RequestBarrier;

    var browserUtils$1 = hammerhead__default.utils.browser;
    var nativeMethods$2 = hammerhead__default.nativeMethods;
    // NOTE: We have to retrieve styleUtils.get from hammerhead
    // to avoid circular dependencies between domUtils and styleUtils
    var getElementStyleProperty = hammerhead__default.utils.style.get;
    var getActiveElement = hammerhead__default.utils.dom.getActiveElement;
    var findDocument = hammerhead__default.utils.dom.findDocument;
    var isElementInDocument = hammerhead__default.utils.dom.isElementInDocument;
    var isElementInIframe = hammerhead__default.utils.dom.isElementInIframe;
    var getIframeByElement = hammerhead__default.utils.dom.getIframeByElement;
    var isCrossDomainWindows = hammerhead__default.utils.dom.isCrossDomainWindows;
    var getSelectParent = hammerhead__default.utils.dom.getSelectParent;
    var getChildVisibleIndex = hammerhead__default.utils.dom.getChildVisibleIndex;
    var getSelectVisibleChildren = hammerhead__default.utils.dom.getSelectVisibleChildren;
    var isElementNode = hammerhead__default.utils.dom.isElementNode;
    var isTextNode = hammerhead__default.utils.dom.isTextNode;
    var isRenderedNode = hammerhead__default.utils.dom.isRenderedNode;
    var isIframeElement = hammerhead__default.utils.dom.isIframeElement;
    var isInputElement = hammerhead__default.utils.dom.isInputElement;
    var isButtonElement = hammerhead__default.utils.dom.isButtonElement;
    var isFileInput = hammerhead__default.utils.dom.isFileInput;
    var isTextAreaElement = hammerhead__default.utils.dom.isTextAreaElement;
    var isAnchorElement = hammerhead__default.utils.dom.isAnchorElement;
    var isImgElement = hammerhead__default.utils.dom.isImgElement;
    var isFormElement = hammerhead__default.utils.dom.isFormElement;
    var isLabelElement = hammerhead__default.utils.dom.isLabelElement;
    var isSelectElement = hammerhead__default.utils.dom.isSelectElement;
    var isRadioButtonElement = hammerhead__default.utils.dom.isRadioButtonElement;
    var isColorInputElement = hammerhead__default.utils.dom.isColorInputElement;
    var isCheckboxElement = hammerhead__default.utils.dom.isCheckboxElement;
    var isOptionElement = hammerhead__default.utils.dom.isOptionElement;
    var isSVGElement = hammerhead__default.utils.dom.isSVGElement;
    var isMapElement = hammerhead__default.utils.dom.isMapElement;
    var isBodyElement = hammerhead__default.utils.dom.isBodyElement;
    var isHtmlElement = hammerhead__default.utils.dom.isHtmlElement;
    var isDocument = hammerhead__default.utils.dom.isDocument;
    var isWindow = hammerhead__default.utils.dom.isWindow;
    var isTextEditableInput = hammerhead__default.utils.dom.isTextEditableInput;
    var isTextEditableElement = hammerhead__default.utils.dom.isTextEditableElement;
    var isTextEditableElementAndEditingAllowed = hammerhead__default.utils.dom.isTextEditableElementAndEditingAllowed;
    var isContentEditableElement = hammerhead__default.utils.dom.isContentEditableElement;
    var isDomElement = hammerhead__default.utils.dom.isDomElement;
    var isShadowUIElement = hammerhead__default.utils.dom.isShadowUIElement;
    var isElementFocusable = hammerhead__default.utils.dom.isElementFocusable;
    var isHammerheadAttr = hammerhead__default.utils.dom.isHammerheadAttr;
    var isElementReadOnly = hammerhead__default.utils.dom.isElementReadOnly;
    var getScrollbarSize = hammerhead__default.utils.dom.getScrollbarSize;
    var getMapContainer = hammerhead__default.utils.dom.getMapContainer;
    var getTagName = hammerhead__default.utils.dom.getTagName;
    var closest = hammerhead__default.utils.dom.closest;
    var getParents = hammerhead__default.utils.dom.getParents;
    var findParent = hammerhead__default.utils.dom.findParent;
    var getTopSameDomainWindow = hammerhead__default.utils.dom.getTopSameDomainWindow;
    function getElementsWithTabIndex(elements) {
        return filter(elements, function (el) { return el.tabIndex > 0; });
    }
    function getElementsWithoutTabIndex(elements) {
        return filter(elements, function (el) { return el.tabIndex <= 0; });
    }
    function sortElementsByFocusingIndex(elements) {
        if (!elements || !elements.length)
            return [];
        var elementsWithTabIndex = getElementsWithTabIndex(elements);
        //iframes
        var iframes = filter(elements, function (el) { return isIframeElement(el); });
        if (!elementsWithTabIndex.length) {
            if (iframes.length)
                elements = insertIframesContentElements(elements, iframes);
            return elements;
        }
        elementsWithTabIndex = elementsWithTabIndex.sort(sortBy('tabIndex'));
        var elementsWithoutTabIndex = getElementsWithoutTabIndex(elements);
        if (iframes.length)
            return insertIframesContentElements(elementsWithTabIndex, iframes).concat(insertIframesContentElements(elementsWithoutTabIndex, iframes));
        return elementsWithTabIndex.concat(elementsWithoutTabIndex);
    }
    function insertIframesContentElements(elements, iframes) {
        var sortedIframes = sortElementsByTabIndex(iframes);
        var results = [];
        var iframesElements = [];
        var iframeFocusedElements = [];
        var i = 0;
        for (i = 0; i < sortedIframes.length; i++) {
            //NOTE: We can get elements of the same domain iframe only
            try {
                iframeFocusedElements = getFocusableElements(nativeMethods$2.contentDocumentGetter.call(sortedIframes[i]));
            }
            catch (e) {
                iframeFocusedElements = [];
            }
            iframesElements.push(sortElementsByFocusingIndex(iframeFocusedElements));
        }
        for (i = 0; i < elements.length; i++) {
            results.push(elements[i]);
            if (isIframeElement(elements[i])) {
                if (browserUtils$1.isIE) {
                    results.pop();
                    var iFrameElements = iframesElements[indexOf(iframes, elements[i])];
                    var elementsWithTabIndex = getElementsWithTabIndex(iFrameElements);
                    var elementsWithoutTabIndexArray = getElementsWithoutTabIndex(iFrameElements);
                    elementsWithTabIndex = elementsWithTabIndex.sort(sortBy('tabIndex'));
                    results = results.concat(elementsWithTabIndex);
                    results.push(elements[i]);
                    results = results.concat(elementsWithoutTabIndexArray);
                }
                else {
                    if (browserUtils$1.isWebKit && iframesElements[indexOf(iframes, elements[i])].length)
                        results.pop();
                    results = results.concat(iframesElements[indexOf(iframes, elements[i])]);
                }
            }
        }
        return results;
    }
    function sortElementsByTabIndex(elements) {
        var elementsWithTabIndex = getElementsWithTabIndex(elements);
        if (!elementsWithTabIndex.length)
            return elements;
        return elementsWithTabIndex.sort(sortBy('tabIndex')).concat(getElementsWithoutTabIndex(elements));
    }
    function sortBy(property) {
        return function (a, b) {
            if (a[property] < b[property])
                return -1;
            if (a[property] > b[property])
                return 1;
            return 0;
        };
    }
    function getFocusableElements(doc, sort) {
        if (sort === void 0) { sort = false; }
        // NOTE: We don't take into account the case of embedded contentEditable
        // elements and specify the contentEditable attribute for focusable elements
        var allElements = doc.querySelectorAll('*');
        var invisibleElements = getInvisibleElements(allElements);
        var inputElementsRegExp = /^(input|button|select|textarea)$/;
        var focusableElements = [];
        var element = null;
        var tagName = null;
        var tabIndex = null;
        var needPush = false;
        for (var i = 0; i < allElements.length; i++) {
            element = allElements[i];
            tagName = getTagName(element);
            tabIndex = getTabIndexAttributeIntValue(element);
            needPush = false;
            if (element.disabled)
                continue;
            if (getElementStyleProperty(element, 'display') === 'none' || getElementStyleProperty(element, 'visibility') === 'hidden')
                continue;
            if ((browserUtils$1.isIE || browserUtils$1.isAndroid) && isOptionElement(element))
                continue;
            if (tabIndex !== null && tabIndex < 0)
                continue;
            if (inputElementsRegExp.test(tagName))
                needPush = true;
            else if (browserUtils$1.isIE && isIframeElement(element))
                focusableElements.push(element);
            else if (isAnchorElement(element) && element.hasAttribute('href'))
                needPush = element.getAttribute('href') !== '' || !browserUtils$1.isIE || tabIndex !== null;
            var contentEditableAttr = element.getAttribute('contenteditable');
            if (contentEditableAttr === '' || contentEditableAttr === 'true')
                needPush = true;
            if (tabIndex !== null)
                needPush = true;
            if (needPush)
                focusableElements.push(element);
        }
        //NOTE: remove children of invisible elements
        var result = filter(focusableElements, function (el) { return !containsElement(invisibleElements, el); });
        if (sort)
            result = sortElementsByFocusingIndex(result);
        return result;
    }
    function getInvisibleElements(elements) {
        var invisibleElements = [];
        for (var i = 0; i < elements.length; i++) {
            if (getElementStyleProperty(elements[i], 'display') === 'none')
                invisibleElements.push(elements[i]);
        }
        return invisibleElements;
    }
    function getTabIndexAttributeIntValue(el) {
        var tabIndex = el.getAttribute('tabIndex');
        if (tabIndex !== null) {
            tabIndex = parseInt(tabIndex, 10);
            tabIndex = isNaN(tabIndex) ? null : tabIndex;
        }
        return tabIndex;
    }
    function containsElement(elements, element) {
        if (elements.contains)
            return elements.contains(element);
        return some(elements, function (parent) { return parent.contains(element); });
    }
    function getTextareaIndentInLine(textarea, position) {
        var textareaValue = getTextAreaValue(textarea);
        if (!textareaValue)
            return 0;
        var topPart = textareaValue.substring(0, position);
        var linePosition = topPart.lastIndexOf('\n') === -1 ? 0 : topPart.lastIndexOf('\n') + 1;
        return position - linePosition;
    }
    function getTextareaLineNumberByPosition(textarea, position) {
        var textareaValue = getTextAreaValue(textarea);
        var lines = textareaValue.split('\n');
        var topPartLength = 0;
        var line = 0;
        for (var i = 0; topPartLength <= position; i++) {
            if (position <= topPartLength + lines[i].length) {
                line = i;
                break;
            }
            topPartLength += lines[i].length + 1;
        }
        return line;
    }
    function getTextareaPositionByLineAndOffset(textarea, line, offset) {
        var textareaValue = getTextAreaValue(textarea);
        var lines = textareaValue.split('\n');
        var lineIndex = 0;
        for (var i = 0; i < line; i++)
            lineIndex += lines[i].length + 1;
        return lineIndex + offset;
    }
    // NOTE: the form is also submitted on enter key press if there is only one input of certain
    // types (referred to as types that block implicit submission in the HTML5 standard) on the
    // form and this input is focused (http://www.w3.org/TR/html5/forms.html#implicit-submission)
    function blocksImplicitSubmission(el) {
        var inputTypeRegExp = null;
        if (browserUtils$1.isSafari)
            inputTypeRegExp = /^(text|password|color|date|time|datetime|datetime-local|email|month|number|search|tel|url|week|image)$/i;
        else if (browserUtils$1.isFirefox)
            inputTypeRegExp = /^(text|password|date|time|datetime|datetime-local|email|month|number|search|tel|url|week|image)$/i;
        else if (browserUtils$1.isIE)
            inputTypeRegExp = /^(text|password|color|date|time|datetime|datetime-local|email|file|month|number|search|tel|url|week|image)$/i;
        else
            inputTypeRegExp = /^(text|password|datetime|email|number|search|tel|url|image)$/i;
        return inputTypeRegExp.test(el.type);
    }
    function isEditableElement(el, checkEditingAllowed) {
        return checkEditingAllowed ?
            isTextEditableElementAndEditingAllowed(el) || isContentEditableElement(el) :
            isTextEditableElement(el) || isContentEditableElement(el);
    }
    function isElementContainsNode(parentElement, childNode) {
        if (isTheSameNode(childNode, parentElement))
            return true;
        var childNodes = parentElement.childNodes;
        var length = getChildNodesLength(childNodes);
        for (var i = 0; i < length; i++) {
            var el = childNodes[i];
            if (!isShadowUIElement(el) && isElementContainsNode(el, childNode))
                return true;
        }
        return false;
    }
    function isOptionGroupElement(element) {
        return hammerhead__default.utils.dom.instanceToString(element) === '[object HTMLOptGroupElement]';
    }
    function getElementIndexInParent(parent, child) {
        var children = parent.querySelectorAll(getTagName(child));
        return indexOf(children, child);
    }
    function isTheSameNode(node1, node2) {
        //NOTE: Mozilla has not isSameNode method
        if (node1 && node2 && node1.isSameNode)
            return node1.isSameNode(node2);
        return node1 === node2;
    }
    function getElementDescription(el) {
        var attributes = {
            id: 'id',
            name: 'name',
            'class': 'className'
        };
        var res = [];
        res.push('<');
        res.push(getTagName(el));
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                var val = el[attributes[attr]];
                if (val)
                    res.push(' ' + attr + '="' + val + '"');
            }
        }
        res.push('>');
        return res.join('');
    }
    function getFocusableParent(el) {
        var parents = getParents(el);
        for (var i = 0; i < parents.length; i++) {
            if (isElementFocusable(parents[i]))
                return parents[i];
        }
        return null;
    }
    function remove$1(el) {
        if (el && el.parentElement)
            el.parentElement.removeChild(el);
    }
    function isIFrameWindowInDOM(win) {
        //NOTE: In MS Edge, if an iframe is removed from DOM, the browser throws an exception when accessing window.top
        //and window.frameElement. Fortunately, setTimeout is set to undefined in this case.
        if (!win.setTimeout)
            return false;
        var frameElement = null;
        try {
            //NOTE: This may raise a cross-domain policy error in some browsers.
            frameElement = win.frameElement;
        }
        catch (e) {
            return !!win.top;
        }
        // NOTE: in Firefox and WebKit, frameElement is null for cross-domain iframes even if they are in the DOM.
        // But these browsers don't execute scripts in removed iframes, so we suppose that the iframe is in the DOM.
        if ((browserUtils$1.isFirefox || browserUtils$1.isWebKit) && win.top !== win && !frameElement)
            return true;
        return !!(frameElement && nativeMethods$2.contentDocumentGetter.call(frameElement));
    }
    function isTopWindow(win) {
        try {
            //NOTE: MS Edge throws an exception when trying to access window.top from an iframe removed from DOM
            return win.top === win;
        }
        catch (e) {
            return false;
        }
    }
    function findIframeByWindow(iframeWindow, iframeDestinationWindow) {
        var iframes = (iframeDestinationWindow || window).document.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {
            if (nativeMethods$2.contentWindowGetter.call(iframes[i]) === iframeWindow)
                return iframes[i];
        }
        return null;
    }
    function isEditableFormElement(element) {
        return isTextEditableElement(element) || isSelectElement(element);
    }
    function getCommonAncestor(element1, element2) {
        if (isTheSameNode(element1, element2))
            return element1;
        var el1Parents = [element1].concat(getParents(element1));
        var commonAncestor = element2;
        while (commonAncestor) {
            if (indexOf(el1Parents, commonAncestor) > -1)
                return commonAncestor;
            commonAncestor = nativeMethods$2.nodeParentNodeGetter.call(commonAncestor);
        }
        return commonAncestor;
    }
    function getChildrenLength(children) {
        return nativeMethods$2.htmlCollectionLengthGetter.call(children);
    }
    function getChildNodesLength(childNodes) {
        return nativeMethods$2.nodeListLengthGetter.call(childNodes);
    }
    function getInputValue(input) {
        return nativeMethods$2.inputValueGetter.call(input);
    }
    function getTextAreaValue(textArea) {
        return nativeMethods$2.textAreaValueGetter.call(textArea);
    }
    function setInputValue(input, value) {
        return nativeMethods$2.inputValueSetter.call(input, value);
    }
    function setTextAreaValue(textArea, value) {
        return nativeMethods$2.textAreaValueSetter.call(textArea, value);
    }
    function getElementValue(element) {
        if (isInputElement(element))
            return getInputValue(element);
        else if (isTextAreaElement(element))
            return getTextAreaValue(element);
        /*eslint-disable no-restricted-properties*/
        return element.value;
        /*eslint-enable no-restricted-properties*/
    }
    function setElementValue(element, value) {
        if (isInputElement(element))
            return setInputValue(element, value);
        else if (isTextAreaElement(element))
            return setTextAreaValue(element, value);
        /*eslint-disable no-restricted-properties*/
        element.value = value;
        /*eslint-enable no-restricted-properties*/
        return value;
    }
    function isShadowElement(element) {
        return element && element.getRootNode && findDocument(element) !== element.getRootNode();
    }
    function contains(element, target) {
        if (!element || !target)
            return false;
        if (element.contains)
            return element.contains(target);
        return !!findParent(target, true, function (node) { return node === element; });
    }

    var domUtils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getActiveElement: getActiveElement,
        findDocument: findDocument,
        isElementInDocument: isElementInDocument,
        isElementInIframe: isElementInIframe,
        getIframeByElement: getIframeByElement,
        isCrossDomainWindows: isCrossDomainWindows,
        getSelectParent: getSelectParent,
        getChildVisibleIndex: getChildVisibleIndex,
        getSelectVisibleChildren: getSelectVisibleChildren,
        isElementNode: isElementNode,
        isTextNode: isTextNode,
        isRenderedNode: isRenderedNode,
        isIframeElement: isIframeElement,
        isInputElement: isInputElement,
        isButtonElement: isButtonElement,
        isFileInput: isFileInput,
        isTextAreaElement: isTextAreaElement,
        isAnchorElement: isAnchorElement,
        isImgElement: isImgElement,
        isFormElement: isFormElement,
        isLabelElement: isLabelElement,
        isSelectElement: isSelectElement,
        isRadioButtonElement: isRadioButtonElement,
        isColorInputElement: isColorInputElement,
        isCheckboxElement: isCheckboxElement,
        isOptionElement: isOptionElement,
        isSVGElement: isSVGElement,
        isMapElement: isMapElement,
        isBodyElement: isBodyElement,
        isHtmlElement: isHtmlElement,
        isDocument: isDocument,
        isWindow: isWindow,
        isTextEditableInput: isTextEditableInput,
        isTextEditableElement: isTextEditableElement,
        isTextEditableElementAndEditingAllowed: isTextEditableElementAndEditingAllowed,
        isContentEditableElement: isContentEditableElement,
        isDomElement: isDomElement,
        isShadowUIElement: isShadowUIElement,
        isElementFocusable: isElementFocusable,
        isHammerheadAttr: isHammerheadAttr,
        isElementReadOnly: isElementReadOnly,
        getScrollbarSize: getScrollbarSize,
        getMapContainer: getMapContainer,
        getTagName: getTagName,
        closest: closest,
        getParents: getParents,
        findParent: findParent,
        getTopSameDomainWindow: getTopSameDomainWindow,
        getFocusableElements: getFocusableElements,
        containsElement: containsElement,
        getTextareaIndentInLine: getTextareaIndentInLine,
        getTextareaLineNumberByPosition: getTextareaLineNumberByPosition,
        getTextareaPositionByLineAndOffset: getTextareaPositionByLineAndOffset,
        blocksImplicitSubmission: blocksImplicitSubmission,
        isEditableElement: isEditableElement,
        isElementContainsNode: isElementContainsNode,
        isOptionGroupElement: isOptionGroupElement,
        getElementIndexInParent: getElementIndexInParent,
        isTheSameNode: isTheSameNode,
        getElementDescription: getElementDescription,
        getFocusableParent: getFocusableParent,
        remove: remove$1,
        isIFrameWindowInDOM: isIFrameWindowInDOM,
        isTopWindow: isTopWindow,
        findIframeByWindow: findIframeByWindow,
        isEditableFormElement: isEditableFormElement,
        getCommonAncestor: getCommonAncestor,
        getChildrenLength: getChildrenLength,
        getChildNodesLength: getChildNodesLength,
        getInputValue: getInputValue,
        getTextAreaValue: getTextAreaValue,
        setInputValue: setInputValue,
        setTextAreaValue: setTextAreaValue,
        getElementValue: getElementValue,
        setElementValue: setElementValue,
        isShadowElement: isShadowElement,
        contains: contains
    });

    var Promise$2 = hammerhead__default.Promise;
    var nativeMethods$3 = hammerhead__default.nativeMethods;
    var listeners = hammerhead__default.eventSandbox.listeners;
    var browserUtils$2 = hammerhead__default.utils.browser;
    // Imported form the hammerhead
    var BUTTON = hammerhead__default.utils.event.BUTTON;
    var BUTTONS_PARAMETER = hammerhead__default.utils.event.BUTTONS_PARAMETER;
    var DOM_EVENTS = hammerhead__default.utils.event.DOM_EVENTS;
    var WHICH_PARAMETER = hammerhead__default.utils.event.WHICH_PARAMETER;
    var preventDefault = hammerhead__default.utils.event.preventDefault;
    function bind(el, event, handler, useCapture) {
        if (browserUtils$2.isIE11 && isWindow(el))
            nativeMethods$3.windowAddEventListener.call(el, event, handler, useCapture);
        else
            nativeMethods$3.addEventListener.call(el, event, handler, useCapture);
    }
    function unbind(el, event, handler, useCapture) {
        if (browserUtils$2.isIE11 && isWindow(el))
            nativeMethods$3.windowRemoveEventListener.call(el, event, handler, useCapture);
        else
            nativeMethods$3.removeEventListener.call(el, event, handler, useCapture);
    }
    // Document ready
    var waitForDomContentLoaded = function () {
        // NOTE: We can't use a regular Promise here, because window.load event can happen in the same event loop pass
        // The default Promise will call resolve handlers in the next pass, and load event will be lost.
        var resolveHandlers = [];
        function createPromiseResolver(resolveHandler) {
            return new Promise$2(function (resolve) { return resolveHandlers.push(function () { return resolve(resolveHandler()); }); });
        }
        var isReady = false;
        function ready() {
            if (isReady)
                return;
            if (!document.body) {
                nativeMethods$3.setTimeout.call(window, ready, 1);
                return;
            }
            isReady = true;
            resolveHandlers.forEach(function (handler) { return handler(); });
        }
        function onContentLoaded() {
            if (!isIFrameWindowInDOM(window) && !isTopWindow(window))
                return;
            unbind(document, 'DOMContentLoaded', onContentLoaded);
            ready();
        }
        if (document.readyState === 'complete')
            nativeMethods$3.setTimeout.call(window, onContentLoaded, 1);
        else
            bind(document, 'DOMContentLoaded', onContentLoaded);
        return { then: function (handler) { return createPromiseResolver(handler); } };
    };
    var waitForWindowLoad = function () { return new Promise$2(function (resolve) { return bind(window, 'load', resolve); }); };
    function documentReady(pageLoadTimeout) {
        if (pageLoadTimeout === void 0) { pageLoadTimeout = 0; }
        return waitForDomContentLoaded()
            .then(function () {
            if (!listeners.getEventListeners(window, 'load').length)
                return null;
            return Promise$2.race([waitForWindowLoad(), delay(pageLoadTimeout)]);
        });
    }

    var eventUtils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BUTTON: BUTTON,
        BUTTONS_PARAMETER: BUTTONS_PARAMETER,
        DOM_EVENTS: DOM_EVENTS,
        WHICH_PARAMETER: WHICH_PARAMETER,
        preventDefault: preventDefault,
        bind: bind,
        unbind: unbind,
        documentReady: documentReady
    });

    var MESSAGE = {
        ready: 'ready',
        readyForBrowserManipulation: 'ready-for-browser-manipulation',
        waitForFileDownload: 'wait-for-file-download'
    };

    var Promise$3 = hammerhead__default.Promise;
    var browserUtils$3 = hammerhead__default.utils.browser;
    var nativeMethods$4 = hammerhead__default.nativeMethods;
    var transport = hammerhead__default.transport;
    var DEFAULT_BARRIER_TIMEOUT = 400;
    var SHORT_WAIT_FOR_UNLOAD_TIMEOUT = 30;
    var FILE_DOWNLOAD_CHECK_DELAY = 500;
    var MAX_UNLOADING_TIMEOUT = 15 * 1000;
    var waitingForUnload = false;
    var waitingForUnloadTimeoutId = null;
    var waitingPromiseResolvers = [];
    var unloading = false;
    var pageNavigationTriggeredListener = null;
    var pageNavigationTriggered = false;
    function onBeforeUnload() {
        if (!browserUtils$3.isIE) {
            unloading = true;
            return;
        }
        prolongUnloadWaiting(SHORT_WAIT_FOR_UNLOAD_TIMEOUT);
        delay(0)
            .then(function () {
            // NOTE: except file downloading
            if (document.readyState === 'loading') {
                var activeElement = nativeMethods$4.documentActiveElementGetter.call(document);
                if (!activeElement || !isAnchorElement(activeElement) || !activeElement.hasAttribute('download'))
                    unloading = true;
            }
        });
    }
    function prolongUnloadWaiting(timeout) {
        if (waitingForUnloadTimeoutId)
            nativeMethods$4.clearTimeout.call(window, waitingForUnloadTimeoutId);
        waitingForUnload = true;
        waitingForUnloadTimeoutId = nativeMethods$4.setTimeout.call(window, function () {
            waitingForUnloadTimeoutId = null;
            waitingForUnload = false;
            waitingPromiseResolvers.forEach(function (resolve) { return resolve(); });
            waitingPromiseResolvers = [];
        }, timeout);
    }
    function waitForFileDownload() {
        return new Promise$3(function (resolve) {
            nativeMethods$4.setTimeout.call(window, function () {
                transport
                    .queuedAsyncServiceMsg({ cmd: MESSAGE.waitForFileDownload })
                    .then(function (fileDownloadingHandled) {
                    // NOTE: we use a flag to confirm file download because if unload
                    // is raised the browser can respond with an empty string
                    if (fileDownloadingHandled)
                        resolve();
                });
            }, FILE_DOWNLOAD_CHECK_DELAY);
        });
    }
    // API
    function init() {
        hammerhead__default.on(hammerhead__default.EVENTS.beforeUnload, onBeforeUnload);
        bind(window, 'unload', function () {
            unloading = true;
        });
    }
    function watchForPageNavigationTriggers() {
        pageNavigationTriggeredListener = function () {
            pageNavigationTriggered = true;
        };
        hammerhead__default.on(hammerhead__default.EVENTS.pageNavigationTriggered, pageNavigationTriggeredListener);
    }
    function wait(timeout) {
        var waitForUnloadingPromise = new Promise$3(function (resolve) {
            if (timeout === void 0)
                timeout = !pageNavigationTriggeredListener || pageNavigationTriggered ? DEFAULT_BARRIER_TIMEOUT : 0;
            if (pageNavigationTriggeredListener) {
                hammerhead__default.off(hammerhead__default.EVENTS.pageNavigationTriggered, pageNavigationTriggeredListener);
                pageNavigationTriggeredListener = null;
            }
            delay(timeout)
                .then(function () {
                if (unloading) {
                    waitForFileDownload()
                        .then(function () {
                        unloading = false;
                        resolve();
                    });
                    return;
                }
                if (!waitingForUnload)
                    resolve();
                else
                    waitingPromiseResolvers.push(resolve);
            });
        });
        // NOTE: sometimes the page isn't actually unloaded after the beforeunload event
        // fires (see issues #664, #437). To avoid test hanging, we resolve the unload
        // barrier waiting promise in MAX_UNLOADING_TIMEOUT. We can improve this logic when
        // the https://github.com/DevExpress/testcafe-hammerhead/issues/667 issue is fixed.
        var watchdog = delay(MAX_UNLOADING_TIMEOUT)
            .then(function () {
            unloading = false;
        });
        return Promise$3.race([waitForUnloadingPromise, watchdog]);
    }

    var pageUnloadBarrier = /*#__PURE__*/Object.freeze({
        __proto__: null,
        init: init,
        watchForPageNavigationTriggers: watchForPageNavigationTriggers,
        wait: wait
    });

    var listeners$1 = hammerhead.eventSandbox.listeners;
    var ScrollController = /** @class */ (function () {
        function ScrollController() {
            this.initialized = false;
            this.stopPropagationFlag = false;
            this.events = new EventEmitter();
        }
        ScrollController.prototype._internalListener = function (event, dispatched, preventEvent, cancelHandlers, stopPropagation) {
            this.events.emit('scroll', event);
            if (this.stopPropagationFlag) {
                cancelHandlers();
                stopPropagation();
            }
        };
        ScrollController.prototype.init = function () {
            var _this = this;
            if (this.initialized)
                return;
            this.initialized = true;
            listeners$1.initElementListening(window, ['scroll']);
            listeners$1.addFirstInternalHandler(window, ['scroll'], function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _this._internalListener.apply(_this, args);
            });
        };
        ScrollController.prototype.waitForScroll = function (scrollElement) {
            var _this = this;
            var promiseResolver = null;
            var promise = new hammerhead.Promise(function (resolve) {
                promiseResolver = resolve;
            });
            promise.cancel = function () { return _this.events.off('scroll', promiseResolver); };
            if (this.initialized)
                this.handleScrollEvents(scrollElement, promiseResolver);
            else
                promiseResolver();
            return promise;
        };
        ScrollController.prototype.handleScrollEvents = function (el, handler) {
            var _this = this;
            this.events.once('scroll', handler);
            if (isShadowElement(el)) {
                listeners$1.initElementListening(el, ['scroll']);
                listeners$1.addFirstInternalHandler(el, ['scroll'], function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _this._internalListener.apply(_this, args);
                    listeners$1.cancelElementListening(el);
                });
            }
        };
        ScrollController.prototype.stopPropagation = function () {
            this.stopPropagationFlag = true;
        };
        ScrollController.prototype.enablePropagation = function () {
            this.stopPropagationFlag = false;
        };
        return ScrollController;
    }());
    var scrollController = new ScrollController();

    var styleUtils = hammerhead__default.utils.style;
    var browserUtils$4 = hammerhead__default.utils.browser;
    var getBordersWidth = hammerhead__default.utils.style.getBordersWidth;
    var getComputedStyle = hammerhead__default.utils.style.getComputedStyle;
    var getElementMargin = hammerhead__default.utils.style.getElementMargin;
    var getElementPadding = hammerhead__default.utils.style.getElementPadding;
    var getElementScroll = hammerhead__default.utils.style.getElementScroll;
    var getOptionHeight = hammerhead__default.utils.style.getOptionHeight;
    var getSelectElementSize = hammerhead__default.utils.style.getSelectElementSize;
    var isElementVisible = hammerhead__default.utils.style.isElementVisible;
    var isSelectVisibleChild = hammerhead__default.utils.style.isVisibleChild;
    var getWidth = hammerhead__default.utils.style.getWidth;
    var getHeight = hammerhead__default.utils.style.getHeight;
    var getInnerWidth = hammerhead__default.utils.style.getInnerWidth;
    var getInnerHeight = hammerhead__default.utils.style.getInnerHeight;
    var getScrollLeft = hammerhead__default.utils.style.getScrollLeft;
    var getScrollTop = hammerhead__default.utils.style.getScrollTop;
    var setScrollLeft = hammerhead__default.utils.style.setScrollLeft;
    var setScrollTop = hammerhead__default.utils.style.setScrollTop;
    var get = hammerhead__default.utils.style.get;
    var SCROLLABLE_OVERFLOW_STYLE_RE = /auto|scroll/i;
    var DEFAULT_IE_SCROLLABLE_OVERFLOW_STYLE_VALUE = 'visible';
    var getScrollable = function (el) {
        var overflowX = get(el, 'overflowX');
        var overflowY = get(el, 'overflowY');
        var scrollableHorizontally = SCROLLABLE_OVERFLOW_STYLE_RE.test(overflowX);
        var scrollableVertically = SCROLLABLE_OVERFLOW_STYLE_RE.test(overflowY);
        // IE11 and MS Edge bug: There are two properties: overflow-x and overflow-y.
        // If one property is set so that the browser may show scrollbars (`auto` or `scroll`) and the second one is set to 'visible',
        // then the second one will work as if it had the 'auto' value.
        if (browserUtils$4.isIE) {
            scrollableHorizontally = scrollableHorizontally || scrollableVertically && overflowX === DEFAULT_IE_SCROLLABLE_OVERFLOW_STYLE_VALUE;
            scrollableVertically = scrollableVertically || scrollableHorizontally && overflowY === DEFAULT_IE_SCROLLABLE_OVERFLOW_STYLE_VALUE;
        }
        return { scrollableHorizontally: scrollableHorizontally, scrollableVertically: scrollableVertically };
    };
    var isVisibilityHiddenNode = function (node) {
        node = findParent(node, true, function (ancestor) {
            return isElementNode(ancestor) && get(ancestor, 'visibility') === 'hidden';
        });
        return !!node;
    };
    var isHiddenNode = function (node) {
        node = findParent(node, true, function (ancestor) {
            return isElementNode(ancestor) && get(ancestor, 'display') === 'none';
        });
        return !!node;
    };
    function isFixedElement(node) {
        return isElementNode(node) && get(node, 'position') === 'fixed';
    }
    function isNotVisibleNode(node) {
        return !isRenderedNode(node) || isHiddenNode(node) || isVisibilityHiddenNode(node);
    }
    function getScrollableParents(element) {
        var parentsArray = getParents(element);
        if (isElementInIframe(element)) {
            var iFrameParents = getParents(getIframeByElement(element));
            parentsArray.concat(iFrameParents);
        }
        return filter(parentsArray, hasScroll);
    }
    function hasBodyScroll(el) {
        var overflowX = get(el, 'overflowX');
        var overflowY = get(el, 'overflowY');
        var scrollableHorizontally = SCROLLABLE_OVERFLOW_STYLE_RE.test(overflowX);
        var scrollableVertically = SCROLLABLE_OVERFLOW_STYLE_RE.test(overflowY);
        var documentElement = findDocument(el).documentElement;
        var bodyScrollHeight = el.scrollHeight;
        if (browserUtils$4.isChrome || browserUtils$4.isFirefox) {
            var bodyTop = el.getBoundingClientRect().top;
            var documentTop = documentElement.getBoundingClientRect().top;
            bodyScrollHeight = bodyScrollHeight - documentTop + bodyTop;
        }
        return (scrollableHorizontally || scrollableVertically) &&
            bodyScrollHeight > documentElement.scrollHeight;
    }
    function hasHTMLElementScroll(el) {
        var overflowX = get(el, 'overflowX');
        var overflowY = get(el, 'overflowY');
        //T174562 - wrong scrolling in iframes without src and others iframes
        var body = el.getElementsByTagName('body')[0];
        //T303226
        if (overflowX === 'hidden' && overflowY === 'hidden')
            return false;
        var hasHorizontalScroll = el.scrollHeight > el.clientHeight;
        var hasVerticalScroll = el.scrollWidth > el.clientWidth;
        if (hasHorizontalScroll || hasVerticalScroll)
            return true;
        if (body) {
            if (hasBodyScroll(body))
                return false;
            var clientWidth = Math.min(el.clientWidth, body.clientWidth);
            var clientHeight = Math.min(el.clientHeight, body.clientHeight);
            return body.scrollHeight > clientHeight || body.scrollWidth > clientWidth;
        }
        return false;
    }
    function hasScroll(el) {
        var _a = getScrollable(el), scrollableHorizontally = _a.scrollableHorizontally, scrollableVertically = _a.scrollableVertically;
        if (isBodyElement(el))
            return hasBodyScroll(el);
        if (isHtmlElement(el))
            return hasHTMLElementScroll(el);
        if (!scrollableHorizontally && !scrollableVertically)
            return false;
        var hasVerticalScroll = scrollableVertically && el.scrollHeight > el.clientHeight;
        var hasHorizontalScroll = scrollableHorizontally && el.scrollWidth > el.clientWidth;
        return hasHorizontalScroll || hasVerticalScroll;
    }
    function hasDimensions(el) {
        //NOTE: it's like jquery ':visible' selector (http://blog.jquery.com/2009/02/20/jquery-1-3-2-released/)
        return el && !(el.offsetHeight <= 0 && el.offsetWidth <= 0);
    }
    function set(el, style, value) {
        if (typeof style === 'string')
            styleUtils.set(el, style, value);
        for (var property in style) {
            if (style.hasOwnProperty(property))
                styleUtils.set(el, property, style[property]);
        }
    }
    function getViewportDimension(windowDimension, documentDimension, bodyDimension) {
        if (documentDimension > windowDimension)
            return bodyDimension;
        if (bodyDimension > windowDimension)
            return documentDimension;
        return Math.max(bodyDimension, documentDimension);
    }
    function getViewportDimensions() {
        return {
            width: getViewportDimension(window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth),
            height: getViewportDimension(window.innerHeight, document.documentElement.clientHeight, document.body.clientHeight)
        };
    }

    var styleUtils$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getBordersWidth: getBordersWidth,
        getComputedStyle: getComputedStyle,
        getElementMargin: getElementMargin,
        getElementPadding: getElementPadding,
        getElementScroll: getElementScroll,
        getOptionHeight: getOptionHeight,
        getSelectElementSize: getSelectElementSize,
        isElementVisible: isElementVisible,
        isSelectVisibleChild: isSelectVisibleChild,
        getWidth: getWidth,
        getHeight: getHeight,
        getInnerWidth: getInnerWidth,
        getInnerHeight: getInnerHeight,
        getScrollLeft: getScrollLeft,
        getScrollTop: getScrollTop,
        setScrollLeft: setScrollLeft,
        setScrollTop: setScrollTop,
        get: get,
        isFixedElement: isFixedElement,
        isNotVisibleNode: isNotVisibleNode,
        getScrollableParents: getScrollableParents,
        hasScroll: hasScroll,
        hasDimensions: hasDimensions,
        set: set,
        getViewportDimensions: getViewportDimensions
    });

    var browserUtils$5 = hammerhead.utils.browser;
    var listeners$2 = hammerhead.eventSandbox.listeners;
    var eventSimulator = hammerhead.eventSandbox.eventSimulator;
    var PREVENTED_EVENTS = [
        'click', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'mousemove', 'mouseover', 'mouseout',
        'touchstart', 'touchmove', 'touchend', 'keydown', 'keypress', 'input', 'keyup', 'change', 'focus', 'blur',
        'MSPointerDown', 'MSPointerMove', 'MSPointerOver', 'MSPointerOut', 'MSPointerUp', 'pointerdown',
        'pointermove', 'pointerover', 'pointerout', 'pointerup'
    ];
    var F12_KEY_CODE = 123;
    function checkBrowserHotkey(e) {
        // NOTE: Opening browser tools with F12, CTRL+SHIFT+<SYMBOL KEY>
        // on PC or with OPTION(ALT)+CMD+<SYMBOL KEY> on Mac.
        return e.shiftKey && e.ctrlKey || (e.altKey || e.metaKey) && browserUtils$5.isMacPlatform || e.keyCode === F12_KEY_CODE;
    }
    // NOTE: when tests are running, we should block real events (from mouse
    // or keyboard), because they may lead to unexpected test result.
    function preventRealEventHandler(e, dispatched, preventDefault, cancelHandlers, stopEventPropagation) {
        var target = e.target || e.srcElement;
        if (!dispatched && !isShadowUIElement(target)) {
            // NOTE: this will allow pressing hotkeys to open developer tools.
            if (/^key/.test(e.type) && checkBrowserHotkey(e)) {
                stopEventPropagation();
                return;
            }
            // NOTE: if an element loses focus because of becoming invisible, the blur event is
            // raised. We must not prevent this blur event. In IE, an element loses focus only
            // if the CSS 'display' property is set to 'none', other ways of making an element
            // invisible don't lead to blurring (in MSEdge, focus/blur are sync).
            if (e.type === 'blur') {
                if (browserUtils$5.isIE && browserUtils$5.version < 12) {
                    var isWindowInstance = isWindow(target);
                    var isElementInvisible = !isWindowInstance && get(target, 'display') === 'none';
                    var elementParents = null;
                    var invisibleParents = false;
                    if (!isWindowInstance && !isElementInvisible) {
                        elementParents = getParents(target);
                        invisibleParents = filter(elementParents, function (parent) { return get(parent, 'display') === 'none'; });
                    }
                    if (isElementInvisible || invisibleParents.length) {
                        // NOTE: In IE we should prevent the event and raise it on timeout. This is a fix for
                        // the case when a focus event leads to the element disappearing. If we don't prevent
                        // the blur event it will be raised before the previous focus event is raised (see B254768)
                        hammerhead.eventSandbox.timers.deferFunction(function () {
                            eventSimulator.blur(target);
                        });
                    }
                }
                // NOTE: fix for a jQuery bug. An exception is raised when calling .is(':visible')
                // for a window or document on page loading (when e.ownerDocument is null).
                else if (target !== window && target !== window.document && !hasDimensions(target))
                    return;
            }
            preventDefault();
        }
    }
    function preventRealEvents() {
        listeners$2.initElementListening(window, PREVENTED_EVENTS);
        listeners$2.addFirstInternalHandler(window, PREVENTED_EVENTS, preventRealEventHandler);
        scrollController.init();
    }
    function disableRealEventsPreventing() {
        listeners$2.removeInternalEventListener(window, PREVENTED_EVENTS, preventRealEventHandler);
    }

    //nodes utils
    function getOwnFirstVisibleTextNode(el) {
        var children = el.childNodes;
        var childrenLength = getChildNodesLength(children);
        if (!childrenLength && isVisibleTextNode(el))
            return el;
        return find(children, function (node) { return isVisibleTextNode(node); });
    }
    function getOwnFirstVisibleNode(el) {
        return find(el.childNodes, function (node) { return isVisibleTextNode(node) ||
            !isSkippableNode(node) && getOwnFirstVisibleNode(node); });
    }
    function getOwnPreviousVisibleSibling(el) {
        var sibling = null;
        var current = el;
        while (!sibling) {
            current = current.previousSibling;
            if (!current)
                break;
            else if (!isSkippableNode(current) && !isInvisibleTextNode(current)) {
                sibling = current;
                break;
            }
        }
        return sibling;
    }
    function isVisibleNode(node) {
        return isTextNode(node) || isElementNode(node) && isElementVisible(node);
    }
    function getVisibleChildren(node) {
        return filter(node.childNodes, isVisibleNode);
    }
    function hasVisibleChildren(node) {
        return some(node.childNodes, isVisibleNode);
    }
    function hasSelectableChildren(node) {
        return some(node.childNodes, function (child) { return isNodeSelectable(child, true); });
    }
    //NOTE: before such elements (like div or p) adds line breaks before and after it
    // (except line break before first visible element in contentEditable parent)
    // this line breaks is not contained in node values
    //so we should take it into account manually
    function isNodeBlockWithBreakLine(parent, node) {
        var parentFirstVisibleChild = null;
        var firstVisibleChild = null;
        if (isShadowUIElement(parent) || isShadowUIElement(node))
            return false;
        if (!isTheSameNode(node, parent) && getChildNodesLength(node.childNodes) &&
            /div|p/.test(getTagName(node))) {
            parentFirstVisibleChild = getOwnFirstVisibleNode(parent);
            if (!parentFirstVisibleChild || isTheSameNode(node, parentFirstVisibleChild))
                return false;
            firstVisibleChild = getFirstVisibleTextNode(parentFirstVisibleChild);
            if (!firstVisibleChild || isTheSameNode(node, firstVisibleChild))
                return false;
            return getOwnFirstVisibleTextNode(node);
        }
        return false;
    }
    function isNodeAfterNodeBlockWithBreakLine(parent, node) {
        var isRenderedNode$1 = isRenderedNode(node);
        var parentFirstVisibleChild = null;
        var firstVisibleChild = null;
        var previousSibling = null;
        if (isShadowUIElement(parent) || isShadowUIElement(node))
            return false;
        if (!isTheSameNode(node, parent) &&
            (isRenderedNode$1 && isElementNode(node) && getChildNodesLength(node.childNodes) &&
                !/div|p/.test(getTagName(node)) ||
                isVisibleTextNode(node) && !isTheSameNode(node, parent) && node.nodeValue.length)) {
            if (isRenderedNode$1 && isElementNode(node)) {
                parentFirstVisibleChild = getOwnFirstVisibleNode(parent);
                if (!parentFirstVisibleChild || isTheSameNode(node, parentFirstVisibleChild))
                    return false;
                firstVisibleChild = getFirstVisibleTextNode(parentFirstVisibleChild);
                if (!firstVisibleChild || isTheSameNode(node, firstVisibleChild))
                    return false;
            }
            previousSibling = getOwnPreviousVisibleSibling(node);
            return previousSibling && isElementNode(previousSibling) &&
                /div|p/.test(getTagName(previousSibling)) && getOwnFirstVisibleTextNode(previousSibling);
        }
        return false;
    }
    function getFirstTextNode(el, onlyVisible) {
        var children = el.childNodes;
        var childrenLength = getChildNodesLength(children);
        var curNode = null;
        var child = null;
        var isNotContentEditableElement = null;
        var checkTextNode = onlyVisible ? isVisibleTextNode : isTextNode;
        if (!childrenLength && checkTextNode(el))
            return el;
        for (var i = 0; i < childrenLength; i++) {
            curNode = children[i];
            isNotContentEditableElement = isElementNode(curNode) && !isContentEditableElement(curNode);
            if (checkTextNode(curNode))
                return curNode;
            else if (isRenderedNode(curNode) && hasVisibleChildren(curNode) && !isNotContentEditableElement) {
                child = getFirstTextNode(curNode, onlyVisible);
                if (child)
                    return child;
            }
        }
        return child;
    }
    function getFirstVisibleTextNode(el) {
        return getFirstTextNode(el, true);
    }
    function getLastTextNode(el, onlyVisible) {
        var children = el.childNodes;
        var childrenLength = getChildNodesLength(children);
        var curNode = null;
        var child = null;
        var isNotContentEditableElement = null;
        var visibleTextNode = null;
        if (!childrenLength && isVisibleTextNode(el))
            return el;
        for (var i = childrenLength - 1; i >= 0; i--) {
            curNode = children[i];
            isNotContentEditableElement = isElementNode(curNode) && !isContentEditableElement(curNode);
            visibleTextNode = isTextNode(curNode) &&
                (onlyVisible ? !isInvisibleTextNode(curNode) : true);
            if (visibleTextNode)
                return curNode;
            else if (isRenderedNode(curNode) && hasVisibleChildren(curNode) && !isNotContentEditableElement) {
                child = getLastTextNode(curNode, false);
                if (child)
                    return child;
            }
        }
        return child;
    }
    function getFirstNonWhitespaceSymbolIndex(nodeValue, startFrom) {
        if (!nodeValue || !nodeValue.length)
            return 0;
        var valueLength = nodeValue.length;
        var index = startFrom || 0;
        for (var i = index; i < valueLength; i++) {
            if (nodeValue.charCodeAt(i) === 10 || nodeValue.charCodeAt(i) === 32)
                index++;
            else
                break;
        }
        return index;
    }
    function getLastNonWhitespaceSymbolIndex(nodeValue) {
        if (!nodeValue || !nodeValue.length)
            return 0;
        var valueLength = nodeValue.length;
        var index = valueLength;
        for (var i = valueLength - 1; i >= 0; i--) {
            if (nodeValue.charCodeAt(i) === 10 || nodeValue.charCodeAt(i) === 32)
                index--;
            else
                break;
        }
        return index;
    }
    function isInvisibleTextNode(node) {
        if (!isTextNode(node))
            return false;
        var nodeValue = node.nodeValue;
        var firstVisibleIndex = getFirstNonWhitespaceSymbolIndex(nodeValue);
        var lastVisibleIndex = getLastNonWhitespaceSymbolIndex(nodeValue);
        return firstVisibleIndex === nodeValue.length && lastVisibleIndex === 0;
    }
    function isVisibleTextNode(node) {
        return isTextNode(node) && !isInvisibleTextNode(node);
    }
    function isSkippableNode(node) {
        return !isRenderedNode(node) || isShadowUIElement(node);
    }
    //dom utils
    function hasContentEditableAttr(el) {
        var attrValue = el.getAttribute ? el.getAttribute('contenteditable') : null;
        return attrValue === '' || attrValue === 'true';
    }
    function findContentEditableParent(element) {
        var elParents = getParents(element);
        if (hasContentEditableAttr(element) && isContentEditableElement(element))
            return element;
        var currentDocument = findDocument(element);
        if (currentDocument.designMode === 'on')
            return currentDocument.body;
        return find(elParents, function (parent) { return hasContentEditableAttr(parent) &&
            isContentEditableElement(parent); });
    }
    function getNearestCommonAncestor(node1, node2) {
        if (isTheSameNode(node1, node2)) {
            if (isTheSameNode(node2, findContentEditableParent(node1)))
                return node1;
            return hammerhead.nativeMethods.nodeParentNodeGetter.call(node1);
        }
        var ancestors = [];
        var contentEditableParent = findContentEditableParent(node1);
        var curNode = null;
        if (!isElementContainsNode(contentEditableParent, node2))
            return null;
        for (curNode = node1; curNode !== contentEditableParent; curNode = hammerhead.nativeMethods.nodeParentNodeGetter.call(curNode))
            ancestors.push(curNode);
        for (curNode = node2; curNode !== contentEditableParent; curNode = hammerhead.nativeMethods.nodeParentNodeGetter.call(curNode)) {
            if (indexOf(ancestors, curNode) !== -1)
                return curNode;
        }
        return contentEditableParent;
    }
    //selection utils
    function getSelectedPositionInParentByOffset(node, offset) {
        var currentNode = null;
        var currentOffset = null;
        var childCount = getChildNodesLength(node.childNodes);
        var isSearchForLastChild = offset >= childCount;
        // NOTE: we get a child element by its offset index in the parent
        if (isShadowUIElement(node))
            return { node: node, offset: offset };
        // NOTE: IE behavior
        if (isSearchForLastChild)
            currentNode = node.childNodes[childCount - 1];
        else {
            currentNode = node.childNodes[offset];
            currentOffset = 0;
        }
        // NOTE: skip shadowUI elements
        if (isShadowUIElement(currentNode)) {
            if (childCount <= 1)
                return { node: node, offset: 0 };
            isSearchForLastChild = offset - 1 >= childCount;
            if (isSearchForLastChild)
                currentNode = node.childNodes[childCount - 2];
            else {
                currentNode = node.childNodes[offset - 1];
                currentOffset = 0;
            }
        }
        // NOTE: we try to find text node
        while (!isSkippableNode(currentNode) && isElementNode(currentNode)) {
            var visibleChildren = getVisibleChildren(currentNode);
            if (visibleChildren.length)
                currentNode = visibleChildren[isSearchForLastChild ? visibleChildren.length - 1 : 0];
            else {
                //NOTE: if we didn't find a text node then always set offset to zero
                currentOffset = 0;
                break;
            }
        }
        if (currentOffset !== 0 && !isSkippableNode(currentNode))
            currentOffset = currentNode.nodeValue ? currentNode.nodeValue.length : 0;
        return {
            node: currentNode,
            offset: currentOffset
        };
    }
    function getSelectionStart(el, selection, inverseSelection) {
        var startNode = inverseSelection ? selection.focusNode : selection.anchorNode;
        var startOffset = inverseSelection ? selection.focusOffset : selection.anchorOffset;
        var correctedStartPosition = {
            node: startNode,
            offset: startOffset
        };
        //NOTE: window.getSelection() can't returns not rendered node like selected node, so we shouldn't check it
        if ((isTheSameNode(el, startNode) || isElementNode(startNode)) && hasSelectableChildren(startNode))
            correctedStartPosition = getSelectedPositionInParentByOffset(startNode, startOffset);
        return {
            node: correctedStartPosition.node,
            offset: correctedStartPosition.offset
        };
    }
    function getSelectionEnd(el, selection, inverseSelection) {
        var endNode = inverseSelection ? selection.anchorNode : selection.focusNode;
        var endOffset = inverseSelection ? selection.anchorOffset : selection.focusOffset;
        var correctedEndPosition = {
            node: endNode,
            offset: endOffset
        };
        //NOTE: window.getSelection() can't returns not rendered node like selected node, so we shouldn't check it
        if ((isTheSameNode(el, endNode) || isElementNode(endNode)) && hasSelectableChildren(endNode))
            correctedEndPosition = getSelectedPositionInParentByOffset(endNode, endOffset);
        return {
            node: correctedEndPosition.node,
            offset: correctedEndPosition.offset
        };
    }
    function getSelection(el, selection, inverseSelection) {
        return {
            startPos: getSelectionStart(el, selection, inverseSelection),
            endPos: getSelectionEnd(el, selection, inverseSelection)
        };
    }
    function getSelectionStartPosition(el, selection, inverseSelection) {
        var correctedSelectionStart = getSelectionStart(el, selection, inverseSelection);
        return calculatePositionByNodeAndOffset(el, correctedSelectionStart);
    }
    function getSelectionEndPosition(el, selection, inverseSelection) {
        var correctedSelectionEnd = getSelectionEnd(el, selection, inverseSelection);
        return calculatePositionByNodeAndOffset(el, correctedSelectionEnd);
    }
    function getElementOffset(target) {
        var offset = 0;
        var firstBreakElement = find(target.childNodes, function (node, index) {
            offset = index;
            return getTagName(node) === 'br';
        });
        return firstBreakElement ? offset : 0;
    }
    function isNodeSelectable(node, includeDescendants) {
        if (isNotVisibleNode(node))
            return false;
        if (isTextNode(node))
            return true;
        if (!isElementNode(node))
            return false;
        if (hasSelectableChildren(node))
            return includeDescendants;
        var parent = hammerhead.nativeMethods.nodeParentNodeGetter.call(node);
        var isContentEditableRoot = !isContentEditableElement(parent);
        var visibleChildren = getVisibleChildren(node);
        var hasBreakLineElements = some(visibleChildren, function (child) { return getTagName(child) === 'br'; });
        return isContentEditableRoot || hasBreakLineElements;
    }
    function calculateNodeAndOffsetByPosition(el, offset) {
        var point = {
            node: null,
            offset: offset
        };
        function checkChildNodes(target) {
            var childNodes = target.childNodes;
            var childNodesLength = getChildNodesLength(childNodes);
            if (point.node)
                return point;
            if (isSkippableNode(target))
                return point;
            if (isTextNode(target)) {
                if (point.offset <= target.nodeValue.length) {
                    point.node = target;
                    return point;
                }
                else if (target.nodeValue.length) {
                    if (!point.node && isNodeAfterNodeBlockWithBreakLine(el, target))
                        point.offset--;
                    point.offset -= target.nodeValue.length;
                }
            }
            else if (isElementNode(target)) {
                if (!isVisibleNode(target))
                    return point;
                if (point.offset === 0 && isNodeSelectable(target, false)) {
                    point.node = target;
                    point.offset = getElementOffset(target);
                    return point;
                }
                if (!point.node && (isNodeBlockWithBreakLine(el, target) || isNodeAfterNodeBlockWithBreakLine(el, target)))
                    point.offset--;
                else if (!childNodesLength && getTagName(target) === 'br')
                    point.offset--;
            }
            for (var i = 0; i < childNodesLength; i++)
                point = checkChildNodes(childNodes[i]);
            return point;
        }
        return checkChildNodes(el);
    }
    function calculatePositionByNodeAndOffset(el, _a) {
        var node = _a.node, offset = _a.offset;
        var currentOffset = 0;
        var find = false;
        function checkChildNodes(target) {
            var childNodes = target.childNodes;
            var childNodesLength = getChildNodesLength(childNodes);
            if (find)
                return currentOffset;
            if (isTheSameNode(node, target)) {
                if (isNodeBlockWithBreakLine(el, target) || isNodeAfterNodeBlockWithBreakLine(el, target))
                    currentOffset++;
                find = true;
                return currentOffset + offset;
            }
            if (isSkippableNode(target))
                return currentOffset;
            if (!childNodesLength && target.nodeValue && target.nodeValue.length) {
                if (!find && isNodeAfterNodeBlockWithBreakLine(el, target))
                    currentOffset++;
                currentOffset += target.nodeValue.length;
            }
            else if (!childNodesLength && isElementNode(target) && getTagName(target) === 'br')
                currentOffset++;
            else if (!find && (isNodeBlockWithBreakLine(el, target) || isNodeAfterNodeBlockWithBreakLine(el, target)))
                currentOffset++;
            for (var i = 0; i < childNodesLength; i++)
                currentOffset = checkChildNodes(childNodes[i]);
            return currentOffset;
        }
        return checkChildNodes(el);
    }
    function getElementBySelection(selection) {
        var el = getNearestCommonAncestor(selection.anchorNode, selection.focusNode);
        return isTextNode(el) ? el.parentElement : el;
    }
    //NOTE: We can not determine first visible symbol of node in all cases,
    // so we should create a range and select all text contents of the node.
    // Then range object will contain information about node's the first and last visible symbol.
    function getFirstVisiblePosition(el) {
        var firstVisibleTextChild = isTextNode(el) ? el : getFirstVisibleTextNode(el);
        var curDocument = findDocument(el);
        var range = curDocument.createRange();
        if (firstVisibleTextChild) {
            range.selectNodeContents(firstVisibleTextChild);
            return calculatePositionByNodeAndOffset(el, { node: firstVisibleTextChild, offset: range.startOffset });
        }
        return 0;
    }
    function getLastVisiblePosition(el) {
        var lastVisibleTextChild = isTextNode(el) ? el : getLastTextNode(el, true);
        if (!lastVisibleTextChild || isResetAnchorOffsetRequired(lastVisibleTextChild, el))
            return 0;
        var curDocument = findDocument(el);
        var range = curDocument.createRange();
        range.selectNodeContents(lastVisibleTextChild);
        return calculatePositionByNodeAndOffset(el, { node: lastVisibleTextChild, offset: range.endOffset });
    }
    function isResetAnchorOffsetRequired(lastVisibleTextChild, el) {
        var firstVisibleTextChild = isTextNode(el) ? el : getFirstTextNode(el, false);
        var isSingleTextNode = lastVisibleTextChild === firstVisibleTextChild;
        var isNewLineChar = lastVisibleTextChild.nodeValue === String.fromCharCode(10);
        return isSingleTextNode && isNewLineChar && hasWhiteSpacePreStyle(lastVisibleTextChild, el);
    }
    function hasWhiteSpacePreStyle(el, container) {
        var whiteSpacePreStyles = ['pre', 'pre-wrap', 'pre-line'];
        while (el !== container) {
            el = hammerhead.nativeMethods.nodeParentNodeGetter.call(el);
            if (indexOf(whiteSpacePreStyles, get(el, 'white-space')) > -1)
                return true;
        }
        return false;
    }
    function getContentEditableNodes(target) {
        var result = [];
        var childNodes = target.childNodes;
        var childNodesLength = getChildNodesLength(childNodes);
        if (!isSkippableNode(target) && !childNodesLength && isTextNode(target))
            result.push(target);
        for (var i = 0; i < childNodesLength; i++)
            result = result.concat(getContentEditableNodes(childNodes[i]));
        return result;
    }
    // contents util
    function getContentEditableValue(target) {
        return map(getContentEditableNodes(target), function (node) { return node.nodeValue; }).join('');
    }

    var contentEditable = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getFirstVisibleTextNode: getFirstVisibleTextNode,
        getLastTextNode: getLastTextNode,
        getFirstNonWhitespaceSymbolIndex: getFirstNonWhitespaceSymbolIndex,
        getLastNonWhitespaceSymbolIndex: getLastNonWhitespaceSymbolIndex,
        isInvisibleTextNode: isInvisibleTextNode,
        findContentEditableParent: findContentEditableParent,
        getNearestCommonAncestor: getNearestCommonAncestor,
        getSelection: getSelection,
        getSelectionStartPosition: getSelectionStartPosition,
        getSelectionEndPosition: getSelectionEndPosition,
        calculateNodeAndOffsetByPosition: calculateNodeAndOffsetByPosition,
        calculatePositionByNodeAndOffset: calculatePositionByNodeAndOffset,
        getElementBySelection: getElementBySelection,
        getFirstVisiblePosition: getFirstVisiblePosition,
        getLastVisiblePosition: getLastVisiblePosition,
        getContentEditableValue: getContentEditableValue
    });

    /* global isIFrameWithoutSrc:true */
    var getElementRectangle = hammerhead__default.utils.position.getElementRectangle;
    var getOffsetPosition = hammerhead__default.utils.position.getOffsetPosition;
    var offsetToClientCoords = hammerhead__default.utils.position.offsetToClientCoords;
    function getIframeClientCoordinates(iframe) {
        var _a = getOffsetPosition(iframe), left = _a.left, top = _a.top;
        var clientPosition = offsetToClientCoords({ x: left, y: top });
        var iframeBorders = getBordersWidth(iframe);
        var iframePadding = getElementPadding(iframe);
        var iframeRectangleLeft = clientPosition.x + iframeBorders.left + iframePadding.left;
        var iframeRectangleTop = clientPosition.y + iframeBorders.top + iframePadding.top;
        return {
            left: iframeRectangleLeft,
            top: iframeRectangleTop,
            right: iframeRectangleLeft + getWidth(iframe),
            bottom: iframeRectangleTop + getHeight(iframe)
        };
    }
    function isElementVisible$1(el) {
        if (isTextNode(el))
            return !isNotVisibleNode(el);
        var elementRectangle = getElementRectangle(el);
        if (!isContentEditableElement(el)) {
            if (elementRectangle.width === 0 || elementRectangle.height === 0)
                return false;
        }
        if (isMapElement(el)) {
            var mapContainer = getMapContainer(closest(el, 'map'));
            return mapContainer ? isElementVisible$1(mapContainer) : false;
        }
        if (isSelectVisibleChild(el)) {
            var select = getSelectParent(el);
            var childRealIndex = getChildVisibleIndex(select, el);
            var realSelectSizeValue = getSelectElementSize(select);
            var topVisibleIndex = Math.max(getScrollTop(select) / getOptionHeight(select), 0);
            var bottomVisibleIndex = topVisibleIndex + realSelectSizeValue - 1;
            var optionVisibleIndex = Math.max(childRealIndex - topVisibleIndex, 0);
            return optionVisibleIndex >= topVisibleIndex && optionVisibleIndex <= bottomVisibleIndex;
        }
        if (isSVGElement(el))
            return get(el, 'visibility') !== 'hidden' && get(el, 'display') !== 'none';
        return hasDimensions(el) && get(el, 'visibility') !== 'hidden';
    }
    function getClientDimensions(target) {
        if (!isDomElement(target)) {
            var clientPoint = offsetToClientCoords(target);
            return {
                width: 0,
                height: 0,
                border: {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0
                },
                scroll: {
                    left: 0,
                    top: 0
                },
                left: clientPoint.x,
                right: clientPoint.x,
                top: clientPoint.y,
                bottom: clientPoint.y
            };
        }
        var isHtmlElement = /html/i.test(target.tagName);
        var body = isHtmlElement ? target.getElementsByTagName('body')[0] : null;
        var elementBorders = getBordersWidth(target);
        var elementRect = target.getBoundingClientRect();
        var elementScroll = getElementScroll(target);
        var isElementInIframe$1 = isElementInIframe(target);
        var elementLeftPosition = isHtmlElement ? 0 : elementRect.left;
        var elementTopPosition = isHtmlElement ? 0 : elementRect.top;
        var elementHeight = isHtmlElement ? target.clientHeight : elementRect.height;
        var elementWidth = isHtmlElement ? target.clientWidth : elementRect.width;
        var isCompatMode = target.ownerDocument.compatMode === 'BackCompat';
        if (isHtmlElement && body && (typeof isIFrameWithoutSrc === 'boolean' && isIFrameWithoutSrc || isCompatMode)) {
            elementHeight = body.clientHeight;
            elementWidth = body.clientWidth;
        }
        if (isElementInIframe$1) {
            var iframeElement = getIframeByElement(target);
            if (iframeElement) {
                var iframeOffset = getOffsetPosition(iframeElement);
                var clientOffset = offsetToClientCoords({
                    x: iframeOffset.left,
                    y: iframeOffset.top
                });
                var iframeBorders = getBordersWidth(iframeElement);
                elementLeftPosition += clientOffset.x + iframeBorders.left;
                elementTopPosition += clientOffset.y + iframeBorders.top;
                if (isHtmlElement) {
                    elementBorders.bottom += iframeBorders.bottom;
                    elementBorders.left += iframeBorders.left;
                    elementBorders.right += iframeBorders.right;
                    elementBorders.top += iframeBorders.top;
                }
            }
        }
        var hasRightScrollbar = !isHtmlElement && getInnerWidth(target) !== target.clientWidth;
        var rightScrollbarWidth = hasRightScrollbar ? getScrollbarSize() : 0;
        var hasBottomScrollbar = !isHtmlElement && getInnerHeight(target) !== target.clientHeight;
        var bottomScrollbarHeight = hasBottomScrollbar ? getScrollbarSize() : 0;
        return {
            width: elementWidth,
            height: elementHeight,
            left: elementLeftPosition,
            top: elementTopPosition,
            border: elementBorders,
            bottom: elementTopPosition + elementHeight,
            right: elementLeftPosition + elementWidth,
            scroll: {
                left: elementScroll.left,
                top: elementScroll.top
            },
            scrollbar: {
                right: rightScrollbarWidth,
                bottom: bottomScrollbarHeight
            }
        };
    }
    function containsOffset(el, offsetX, offsetY) {
        var dimensions = getClientDimensions(el);
        var width = Math.max(el.scrollWidth, dimensions.width);
        var height = Math.max(el.scrollHeight, dimensions.height);
        var maxX = dimensions.scrollbar.right + dimensions.border.left + dimensions.border.right + width;
        var maxY = dimensions.scrollbar.bottom + dimensions.border.top + dimensions.border.bottom + height;
        return (typeof offsetX === 'undefined' || offsetX >= 0 && maxX >= offsetX) &&
            (typeof offsetY === 'undefined' || offsetY >= 0 && maxY >= offsetY);
    }
    function getEventAbsoluteCoordinates(ev) {
        var el = ev.target || ev.srcElement;
        var pageCoordinates = getEventPageCoordinates(ev);
        var curDocument = findDocument(el);
        var xOffset = 0;
        var yOffset = 0;
        if (isElementInIframe(curDocument.documentElement)) {
            var currentIframe = getIframeByElement(curDocument);
            if (currentIframe) {
                var iframeOffset = getOffsetPosition(currentIframe);
                var iframeBorders = getBordersWidth(currentIframe);
                xOffset = iframeOffset.left + iframeBorders.left;
                yOffset = iframeOffset.top + iframeBorders.top;
            }
        }
        return {
            x: pageCoordinates.x + xOffset,
            y: pageCoordinates.y + yOffset
        };
    }
    function getEventPageCoordinates(ev) {
        var curCoordObject = /^touch/.test(ev.type) && ev.targetTouches ? ev.targetTouches[0] || ev.changedTouches[0] : ev;
        var bothPageCoordinatesAreZero = curCoordObject.pageX === 0 && curCoordObject.pageY === 0;
        var notBothClientCoordinatesAreZero = curCoordObject.clientX !== 0 || curCoordObject.clientY !== 0;
        if ((curCoordObject.pageX === null || bothPageCoordinatesAreZero && notBothClientCoordinatesAreZero) &&
            curCoordObject.clientX !== null) {
            var currentDocument = findDocument(ev.target || ev.srcElement);
            var html = currentDocument.documentElement;
            var body = currentDocument.body;
            return {
                x: Math.round(curCoordObject.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) -
                    (html.clientLeft || 0)),
                y: Math.round(curCoordObject.clientY + (html && html.scrollTop || body && body.scrollTop || 0) -
                    (html.clientTop || 0))
            };
        }
        return {
            x: Math.round(curCoordObject.pageX),
            y: Math.round(curCoordObject.pageY)
        };
    }
    function getElementFromPoint(x, y) {
        var el = null;
        var func = document.getElementFromPoint || document.elementFromPoint;
        try {
            // Permission denied to access property 'getElementFromPoint' error in iframe
            el = func.call(document, x, y);
        }
        catch (ex) {
            return null;
        }
        //NOTE: elementFromPoint returns null when is's a border of an iframe
        if (el === null)
            el = func.call(document, x - 1, y - 1);
        while (el && el.shadowRoot && el.shadowRoot.elementFromPoint) {
            var shadowEl = el.shadowRoot.elementFromPoint(x, y);
            if (!shadowEl || el === shadowEl)
                break;
            el = shadowEl;
        }
        return el;
    }
    function getIframePointRelativeToParentFrame(pos, iframeWin) {
        var iframe = findIframeByWindow(iframeWin);
        var iframeOffset = getOffsetPosition(iframe);
        var iframeBorders = getBordersWidth(iframe);
        var iframePadding = getElementPadding(iframe);
        return offsetToClientCoords({
            x: pos.x + iframeOffset.left + iframeBorders.left + iframePadding.left,
            y: pos.y + iframeOffset.top + iframeBorders.top + iframePadding.top
        });
    }
    function clientToOffsetCoord(coords, currentDocument) {
        var doc = currentDocument || document;
        return {
            x: coords.x + getScrollLeft(doc),
            y: coords.y + getScrollTop(doc)
        };
    }
    function findCenter(el) {
        var rectangle = getElementRectangle(el);
        return {
            x: Math.round(rectangle.left + rectangle.width / 2),
            y: Math.round(rectangle.top + rectangle.height / 2)
        };
    }
    function getClientPosition(el) {
        var _a = getOffsetPosition(el), left = _a.left, top = _a.top;
        var clientCoords = offsetToClientCoords({ x: left, y: top });
        clientCoords.x = Math.round(clientCoords.x);
        clientCoords.y = Math.round(clientCoords.y);
        return clientCoords;
    }
    function getElementClientRectangle(el) {
        var rect = getElementRectangle(el);
        var clientPos = offsetToClientCoords({
            x: rect.left,
            y: rect.top
        });
        return {
            height: rect.height,
            left: clientPos.x,
            top: clientPos.y,
            width: rect.width
        };
    }
    function calcRelativePosition(dimensions, toDimensions) {
        return {
            left: Math.ceil(dimensions.left - (toDimensions.left + toDimensions.border.left)),
            right: Math.floor(toDimensions.right - toDimensions.border.right - toDimensions.scrollbar.right -
                dimensions.right),
            top: Math.ceil(dimensions.top - (toDimensions.top + toDimensions.border.top)),
            bottom: Math.floor(toDimensions.bottom - toDimensions.border.bottom - toDimensions.scrollbar.bottom -
                dimensions.bottom)
        };
    }
    function isInRectangle(_a, rectangle) {
        var x = _a.x, y = _a.y;
        return x >= rectangle.left && x <= rectangle.right && y >= rectangle.top && y <= rectangle.bottom;
    }
    function getLineYByXCoord(startLinePoint, endLinePoint, x) {
        if (endLinePoint.x - startLinePoint.x === 0)
            return null;
        var equationSlope = (endLinePoint.y - startLinePoint.y) / (endLinePoint.x - startLinePoint.x);
        var equationYIntercept = startLinePoint.x * (startLinePoint.y - endLinePoint.y) /
            (endLinePoint.x - startLinePoint.x) + startLinePoint.y;
        return Math.round(equationSlope * x + equationYIntercept);
    }
    function getLineXByYCoord(startLinePoint, endLinePoint, y) {
        if (endLinePoint.y - startLinePoint.y === 0)
            return null;
        var equationSlope = (endLinePoint.x - startLinePoint.x) / (endLinePoint.y - startLinePoint.y);
        var equationXIntercept = startLinePoint.y * (startLinePoint.x - endLinePoint.x) /
            (endLinePoint.y - startLinePoint.y) + startLinePoint.x;
        return Math.round(equationSlope * y + equationXIntercept);
    }

    var positionUtils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getElementRectangle: getElementRectangle,
        getOffsetPosition: getOffsetPosition,
        offsetToClientCoords: offsetToClientCoords,
        getIframeClientCoordinates: getIframeClientCoordinates,
        isElementVisible: isElementVisible$1,
        getClientDimensions: getClientDimensions,
        containsOffset: containsOffset,
        getEventAbsoluteCoordinates: getEventAbsoluteCoordinates,
        getEventPageCoordinates: getEventPageCoordinates,
        getElementFromPoint: getElementFromPoint,
        getIframePointRelativeToParentFrame: getIframePointRelativeToParentFrame,
        clientToOffsetCoord: clientToOffsetCoord,
        findCenter: findCenter,
        getClientPosition: getClientPosition,
        getElementClientRectangle: getElementClientRectangle,
        calcRelativePosition: calcRelativePosition,
        isInRectangle: isInRectangle,
        getLineYByXCoord: getLineYByXCoord,
        getLineXByYCoord: getLineXByYCoord
    });

    var Promise$4 = hammerhead__default.Promise;
    function whilst(condition, iterator) {
        return new Promise$4(function (resolve, reject) {
            function iterate() {
                if (condition())
                    return iterator().then(iterate).catch(function (err) { return reject(err); });
                return resolve();
            }
            return iterate();
        });
    }
    function times(n, iterator) {
        var promise = Promise$4.resolve();
        var _loop_1 = function (i) {
            promise = promise.then(function () { return iterator(i); });
        };
        for (var i = 0; i < n; i++) {
            _loop_1(i);
        }
        return promise;
    }
    function each(items, iterator) {
        return reduce(items, function (promise, item) { return promise.then(function () { return iterator(item); }); }, Promise$4.resolve());
    }

    var promiseUtils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        whilst: whilst,
        times: times,
        each: each
    });

    var browserUtils$6 = hammerhead__default.utils.browser;
    var nativeMethods$5 = hammerhead__default.nativeMethods;
    var selectionSandbox = hammerhead__default.eventSandbox.selection;
    //NOTE: we can't determine selection direction in ie from dom api. Therefore we should listen selection changes,
    // and calculate direction using it.
    var BACKWARD_SELECTION_DIRECTION = 'backward';
    var FORWARD_SELECTION_DIRECTION = 'forward';
    var NONE_SELECTION_DIRECTION = 'none';
    var selectionDirection = NONE_SELECTION_DIRECTION;
    var initialLeft = 0;
    var initialTop = 0;
    var lastSelectionHeight = 0;
    var lastSelectionLeft = 0;
    var lastSelectionLength = 0;
    var lastSelectionTop = 0;
    function stateChanged(left, top, height, width, selectionLength) {
        if (!selectionLength) {
            initialLeft = left;
            initialTop = top;
            selectionDirection = NONE_SELECTION_DIRECTION;
        }
        else {
            switch (selectionDirection) {
                case NONE_SELECTION_DIRECTION:
                    if (top === lastSelectionTop && (left === lastSelectionLeft || height > lastSelectionHeight))
                        selectionDirection = FORWARD_SELECTION_DIRECTION;
                    else if (left < lastSelectionLeft || top < lastSelectionTop)
                        selectionDirection = BACKWARD_SELECTION_DIRECTION;
                    break;
                case FORWARD_SELECTION_DIRECTION:
                    if (left === lastSelectionLeft && top === lastSelectionTop ||
                        left < lastSelectionLeft && height > lastSelectionHeight ||
                        top === lastSelectionTop && height === lastSelectionHeight &&
                            selectionLength > lastSelectionLength &&
                            left + width !== initialLeft)
                        break;
                    else if (left < lastSelectionLeft || top < lastSelectionTop)
                        selectionDirection = BACKWARD_SELECTION_DIRECTION;
                    break;
                case BACKWARD_SELECTION_DIRECTION:
                    if ((left < lastSelectionLeft || top < lastSelectionTop) && selectionLength > lastSelectionLength)
                        break;
                    else if (top === initialTop && (left >= initialLeft || height > lastSelectionHeight))
                        selectionDirection = FORWARD_SELECTION_DIRECTION;
                    break;
            }
        }
        lastSelectionHeight = height;
        lastSelectionLeft = left;
        lastSelectionLength = selectionLength;
        lastSelectionTop = top;
    }
    function onSelectionChange() {
        var activeElement = null;
        var endSelection = null;
        var range = null;
        var rect = null;
        var startSelection = null;
        try {
            if (this.selection)
                range = this.selection.createRange();
            else {
                //HACK: we need do this for IE11 because otherwise we can not get TextRange properties
                activeElement = nativeMethods$5.documentActiveElementGetter.call(this);
                if (!activeElement || !isTextEditableElement(activeElement)) {
                    selectionDirection = NONE_SELECTION_DIRECTION;
                    return;
                }
                startSelection = getSelectionStart$1(activeElement);
                endSelection = getSelectionEnd$1(activeElement);
                if (activeElement.createTextRange) {
                    range = activeElement.createTextRange();
                    range.collapse(true);
                    range.moveStart('character', startSelection);
                    range.moveEnd('character', endSelection - startSelection);
                }
                else if (document.createRange) {
                    //NOTE: for MSEdge
                    range = document.createRange();
                    var textNode = hammerhead__default.nativeMethods.nodeFirstChildGetter.call(activeElement);
                    range.setStart(textNode, startSelection);
                    range.setEnd(textNode, endSelection);
                    rect = range.getBoundingClientRect();
                }
            }
        }
        catch (e) {
            //NOTE: in ie it raises error when there are not a real selection
            selectionDirection = NONE_SELECTION_DIRECTION;
            return;
        }
        var rangeLeft = rect ? Math.ceil(rect.left) : range.offsetLeft;
        var rangeTop = rect ? Math.ceil(rect.top) : range.offsetTop;
        var rangeHeight = rect ? Math.ceil(rect.height) : range.boundingHeight;
        var rangeWidth = rect ? Math.ceil(rect.width) : range.boundingWidth;
        var rangeHTMLTextLength = range.htmlText ? range.htmlText.length : 0;
        var rangeTextLength = rect ? range.toString().length : rangeHTMLTextLength;
        stateChanged(rangeLeft, rangeTop, rangeHeight, rangeWidth, rangeTextLength);
    }
    if (browserUtils$6.isIE)
        bind(document, 'selectionchange', onSelectionChange, true);
    //utils for contentEditable
    function selectContentEditable(el, from, to, needFocus) {
        var endPosition = null;
        var firstTextNodeChild = null;
        var latestTextNodeChild = null;
        var startPosition = null;
        var temp = null;
        var inverse = false;
        if (typeof from !== 'undefined' && typeof to !== 'undefined' && from > to) {
            temp = from;
            from = to;
            to = temp;
            inverse = true;
        }
        if (typeof from === 'undefined') {
            firstTextNodeChild = getFirstVisibleTextNode(el);
            startPosition = {
                node: firstTextNodeChild || el,
                offset: firstTextNodeChild && firstTextNodeChild.nodeValue ?
                    getFirstNonWhitespaceSymbolIndex(firstTextNodeChild.nodeValue) : 0
            };
        }
        if (typeof to === 'undefined') {
            latestTextNodeChild = getLastTextNode(el, true);
            endPosition = {
                node: latestTextNodeChild || el,
                offset: latestTextNodeChild && latestTextNodeChild.nodeValue ?
                    getLastNonWhitespaceSymbolIndex(latestTextNodeChild.nodeValue) : 0
            };
        }
        startPosition = startPosition || calculateNodeAndOffsetByPosition(el, from);
        endPosition = endPosition || calculateNodeAndOffsetByPosition(el, to);
        if (!startPosition.node || !endPosition.node)
            return;
        if (inverse)
            selectByNodesAndOffsets(endPosition, startPosition, needFocus);
        else
            selectByNodesAndOffsets(startPosition, endPosition, needFocus);
    }
    function correctContentEditableSelectionBeforeDelete(el) {
        var selection = getSelectionByElement(el);
        var startNode = selection.anchorNode;
        var endNode = selection.focusNode;
        var startOffset = selection.anchorOffset;
        var endOffset = selection.focusOffset;
        var startNodeFirstNonWhitespaceSymbol = getFirstNonWhitespaceSymbolIndex(startNode.nodeValue);
        var startNodeLastNonWhitespaceSymbol = getLastNonWhitespaceSymbolIndex(startNode.nodeValue);
        var endNodeFirstNonWhitespaceSymbol = getFirstNonWhitespaceSymbolIndex(endNode.nodeValue);
        var endNodeLastNonWhitespaceSymbol = getLastNonWhitespaceSymbolIndex(endNode.nodeValue);
        var newStartOffset = null;
        var newEndOffset = null;
        if (isTextNode(startNode)) {
            if (startOffset < startNodeFirstNonWhitespaceSymbol && startOffset !== 0)
                newStartOffset = 0;
            else if (startOffset !== startNode.nodeValue.length &&
                (isInvisibleTextNode(startNode) && startOffset !== 0 ||
                    startOffset > startNodeLastNonWhitespaceSymbol))
                newStartOffset = startNode.nodeValue.length;
        }
        if (isTextNode(endNode)) {
            if (endOffset < endNodeFirstNonWhitespaceSymbol && endOffset !== 0)
                newEndOffset = 0;
            else if (endOffset !== endNode.nodeValue.length &&
                (isInvisibleTextNode(endNode) && endOffset !== 0 ||
                    endOffset > endNodeLastNonWhitespaceSymbol))
                newEndOffset = endNode.nodeValue.length;
        }
        if (browserUtils$6.isWebKit || browserUtils$6.isIE && browserUtils$6.version > 11) {
            if (newStartOffset !== null) {
                if (newStartOffset === 0)
                    startNode.nodeValue = startNode.nodeValue.substring(startNodeFirstNonWhitespaceSymbol);
                else
                    startNode.nodeValue = startNode.nodeValue.substring(0, startNodeLastNonWhitespaceSymbol);
            }
            if (newEndOffset !== null) {
                if (newEndOffset === 0)
                    endNode.nodeValue = endNode.nodeValue.substring(endNodeFirstNonWhitespaceSymbol);
                else
                    endNode.nodeValue = endNode.nodeValue.substring(0, endNodeLastNonWhitespaceSymbol);
            }
        }
        if (newStartOffset !== null || newEndOffset !== null) {
            if (newStartOffset !== null)
                newStartOffset = newStartOffset === 0 ? newStartOffset : startNode.nodeValue.length;
            else
                newStartOffset = startOffset;
            if (newEndOffset !== null)
                newEndOffset = newEndOffset === 0 ? newEndOffset : endNode.nodeValue.length;
            else
                newEndOffset = endOffset;
            var startPos = { node: startNode, offset: newStartOffset };
            var endPos = { node: endNode, offset: newEndOffset };
            selectByNodesAndOffsets(startPos, endPos);
        }
    }
    //API
    function hasInverseSelectionContentEditable(el) {
        var curDocument = el ? findDocument(el) : document;
        var selection = curDocument.getSelection();
        var range = null;
        var backward = false;
        if (selection) {
            if (!selection.isCollapsed) {
                range = curDocument.createRange();
                range.setStart(selection.anchorNode, selection.anchorOffset);
                range.setEnd(selection.focusNode, selection.focusOffset);
                backward = range.collapsed;
                range.detach();
            }
        }
        return backward;
    }
    function isInverseSelectionContentEditable(element, startPos, endPos) {
        var startPosition = calculatePositionByNodeAndOffset(element, startPos);
        var endPosition = calculatePositionByNodeAndOffset(element, endPos);
        return startPosition > endPosition;
    }
    function getSelectionStart$1(el) {
        var selection = null;
        if (!isContentEditableElement(el))
            return selectionSandbox.getSelection(el).start;
        if (hasElementContainsSelection(el)) {
            selection = getSelectionByElement(el);
            return getSelectionStartPosition(el, selection, hasInverseSelectionContentEditable(el));
        }
        return 0;
    }
    function getSelectionEnd$1(el) {
        var selection = null;
        if (!isContentEditableElement(el))
            return selectionSandbox.getSelection(el).end;
        if (hasElementContainsSelection(el)) {
            selection = getSelectionByElement(el);
            return getSelectionEndPosition(el, selection, hasInverseSelectionContentEditable(el));
        }
        return 0;
    }
    function hasInverseSelection(el) {
        if (isContentEditableElement(el))
            return hasInverseSelectionContentEditable(el);
        return (selectionSandbox.getSelection(el).direction || selectionDirection) === BACKWARD_SELECTION_DIRECTION;
    }
    function getSelectionByElement(el) {
        var currentDocument = findDocument(el);
        return currentDocument ? currentDocument.getSelection() : window.getSelection();
    }
    function select(el, from, to) {
        if (isContentEditableElement(el)) {
            selectContentEditable(el, from, to, true);
            return;
        }
        var start = from || 0;
        var end = typeof to === 'undefined' ? getElementValue(el).length : to;
        var inverse = false;
        var temp = null;
        if (start > end) {
            temp = start;
            start = end;
            end = temp;
            inverse = true;
        }
        selectionSandbox.setSelection(el, start, end, inverse ? BACKWARD_SELECTION_DIRECTION : FORWARD_SELECTION_DIRECTION);
        if (from === to)
            selectionDirection = NONE_SELECTION_DIRECTION;
        else
            selectionDirection = inverse ? BACKWARD_SELECTION_DIRECTION : FORWARD_SELECTION_DIRECTION;
    }
    function selectByNodesAndOffsets(startPos, endPos, needFocus) {
        var startNode = startPos.node;
        var endNode = endPos.node;
        var startNodeLength = startNode.nodeValue ? startNode.length : 0;
        var endNodeLength = endNode.nodeValue ? endNode.length : 0;
        var startOffset = startPos.offset;
        var endOffset = endPos.offset;
        if (!isElementNode(startNode) || !startOffset)
            startOffset = Math.min(startNodeLength, startPos.offset);
        if (!isElementNode(endNode) || !endOffset)
            endOffset = Math.min(endNodeLength, endPos.offset);
        var parentElement = findContentEditableParent(startNode);
        var inverse = isInverseSelectionContentEditable(parentElement, startPos, endPos);
        var selection = getSelectionByElement(parentElement);
        var curDocument = findDocument(parentElement);
        var range = curDocument.createRange();
        var selectionSetter = function () {
            selection.removeAllRanges();
            //NOTE: For IE we can't create inverse selection
            if (!inverse) {
                range.setStart(startNode, startOffset);
                range.setEnd(endNode, endOffset);
                selection.addRange(range);
            }
            else if (browserUtils$6.isIE) {
                range.setStart(endNode, endOffset);
                range.setEnd(startNode, startOffset);
                selection.addRange(range);
            }
            else {
                range.setStart(startNode, startOffset);
                range.setEnd(startNode, startOffset);
                selection.addRange(range);
                var shouldCutEndOffset = browserUtils$6.isSafari || browserUtils$6.isChrome && browserUtils$6.version < 58;
                var extendSelection = function (node, offset) {
                    // NODE: in some cases in Firefox extend method raises error so we use try-catch
                    try {
                        selection.extend(node, offset);
                    }
                    catch (err) {
                        return false;
                    }
                    return true;
                };
                if (shouldCutEndOffset && isInvisibleTextNode(endNode)) {
                    if (!extendSelection(endNode, Math.min(endOffset, 1)))
                        extendSelection(endNode, 0);
                }
                else
                    extendSelection(endNode, endOffset);
            }
        };
        selectionSandbox.wrapSetterSelection(parentElement, selectionSetter, needFocus, true);
    }
    function deleteSelectionRanges(el) {
        var selection = getSelectionByElement(el);
        var rangeCount = selection.rangeCount;
        if (!rangeCount)
            return;
        for (var i = 0; i < rangeCount; i++)
            selection.getRangeAt(i).deleteContents();
    }
    function deleteSelectionContents(el, selectAll) {
        var startSelection = getSelectionStart$1(el);
        var endSelection = getSelectionEnd$1(el);
        if (selectAll)
            selectContentEditable(el);
        if (startSelection === endSelection)
            return;
        // NOTE: If selection is not contain initial and final invisible symbols
        //we should select its
        correctContentEditableSelectionBeforeDelete(el);
        deleteSelectionRanges(el);
        var selection = getSelectionByElement(el);
        var range = null;
        //NOTE: We should try to do selection collapsed
        if (selection.rangeCount && !selection.getRangeAt(0).collapsed) {
            range = selection.getRangeAt(0);
            range.collapse(true);
        }
    }
    function setCursorToLastVisiblePosition(el) {
        var position = getLastVisiblePosition(el);
        selectContentEditable(el, position, position);
    }
    function hasElementContainsSelection(el) {
        var selection = getSelectionByElement(el);
        return selection.anchorNode && selection.focusNode ?
            isElementContainsNode(el, selection.anchorNode) &&
                isElementContainsNode(el, selection.focusNode) :
            false;
    }

    var textSelection = /*#__PURE__*/Object.freeze({
        __proto__: null,
        hasInverseSelectionContentEditable: hasInverseSelectionContentEditable,
        isInverseSelectionContentEditable: isInverseSelectionContentEditable,
        getSelectionStart: getSelectionStart$1,
        getSelectionEnd: getSelectionEnd$1,
        hasInverseSelection: hasInverseSelection,
        getSelectionByElement: getSelectionByElement,
        select: select,
        selectByNodesAndOffsets: selectByNodesAndOffsets,
        deleteSelectionContents: deleteSelectionContents,
        setCursorToLastVisiblePosition: setCursorToLastVisiblePosition,
        hasElementContainsSelection: hasElementContainsSelection
    });

    var Promise$5 = hammerhead__default.Promise;
    var nativeMethods$6 = hammerhead__default.nativeMethods;
    function waitFor (fn, delay, timeout) {
        return new Promise$5(function (resolve, reject) {
            var result = fn();
            if (result) {
                resolve(result);
                return;
            }
            var intervalId = nativeMethods$6.setInterval.call(window, function () {
                result = fn();
                if (result) {
                    nativeMethods$6.clearInterval.call(window, intervalId);
                    nativeMethods$6.clearTimeout.call(window, timeoutId);
                    resolve(result);
                }
            }, delay);
            var timeoutId = nativeMethods$6.setTimeout.call(window, function () {
                nativeMethods$6.clearInterval.call(window, intervalId);
                reject();
            }, timeout);
        });
    }

    // -------------------------------------------------------------
    var RUNTIME_ERRORS = {
        cannotCreateMultipleLiveModeRunners: 'E1000',
        cannotRunLiveModeRunnerMultipleTimes: 'E1001',
        browserDisconnected: 'E1002',
        cannotRunAgainstDisconnectedBrowsers: 'E1003',
        cannotEstablishBrowserConnection: 'E1004',
        cannotFindBrowser: 'E1005',
        browserProviderNotFound: 'E1006',
        browserNotSet: 'E1007',
        testFilesNotFound: 'E1008',
        noTestsToRun: 'E1009',
        cannotFindReporterForAlias: 'E1010',
        multipleSameStreamReporters: 'E1011',
        optionValueIsNotValidRegExp: 'E1012',
        optionValueIsNotValidKeyValue: 'E1013',
        invalidSpeedValue: 'E1014',
        invalidConcurrencyFactor: 'E1015',
        cannotDivideRemotesCountByConcurrency: 'E1016',
        portsOptionRequiresTwoNumbers: 'E1017',
        portIsNotFree: 'E1018',
        invalidHostname: 'E1019',
        cannotFindSpecifiedTestSource: 'E1020',
        clientFunctionCodeIsNotAFunction: 'E1021',
        selectorInitializedWithWrongType: 'E1022',
        clientFunctionCannotResolveTestRun: 'E1023',
        regeneratorInClientFunctionCode: 'E1024',
        invalidClientFunctionTestRunBinding: 'E1025',
        invalidValueType: 'E1026',
        unsupportedUrlProtocol: 'E1027',
        testControllerProxyCannotResolveTestRun: 'E1028',
        timeLimitedPromiseTimeoutExpired: 'E1029',
        cannotSetVideoOptionsWithoutBaseVideoPathSpecified: 'E1031',
        multipleAPIMethodCallForbidden: 'E1032',
        invalidReporterOutput: 'E1033',
        cannotReadSSLCertFile: 'E1034',
        cannotPrepareTestsDueToError: 'E1035',
        cannotParseRawFile: 'E1036',
        testedAppFailedWithError: 'E1037',
        unableToOpenBrowser: 'E1038',
        requestHookConfigureAPIError: 'E1039',
        forbiddenCharatersInScreenshotPath: 'E1040',
        cannotFindFFMPEG: 'E1041',
        compositeArgumentsError: 'E1042',
        cannotFindTypescriptConfigurationFile: 'E1043',
        clientScriptInitializerIsNotSpecified: 'E1044',
        clientScriptBasePathIsNotSpecified: 'E1045',
        clientScriptInitializerMultipleContentSources: 'E1046',
        cannotLoadClientScriptFromPath: 'E1047',
        clientScriptModuleEntryPointPathCalculationError: 'E1048',
        methodIsNotAvailableForAnIPCHost: 'E1049',
        tooLargeIPCPayload: 'E1050',
        malformedIPCMessage: 'E1051',
        unexpectedIPCHeadPacket: 'E1052',
        unexpectedIPCBodyPacket: 'E1053',
        unexpectedIPCTailPacket: 'E1054',
        cannotUseAllowMultipleWindowsOptionForLegacyTests: 'E1055',
        cannotUseAllowMultipleWindowsOptionForSomeBrowsers: 'E1056'
    };

    // -------------------------------------------------------------
    // WARNING: this file is used by both the client and the server.
    // Do not use any browser or node-specific API!
    // -------------------------------------------------------------
    var _a;
    var TEST_SOURCE_PARAMETER_DOCUMENTATION_LINK = 'https://devexpress.github.io/testcafe/documentation/using-testcafe/command-line-interface.html#file-pathglob-pattern';
    var TEMPLATES = (_a = {},
        _a[RUNTIME_ERRORS.cannotCreateMultipleLiveModeRunners] = 'Cannot create multiple live mode runners.',
        _a[RUNTIME_ERRORS.cannotRunLiveModeRunnerMultipleTimes] = 'Cannot run a live mode runner multiple times.',
        _a[RUNTIME_ERRORS.browserDisconnected] = 'The {userAgent} browser disconnected. This problem may appear when a browser hangs or is closed, or due to network issues.',
        _a[RUNTIME_ERRORS.cannotRunAgainstDisconnectedBrowsers] = 'The following browsers disconnected: {userAgents}. Tests will not be run.',
        _a[RUNTIME_ERRORS.cannotEstablishBrowserConnection] = 'Unable to establish one or more of the specified browser connections. This can be caused by network issues or remote device failure.',
        _a[RUNTIME_ERRORS.cannotFindBrowser] = 'Unable to find the browser. "{browser}" is not a browser alias or path to an executable file.',
        _a[RUNTIME_ERRORS.browserProviderNotFound] = 'The specified "{providerName}" browser provider was not found.',
        _a[RUNTIME_ERRORS.browserNotSet] = 'No browser selected to test against.',
        _a[RUNTIME_ERRORS.testFilesNotFound] = 'TestCafe could not find the test files that match the following patterns:\n' +
            '{sourceList}\n\n' +
            'The "{cwd}" current working directory was used as the base path.\n' +
            'Ensure the file patterns are correct or change the current working directory.\n' +
            ("For more information on how to specify test files, see " + TEST_SOURCE_PARAMETER_DOCUMENTATION_LINK + "."),
        _a[RUNTIME_ERRORS.noTestsToRun] = 'No tests to run. Either the test files contain no tests or the filter function is too restrictive.',
        _a[RUNTIME_ERRORS.cannotFindReporterForAlias] = 'The provided "{name}" reporter does not exist. Check that you have specified the report format correctly.',
        _a[RUNTIME_ERRORS.multipleSameStreamReporters] = 'The following reporters attempted to write to the same output stream: "{reporters}". Only one reporter can write to a stream.',
        _a[RUNTIME_ERRORS.optionValueIsNotValidRegExp] = 'The "{optionName}" option value is not a valid regular expression.',
        _a[RUNTIME_ERRORS.optionValueIsNotValidKeyValue] = 'The "{optionName}" option value is not a valid key-value pair.',
        _a[RUNTIME_ERRORS.invalidSpeedValue] = 'Speed should be a number between 0.01 and 1.',
        _a[RUNTIME_ERRORS.invalidConcurrencyFactor] = 'The concurrency factor should be an integer greater or equal to 1.',
        _a[RUNTIME_ERRORS.cannotDivideRemotesCountByConcurrency] = 'The number of remote browsers should be divisible by the factor of concurrency.',
        _a[RUNTIME_ERRORS.portsOptionRequiresTwoNumbers] = 'The "--ports" option requires two numbers to be specified.',
        _a[RUNTIME_ERRORS.portIsNotFree] = 'The specified {portNum} port is already in use by another program.',
        _a[RUNTIME_ERRORS.invalidHostname] = 'The specified "{hostname}" hostname cannot be resolved to the current machine.',
        _a[RUNTIME_ERRORS.cannotFindSpecifiedTestSource] = 'Cannot find a test source file at "{path}".',
        _a[RUNTIME_ERRORS.clientFunctionCodeIsNotAFunction] = '{#instantiationCallsiteName} code is expected to be specified as a function, but {type} was passed.',
        _a[RUNTIME_ERRORS.selectorInitializedWithWrongType] = '{#instantiationCallsiteName} is expected to be initialized with a function, CSS selector string, another Selector, node snapshot or a Promise returned by a Selector, but {type} was passed.',
        _a[RUNTIME_ERRORS.clientFunctionCannotResolveTestRun] = "{#instantiationCallsiteName} cannot implicitly resolve the test run in context of which it should be executed. If you need to call {#instantiationCallsiteName} from the Node.js API callback, pass the test controller manually via {#instantiationCallsiteName}'s `.with({ boundTestRun: t })` method first. Note that you cannot execute {#instantiationCallsiteName} outside the test code.",
        _a[RUNTIME_ERRORS.regeneratorInClientFunctionCode] = "{#instantiationCallsiteName} code, arguments or dependencies cannot contain generators or \"async/await\" syntax (use Promises instead).",
        _a[RUNTIME_ERRORS.invalidClientFunctionTestRunBinding] = 'The "boundTestRun" option value is expected to be a test controller.',
        _a[RUNTIME_ERRORS.invalidValueType] = '{smthg} is expected to be a {type}, but it was {actual}.',
        _a[RUNTIME_ERRORS.unsupportedUrlProtocol] = 'The specified "{url}" test page URL uses an unsupported {protocol}:// protocol. Only relative URLs or absolute URLs with http://, https:// and file:// protocols are supported.',
        _a[RUNTIME_ERRORS.testControllerProxyCannotResolveTestRun] = "Cannot implicitly resolve the test run in the context of which the test controller action should be executed. Use test function's 't' argument instead.",
        _a[RUNTIME_ERRORS.timeLimitedPromiseTimeoutExpired] = 'Timeout expired for a time limited promise',
        _a[RUNTIME_ERRORS.cannotSetVideoOptionsWithoutBaseVideoPathSpecified] = 'Unable to set video or encoding options when video recording is disabled. Specify the base path where video files are stored to enable recording.',
        _a[RUNTIME_ERRORS.multipleAPIMethodCallForbidden] = 'You cannot call the "{methodName}" method more than once. Pass an array of parameters to this method instead.',
        _a[RUNTIME_ERRORS.invalidReporterOutput] = "Specify a file name or a writable stream as the reporter's output target.",
        _a[RUNTIME_ERRORS.cannotReadSSLCertFile] = 'Unable to read the "{path}" file, specified by the "{option}" ssl option. Error details:\n' +
            '\n' +
            '{err}',
        _a[RUNTIME_ERRORS.cannotPrepareTestsDueToError] = 'Cannot prepare tests due to an error.\n' +
            '\n' +
            '{errMessage}',
        _a[RUNTIME_ERRORS.cannotParseRawFile] = 'Cannot parse a test source file in the raw format at "{path}" due to an error.\n' +
            '\n' +
            '{errMessage}',
        _a[RUNTIME_ERRORS.testedAppFailedWithError] = 'Tested app failed with an error:\n' +
            '\n' +
            '{errMessage}',
        _a[RUNTIME_ERRORS.unableToOpenBrowser] = 'Was unable to open the browser "{alias}" due to error.\n' +
            '\n' +
            '{errMessage}',
        _a[RUNTIME_ERRORS.requestHookConfigureAPIError] = 'There was an error while configuring the request hook:\n' +
            '\n' +
            '{requestHookName}: {errMsg}',
        _a[RUNTIME_ERRORS.forbiddenCharatersInScreenshotPath] = 'There are forbidden characters in the "{screenshotPath}" {screenshotPathType}:\n' +
            ' {forbiddenCharsDescription}',
        _a[RUNTIME_ERRORS.cannotFindFFMPEG] = 'Unable to locate the FFmpeg executable required to record videos. Do one of the following:\n' +
            '\n' +
            '* add the FFmpeg installation directory to the PATH environment variable,\n' +
            '* specify the path to the FFmpeg executable in the FFMPEG_PATH environment variable or the ffmpegPath video option,\n' +
            '* install the @ffmpeg-installer/ffmpeg package from npm.',
        _a[RUNTIME_ERRORS.cannotFindTypescriptConfigurationFile] = 'Unable to find the TypeScript configuration file in "{filePath}"',
        _a[RUNTIME_ERRORS.clientScriptInitializerIsNotSpecified] = 'Specify the JavaScript file path, module name or script content to inject a client script.',
        _a[RUNTIME_ERRORS.clientScriptBasePathIsNotSpecified] = 'Specify the base path for the client script file.',
        _a[RUNTIME_ERRORS.clientScriptInitializerMultipleContentSources] = 'You cannot combine the file path, module name and script content when you specify a client script to inject.',
        _a[RUNTIME_ERRORS.cannotLoadClientScriptFromPath] = 'Cannot load a client script from {path}.',
        _a[RUNTIME_ERRORS.clientScriptModuleEntryPointPathCalculationError] = 'An error occurred when trying to locate the injected client script module:\n\n{errorMessage}.',
        _a[RUNTIME_ERRORS.methodIsNotAvailableForAnIPCHost] = 'This method cannot be called on a service host.',
        _a[RUNTIME_ERRORS.tooLargeIPCPayload] = 'The specified payload is too large to form an IPC packet.',
        _a[RUNTIME_ERRORS.malformedIPCMessage] = 'Cannot process a malformed IPC message.',
        _a[RUNTIME_ERRORS.unexpectedIPCHeadPacket] = 'Cannot create an IPC message due to an unexpected IPC head packet.',
        _a[RUNTIME_ERRORS.unexpectedIPCBodyPacket] = 'Cannot create an IPC message due to an unexpected IPC body packet.',
        _a[RUNTIME_ERRORS.unexpectedIPCTailPacket] = 'Cannot create an IPC message due to an unexpected IPC tail packet.',
        _a[RUNTIME_ERRORS.cannotFindTypescriptConfigurationFile] = 'Unable to find the TypeScript configuration file in "{filePath}"',
        _a[RUNTIME_ERRORS.clientScriptInitializerIsNotSpecified] = 'Specify the JavaScript file path, module name or script content to inject a client script.',
        _a[RUNTIME_ERRORS.clientScriptBasePathIsNotSpecified] = 'Specify the base path for the client script file.',
        _a[RUNTIME_ERRORS.clientScriptInitializerMultipleContentSources] = 'You cannot combine the file path, module name and script content when you specify a client script to inject.',
        _a[RUNTIME_ERRORS.clientScriptModuleEntryPointPathCalculationError] = 'An error occurred when trying to locate the injected client script module:\n\n{errorMessage}.',
        _a[RUNTIME_ERRORS.cannotUseAllowMultipleWindowsOptionForLegacyTests] = 'You cannot run Legacy API tests in multi-window mode.',
        _a[RUNTIME_ERRORS.cannotUseAllowMultipleWindowsOptionForSomeBrowsers] = 'You cannot use multi-window mode in {browsers}.',
        _a);

    var timeLimitedPromiseTimeoutExpiredTemplate = TEMPLATES[RUNTIME_ERRORS.timeLimitedPromiseTimeoutExpired];
    var TimeLimitedPromiseTimeoutExpiredError = /** @class */ (function (_super) {
        __extends(TimeLimitedPromiseTimeoutExpiredError, _super);
        function TimeLimitedPromiseTimeoutExpiredError() {
            var _this = _super.call(this, timeLimitedPromiseTimeoutExpiredTemplate) || this;
            _this.code = RUNTIME_ERRORS.timeLimitedPromiseTimeoutExpired;
            return _this;
        }
        return TimeLimitedPromiseTimeoutExpiredError;
    }(Error));
    function getTimeLimitedPromise (promise, ms) {
        return hammerhead.Promise.race([promise, delay(ms).then(function () { return hammerhead.Promise.reject(new TimeLimitedPromiseTimeoutExpiredError()); })]);
    }

    function noop() {
    }

    function getKeyArray(keyCombination) {
        // NOTE: we should separate the '+' symbol that concats other
        // keys and the '+'  key to support commands like the 'ctrl++'
        var keys = keyCombination.replace(/^\+/g, 'plus').replace(/\+\+/g, '+plus').split('+');
        return map(keys, function (key) { return key.replace('plus', '+'); });
    }

    function getSanitizedKey(key) {
        var isChar = key.length === 1 || key === 'space';
        var sanitizedKey = isChar ? key : key.toLowerCase();
        if (KEY_MAPS.modifiersMap[sanitizedKey])
            sanitizedKey = KEY_MAPS.modifiersMap[sanitizedKey];
        return sanitizedKey;
    }

    var trim = hammerhead__default.utils.trim;
    function parseKeySequence (keyString) {
        if (typeof keyString !== 'string')
            return { error: true };
        keyString = trim(keyString).replace(/\s+/g, ' ');
        var keyStringLength = keyString.length;
        var lastChar = keyString.charAt(keyStringLength - 1);
        var charBeforeLast = keyString.charAt(keyStringLength - 2);
        // NOTE: trim last connecting '+'
        if (keyStringLength > 1 && lastChar === '+' && !/[+ ]/.test(charBeforeLast))
            keyString = keyString.substring(0, keyString.length - 1);
        var combinations = keyString.split(' ');
        var error = some(combinations, function (combination) {
            var keyArray = getKeyArray(combination);
            return some(keyArray, function (key) {
                var isChar = key.length === 1 || key === 'space';
                var sanitizedKey = getSanitizedKey(key);
                var modifierKeyCode = KEY_MAPS.modifiers[sanitizedKey];
                var specialKeyCode = KEY_MAPS.specialKeys[sanitizedKey];
                return !(isChar || modifierKeyCode || specialKeyCode);
            });
        });
        return {
            combinations: combinations,
            error: error,
            keys: keyString
        };
    }

    var Promise$6 = hammerhead__default.Promise;
    var messageSandbox = hammerhead__default.eventSandbox.message;
    function sendRequestToFrame(msg, responseCmd, receiverWindow) {
        return new Promise$6(function (resolve) {
            function onMessage(e) {
                if (e.message.cmd === responseCmd) {
                    messageSandbox.off(messageSandbox.SERVICE_MSG_RECEIVED_EVENT, onMessage);
                    resolve(e.message);
                }
            }
            messageSandbox.on(messageSandbox.SERVICE_MSG_RECEIVED_EVENT, onMessage);
            messageSandbox.sendServiceMsg(msg, receiverWindow);
        });
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var PENDING = 'pending';
    var SETTLED = 'settled';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';
    var NOOP = function () {};
    var isNode = typeof commonjsGlobal !== 'undefined' && typeof commonjsGlobal.process !== 'undefined' && typeof commonjsGlobal.process.emit === 'function';

    var asyncSetTimer = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;
    var asyncQueue = [];
    var asyncTimer;

    function asyncFlush() {
    	// run promise callbacks
    	for (var i = 0; i < asyncQueue.length; i++) {
    		asyncQueue[i][0](asyncQueue[i][1]);
    	}

    	// reset async asyncQueue
    	asyncQueue = [];
    	asyncTimer = false;
    }

    function asyncCall(callback, arg) {
    	asyncQueue.push([callback, arg]);

    	if (!asyncTimer) {
    		asyncTimer = true;
    		asyncSetTimer(asyncFlush, 0);
    	}
    }

    function invokeResolver(resolver, promise) {
    	function resolvePromise(value) {
    		resolve(promise, value);
    	}

    	function rejectPromise(reason) {
    		reject(promise, reason);
    	}

    	try {
    		resolver(resolvePromise, rejectPromise);
    	} catch (e) {
    		rejectPromise(e);
    	}
    }

    function invokeCallback(subscriber) {
    	var owner = subscriber.owner;
    	var settled = owner._state;
    	var value = owner._data;
    	var callback = subscriber[settled];
    	var promise = subscriber.then;

    	if (typeof callback === 'function') {
    		settled = FULFILLED;
    		try {
    			value = callback(value);
    		} catch (e) {
    			reject(promise, e);
    		}
    	}

    	if (!handleThenable(promise, value)) {
    		if (settled === FULFILLED) {
    			resolve(promise, value);
    		}

    		if (settled === REJECTED) {
    			reject(promise, value);
    		}
    	}
    }

    function handleThenable(promise, value) {
    	var resolved;

    	try {
    		if (promise === value) {
    			throw new TypeError('A promises callback cannot return that same promise.');
    		}

    		if (value && (typeof value === 'function' || typeof value === 'object')) {
    			// then should be retrieved only once
    			var then = value.then;

    			if (typeof then === 'function') {
    				then.call(value, function (val) {
    					if (!resolved) {
    						resolved = true;

    						if (value === val) {
    							fulfill(promise, val);
    						} else {
    							resolve(promise, val);
    						}
    					}
    				}, function (reason) {
    					if (!resolved) {
    						resolved = true;

    						reject(promise, reason);
    					}
    				});

    				return true;
    			}
    		}
    	} catch (e) {
    		if (!resolved) {
    			reject(promise, e);
    		}

    		return true;
    	}

    	return false;
    }

    function resolve(promise, value) {
    	if (promise === value || !handleThenable(promise, value)) {
    		fulfill(promise, value);
    	}
    }

    function fulfill(promise, value) {
    	if (promise._state === PENDING) {
    		promise._state = SETTLED;
    		promise._data = value;

    		asyncCall(publishFulfillment, promise);
    	}
    }

    function reject(promise, reason) {
    	if (promise._state === PENDING) {
    		promise._state = SETTLED;
    		promise._data = reason;

    		asyncCall(publishRejection, promise);
    	}
    }

    function publish(promise) {
    	promise._then = promise._then.forEach(invokeCallback);
    }

    function publishFulfillment(promise) {
    	promise._state = FULFILLED;
    	publish(promise);
    }

    function publishRejection(promise) {
    	promise._state = REJECTED;
    	publish(promise);
    	if (!promise._handled && isNode) {
    		commonjsGlobal.process.emit('unhandledRejection', promise._data, promise);
    	}
    }

    function notifyRejectionHandled(promise) {
    	commonjsGlobal.process.emit('rejectionHandled', promise);
    }

    /**
     * @class
     */
    function Promise$7(resolver) {
    	if (typeof resolver !== 'function') {
    		throw new TypeError('Promise resolver ' + resolver + ' is not a function');
    	}

    	if (this instanceof Promise$7 === false) {
    		throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
    	}

    	this._then = [];

    	invokeResolver(resolver, this);
    }

    Promise$7.prototype = {
    	constructor: Promise$7,

    	_state: PENDING,
    	_then: null,
    	_data: undefined,
    	_handled: false,

    	then: function (onFulfillment, onRejection) {
    		var subscriber = {
    			owner: this,
    			then: new this.constructor(NOOP),
    			fulfilled: onFulfillment,
    			rejected: onRejection
    		};

    		if ((onRejection || onFulfillment) && !this._handled) {
    			this._handled = true;
    			if (this._state === REJECTED && isNode) {
    				asyncCall(notifyRejectionHandled, this);
    			}
    		}

    		if (this._state === FULFILLED || this._state === REJECTED) {
    			// already resolved, call callback async
    			asyncCall(invokeCallback, subscriber);
    		} else {
    			// subscribe
    			this._then.push(subscriber);
    		}

    		return subscriber.then;
    	},

    	catch: function (onRejection) {
    		return this.then(null, onRejection);
    	}
    };

    Promise$7.all = function (promises) {
    	if (!Array.isArray(promises)) {
    		throw new TypeError('You must pass an array to Promise.all().');
    	}

    	return new Promise$7(function (resolve, reject) {
    		var results = [];
    		var remaining = 0;

    		function resolver(index) {
    			remaining++;
    			return function (value) {
    				results[index] = value;
    				if (!--remaining) {
    					resolve(results);
    				}
    			};
    		}

    		for (var i = 0, promise; i < promises.length; i++) {
    			promise = promises[i];

    			if (promise && typeof promise.then === 'function') {
    				promise.then(resolver(i), reject);
    			} else {
    				results[i] = promise;
    			}
    		}

    		if (!remaining) {
    			resolve(results);
    		}
    	});
    };

    Promise$7.race = function (promises) {
    	if (!Array.isArray(promises)) {
    		throw new TypeError('You must pass an array to Promise.race().');
    	}

    	return new Promise$7(function (resolve, reject) {
    		for (var i = 0, promise; i < promises.length; i++) {
    			promise = promises[i];

    			if (promise && typeof promise.then === 'function') {
    				promise.then(resolve, reject);
    			} else {
    				resolve(promise);
    			}
    		}
    	});
    };

    Promise$7.resolve = function (value) {
    	if (value && typeof value === 'object' && value.constructor === Promise$7) {
    		return value;
    	}

    	return new Promise$7(function (resolve) {
    		resolve(value);
    	});
    };

    Promise$7.reject = function (reason) {
    	return new Promise$7(function (resolve, reject) {
    		reject(reason);
    	});
    };

    var pinkie = Promise$7;

    // --------------------------------------------------------
    // WARNING: this file is used by both the client and the server.
    // Do not use any browser or node-specific API!
    // --------------------------------------------------------
    var COMMAND = {
        run: 'run',
        idle: 'idle'
    };

    var STATUS = {
        ok: 'ok',
        closing: 'closing'
    };

    var UNSTABLE_NETWORK_MODE_HEADER = 'x-testcafe-cache-page-request';

    // -------------------------------------------------------------
    var HEARTBEAT_INTERVAL = 2 * 1000;

    // TODO: once we'll have client commons load it from there instead of node modules (currently it's leads to two copies of this packages on client)
    var allowInitScriptExecution = false;
    var retryTestPages = false;
    var heartbeatIntervalId = null;
    var noop$1 = function () { return void 0; };
    var delay$1 = function (ms) { return new pinkie(function (resolve) { return setTimeout(resolve, ms); }); };
    var evaluate = eval; // eslint-disable-line no-eval
    var FETCH_PAGE_TO_CACHE_RETRY_DELAY = 300;
    var FETCH_PAGE_TO_CACHE_RETRY_COUNT = 5;
    //Utils
    // NOTE: the window.XMLHttpRequest may have been wrapped by Hammerhead, while we should send a request to
    // the original URL. That's why we need the XMLHttpRequest argument to send the request via native methods.
    function sendXHR(url, createXHR, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.method, method = _c === void 0 ? 'GET' : _c, _d = _b.data, data = _d === void 0 ? null : _d, _e = _b.parseResponse, parseResponse = _e === void 0 ? true : _e;
        return new pinkie(function (resolve, reject) {
            var xhr = createXHR();
            xhr.open(method, url, true);
            if (isRetryingTestPagesEnabled()) {
                xhr.setRequestHeader(UNSTABLE_NETWORK_MODE_HEADER, 'true');
                xhr.setRequestHeader('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var responseText = xhr.responseText || '';
                        if (responseText && parseResponse)
                            responseText = JSON.parse(xhr.responseText); //eslint-disable-line no-restricted-globals
                        resolve(responseText);
                    }
                    else
                        reject('disconnected');
                }
            };
            xhr.send(data);
        });
    }
    function isCurrentLocation(url) {
        /*eslint-disable no-restricted-properties*/
        return document.location.href.toLowerCase() === url.toLowerCase();
        /*eslint-enable no-restricted-properties*/
    }
    //API
    function startHeartbeat(heartbeatUrl, createXHR) {
        function heartbeat() {
            sendXHR(heartbeatUrl, createXHR)
                .then(function (status) {
                if (status.code === STATUS.closing && !isCurrentLocation(status.url)) {
                    stopInitScriptExecution();
                    document.location = status.url;
                }
            });
        }
        heartbeatIntervalId = window.setInterval(heartbeat, HEARTBEAT_INTERVAL);
        heartbeat();
    }
    function stopHeartbeat() {
        window.clearInterval(heartbeatIntervalId);
    }
    function executeInitScript(initScriptUrl, createXHR) {
        if (!allowInitScriptExecution)
            return;
        sendXHR(initScriptUrl, createXHR)
            .then(function (res) {
            if (!res.code)
                return null;
            return sendXHR(initScriptUrl, createXHR, { method: 'POST', data: JSON.stringify(evaluate(res.code)) }); //eslint-disable-line no-restricted-globals
        })
            .then(function () {
            window.setTimeout(function () { return executeInitScript(initScriptUrl, createXHR); }, 1000);
        });
    }
    function startInitScriptExecution(initScriptUrl, createXHR) {
        allowInitScriptExecution = true;
        executeInitScript(initScriptUrl, createXHR);
    }
    function stopInitScriptExecution() {
        allowInitScriptExecution = false;
    }
    function redirect(command) {
        stopInitScriptExecution();
        document.location = command.url;
    }
    function fetchPageToCache(pageUrl, createXHR) {
        var requestAttempt = function () { return sendXHR(pageUrl, createXHR, { parseResponse: false }); };
        var retryRequest = function () { return delay$1(FETCH_PAGE_TO_CACHE_RETRY_DELAY).then(requestAttempt); };
        var fetchPagePromise = requestAttempt();
        for (var i = 0; i < FETCH_PAGE_TO_CACHE_RETRY_COUNT; i++)
            fetchPagePromise = fetchPagePromise.catch(retryRequest);
        return fetchPagePromise.catch(noop$1);
    }
    function checkStatus(statusUrl, createXHR, opts) {
        var manualRedirect = (opts || {}).manualRedirect;
        return sendXHR(statusUrl, createXHR)
            .then(function (result) {
            var ensurePagePromise = pinkie.resolve();
            if (result.url && isRetryingTestPagesEnabled())
                ensurePagePromise = fetchPageToCache(result.url, createXHR);
            return ensurePagePromise.then(function () { return result; });
        })
            .then(function (result) {
            var redirecting = (result.cmd === COMMAND.run || result.cmd === COMMAND.idle) && !isCurrentLocation(result.url);
            if (redirecting && !manualRedirect)
                redirect(result);
            return { command: result, redirecting: redirecting };
        });
    }
    function enableRetryingTestPages() {
        retryTestPages = true;
    }
    function disableRetryingTestPages() {
        retryTestPages = false;
    }
    function isRetryingTestPagesEnabled() {
        return retryTestPages;
    }
    function getActiveWindowId(activeWindowIdUrl, createXHR) {
        return sendXHR(activeWindowIdUrl, createXHR);
    }
    function setActiveWindowId(activeWindowIdUrl, createXHR, windowId) {
        return sendXHR(activeWindowIdUrl, createXHR, {
            method: 'POST',
            data: JSON.stringify({ windowId: windowId }) //eslint-disable-line no-restricted-globals
        });
    }

    var browser = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sendXHR: sendXHR,
        startHeartbeat: startHeartbeat,
        stopHeartbeat: stopHeartbeat,
        startInitScriptExecution: startInitScriptExecution,
        stopInitScriptExecution: stopInitScriptExecution,
        redirect: redirect,
        fetchPageToCache: fetchPageToCache,
        checkStatus: checkStatus,
        enableRetryingTestPages: enableRetryingTestPages,
        disableRetryingTestPages: disableRetryingTestPages,
        isRetryingTestPagesEnabled: isRetryingTestPagesEnabled,
        getActiveWindowId: getActiveWindowId,
        setActiveWindowId: setActiveWindowId
    });

    // -------------------------------------------------------------
    // WARNING: this file is used by both the client and the server.
    // Do not use any browser or node-specific API!
    // -------------------------------------------------------------
    /* eslint-disable no-undef */
    function selectorTextFilter(node, index, originNode, textFilter) {
        function hasChildrenWithText(parentNode) {
            var cnCount = parentNode.childNodes.length;
            for (var i = 0; i < cnCount; i++) {
                if (selectorTextFilter(parentNode.childNodes[i], index, originNode, textFilter))
                    return true;
            }
            return false;
        }
        function checkNodeText(text) {
            if (textFilter instanceof RegExp)
                return textFilter.test(text);
            return textFilter === text.trim();
        }
        // Element
        if (node.nodeType === 1) {
            // NOTE: In Firefox, <option> elements don't have `innerText`.
            // So, we fallback to `textContent` in that case (see GH-861).
            // SVG elements do not have `innerText` property as well
            return checkNodeText(node.innerText || node.textContent);
        }
        // Document
        if (node.nodeType === 9) {
            // NOTE: latest version of Edge doesn't have `innerText` for `document`,
            // `html` and `body`. So we check their children instead.
            var head = node.querySelector('head');
            var body = node.querySelector('body');
            return hasChildrenWithText(head) || hasChildrenWithText(body);
        }
        // DocumentFragment
        if (node.nodeType === 11)
            return hasChildrenWithText(node);
        return checkNodeText(node.textContent);
    }
    /* eslint-enable no-undef */

    // -------------------------------------------------------------
    // WARNING: this file is used by both the client and the server.
    // Do not use any browser or node-specific API!
    // -------------------------------------------------------------
    /* eslint-disable no-undef */
    function selectorAttributeFilter(node, index, originNode, attrName, attrValue) {
        if (node.nodeType !== 1)
            return false;
        var attributes = node.attributes;
        var attr = null;
        var check = function (actual, expect) { return typeof expect === 'string' ? expect === actual : expect.test(actual); };
        for (var i = 0; i < attributes.length; i++) {
            attr = attributes[i];
            if (check(attr.nodeName, attrName) && (!attrValue || check(attr.nodeValue, attrValue)))
                return true;
        }
        return false;
    }
    /* eslint-enable no-undef */

    var exports$1 = {};
    exports$1.RequestBarrier = RequestBarrier;
    exports$1.pageUnloadBarrier = pageUnloadBarrier;
    exports$1.preventRealEvents = preventRealEvents;
    exports$1.disableRealEventsPreventing = disableRealEventsPreventing;
    exports$1.scrollController = scrollController;
    exports$1.serviceUtils = serviceUtils;
    exports$1.domUtils = domUtils;
    exports$1.contentEditable = contentEditable;
    exports$1.positionUtils = positionUtils;
    exports$1.styleUtils = styleUtils$1;
    exports$1.eventUtils = eventUtils;
    exports$1.arrayUtils = arrayUtils;
    exports$1.promiseUtils = promiseUtils;
    exports$1.textSelection = textSelection;
    exports$1.waitFor = waitFor;
    exports$1.delay = delay;
    exports$1.getTimeLimitedPromise = getTimeLimitedPromise;
    exports$1.noop = noop;
    exports$1.getKeyArray = getKeyArray;
    exports$1.getSanitizedKey = getSanitizedKey;
    exports$1.parseKeySequence = parseKeySequence;
    exports$1.sendRequestToFrame = sendRequestToFrame;
    exports$1.KEY_MAPS = KEY_MAPS;
    exports$1.NODE_TYPE_DESCRIPTIONS = NODE_TYPE_DESCRIPTIONS;
    exports$1.browser = browser;
    exports$1.selectorTextFilter = selectorTextFilter;
    exports$1.selectorAttributeFilter = selectorAttributeFilter;
    var nativeMethods$7 = hammerhead__default.nativeMethods;
    var evalIframeScript = hammerhead__default.EVENTS.evalIframeScript;
    nativeMethods$7.objectDefineProperty(window, '%testCafeCore%', { configurable: true, value: exports$1 });
    // NOTE: initTestCafeCore defined in wrapper template
    /* global initTestCafeCore */
    hammerhead__default.on(evalIframeScript, function (e) { return initTestCafeCore(nativeMethods$7.contentWindowGetter.call(e.iframe), true); });

}(window['%hammerhead%']));

    }

    initTestCafeCore(window);
})();
