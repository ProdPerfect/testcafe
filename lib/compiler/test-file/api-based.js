"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const strip_bom_1 = __importDefault(require("strip-bom"));
const base_1 = __importDefault(require("./base"));
const test_file_1 = __importDefault(require("../../api/structure/test-file"));
const fixture_1 = __importDefault(require("../../api/structure/fixture"));
const test_1 = __importDefault(require("../../api/structure/test"));
const runtime_1 = require("../../errors/runtime");
const stack_cleaning_hook_1 = __importDefault(require("../../errors/stack-cleaning-hook"));
const node_modules_folder_name_1 = __importDefault(require("../../shared/node-modules-folder-name"));
const CWD = process.cwd();
const FIXTURE_RE = /(^|;|\s+)fixture\s*(\.|\(|`)/;
const TEST_RE = /(^|;|\s+)test\s*(\.|\()/;
const Module = module.constructor;
class APIBasedTestFileCompilerBase extends base_1.default {
    constructor() {
        super();
        this.cache = Object.create(null);
        this.origRequireExtensions = Object.create(null);
    }
    static _getNodeModulesLookupPath(filename) {
        const dir = path_1.dirname(filename);
        return Module._nodeModulePaths(dir);
    }
    static _isNodeModulesDep(filename) {
        return path_1.relative(CWD, filename)
            .split(path_1.sep)
            .includes(node_modules_folder_name_1.default);
    }
    static _execAsModule(code, filename) {
        const mod = new Module(filename, module.parent);
        mod.filename = filename;
        mod.paths = APIBasedTestFileCompilerBase._getNodeModulesLookupPath(filename);
        mod._compile(code, filename);
    }
    _compileCode(code, filename) {
        if (this.canPrecompile)
            return this._precompileCode([{ code, filename }])[0];
        throw new Error('Not implemented');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _precompileCode(testFilesInfo) {
        throw new Error('Not implemented');
    }
    _getRequireCompilers() {
        throw new Error('Not implemented');
    }
    _setupRequireHook(testFile) {
        const requireCompilers = this._getRequireCompilers();
        this.origRequireExtensions = Object.create(null);
        Object.keys(requireCompilers).forEach(ext => {
            const origExt = require.extensions[ext];
            this.origRequireExtensions[ext] = origExt;
            require.extensions[ext] = (mod, filename) => {
                // NOTE: remove global API so that it will be unavailable for the dependencies
                this._removeGlobalAPI();
                if (APIBasedTestFileCompilerBase._isNodeModulesDep(filename) && origExt)
                    origExt(mod, filename);
                else {
                    const code = fs_1.readFileSync(filename).toString();
                    const compiledCode = requireCompilers[ext](strip_bom_1.default(code), filename);
                    mod.paths = APIBasedTestFileCompilerBase._getNodeModulesLookupPath(filename);
                    mod._compile(compiledCode, filename);
                }
                this._addGlobalAPI(testFile);
            };
        });
    }
    _removeRequireHook() {
        Object.keys(this.origRequireExtensions).forEach(ext => {
            require.extensions[ext] = this.origRequireExtensions[ext];
        });
    }
    _compileCodeForTestFiles(testFilesInfo) {
        stack_cleaning_hook_1.default.enabled = true;
        try {
            if (this.canPrecompile)
                return this._precompileCode(testFilesInfo);
            return testFilesInfo.map(({ code, filename }) => this._compileCode(code, filename));
        }
        catch (err) {
            throw new runtime_1.TestCompilationError(stack_cleaning_hook_1.default.cleanError(err));
        }
        finally {
            stack_cleaning_hook_1.default.enabled = false;
        }
    }
    _addGlobalAPI(testFile) {
        Object.defineProperty(global, 'fixture', {
            get: () => new fixture_1.default(testFile),
            configurable: true
        });
        Object.defineProperty(global, 'test', {
            get: () => new test_1.default(testFile),
            configurable: true
        });
    }
    _removeGlobalAPI() {
        delete global.fixture;
        delete global.test;
    }
    _runCompiledCode(compiledCode, filename) {
        const testFile = new test_file_1.default(filename);
        this._addGlobalAPI(testFile);
        stack_cleaning_hook_1.default.enabled = true;
        this._setupRequireHook(testFile);
        try {
            APIBasedTestFileCompilerBase._execAsModule(compiledCode, filename);
        }
        catch (err) {
            if (!(err instanceof runtime_1.APIError))
                throw new runtime_1.TestCompilationError(stack_cleaning_hook_1.default.cleanError(err));
            throw err;
        }
        finally {
            this._removeRequireHook();
            stack_cleaning_hook_1.default.enabled = false;
            this._removeGlobalAPI();
        }
        return testFile.getTests();
    }
    precompile(testFilesInfo) {
        return this._compileCodeForTestFiles(testFilesInfo);
    }
    execute(compiledCode, filename) {
        return this._runCompiledCode(compiledCode, filename);
    }
    async compile(code, filename) {
        const [compiledCode] = await this.precompile([{ code, filename }]);
        if (compiledCode)
            return this.execute(compiledCode, filename);
        return Promise.resolve();
    }
    _hasTests(code) {
        return FIXTURE_RE.test(code) && TEST_RE.test(code);
    }
    cleanUp() {
        this.cache = {};
    }
}
exports.default = APIBasedTestFileCompilerBase;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWJhc2VkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGVyL3Rlc3QtZmlsZS9hcGktYmFzZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrQkFJYztBQUVkLDJCQUFrQztBQUNsQywwREFBaUM7QUFDakMsa0RBQTBDO0FBQzFDLDhFQUFxRDtBQUNyRCwwRUFBa0Q7QUFDbEQsb0VBQTRDO0FBQzVDLGtEQUFzRTtBQUN0RSwyRkFBaUU7QUFDakUscUdBQWlFO0FBRWpFLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLFVBQVUsR0FBRyw4QkFBOEIsQ0FBQztBQUNsRCxNQUFNLE9BQU8sR0FBTSx5QkFBeUIsQ0FBQztBQUU3QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBRWxDLE1BQXFCLDRCQUE2QixTQUFRLGNBQW9CO0lBQzFFO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsS0FBSyxHQUFtQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxNQUFNLENBQUMseUJBQXlCLENBQUUsUUFBUTtRQUN0QyxNQUFNLEdBQUcsR0FBRyxjQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFOUIsT0FBTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBRSxRQUFRO1FBQzlCLE9BQU8sZUFBUSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUM7YUFDekIsS0FBSyxDQUFDLFVBQU8sQ0FBQzthQUNkLFFBQVEsQ0FBQyxrQ0FBWSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELE1BQU0sQ0FB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Q0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsT0FBTztRQUNILElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQXpLRCwrQ0F5S0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIGRpcm5hbWUsXG4gICAgcmVsYXRpdmUsXG4gICAgc2VwIGFzIHBhdGhTZXBcbn0gZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCBzdHJpcEJvbSBmcm9tICdzdHJpcC1ib20nO1xuaW1wb3J0IFRlc3RGaWxlQ29tcGlsZXJCYXNlIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgVGVzdEZpbGUgZnJvbSAnLi4vLi4vYXBpL3N0cnVjdHVyZS90ZXN0LWZpbGUnO1xuaW1wb3J0IEZpeHR1cmUgZnJvbSAnLi4vLi4vYXBpL3N0cnVjdHVyZS9maXh0dXJlJztcbmltcG9ydCBUZXN0IGZyb20gJy4uLy4uL2FwaS9zdHJ1Y3R1cmUvdGVzdCc7XG5pbXBvcnQgeyBUZXN0Q29tcGlsYXRpb25FcnJvciwgQVBJRXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgc3RhY2tDbGVhbmluZ0hvb2sgZnJvbSAnLi4vLi4vZXJyb3JzL3N0YWNrLWNsZWFuaW5nLWhvb2snO1xuaW1wb3J0IE5PREVfTU9EVUxFUyBmcm9tICcuLi8uLi9zaGFyZWQvbm9kZS1tb2R1bGVzLWZvbGRlci1uYW1lJztcblxuY29uc3QgQ1dEID0gcHJvY2Vzcy5jd2QoKTtcblxuY29uc3QgRklYVFVSRV9SRSA9IC8oXnw7fFxccyspZml4dHVyZVxccyooXFwufFxcKHxgKS87XG5jb25zdCBURVNUX1JFICAgID0gLyhefDt8XFxzKyl0ZXN0XFxzKihcXC58XFwoKS87XG5cbmNvbnN0IE1vZHVsZSA9IG1vZHVsZS5jb25zdHJ1Y3RvcjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVBJQmFzZWRUZXN0RmlsZUNvbXBpbGVyQmFzZSBleHRlbmRzIFRlc3RGaWxlQ29tcGlsZXJCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5jYWNoZSAgICAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLm9yaWdSZXF1aXJlRXh0ZW5zaW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuXG4gICAgc3RhdGljIF9nZXROb2RlTW9kdWxlc0xvb2t1cFBhdGggKGZpbGVuYW1lKSB7XG4gICAgICAgIGNvbnN0IGRpciA9IGRpcm5hbWUoZmlsZW5hbWUpO1xuXG4gICAgICAgIHJldHVybiBNb2R1bGUuX25vZGVNb2R1bGVQYXRocyhkaXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfaXNOb2RlTW9kdWxlc0RlcCAoZmlsZW5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0aXZlKENXRCwgZmlsZW5hbWUpXG4gICAgICAgICAgICAuc3BsaXQocGF0aFNlcClcbiAgICAgICAgICAgIC5pbmNsdWRlcyhOT0RFX01PRFVMRVMpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZXhlY0FzTW9kdWxlIChjb2RlLCBmaWxlbmFtZSkge1xuICAgICAgICBjb25zdCBtb2QgPSBuZXcgTW9kdWxlKGZpbGVuYW1lLCBtb2R1bGUucGFyZW50KTtcblxuICAgICAgICBtb2QuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbiAgICAgICAgbW9kLnBhdGhzICAgID0gQVBJQmFzZWRUZXN0RmlsZUNvbXBpbGVyQmFzZS5fZ2V0Tm9kZU1vZHVsZXNMb29rdXBQYXRoKGZpbGVuYW1lKTtcblxuICAgICAgICBtb2QuX2NvbXBpbGUoY29kZSwgZmlsZW5hbWUpO1xuICAgIH1cblxuICAgIF9jb21waWxlQ29kZSAoY29kZSwgZmlsZW5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuUHJlY29tcGlsZSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcmVjb21waWxlQ29kZShbeyBjb2RlLCBmaWxlbmFtZSB9XSlbMF07XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgX3ByZWNvbXBpbGVDb2RlICh0ZXN0RmlsZXNJbmZvKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gICAgfVxuXG4gICAgX2dldFJlcXVpcmVDb21waWxlcnMgKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIF9zZXR1cFJlcXVpcmVIb29rICh0ZXN0RmlsZSkge1xuICAgICAgICBjb25zdCByZXF1aXJlQ29tcGlsZXJzID0gdGhpcy5fZ2V0UmVxdWlyZUNvbXBpbGVycygpO1xuXG4gICAgICAgIHRoaXMub3JpZ1JlcXVpcmVFeHRlbnNpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgICAgICBPYmplY3Qua2V5cyhyZXF1aXJlQ29tcGlsZXJzKS5mb3JFYWNoKGV4dCA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnRXh0ID0gcmVxdWlyZS5leHRlbnNpb25zW2V4dF07XG5cbiAgICAgICAgICAgIHRoaXMub3JpZ1JlcXVpcmVFeHRlbnNpb25zW2V4dF0gPSBvcmlnRXh0O1xuXG4gICAgICAgICAgICByZXF1aXJlLmV4dGVuc2lvbnNbZXh0XSA9IChtb2QsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gTk9URTogcmVtb3ZlIGdsb2JhbCBBUEkgc28gdGhhdCBpdCB3aWxsIGJlIHVuYXZhaWxhYmxlIGZvciB0aGUgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlR2xvYmFsQVBJKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoQVBJQmFzZWRUZXN0RmlsZUNvbXBpbGVyQmFzZS5faXNOb2RlTW9kdWxlc0RlcChmaWxlbmFtZSkgJiYgb3JpZ0V4dClcbiAgICAgICAgICAgICAgICAgICAgb3JpZ0V4dChtb2QsIGZpbGVuYW1lKTtcblxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2RlICAgICAgICAgPSByZWFkRmlsZVN5bmMoZmlsZW5hbWUpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBpbGVkQ29kZSA9IHJlcXVpcmVDb21waWxlcnNbZXh0XShzdHJpcEJvbShjb2RlKSwgZmlsZW5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIG1vZC5wYXRocyA9IEFQSUJhc2VkVGVzdEZpbGVDb21waWxlckJhc2UuX2dldE5vZGVNb2R1bGVzTG9va3VwUGF0aChmaWxlbmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbW9kLl9jb21waWxlKGNvbXBpbGVkQ29kZSwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2FkZEdsb2JhbEFQSSh0ZXN0RmlsZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfcmVtb3ZlUmVxdWlyZUhvb2sgKCkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLm9yaWdSZXF1aXJlRXh0ZW5zaW9ucykuZm9yRWFjaChleHQgPT4ge1xuICAgICAgICAgICAgcmVxdWlyZS5leHRlbnNpb25zW2V4dF0gPSB0aGlzLm9yaWdSZXF1aXJlRXh0ZW5zaW9uc1tleHRdO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfY29tcGlsZUNvZGVGb3JUZXN0RmlsZXMgKHRlc3RGaWxlc0luZm8pIHtcbiAgICAgICAgc3RhY2tDbGVhbmluZ0hvb2suZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhblByZWNvbXBpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZWNvbXBpbGVDb2RlKHRlc3RGaWxlc0luZm8pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGVzdEZpbGVzSW5mby5tYXAoKHsgY29kZSwgZmlsZW5hbWUgfSkgPT4gdGhpcy5fY29tcGlsZUNvZGUoY29kZSwgZmlsZW5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVGVzdENvbXBpbGF0aW9uRXJyb3Ioc3RhY2tDbGVhbmluZ0hvb2suY2xlYW5FcnJvcihlcnIpKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHN0YWNrQ2xlYW5pbmdIb29rLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9hZGRHbG9iYWxBUEkgKHRlc3RGaWxlKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwsICdmaXh0dXJlJywge1xuICAgICAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBuZXcgRml4dHVyZSh0ZXN0RmlsZSksXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbCwgJ3Rlc3QnLCB7XG4gICAgICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IG5ldyBUZXN0KHRlc3RGaWxlKSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfcmVtb3ZlR2xvYmFsQVBJICgpIHtcbiAgICAgICAgZGVsZXRlIGdsb2JhbC5maXh0dXJlO1xuICAgICAgICBkZWxldGUgZ2xvYmFsLnRlc3Q7XG4gICAgfVxuXG4gICAgX3J1bkNvbXBpbGVkQ29kZSAoY29tcGlsZWRDb2RlLCBmaWxlbmFtZSkge1xuICAgICAgICBjb25zdCB0ZXN0RmlsZSA9IG5ldyBUZXN0RmlsZShmaWxlbmFtZSk7XG5cbiAgICAgICAgdGhpcy5fYWRkR2xvYmFsQVBJKHRlc3RGaWxlKTtcblxuICAgICAgICBzdGFja0NsZWFuaW5nSG9vay5lbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLl9zZXR1cFJlcXVpcmVIb29rKHRlc3RGaWxlKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgQVBJQmFzZWRUZXN0RmlsZUNvbXBpbGVyQmFzZS5fZXhlY0FzTW9kdWxlKGNvbXBpbGVkQ29kZSwgZmlsZW5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmICghKGVyciBpbnN0YW5jZW9mIEFQSUVycm9yKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVzdENvbXBpbGF0aW9uRXJyb3Ioc3RhY2tDbGVhbmluZ0hvb2suY2xlYW5FcnJvcihlcnIpKTtcblxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlUmVxdWlyZUhvb2soKTtcbiAgICAgICAgICAgIHN0YWNrQ2xlYW5pbmdIb29rLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlR2xvYmFsQVBJKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGVzdEZpbGUuZ2V0VGVzdHMoKTtcbiAgICB9XG5cblxuICAgIHByZWNvbXBpbGUgKHRlc3RGaWxlc0luZm8pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVDb2RlRm9yVGVzdEZpbGVzKHRlc3RGaWxlc0luZm8pO1xuICAgIH1cblxuICAgIGV4ZWN1dGUgKGNvbXBpbGVkQ29kZSwgZmlsZW5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1bkNvbXBpbGVkQ29kZShjb21waWxlZENvZGUsIGZpbGVuYW1lKTtcbiAgICB9XG5cbiAgICBhc3luYyBjb21waWxlIChjb2RlLCBmaWxlbmFtZSkge1xuICAgICAgICBjb25zdCBbY29tcGlsZWRDb2RlXSA9IGF3YWl0IHRoaXMucHJlY29tcGlsZShbeyBjb2RlLCBmaWxlbmFtZSB9XSk7XG5cbiAgICAgICAgaWYgKGNvbXBpbGVkQ29kZSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoY29tcGlsZWRDb2RlLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIF9oYXNUZXN0cyAoY29kZSkge1xuICAgICAgICByZXR1cm4gRklYVFVSRV9SRS50ZXN0KGNvZGUpICYmIFRFU1RfUkUudGVzdChjb2RlKTtcbiAgICB9XG5cbiAgICBjbGVhblVwICgpIHtcbiAgICAgICAgdGhpcy5jYWNoZSA9IHt9O1xuICAgIH1cbn1cbiJdfQ==