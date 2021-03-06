"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_controller_1 = __importDefault(require("./test-controller"));
const test_run_tracker_1 = __importDefault(require("./test-run-tracker"));
const error_list_1 = __importDefault(require("../errors/error-list"));
const test_run_1 = require("../errors/test-run");
function wrapTestFunction(fn) {
    return async (testRun) => {
        let result = null;
        const errList = new error_list_1.default();
        const markeredfn = test_run_tracker_1.default.addTrackingMarkerToFunction(testRun.id, fn);
        testRun.controller = new test_controller_1.default(testRun);
        test_run_tracker_1.default.ensureEnabled();
        try {
            result = await markeredfn(testRun.controller);
        }
        catch (err) {
            errList.addError(err);
        }
        if (!errList.hasUncaughtErrorsInTestCode) {
            testRun.controller.callsitesWithoutAwait.forEach(callsite => {
                errList.addError(new test_run_1.MissingAwaitError(callsite));
            });
        }
        if (errList.hasErrors)
            throw errList;
        return result;
    };
}
exports.default = wrapTestFunction;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC10ZXN0LWZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS93cmFwLXRlc3QtZnVuY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3RUFBK0M7QUFDL0MsMEVBQWdEO0FBQ2hELHNFQUFxRDtBQUNyRCxpREFBdUQ7QUFFdkQsU0FBd0IsZ0JBQWdCLENBQUUsRUFBRTtJQUN4QyxPQUFPLEtBQUssRUFBQyxPQUFPLEVBQUMsRUFBRTtRQUNuQixJQUFJLE1BQU0sR0FBUyxJQUFJLENBQUM7UUFDeEIsTUFBTSxPQUFPLEdBQU0sSUFBSSxvQkFBaUIsRUFBRSxDQUFDO1FBQzNDLE1BQU0sVUFBVSxHQUFHLDBCQUFjLENBQUMsMkJBQTJCLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUU5RSxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUkseUJBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqRCwwQkFBYyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRS9CLElBQUk7WUFDQSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsT0FBTyxHQUFHLEVBQUU7WUFDUixPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsRUFBRTtZQUN0QyxPQUFPLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDeEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLDRCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUVELElBQUksT0FBTyxDQUFDLFNBQVM7WUFDakIsTUFBTSxPQUFPLENBQUM7UUFFbEIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQTVCRCxtQ0E0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVzdENvbnRyb2xsZXIgZnJvbSAnLi90ZXN0LWNvbnRyb2xsZXInO1xuaW1wb3J0IHRlc3RSdW5UcmFja2VyIGZyb20gJy4vdGVzdC1ydW4tdHJhY2tlcic7XG5pbXBvcnQgVGVzdENhZmVFcnJvckxpc3QgZnJvbSAnLi4vZXJyb3JzL2Vycm9yLWxpc3QnO1xuaW1wb3J0IHsgTWlzc2luZ0F3YWl0RXJyb3IgfSBmcm9tICcuLi9lcnJvcnMvdGVzdC1ydW4nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3cmFwVGVzdEZ1bmN0aW9uIChmbikge1xuICAgIHJldHVybiBhc3luYyB0ZXN0UnVuID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCAgICAgICA9IG51bGw7XG4gICAgICAgIGNvbnN0IGVyckxpc3QgICAgPSBuZXcgVGVzdENhZmVFcnJvckxpc3QoKTtcbiAgICAgICAgY29uc3QgbWFya2VyZWRmbiA9IHRlc3RSdW5UcmFja2VyLmFkZFRyYWNraW5nTWFya2VyVG9GdW5jdGlvbih0ZXN0UnVuLmlkLCBmbik7XG5cbiAgICAgICAgdGVzdFJ1bi5jb250cm9sbGVyID0gbmV3IFRlc3RDb250cm9sbGVyKHRlc3RSdW4pO1xuXG4gICAgICAgIHRlc3RSdW5UcmFja2VyLmVuc3VyZUVuYWJsZWQoKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgbWFya2VyZWRmbih0ZXN0UnVuLmNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGVyckxpc3QuYWRkRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXJyTGlzdC5oYXNVbmNhdWdodEVycm9yc0luVGVzdENvZGUpIHtcbiAgICAgICAgICAgIHRlc3RSdW4uY29udHJvbGxlci5jYWxsc2l0ZXNXaXRob3V0QXdhaXQuZm9yRWFjaChjYWxsc2l0ZSA9PiB7XG4gICAgICAgICAgICAgICAgZXJyTGlzdC5hZGRFcnJvcihuZXcgTWlzc2luZ0F3YWl0RXJyb3IoY2FsbHNpdGUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVyckxpc3QuaGFzRXJyb3JzKVxuICAgICAgICAgICAgdGhyb3cgZXJyTGlzdDtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG4iXX0=