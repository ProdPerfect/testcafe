"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const temp_directory_1 = __importDefault(require("../../../../../utils/temp-directory"));
const promisified_functions_1 = require("../../../../../utils/promisified-functions");
const mime_db_1 = __importDefault(require("mime-db"));
function getMimeTypes() {
    const mimeTypes = Object.keys(mime_db_1.default);
    return mimeTypes.filter(mimeType => {
        // @ts-ignore: Export of the 'mime-db' module has no index signature.
        const { extensions } = mime_db_1.default[mimeType];
        return extensions && extensions.length;
    }).join(',');
}
async function generatePreferences(profileDir, { marionettePort, config }) {
    const prefsFileName = path_1.default.join(profileDir, 'user.js');
    let prefs = [
        'user_pref("browser.link.open_newwindow.override.external", 2);',
        'user_pref("app.update.enabled", false);',
        'user_pref("app.update.auto", false);',
        'user_pref("app.update.mode", 0);',
        'user_pref("app.update.service.enabled", false);',
        'user_pref("browser.shell.checkDefaultBrowser", false);',
        'user_pref("browser.usedOnWindows10", true);',
        'user_pref("browser.rights.3.shown", true);',
        'user_pref("browser.startup.homepage_override.mstone","ignore");',
        'user_pref("browser.tabs.warnOnCloseOtherTabs", false);',
        'user_pref("browser.tabs.warnOnClose", false);',
        'user_pref("browser.sessionstore.resume_from_crash", false);',
        `user_pref("browser.helperApps.neverAsk.saveToDisk", "${getMimeTypes()}");`,
        `user_pref("pdfjs.disabled", true);`,
        'user_pref("toolkit.telemetry.reportingpolicy.firstRun", false);',
        'user_pref("toolkit.telemetry.enabled", false);',
        'user_pref("toolkit.telemetry.rejected", true);',
        'user_pref("datareporting.healthreport.uploadEnabled", false);',
        'user_pref("datareporting.healthreport.service.enabled", false);',
        'user_pref("datareporting.healthreport.service.firstRun", false);',
        'user_pref("datareporting.policy.dataSubmissionEnabled", false);',
        'user_pref("datareporting.policy.dataSubmissionPolicyBypassNotification", true);',
        'user_pref("app.shield.optoutstudies.enabled", false);',
        'user_pref("extensions.shield-recipe-client.enabled", false);',
        'user_pref("extensions.shield-recipe-client.first_run", false);',
        'user_pref("extensions.shield-recipe-client.startupExperimentPrefs.browser.newtabpage.activity-stream.enabled", false);',
        'user_pref("devtools.toolbox.host", "window");',
        'user_pref("devtools.toolbox.previousHost", "bottom");',
        'user_pref("signon.rememberSignons", false);',
        // NOTE: dom.min_background_timeout_value should be equal to dom.min_timeout_value
        'user_pref("dom.min_background_timeout_value", 4);',
        'user_pref("dom.timeout.throttling_delay", 0);',
        'user_pref("dom.timeout.budget_throttling_max_delay", 0);',
        // NOTE: We set the foreground configuration for the background budget throttling parameters
        'user_pref("dom.timeout.background_throttling_max_budget", -1);',
        'user_pref("dom.timeout.background_budget_regeneration_rate", 1);',
        'user_pref("security.enterprise_roots.enabled", true);'
    ];
    if (marionettePort) {
        prefs = prefs.concat([
            `user_pref("marionette.port", ${marionettePort});`,
            'user_pref("marionette.enabled", true);'
        ]);
    }
    if (config.disableMultiprocessing) {
        prefs = prefs.concat([
            'user_pref("browser.tabs.remote.autostart", false);',
            'user_pref("browser.tabs.remote.autostart.2", false);',
        ]);
    }
    await promisified_functions_1.writeFile(prefsFileName, prefs.join('\n'));
}
async function default_1(runtimeInfo) {
    const tmpDir = await temp_directory_1.default.createDirectory('firefox-profile');
    await generatePreferences(tmpDir.path, runtimeInfo);
    return tmpDir;
}
exports.default = default_1;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXRlbXAtcHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2RlZGljYXRlZC9maXJlZm94L2NyZWF0ZS10ZW1wLXByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIseUZBQWdFO0FBQ2hFLHNGQUF1RTtBQUN2RSxzREFBeUI7QUFFekIsU0FBUyxZQUFZO0lBQ2pCLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQUUsQ0FBQyxDQUFDO0lBRWxDLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUMvQixxRUFBcUU7UUFDckUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLGlCQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEMsT0FBTyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakIsQ0FBQztBQUVELEtBQUssVUFBVSxtQkFBbUIsQ0FBRSxVQUFrQixFQUFFLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBMkM7SUFDdkgsTUFBTSxhQUFhLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFdkQsSUFBSSxLQUFLLEdBQUc7UUFDUixnRUFBZ0U7UUFDaEUseUNBQXlDO1FBQ3pDLHNDQUFzQztRQUN0QyxrQ0FBa0M7UUFDbEMsaURBQWlEO1FBQ2pELHdEQUF3RDtRQUN4RCw2Q0FBNkM7UUFDN0MsNENBQTRDO1FBQzVDLGlFQUFpRTtRQUNqRSx3REFBd0Q7UUFDeEQsK0NBQStDO1FBQy9DLDZEQUE2RDtRQUM3RCx3REFBd0QsWUFBWSxFQUFFLEtBQUs7UUFDM0Usb0NBQW9DO1FBQ3BDLGlFQUFpRTtRQUNqRSxnREFBZ0Q7UUFDaEQsZ0RBQWdEO1FBQ2hELCtEQUErRDtRQUMvRCxpRUFBaUU7UUFDakUsa0VBQWtFO1FBQ2xFLGlFQUFpRTtRQUNqRSxpRkFBaUY7UUFDakYsdURBQXVEO1FBQ3ZELDhEQUE4RDtRQUM5RCxnRUFBZ0U7UUFDaEUsd0hBQXdIO1FBQ3hILCtDQUErQztRQUMvQyx1REFBdUQ7UUFDdkQsNkNBQTZDO1FBQzdDLGtGQUFrRjtRQUNsRixtREFBbUQ7UUFDbkQsK0NBQStDO1FBQy9DLDBEQUEwRDtRQUMxRCw0RkFBNEY7UUFDNUYsZ0VBQWdFO1FBQ2hFLGtFQUFrRTtRQUNsRSx1REFBdUQ7S0FDMUQsQ0FBQztJQUVGLElBQUksY0FBYyxFQUFFO1FBQ2hCLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ2pCLGdDQUFnQyxjQUFjLElBQUk7WUFDbEQsd0NBQXdDO1NBQzNDLENBQUMsQ0FBQztLQUNOO0lBRUQsSUFBSSxNQUFNLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDakIsb0RBQW9EO1lBQ3BELHNEQUFzRDtTQUN6RCxDQUFDLENBQUM7S0FDTjtJQUVELE1BQU0saUNBQVMsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3JELENBQUM7QUFFYyxLQUFLLG9CQUFXLFdBQWdCO0lBQzNDLE1BQU0sTUFBTSxHQUFHLE1BQU0sd0JBQWEsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUV0RSxNQUFNLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFcEQsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQU5ELDRCQU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgVGVtcERpcmVjdG9yeSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlscy90ZW1wLWRpcmVjdG9yeSc7XG5pbXBvcnQgeyB3cml0ZUZpbGUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlscy9wcm9taXNpZmllZC1mdW5jdGlvbnMnO1xuaW1wb3J0IGRiIGZyb20gJ21pbWUtZGInO1xuXG5mdW5jdGlvbiBnZXRNaW1lVHlwZXMgKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbWltZVR5cGVzID0gT2JqZWN0LmtleXMoZGIpO1xuXG4gICAgcmV0dXJuIG1pbWVUeXBlcy5maWx0ZXIobWltZVR5cGUgPT4ge1xuICAgICAgICAvLyBAdHMtaWdub3JlOiBFeHBvcnQgb2YgdGhlICdtaW1lLWRiJyBtb2R1bGUgaGFzIG5vIGluZGV4IHNpZ25hdHVyZS5cbiAgICAgICAgY29uc3QgeyBleHRlbnNpb25zIH0gPSBkYlttaW1lVHlwZV07XG5cbiAgICAgICAgcmV0dXJuIGV4dGVuc2lvbnMgJiYgZXh0ZW5zaW9ucy5sZW5ndGg7XG4gICAgfSkuam9pbignLCcpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVByZWZlcmVuY2VzIChwcm9maWxlRGlyOiBzdHJpbmcsIHsgbWFyaW9uZXR0ZVBvcnQsIGNvbmZpZyB9OiB7IG1hcmlvbmV0dGVQb3J0OiBudW1iZXI7IGNvbmZpZzogYW55IH0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwcmVmc0ZpbGVOYW1lID0gcGF0aC5qb2luKHByb2ZpbGVEaXIsICd1c2VyLmpzJyk7XG5cbiAgICBsZXQgcHJlZnMgPSBbXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLmxpbmsub3Blbl9uZXd3aW5kb3cub3ZlcnJpZGUuZXh0ZXJuYWxcIiwgMik7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImFwcC51cGRhdGUuZW5hYmxlZFwiLCBmYWxzZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImFwcC51cGRhdGUuYXV0b1wiLCBmYWxzZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImFwcC51cGRhdGUubW9kZVwiLCAwKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiYXBwLnVwZGF0ZS5zZXJ2aWNlLmVuYWJsZWRcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnNoZWxsLmNoZWNrRGVmYXVsdEJyb3dzZXJcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnVzZWRPbldpbmRvd3MxMFwiLCB0cnVlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiYnJvd3Nlci5yaWdodHMuMy5zaG93blwiLCB0cnVlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiYnJvd3Nlci5zdGFydHVwLmhvbWVwYWdlX292ZXJyaWRlLm1zdG9uZVwiLFwiaWdub3JlXCIpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnRhYnMud2Fybk9uQ2xvc2VPdGhlclRhYnNcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnRhYnMud2Fybk9uQ2xvc2VcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnNlc3Npb25zdG9yZS5yZXN1bWVfZnJvbV9jcmFzaFwiLCBmYWxzZSk7JyxcbiAgICAgICAgYHVzZXJfcHJlZihcImJyb3dzZXIuaGVscGVyQXBwcy5uZXZlckFzay5zYXZlVG9EaXNrXCIsIFwiJHtnZXRNaW1lVHlwZXMoKX1cIik7YCxcbiAgICAgICAgYHVzZXJfcHJlZihcInBkZmpzLmRpc2FibGVkXCIsIHRydWUpO2AsXG4gICAgICAgICd1c2VyX3ByZWYoXCJ0b29sa2l0LnRlbGVtZXRyeS5yZXBvcnRpbmdwb2xpY3kuZmlyc3RSdW5cIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJ0b29sa2l0LnRlbGVtZXRyeS5lbmFibGVkXCIsIGZhbHNlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwidG9vbGtpdC50ZWxlbWV0cnkucmVqZWN0ZWRcIiwgdHJ1ZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImRhdGFyZXBvcnRpbmcuaGVhbHRocmVwb3J0LnVwbG9hZEVuYWJsZWRcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJkYXRhcmVwb3J0aW5nLmhlYWx0aHJlcG9ydC5zZXJ2aWNlLmVuYWJsZWRcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJkYXRhcmVwb3J0aW5nLmhlYWx0aHJlcG9ydC5zZXJ2aWNlLmZpcnN0UnVuXCIsIGZhbHNlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiZGF0YXJlcG9ydGluZy5wb2xpY3kuZGF0YVN1Ym1pc3Npb25FbmFibGVkXCIsIGZhbHNlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiZGF0YXJlcG9ydGluZy5wb2xpY3kuZGF0YVN1Ym1pc3Npb25Qb2xpY3lCeXBhc3NOb3RpZmljYXRpb25cIiwgdHJ1ZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImFwcC5zaGllbGQub3B0b3V0c3R1ZGllcy5lbmFibGVkXCIsIGZhbHNlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiZXh0ZW5zaW9ucy5zaGllbGQtcmVjaXBlLWNsaWVudC5lbmFibGVkXCIsIGZhbHNlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiZXh0ZW5zaW9ucy5zaGllbGQtcmVjaXBlLWNsaWVudC5maXJzdF9ydW5cIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJleHRlbnNpb25zLnNoaWVsZC1yZWNpcGUtY2xpZW50LnN0YXJ0dXBFeHBlcmltZW50UHJlZnMuYnJvd3Nlci5uZXd0YWJwYWdlLmFjdGl2aXR5LXN0cmVhbS5lbmFibGVkXCIsIGZhbHNlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiZGV2dG9vbHMudG9vbGJveC5ob3N0XCIsIFwid2luZG93XCIpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJkZXZ0b29scy50b29sYm94LnByZXZpb3VzSG9zdFwiLCBcImJvdHRvbVwiKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwic2lnbm9uLnJlbWVtYmVyU2lnbm9uc1wiLCBmYWxzZSk7JyxcbiAgICAgICAgLy8gTk9URTogZG9tLm1pbl9iYWNrZ3JvdW5kX3RpbWVvdXRfdmFsdWUgc2hvdWxkIGJlIGVxdWFsIHRvIGRvbS5taW5fdGltZW91dF92YWx1ZVxuICAgICAgICAndXNlcl9wcmVmKFwiZG9tLm1pbl9iYWNrZ3JvdW5kX3RpbWVvdXRfdmFsdWVcIiwgNCk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImRvbS50aW1lb3V0LnRocm90dGxpbmdfZGVsYXlcIiwgMCk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImRvbS50aW1lb3V0LmJ1ZGdldF90aHJvdHRsaW5nX21heF9kZWxheVwiLCAwKTsnLFxuICAgICAgICAvLyBOT1RFOiBXZSBzZXQgdGhlIGZvcmVncm91bmQgY29uZmlndXJhdGlvbiBmb3IgdGhlIGJhY2tncm91bmQgYnVkZ2V0IHRocm90dGxpbmcgcGFyYW1ldGVyc1xuICAgICAgICAndXNlcl9wcmVmKFwiZG9tLnRpbWVvdXQuYmFja2dyb3VuZF90aHJvdHRsaW5nX21heF9idWRnZXRcIiwgLTEpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJkb20udGltZW91dC5iYWNrZ3JvdW5kX2J1ZGdldF9yZWdlbmVyYXRpb25fcmF0ZVwiLCAxKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwic2VjdXJpdHkuZW50ZXJwcmlzZV9yb290cy5lbmFibGVkXCIsIHRydWUpOydcbiAgICBdO1xuXG4gICAgaWYgKG1hcmlvbmV0dGVQb3J0KSB7XG4gICAgICAgIHByZWZzID0gcHJlZnMuY29uY2F0KFtcbiAgICAgICAgICAgIGB1c2VyX3ByZWYoXCJtYXJpb25ldHRlLnBvcnRcIiwgJHttYXJpb25ldHRlUG9ydH0pO2AsXG4gICAgICAgICAgICAndXNlcl9wcmVmKFwibWFyaW9uZXR0ZS5lbmFibGVkXCIsIHRydWUpOydcbiAgICAgICAgXSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5kaXNhYmxlTXVsdGlwcm9jZXNzaW5nKSB7XG4gICAgICAgIHByZWZzID0gcHJlZnMuY29uY2F0KFtcbiAgICAgICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnRhYnMucmVtb3RlLmF1dG9zdGFydFwiLCBmYWxzZSk7JyxcbiAgICAgICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnRhYnMucmVtb3RlLmF1dG9zdGFydC4yXCIsIGZhbHNlKTsnLFxuICAgICAgICBdKTtcbiAgICB9XG5cbiAgICBhd2FpdCB3cml0ZUZpbGUocHJlZnNGaWxlTmFtZSwgcHJlZnMuam9pbignXFxuJykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAocnVudGltZUluZm86IGFueSk6IFByb21pc2U8VGVtcERpcmVjdG9yeT4ge1xuICAgIGNvbnN0IHRtcERpciA9IGF3YWl0IFRlbXBEaXJlY3RvcnkuY3JlYXRlRGlyZWN0b3J5KCdmaXJlZm94LXByb2ZpbGUnKTtcblxuICAgIGF3YWl0IGdlbmVyYXRlUHJlZmVyZW5jZXModG1wRGlyLnBhdGgsIHJ1bnRpbWVJbmZvKTtcblxuICAgIHJldHVybiB0bXBEaXI7XG59XG4iXX0=