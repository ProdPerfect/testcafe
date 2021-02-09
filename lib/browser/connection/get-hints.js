"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const error_hints_1 = __importDefault(require("./error-hints"));
const browser_connection_timeouts_1 = require("../../utils/browser-connection-timeouts");
const render_template_1 = __importDefault(require("../../utils/render-template"));
const templates_1 = __importDefault(require("../../errors/runtime/templates"));
// NOTE: hint about too high concurrency factor will be added to the error after exceeding this value
const CONCURRENCY_FACTOR_UPPERBOUND = 3;
function getUsedTimeoutMsg(browserInitTimeout) {
    if (browserInitTimeout) {
        const browserInitTimeoutStr = humanize_duration_1.default(browserInitTimeout);
        return `${browserInitTimeoutStr} for all browsers`;
    }
    const localInitTimeoutStr = humanize_duration_1.default(browser_connection_timeouts_1.LOCAL_BROWSER_INIT_TIMEOUT);
    const remoteInitTimeoutStr = humanize_duration_1.default(browser_connection_timeouts_1.REMOTE_BROWSER_INIT_TIMEOUT);
    return `${localInitTimeoutStr} for local browsers and ${remoteInitTimeoutStr} for remote browsers`;
}
function getHints(connections, opts) {
    const warningsFromConnections = lodash_1.uniq(lodash_1.flattenDeep(connections.map(bc => bc.warningLog.messages)));
    const warningsFromBootstrapper = opts.warningLog.messages;
    const hints = [...warningsFromConnections, ...warningsFromBootstrapper];
    if (opts.concurrency > CONCURRENCY_FACTOR_UPPERBOUND)
        hints.push(render_template_1.default(templates_1.default[error_hints_1.default.TooHighConcurrencyFactor], opts.concurrency));
    hints.push(render_template_1.default(templates_1.default[error_hints_1.default.UseBrowserInitOption], getUsedTimeoutMsg(opts.browserInitTimeout)));
    hints.push(render_template_1.default(templates_1.default[error_hints_1.default.RestErrorCauses]));
    return hints;
}
exports.default = getHints;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWhpbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Jyb3dzZXIvY29ubmVjdGlvbi9nZXQtaGludHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBMkM7QUFDM0MsMEVBQWlEO0FBR2pELGdFQUF1RDtBQUN2RCx5RkFBa0g7QUFDbEgsa0ZBQXlEO0FBQ3pELCtFQUF1RDtBQUV2RCxxR0FBcUc7QUFDckcsTUFBTSw2QkFBNkIsR0FBRyxDQUFDLENBQUM7QUFFeEMsU0FBUyxpQkFBaUIsQ0FBRSxrQkFBMkI7SUFDbkQsSUFBSSxrQkFBa0IsRUFBRTtRQUNwQixNQUFNLHFCQUFxQixHQUFHLDJCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFbkUsT0FBTyxHQUFHLHFCQUFxQixtQkFBbUIsQ0FBQztLQUN0RDtJQUVELE1BQU0sbUJBQW1CLEdBQUksMkJBQWdCLENBQUMsd0RBQTBCLENBQUMsQ0FBQztJQUMxRSxNQUFNLG9CQUFvQixHQUFHLDJCQUFnQixDQUFDLHlEQUEyQixDQUFDLENBQUM7SUFFM0UsT0FBTyxHQUFHLG1CQUFtQiwyQkFBMkIsb0JBQW9CLHNCQUFzQixDQUFDO0FBQ3ZHLENBQUM7QUFFRCxTQUF3QixRQUFRLENBQUUsV0FBZ0MsRUFBRSxJQUF1QjtJQUN2RixNQUFNLHVCQUF1QixHQUFJLGFBQUksQ0FBQyxvQkFBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRyxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO0lBRTFELE1BQU0sS0FBSyxHQUFHLENBQUUsR0FBRyx1QkFBdUIsRUFBRSxHQUFHLHdCQUF3QixDQUFFLENBQUM7SUFFMUUsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLDZCQUE2QjtRQUNoRCxLQUFLLENBQUMsSUFBSSxDQUFDLHlCQUFjLENBQUMsbUJBQVMsQ0FBQyxxQkFBMEIsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBRWpILEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQWMsQ0FDckIsbUJBQVMsQ0FBQyxxQkFBMEIsQ0FBQyxvQkFBb0IsQ0FBQyxFQUMxRCxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FDN0MsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLElBQUksQ0FBQyx5QkFBYyxDQUFDLG1CQUFTLENBQUMscUJBQTBCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWxGLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFqQkQsMkJBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmxhdHRlbkRlZXAsIHVuaXEgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGh1bWFuaXplRHVyYXRpb24gZnJvbSAnaHVtYW5pemUtZHVyYXRpb24nO1xuaW1wb3J0IHsgQnJvd3NlclNldE9wdGlvbnMgfSBmcm9tICcuLi8uLi9ydW5uZXIvaW50ZXJmYWNlcyc7XG5pbXBvcnQgQnJvd3NlckNvbm5lY3Rpb24gZnJvbSAnLi8nO1xuaW1wb3J0IEJyb3dzZXJDb25uZWN0aW9uRXJyb3JIaW50IGZyb20gJy4vZXJyb3ItaGludHMnO1xuaW1wb3J0IHsgTE9DQUxfQlJPV1NFUl9JTklUX1RJTUVPVVQsIFJFTU9URV9CUk9XU0VSX0lOSVRfVElNRU9VVCB9IGZyb20gJy4uLy4uL3V0aWxzL2Jyb3dzZXItY29ubmVjdGlvbi10aW1lb3V0cyc7XG5pbXBvcnQgcmVuZGVyVGVtcGxhdGUgZnJvbSAnLi4vLi4vdXRpbHMvcmVuZGVyLXRlbXBsYXRlJztcbmltcG9ydCBURU1QTEFURVMgZnJvbSAnLi4vLi4vZXJyb3JzL3J1bnRpbWUvdGVtcGxhdGVzJztcblxuLy8gTk9URTogaGludCBhYm91dCB0b28gaGlnaCBjb25jdXJyZW5jeSBmYWN0b3Igd2lsbCBiZSBhZGRlZCB0byB0aGUgZXJyb3IgYWZ0ZXIgZXhjZWVkaW5nIHRoaXMgdmFsdWVcbmNvbnN0IENPTkNVUlJFTkNZX0ZBQ1RPUl9VUFBFUkJPVU5EID0gMztcblxuZnVuY3Rpb24gZ2V0VXNlZFRpbWVvdXRNc2cgKGJyb3dzZXJJbml0VGltZW91dD86IG51bWJlcik6IHN0cmluZyB7XG4gICAgaWYgKGJyb3dzZXJJbml0VGltZW91dCkge1xuICAgICAgICBjb25zdCBicm93c2VySW5pdFRpbWVvdXRTdHIgPSBodW1hbml6ZUR1cmF0aW9uKGJyb3dzZXJJbml0VGltZW91dCk7XG5cbiAgICAgICAgcmV0dXJuIGAke2Jyb3dzZXJJbml0VGltZW91dFN0cn0gZm9yIGFsbCBicm93c2Vyc2A7XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYWxJbml0VGltZW91dFN0ciAgPSBodW1hbml6ZUR1cmF0aW9uKExPQ0FMX0JST1dTRVJfSU5JVF9USU1FT1VUKTtcbiAgICBjb25zdCByZW1vdGVJbml0VGltZW91dFN0ciA9IGh1bWFuaXplRHVyYXRpb24oUkVNT1RFX0JST1dTRVJfSU5JVF9USU1FT1VUKTtcblxuICAgIHJldHVybiBgJHtsb2NhbEluaXRUaW1lb3V0U3RyfSBmb3IgbG9jYWwgYnJvd3NlcnMgYW5kICR7cmVtb3RlSW5pdFRpbWVvdXRTdHJ9IGZvciByZW1vdGUgYnJvd3NlcnNgO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRIaW50cyAoY29ubmVjdGlvbnM6IEJyb3dzZXJDb25uZWN0aW9uW10sIG9wdHM6IEJyb3dzZXJTZXRPcHRpb25zKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHdhcm5pbmdzRnJvbUNvbm5lY3Rpb25zICA9IHVuaXEoZmxhdHRlbkRlZXAoY29ubmVjdGlvbnMubWFwKGJjID0+IGJjLndhcm5pbmdMb2cubWVzc2FnZXMpKSk7XG4gICAgY29uc3Qgd2FybmluZ3NGcm9tQm9vdHN0cmFwcGVyID0gb3B0cy53YXJuaW5nTG9nLm1lc3NhZ2VzO1xuXG4gICAgY29uc3QgaGludHMgPSBbIC4uLndhcm5pbmdzRnJvbUNvbm5lY3Rpb25zLCAuLi53YXJuaW5nc0Zyb21Cb290c3RyYXBwZXIgXTtcblxuICAgIGlmIChvcHRzLmNvbmN1cnJlbmN5ID4gQ09OQ1VSUkVOQ1lfRkFDVE9SX1VQUEVSQk9VTkQpXG4gICAgICAgIGhpbnRzLnB1c2gocmVuZGVyVGVtcGxhdGUoVEVNUExBVEVTW0Jyb3dzZXJDb25uZWN0aW9uRXJyb3JIaW50LlRvb0hpZ2hDb25jdXJyZW5jeUZhY3Rvcl0sIG9wdHMuY29uY3VycmVuY3kpKTtcblxuICAgIGhpbnRzLnB1c2gocmVuZGVyVGVtcGxhdGUoXG4gICAgICAgIFRFTVBMQVRFU1tCcm93c2VyQ29ubmVjdGlvbkVycm9ySGludC5Vc2VCcm93c2VySW5pdE9wdGlvbl0sXG4gICAgICAgIGdldFVzZWRUaW1lb3V0TXNnKG9wdHMuYnJvd3NlckluaXRUaW1lb3V0KVxuICAgICkpO1xuXG4gICAgaGludHMucHVzaChyZW5kZXJUZW1wbGF0ZShURU1QTEFURVNbQnJvd3NlckNvbm5lY3Rpb25FcnJvckhpbnQuUmVzdEVycm9yQ2F1c2VzXSkpO1xuXG4gICAgcmV0dXJuIGhpbnRzO1xufVxuIl19