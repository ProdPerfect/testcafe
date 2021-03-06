"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const os_family_1 = __importDefault(require("os-family"));
const runtime_1 = require("../errors/runtime");
const types_1 = require("../errors/types");
const testcafe_hammerhead_1 = require("testcafe-hammerhead");
const PROTOCOL_RE = /^([\w-]+?)(?=:\/\/)/;
const SUPPORTED_PROTOCOL_RE = /^(https?|file):/;
const IMPLICIT_PROTOCOL_RE = /^\/\//;
const ABSOLUTE_PATH_RE = /^\/[^/]/;
const WIN_ABSOLUTE_PATH_RE = /^\w:[/\\]/;
const RELATIVE_PATH_RE = /^\.\.?[/\\]/;
function isAbsolutePath(url) {
    return os_family_1.default.win ? WIN_ABSOLUTE_PATH_RE.test(url) : ABSOLUTE_PATH_RE.test(url);
}
function resolveFileUrl(url, testFileName) {
    const testFileDir = path_1.default.dirname(testFileName);
    if (RELATIVE_PATH_RE.test(url))
        url = path_1.default.join(testFileDir, url);
    return 'file://' + url;
}
function assertUrl(url, callsiteName) {
    const protocol = url.match(PROTOCOL_RE);
    const hasUnsupportedProtocol = protocol && !SUPPORTED_PROTOCOL_RE.test(url);
    const isWinAbsolutePath = os_family_1.default.win && WIN_ABSOLUTE_PATH_RE.test(url);
    if (hasUnsupportedProtocol && !isWinAbsolutePath && url !== testcafe_hammerhead_1.SPECIAL_BLANK_PAGE)
        throw new runtime_1.APIError(callsiteName, types_1.RUNTIME_ERRORS.unsupportedUrlProtocol, url, protocol[0]);
}
exports.assertUrl = assertUrl;
function resolvePageUrl(url, testFileName) {
    if (SUPPORTED_PROTOCOL_RE.test(url) || url === testcafe_hammerhead_1.SPECIAL_BLANK_PAGE)
        return url;
    if (isAbsolutePath(url) || RELATIVE_PATH_RE.test(url))
        return resolveFileUrl(url, testFileName);
    const protocol = IMPLICIT_PROTOCOL_RE.test(url) ? 'http:' : 'http://';
    return protocol + url;
}
exports.resolvePageUrl = resolvePageUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1wYWdlLXVybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvdGVzdC1wYWdlLXVybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4QiwwREFBMkI7QUFDM0IsK0NBQTZDO0FBQzdDLDJDQUFpRDtBQUNqRCw2REFBeUQ7QUFFekQsTUFBTSxXQUFXLEdBQWEscUJBQXFCLENBQUM7QUFDcEQsTUFBTSxxQkFBcUIsR0FBRyxpQkFBaUIsQ0FBQztBQUNoRCxNQUFNLG9CQUFvQixHQUFJLE9BQU8sQ0FBQztBQUN0QyxNQUFNLGdCQUFnQixHQUFRLFNBQVMsQ0FBQztBQUN4QyxNQUFNLG9CQUFvQixHQUFJLFdBQVcsQ0FBQztBQUMxQyxNQUFNLGdCQUFnQixHQUFRLGFBQWEsQ0FBQztBQUc1QyxTQUFTLGNBQWMsQ0FBRSxHQUFHO0lBQ3hCLE9BQU8sbUJBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBRSxHQUFHLEVBQUUsWUFBWTtJQUN0QyxNQUFNLFdBQVcsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRS9DLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUMxQixHQUFHLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFdEMsT0FBTyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQzNCLENBQUM7QUFFRCxTQUFnQixTQUFTLENBQUUsR0FBRyxFQUFFLFlBQVk7SUFDeEMsTUFBTSxRQUFRLEdBQWlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEQsTUFBTSxzQkFBc0IsR0FBRyxRQUFRLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUUsTUFBTSxpQkFBaUIsR0FBUSxtQkFBRSxDQUFDLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFeEUsSUFBSSxzQkFBc0IsSUFBSSxDQUFDLGlCQUFpQixJQUFJLEdBQUcsS0FBSyx3Q0FBa0I7UUFDMUUsTUFBTSxJQUFJLGtCQUFRLENBQUMsWUFBWSxFQUFFLHNCQUFjLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xHLENBQUM7QUFQRCw4QkFPQztBQUVELFNBQWdCLGNBQWMsQ0FBRSxHQUFHLEVBQUUsWUFBWTtJQUM3QyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssd0NBQWtCO1FBQzdELE9BQU8sR0FBRyxDQUFDO0lBRWYsSUFBSSxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNqRCxPQUFPLGNBQWMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFN0MsTUFBTSxRQUFRLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUV0RSxPQUFPLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDMUIsQ0FBQztBQVZELHdDQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgT1MgZnJvbSAnb3MtZmFtaWx5JztcbmltcG9ydCB7IEFQSUVycm9yIH0gZnJvbSAnLi4vZXJyb3JzL3J1bnRpbWUnO1xuaW1wb3J0IHsgUlVOVElNRV9FUlJPUlMgfSBmcm9tICcuLi9lcnJvcnMvdHlwZXMnO1xuaW1wb3J0IHsgU1BFQ0lBTF9CTEFOS19QQUdFIH0gZnJvbSAndGVzdGNhZmUtaGFtbWVyaGVhZCc7XG5cbmNvbnN0IFBST1RPQ09MX1JFICAgICAgICAgICA9IC9eKFtcXHctXSs/KSg/PTpcXC9cXC8pLztcbmNvbnN0IFNVUFBPUlRFRF9QUk9UT0NPTF9SRSA9IC9eKGh0dHBzP3xmaWxlKTovO1xuY29uc3QgSU1QTElDSVRfUFJPVE9DT0xfUkUgID0gL15cXC9cXC8vO1xuY29uc3QgQUJTT0xVVEVfUEFUSF9SRSAgICAgID0gL15cXC9bXi9dLztcbmNvbnN0IFdJTl9BQlNPTFVURV9QQVRIX1JFICA9IC9eXFx3OlsvXFxcXF0vO1xuY29uc3QgUkVMQVRJVkVfUEFUSF9SRSAgICAgID0gL15cXC5cXC4/Wy9cXFxcXS87XG5cblxuZnVuY3Rpb24gaXNBYnNvbHV0ZVBhdGggKHVybCkge1xuICAgIHJldHVybiBPUy53aW4gPyBXSU5fQUJTT0xVVEVfUEFUSF9SRS50ZXN0KHVybCkgOiBBQlNPTFVURV9QQVRIX1JFLnRlc3QodXJsKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUZpbGVVcmwgKHVybCwgdGVzdEZpbGVOYW1lKSB7XG4gICAgY29uc3QgdGVzdEZpbGVEaXIgPSBwYXRoLmRpcm5hbWUodGVzdEZpbGVOYW1lKTtcblxuICAgIGlmIChSRUxBVElWRV9QQVRIX1JFLnRlc3QodXJsKSlcbiAgICAgICAgdXJsID0gcGF0aC5qb2luKHRlc3RGaWxlRGlyLCB1cmwpO1xuXG4gICAgcmV0dXJuICdmaWxlOi8vJyArIHVybDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFVybCAodXJsLCBjYWxsc2l0ZU5hbWUpIHtcbiAgICBjb25zdCBwcm90b2NvbCAgICAgICAgICAgICAgID0gdXJsLm1hdGNoKFBST1RPQ09MX1JFKTtcbiAgICBjb25zdCBoYXNVbnN1cHBvcnRlZFByb3RvY29sID0gcHJvdG9jb2wgJiYgIVNVUFBPUlRFRF9QUk9UT0NPTF9SRS50ZXN0KHVybCk7XG4gICAgY29uc3QgaXNXaW5BYnNvbHV0ZVBhdGggICAgICA9IE9TLndpbiAmJiBXSU5fQUJTT0xVVEVfUEFUSF9SRS50ZXN0KHVybCk7XG5cbiAgICBpZiAoaGFzVW5zdXBwb3J0ZWRQcm90b2NvbCAmJiAhaXNXaW5BYnNvbHV0ZVBhdGggJiYgdXJsICE9PSBTUEVDSUFMX0JMQU5LX1BBR0UpXG4gICAgICAgIHRocm93IG5ldyBBUElFcnJvcihjYWxsc2l0ZU5hbWUsIFJVTlRJTUVfRVJST1JTLnVuc3VwcG9ydGVkVXJsUHJvdG9jb2wsIHVybCwgcHJvdG9jb2xbMF0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVBhZ2VVcmwgKHVybCwgdGVzdEZpbGVOYW1lKSB7XG4gICAgaWYgKFNVUFBPUlRFRF9QUk9UT0NPTF9SRS50ZXN0KHVybCkgfHwgdXJsID09PSBTUEVDSUFMX0JMQU5LX1BBR0UpXG4gICAgICAgIHJldHVybiB1cmw7XG5cbiAgICBpZiAoaXNBYnNvbHV0ZVBhdGgodXJsKSB8fCBSRUxBVElWRV9QQVRIX1JFLnRlc3QodXJsKSlcbiAgICAgICAgcmV0dXJuIHJlc29sdmVGaWxlVXJsKHVybCwgdGVzdEZpbGVOYW1lKTtcblxuICAgIGNvbnN0IHByb3RvY29sID0gSU1QTElDSVRfUFJPVE9DT0xfUkUudGVzdCh1cmwpID8gJ2h0dHA6JyA6ICdodHRwOi8vJztcblxuICAgIHJldHVybiBwcm90b2NvbCArIHVybDtcbn1cbiJdfQ==