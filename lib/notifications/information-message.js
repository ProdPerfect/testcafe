"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAILED_TO_GENERATE_DETAILED_DIFF = exports.SCREEN_RECORDING_PERMISSION_REQUEST = void 0;
const dedent_1 = __importDefault(require("dedent"));
exports.SCREEN_RECORDING_PERMISSION_REQUEST = dedent_1.default `
    TestCafe requires permission to record the screen. Open 'System Preferences > Security & Privacy > Privacy > Screen Recording' and check 'TestCafe Browser Tools' in the application list.
    
    Press any key to retry.
`;
exports.FAILED_TO_GENERATE_DETAILED_DIFF = errorMessage => dedent_1.default `
    Failed to generate diff due to an error:
    ${errorMessage}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mb3JtYXRpb24tbWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub3RpZmljYXRpb25zL2luZm9ybWF0aW9uLW1lc3NhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0RBQTRCO0FBR2YsUUFBQSxtQ0FBbUMsR0FBRyxnQkFBTSxDQUFDOzs7O0NBSXpELENBQUM7QUFFVyxRQUFBLGdDQUFnQyxHQUFHLFlBQVksQ0FBQyxFQUFFLENBQUMsZ0JBQU0sQ0FBQzs7TUFFakUsWUFBWTtDQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlZGVudCBmcm9tICdkZWRlbnQnO1xuXG5cbmV4cG9ydCBjb25zdCBTQ1JFRU5fUkVDT1JESU5HX1BFUk1JU1NJT05fUkVRVUVTVCA9IGRlZGVudCBgXG4gICAgVGVzdENhZmUgcmVxdWlyZXMgcGVybWlzc2lvbiB0byByZWNvcmQgdGhlIHNjcmVlbi4gT3BlbiAnU3lzdGVtIFByZWZlcmVuY2VzID4gU2VjdXJpdHkgJiBQcml2YWN5ID4gUHJpdmFjeSA+IFNjcmVlbiBSZWNvcmRpbmcnIGFuZCBjaGVjayAnVGVzdENhZmUgQnJvd3NlciBUb29scycgaW4gdGhlIGFwcGxpY2F0aW9uIGxpc3QuXG4gICAgXG4gICAgUHJlc3MgYW55IGtleSB0byByZXRyeS5cbmA7XG5cbmV4cG9ydCBjb25zdCBGQUlMRURfVE9fR0VORVJBVEVfREVUQUlMRURfRElGRiA9IGVycm9yTWVzc2FnZSA9PiBkZWRlbnQgYFxuICAgIEZhaWxlZCB0byBnZW5lcmF0ZSBkaWZmIGR1ZSB0byBhbiBlcnJvcjpcbiAgICAke2Vycm9yTWVzc2FnZX1cbmA7XG4iXX0=