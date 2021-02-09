"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const lodash_1 = require("lodash");
const internal_modules_prefix_1 = __importDefault(require("./internal-modules-prefix"));
const BABEL = require.resolve('@babel/core');
const BABEL_MODULES_DIR = BABEL.replace(new RegExp(`^(.*${lodash_1.escapeRegExp(path_1.sep)}node_modules${lodash_1.escapeRegExp(path_1.sep)})(.*)`), '$1');
const BABEL_7 = BABEL_MODULES_DIR + '@babel';
const BABEL_RELATED = BABEL_MODULES_DIR + 'babel-';
const REGENERATOR_RUNTIME = BABEL_MODULES_DIR + 'regenerator-runtime' + path_1.sep;
const GENSYNC = BABEL_MODULES_DIR + 'gensync'; // NOTE: @babel/parser uses this module internally.
const TESTCAFE_LIB = path_1.join(__dirname, '../');
const TESTCAFE_BIN = path_1.join(__dirname, '../../bin');
const TESTCAFE_SRC = path_1.join(__dirname, '../../src');
const TESTCAFE_HAMMERHEAD = `${path_1.sep}testcafe-hammerhead${path_1.sep}`;
const SOURCE_MAP_SUPPORT = `${path_1.sep}source-map-support${path_1.sep}`;
const INTERNAL_STARTS_WITH_PATH_SEGMENTS = [
    TESTCAFE_LIB,
    TESTCAFE_BIN,
    TESTCAFE_SRC,
    BABEL_RELATED,
    REGENERATOR_RUNTIME,
    GENSYNC,
    BABEL_7,
    internal_modules_prefix_1.default
];
const INTERNAL_INCLUDES_PATH_SEGMENTS = [
    SOURCE_MAP_SUPPORT,
    TESTCAFE_HAMMERHEAD
];
function isInternalFile(filename = '') {
    return !filename ||
        !filename.includes(path_1.sep) ||
        INTERNAL_INCLUDES_PATH_SEGMENTS.some(pathSegment => filename.includes(pathSegment)) ||
        INTERNAL_STARTS_WITH_PATH_SEGMENTS.some(pathSegment => filename.startsWith(pathSegment));
}
function default_1(frame) {
    // NOTE: filter out the internals of node.js and assertion libraries
    const filename = frame.getFileName();
    return isInternalFile(filename);
}
exports.default = default_1;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtaW50ZXJuYWwtc3RhY2stZnJhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3JzL2lzLWludGVybmFsLXN0YWNrLWZyYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0JBQWlDO0FBQ2pDLG1DQUFrRDtBQUNsRCx3RkFBZ0U7QUFHaEUsTUFBTSxLQUFLLEdBQWlCLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0QsTUFBTSxpQkFBaUIsR0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8scUJBQVEsQ0FBQyxVQUFHLENBQUMsZUFBZSxxQkFBUSxDQUFDLFVBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNySCxNQUFNLE9BQU8sR0FBZSxpQkFBaUIsR0FBRyxRQUFRLENBQUM7QUFDekQsTUFBTSxhQUFhLEdBQVMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDO0FBQ3pELE1BQU0sbUJBQW1CLEdBQUcsaUJBQWlCLEdBQUcscUJBQXFCLEdBQUcsVUFBRyxDQUFDO0FBQzVFLE1BQU0sT0FBTyxHQUFlLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxDQUFDLG1EQUFtRDtBQUM5RyxNQUFNLFlBQVksR0FBVSxXQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ25ELE1BQU0sWUFBWSxHQUFVLFdBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDekQsTUFBTSxZQUFZLEdBQVUsV0FBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN6RCxNQUFNLG1CQUFtQixHQUFHLEdBQUcsVUFBRyxzQkFBc0IsVUFBRyxFQUFFLENBQUM7QUFDOUQsTUFBTSxrQkFBa0IsR0FBSSxHQUFHLFVBQUcscUJBQXFCLFVBQUcsRUFBRSxDQUFDO0FBRTdELE1BQU0sa0NBQWtDLEdBQUc7SUFDdkMsWUFBWTtJQUNaLFlBQVk7SUFDWixZQUFZO0lBQ1osYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixPQUFPO0lBQ1AsT0FBTztJQUNQLGlDQUF1QjtDQUMxQixDQUFDO0FBRUYsTUFBTSwrQkFBK0IsR0FBRztJQUNwQyxrQkFBa0I7SUFDbEIsbUJBQW1CO0NBQ3RCLENBQUM7QUFFRixTQUFTLGNBQWMsQ0FBRSxXQUFtQixFQUFFO0lBQzFDLE9BQU8sQ0FBQyxRQUFRO1FBQ1osQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQUcsQ0FBQztRQUN2QiwrQkFBK0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25GLGtDQUFrQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUNqRyxDQUFDO0FBRUQsbUJBQXlCLEtBQWlCO0lBQ3RDLG9FQUFvRTtJQUNwRSxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFckMsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUxELDRCQUtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2VwLCBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBlc2NhcGVSZWdFeHAgYXMgZXNjYXBlUmUgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IElOVEVSTkFMX01PRFVMRVNfUFJFRklYIGZyb20gJy4vaW50ZXJuYWwtbW9kdWxlcy1wcmVmaXgnO1xuaW1wb3J0IHsgU3RhY2tGcmFtZSB9IGZyb20gJ2Vycm9yLXN0YWNrLXBhcnNlcic7XG5cbmNvbnN0IEJBQkVMICAgICAgICAgICAgICAgPSByZXF1aXJlLnJlc29sdmUoJ0BiYWJlbC9jb3JlJyk7XG5jb25zdCBCQUJFTF9NT0RVTEVTX0RJUiAgID0gQkFCRUwucmVwbGFjZShuZXcgUmVnRXhwKGBeKC4qJHtlc2NhcGVSZShzZXApfW5vZGVfbW9kdWxlcyR7ZXNjYXBlUmUoc2VwKX0pKC4qKWApLCAnJDEnKTtcbmNvbnN0IEJBQkVMXzcgICAgICAgICAgICAgPSBCQUJFTF9NT0RVTEVTX0RJUiArICdAYmFiZWwnO1xuY29uc3QgQkFCRUxfUkVMQVRFRCAgICAgICA9IEJBQkVMX01PRFVMRVNfRElSICsgJ2JhYmVsLSc7XG5jb25zdCBSRUdFTkVSQVRPUl9SVU5USU1FID0gQkFCRUxfTU9EVUxFU19ESVIgKyAncmVnZW5lcmF0b3ItcnVudGltZScgKyBzZXA7XG5jb25zdCBHRU5TWU5DICAgICAgICAgICAgID0gQkFCRUxfTU9EVUxFU19ESVIgKyAnZ2Vuc3luYyc7IC8vIE5PVEU6IEBiYWJlbC9wYXJzZXIgdXNlcyB0aGlzIG1vZHVsZSBpbnRlcm5hbGx5LlxuY29uc3QgVEVTVENBRkVfTElCICAgICAgICA9IGpvaW4oX19kaXJuYW1lLCAnLi4vJyk7XG5jb25zdCBURVNUQ0FGRV9CSU4gICAgICAgID0gam9pbihfX2Rpcm5hbWUsICcuLi8uLi9iaW4nKTtcbmNvbnN0IFRFU1RDQUZFX1NSQyAgICAgICAgPSBqb2luKF9fZGlybmFtZSwgJy4uLy4uL3NyYycpO1xuY29uc3QgVEVTVENBRkVfSEFNTUVSSEVBRCA9IGAke3NlcH10ZXN0Y2FmZS1oYW1tZXJoZWFkJHtzZXB9YDtcbmNvbnN0IFNPVVJDRV9NQVBfU1VQUE9SVCAgPSBgJHtzZXB9c291cmNlLW1hcC1zdXBwb3J0JHtzZXB9YDtcblxuY29uc3QgSU5URVJOQUxfU1RBUlRTX1dJVEhfUEFUSF9TRUdNRU5UUyA9IFtcbiAgICBURVNUQ0FGRV9MSUIsXG4gICAgVEVTVENBRkVfQklOLFxuICAgIFRFU1RDQUZFX1NSQyxcbiAgICBCQUJFTF9SRUxBVEVELFxuICAgIFJFR0VORVJBVE9SX1JVTlRJTUUsXG4gICAgR0VOU1lOQyxcbiAgICBCQUJFTF83LFxuICAgIElOVEVSTkFMX01PRFVMRVNfUFJFRklYXG5dO1xuXG5jb25zdCBJTlRFUk5BTF9JTkNMVURFU19QQVRIX1NFR01FTlRTID0gW1xuICAgIFNPVVJDRV9NQVBfU1VQUE9SVCxcbiAgICBURVNUQ0FGRV9IQU1NRVJIRUFEXG5dO1xuXG5mdW5jdGlvbiBpc0ludGVybmFsRmlsZSAoZmlsZW5hbWU6IHN0cmluZyA9ICcnKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICFmaWxlbmFtZSB8fFxuICAgICAgICAhZmlsZW5hbWUuaW5jbHVkZXMoc2VwKSB8fFxuICAgICAgICBJTlRFUk5BTF9JTkNMVURFU19QQVRIX1NFR01FTlRTLnNvbWUocGF0aFNlZ21lbnQgPT4gZmlsZW5hbWUuaW5jbHVkZXMocGF0aFNlZ21lbnQpKSB8fFxuICAgICAgICBJTlRFUk5BTF9TVEFSVFNfV0lUSF9QQVRIX1NFR01FTlRTLnNvbWUocGF0aFNlZ21lbnQgPT4gZmlsZW5hbWUuc3RhcnRzV2l0aChwYXRoU2VnbWVudCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZnJhbWU6IFN0YWNrRnJhbWUpOiBib29sZWFuIHtcbiAgICAvLyBOT1RFOiBmaWx0ZXIgb3V0IHRoZSBpbnRlcm5hbHMgb2Ygbm9kZS5qcyBhbmQgYXNzZXJ0aW9uIGxpYnJhcmllc1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZnJhbWUuZ2V0RmlsZU5hbWUoKTtcblxuICAgIHJldHVybiBpc0ludGVybmFsRmlsZShmaWxlbmFtZSk7XG59XG4iXX0=