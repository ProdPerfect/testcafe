"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
const types_1 = require("../../errors/types");
const runtime_1 = require("../../errors/runtime");
async function default_1(optionName, options) {
    const metaOptions = await base_1.default(options, {
        skipOptionValueTypeConversion: true,
        async onOptionParsed(key, value) {
            if (!key || !value)
                throw new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.optionValueIsNotValidKeyValue, optionName);
            return String(value);
        }
    });
    if (Object.keys(metaOptions).length === 0)
        throw new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.optionValueIsNotValidKeyValue, optionName);
    return metaOptions;
}
exports.default = default_1;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9nZXQtb3B0aW9ucy9tZXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQW9DO0FBQ3BDLDhDQUFvRDtBQUNwRCxrREFBb0Q7QUFHckMsS0FBSyxvQkFBVyxVQUFrQixFQUFFLE9BQWU7SUFDOUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxjQUFjLENBQUMsT0FBTyxFQUFFO1FBQzlDLDZCQUE2QixFQUFFLElBQUk7UUFFbkMsS0FBSyxDQUFDLGNBQWMsQ0FBRSxHQUFXLEVBQUUsS0FBYTtZQUM1QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSztnQkFDZCxNQUFNLElBQUksc0JBQVksQ0FBQyxzQkFBYyxDQUFDLDZCQUE2QixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRXJGLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLENBQUM7S0FDSixDQUFDLENBQUM7SUFFSCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDckMsTUFBTSxJQUFJLHNCQUFZLENBQUMsc0JBQWMsQ0FBQyw2QkFBNkIsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUVyRixPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDO0FBaEJELDRCQWdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYXNlR2V0T3B0aW9ucyBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgUlVOVElNRV9FUlJPUlMgfSBmcm9tICcuLi8uLi9lcnJvcnMvdHlwZXMnO1xuaW1wb3J0IHsgR2VuZXJhbEVycm9yIH0gZnJvbSAnLi4vLi4vZXJyb3JzL3J1bnRpbWUnO1xuaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gJy4uLy4uL2NvbmZpZ3VyYXRpb24vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChvcHRpb25OYW1lOiBzdHJpbmcsIG9wdGlvbnM6IHN0cmluZyk6IFByb21pc2U8RGljdGlvbmFyeTxzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuPj4ge1xuICAgIGNvbnN0IG1ldGFPcHRpb25zID0gYXdhaXQgYmFzZUdldE9wdGlvbnMob3B0aW9ucywge1xuICAgICAgICBza2lwT3B0aW9uVmFsdWVUeXBlQ29udmVyc2lvbjogdHJ1ZSxcblxuICAgICAgICBhc3luYyBvbk9wdGlvblBhcnNlZCAoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICgha2V5IHx8ICF2YWx1ZSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKFJVTlRJTUVfRVJST1JTLm9wdGlvblZhbHVlSXNOb3RWYWxpZEtleVZhbHVlLCBvcHRpb25OYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChPYmplY3Qua2V5cyhtZXRhT3B0aW9ucykubGVuZ3RoID09PSAwKVxuICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKFJVTlRJTUVfRVJST1JTLm9wdGlvblZhbHVlSXNOb3RWYWxpZEtleVZhbHVlLCBvcHRpb25OYW1lKTtcblxuICAgIHJldHVybiBtZXRhT3B0aW9ucztcbn1cbiJdfQ==