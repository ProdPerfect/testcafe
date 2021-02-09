"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_script_1 = __importDefault(require("./client-script"));
function createScripts(scriptInits, basePath) {
    return scriptInits.map(scriptInit => new client_script_1.default(scriptInit, basePath));
}
async function default_1(scriptInits, basePath) {
    const scripts = createScripts(scriptInits, basePath || process.cwd());
    await Promise.all(scripts.map(script => script.load()));
    return scripts;
}
exports.default = default_1;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jdXN0b20tY2xpZW50LXNjcmlwdHMvbG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUEyQztBQUczQyxTQUFTLGFBQWEsQ0FBRSxXQUEwQyxFQUFFLFFBQWdCO0lBQ2hGLE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksdUJBQVksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNqRixDQUFDO0FBRWMsS0FBSyxvQkFBVyxXQUEwQyxFQUFFLFFBQWlCO0lBQ3hGLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBRXRFLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV4RCxPQUFPLE9BQU8sQ0FBQztBQUNuQixDQUFDO0FBTkQsNEJBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50U2NyaXB0IGZyb20gJy4vY2xpZW50LXNjcmlwdCc7XG5pbXBvcnQgQ2xpZW50U2NyaXB0SW5pdCBmcm9tICcuL2NsaWVudC1zY3JpcHQtaW5pdCc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNjcmlwdHMgKHNjcmlwdEluaXRzOiAoc3RyaW5nIHwgQ2xpZW50U2NyaXB0SW5pdClbXSwgYmFzZVBhdGg6IHN0cmluZyk6IENsaWVudFNjcmlwdFtdIHtcbiAgICByZXR1cm4gc2NyaXB0SW5pdHMubWFwKHNjcmlwdEluaXQgPT4gbmV3IENsaWVudFNjcmlwdChzY3JpcHRJbml0LCBiYXNlUGF0aCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAoc2NyaXB0SW5pdHM6IChzdHJpbmcgfCBDbGllbnRTY3JpcHRJbml0KVtdLCBiYXNlUGF0aD86IHN0cmluZyk6IFByb21pc2U8Q2xpZW50U2NyaXB0W10+IHtcbiAgICBjb25zdCBzY3JpcHRzID0gY3JlYXRlU2NyaXB0cyhzY3JpcHRJbml0cywgYmFzZVBhdGggfHwgcHJvY2Vzcy5jd2QoKSk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChzY3JpcHRzLm1hcChzY3JpcHQgPT4gc2NyaXB0LmxvYWQoKSkpO1xuXG4gICAgcmV0dXJuIHNjcmlwdHM7XG59XG4iXX0=