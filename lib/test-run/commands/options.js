"use strict";
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assignable_1 = __importDefault(require("../../utils/assignable"));
const factories_1 = require("./validations/factories");
const test_run_1 = require("../../errors/test-run");
exports.integerOption = factories_1.createIntegerValidator(test_run_1.ActionIntegerOptionError);
exports.positiveIntegerOption = factories_1.createPositiveIntegerValidator(test_run_1.ActionPositiveIntegerOptionError);
exports.booleanOption = factories_1.createBooleanValidator(test_run_1.ActionBooleanOptionError);
exports.speedOption = factories_1.createSpeedValidator(test_run_1.ActionSpeedOptionError);
// Actions
class ActionOptions extends assignable_1.default {
    constructor(obj, validate) {
        super();
        this.speed = null;
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return [
            { name: 'speed', type: exports.speedOption }
        ];
    }
}
exports.ActionOptions = ActionOptions;
// Offset
class OffsetOptions extends ActionOptions {
    constructor(obj, validate) {
        super();
        this.offsetX = null;
        this.offsetY = null;
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'offsetX', type: exports.integerOption },
            { name: 'offsetY', type: exports.integerOption }
        ]);
    }
}
exports.OffsetOptions = OffsetOptions;
class ScrollOptions extends OffsetOptions {
    constructor(obj, validate) {
        super();
        this.scrollToCenter = false;
        this.skipParentFrames = false;
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'scrollToCenter', type: exports.booleanOption },
            { name: 'skipParentFrames', type: exports.booleanOption }
        ]);
    }
}
exports.ScrollOptions = ScrollOptions;
// Element Screenshot
class ElementScreenshotOptions extends ActionOptions {
    constructor(obj, validate) {
        super();
        this.scrollTargetX = null;
        this.scrollTargetY = null;
        this.includeMargins = false;
        this.includeBorders = true;
        this.includePaddings = true;
        this.crop = {
            left: null,
            right: null,
            top: null,
            bottom: null
        };
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'scrollTargetX', type: exports.integerOption },
            { name: 'scrollTargetY', type: exports.integerOption },
            { name: 'crop.left', type: exports.integerOption },
            { name: 'crop.right', type: exports.integerOption },
            { name: 'crop.top', type: exports.integerOption },
            { name: 'crop.bottom', type: exports.integerOption },
            { name: 'includeMargins', type: exports.booleanOption },
            { name: 'includeBorders', type: exports.booleanOption },
            { name: 'includePaddings', type: exports.booleanOption }
        ]);
    }
}
exports.ElementScreenshotOptions = ElementScreenshotOptions;
// Mouse
class MouseOptions extends OffsetOptions {
    constructor(obj, validate) {
        super();
        this.modifiers = {
            ctrl: false,
            alt: false,
            shift: false,
            meta: false
        };
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'modifiers.ctrl', type: exports.booleanOption },
            { name: 'modifiers.alt', type: exports.booleanOption },
            { name: 'modifiers.shift', type: exports.booleanOption },
            { name: 'modifiers.meta', type: exports.booleanOption }
        ]);
    }
}
exports.MouseOptions = MouseOptions;
// Click
class ClickOptions extends MouseOptions {
    constructor(obj, validate) {
        super();
        this.caretPos = null;
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'caretPos', type: exports.positiveIntegerOption }
        ]);
    }
}
exports.ClickOptions = ClickOptions;
// Move
class MoveOptions extends MouseOptions {
    constructor(obj, validate) {
        super();
        this.speed = null;
        this.minMovingTime = null;
        this.holdLeftButton = false;
        this.skipScrolling = false;
        this.skipDefaultDragBehavior = false;
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'speed' },
            { name: 'minMovingTime' },
            { name: 'holdLeftButton' },
            { name: 'skipScrolling', type: exports.booleanOption },
            { name: 'skipDefaultDragBehavior', type: exports.booleanOption }
        ]);
    }
}
exports.MoveOptions = MoveOptions;
// Type
class TypeOptions extends ClickOptions {
    constructor(obj, validate) {
        super();
        this.replace = false;
        this.paste = false;
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'replace', type: exports.booleanOption },
            { name: 'paste', type: exports.booleanOption }
        ]);
    }
}
exports.TypeOptions = TypeOptions;
// DragToElement
class DragToElementOptions extends MouseOptions {
    constructor(obj, validate) {
        super(obj, validate);
        this.destinationOffsetX = null;
        this.destinationOffsetY = null;
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return super._getAssignableProperties().concat([
            { name: 'destinationOffsetX', type: exports.integerOption },
            { name: 'destinationOffsetY', type: exports.integerOption }
        ]);
    }
}
exports.DragToElementOptions = DragToElementOptions;
//ResizeToFitDevice
class ResizeToFitDeviceOptions extends assignable_1.default {
    constructor(obj, validate) {
        super();
        this.portraitOrientation = false;
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return [
            { name: 'portraitOrientation', type: exports.booleanOption }
        ];
    }
}
exports.ResizeToFitDeviceOptions = ResizeToFitDeviceOptions;
//Assertion
class AssertionOptions extends assignable_1.default {
    constructor(obj, validate) {
        super();
        this.timeout = void 0;
        this.allowUnawaitedPromise = false;
        this._assignFrom(obj, validate);
    }
    _getAssignableProperties() {
        return [
            { name: 'timeout', type: exports.positiveIntegerOption },
            { name: 'allowUnawaitedPromise', type: exports.booleanOption }
        ];
    }
}
exports.AssertionOptions = AssertionOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0LXJ1bi9jb21tYW5kcy9vcHRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnRUFBZ0U7QUFDaEUsZ0VBQWdFO0FBQ2hFLCtDQUErQztBQUMvQyxnRUFBZ0U7Ozs7O0FBRWhFLHdFQUFnRDtBQUNoRCx1REFLaUM7QUFDakMsb0RBSytCO0FBRWxCLFFBQUEsYUFBYSxHQUFXLGtDQUFzQixDQUFDLG1DQUF3QixDQUFDLENBQUM7QUFDekUsUUFBQSxxQkFBcUIsR0FBRywwQ0FBOEIsQ0FBQywyQ0FBZ0MsQ0FBQyxDQUFDO0FBQ3pGLFFBQUEsYUFBYSxHQUFXLGtDQUFzQixDQUFDLG1DQUF3QixDQUFDLENBQUM7QUFDekUsUUFBQSxXQUFXLEdBQWEsZ0NBQW9CLENBQUMsaUNBQXNCLENBQUMsQ0FBQztBQUdsRixVQUFVO0FBQ1YsTUFBYSxhQUFjLFNBQVEsb0JBQVU7SUFDekMsWUFBYSxHQUFHLEVBQUUsUUFBUTtRQUN0QixLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRWxCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCx3QkFBd0I7UUFDcEIsT0FBTztZQUNILEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsbUJBQVcsRUFBRTtTQUN2QyxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBZEQsc0NBY0M7QUFFRCxTQUFTO0FBQ1QsTUFBYSxhQUFjLFNBQVEsYUFBYTtJQUM1QyxZQUFhLEdBQUcsRUFBRSxRQUFRO1FBQ3RCLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFFcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFH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LE9BQU8sR0FBaUIsS0FBSyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztRQUVuQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsd0JBQXdCO1FBQ3BCLE9BQU87WUFDSCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLDZCQUFxQixFQUFFO1lBQ2hELEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLElBQUksRUFBRSxxQkFBYSxFQUFFO1NBQ3pELENBQUM7SUFDTixDQUFDO0NBQ0o7QUFoQkQsNENBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gV0FSTklORzogdGhpcyBmaWxlIGlzIHVzZWQgYnkgYm90aCB0aGUgY2xpZW50IGFuZCB0aGUgc2VydmVyLlxuLy8gRG8gbm90IHVzZSBhbnkgYnJvd3NlciBvciBub2RlLXNwZWNpZmljIEFQSSFcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuaW1wb3J0IEFzc2lnbmFibGUgZnJvbSAnLi4vLi4vdXRpbHMvYXNzaWduYWJsZSc7XG5pbXBvcnQge1xuICAgIGNyZWF0ZUJvb2xlYW5WYWxpZGF0b3IsXG4gICAgY3JlYXRlSW50ZWdlclZhbGlkYXRvcixcbiAgICBjcmVhdGVQb3NpdGl2ZUludGVnZXJWYWxpZGF0b3IsXG4gICAgY3JlYXRlU3BlZWRWYWxpZGF0b3Jcbn0gZnJvbSAnLi92YWxpZGF0aW9ucy9mYWN0b3JpZXMnO1xuaW1wb3J0IHtcbiAgICBBY3Rpb25JbnRlZ2VyT3B0aW9uRXJyb3IsXG4gICAgQWN0aW9uUG9zaXRpdmVJbnRlZ2VyT3B0aW9uRXJyb3IsXG4gICAgQWN0aW9uQm9vbGVhbk9wdGlvbkVycm9yLFxuICAgIEFjdGlvblNwZWVkT3B0aW9uRXJyb3Jcbn0gZnJvbSAnLi4vLi4vZXJyb3JzL3Rlc3QtcnVuJztcblxuZXhwb3J0IGNvbnN0IGludGVnZXJPcHRpb24gICAgICAgICA9IGNyZWF0ZUludGVnZXJWYWxpZGF0b3IoQWN0aW9uSW50ZWdlck9wdGlvbkVycm9yKTtcbmV4cG9ydCBjb25zdCBwb3NpdGl2ZUludGVnZXJPcHRpb24gPSBjcmVhdGVQb3NpdGl2ZUludGVnZXJWYWxpZGF0b3IoQWN0aW9uUG9zaXRpdmVJbnRlZ2VyT3B0aW9uRXJyb3IpO1xuZXhwb3J0IGNvbnN0IGJvb2xlYW5PcHRpb24gICAgICAgICA9IGNyZWF0ZUJvb2xlYW5WYWxpZGF0b3IoQWN0aW9uQm9vbGVhbk9wdGlvbkVycm9yKTtcbmV4cG9ydCBjb25zdCBzcGVlZE9wdGlvbiAgICAgICAgICAgPSBjcmVhdGVTcGVlZFZhbGlkYXRvcihBY3Rpb25TcGVlZE9wdGlvbkVycm9yKTtcblxuXG4vLyBBY3Rpb25zXG5leHBvcnQgY2xhc3MgQWN0aW9uT3B0aW9ucyBleHRlbmRzIEFzc2lnbmFibGUge1xuICAgIGNvbnN0cnVjdG9yIChvYmosIHZhbGlkYXRlKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5zcGVlZCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fYXNzaWduRnJvbShvYmosIHZhbGlkYXRlKTtcbiAgICB9XG5cbiAgICBfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgeyBuYW1lOiAnc3BlZWQnLCB0eXBlOiBzcGVlZE9wdGlvbiB9XG4gICAgICAgIF07XG4gICAgfVxufVxuXG4vLyBPZmZzZXRcbmV4cG9ydCBjbGFzcyBPZmZzZXRPcHRpb25zIGV4dGVuZHMgQWN0aW9uT3B0aW9ucyB7XG4gICAgY29uc3RydWN0b3IgKG9iaiwgdmFsaWRhdGUpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLm9mZnNldFggPSBudWxsO1xuICAgICAgICB0aGlzLm9mZnNldFkgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2Fzc2lnbkZyb20ob2JqLCB2YWxpZGF0ZSk7XG4gICAgfVxuXG4gICAgX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9nZXRBc3NpZ25hYmxlUHJvcGVydGllcygpLmNvbmNhdChbXG4gICAgICAgICAgICB7IG5hbWU6ICdvZmZzZXRYJywgdHlwZTogaW50ZWdlck9wdGlvbiB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnb2Zmc2V0WScsIHR5cGU6IGludGVnZXJPcHRpb24gfVxuICAgICAgICBdKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTY3JvbGxPcHRpb25zIGV4dGVuZHMgT2Zmc2V0T3B0aW9ucyB7XG4gICAgY29uc3RydWN0b3IgKG9iaiwgdmFsaWRhdGUpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnNjcm9sbFRvQ2VudGVyICAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5za2lwUGFyZW50RnJhbWVzID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fYXNzaWduRnJvbShvYmosIHZhbGlkYXRlKTtcbiAgICB9XG5cbiAgICBfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzKCkuY29uY2F0KFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3Njcm9sbFRvQ2VudGVyJywgdHlwZTogYm9vbGVhbk9wdGlvbiB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnc2tpcFBhcmVudEZyYW1lcycsIHR5cGU6IGJvb2xlYW5PcHRpb24gfVxuICAgICAgICBdKTtcbiAgICB9XG59XG5cbi8vIEVsZW1lbnQgU2NyZWVuc2hvdFxuZXhwb3J0IGNsYXNzIEVsZW1lbnRTY3JlZW5zaG90T3B0aW9ucyBleHRlbmRzIEFjdGlvbk9wdGlvbnMge1xuICAgIGNvbnN0cnVjdG9yIChvYmosIHZhbGlkYXRlKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxUYXJnZXRYICAgPSBudWxsO1xuICAgICAgICB0aGlzLnNjcm9sbFRhcmdldFkgICA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5jbHVkZU1hcmdpbnMgID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaW5jbHVkZUJvcmRlcnMgID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pbmNsdWRlUGFkZGluZ3MgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuY3JvcCA9IHtcbiAgICAgICAgICAgIGxlZnQ6ICAgbnVsbCxcbiAgICAgICAgICAgIHJpZ2h0OiAgbnVsbCxcbiAgICAgICAgICAgIHRvcDogICAgbnVsbCxcbiAgICAgICAgICAgIGJvdHRvbTogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2Fzc2lnbkZyb20ob2JqLCB2YWxpZGF0ZSk7XG4gICAgfVxuXG4gICAgX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9nZXRBc3NpZ25hYmxlUHJvcGVydGllcygpLmNvbmNhdChbXG4gICAgICAgICAgICB7IG5hbWU6ICdzY3JvbGxUYXJnZXRYJywgdHlwZTogaW50ZWdlck9wdGlvbiB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnc2Nyb2xsVGFyZ2V0WScsIHR5cGU6IGludGVnZXJPcHRpb24gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2Nyb3AubGVmdCcsIHR5cGU6IGludGVnZXJPcHRpb24gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2Nyb3AucmlnaHQnLCB0eXBlOiBpbnRlZ2VyT3B0aW9uIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdjcm9wLnRvcCcsIHR5cGU6IGludGVnZXJPcHRpb24gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2Nyb3AuYm90dG9tJywgdHlwZTogaW50ZWdlck9wdGlvbiB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnaW5jbHVkZU1hcmdpbnMnLCB0eXBlOiBib29sZWFuT3B0aW9uIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdpbmNsdWRlQm9yZGVycycsIHR5cGU6IGJvb2xlYW5PcHRpb24gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2luY2x1ZGVQYWRkaW5ncycsIHR5cGU6IGJvb2xlYW5PcHRpb24gfVxuICAgICAgICBdKTtcbiAgICB9XG59XG5cbi8vIE1vdXNlXG5leHBvcnQgY2xhc3MgTW91c2VPcHRpb25zIGV4dGVuZHMgT2Zmc2V0T3B0aW9ucyB7XG4gICAgY29uc3RydWN0b3IgKG9iaiwgdmFsaWRhdGUpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLm1vZGlmaWVycyA9IHtcbiAgICAgICAgICAgIGN0cmw6ICBmYWxzZSxcbiAgICAgICAgICAgIGFsdDogICBmYWxzZSxcbiAgICAgICAgICAgIHNoaWZ0OiBmYWxzZSxcbiAgICAgICAgICAgIG1ldGE6ICBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2Fzc2lnbkZyb20ob2JqLCB2YWxpZGF0ZSk7XG4gICAgfVxuXG4gICAgX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9nZXRBc3NpZ25hYmxlUHJvcGVydGllcygpLmNvbmNhdChbXG4gICAgICAgICAgICB7IG5hbWU6ICdtb2RpZmllcnMuY3RybCcsIHR5cGU6IGJvb2xlYW5PcHRpb24gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ21vZGlmaWVycy5hbHQnLCB0eXBlOiBib29sZWFuT3B0aW9uIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdtb2RpZmllcnMuc2hpZnQnLCB0eXBlOiBib29sZWFuT3B0aW9uIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdtb2RpZmllcnMubWV0YScsIHR5cGU6IGJvb2xlYW5PcHRpb24gfVxuICAgICAgICBdKTtcbiAgICB9XG59XG5cblxuLy8gQ2xpY2tcbmV4cG9ydCBjbGFzcyBDbGlja09wdGlvbnMgZXh0ZW5kcyBNb3VzZU9wdGlvbnMge1xuICAgIGNvbnN0cnVjdG9yIChvYmosIHZhbGlkYXRlKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5jYXJldFBvcyA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fYXNzaWduRnJvbShvYmosIHZhbGlkYXRlKTtcbiAgICB9XG5cbiAgICBfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzKCkuY29uY2F0KFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2NhcmV0UG9zJywgdHlwZTogcG9zaXRpdmVJbnRlZ2VyT3B0aW9uIH1cbiAgICAgICAgXSk7XG4gICAgfVxufVxuXG4vLyBNb3ZlXG5leHBvcnQgY2xhc3MgTW92ZU9wdGlvbnMgZXh0ZW5kcyBNb3VzZU9wdGlvbnMge1xuICAgIGNvbnN0cnVjdG9yIChvYmosIHZhbGlkYXRlKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5zcGVlZCAgICAgICAgICAgICAgICAgICA9IG51bGw7XG4gICAgICAgIHRoaXMubWluTW92aW5nVGltZSAgICAgICAgICAgPSBudWxsO1xuICAgICAgICB0aGlzLmhvbGRMZWZ0QnV0dG9uICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2tpcFNjcm9sbGluZyAgICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5za2lwRGVmYXVsdERyYWdCZWhhdmlvciA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2Fzc2lnbkZyb20ob2JqLCB2YWxpZGF0ZSk7XG4gICAgfVxuXG4gICAgX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9nZXRBc3NpZ25hYmxlUHJvcGVydGllcygpLmNvbmNhdChbXG4gICAgICAgICAgICB7IG5hbWU6ICdzcGVlZCcgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ21pbk1vdmluZ1RpbWUnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdob2xkTGVmdEJ1dHRvbicgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3NraXBTY3JvbGxpbmcnLCB0eXBlOiBib29sZWFuT3B0aW9uIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdza2lwRGVmYXVsdERyYWdCZWhhdmlvcicsIHR5cGU6IGJvb2xlYW5PcHRpb24gfVxuICAgICAgICBdKTtcbiAgICB9XG59XG5cbi8vIFR5cGVcbmV4cG9ydCBjbGFzcyBUeXBlT3B0aW9ucyBleHRlbmRzIENsaWNrT3B0aW9ucyB7XG4gICAgY29uc3RydWN0b3IgKG9iaiwgdmFsaWRhdGUpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnJlcGxhY2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXN0ZSAgID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fYXNzaWduRnJvbShvYmosIHZhbGlkYXRlKTtcbiAgICB9XG5cbiAgICBfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzKCkuY29uY2F0KFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3JlcGxhY2UnLCB0eXBlOiBib29sZWFuT3B0aW9uIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdwYXN0ZScsIHR5cGU6IGJvb2xlYW5PcHRpb24gfVxuICAgICAgICBdKTtcbiAgICB9XG59XG5cbi8vIERyYWdUb0VsZW1lbnRcbmV4cG9ydCBjbGFzcyBEcmFnVG9FbGVtZW50T3B0aW9ucyBleHRlbmRzIE1vdXNlT3B0aW9ucyB7XG4gICAgY29uc3RydWN0b3IgKG9iaiwgdmFsaWRhdGUpIHtcbiAgICAgICAgc3VwZXIob2JqLCB2YWxpZGF0ZSk7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk9mZnNldFggPSBudWxsO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uT2Zmc2V0WSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fYXNzaWduRnJvbShvYmosIHZhbGlkYXRlKTtcbiAgICB9XG5cbiAgICBfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzKCkuY29uY2F0KFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2Rlc3RpbmF0aW9uT2Zmc2V0WCcsIHR5cGU6IGludGVnZXJPcHRpb24gfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2Rlc3RpbmF0aW9uT2Zmc2V0WScsIHR5cGU6IGludGVnZXJPcHRpb24gfVxuICAgICAgICBdKTtcbiAgICB9XG59XG5cbi8vUmVzaXplVG9GaXREZXZpY2VcbmV4cG9ydCBjbGFzcyBSZXNpemVUb0ZpdERldmljZU9wdGlvbnMgZXh0ZW5kcyBBc3NpZ25hYmxlIHtcbiAgICBjb25zdHJ1Y3RvciAob2JqLCB2YWxpZGF0ZSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMucG9ydHJhaXRPcmllbnRhdGlvbiA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2Fzc2lnbkZyb20ob2JqLCB2YWxpZGF0ZSk7XG4gICAgfVxuXG4gICAgX2dldEFzc2lnbmFibGVQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3BvcnRyYWl0T3JpZW50YXRpb24nLCB0eXBlOiBib29sZWFuT3B0aW9uIH1cbiAgICAgICAgXTtcbiAgICB9XG59XG5cbi8vQXNzZXJ0aW9uXG5leHBvcnQgY2xhc3MgQXNzZXJ0aW9uT3B0aW9ucyBleHRlbmRzIEFzc2lnbmFibGUge1xuICAgIGNvbnN0cnVjdG9yIChvYmosIHZhbGlkYXRlKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy50aW1lb3V0ICAgICAgICAgICAgICAgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuYWxsb3dVbmF3YWl0ZWRQcm9taXNlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fYXNzaWduRnJvbShvYmosIHZhbGlkYXRlKTtcbiAgICB9XG5cbiAgICBfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMgKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgeyBuYW1lOiAndGltZW91dCcsIHR5cGU6IHBvc2l0aXZlSW50ZWdlck9wdGlvbiB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnYWxsb3dVbmF3YWl0ZWRQcm9taXNlJywgdHlwZTogYm9vbGVhbk9wdGlvbiB9XG4gICAgICAgIF07XG4gICAgfVxufVxuIl19