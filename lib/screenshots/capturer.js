"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const testcafe_browser_tools_1 = require("testcafe-browser-tools");
const crop_1 = require("./crop");
const async_queue_1 = require("../utils/async-queue");
const warning_message_1 = __importDefault(require("../notifications/warning-message"));
const escape_user_agent_1 = __importDefault(require("../utils/escape-user-agent"));
const correct_file_path_1 = __importDefault(require("../utils/correct-file-path"));
const promisified_functions_1 = require("../utils/promisified-functions");
class Capturer {
    constructor(baseScreenshotsPath, testEntry, connection, pathPattern, fullPage, warningLog) {
        this.enabled = !!baseScreenshotsPath;
        this.baseScreenshotsPath = baseScreenshotsPath;
        this.testEntry = testEntry;
        this.provider = connection.provider;
        this.browserId = connection.id;
        this.warningLog = warningLog;
        this.pathPattern = pathPattern;
        this.fullPage = fullPage;
    }
    static _getDimensionWithoutScrollbar(fullDimension, documentDimension, bodyDimension) {
        if (bodyDimension > fullDimension)
            return documentDimension;
        if (documentDimension > fullDimension)
            return bodyDimension;
        return Math.max(documentDimension, bodyDimension);
    }
    static _getCropDimensions(cropDimensions, pageDimensions) {
        if (!cropDimensions || !pageDimensions)
            return null;
        const { dpr } = pageDimensions;
        const { top, left, bottom, right } = cropDimensions;
        return {
            top: Math.round(top * dpr),
            left: Math.round(left * dpr),
            bottom: Math.round(bottom * dpr),
            right: Math.round(right * dpr)
        };
    }
    static _getClientAreaDimensions(pageDimensions) {
        if (!pageDimensions)
            return null;
        const { innerWidth, documentWidth, bodyWidth, innerHeight, documentHeight, bodyHeight, dpr } = pageDimensions;
        return {
            width: Math.floor(Capturer._getDimensionWithoutScrollbar(innerWidth, documentWidth, bodyWidth) * dpr),
            height: Math.floor(Capturer._getDimensionWithoutScrollbar(innerHeight, documentHeight, bodyHeight) * dpr)
        };
    }
    static async _isScreenshotCaptured(screenshotPath) {
        try {
            const stats = await promisified_functions_1.stat(screenshotPath);
            return stats.isFile();
        }
        catch (e) {
            return false;
        }
    }
    _joinWithBaseScreenshotPath(path) {
        return path_1.join(this.baseScreenshotsPath, path);
    }
    _incrementFileIndexes(forError) {
        if (forError)
            this.pathPattern.data.errorFileIndex++;
        else
            this.pathPattern.data.fileIndex++;
    }
    _getCustomScreenshotPath(customPath) {
        const correctedCustomPath = correct_file_path_1.default(customPath);
        return this._joinWithBaseScreenshotPath(correctedCustomPath);
    }
    _getScreenshotPath(forError) {
        const path = this.pathPattern.getPath(forError);
        this._incrementFileIndexes(forError);
        return this._joinWithBaseScreenshotPath(path);
    }
    _getThumbnailPath(screenshotPath) {
        const imageName = path_1.basename(screenshotPath);
        const imageDir = path_1.dirname(screenshotPath);
        return path_1.join(imageDir, 'thumbnails', imageName);
    }
    async _takeScreenshot({ filePath, pageWidth, pageHeight, fullPage = this.fullPage }) {
        await this.provider.takeScreenshot(this.browserId, filePath, pageWidth, pageHeight, fullPage);
    }
    async _capture(forError, { pageDimensions, cropDimensions, markSeed, customPath, fullPage } = {}) {
        if (!this.enabled)
            return null;
        const screenshotPath = customPath ? this._getCustomScreenshotPath(customPath) : this._getScreenshotPath(forError);
        const thumbnailPath = this._getThumbnailPath(screenshotPath);
        if (async_queue_1.isInQueue(screenshotPath))
            this.warningLog.addWarning(warning_message_1.default.screenshotRewritingError, screenshotPath);
        await async_queue_1.addToQueue(screenshotPath, async () => {
            const clientAreaDimensions = Capturer._getClientAreaDimensions(pageDimensions);
            const { width: pageWidth, height: pageHeight } = clientAreaDimensions || {};
            const takeScreenshotOptions = {
                filePath: screenshotPath,
                pageWidth,
                pageHeight,
                fullPage
            };
            await this._takeScreenshot(takeScreenshotOptions);
            if (!await Capturer._isScreenshotCaptured(screenshotPath))
                return;
            const image = await promisified_functions_1.readPngFile(screenshotPath);
            const croppedImage = await crop_1.cropScreenshot(image, {
                markSeed,
                clientAreaDimensions,
                path: screenshotPath,
                cropDimensions: Capturer._getCropDimensions(cropDimensions, pageDimensions)
            });
            if (croppedImage)
                await promisified_functions_1.writePng(screenshotPath, croppedImage);
            await testcafe_browser_tools_1.generateThumbnail(screenshotPath, thumbnailPath);
        });
        const testRunId = this.testEntry.testRuns[this.browserId].id;
        const userAgent = escape_user_agent_1.default(this.pathPattern.data.parsedUserAgent.prettyUserAgent);
        const quarantineAttempt = this.pathPattern.data.quarantineAttempt;
        const takenOnFail = forError;
        const screenshot = {
            testRunId,
            screenshotPath,
            thumbnailPath,
            userAgent,
            quarantineAttempt,
            takenOnFail
        };
        this.testEntry.screenshots.push(screenshot);
        return screenshotPath;
    }
    async captureAction(options) {
        return await this._capture(false, options);
    }
    async captureError(options) {
        return await this._capture(true, options);
    }
}
exports.default = Capturer;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdHVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NyZWVuc2hvdHMvY2FwdHVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrQkFBMkQ7QUFDM0QsbUVBQTJEO0FBQzNELGlDQUF3QztBQUN4QyxzREFBNkQ7QUFDN0QsdUZBQStEO0FBQy9ELG1GQUF5RDtBQUN6RCxtRkFBeUQ7QUFDekQsMEVBQTZFO0FBRzdFLE1BQXFCLFFBQVE7SUFDekIsWUFBYSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsVUFBVTtRQUN0RixJQUFJLENBQUMsT0FBTyxHQUFlLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztRQUNqRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7UUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBYSxTQUFTLENBQUM7UUFDckMsSUFBSSxDQUFDLFFBQVEsR0FBYyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQy9DLElBQUksQ0FBQyxTQUFTLEdBQWEsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxHQUFZLFVBQVUsQ0FBQztRQUN0QyxJQUFJLENBQUMsV0FBVyxHQUFXLFdBQVcsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFjLFFBQVEsQ0FBQztJQUN4QyxDQUFDO0lBRUQsTUFBTSxDQUFDLDZCQUE2QixDQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxhQUFhO1FBQ2pGLElBQUksYUFBYSxHQUFHLGFBQWE7WUFDN0IsT0FBTyxpQkFBaUIsQ0FBQztRQUU3QixJQUFJLGlCQUFpQixHQUFHLGFBQWE7WUFDakMsT0FBTyxhQUFhLENBQUM7UUFFekIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxNQUFNLENBQUMsa0JBQWtCLENBQUUsY0FB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LENBQUM7UUFFNUMsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUUsT0FBTztRQUN4QixPQUFPLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUUsT0FBTztRQUN2QixPQUFPLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUNKO0FBcktELDJCQXFLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4gYXMgam9pblBhdGgsIGRpcm5hbWUsIGJhc2VuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBnZW5lcmF0ZVRodW1ibmFpbCB9IGZyb20gJ3Rlc3RjYWZlLWJyb3dzZXItdG9vbHMnO1xuaW1wb3J0IHsgY3JvcFNjcmVlbnNob3QgfSBmcm9tICcuL2Nyb3AnO1xuaW1wb3J0IHsgaXNJblF1ZXVlLCBhZGRUb1F1ZXVlIH0gZnJvbSAnLi4vdXRpbHMvYXN5bmMtcXVldWUnO1xuaW1wb3J0IFdBUk5JTkdfTUVTU0FHRSBmcm9tICcuLi9ub3RpZmljYXRpb25zL3dhcm5pbmctbWVzc2FnZSc7XG5pbXBvcnQgZXNjYXBlVXNlckFnZW50IGZyb20gJy4uL3V0aWxzL2VzY2FwZS11c2VyLWFnZW50JztcbmltcG9ydCBjb3JyZWN0RmlsZVBhdGggZnJvbSAnLi4vdXRpbHMvY29ycmVjdC1maWxlLXBhdGgnO1xuaW1wb3J0IHsgcmVhZFBuZ0ZpbGUsIHN0YXQsIHdyaXRlUG5nIH0gZnJvbSAnLi4vdXRpbHMvcHJvbWlzaWZpZWQtZnVuY3Rpb25zJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYXB0dXJlciB7XG4gICAgY29uc3RydWN0b3IgKGJhc2VTY3JlZW5zaG90c1BhdGgsIHRlc3RFbnRyeSwgY29ubmVjdGlvbiwgcGF0aFBhdHRlcm4sIGZ1bGxQYWdlLCB3YXJuaW5nTG9nKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCAgICAgICAgICAgICA9ICEhYmFzZVNjcmVlbnNob3RzUGF0aDtcbiAgICAgICAgdGhpcy5iYXNlU2NyZWVuc2hvdHNQYXRoID0gYmFzZVNjcmVlbnNob3RzUGF0aDtcbiAgICAgICAgdGhpcy50ZXN0RW50cnkgICAgICAgICAgID0gdGVzdEVudHJ5O1xuICAgICAgICB0aGlzLnByb3ZpZGVyICAgICAgICAgICAgPSBjb25uZWN0aW9uLnByb3ZpZGVyO1xuICAgICAgICB0aGlzLmJyb3dzZXJJZCAgICAgICAgICAgPSBjb25uZWN0aW9uLmlkO1xuICAgICAgICB0aGlzLndhcm5pbmdMb2cgICAgICAgICAgPSB3YXJuaW5nTG9nO1xuICAgICAgICB0aGlzLnBhdGhQYXR0ZXJuICAgICAgICAgPSBwYXRoUGF0dGVybjtcbiAgICAgICAgdGhpcy5mdWxsUGFnZSAgICAgICAgICAgID0gZnVsbFBhZ2U7XG4gICAgfVxuXG4gICAgc3RhdGljIF9nZXREaW1lbnNpb25XaXRob3V0U2Nyb2xsYmFyIChmdWxsRGltZW5zaW9uLCBkb2N1bWVudERpbWVuc2lvbiwgYm9keURpbWVuc2lvbikge1xuICAgICAgICBpZiAoYm9keURpbWVuc2lvbiA+IGZ1bGxEaW1lbnNpb24pXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnREaW1lbnNpb247XG5cbiAgICAgICAgaWYgKGRvY3VtZW50RGltZW5zaW9uID4gZnVsbERpbWVuc2lvbilcbiAgICAgICAgICAgIHJldHVybiBib2R5RGltZW5zaW9uO1xuXG4gICAgICAgIHJldHVybiBNYXRoLm1heChkb2N1bWVudERpbWVuc2lvbiwgYm9keURpbWVuc2lvbik7XG4gICAgfVxuXG4gICAgc3RhdGljIF9nZXRDcm9wRGltZW5zaW9ucyAoY3JvcERpbWVuc2lvbnMsIHBhZ2VEaW1lbnNpb25zKSB7XG4gICAgICAgIGlmICghY3JvcERpbWVuc2lvbnMgfHwgIXBhZ2VEaW1lbnNpb25zKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgeyBkcHIgfSAgICAgICAgICAgICAgICAgICAgICA9IHBhZ2VEaW1lbnNpb25zO1xuICAgICAgICBjb25zdCB7IHRvcCwgbGVmdCwgYm90dG9tLCByaWdodCB9ID0gY3JvcERpbWVuc2lvbnM7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogICAgTWF0aC5yb3VuZCh0b3AgKiBkcHIpLFxuICAgICAgICAgICAgbGVmdDogICBNYXRoLnJvdW5kKGxlZnQgKiBkcHIpLFxuICAgICAgICAgICAgYm90dG9tOiBNYXRoLnJvdW5kKGJvdHRvbSAqIGRwciksXG4gICAgICAgICAgICByaWdodDogIE1hdGgucm91bmQocmlnaHQgKiBkcHIpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIF9nZXRDbGllbnRBcmVhRGltZW5zaW9ucyAocGFnZURpbWVuc2lvbnMpIHtcbiAgICAgICAgaWYgKCFwYWdlRGltZW5zaW9ucylcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHsgaW5uZXJXaWR0aCwgZG9jdW1lbnRXaWR0aCwgYm9keVdpZHRoLCBpbm5lckhlaWdodCwgZG9jdW1lbnRIZWlnaHQsIGJvZHlIZWlnaHQsIGRwciB9ID0gcGFnZURpbWVuc2lvbnM7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiAgTWF0aC5mbG9vcihDYXB0dXJlci5fZ2V0RGltZW5zaW9uV2l0aG91dFNjcm9sbGJhcihpbm5lcldpZHRoLCBkb2N1bWVudFdpZHRoLCBib2R5V2lkdGgpICogZHByKSxcbiAgICAgICAgICAgIGhlaWdodDogTWF0aC5mbG9vcihDYXB0dXJlci5fZ2V0RGltZW5zaW9uV2l0aG91dFNjcm9sbGJhcihpbm5lckhlaWdodCwgZG9jdW1lbnRIZWlnaHQsIGJvZHlIZWlnaHQpICogZHByKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBfaXNTY3JlZW5zaG90Q2FwdHVyZWQgKHNjcmVlbnNob3RQYXRoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0cyA9IGF3YWl0IHN0YXQoc2NyZWVuc2hvdFBhdGgpO1xuXG4gICAgICAgICAgICByZXR1cm4gc3RhdHMuaXNGaWxlKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9qb2luV2l0aEJhc2VTY3JlZW5zaG90UGF0aCAocGF0aCkge1xuICAgICAgICByZXR1cm4gam9pblBhdGgodGhpcy5iYXNlU2NyZWVuc2hvdHNQYXRoLCBwYXRoKTtcbiAgICB9XG5cbiAgICBfaW5jcmVtZW50RmlsZUluZGV4ZXMgKGZvckVycm9yKSB7XG4gICAgICAgIGlmIChmb3JFcnJvcilcbiAgICAgICAgICAgIHRoaXMucGF0aFBhdHRlcm4uZGF0YS5lcnJvckZpbGVJbmRleCsrO1xuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMucGF0aFBhdHRlcm4uZGF0YS5maWxlSW5kZXgrKztcbiAgICB9XG5cbiAgICBfZ2V0Q3VzdG9tU2NyZWVuc2hvdFBhdGggKGN1c3RvbVBhdGgpIHtcbiAgICAgICAgY29uc3QgY29ycmVjdGVkQ3VzdG9tUGF0aCA9IGNvcnJlY3RGaWxlUGF0aChjdXN0b21QYXRoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fam9pbldpdGhCYXNlU2NyZWVuc2hvdFBhdGgoY29ycmVjdGVkQ3VzdG9tUGF0aCk7XG4gICAgfVxuXG4gICAgX2dldFNjcmVlbnNob3RQYXRoIChmb3JFcnJvcikge1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5wYXRoUGF0dGVybi5nZXRQYXRoKGZvckVycm9yKTtcblxuICAgICAgICB0aGlzLl9pbmNyZW1lbnRGaWxlSW5kZXhlcyhmb3JFcnJvcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2pvaW5XaXRoQmFzZVNjcmVlbnNob3RQYXRoKHBhdGgpO1xuICAgIH1cblxuICAgIF9nZXRUaHVtYm5haWxQYXRoIChzY3JlZW5zaG90UGF0aCkge1xuICAgICAgICBjb25zdCBpbWFnZU5hbWUgPSBiYXNlbmFtZShzY3JlZW5zaG90UGF0aCk7XG4gICAgICAgIGNvbnN0IGltYWdlRGlyICA9IGRpcm5hbWUoc2NyZWVuc2hvdFBhdGgpO1xuXG4gICAgICAgIHJldHVybiBqb2luUGF0aChpbWFnZURpciwgJ3RodW1ibmFpbHMnLCBpbWFnZU5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIF90YWtlU2NyZWVuc2hvdCAoeyBmaWxlUGF0aCwgcGFnZVdpZHRoLCBwYWdlSGVpZ2h0LCBmdWxsUGFnZSA9IHRoaXMuZnVsbFBhZ2UgfSkge1xuICAgICAgICBhd2FpdCB0aGlzLnByb3ZpZGVyLnRha2VTY3JlZW5zaG90KHRoaXMuYnJvd3NlcklkLCBmaWxlUGF0aCwgcGFnZVdpZHRoLCBwYWdlSGVpZ2h0LCBmdWxsUGFnZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2NhcHR1cmUgKGZvckVycm9yLCB7IHBhZ2VEaW1lbnNpb25zLCBjcm9wRGltZW5zaW9ucywgbWFya1NlZWQsIGN1c3RvbVBhdGgsIGZ1bGxQYWdlIH0gPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHNjcmVlbnNob3RQYXRoID0gY3VzdG9tUGF0aCA/IHRoaXMuX2dldEN1c3RvbVNjcmVlbnNob3RQYXRoKGN1c3RvbVBhdGgpIDogdGhpcy5fZ2V0U2NyZWVuc2hvdFBhdGgoZm9yRXJyb3IpO1xuICAgICAgICBjb25zdCB0aHVtYm5haWxQYXRoICA9IHRoaXMuX2dldFRodW1ibmFpbFBhdGgoc2NyZWVuc2hvdFBhdGgpO1xuXG4gICAgICAgIGlmIChpc0luUXVldWUoc2NyZWVuc2hvdFBhdGgpKVxuICAgICAgICAgICAgdGhpcy53YXJuaW5nTG9nLmFkZFdhcm5pbmcoV0FSTklOR19NRVNTQUdFLnNjcmVlbnNob3RSZXdyaXRpbmdFcnJvciwgc2NyZWVuc2hvdFBhdGgpO1xuXG4gICAgICAgIGF3YWl0IGFkZFRvUXVldWUoc2NyZWVuc2hvdFBhdGgsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudEFyZWFEaW1lbnNpb25zID0gQ2FwdHVyZXIuX2dldENsaWVudEFyZWFEaW1lbnNpb25zKHBhZ2VEaW1lbnNpb25zKTtcblxuICAgICAgICAgICAgY29uc3QgeyB3aWR0aDogcGFnZVdpZHRoLCBoZWlnaHQ6IHBhZ2VIZWlnaHQgfSA9IGNsaWVudEFyZWFEaW1lbnNpb25zIHx8IHt9O1xuXG4gICAgICAgICAgICBjb25zdCB0YWtlU2NyZWVuc2hvdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgZmlsZVBhdGg6IHNjcmVlbnNob3RQYXRoLFxuICAgICAgICAgICAgICAgIHBhZ2VXaWR0aCxcbiAgICAgICAgICAgICAgICBwYWdlSGVpZ2h0LFxuICAgICAgICAgICAgICAgIGZ1bGxQYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl90YWtlU2NyZWVuc2hvdCh0YWtlU2NyZWVuc2hvdE9wdGlvbnMpO1xuXG4gICAgICAgICAgICBpZiAoIWF3YWl0IENhcHR1cmVyLl9pc1NjcmVlbnNob3RDYXB0dXJlZChzY3JlZW5zaG90UGF0aCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBpbWFnZSA9IGF3YWl0IHJlYWRQbmdGaWxlKHNjcmVlbnNob3RQYXRoKTtcblxuICAgICAgICAgICAgY29uc3QgY3JvcHBlZEltYWdlID0gYXdhaXQgY3JvcFNjcmVlbnNob3QoaW1hZ2UsIHtcbiAgICAgICAgICAgICAgICBtYXJrU2VlZCxcbiAgICAgICAgICAgICAgICBjbGllbnRBcmVhRGltZW5zaW9ucyxcbiAgICAgICAgICAgICAgICBwYXRoOiAgICAgICAgICAgc2NyZWVuc2hvdFBhdGgsXG4gICAgICAgICAgICAgICAgY3JvcERpbWVuc2lvbnM6IENhcHR1cmVyLl9nZXRDcm9wRGltZW5zaW9ucyhjcm9wRGltZW5zaW9ucywgcGFnZURpbWVuc2lvbnMpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGNyb3BwZWRJbWFnZSlcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZVBuZyhzY3JlZW5zaG90UGF0aCwgY3JvcHBlZEltYWdlKTtcblxuICAgICAgICAgICAgYXdhaXQgZ2VuZXJhdGVUaHVtYm5haWwoc2NyZWVuc2hvdFBhdGgsIHRodW1ibmFpbFBhdGgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB0ZXN0UnVuSWQgICAgICAgICA9IHRoaXMudGVzdEVudHJ5LnRlc3RSdW5zW3RoaXMuYnJvd3NlcklkXS5pZDtcbiAgICAgICAgY29uc3QgdXNlckFnZW50ICAgICAgICAgPSBlc2NhcGVVc2VyQWdlbnQodGhpcy5wYXRoUGF0dGVybi5kYXRhLnBhcnNlZFVzZXJBZ2VudC5wcmV0dHlVc2VyQWdlbnQpO1xuICAgICAgICBjb25zdCBxdWFyYW50aW5lQXR0ZW1wdCA9IHRoaXMucGF0aFBhdHRlcm4uZGF0YS5xdWFyYW50aW5lQXR0ZW1wdDtcbiAgICAgICAgY29uc3QgdGFrZW5PbkZhaWwgICAgICAgPSBmb3JFcnJvcjtcblxuICAgICAgICBjb25zdCBzY3JlZW5zaG90ID0ge1xuICAgICAgICAgICAgdGVzdFJ1bklkLFxuICAgICAgICAgICAgc2NyZWVuc2hvdFBhdGgsXG4gICAgICAgICAgICB0aHVtYm5haWxQYXRoLFxuICAgICAgICAgICAgdXNlckFnZW50LFxuICAgICAgICAgICAgcXVhcmFudGluZUF0dGVtcHQsXG4gICAgICAgICAgICB0YWtlbk9uRmFpbFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudGVzdEVudHJ5LnNjcmVlbnNob3RzLnB1c2goc2NyZWVuc2hvdCk7XG5cbiAgICAgICAgcmV0dXJuIHNjcmVlbnNob3RQYXRoO1xuICAgIH1cblxuICAgIGFzeW5jIGNhcHR1cmVBY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX2NhcHR1cmUoZmFsc2UsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGFzeW5jIGNhcHR1cmVFcnJvciAob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fY2FwdHVyZSh0cnVlLCBvcHRpb25zKTtcbiAgICB9XG59XG5cbiJdfQ==