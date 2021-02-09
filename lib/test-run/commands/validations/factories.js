"use strict";
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpeedValidator = exports.createBooleanValidator = exports.createPositiveIntegerValidator = exports.createIntegerValidator = void 0;
function createIntegerValidator(ErrorCtor) {
    return (name, val) => {
        const valType = typeof val;
        if (valType !== 'number')
            throw new ErrorCtor(name, valType);
        const isInteger = !isNaN(val) &&
            isFinite(val) &&
            val === Math.floor(val);
        if (!isInteger)
            throw new ErrorCtor(name, val);
    };
}
exports.createIntegerValidator = createIntegerValidator;
function createPositiveIntegerValidator(ErrorCtor) {
    const integerValidator = createIntegerValidator(ErrorCtor);
    return (name, val) => {
        integerValidator(name, val);
        if (val < 0)
            throw new ErrorCtor(name, val);
    };
}
exports.createPositiveIntegerValidator = createPositiveIntegerValidator;
function createBooleanValidator(ErrorCtor) {
    return (name, val) => {
        const valType = typeof val;
        if (valType !== 'boolean')
            throw new ErrorCtor(name, valType);
    };
}
exports.createBooleanValidator = createBooleanValidator;
function createSpeedValidator(ErrorCtor) {
    return (name, val) => {
        const valType = typeof val;
        if (valType !== 'number')
            throw new ErrorCtor(name, valType);
        if (isNaN(val) || val < 0.01 || val > 1)
            throw new ErrorCtor(name, val);
    };
}
exports.createSpeedValidator = createSpeedValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Rlc3QtcnVuL2NvbW1hbmRzL3ZhbGlkYXRpb25zL2ZhY3Rvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZ0VBQWdFO0FBQ2hFLGdFQUFnRTtBQUNoRSwrQ0FBK0M7QUFDL0MsZ0VBQWdFOzs7QUFFaEUsU0FBZ0Isc0JBQXNCLENBQUUsU0FBUztJQUM3QyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLE9BQU8sR0FBRyxDQUFDO1FBRTNCLElBQUksT0FBTyxLQUFLLFFBQVE7WUFDcEIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdkMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQ2IsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUNiLEdBQUcsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxTQUFTO1lBQ1YsTUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQWRELHdEQWNDO0FBRUQsU0FBZ0IsOEJBQThCLENBQUUsU0FBUztJQUNyRCxNQUFNLGdCQUFnQixHQUFHLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDakIsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTVCLElBQUksR0FBRyxHQUFHLENBQUM7WUFDUCxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBVEQsd0VBU0M7QUFFRCxTQUFnQixzQkFBc0IsQ0FBRSxTQUFTO0lBQzdDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDakIsTUFBTSxPQUFPLEdBQUcsT0FBTyxHQUFHLENBQUM7UUFFM0IsSUFBSSxPQUFPLEtBQUssU0FBUztZQUNyQixNQUFNLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBUEQsd0RBT0M7QUFFRCxTQUFnQixvQkFBb0IsQ0FBRSxTQUFTO0lBQzNDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDakIsTUFBTSxPQUFPLEdBQUcsT0FBTyxHQUFHLENBQUM7UUFFM0IsSUFBSSxPQUFPLEtBQUssUUFBUTtZQUNwQixNQUFNLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV2QyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ25DLE1BQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFWRCxvREFVQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFdBUk5JTkc6IHRoaXMgZmlsZSBpcyB1c2VkIGJ5IGJvdGggdGhlIGNsaWVudCBhbmQgdGhlIHNlcnZlci5cbi8vIERvIG5vdCB1c2UgYW55IGJyb3dzZXIgb3Igbm9kZS1zcGVjaWZpYyBBUEkhXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbnRlZ2VyVmFsaWRhdG9yIChFcnJvckN0b3IpIHtcbiAgICByZXR1cm4gKG5hbWUsIHZhbCkgPT4ge1xuICAgICAgICBjb25zdCB2YWxUeXBlID0gdHlwZW9mIHZhbDtcblxuICAgICAgICBpZiAodmFsVHlwZSAhPT0gJ251bWJlcicpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3JDdG9yKG5hbWUsIHZhbFR5cGUpO1xuXG4gICAgICAgIGNvbnN0IGlzSW50ZWdlciA9ICFpc05hTih2YWwpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Zpbml0ZSh2YWwpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPT09IE1hdGguZmxvb3IodmFsKTtcblxuICAgICAgICBpZiAoIWlzSW50ZWdlcilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvckN0b3IobmFtZSwgdmFsKTtcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUG9zaXRpdmVJbnRlZ2VyVmFsaWRhdG9yIChFcnJvckN0b3IpIHtcbiAgICBjb25zdCBpbnRlZ2VyVmFsaWRhdG9yID0gY3JlYXRlSW50ZWdlclZhbGlkYXRvcihFcnJvckN0b3IpO1xuXG4gICAgcmV0dXJuIChuYW1lLCB2YWwpID0+IHtcbiAgICAgICAgaW50ZWdlclZhbGlkYXRvcihuYW1lLCB2YWwpO1xuXG4gICAgICAgIGlmICh2YWwgPCAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yQ3RvcihuYW1lLCB2YWwpO1xuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCb29sZWFuVmFsaWRhdG9yIChFcnJvckN0b3IpIHtcbiAgICByZXR1cm4gKG5hbWUsIHZhbCkgPT4ge1xuICAgICAgICBjb25zdCB2YWxUeXBlID0gdHlwZW9mIHZhbDtcblxuICAgICAgICBpZiAodmFsVHlwZSAhPT0gJ2Jvb2xlYW4nKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yQ3RvcihuYW1lLCB2YWxUeXBlKTtcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3BlZWRWYWxpZGF0b3IgKEVycm9yQ3Rvcikge1xuICAgIHJldHVybiAobmFtZSwgdmFsKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbFR5cGUgPSB0eXBlb2YgdmFsO1xuXG4gICAgICAgIGlmICh2YWxUeXBlICE9PSAnbnVtYmVyJylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvckN0b3IobmFtZSwgdmFsVHlwZSk7XG5cbiAgICAgICAgaWYgKGlzTmFOKHZhbCkgfHwgdmFsIDwgMC4wMSB8fCB2YWwgPiAxKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yQ3RvcihuYW1lLCB2YWwpO1xuICAgIH07XG59XG4iXX0=