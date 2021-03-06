"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_unit_1 = __importDefault(require("./base-unit"));
const unit_types_1 = require("./unit-types");
const BORROWED_TEST_PROPERTIES = ['skip', 'only', 'pageUrl', 'authCredentials'];
class TestFile extends base_unit_1.default {
    constructor(filename) {
        super(unit_types_1.TEST_FILE);
        this.filename = filename;
        this.currentFixture = null;
        this.collectedTests = [];
    }
    getTests() {
        this.collectedTests.forEach(test => {
            BORROWED_TEST_PROPERTIES.forEach(prop => {
                test[prop] = test[prop] || test.fixture[prop];
            });
            if (test.disablePageReloads === void 0)
                test.disablePageReloads = test.fixture.disablePageReloads;
            if (!test.disablePageCaching)
                test.disablePageCaching = test.fixture.disablePageCaching;
        });
        return this.collectedTests;
    }
}
exports.default = TestFile;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1maWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9zdHJ1Y3R1cmUvdGVzdC1maWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQW1DO0FBQ25DLDZDQUEyRDtBQUczRCxNQUFNLHdCQUF3QixHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVoRixNQUFxQixRQUFTLFNBQVEsbUJBQVE7SUFDMUMsWUFBYSxRQUFRO1FBQ2pCLEtBQUssQ0FBQyxzQkFBYyxDQUFDLENBQUM7UUFFdEIsSUFBSSxDQUFDLFFBQVEsR0FBUyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQix3QkFBd0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksSUFBSSxDQUFDLGtCQUFrQixLQUFLLEtBQUssQ0FBQztnQkFDbEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUM7WUFFOUQsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0I7Z0JBQ3hCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDO1FBQ2xFLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQy9CLENBQUM7Q0FDSjtBQXhCRCwyQkF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVVuaXQgZnJvbSAnLi9iYXNlLXVuaXQnO1xuaW1wb3J0IHsgVEVTVF9GSUxFIGFzIFRFU1RfRklMRV9UWVBFIH0gZnJvbSAnLi91bml0LXR5cGVzJztcblxuXG5jb25zdCBCT1JST1dFRF9URVNUX1BST1BFUlRJRVMgPSBbJ3NraXAnLCAnb25seScsICdwYWdlVXJsJywgJ2F1dGhDcmVkZW50aWFscyddO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0RmlsZSBleHRlbmRzIEJhc2VVbml0IHtcbiAgICBjb25zdHJ1Y3RvciAoZmlsZW5hbWUpIHtcbiAgICAgICAgc3VwZXIoVEVTVF9GSUxFX1RZUEUpO1xuXG4gICAgICAgIHRoaXMuZmlsZW5hbWUgICAgICAgPSBmaWxlbmFtZTtcbiAgICAgICAgdGhpcy5jdXJyZW50Rml4dHVyZSA9IG51bGw7XG4gICAgICAgIHRoaXMuY29sbGVjdGVkVGVzdHMgPSBbXTtcbiAgICB9XG5cbiAgICBnZXRUZXN0cyAoKSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGVkVGVzdHMuZm9yRWFjaCh0ZXN0ID0+IHtcbiAgICAgICAgICAgIEJPUlJPV0VEX1RFU1RfUFJPUEVSVElFUy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgICAgIHRlc3RbcHJvcF0gPSB0ZXN0W3Byb3BdIHx8IHRlc3QuZml4dHVyZVtwcm9wXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGVzdC5kaXNhYmxlUGFnZVJlbG9hZHMgPT09IHZvaWQgMClcbiAgICAgICAgICAgICAgICB0ZXN0LmRpc2FibGVQYWdlUmVsb2FkcyA9IHRlc3QuZml4dHVyZS5kaXNhYmxlUGFnZVJlbG9hZHM7XG5cbiAgICAgICAgICAgIGlmICghdGVzdC5kaXNhYmxlUGFnZUNhY2hpbmcpXG4gICAgICAgICAgICAgICAgdGVzdC5kaXNhYmxlUGFnZUNhY2hpbmcgPSB0ZXN0LmZpeHR1cmUuZGlzYWJsZVBhZ2VDYWNoaW5nO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0ZWRUZXN0cztcbiAgICB9XG59XG4iXX0=