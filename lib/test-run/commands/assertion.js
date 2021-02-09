"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = __importDefault(require("./type"));
const base_1 = __importDefault(require("./base"));
const options_1 = require("./options");
const runtime_1 = require("../../errors/runtime");
const test_run_1 = require("../../errors/test-run");
const execute_js_expression_1 = require("../execute-js-expression");
const utils_1 = require("./utils");
const argument_1 = require("./validations/argument");
// Initializers
function initAssertionOptions(name, val) {
    return new options_1.AssertionOptions(val, true);
}
//Initializers
function initAssertionParameter(name, val, { skipVisibilityCheck, testRun }) {
    try {
        if (utils_1.isJSExpression(val))
            val = execute_js_expression_1.executeJsExpression(val.value, testRun, { skipVisibilityCheck });
        return val;
    }
    catch (err) {
        throw new test_run_1.AssertionExecutableArgumentError(name, val.value, err, err instanceof runtime_1.APIError);
    }
}
// Commands
class AssertionCommand extends base_1.default {
    constructor(obj, testRun) {
        super(obj, testRun, type_1.default.assertion);
    }
    _getAssignableProperties() {
        return [
            { name: 'assertionType', type: argument_1.nonEmptyStringArgument, required: true },
            { name: 'actual', init: initAssertionParameter, defaultValue: void 0 },
            { name: 'expected', init: initAssertionParameter, defaultValue: void 0 },
            { name: 'expected2', init: initAssertionParameter, defaultValue: void 0 },
            { name: 'message', type: argument_1.stringArgument, defaultValue: null },
            { name: 'options', type: argument_1.actionOptions, init: initAssertionOptions, required: true }
        ];
    }
}
exports.default = AssertionCommand;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rlc3QtcnVuL2NvbW1hbmRzL2Fzc2VydGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixrREFBaUM7QUFDakMsdUNBQTZDO0FBQzdDLGtEQUFnRDtBQUNoRCxvREFBeUU7QUFDekUsb0VBQStEO0FBQy9ELG1DQUF5QztBQUN6QyxxREFJZ0M7QUFFaEMsZUFBZTtBQUNmLFNBQVMsb0JBQW9CLENBQUUsSUFBSSxFQUFFLEdBQUc7SUFDcEMsT0FBTyxJQUFJLDBCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQsY0FBYztBQUNkLFNBQVMsc0JBQXNCLENBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLG1CQUFtQixFQUFFLE9BQU8sRUFBRTtJQUN4RSxJQUFJO1FBQ0EsSUFBSSxzQkFBYyxDQUFDLEdBQUcsQ0FBQztZQUNuQixHQUFHLEdBQUcsMkNBQW1CLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUM7UUFFM0UsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUNELE9BQU8sR0FBRyxFQUFFO1FBQ1IsTUFBTSxJQUFJLDJDQUFnQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLFlBQVksa0JBQVEsQ0FBQyxDQUFDO0tBQzdGO0FBQ0wsQ0FBQztBQUVELFdBQVc7QUFDWCxNQUFxQixnQkFBaUIsU0FBUSxjQUFXO0lBQ3JELFlBQWEsR0FBRyxFQUFFLE9BQU87UUFDckIsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCx3QkFBd0I7UUFDcEIsT0FBTztZQUNILEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsaUNBQXNCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUN2RSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN0RSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN4RSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN6RSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLHlCQUFjLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRTtZQUM3RCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLHdCQUFhLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7U0FDdkYsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQWZELG1DQWVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRZUEUgZnJvbSAnLi90eXBlJztcbmltcG9ydCBDb21tYW5kQmFzZSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgQXNzZXJ0aW9uT3B0aW9ucyB9IGZyb20gJy4vb3B0aW9ucyc7XG5pbXBvcnQgeyBBUElFcnJvciB9IGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lJztcbmltcG9ydCB7IEFzc2VydGlvbkV4ZWN1dGFibGVBcmd1bWVudEVycm9yIH0gZnJvbSAnLi4vLi4vZXJyb3JzL3Rlc3QtcnVuJztcbmltcG9ydCB7IGV4ZWN1dGVKc0V4cHJlc3Npb24gfSBmcm9tICcuLi9leGVjdXRlLWpzLWV4cHJlc3Npb24nO1xuaW1wb3J0IHsgaXNKU0V4cHJlc3Npb24gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7XG4gICAgc3RyaW5nQXJndW1lbnQsXG4gICAgYWN0aW9uT3B0aW9ucyxcbiAgICBub25FbXB0eVN0cmluZ0FyZ3VtZW50XG59IGZyb20gJy4vdmFsaWRhdGlvbnMvYXJndW1lbnQnO1xuXG4vLyBJbml0aWFsaXplcnNcbmZ1bmN0aW9uIGluaXRBc3NlcnRpb25PcHRpb25zIChuYW1lLCB2YWwpIHtcbiAgICByZXR1cm4gbmV3IEFzc2VydGlvbk9wdGlvbnModmFsLCB0cnVlKTtcbn1cblxuLy9Jbml0aWFsaXplcnNcbmZ1bmN0aW9uIGluaXRBc3NlcnRpb25QYXJhbWV0ZXIgKG5hbWUsIHZhbCwgeyBza2lwVmlzaWJpbGl0eUNoZWNrLCB0ZXN0UnVuIH0pIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAoaXNKU0V4cHJlc3Npb24odmFsKSlcbiAgICAgICAgICAgIHZhbCA9IGV4ZWN1dGVKc0V4cHJlc3Npb24odmFsLnZhbHVlLCB0ZXN0UnVuLCB7IHNraXBWaXNpYmlsaXR5Q2hlY2sgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQXNzZXJ0aW9uRXhlY3V0YWJsZUFyZ3VtZW50RXJyb3IobmFtZSwgdmFsLnZhbHVlLCBlcnIsIGVyciBpbnN0YW5jZW9mIEFQSUVycm9yKTtcbiAgICB9XG59XG5cbi8vIENvbW1hbmRzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3NlcnRpb25Db21tYW5kIGV4dGVuZHMgQ29tbWFuZEJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChvYmosIHRlc3RSdW4pIHtcbiAgICAgICAgc3VwZXIob2JqLCB0ZXN0UnVuLCBUWVBFLmFzc2VydGlvbik7XG4gICAgfVxuXG4gICAgX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2Fzc2VydGlvblR5cGUnLCB0eXBlOiBub25FbXB0eVN0cmluZ0FyZ3VtZW50LCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnYWN0dWFsJywgaW5pdDogaW5pdEFzc2VydGlvblBhcmFtZXRlciwgZGVmYXVsdFZhbHVlOiB2b2lkIDAgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2V4cGVjdGVkJywgaW5pdDogaW5pdEFzc2VydGlvblBhcmFtZXRlciwgZGVmYXVsdFZhbHVlOiB2b2lkIDAgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2V4cGVjdGVkMicsIGluaXQ6IGluaXRBc3NlcnRpb25QYXJhbWV0ZXIsIGRlZmF1bHRWYWx1ZTogdm9pZCAwIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdtZXNzYWdlJywgdHlwZTogc3RyaW5nQXJndW1lbnQsIGRlZmF1bHRWYWx1ZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnb3B0aW9ucycsIHR5cGU6IGFjdGlvbk9wdGlvbnMsIGluaXQ6IGluaXRBc3NlcnRpb25PcHRpb25zLCByZXF1aXJlZDogdHJ1ZSB9XG4gICAgICAgIF07XG4gICAgfVxufVxuIl19