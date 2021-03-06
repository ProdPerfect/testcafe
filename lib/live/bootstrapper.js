"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const module_1 = __importDefault(require("module"));
const bootstrapper_1 = __importDefault(require("../runner/bootstrapper"));
const compiler_1 = __importDefault(require("../compiler"));
const originalRequire = module_1.default.prototype.require;
class LiveModeBootstrapper extends bootstrapper_1.default {
    constructor(runner, browserConnectionGateway) {
        super(browserConnectionGateway);
        this.runner = runner;
    }
    _getTests() {
        this._mockRequire();
        return super._getTests()
            .then(result => {
            this._restoreRequire();
            return result;
        })
            .catch(err => {
            this._restoreRequire();
            compiler_1.default.cleanUp();
            this.runner.setBootstrappingError(err);
        });
    }
    _mockRequire() {
        const controller = this.runner.controller;
        // NODE: we replace the `require` method to add required files to watcher
        module_1.default.prototype.require = function (filePath) {
            const filename = module_1.default._resolveFilename(filePath, this, false);
            if (path_1.default.isAbsolute(filename) || /^\.\.?[/\\]/.test(filename))
                controller.addFileToWatches(filename);
            return originalRequire.apply(this, arguments);
        };
    }
    _restoreRequire() {
        module_1.default.prototype.require = originalRequire;
    }
}
exports.default = LiveModeBootstrapper;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpdmUvYm9vdHN0cmFwcGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0RBQXdCO0FBQ3hCLG9EQUE0QjtBQUM1QiwwRUFBa0Q7QUFDbEQsMkRBQW1DO0FBRW5DLE1BQU0sZUFBZSxHQUFHLGdCQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUVqRCxNQUFNLG9CQUFxQixTQUFRLHNCQUFZO0lBQzNDLFlBQWEsTUFBTSxFQUFFLHdCQUF3QjtRQUN6QyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsU0FBUztRQUNMLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixPQUFPLEtBQUssQ0FBQyxTQUFTLEVBQUU7YUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ1gsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXZCLE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNULElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUV2QixrQkFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRW5CLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsWUFBWTtRQUNSLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBRTFDLHlFQUF5RTtRQUN6RSxnQkFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxRQUFRO1lBQ3pDLE1BQU0sUUFBUSxHQUFHLGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVoRSxJQUFJLGNBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ3pELFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUcxQyxPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxlQUFlO1FBQ1gsZ0JBQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQztJQUMvQyxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxvQkFBb0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICdtb2R1bGUnO1xuaW1wb3J0IEJvb3RzdHJhcHBlciBmcm9tICcuLi9ydW5uZXIvYm9vdHN0cmFwcGVyJztcbmltcG9ydCBDb21waWxlciBmcm9tICcuLi9jb21waWxlcic7XG5cbmNvbnN0IG9yaWdpbmFsUmVxdWlyZSA9IE1vZHVsZS5wcm90b3R5cGUucmVxdWlyZTtcblxuY2xhc3MgTGl2ZU1vZGVCb290c3RyYXBwZXIgZXh0ZW5kcyBCb290c3RyYXBwZXIge1xuICAgIGNvbnN0cnVjdG9yIChydW5uZXIsIGJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheSkge1xuICAgICAgICBzdXBlcihicm93c2VyQ29ubmVjdGlvbkdhdGV3YXkpO1xuXG4gICAgICAgIHRoaXMucnVubmVyID0gcnVubmVyO1xuICAgIH1cblxuICAgIF9nZXRUZXN0cyAoKSB7XG4gICAgICAgIHRoaXMuX21vY2tSZXF1aXJlKCk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLl9nZXRUZXN0cygpXG4gICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3RvcmVSZXF1aXJlKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3RvcmVSZXF1aXJlKCk7XG5cbiAgICAgICAgICAgICAgICBDb21waWxlci5jbGVhblVwKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJ1bm5lci5zZXRCb290c3RyYXBwaW5nRXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9tb2NrUmVxdWlyZSAoKSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSB0aGlzLnJ1bm5lci5jb250cm9sbGVyO1xuXG4gICAgICAgIC8vIE5PREU6IHdlIHJlcGxhY2UgdGhlIGByZXF1aXJlYCBtZXRob2QgdG8gYWRkIHJlcXVpcmVkIGZpbGVzIHRvIHdhdGNoZXJcbiAgICAgICAgTW9kdWxlLnByb3RvdHlwZS5yZXF1aXJlID0gZnVuY3Rpb24gKGZpbGVQYXRoKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IE1vZHVsZS5fcmVzb2x2ZUZpbGVuYW1lKGZpbGVQYXRoLCB0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmIChwYXRoLmlzQWJzb2x1dGUoZmlsZW5hbWUpIHx8IC9eXFwuXFwuP1svXFxcXF0vLnRlc3QoZmlsZW5hbWUpKVxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYWRkRmlsZVRvV2F0Y2hlcyhmaWxlbmFtZSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsUmVxdWlyZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9yZXN0b3JlUmVxdWlyZSAoKSB7XG4gICAgICAgIE1vZHVsZS5wcm90b3R5cGUucmVxdWlyZSA9IG9yaWdpbmFsUmVxdWlyZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpdmVNb2RlQm9vdHN0cmFwcGVyO1xuIl19