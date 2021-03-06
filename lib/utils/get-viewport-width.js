"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tty_1 = __importDefault(require("tty"));
const DEFAULT_VIEWPORT_WIDTH = 78;
function default_1(outStream) {
    if (outStream === process.stdout && tty_1.default.isatty(1)) {
        const detectedViewportWidth = process.stdout.getWindowSize ?
            process.stdout.getWindowSize(1)[0] :
            tty_1.default.getWindowSize()[1];
        return Math.max(detectedViewportWidth, DEFAULT_VIEWPORT_WIDTH);
    }
    return DEFAULT_VIEWPORT_WIDTH;
}
exports.default = default_1;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXZpZXdwb3J0LXdpZHRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2dldC12aWV3cG9ydC13aWR0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUFzQjtBQUV0QixNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQUVsQyxtQkFBeUIsU0FBUztJQUM5QixJQUFJLFNBQVMsS0FBSyxPQUFPLENBQUMsTUFBTSxJQUFJLGFBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDL0MsTUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsYUFBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0tBQ2xFO0lBRUQsT0FBTyxzQkFBc0IsQ0FBQztBQUNsQyxDQUFDO0FBVkQsNEJBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHR5IGZyb20gJ3R0eSc7XG5cbmNvbnN0IERFRkFVTFRfVklFV1BPUlRfV0lEVEggPSA3ODtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG91dFN0cmVhbSkge1xuICAgIGlmIChvdXRTdHJlYW0gPT09IHByb2Nlc3Muc3Rkb3V0ICYmIHR0eS5pc2F0dHkoMSkpIHtcbiAgICAgICAgY29uc3QgZGV0ZWN0ZWRWaWV3cG9ydFdpZHRoID0gcHJvY2Vzcy5zdGRvdXQuZ2V0V2luZG93U2l6ZSA/XG4gICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC5nZXRXaW5kb3dTaXplKDEpWzBdIDpcbiAgICAgICAgICAgIHR0eS5nZXRXaW5kb3dTaXplKClbMV07XG5cbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGRldGVjdGVkVmlld3BvcnRXaWR0aCwgREVGQVVMVF9WSUVXUE9SVF9XSURUSCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIERFRkFVTFRfVklFV1BPUlRfV0lEVEg7XG59XG4iXX0=