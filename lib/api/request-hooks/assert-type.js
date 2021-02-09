"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_assertions_1 = require("../../errors/runtime/type-assertions");
function assertRequestHookType(hooks) {
    hooks.forEach(hook => type_assertions_1.assertType(type_assertions_1.is.requestHookSubclass, 'requestHooks', `Hook`, hook));
}
exports.default = assertRequestHookType;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0LXR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3JlcXVlc3QtaG9va3MvYXNzZXJ0LXR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwRUFBc0U7QUFHdEUsU0FBd0IscUJBQXFCLENBQUUsS0FBb0I7SUFDL0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLDRCQUFVLENBQUMsb0JBQUUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDNUYsQ0FBQztBQUZELHdDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0VHlwZSwgaXMgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZS90eXBlLWFzc2VydGlvbnMnO1xuaW1wb3J0IFJlcXVlc3RIb29rIGZyb20gJy4vaG9vayc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFzc2VydFJlcXVlc3RIb29rVHlwZSAoaG9va3M6IFJlcXVlc3RIb29rW10pOiB2b2lkIHtcbiAgICBob29rcy5mb3JFYWNoKGhvb2sgPT4gYXNzZXJ0VHlwZShpcy5yZXF1ZXN0SG9va1N1YmNsYXNzLCAncmVxdWVzdEhvb2tzJywgYEhvb2tgLCBob29rKSk7XG59XG4iXX0=