"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_test_fn_error_1 = __importDefault(require("./process-test-fn-error"));
const test_run_1 = require("./test-run");
class TestCafeErrorList {
    constructor() {
        this.items = [];
        this.name = TestCafeErrorList.name;
    }
    get hasErrors() {
        return !!this.items.length;
    }
    get hasUncaughtErrorsInTestCode() {
        return this.items.some(item => item instanceof test_run_1.UncaughtErrorInTestCode);
    }
    addError(err) {
        if (err instanceof TestCafeErrorList)
            this.items = this.items.concat(err.items);
        else
            this.items.push(process_test_fn_error_1.default(err));
    }
}
exports.default = TestCafeErrorList;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lcnJvcnMvZXJyb3ItbGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9GQUF5RDtBQUN6RCx5Q0FBcUQ7QUFFckQsTUFBcUIsaUJBQWlCO0lBQ2xDO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7SUFDeEMsQ0FBQztJQUVELElBQUksU0FBUztRQUNULE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQy9CLENBQUM7SUFFRCxJQUFJLDJCQUEyQjtRQUMzQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxZQUFZLGtDQUF1QixDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELFFBQVEsQ0FBRSxHQUFHO1FBQ1QsSUFBSSxHQUFHLFlBQVksaUJBQWlCO1lBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUUxQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQywrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDSjtBQXBCRCxvQ0FvQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJvY2Vzc1Rlc3RGbkVycm9yIGZyb20gJy4vcHJvY2Vzcy10ZXN0LWZuLWVycm9yJztcbmltcG9ydCB7IFVuY2F1Z2h0RXJyb3JJblRlc3RDb2RlIH0gZnJvbSAnLi90ZXN0LXJ1bic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlc3RDYWZlRXJyb3JMaXN0IHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgdGhpcy5uYW1lICA9IFRlc3RDYWZlRXJyb3JMaXN0Lm5hbWU7XG4gICAgfVxuXG4gICAgZ2V0IGhhc0Vycm9ycyAoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuaXRlbXMubGVuZ3RoO1xuICAgIH1cblxuICAgIGdldCBoYXNVbmNhdWdodEVycm9yc0luVGVzdENvZGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5zb21lKGl0ZW0gPT4gaXRlbSBpbnN0YW5jZW9mIFVuY2F1Z2h0RXJyb3JJblRlc3RDb2RlKTtcbiAgICB9XG5cbiAgICBhZGRFcnJvciAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBUZXN0Q2FmZUVycm9yTGlzdClcbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmNvbmNhdChlcnIuaXRlbXMpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gocHJvY2Vzc1Rlc3RGbkVycm9yKGVycikpO1xuICAgIH1cbn1cbiJdfQ==