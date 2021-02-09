"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugCommand = exports.ExecuteSelectorCommand = exports.ExecuteClientFunctionCommand = exports.WaitCommand = void 0;
const type_1 = __importDefault(require("./type"));
const base_1 = __importDefault(require("./base"));
const argument_1 = require("./validations/argument");
// Commands
class WaitCommand extends base_1.default {
    constructor(obj, testRun) {
        super(obj, testRun, type_1.default.wait);
    }
    _getAssignableProperties() {
        return [
            { name: 'timeout', type: argument_1.positiveIntegerArgument, required: true }
        ];
    }
}
exports.WaitCommand = WaitCommand;
class ExecuteClientFunctionCommandBase extends base_1.default {
    constructor(obj, testRun, type) {
        super(obj, testRun, type, false);
    }
    _getAssignableProperties() {
        return [
            { name: 'instantiationCallsiteName', defaultValue: '' },
            { name: 'fnCode', defaultValue: '' },
            { name: 'args', defaultValue: [] },
            { name: 'dependencies', defaultValue: [] }
        ];
    }
}
class ExecuteClientFunctionCommand extends ExecuteClientFunctionCommandBase {
    constructor(obj, testRun) {
        super(obj, testRun, type_1.default.executeClientFunction);
    }
}
exports.ExecuteClientFunctionCommand = ExecuteClientFunctionCommand;
class ExecuteSelectorCommand extends ExecuteClientFunctionCommandBase {
    constructor(obj, testRun) {
        super(obj, testRun, type_1.default.executeSelector);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'visibilityCheck', defaultValue: false },
            { name: 'timeout', defaultValue: null },
            { name: 'apiFnChain' },
            { name: 'needError' },
            { name: 'index', defaultValue: 0 }
        ]);
    }
}
exports.ExecuteSelectorCommand = ExecuteSelectorCommand;
class DebugCommand {
    constructor() {
        this.type = type_1.default.debug;
    }
}
exports.DebugCommand = DebugCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdC1ydW4vY29tbWFuZHMvb2JzZXJ2YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQUFpQztBQUNqQyxxREFBaUU7QUFFakUsV0FBVztBQUNYLE1BQWEsV0FBWSxTQUFRLGNBQVc7SUFDeEMsWUFBYSxHQUFHLEVBQUUsT0FBTztRQUNyQixLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELHdCQUF3QjtRQUNwQixPQUFPO1lBQ0gsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxrQ0FBdUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1NBQ3JFLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFWRCxrQ0FVQztBQUVELE1BQU0sZ0NBQWlDLFNBQVEsY0FBVztJQUN0RCxZQUFhLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUMzQixLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELHdCQUF3QjtRQUNwQixPQUFPO1lBQ0gsRUFBRSxJQUFJLEVBQUUsMkJBQTJCLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRTtZQUN2RCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRTtZQUNwQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRTtZQUNsQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRTtTQUM3QyxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBRUQsTUFBYSw0QkFBNkIsU0FBUSxnQ0FBZ0M7SUFDOUUsWUFBYSxHQUFHLEVBQUUsT0FBTztRQUNyQixLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxjQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0o7QUFKRCxvRUFJQztBQUVELE1BQWEsc0JBQXVCLFNBQVEsZ0NBQWdDO0lBQ3hFLFlBQWEsR0FBRyxFQUFFLE9BQU87UUFDckIsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsY0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCx3QkFBd0I7UUFDcEIsT0FBTyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDM0MsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRTtZQUNoRCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRTtZQUN2QyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDdEIsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3JCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFO1NBQ3JDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQWRELHdEQWNDO0FBRUQsTUFBYSxZQUFZO0lBQ3JCO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxjQUFJLENBQUMsS0FBSyxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQUpELG9DQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRZUEUgZnJvbSAnLi90eXBlJztcbmltcG9ydCBDb21tYW5kQmFzZSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgcG9zaXRpdmVJbnRlZ2VyQXJndW1lbnQgfSBmcm9tICcuL3ZhbGlkYXRpb25zL2FyZ3VtZW50JztcblxuLy8gQ29tbWFuZHNcbmV4cG9ydCBjbGFzcyBXYWl0Q29tbWFuZCBleHRlbmRzIENvbW1hbmRCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAob2JqLCB0ZXN0UnVuKSB7XG4gICAgICAgIHN1cGVyKG9iaiwgdGVzdFJ1biwgVFlQRS53YWl0KTtcbiAgICB9XG5cbiAgICBfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgeyBuYW1lOiAndGltZW91dCcsIHR5cGU6IHBvc2l0aXZlSW50ZWdlckFyZ3VtZW50LCByZXF1aXJlZDogdHJ1ZSB9XG4gICAgICAgIF07XG4gICAgfVxufVxuXG5jbGFzcyBFeGVjdXRlQ2xpZW50RnVuY3Rpb25Db21tYW5kQmFzZSBleHRlbmRzIENvbW1hbmRCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAob2JqLCB0ZXN0UnVuLCB0eXBlKSB7XG4gICAgICAgIHN1cGVyKG9iaiwgdGVzdFJ1biwgdHlwZSwgZmFsc2UpO1xuICAgIH1cblxuICAgIF9nZXRBc3NpZ25hYmxlUHJvcGVydGllcyAoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7IG5hbWU6ICdpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lJywgZGVmYXVsdFZhbHVlOiAnJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnZm5Db2RlJywgZGVmYXVsdFZhbHVlOiAnJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnYXJncycsIGRlZmF1bHRWYWx1ZTogW10gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2RlcGVuZGVuY2llcycsIGRlZmF1bHRWYWx1ZTogW10gfVxuICAgICAgICBdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4ZWN1dGVDbGllbnRGdW5jdGlvbkNvbW1hbmQgZXh0ZW5kcyBFeGVjdXRlQ2xpZW50RnVuY3Rpb25Db21tYW5kQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKG9iaiwgdGVzdFJ1bikge1xuICAgICAgICBzdXBlcihvYmosIHRlc3RSdW4sIFRZUEUuZXhlY3V0ZUNsaWVudEZ1bmN0aW9uKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeGVjdXRlU2VsZWN0b3JDb21tYW5kIGV4dGVuZHMgRXhlY3V0ZUNsaWVudEZ1bmN0aW9uQ29tbWFuZEJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChvYmosIHRlc3RSdW4pIHtcbiAgICAgICAgc3VwZXIob2JqLCB0ZXN0UnVuLCBUWVBFLmV4ZWN1dGVTZWxlY3Rvcik7XG4gICAgfVxuXG4gICAgX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9nZXRBc3NpZ25hYmxlUHJvcGVydGllcygpLmNvbmNhdChbXG4gICAgICAgICAgICB7IG5hbWU6ICd2aXNpYmlsaXR5Q2hlY2snLCBkZWZhdWx0VmFsdWU6IGZhbHNlIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd0aW1lb3V0JywgZGVmYXVsdFZhbHVlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdhcGlGbkNoYWluJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnbmVlZEVycm9yJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnaW5kZXgnLCBkZWZhdWx0VmFsdWU6IDAgfVxuICAgICAgICBdKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1Z0NvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy50eXBlID0gVFlQRS5kZWJ1ZztcbiAgICB9XG59XG5cbiJdfQ==