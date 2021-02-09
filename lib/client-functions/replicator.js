"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorNodeTransform = exports.FunctionTransform = exports.createReplicator = void 0;
const lodash_1 = require("lodash");
const replicator_1 = __importDefault(require("replicator"));
const builder_symbol_1 = __importDefault(require("./builder-symbol"));
const compile_client_function_1 = __importDefault(require("../compiler/compile-client-function"));
function createReplicator(transforms) {
    // NOTE: we will serialize replicator results
    // to JSON with a command or command result.
    // Therefore there is no need to do additional job here,
    // so we use identity functions for serialization.
    const replicator = new replicator_1.default({
        serialize: lodash_1.identity,
        deserialize: lodash_1.identity
    });
    return replicator.addTransforms(transforms);
}
exports.createReplicator = createReplicator;
// Replicator transforms
class FunctionTransform {
    constructor(callsiteNames) {
        this.type = 'Function';
        this.callsiteNames = callsiteNames;
    }
    shouldTransform(type) {
        return type === 'function';
    }
    toSerializable(fn) {
        const clientFnBuilder = fn[builder_symbol_1.default];
        if (clientFnBuilder) {
            return {
                fnCode: clientFnBuilder.compiledFnCode,
                dependencies: clientFnBuilder.getFunctionDependencies()
            };
        }
        return {
            fnCode: compile_client_function_1.default(fn.toString(), null, this.callsiteNames.instantiation, this.callsiteNames.execution),
            dependencies: {}
        };
    }
    fromSerializable() {
        return void 0;
    }
}
exports.FunctionTransform = FunctionTransform;
class SelectorNodeTransform {
    constructor() {
        this.type = 'Node';
    }
    shouldTransform() {
        return false;
    }
    fromSerializable(nodeSnapshot) {
        return nodeSnapshot;
    }
}
exports.SelectorNodeTransform = SelectorNodeTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGljYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQtZnVuY3Rpb25zL3JlcGxpY2F0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsbUNBQWtDO0FBQ2xDLDREQUFvQztBQUNwQyxzRUFBcUQ7QUFDckQsa0dBQXdFO0FBRXhFLFNBQWdCLGdCQUFnQixDQUFFLFVBQVU7SUFDeEMsNkNBQTZDO0lBQzdDLDRDQUE0QztJQUM1Qyx3REFBd0Q7SUFDeEQsa0RBQWtEO0lBQ2xELE1BQU0sVUFBVSxHQUFHLElBQUksb0JBQVUsQ0FBQztRQUM5QixTQUFTLEVBQUksaUJBQVE7UUFDckIsV0FBVyxFQUFFLGlCQUFRO0tBQ3hCLENBQUMsQ0FBQztJQUVILE9BQU8sVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBWEQsNENBV0M7QUFFRCx3QkFBd0I7QUFDeEIsTUFBYSxpQkFBaUI7SUFDMUIsWUFBYSxhQUFhO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQVksVUFBVSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxlQUFlLENBQUUsSUFBSTtRQUNqQixPQUFPLElBQUksS0FBSyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUVELGNBQWMsQ0FBRSxFQUFFO1FBQ2QsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLHdCQUFxQixDQUFDLENBQUM7UUFFbEQsSUFBSSxlQUFlLEVBQUU7WUFDakIsT0FBTztnQkFDSCxNQUFNLEVBQVEsZUFBZSxDQUFDLGNBQWM7Z0JBQzVDLFlBQVksRUFBRSxlQUFlLENBQUMsdUJBQXVCLEVBQUU7YUFDMUQsQ0FBQztTQUNMO1FBRUQsT0FBTztZQUNILE1BQU0sRUFBUSxpQ0FBcUIsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO1lBQ3hILFlBQVksRUFBRSxFQUFFO1NBQ25CLENBQUM7SUFDTixDQUFDO0lBRUQsZ0JBQWdCO1FBQ1osT0FBTyxLQUFLLENBQUMsQ0FBQztJQUNsQixDQUFDO0NBQ0o7QUE3QkQsOENBNkJDO0FBRUQsTUFBYSxxQkFBcUI7SUFDOUI7UUFDSSxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsZUFBZTtRQUNYLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBRSxZQUFZO1FBQzFCLE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7Q0FDSjtBQVpELHNEQVlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFJlcGxpY2F0b3IgZnJvbSAncmVwbGljYXRvcic7XG5pbXBvcnQgZnVuY3Rpb25CdWlsZGVyU3ltYm9sIGZyb20gJy4vYnVpbGRlci1zeW1ib2wnO1xuaW1wb3J0IGNvbXBpbGVDbGllbnRGdW5jdGlvbiBmcm9tICcuLi9jb21waWxlci9jb21waWxlLWNsaWVudC1mdW5jdGlvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXBsaWNhdG9yICh0cmFuc2Zvcm1zKSB7XG4gICAgLy8gTk9URTogd2Ugd2lsbCBzZXJpYWxpemUgcmVwbGljYXRvciByZXN1bHRzXG4gICAgLy8gdG8gSlNPTiB3aXRoIGEgY29tbWFuZCBvciBjb21tYW5kIHJlc3VsdC5cbiAgICAvLyBUaGVyZWZvcmUgdGhlcmUgaXMgbm8gbmVlZCB0byBkbyBhZGRpdGlvbmFsIGpvYiBoZXJlLFxuICAgIC8vIHNvIHdlIHVzZSBpZGVudGl0eSBmdW5jdGlvbnMgZm9yIHNlcmlhbGl6YXRpb24uXG4gICAgY29uc3QgcmVwbGljYXRvciA9IG5ldyBSZXBsaWNhdG9yKHtcbiAgICAgICAgc2VyaWFsaXplOiAgIGlkZW50aXR5LFxuICAgICAgICBkZXNlcmlhbGl6ZTogaWRlbnRpdHlcbiAgICB9KTtcblxuICAgIHJldHVybiByZXBsaWNhdG9yLmFkZFRyYW5zZm9ybXModHJhbnNmb3Jtcyk7XG59XG5cbi8vIFJlcGxpY2F0b3IgdHJhbnNmb3Jtc1xuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uVHJhbnNmb3JtIHtcbiAgICBjb25zdHJ1Y3RvciAoY2FsbHNpdGVOYW1lcykge1xuICAgICAgICB0aGlzLnR5cGUgICAgICAgICAgPSAnRnVuY3Rpb24nO1xuICAgICAgICB0aGlzLmNhbGxzaXRlTmFtZXMgPSBjYWxsc2l0ZU5hbWVzO1xuICAgIH1cblxuICAgIHNob3VsZFRyYW5zZm9ybSAodHlwZSkge1xuICAgICAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9XG5cbiAgICB0b1NlcmlhbGl6YWJsZSAoZm4pIHtcbiAgICAgICAgY29uc3QgY2xpZW50Rm5CdWlsZGVyID0gZm5bZnVuY3Rpb25CdWlsZGVyU3ltYm9sXTtcblxuICAgICAgICBpZiAoY2xpZW50Rm5CdWlsZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGZuQ29kZTogICAgICAgY2xpZW50Rm5CdWlsZGVyLmNvbXBpbGVkRm5Db2RlLFxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llczogY2xpZW50Rm5CdWlsZGVyLmdldEZ1bmN0aW9uRGVwZW5kZW5jaWVzKClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZm5Db2RlOiAgICAgICBjb21waWxlQ2xpZW50RnVuY3Rpb24oZm4udG9TdHJpbmcoKSwgbnVsbCwgdGhpcy5jYWxsc2l0ZU5hbWVzLmluc3RhbnRpYXRpb24sIHRoaXMuY2FsbHNpdGVOYW1lcy5leGVjdXRpb24pLFxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiB7fVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZyb21TZXJpYWxpemFibGUgKCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlbGVjdG9yTm9kZVRyYW5zZm9ybSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSAnTm9kZSc7XG4gICAgfVxuXG4gICAgc2hvdWxkVHJhbnNmb3JtICgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZyb21TZXJpYWxpemFibGUgKG5vZGVTbmFwc2hvdCkge1xuICAgICAgICByZXR1cm4gbm9kZVNuYXBzaG90O1xuICAgIH1cbn1cbiJdfQ==