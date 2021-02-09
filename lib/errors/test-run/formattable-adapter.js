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
                msg = decorator[selector] ? decorator[selector](msg, node.attrs) : msg;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0dGFibGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lcnJvcnMvdGVzdC1ydW4vZm9ybWF0dGFibGUtYWRhcHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1DQUF3QztBQUN4QyxtQ0FBZ0M7QUFDaEMscURBQTRDO0FBQzVDLG9GQUEwRDtBQUMxRCxpRkFBdUQ7QUFDdkQsNEZBQWtFO0FBRWxFLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7QUFFNUIsTUFBcUIsOEJBQThCO0lBQy9DLFlBQWEsR0FBRyxFQUFFLFFBQVE7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBUSxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQztRQUM5QyxJQUFJLENBQUMsU0FBUyxHQUFRLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDekMsSUFBSSxDQUFDLFlBQVksR0FBSyxRQUFRLENBQUMsWUFBWSxDQUFDO1FBRTVDLGlCQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXBCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ3ZELENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFFLElBQUk7UUFDckIsTUFBTSxTQUFTLEdBQUcsYUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN0RCxNQUFNLEdBQUcsR0FBUyxTQUFTLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztRQUUvQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3pELENBQUM7SUFFRCxNQUFNLENBQUMsYUFBYSxDQUFFLElBQUksRUFBRSxTQUFTO1FBQ2pDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUViLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPO1lBQ3pCLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ2hCO1lBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtnQkFDeEIsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVO3FCQUNqQixHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3FCQUNwRixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDakI7WUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssb0JBQW9CLEVBQUU7Z0JBQ3hDLE1BQU0sUUFBUSxHQUFHLDhCQUE4QixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFbkUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzthQUMxRTtTQUNKO1FBRUQsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQsY0FBYyxDQUFFLGFBQWE7UUFDekIsT0FBTywrQkFBbUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELGlCQUFpQjtRQUNiLE9BQU8sOEJBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNyQyxRQUFRLEVBQUssMkJBQVMsQ0FBQyxJQUFJO1lBQzNCLFdBQVcsRUFBRSw2QkFBaUIsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO1NBQ3hELENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxhQUFhLENBQUUsU0FBUyxFQUFFLGFBQWE7UUFDbkMsTUFBTSxPQUFPLEdBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRS9DLE9BQU8sOEJBQThCLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM3RSxDQUFDO0NBQ0o7QUExREQsaURBMERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmluZCwgYXNzaWduSW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSAncGFyc2U1JztcbmltcG9ydCB7IHJlbmRlcmVycyB9IGZyb20gJ2NhbGxzaXRlLXJlY29yZCc7XG5pbXBvcnQgcmVuZGVyRXJyb3JUZW1wbGF0ZSBmcm9tICcuL3JlbmRlci1lcnJvci10ZW1wbGF0ZSc7XG5pbXBvcnQgY3JlYXRlU3RhY2tGaWx0ZXIgZnJvbSAnLi4vY3JlYXRlLXN0YWNrLWZpbHRlcic7XG5pbXBvcnQgcmVuZGVyQ2FsbHNpdGVTeW5jIGZyb20gJy4uLy4uL3V0aWxzL3JlbmRlci1jYWxsc2l0ZS1zeW5jJztcblxuY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0UnVuRXJyb3JGb3JtYXR0YWJsZUFkYXB0ZXIge1xuICAgIGNvbnN0cnVjdG9yIChlcnIsIG1ldGFJbmZvKSB7XG4gICAgICAgIHRoaXMudXNlckFnZW50ICAgICAgPSBtZXRhSW5mby51c2VyQWdlbnQ7XG4gICAgICAgIHRoaXMuc2NyZWVuc2hvdFBhdGggPSBtZXRhSW5mby5zY3JlZW5zaG90UGF0aDtcbiAgICAgICAgdGhpcy50ZXN0UnVuSWQgICAgICA9IG1ldGFJbmZvLnRlc3RSdW5JZDtcbiAgICAgICAgdGhpcy50ZXN0UnVuUGhhc2UgICA9IG1ldGFJbmZvLnRlc3RSdW5QaGFzZTtcblxuICAgICAgICBhc3NpZ25Jbih0aGlzLCBlcnIpO1xuXG4gICAgICAgIHRoaXMuY2FsbHNpdGUgPSB0aGlzLmNhbGxzaXRlIHx8IG1ldGFJbmZvLmNhbGxzaXRlO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZ2V0U2VsZWN0b3IgKG5vZGUpIHtcbiAgICAgICAgY29uc3QgY2xhc3NBdHRyID0gZmluZChub2RlLmF0dHJzLCB7IG5hbWU6ICdjbGFzcycgfSk7XG4gICAgICAgIGNvbnN0IGNscyAgICAgICA9IGNsYXNzQXR0ciAmJiBjbGFzc0F0dHIudmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIGNscyA/IGAke25vZGUudGFnTmFtZX0gJHtjbHN9YCA6IG5vZGUudGFnTmFtZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29yYXRlSHRtbCAobm9kZSwgZGVjb3JhdG9yKSB7XG4gICAgICAgIGxldCBtc2cgPSAnJztcblxuICAgICAgICBpZiAobm9kZS5ub2RlTmFtZSA9PT0gJyN0ZXh0JylcbiAgICAgICAgICAgIG1zZyA9IG5vZGUudmFsdWU7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtc2cgKz0gbm9kZS5jaGlsZE5vZGVzXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoY2hpbGROb2RlID0+IFRlc3RSdW5FcnJvckZvcm1hdHRhYmxlQWRhcHRlci5fZGVjb3JhdGVIdG1sKGNoaWxkTm9kZSwgZGVjb3JhdG9yKSlcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9kZS5ub2RlTmFtZSAhPT0gJyNkb2N1bWVudC1mcmFnbWVudCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RvciA9IFRlc3RSdW5FcnJvckZvcm1hdHRhYmxlQWRhcHRlci5fZ2V0U2VsZWN0b3Iobm9kZSk7XG5cbiAgICAgICAgICAgICAgICBtc2cgPSBkZWNvcmF0b3Jbc2VsZWN0b3JdID8gZGVjb3JhdG9yW3NlbGVjdG9yXShtc2csIG5vZGUuYXR0cnMpIDogbXNnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1zZztcbiAgICB9XG5cbiAgICBnZXRFcnJvck1hcmt1cCAodmlld3BvcnRXaWR0aCkge1xuICAgICAgICByZXR1cm4gcmVuZGVyRXJyb3JUZW1wbGF0ZSh0aGlzLCB2aWV3cG9ydFdpZHRoKTtcbiAgICB9XG5cbiAgICBnZXRDYWxsc2l0ZU1hcmt1cCAoKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJDYWxsc2l0ZVN5bmModGhpcy5jYWxsc2l0ZSwge1xuICAgICAgICAgICAgcmVuZGVyZXI6ICAgIHJlbmRlcmVycy5odG1sLFxuICAgICAgICAgICAgc3RhY2tGaWx0ZXI6IGNyZWF0ZVN0YWNrRmlsdGVyKEVycm9yLnN0YWNrVHJhY2VMaW1pdClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZm9ybWF0TWVzc2FnZSAoZGVjb3JhdG9yLCB2aWV3cG9ydFdpZHRoKSB7XG4gICAgICAgIGNvbnN0IG1zZ0h0bWwgID0gdGhpcy5nZXRFcnJvck1hcmt1cCh2aWV3cG9ydFdpZHRoKTtcbiAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBwYXJzZXIucGFyc2VGcmFnbWVudChtc2dIdG1sKTtcblxuICAgICAgICByZXR1cm4gVGVzdFJ1bkVycm9yRm9ybWF0dGFibGVBZGFwdGVyLl9kZWNvcmF0ZUh0bWwoZnJhZ21lbnQsIGRlY29yYXRvcik7XG4gICAgfVxufVxuIl19