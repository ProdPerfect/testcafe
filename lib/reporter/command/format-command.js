"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_formatter_1 = require("./command-formatter");
function formatCommand(command, result) {
    const commandFormatter = new command_formatter_1.CommandFormatter(command, result);
    return commandFormatter.format();
}
exports.default = formatCommand;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LWNvbW1hbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVwb3J0ZXIvY29tbWFuZC9mb3JtYXQtY29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJEQUF1RDtBQUV2RCxTQUF3QixhQUFhLENBQUUsT0FBZ0IsRUFBRSxNQUFlO0lBQ3BFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxvQ0FBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFL0QsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNyQyxDQUFDO0FBSkQsZ0NBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tYW5kLCBGb3JtYXR0ZWRDb21tYW5kIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IENvbW1hbmRGb3JtYXR0ZXIgfSBmcm9tICcuL2NvbW1hbmQtZm9ybWF0dGVyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9ybWF0Q29tbWFuZCAoY29tbWFuZDogQ29tbWFuZCwgcmVzdWx0OiB1bmtub3duKTogRm9ybWF0dGVkQ29tbWFuZCB7XG4gICAgY29uc3QgY29tbWFuZEZvcm1hdHRlciA9IG5ldyBDb21tYW5kRm9ybWF0dGVyKGNvbW1hbmQsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4gY29tbWFuZEZvcm1hdHRlci5mb3JtYXQoKTtcbn1cbiJdfQ==