"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_unit_1 = __importDefault(require("./base-unit"));
const unit_type_1 = __importDefault(require("./unit-type"));
const BORROWED_TEST_PROPERTIES = ['skip', 'only', 'pageUrl', 'authCredentials'];
class TestFile extends base_unit_1.default {
    constructor(filename) {
        super(unit_type_1.default.testFile);
        this.filename = filename;
        this.currentFixture = null;
        this.collectedTests = [];
    }
    getTests() {
        this.collectedTests.forEach(test => {
            BORROWED_TEST_PROPERTIES.forEach(prop => {
                // TODO: add index signature to the Test and Fixture classes
                //@ts-ignore
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1maWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9zdHJ1Y3R1cmUvdGVzdC1maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQW1DO0FBQ25DLDREQUFtQztBQUluQyxNQUFNLHdCQUF3QixHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVoRixNQUFxQixRQUFTLFNBQVEsbUJBQVE7SUFLMUMsWUFBb0IsUUFBZ0I7UUFDaEMsS0FBSyxDQUFDLG1CQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFekIsSUFBSSxDQUFDLFFBQVEsR0FBUyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVNLFFBQVE7UUFDWCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQix3QkFBd0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BDLDREQUE0RDtnQkFDNUQsWUFBWTtnQkFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsS0FBSyxLQUFLLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDO1lBRTlELElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCO2dCQUN4QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMvQixDQUFDO0NBQ0o7QUE5QkQsMkJBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VVbml0IGZyb20gJy4vYmFzZS11bml0JztcbmltcG9ydCBVbml0VHlwZSBmcm9tICcuL3VuaXQtdHlwZSc7XG5pbXBvcnQgRml4dHVyZSBmcm9tICcuL2ZpeHR1cmUnO1xuaW1wb3J0IFRlc3QgZnJvbSAnLi90ZXN0JztcblxuY29uc3QgQk9SUk9XRURfVEVTVF9QUk9QRVJUSUVTID0gWydza2lwJywgJ29ubHknLCAncGFnZVVybCcsICdhdXRoQ3JlZGVudGlhbHMnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVzdEZpbGUgZXh0ZW5kcyBCYXNlVW5pdCB7XG4gICAgcHVibGljIGZpbGVuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGN1cnJlbnRGaXh0dXJlOiBGaXh0dXJlIHwgbnVsbDtcbiAgICBwdWJsaWMgY29sbGVjdGVkVGVzdHM6IFRlc3RbXTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvciAoZmlsZW5hbWU6IHN0cmluZykge1xuICAgICAgICBzdXBlcihVbml0VHlwZS50ZXN0RmlsZSk7XG5cbiAgICAgICAgdGhpcy5maWxlbmFtZSAgICAgICA9IGZpbGVuYW1lO1xuICAgICAgICB0aGlzLmN1cnJlbnRGaXh0dXJlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb2xsZWN0ZWRUZXN0cyA9IFtdO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRUZXN0cyAoKTogVGVzdFtdIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0ZWRUZXN0cy5mb3JFYWNoKHRlc3QgPT4ge1xuICAgICAgICAgICAgQk9SUk9XRURfVEVTVF9QUk9QRVJUSUVTLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogYWRkIGluZGV4IHNpZ25hdHVyZSB0byB0aGUgVGVzdCBhbmQgRml4dHVyZSBjbGFzc2VzXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgdGVzdFtwcm9wXSA9IHRlc3RbcHJvcF0gfHwgdGVzdC5maXh0dXJlW3Byb3BdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0LmRpc2FibGVQYWdlUmVsb2FkcyA9PT0gdm9pZCAwKVxuICAgICAgICAgICAgICAgIHRlc3QuZGlzYWJsZVBhZ2VSZWxvYWRzID0gdGVzdC5maXh0dXJlLmRpc2FibGVQYWdlUmVsb2FkcztcblxuICAgICAgICAgICAgaWYgKCF0ZXN0LmRpc2FibGVQYWdlQ2FjaGluZylcbiAgICAgICAgICAgICAgICB0ZXN0LmRpc2FibGVQYWdlQ2FjaGluZyA9IHRlc3QuZml4dHVyZS5kaXNhYmxlUGFnZUNhY2hpbmc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3RlZFRlc3RzO1xuICAgIH1cbn1cbiJdfQ==