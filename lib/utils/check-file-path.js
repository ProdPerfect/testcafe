"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const os_family_1 = require("os-family");
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const SAFE_CHAR = '_';
const ALLOWED_CHARS_LIST = [path_1.default.win32.sep, path_1.default.posix.sep, '.', '..'];
function correctForbiddenCharsList(forbiddenCharsList, filePath) {
    const isWinAbsolutePath = os_family_1.win && path_1.default.isAbsolute(filePath);
    const hasDriveSeparatorInList = forbiddenCharsList.length && forbiddenCharsList[0].chars === ':' && forbiddenCharsList[0].index === 1;
    if (isWinAbsolutePath && hasDriveSeparatorInList)
        forbiddenCharsList.shift();
}
function addForbiddenCharsToList(forbiddenCharsList, forbiddenCharsInfo) {
    const { chars } = forbiddenCharsInfo;
    if (!ALLOWED_CHARS_LIST.includes(chars))
        forbiddenCharsList.push(forbiddenCharsInfo);
    return SAFE_CHAR.repeat(chars.length);
}
function default_1(filePath) {
    const forbiddenCharsList = [];
    sanitize_filename_1.default(filePath, {
        replacement: (chars, index) => addForbiddenCharsToList(forbiddenCharsList, { chars, index })
    });
    correctForbiddenCharsList(forbiddenCharsList, filePath);
    return forbiddenCharsList;
}
exports.default = default_1;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stZmlsZS1wYXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2NoZWNrLWZpbGUtcGF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4Qix5Q0FBeUM7QUFDekMsMEVBQWlEO0FBR2pELE1BQU0sU0FBUyxHQUFZLEdBQUcsQ0FBQztBQUMvQixNQUFNLGtCQUFrQixHQUFHLENBQUMsY0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsY0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBR3ZFLFNBQVMseUJBQXlCLENBQUUsa0JBQWtCLEVBQUUsUUFBUTtJQUM1RCxNQUFNLGlCQUFpQixHQUFTLGVBQUssSUFBSSxjQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sdUJBQXVCLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxJQUFJLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLElBQUksa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztJQUV0SSxJQUFJLGlCQUFpQixJQUFJLHVCQUF1QjtRQUM1QyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNuQyxDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBRSxrQkFBa0IsRUFBRSxrQkFBa0I7SUFDcEUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLGtCQUFrQixDQUFDO0lBRXJDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ25DLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRWhELE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUVELG1CQUF5QixRQUFRO0lBQzdCLE1BQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0lBRTlCLDJCQUFnQixDQUFDLFFBQVEsRUFBRTtRQUN2QixXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztLQUMvRixDQUFDLENBQUM7SUFFSCx5QkFBeUIsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUV4RCxPQUFPLGtCQUFrQixDQUFDO0FBQzlCLENBQUM7QUFWRCw0QkFVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgd2luIGFzIGlzV2luIH0gZnJvbSAnb3MtZmFtaWx5JztcbmltcG9ydCBzYW5pdGl6ZUZpbGVuYW1lIGZyb20gJ3Nhbml0aXplLWZpbGVuYW1lJztcblxuXG5jb25zdCBTQUZFX0NIQVIgICAgICAgICAgPSAnXyc7XG5jb25zdCBBTExPV0VEX0NIQVJTX0xJU1QgPSBbcGF0aC53aW4zMi5zZXAsIHBhdGgucG9zaXguc2VwLCAnLicsICcuLiddO1xuXG5cbmZ1bmN0aW9uIGNvcnJlY3RGb3JiaWRkZW5DaGFyc0xpc3QgKGZvcmJpZGRlbkNoYXJzTGlzdCwgZmlsZVBhdGgpIHtcbiAgICBjb25zdCBpc1dpbkFic29sdXRlUGF0aCAgICAgICA9IGlzV2luICYmIHBhdGguaXNBYnNvbHV0ZShmaWxlUGF0aCk7XG4gICAgY29uc3QgaGFzRHJpdmVTZXBhcmF0b3JJbkxpc3QgPSBmb3JiaWRkZW5DaGFyc0xpc3QubGVuZ3RoICYmIGZvcmJpZGRlbkNoYXJzTGlzdFswXS5jaGFycyA9PT0gJzonICYmIGZvcmJpZGRlbkNoYXJzTGlzdFswXS5pbmRleCA9PT0gMTtcblxuICAgIGlmIChpc1dpbkFic29sdXRlUGF0aCAmJiBoYXNEcml2ZVNlcGFyYXRvckluTGlzdClcbiAgICAgICAgZm9yYmlkZGVuQ2hhcnNMaXN0LnNoaWZ0KCk7XG59XG5cbmZ1bmN0aW9uIGFkZEZvcmJpZGRlbkNoYXJzVG9MaXN0IChmb3JiaWRkZW5DaGFyc0xpc3QsIGZvcmJpZGRlbkNoYXJzSW5mbykge1xuICAgIGNvbnN0IHsgY2hhcnMgfSA9IGZvcmJpZGRlbkNoYXJzSW5mbztcblxuICAgIGlmICghQUxMT1dFRF9DSEFSU19MSVNULmluY2x1ZGVzKGNoYXJzKSlcbiAgICAgICAgZm9yYmlkZGVuQ2hhcnNMaXN0LnB1c2goZm9yYmlkZGVuQ2hhcnNJbmZvKTtcblxuICAgIHJldHVybiBTQUZFX0NIQVIucmVwZWF0KGNoYXJzLmxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGZvcmJpZGRlbkNoYXJzTGlzdCA9IFtdO1xuXG4gICAgc2FuaXRpemVGaWxlbmFtZShmaWxlUGF0aCwge1xuICAgICAgICByZXBsYWNlbWVudDogKGNoYXJzLCBpbmRleCkgPT4gYWRkRm9yYmlkZGVuQ2hhcnNUb0xpc3QoZm9yYmlkZGVuQ2hhcnNMaXN0LCB7IGNoYXJzLCBpbmRleCB9KVxuICAgIH0pO1xuXG4gICAgY29ycmVjdEZvcmJpZGRlbkNoYXJzTGlzdChmb3JiaWRkZW5DaGFyc0xpc3QsIGZpbGVQYXRoKTtcblxuICAgIHJldHVybiBmb3JiaWRkZW5DaGFyc0xpc3Q7XG59XG4iXX0=