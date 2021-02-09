"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const make_dir_1 = __importDefault(require("make-dir"));
const temp_directory_1 = __importDefault(require("../../../../../utils/temp-directory"));
const promisified_functions_1 = require("../../../../../utils/promisified-functions");
async function default_1(proxyHostName, disableMultipleWindows) {
    const tempDir = await temp_directory_1.default.createDirectory('chrome-profile');
    const profileDirName = path_1.default.join(tempDir.path, 'Default');
    await make_dir_1.default(profileDirName);
    const preferences = {
        'credentials_enable_service': false,
        'devtools': {
            'preferences': {
                'currentDockState': '"undocked"',
                'lastDockState': '"bottom"'
            }
        },
        'plugins': {
            'always_open_pdf_externally': true
        },
        'profile': {
            'content_settings': {
                'exceptions': Object.assign({ 'automatic_downloads': {
                        [proxyHostName]: { setting: 1 }
                    } }, !disableMultipleWindows && {
                    'popups': {
                        [proxyHostName]: { setting: 1 }
                    }
                })
            },
            'password_manager_enabled': false
        },
        'translate': {
            'enabled': false
        }
    };
    await promisified_functions_1.writeFile(path_1.default.join(profileDirName, 'Preferences'), JSON.stringify(preferences));
    await promisified_functions_1.writeFile(path_1.default.join(tempDir.path, 'First Run'), '');
    return tempDir;
}
exports.default = default_1;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXRlbXAtcHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2RlZGljYXRlZC9jaHJvbWUvY3JlYXRlLXRlbXAtcHJvZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4Qix3REFBK0I7QUFDL0IseUZBQWdFO0FBQ2hFLHNGQUF1RTtBQUV4RCxLQUFLLG9CQUFXLGFBQXFCLEVBQUUsc0JBQStCO0lBQ2pGLE1BQU0sT0FBTyxHQUFVLE1BQU0sd0JBQWEsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUM3RSxNQUFNLGNBQWMsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFMUQsTUFBTSxrQkFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRTlCLE1BQU0sV0FBVyxHQUFHO1FBQ2hCLDRCQUE0QixFQUFFLEtBQUs7UUFFbkMsVUFBVSxFQUFFO1lBQ1IsYUFBYSxFQUFFO2dCQUNYLGtCQUFrQixFQUFFLFlBQVk7Z0JBQ2hDLGVBQWUsRUFBSyxVQUFVO2FBQ2pDO1NBQ0o7UUFDRCxTQUFTLEVBQUU7WUFDUCw0QkFBNEIsRUFBRSxJQUFJO1NBQ3JDO1FBQ0QsU0FBUyxFQUFFO1lBQ1Asa0JBQWtCLEVBQUU7Z0JBQ2hCLFlBQVksa0JBQ1IscUJBQXFCLEVBQUU7d0JBQ25CLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFO3FCQUNsQyxJQUNFLENBQUMsc0JBQXNCLElBQUk7b0JBQzFCLFFBQVEsRUFBRTt3QkFDTixDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRTtxQkFDbEM7aUJBQ0osQ0FDSjthQUNKO1lBRUQsMEJBQTBCLEVBQUUsS0FBSztTQUNwQztRQUVELFdBQVcsRUFBRTtZQUNULFNBQVMsRUFBRSxLQUFLO1NBQ25CO0tBQ0osQ0FBQztJQUVGLE1BQU0saUNBQVMsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDdkYsTUFBTSxpQ0FBUyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUUxRCxPQUFPLE9BQU8sQ0FBQztBQUNuQixDQUFDO0FBNUNELDRCQTRDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG1ha2VEaXIgZnJvbSAnbWFrZS1kaXInO1xuaW1wb3J0IFRlbXBEaXJlY3RvcnkgZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMvdGVtcC1kaXJlY3RvcnknO1xuaW1wb3J0IHsgd3JpdGVGaWxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMvcHJvbWlzaWZpZWQtZnVuY3Rpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHByb3h5SG9zdE5hbWU6IHN0cmluZywgZGlzYWJsZU11bHRpcGxlV2luZG93czogYm9vbGVhbik6IFByb21pc2U8VGVtcERpcmVjdG9yeT4ge1xuICAgIGNvbnN0IHRlbXBEaXIgICAgICAgID0gYXdhaXQgVGVtcERpcmVjdG9yeS5jcmVhdGVEaXJlY3RvcnkoJ2Nocm9tZS1wcm9maWxlJyk7XG4gICAgY29uc3QgcHJvZmlsZURpck5hbWUgPSBwYXRoLmpvaW4odGVtcERpci5wYXRoLCAnRGVmYXVsdCcpO1xuXG4gICAgYXdhaXQgbWFrZURpcihwcm9maWxlRGlyTmFtZSk7XG5cbiAgICBjb25zdCBwcmVmZXJlbmNlcyA9IHtcbiAgICAgICAgJ2NyZWRlbnRpYWxzX2VuYWJsZV9zZXJ2aWNlJzogZmFsc2UsXG5cbiAgICAgICAgJ2RldnRvb2xzJzoge1xuICAgICAgICAgICAgJ3ByZWZlcmVuY2VzJzoge1xuICAgICAgICAgICAgICAgICdjdXJyZW50RG9ja1N0YXRlJzogJ1widW5kb2NrZWRcIicsXG4gICAgICAgICAgICAgICAgJ2xhc3REb2NrU3RhdGUnOiAgICAnXCJib3R0b21cIidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ3BsdWdpbnMnOiB7XG4gICAgICAgICAgICAnYWx3YXlzX29wZW5fcGRmX2V4dGVybmFsbHknOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdwcm9maWxlJzoge1xuICAgICAgICAgICAgJ2NvbnRlbnRfc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICAgICAgJ2V4Y2VwdGlvbnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICdhdXRvbWF0aWNfZG93bmxvYWRzJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgW3Byb3h5SG9zdE5hbWVdOiB7IHNldHRpbmc6IDEgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAuLi4hZGlzYWJsZU11bHRpcGxlV2luZG93cyAmJiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAncG9wdXBzJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwcm94eUhvc3ROYW1lXTogeyBzZXR0aW5nOiAxIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAncGFzc3dvcmRfbWFuYWdlcl9lbmFibGVkJzogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAndHJhbnNsYXRlJzoge1xuICAgICAgICAgICAgJ2VuYWJsZWQnOiBmYWxzZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGF3YWl0IHdyaXRlRmlsZShwYXRoLmpvaW4ocHJvZmlsZURpck5hbWUsICdQcmVmZXJlbmNlcycpLCBKU09OLnN0cmluZ2lmeShwcmVmZXJlbmNlcykpO1xuICAgIGF3YWl0IHdyaXRlRmlsZShwYXRoLmpvaW4odGVtcERpci5wYXRoLCAnRmlyc3QgUnVuJyksICcnKTtcblxuICAgIHJldHVybiB0ZW1wRGlyO1xufVxuIl19