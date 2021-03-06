"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const render_template_1 = __importDefault(require("../utils/render-template"));
class WarningLog {
    constructor(globalLog = null) {
        this.globalLog = globalLog;
        this.messages = [];
    }
    addPlainMessage(msg) {
        // NOTE: avoid duplicates
        if (this.messages.indexOf(msg) < 0)
            this.messages.push(msg);
    }
    addWarning() {
        const msg = render_template_1.default.apply(null, arguments);
        this.addPlainMessage(msg);
        if (this.globalLog)
            this.globalLog.addPlainMessage(msg);
    }
}
exports.default = WarningLog;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FybmluZy1sb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbm90aWZpY2F0aW9ucy93YXJuaW5nLWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtFQUFzRDtBQUV0RCxNQUFxQixVQUFVO0lBQzNCLFlBQWEsU0FBUyxHQUFHLElBQUk7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELGVBQWUsQ0FBRSxHQUFHO1FBQ2hCLHlCQUF5QjtRQUN6QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7WUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELFVBQVU7UUFDTixNQUFNLEdBQUcsR0FBRyx5QkFBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFbEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxQixJQUFJLElBQUksQ0FBQyxTQUFTO1lBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsQ0FBQztDQUNKO0FBcEJELDZCQW9CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZW5kZXJUZW1wbGF0ZSBmcm9tICcuLi91dGlscy9yZW5kZXItdGVtcGxhdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXJuaW5nTG9nIHtcbiAgICBjb25zdHJ1Y3RvciAoZ2xvYmFsTG9nID0gbnVsbCkge1xuICAgICAgICB0aGlzLmdsb2JhbExvZyA9IGdsb2JhbExvZztcbiAgICAgICAgdGhpcy5tZXNzYWdlcyAgPSBbXTtcbiAgICB9XG5cbiAgICBhZGRQbGFpbk1lc3NhZ2UgKG1zZykge1xuICAgICAgICAvLyBOT1RFOiBhdm9pZCBkdXBsaWNhdGVzXG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2VzLmluZGV4T2YobXNnKSA8IDApXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2gobXNnKTtcbiAgICB9XG5cbiAgICBhZGRXYXJuaW5nICgpIHtcbiAgICAgICAgY29uc3QgbXNnID0gcmVuZGVyVGVtcGxhdGUuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblxuICAgICAgICB0aGlzLmFkZFBsYWluTWVzc2FnZShtc2cpO1xuXG4gICAgICAgIGlmICh0aGlzLmdsb2JhbExvZylcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsTG9nLmFkZFBsYWluTWVzc2FnZShtc2cpO1xuICAgIH1cbn1cbiJdfQ==