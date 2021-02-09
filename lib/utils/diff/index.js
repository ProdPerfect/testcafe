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
exports.generate = void 0;
const jsdiff = __importStar(require("diff"));
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const colors_1 = require("./colors");
const util_1 = require("./util");
const information_message_1 = require("../../notifications/information-message");
const debugLogger = debug_1.default('testcafe:util:diff');
function unifiedDiff(actual, expected) {
    const msg = jsdiff.createPatch('string', actual, expected);
    // NOTE: Removing unimportant info from diff output
    const lines = msg.split('\n').splice(5);
    return lines
        .filter(util_1.cleanUpFilter)
        .map(colors_1.setColors)
        .filter((line) => !lodash_1.isUndefined(line) && !lodash_1.isNull(line))
        .join('\n');
}
function generate(actual, expected) {
    try {
        return unifiedDiff(util_1.stringify(actual), util_1.stringify(expected));
    }
    catch (err) {
        debugLogger(information_message_1.FAILED_TO_GENERATE_DETAILED_DIFF(err.message));
        return '';
    }
}
exports.generate = generate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvZGlmZi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLGtEQUEwQjtBQUMxQixtQ0FBNkM7QUFDN0MscUNBQXFDO0FBQ3JDLGlDQUFrRDtBQUNsRCxpRkFBMkY7QUFFM0YsTUFBTSxXQUFXLEdBQUcsZUFBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFFaEQsU0FBUyxXQUFXLENBQUUsTUFBYyxFQUFFLFFBQWdCO0lBQ2xELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUUzRCxtREFBbUQ7SUFDbkQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEMsT0FBTyxLQUFLO1NBQ1AsTUFBTSxDQUFDLG9CQUFhLENBQUM7U0FDckIsR0FBRyxDQUFDLGtCQUFTLENBQUM7U0FDZCxNQUFNLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsb0JBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ2Q7QUFDTCxDQUFDO0FBRUQsU0FBZ0IsUUFBUSxDQUFFLE1BQWMsRUFBRSxRQUFnQjtJQUN0RCxJQUFJO1FBQ0EsT0FBTyxXQUFXLENBQUMsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7S0FDOUQ7SUFDRCxPQUFPLEdBQUcsRUFBRTtRQUNSLFdBQVcsQ0FBQyxzREFBZ0MsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUUzRCxPQUFPLEVBQUUsQ0FBQztLQUNiO0FBQ0wsQ0FBQztBQVRELDRCQVNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMganNkaWZmIGZyb20gJ2RpZmYnO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCB7IGlzVW5kZWZpbmVkLCBpc051bGwgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgc2V0Q29sb3JzIH0gZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0IHsgY2xlYW5VcEZpbHRlciwgc3RyaW5naWZ5IH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IEZBSUxFRF9UT19HRU5FUkFURV9ERVRBSUxFRF9ESUZGIH0gZnJvbSAnLi4vLi4vbm90aWZpY2F0aW9ucy9pbmZvcm1hdGlvbi1tZXNzYWdlJztcblxuY29uc3QgZGVidWdMb2dnZXIgPSBkZWJ1ZygndGVzdGNhZmU6dXRpbDpkaWZmJyk7XG5cbmZ1bmN0aW9uIHVuaWZpZWREaWZmIChhY3R1YWw6IHN0cmluZywgZXhwZWN0ZWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgbXNnID0ganNkaWZmLmNyZWF0ZVBhdGNoKCdzdHJpbmcnLCBhY3R1YWwsIGV4cGVjdGVkKTtcblxuICAgIC8vIE5PVEU6IFJlbW92aW5nIHVuaW1wb3J0YW50IGluZm8gZnJvbSBkaWZmIG91dHB1dFxuICAgIGNvbnN0IGxpbmVzID0gbXNnLnNwbGl0KCdcXG4nKS5zcGxpY2UoNSk7XG5cbiAgICByZXR1cm4gbGluZXNcbiAgICAgICAgLmZpbHRlcihjbGVhblVwRmlsdGVyKVxuICAgICAgICAubWFwKHNldENvbG9ycylcbiAgICAgICAgLmZpbHRlcigobGluZTogYW55KSA9PiAhaXNVbmRlZmluZWQobGluZSkgJiYgIWlzTnVsbChsaW5lKSlcbiAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGUgKGFjdHVhbDogc3RyaW5nLCBleHBlY3RlZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gdW5pZmllZERpZmYoc3RyaW5naWZ5KGFjdHVhbCksIHN0cmluZ2lmeShleHBlY3RlZCkpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGRlYnVnTG9nZ2VyKEZBSUxFRF9UT19HRU5FUkFURV9ERVRBSUxFRF9ESUZGKGVyci5tZXNzYWdlKSk7XG5cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbn1cbiJdfQ==