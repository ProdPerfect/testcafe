"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const callsite_record_1 = require("callsite-record");
function renderCallsiteSync(callsite, options) {
    if (!callsite)
        return '';
    // NOTE: for raw API callsites
    if (typeof callsite === 'string')
        return callsite;
    if (callsite.prerendered) {
        const renderer = options && options.renderer;
        if (renderer === callsite_record_1.renderers.html)
            return callsite.html;
        if (renderer === callsite_record_1.renderers.noColor)
            return callsite.noColor;
        return callsite.default || '';
    }
    if (!callsite.renderSync)
        return '';
    try {
        // NOTE: Callsite will throw during rendering if it can't find a target file for the specified function or method:
        // https://github.com/inikulin/callsite-record/issues/2#issuecomment-223263941
        return callsite.renderSync(options);
    }
    catch (err) {
        return '';
    }
}
exports.default = renderCallsiteSync;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLWNhbGxzaXRlLXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvcmVuZGVyLWNhbGxzaXRlLXN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBNEM7QUFHNUMsU0FBd0Isa0JBQWtCLENBQUUsUUFBUSxFQUFFLE9BQU87SUFDekQsSUFBSSxDQUFDLFFBQVE7UUFDVCxPQUFPLEVBQUUsQ0FBQztJQUVkLDhCQUE4QjtJQUM5QixJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVE7UUFDNUIsT0FBTyxRQUFRLENBQUM7SUFFcEIsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3RCLE1BQU0sUUFBUSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRTdDLElBQUksUUFBUSxLQUFLLDJCQUFTLENBQUMsSUFBSTtZQUMzQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFFekIsSUFBSSxRQUFRLEtBQUssMkJBQVMsQ0FBQyxPQUFPO1lBQzlCLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUU1QixPQUFPLFFBQVEsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0tBQ2pDO0lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVO1FBQ3BCLE9BQU8sRUFBRSxDQUFDO0lBRWQsSUFBSTtRQUNBLGtIQUFrSDtRQUNsSCw4RUFBOEU7UUFDOUUsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsT0FBTyxHQUFHLEVBQUU7UUFDUixPQUFPLEVBQUUsQ0FBQztLQUNiO0FBQ0wsQ0FBQztBQS9CRCxxQ0ErQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW5kZXJlcnMgfSBmcm9tICdjYWxsc2l0ZS1yZWNvcmQnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbmRlckNhbGxzaXRlU3luYyAoY2FsbHNpdGUsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWNhbGxzaXRlKVxuICAgICAgICByZXR1cm4gJyc7XG5cbiAgICAvLyBOT1RFOiBmb3IgcmF3IEFQSSBjYWxsc2l0ZXNcbiAgICBpZiAodHlwZW9mIGNhbGxzaXRlID09PSAnc3RyaW5nJylcbiAgICAgICAgcmV0dXJuIGNhbGxzaXRlO1xuXG4gICAgaWYgKGNhbGxzaXRlLnByZXJlbmRlcmVkKSB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gb3B0aW9ucyAmJiBvcHRpb25zLnJlbmRlcmVyO1xuXG4gICAgICAgIGlmIChyZW5kZXJlciA9PT0gcmVuZGVyZXJzLmh0bWwpXG4gICAgICAgICAgICByZXR1cm4gY2FsbHNpdGUuaHRtbDtcblxuICAgICAgICBpZiAocmVuZGVyZXIgPT09IHJlbmRlcmVycy5ub0NvbG9yKVxuICAgICAgICAgICAgcmV0dXJuIGNhbGxzaXRlLm5vQ29sb3I7XG5cbiAgICAgICAgcmV0dXJuIGNhbGxzaXRlLmRlZmF1bHQgfHwgJyc7XG4gICAgfVxuXG4gICAgaWYgKCFjYWxsc2l0ZS5yZW5kZXJTeW5jKVxuICAgICAgICByZXR1cm4gJyc7XG5cbiAgICB0cnkge1xuICAgICAgICAvLyBOT1RFOiBDYWxsc2l0ZSB3aWxsIHRocm93IGR1cmluZyByZW5kZXJpbmcgaWYgaXQgY2FuJ3QgZmluZCBhIHRhcmdldCBmaWxlIGZvciB0aGUgc3BlY2lmaWVkIGZ1bmN0aW9uIG9yIG1ldGhvZDpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2luaWt1bGluL2NhbGxzaXRlLXJlY29yZC9pc3N1ZXMvMiNpc3N1ZWNvbW1lbnQtMjIzMjYzOTQxXG4gICAgICAgIHJldHVybiBjYWxsc2l0ZS5yZW5kZXJTeW5jKG9wdGlvbnMpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG59XG4iXX0=