"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function getCommonPathFragmentsCount(fragmentedPath1, fragmentedPath2) {
    const maxCommonPathFragmentsCount = Math.min(fragmentedPath1.length, fragmentedPath2.length);
    let commonPathFragmentsIndex = 0;
    while (commonPathFragmentsIndex < maxCommonPathFragmentsCount) {
        if (fragmentedPath1[commonPathFragmentsIndex] !== fragmentedPath2[commonPathFragmentsIndex])
            break;
        commonPathFragmentsIndex++;
    }
    return commonPathFragmentsIndex;
}
function getCommonPathFragments(fragmentedPaths) {
    const lastFragmentedPath = fragmentedPaths.pop();
    const commonPathFragmentsCounts = fragmentedPaths
        .map(fragmentedPath => getCommonPathFragmentsCount(fragmentedPath, lastFragmentedPath));
    return lastFragmentedPath.splice(0, Math.min(...commonPathFragmentsCounts));
}
function default_1(paths) {
    if (!paths)
        return null;
    if (paths.length === 1)
        return paths[0];
    const fragmentedPaths = paths.map(item => item.split(path_1.default.sep));
    const commonPathFragments = getCommonPathFragments(fragmentedPaths);
    if (!commonPathFragments.length)
        return null;
    return commonPathFragments.join(path_1.default.sep);
}
exports.default = default_1;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWNvbW1vbi1wYXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2dldC1jb21tb24tcGF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUd4QixTQUFTLDJCQUEyQixDQUFFLGVBQWUsRUFBRSxlQUFlO0lBQ2xFLE1BQU0sMkJBQTJCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU3RixJQUFJLHdCQUF3QixHQUFHLENBQUMsQ0FBQztJQUVqQyxPQUFPLHdCQUF3QixHQUFHLDJCQUEyQixFQUFFO1FBQzNELElBQUksZUFBZSxDQUFDLHdCQUF3QixDQUFDLEtBQUssZUFBZSxDQUFDLHdCQUF3QixDQUFDO1lBQ3ZGLE1BQU07UUFFVix3QkFBd0IsRUFBRSxDQUFDO0tBQzlCO0lBRUQsT0FBTyx3QkFBd0IsQ0FBQztBQUNwQyxDQUFDO0FBRUQsU0FBUyxzQkFBc0IsQ0FBRSxlQUFlO0lBQzVDLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRWpELE1BQU0seUJBQXlCLEdBQUcsZUFBZTtTQUM1QyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBRTVGLE9BQU8sa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFFRCxtQkFBeUIsS0FBSztJQUMxQixJQUFJLENBQUMsS0FBSztRQUNOLE9BQU8sSUFBSSxDQUFDO0lBRWhCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQ2xCLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXBCLE1BQU0sZUFBZSxHQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sbUJBQW1CLEdBQUcsc0JBQXNCLENBQUMsZUFBZSxDQUFDLENBQUM7SUFHcEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU07UUFDM0IsT0FBTyxJQUFJLENBQUM7SUFFaEIsT0FBTyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFmRCw0QkFlQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5cbmZ1bmN0aW9uIGdldENvbW1vblBhdGhGcmFnbWVudHNDb3VudCAoZnJhZ21lbnRlZFBhdGgxLCBmcmFnbWVudGVkUGF0aDIpIHtcbiAgICBjb25zdCBtYXhDb21tb25QYXRoRnJhZ21lbnRzQ291bnQgPSBNYXRoLm1pbihmcmFnbWVudGVkUGF0aDEubGVuZ3RoLCBmcmFnbWVudGVkUGF0aDIubGVuZ3RoKTtcblxuICAgIGxldCBjb21tb25QYXRoRnJhZ21lbnRzSW5kZXggPSAwO1xuXG4gICAgd2hpbGUgKGNvbW1vblBhdGhGcmFnbWVudHNJbmRleCA8IG1heENvbW1vblBhdGhGcmFnbWVudHNDb3VudCkge1xuICAgICAgICBpZiAoZnJhZ21lbnRlZFBhdGgxW2NvbW1vblBhdGhGcmFnbWVudHNJbmRleF0gIT09IGZyYWdtZW50ZWRQYXRoMltjb21tb25QYXRoRnJhZ21lbnRzSW5kZXhdKVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY29tbW9uUGF0aEZyYWdtZW50c0luZGV4Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbW1vblBhdGhGcmFnbWVudHNJbmRleDtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tbW9uUGF0aEZyYWdtZW50cyAoZnJhZ21lbnRlZFBhdGhzKSB7XG4gICAgY29uc3QgbGFzdEZyYWdtZW50ZWRQYXRoID0gZnJhZ21lbnRlZFBhdGhzLnBvcCgpO1xuXG4gICAgY29uc3QgY29tbW9uUGF0aEZyYWdtZW50c0NvdW50cyA9IGZyYWdtZW50ZWRQYXRoc1xuICAgICAgICAubWFwKGZyYWdtZW50ZWRQYXRoID0+IGdldENvbW1vblBhdGhGcmFnbWVudHNDb3VudChmcmFnbWVudGVkUGF0aCwgbGFzdEZyYWdtZW50ZWRQYXRoKSk7XG5cbiAgICByZXR1cm4gbGFzdEZyYWdtZW50ZWRQYXRoLnNwbGljZSgwLCBNYXRoLm1pbiguLi5jb21tb25QYXRoRnJhZ21lbnRzQ291bnRzKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwYXRocykge1xuICAgIGlmICghcGF0aHMpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgcmV0dXJuIHBhdGhzWzBdO1xuXG4gICAgY29uc3QgZnJhZ21lbnRlZFBhdGhzICAgICA9IHBhdGhzLm1hcChpdGVtID0+IGl0ZW0uc3BsaXQocGF0aC5zZXApKTtcbiAgICBjb25zdCBjb21tb25QYXRoRnJhZ21lbnRzID0gZ2V0Q29tbW9uUGF0aEZyYWdtZW50cyhmcmFnbWVudGVkUGF0aHMpO1xuXG5cbiAgICBpZiAoIWNvbW1vblBhdGhGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBjb21tb25QYXRoRnJhZ21lbnRzLmpvaW4ocGF0aC5zZXApO1xufVxuIl19