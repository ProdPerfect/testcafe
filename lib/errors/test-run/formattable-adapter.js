"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const parse5_1 = require("parse5");
const callsite_record_1 = require("callsite-record");
const render_error_template_1 = __importDefault(require("./render-error-template"));
const create_stack_filter_1 = __importDefault(require("../create-stack-filter"));
const render_callsite_sync_1 = __importDefault(require("../../utils/render-callsite-sync"));
const parser = new parse5_1.Parser();
class TestRunErrorFormattableAdapter {
    constructor(err, metaInfo) {
        this.userAgent = metaInfo.userAgent;
        this.screenshotPath = metaInfo.screenshotPath;
        this.testRunId = metaInfo.testRunId;
        this.testRunPhase = metaInfo.testRunPhase;
        lodash_1.assignIn(this, err);
        this.callsite = this.callsite || metaInfo.callsite;
    }
    static _getSelector(node) {
        const classAttr = lodash_1.find(node.attrs, { name: 'class' });
        const cls = classAttr && classAttr.value;
        return cls ? `${node.tagName} ${cls}` : node.tagName;
    }
    static _decorateHtml(node, decorator) {
        let msg = '';
        if (node.nodeName === '#text')
            msg = node.value;
        else {
            if (node.childNodes.length) {
                msg += node.childNodes
                    .map(childNode => TestRunErrorFormattableAdapter._decorateHtml(childNode, decorator))
                    .join('');
            }
            if (node.nodeName !== '#document-fragment') {
                const selector = TestRunErrorFormattableAdapter._getSelector(node);
                msg = decorator[selector](msg, node.attrs);
            }
        }
        return msg;
    }
    getErrorMarkup(viewportWidth) {
        return render_error_template_1.default(this, viewportWidth);
    }
    getCallsiteMarkup() {
        return render_callsite_sync_1.default(this.callsite, {
            renderer: callsite_record_1.renderers.html,
            stackFilter: create_stack_filter_1.default(Error.stackTraceLimit)
        });
    }
    formatMessage(decorator, viewportWidth) {
        const msgHtml = this.getErrorMarkup(viewportWidth);
        const fragment = parser.parseFragment(msgHtml);
        return TestRunErrorFormattableAdapter._decorateHtml(fragment, decorator);
    }
}
exports.default = TestRunErrorFormattableAdapter;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0dGFibGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lcnJvcnMvdGVzdC1ydW4vZm9ybWF0dGFibGUtYWRhcHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1DQUF3QztBQUN4QyxtQ0FBZ0M7QUFDaEMscURBQTRDO0FBQzVDLG9GQUEwRDtBQUMxRCxpRkFBdUQ7QUFDdkQsNEZBQWtFO0FBRWxFLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7QUFFNUIsTUFBcUIsOEJBQThCO0lBQy9DLFlBQWEsR0FBRyxFQUFFLFFBQVE7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBUSxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQztRQUM5QyxJQUFJLENBQUMsU0FBUyxHQUFRLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDekMsSUFBSSxDQUFDLFlBQVksR0FBSyxRQUFRLENBQUMsWUFBWSxDQUFDO1FBRTVDLGlCQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXBCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ3ZELENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFFLElBQUk7UUFDckIsTUFBTSxTQUFTLEdBQUcsYUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN0RCxNQUFNLEdBQUcsR0FBUyxTQUFTLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztRQUUvQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3pELENBQUM7SUFFRCxNQUFNLENBQUMsYUFBYSxDQUFFLElBQUksRUFBRSxTQUFTO1FBQ2pDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUViLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPO1lBQ3pCLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ2hCO1lBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtnQkFDeEIsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVO3FCQUNqQixHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3FCQUNwRixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDakI7WUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssb0JBQW9CLEVBQUU7Z0JBQ3hDLE1BQU0sUUFBUSxHQUFHLDhCQUE4QixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFbkUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzlDO1NBQ0o7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCxjQUFjLENBQUUsYUFBYTtRQUN6QixPQUFPLCtCQUFtQixDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsT0FBTyw4QkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3JDLFFBQVEsRUFBSywyQkFBUyxDQUFDLElBQUk7WUFDM0IsV0FBVyxFQUFFLDZCQUFpQixDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7U0FDeEQsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGFBQWEsQ0FBRSxTQUFTLEVBQUUsYUFBYTtRQUNuQyxNQUFNLE9BQU8sR0FBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0MsT0FBTyw4QkFBOEIsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7Q0FDSjtBQTFERCxpREEwREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmaW5kLCBhc3NpZ25JbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tICdwYXJzZTUnO1xuaW1wb3J0IHsgcmVuZGVyZXJzIH0gZnJvbSAnY2FsbHNpdGUtcmVjb3JkJztcbmltcG9ydCByZW5kZXJFcnJvclRlbXBsYXRlIGZyb20gJy4vcmVuZGVyLWVycm9yLXRlbXBsYXRlJztcbmltcG9ydCBjcmVhdGVTdGFja0ZpbHRlciBmcm9tICcuLi9jcmVhdGUtc3RhY2stZmlsdGVyJztcbmltcG9ydCByZW5kZXJDYWxsc2l0ZVN5bmMgZnJvbSAnLi4vLi4vdXRpbHMvcmVuZGVyLWNhbGxzaXRlLXN5bmMnO1xuXG5jb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlc3RSdW5FcnJvckZvcm1hdHRhYmxlQWRhcHRlciB7XG4gICAgY29uc3RydWN0b3IgKGVyciwgbWV0YUluZm8pIHtcbiAgICAgICAgdGhpcy51c2VyQWdlbnQgICAgICA9IG1ldGFJbmZvLnVzZXJBZ2VudDtcbiAgICAgICAgdGhpcy5zY3JlZW5zaG90UGF0aCA9IG1ldGFJbmZvLnNjcmVlbnNob3RQYXRoO1xuICAgICAgICB0aGlzLnRlc3RSdW5JZCAgICAgID0gbWV0YUluZm8udGVzdFJ1bklkO1xuICAgICAgICB0aGlzLnRlc3RSdW5QaGFzZSAgID0gbWV0YUluZm8udGVzdFJ1blBoYXNlO1xuXG4gICAgICAgIGFzc2lnbkluKHRoaXMsIGVycik7XG5cbiAgICAgICAgdGhpcy5jYWxsc2l0ZSA9IHRoaXMuY2FsbHNpdGUgfHwgbWV0YUluZm8uY2FsbHNpdGU7XG4gICAgfVxuXG4gICAgc3RhdGljIF9nZXRTZWxlY3RvciAobm9kZSkge1xuICAgICAgICBjb25zdCBjbGFzc0F0dHIgPSBmaW5kKG5vZGUuYXR0cnMsIHsgbmFtZTogJ2NsYXNzJyB9KTtcbiAgICAgICAgY29uc3QgY2xzICAgICAgID0gY2xhc3NBdHRyICYmIGNsYXNzQXR0ci52YWx1ZTtcblxuICAgICAgICByZXR1cm4gY2xzID8gYCR7bm9kZS50YWdOYW1lfSAke2Nsc31gIDogbm9kZS50YWdOYW1lO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb3JhdGVIdG1sIChub2RlLCBkZWNvcmF0b3IpIHtcbiAgICAgICAgbGV0IG1zZyA9ICcnO1xuXG4gICAgICAgIGlmIChub2RlLm5vZGVOYW1lID09PSAnI3RleHQnKVxuICAgICAgICAgICAgbXNnID0gbm9kZS52YWx1ZTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG1zZyArPSBub2RlLmNoaWxkTm9kZXNcbiAgICAgICAgICAgICAgICAgICAgLm1hcChjaGlsZE5vZGUgPT4gVGVzdFJ1bkVycm9yRm9ybWF0dGFibGVBZGFwdGVyLl9kZWNvcmF0ZUh0bWwoY2hpbGROb2RlLCBkZWNvcmF0b3IpKVxuICAgICAgICAgICAgICAgICAgICAuam9pbignJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVOYW1lICE9PSAnI2RvY3VtZW50LWZyYWdtZW50Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdG9yID0gVGVzdFJ1bkVycm9yRm9ybWF0dGFibGVBZGFwdGVyLl9nZXRTZWxlY3Rvcihub2RlKTtcblxuICAgICAgICAgICAgICAgIG1zZyA9IGRlY29yYXRvcltzZWxlY3Rvcl0obXNnLCBub2RlLmF0dHJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtc2c7XG4gICAgfVxuXG4gICAgZ2V0RXJyb3JNYXJrdXAgKHZpZXdwb3J0V2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIHJlbmRlckVycm9yVGVtcGxhdGUodGhpcywgdmlld3BvcnRXaWR0aCk7XG4gICAgfVxuXG4gICAgZ2V0Q2FsbHNpdGVNYXJrdXAgKCkge1xuICAgICAgICByZXR1cm4gcmVuZGVyQ2FsbHNpdGVTeW5jKHRoaXMuY2FsbHNpdGUsIHtcbiAgICAgICAgICAgIHJlbmRlcmVyOiAgICByZW5kZXJlcnMuaHRtbCxcbiAgICAgICAgICAgIHN0YWNrRmlsdGVyOiBjcmVhdGVTdGFja0ZpbHRlcihFcnJvci5zdGFja1RyYWNlTGltaXQpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvcm1hdE1lc3NhZ2UgKGRlY29yYXRvciwgdmlld3BvcnRXaWR0aCkge1xuICAgICAgICBjb25zdCBtc2dIdG1sICA9IHRoaXMuZ2V0RXJyb3JNYXJrdXAodmlld3BvcnRXaWR0aCk7XG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gcGFyc2VyLnBhcnNlRnJhZ21lbnQobXNnSHRtbCk7XG5cbiAgICAgICAgcmV0dXJuIFRlc3RSdW5FcnJvckZvcm1hdHRhYmxlQWRhcHRlci5fZGVjb3JhdGVIdG1sKGZyYWdtZW50LCBkZWNvcmF0b3IpO1xuICAgIH1cbn1cbiJdfQ==