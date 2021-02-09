"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertType = exports.is = void 0;
const lodash_1 = require("lodash");
const _1 = require("./");
const types_1 = require("../types");
const hook_1 = __importDefault(require("../../api/request-hooks/hook"));
const START_FROM_VOWEL_RE = /^[aeiou]/i;
function getIndefiniteArticle(text) {
    return START_FROM_VOWEL_RE.test(text) ? 'an' : 'a';
}
function isNonNegativeValue(value) {
    return lodash_1.isFinite(value) && value >= 0;
}
function getNumberTypeActualValueMsg(value, type) {
    if (type !== 'number')
        return type;
    if (Number.isNaN(value))
        return NaN;
    if (!lodash_1.isFinite(value))
        return Infinity;
    return value;
}
function hasSomePropInObject(obj, props) {
    return !!obj &&
        typeof obj === 'object' &&
        props.some(prop => prop in obj);
}
exports.is = {
    number: {
        name: 'number',
        predicate: lodash_1.isFinite,
        getActualValueMsg: getNumberTypeActualValueMsg
    },
    nonNegativeNumber: {
        name: 'non-negative number',
        predicate: isNonNegativeValue,
        getActualValueMsg: getNumberTypeActualValueMsg
    },
    nonNegativeNumberString: {
        name: 'non-negative number',
        predicate: value => isNonNegativeValue(parseInt(value, 10)),
        getActualValueMsg: value => {
            const number = parseInt(value, 10);
            return isNaN(number) ? JSON.stringify(value) : number;
        }
    },
    boolean: {
        name: 'boolean',
        predicate: (value, type) => type === 'boolean'
    },
    string: {
        name: 'string',
        predicate: (value, type) => type === 'string'
    },
    function: {
        name: 'function',
        predicate: (value, type) => type === 'function'
    },
    regExp: {
        name: 'regular expression',
        predicate: lodash_1.isRegExp
    },
    array: {
        name: 'array',
        predicate: value => Array.isArray(value)
    },
    nonNullObject: {
        name: 'non-null object',
        predicate: (value, type) => type === 'object' && !lodash_1.isNil(value),
        getActualValueMsg: (value, type) => lodash_1.isNil(value) ? String(value) : type
    },
    requestHookSubclass: {
        name: 'RequestHook subclass',
        predicate: value => value instanceof hook_1.default && value.constructor && value.constructor !== hook_1.default
    },
    clientScriptInitializer: {
        name: 'client script initializer',
        predicate: obj => hasSomePropInObject(obj, ['path', 'content', 'module'])
    },
    testTimeouts: {
        name: 'test timeouts initializer',
        predicate: obj => hasSomePropInObject(obj, ['pageRequestTimeout', 'ajaxRequestTimeout', 'speed'])
    }
};
function assertType(types, callsiteName, what, value) {
    types = lodash_1.castArray(types);
    let pass = false;
    const actualType = typeof value;
    let actualMsg = actualType;
    let expectedTypeMsg = '';
    const last = types.length - 1;
    types.forEach((type, i) => {
        pass = pass || type.predicate(value, actualType);
        if (type.getActualValueMsg)
            actualMsg = type.getActualValueMsg(value, actualType);
        if (i === 0)
            expectedTypeMsg += type.name;
        else
            expectedTypeMsg += (i === last ? ' or ' + getIndefiniteArticle(type.name) + ' ' : ', ') + type.name;
    });
    if (!pass) {
        throw callsiteName ?
            new _1.APIError(callsiteName, types_1.RUNTIME_ERRORS.invalidValueType, what, expectedTypeMsg, actualMsg) :
            new _1.GeneralError(types_1.RUNTIME_ERRORS.invalidValueType, what, expectedTypeMsg, actualMsg);
    }
}
exports.assertType = assertType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS1hc3NlcnRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Vycm9ycy9ydW50aW1lL3R5cGUtYXNzZXJ0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FLZ0I7QUFFaEIseUJBQTRDO0FBQzVDLG9DQUEwQztBQUMxQyx3RUFBdUQ7QUFFdkQsTUFBTSxtQkFBbUIsR0FBRyxXQUFXLENBQUM7QUFFeEMsU0FBUyxvQkFBb0IsQ0FBRSxJQUFJO0lBQy9CLE9BQU8sbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUN2RCxDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBRSxLQUFLO0lBQzlCLE9BQU8saUJBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFFRCxTQUFTLDJCQUEyQixDQUFFLEtBQUssRUFBRSxJQUFJO0lBQzdDLElBQUksSUFBSSxLQUFLLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFFaEIsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNuQixPQUFPLEdBQUcsQ0FBQztJQUVmLElBQUksQ0FBQyxpQkFBYyxDQUFDLEtBQUssQ0FBQztRQUN0QixPQUFPLFFBQVEsQ0FBQztJQUVwQixPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBRSxHQUFHLEVBQUUsS0FBSztJQUNwQyxPQUFPLENBQUMsQ0FBQyxHQUFHO1FBQ1IsT0FBTyxHQUFHLEtBQUssUUFBUTtRQUN2QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFWSxRQUFBLEVBQUUsR0FBRztJQUNkLE1BQU0sRUFBRTtRQUNKLElB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aW1wb3J0IHtcbiAgICBpc0Zpbml0ZSBhcyBpc0Zpbml0ZU51bWJlcixcbiAgICBpc1JlZ0V4cCxcbiAgICBpc05pbCBhcyBpc051bGxPclVuZGVmaW5lZCxcbiAgICBjYXN0QXJyYXlcbn0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgQVBJRXJyb3IsIEdlbmVyYWxFcnJvciB9IGZyb20gJy4vJztcbmltcG9ydCB7IFJVTlRJTUVfRVJST1JTIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IFJlcXVlc3RIb29rIGZyb20gJy4uLy4uL2FwaS9yZXF1ZXN0LWhvb2tzL2hvb2snO1xuXG5jb25zdCBTVEFSVF9GUk9NX1ZPV0VMX1JFID0gL15bYWVpb3VdL2k7XG5cbmZ1bmN0aW9uIGdldEluZGVmaW5pdGVBcnRpY2xlICh0ZXh0KSB7XG4gICAgcmV0dXJuIFNUQVJUX0ZST01fVk9XRUxfUkUudGVzdCh0ZXh0KSA/ICdhbicgOiAnYSc7XG59XG5cbmZ1bmN0aW9uIGlzTm9uTmVnYXRpdmVWYWx1ZSAodmFsdWUpIHtcbiAgICByZXR1cm4gaXNGaW5pdGVOdW1iZXIodmFsdWUpICYmIHZhbHVlID49IDA7XG59XG5cbmZ1bmN0aW9uIGdldE51bWJlclR5cGVBY3R1YWxWYWx1ZU1zZyAodmFsdWUsIHR5cGUpIHtcbiAgICBpZiAodHlwZSAhPT0gJ251bWJlcicpXG4gICAgICAgIHJldHVybiB0eXBlO1xuXG4gICAgaWYgKE51bWJlci5pc05hTih2YWx1ZSkpXG4gICAgICAgIHJldHVybiBOYU47XG5cbiAgICBpZiAoIWlzRmluaXRlTnVtYmVyKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBoYXNTb21lUHJvcEluT2JqZWN0IChvYmosIHByb3BzKSB7XG4gICAgcmV0dXJuICEhb2JqICYmXG4gICAgICAgIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmXG4gICAgICAgIHByb3BzLnNvbWUocHJvcCA9PiBwcm9wIGluIG9iaik7XG59XG5cbmV4cG9ydCBjb25zdCBpcyA9IHtcbiAgICBudW1iZXI6IHtcbiAgICAgICAgbmFtZTogICAgICAgICAgICAgICdudW1iZXInLFxuICAgICAgICBwcmVkaWNhdGU6ICAgICAgICAgaXNGaW5pdGVOdW1iZXIsXG4gICAgICAgIGdldEFjdHVhbFZhbHVlTXNnOiBnZXROdW1iZXJUeXBlQWN0dWFsVmFsdWVNc2dcbiAgICB9LFxuXG4gICAgbm9uTmVnYXRpdmVOdW1iZXI6IHtcbiAgICAgICAgbmFtZTogICAgICAgICAgICAgICdub24tbmVnYXRpdmUgbnVtYmVyJyxcbiAgICAgICAgcHJlZGljYXRlOiAgICAgICAgIGlzTm9uTmVnYXRpdmVWYWx1ZSxcbiAgICAgICAgZ2V0QWN0dWFsVmFsdWVNc2c6IGdldE51bWJlclR5cGVBY3R1YWxWYWx1ZU1zZ1xuICAgIH0sXG5cbiAgICBub25OZWdhdGl2ZU51bWJlclN0cmluZzoge1xuICAgICAgICBuYW1lOiAgICAgICdub24tbmVnYXRpdmUgbnVtYmVyJyxcbiAgICAgICAgcHJlZGljYXRlOiB2YWx1ZSA9PiBpc05vbk5lZ2F0aXZlVmFsdWUocGFyc2VJbnQodmFsdWUsIDEwKSksXG5cbiAgICAgICAgZ2V0QWN0dWFsVmFsdWVNc2c6IHZhbHVlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG51bWJlciA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG5cbiAgICAgICAgICAgIHJldHVybiBpc05hTihudW1iZXIpID8gSlNPTi5zdHJpbmdpZnkodmFsdWUpIDogbnVtYmVyO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGJvb2xlYW46IHtcbiAgICAgICAgbmFtZTogICAgICAnYm9vbGVhbicsXG4gICAgICAgIHByZWRpY2F0ZTogKHZhbHVlLCB0eXBlKSA9PiB0eXBlID09PSAnYm9vbGVhbidcbiAgICB9LFxuXG4gICAgc3RyaW5nOiB7XG4gICAgICAgIG5hbWU6ICAgICAgJ3N0cmluZycsXG4gICAgICAgIHByZWRpY2F0ZTogKHZhbHVlLCB0eXBlKSA9PiB0eXBlID09PSAnc3RyaW5nJ1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbjoge1xuICAgICAgICBuYW1lOiAgICAgICdmdW5jdGlvbicsXG4gICAgICAgIHByZWRpY2F0ZTogKHZhbHVlLCB0eXBlKSA9PiB0eXBlID09PSAnZnVuY3Rpb24nXG4gICAgfSxcblxuICAgIHJlZ0V4cDoge1xuICAgICAgICBuYW1lOiAgICAgICdyZWd1bGFyIGV4cHJlc3Npb24nLFxuICAgICAgICBwcmVkaWNhdGU6IGlzUmVnRXhwXG4gICAgfSxcblxuICAgIGFycmF5OiB7XG4gICAgICAgIG5hbWU6ICAgICAgJ2FycmF5JyxcbiAgICAgICAgcHJlZGljYXRlOiB2YWx1ZSA9PiBBcnJheS5pc0FycmF5KHZhbHVlKVxuICAgIH0sXG5cbiAgICBub25OdWxsT2JqZWN0OiB7XG4gICAgICAgIG5hbWU6ICAgICAgICAgICAgICAnbm9uLW51bGwgb2JqZWN0JyxcbiAgICAgICAgcHJlZGljYXRlOiAgICAgICAgICh2YWx1ZSwgdHlwZSkgPT4gdHlwZSA9PT0gJ29iamVjdCcgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSxcbiAgICAgICAgZ2V0QWN0dWFsVmFsdWVNc2c6ICh2YWx1ZSwgdHlwZSkgPT4gaXNOdWxsT3JVbmRlZmluZWQodmFsdWUpID8gU3RyaW5nKHZhbHVlKSA6IHR5cGVcbiAgICB9LFxuXG4gICAgcmVxdWVzdEhvb2tTdWJjbGFzczoge1xuICAgICAgICBuYW1lOiAgICAgICdSZXF1ZXN0SG9vayBzdWJjbGFzcycsXG4gICAgICAgIHByZWRpY2F0ZTogdmFsdWUgPT4gdmFsdWUgaW5zdGFuY2VvZiBSZXF1ZXN0SG9vayAmJiB2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3RvciAhPT0gUmVxdWVzdEhvb2tcbiAgICB9LFxuXG4gICAgY2xpZW50U2NyaXB0SW5pdGlhbGl6ZXI6IHtcbiAgICAgICAgbmFtZTogICAgICAnY2xpZW50IHNjcmlwdCBpbml0aWFsaXplcicsXG4gICAgICAgIHByZWRpY2F0ZTogb2JqID0+IGhhc1NvbWVQcm9wSW5PYmplY3Qob2JqLCBbJ3BhdGgnLCAnY29udGVudCcsICdtb2R1bGUnXSlcbiAgICB9LFxuXG4gICAgdGVzdFRpbWVvdXRzOiB7XG4gICAgICAgIG5hbWU6ICAgICAgJ3Rlc3QgdGltZW91dHMgaW5pdGlhbGl6ZXInLFxuICAgICAgICBwcmVkaWNhdGU6IG9iaiA9PiBoYXNTb21lUHJvcEluT2JqZWN0KG9iaiwgWydwYWdlUmVxdWVzdFRpbWVvdXQnLCAnYWpheFJlcXVlc3RUaW1lb3V0JywgJ3NwZWVkJ10pXG4gICAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFR5cGUgKHR5cGVzLCBjYWxsc2l0ZU5hbWUsIHdoYXQsIHZhbHVlKSB7XG4gICAgdHlwZXMgPSBjYXN0QXJyYXkodHlwZXMpO1xuXG4gICAgbGV0IHBhc3MgICAgICAgICAgICA9IGZhbHNlO1xuICAgIGNvbnN0IGFjdHVhbFR5cGUgICAgPSB0eXBlb2YgdmFsdWU7XG4gICAgbGV0IGFjdHVhbE1zZyAgICAgICA9IGFjdHVhbFR5cGU7XG4gICAgbGV0IGV4cGVjdGVkVHlwZU1zZyA9ICcnO1xuICAgIGNvbnN0IGxhc3QgICAgICAgICAgICA9IHR5cGVzLmxlbmd0aCAtIDE7XG5cbiAgICB0eXBlcy5mb3JFYWNoKCh0eXBlLCBpKSA9PiB7XG4gICAgICAgIHBhc3MgPSBwYXNzIHx8IHR5cGUucHJlZGljYXRlKHZhbHVlLCBhY3R1YWxUeXBlKTtcblxuICAgICAgICBpZiAodHlwZS5nZXRBY3R1YWxWYWx1ZU1zZylcbiAgICAgICAgICAgIGFjdHVhbE1zZyA9IHR5cGUuZ2V0QWN0dWFsVmFsdWVNc2codmFsdWUsIGFjdHVhbFR5cGUpO1xuXG4gICAgICAgIGlmIChpID09PSAwKVxuICAgICAgICAgICAgZXhwZWN0ZWRUeXBlTXNnICs9IHR5cGUubmFtZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZXhwZWN0ZWRUeXBlTXNnICs9IChpID09PSBsYXN0ID8gJyBvciAnICsgZ2V0SW5kZWZpbml0ZUFydGljbGUodHlwZS5uYW1lKSArICcgJyA6ICcsICcpICsgdHlwZS5uYW1lO1xuICAgIH0pO1xuXG4gICAgaWYgKCFwYXNzKSB7XG4gICAgICAgIHRocm93IGNhbGxzaXRlTmFtZSA/XG4gICAgICAgICAgICBuZXcgQVBJRXJyb3IoY2FsbHNpdGVOYW1lLCBSVU5USU1FX0VSUk9SUy5pbnZhbGlkVmFsdWVUeXBlLCB3aGF0LCBleHBlY3RlZFR5cGVNc2csIGFjdHVhbE1zZykgOlxuICAgICAgICAgICAgbmV3IEdlbmVyYWxFcnJvcihSVU5USU1FX0VSUk9SUy5pbnZhbGlkVmFsdWVUeXBlLCB3aGF0LCBleHBlY3RlZFR5cGVNc2csIGFjdHVhbE1zZyk7XG4gICAgfVxufVxuIl19