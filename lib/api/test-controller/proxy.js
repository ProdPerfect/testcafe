"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("./"));
const delegated_api_1 = require("../../utils/delegated-api");
const test_run_tracker_1 = __importDefault(require("../test-run-tracker"));
const runtime_1 = require("../../errors/runtime");
const types_1 = require("../../errors/types");
const testControllerProxy = Object.create(null);
delegated_api_1.delegateAPI(testControllerProxy, _1.default.API_LIST, {
    getHandler(propName, accessor) {
        const testRun = test_run_tracker_1.default.resolveContextTestRun();
        if (!testRun) {
            let callsiteName = null;
            if (accessor === 'getter')
                callsiteName = 'get';
            else if (accessor === 'setter')
                callsiteName = 'set';
            else
                callsiteName = propName;
            throw new runtime_1.APIError(callsiteName, types_1.RUNTIME_ERRORS.testControllerProxyCannotResolveTestRun);
        }
        return testRun.controller;
    }
});
exports.default = testControllerProxy;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3Rlc3QtY29udHJvbGxlci9wcm94eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBDQUFnQztBQUNoQyw2REFBd0Q7QUFDeEQsMkVBQWlEO0FBQ2pELGtEQUFnRDtBQUNoRCw4Q0FBb0Q7QUFFcEQsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWhELDJCQUFXLENBQUMsbUJBQW1CLEVBQUUsVUFBYyxDQUFDLFFBQVEsRUFBRTtJQUN0RCxVQUFVLENBQUUsUUFBUSxFQUFFLFFBQVE7UUFDMUIsTUFBTSxPQUFPLEdBQUcsMEJBQWMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRXZELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDVixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7WUFFeEIsSUFBSSxRQUFRLEtBQUssUUFBUTtnQkFDckIsWUFBWSxHQUFHLEtBQUssQ0FBQztpQkFDcEIsSUFBSSxRQUFRLEtBQUssUUFBUTtnQkFDMUIsWUFBWSxHQUFHLEtBQUssQ0FBQzs7Z0JBRXJCLFlBQVksR0FBRyxRQUFRLENBQUM7WUFFNUIsTUFBTSxJQUFJLGtCQUFRLENBQUMsWUFBWSxFQUFFLHNCQUFjLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUM1RjtRQUVELE9BQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUM5QixDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBRUgsa0JBQWUsbUJBQW1CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVzdENvbnRyb2xsZXIgZnJvbSAnLi8nO1xuaW1wb3J0IHsgZGVsZWdhdGVBUEkgfSBmcm9tICcuLi8uLi91dGlscy9kZWxlZ2F0ZWQtYXBpJztcbmltcG9ydCB0ZXN0UnVuVHJhY2tlciBmcm9tICcuLi90ZXN0LXJ1bi10cmFja2VyJztcbmltcG9ydCB7IEFQSUVycm9yIH0gZnJvbSAnLi4vLi4vZXJyb3JzL3J1bnRpbWUnO1xuaW1wb3J0IHsgUlVOVElNRV9FUlJPUlMgfSBmcm9tICcuLi8uLi9lcnJvcnMvdHlwZXMnO1xuXG5jb25zdCB0ZXN0Q29udHJvbGxlclByb3h5ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuZGVsZWdhdGVBUEkodGVzdENvbnRyb2xsZXJQcm94eSwgVGVzdENvbnRyb2xsZXIuQVBJX0xJU1QsIHtcbiAgICBnZXRIYW5kbGVyIChwcm9wTmFtZSwgYWNjZXNzb3IpIHtcbiAgICAgICAgY29uc3QgdGVzdFJ1biA9IHRlc3RSdW5UcmFja2VyLnJlc29sdmVDb250ZXh0VGVzdFJ1bigpO1xuXG4gICAgICAgIGlmICghdGVzdFJ1bikge1xuICAgICAgICAgICAgbGV0IGNhbGxzaXRlTmFtZSA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChhY2Nlc3NvciA9PT0gJ2dldHRlcicpXG4gICAgICAgICAgICAgICAgY2FsbHNpdGVOYW1lID0gJ2dldCc7XG4gICAgICAgICAgICBlbHNlIGlmIChhY2Nlc3NvciA9PT0gJ3NldHRlcicpXG4gICAgICAgICAgICAgICAgY2FsbHNpdGVOYW1lID0gJ3NldCc7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2FsbHNpdGVOYW1lID0gcHJvcE5hbWU7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBBUElFcnJvcihjYWxsc2l0ZU5hbWUsIFJVTlRJTUVfRVJST1JTLnRlc3RDb250cm9sbGVyUHJveHlDYW5ub3RSZXNvbHZlVGVzdFJ1bik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGVzdFJ1bi5jb250cm9sbGVyO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB0ZXN0Q29udHJvbGxlclByb3h5O1xuIl19