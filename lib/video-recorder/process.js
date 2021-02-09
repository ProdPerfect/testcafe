"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const child_process_1 = require("child_process");
const lodash_1 = require("lodash");
const async_event_emitter_1 = __importDefault(require("../utils/async-event-emitter"));
const delay_1 = __importDefault(require("../utils/delay"));
const DEBUG_LOGGER_PREFIX = 'testcafe:video-recorder:process:';
const DEFAULT_OPTIONS = {
    // NOTE: don't ask confirmation for rewriting the output file
    'y': true,
    // NOTE: use the time when a frame is read from the source as its timestamp
    // IMPORTANT: must be specified before configuring the source
    'use_wallclock_as_timestamps': 1,
    // NOTE: use stdin as a source
    'i': 'pipe:0',
    // NOTE: use the H.264 video codec
    'c:v': 'libx264',
    // NOTE: use the 'ultrafast' compression preset
    'preset': 'ultrafast',
    // NOTE: use the yuv420p pixel format (the most widely supported)
    'pix_fmt': 'yuv420p',
    // NOTE: scale input frames to make the frame height divisible by 2 (yuv420p's requirement)
    'vf': 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    // NOTE: set the frame rate to 30 in the output video (the most widely supported)
    'r': 30
};
const FFMPEG_START_DELAY = 500;
class VideoRecorder extends async_event_emitter_1.default {
    constructor(basePath, ffmpegPath, connection, customOptions) {
        super();
        this.debugLogger = debug_1.default(DEBUG_LOGGER_PREFIX + connection.id);
        this.customOptions = customOptions;
        this.videoPath = basePath;
        this.connection = connection;
        this.ffmpegPath = ffmpegPath;
        this.ffmpegProcess = null;
        this.ffmpegStdoutBuf = '';
        this.ffmpegStderrBuf = '';
        this.ffmpegClosingPromise = null;
        this.closed = false;
        this.optionsList = this._getOptionsList();
        this.capturingPromise = null;
    }
    static _filterOption([key, value]) {
        if (value === true)
            return ['-' + key];
        return ['-' + key, value];
    }
    _setupFFMPEGBuffers() {
        this.ffmpegProcess.stdout.on('data', data => {
            this.ffmpegStdoutBuf += String(data);
        });
        this.ffmpegProcess.stderr.on('data', data => {
            this.ffmpegStderrBuf += String(data);
        });
    }
    _getChildProcessPromise() {
        return new Promise((resolve, reject) => {
            this.ffmpegProcess.on('exit', resolve);
            this.ffmpegProcess.on('error', reject);
        });
    }
    _getOptionsList() {
        const optionsObject = Object.assign({}, DEFAULT_OPTIONS, this.customOptions);
        const optionsList = lodash_1.flatten(Object.entries(optionsObject).map(VideoRecorder._filterOption));
        optionsList.push(this.videoPath);
        return optionsList;
    }
    async _addFrame(frameData) {
        const writingFinished = this.ffmpegProcess.stdin.write(frameData);
        if (!writingFinished)
            await new Promise(r => this.ffmpegProcess.stdin.once('drain', r));
    }
    async _capture() {
        while (!this.closed) {
            try {
                const frame = await this.connection.provider.getVideoFrameData(this.connection.id);
                if (frame) {
                    await this.emit('frame');
                    await this._addFrame(frame);
                }
            }
            catch (error) {
                this.debugLogger(error);
            }
        }
    }
    async init() {
        this.ffmpegProcess = child_process_1.spawn(this.ffmpegPath, this.optionsList, { stdio: 'pipe' });
        this._setupFFMPEGBuffers();
        this.ffmpegClosingPromise = this
            ._getChildProcessPromise()
            .then(code => {
            this.closed = true;
            if (code) {
                this.debugLogger(code);
                this.debugLogger(this.ffmpegStdoutBuf);
                this.debugLogger(this.ffmpegStderrBuf);
            }
        })
            .catch(error => {
            this.closed = true;
            this.debugLogger(error);
            this.debugLogger(this.ffmpegStdoutBuf);
            this.debugLogger(this.ffmpegStderrBuf);
        });
        await delay_1.default(FFMPEG_START_DELAY);
    }
    async startCapturing() {
        this.capturingPromise = this._capture();
        await this.once('frame');
    }
    async finishCapturing() {
        if (this.closed)
            return;
        this.closed = true;
        await this.capturingPromise;
        this.ffmpegProcess.stdin.end();
        await this.ffmpegClosingPromise;
    }
}
exports.default = VideoRecorder;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWRlby1yZWNvcmRlci9wcm9jZXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGlEQUFzQztBQUN0QyxtQ0FBaUM7QUFDakMsdUZBQXdEO0FBQ3hELDJEQUFtQztBQUduQyxNQUFNLG1CQUFtQixHQUFHLGtDQUFrQyxDQUFDO0FBRS9ELE1BQU0sZUFBZSxHQUFHO0lBQ3BCLDZEQUE2RDtJQUM3RCxHQUFHLEVBQUUsSUFBSTtJQUVULDJFQUEyRTtJQUMzRSw2REFBNkQ7SUFDN0QsNkJBQTZCLEVBQUUsQ0FBQztJQUVoQyw4QkFBOEI7SUFDOUIsR0FBRyxFQUFFLFFBQVE7SUFFYixrQ0FBa0M7SUFDbEMsS0FBSyxFQUFFLFNBQVM7SUFFaEIsK0NBQStDO0lBQy9DLFFBQVEsRUFBRSxXQUFXO0lBRXJCLGlFQUFpRTtJQUNqRSxTQUFTLEVBQUUsU0FBUztJQUVwQiwyRkFBMkY7SUFDM0YsSUFBSSxFQUFFLG1DQUFtQztJQUV6QyxpRkFBaUY7SUFDakYsR0FBRyxFQUFFLEVBQUU7Q0FDVixDQUFDO0FBRUYsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUM7QUFFL0IsTUFBcUIsYUFBYyxTQUFRLDZCQUFZO0lBQ25ELFlBQWEsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsYUFBYTtRQUN4RCxLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxXQUFXLEdBQUcsZUFBSyxDQUFDLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5RCxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFPLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFNLFVBQVUsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFNLFVBQVUsQ0FBQztRQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUUxQixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUUxQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO1FBRWpDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRXBCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRTFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7SUFDakMsQ0FBQztJQUVELE1BQU0sQ0FBQyxhQUFhLENBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDO1FBQzlCLElBQUksS0FBSyxLQUFLLElBQUk7WUFDZCxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxtQkFBbUI7UUFDZixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxlQUFlLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN4QyxJQUFJLENBQUMsZUFBZSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCx1QkFBdUI7UUFDbkIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGVBQWU7UUFDWCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTdFLE1BQU0sV0FBVyxHQUFHLGdCQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFFNUYsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFakMsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTLENBQUUsU0FBUztRQUN0QixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLGVBQWU7WUFDaEIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVE7UUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNqQixJQUFJO2dCQUNBLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFbkYsSUFBSSxLQUFLLEVBQUU7b0JBQ1AsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6QixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQy9CO2FBQ0o7WUFDRCxPQUFPLEtBQUssRUFBRTtnQkFDVixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzNCO1NBQ0o7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDTixJQUFJLENBQUMsYUFBYSxHQUFHLHFCQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFFakYsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFM0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUk7YUFDM0IsdUJBQXVCLEVBQUU7YUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ1QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFFbkIsSUFBSSxJQUFJLEVBQUU7Z0JBQ04sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQzFDO1FBQ0wsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFFbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVQLE1BQU0sZUFBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjO1FBQ2hCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFeEMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZTtRQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNO1lBQ1gsT0FBTztRQUVYLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBRW5CLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBRTVCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRS9CLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDO0lBQ3BDLENBQUM7Q0FDSjtBQTlIRCxnQ0E4SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHsgc3Bhd24gfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7IGZsYXR0ZW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IEFzeW5jRW1pdHRlciBmcm9tICcuLi91dGlscy9hc3luYy1ldmVudC1lbWl0dGVyJztcbmltcG9ydCBkZWxheSBmcm9tICcuLi91dGlscy9kZWxheSc7XG5cblxuY29uc3QgREVCVUdfTE9HR0VSX1BSRUZJWCA9ICd0ZXN0Y2FmZTp2aWRlby1yZWNvcmRlcjpwcm9jZXNzOic7XG5cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICAvLyBOT1RFOiBkb24ndCBhc2sgY29uZmlybWF0aW9uIGZvciByZXdyaXRpbmcgdGhlIG91dHB1dCBmaWxlXG4gICAgJ3knOiB0cnVlLFxuXG4gICAgLy8gTk9URTogdXNlIHRoZSB0aW1lIHdoZW4gYSBmcmFtZSBpcyByZWFkIGZyb20gdGhlIHNvdXJjZSBhcyBpdHMgdGltZXN0YW1wXG4gICAgLy8gSU1QT1JUQU5UOiBtdXN0IGJlIHNwZWNpZmllZCBiZWZvcmUgY29uZmlndXJpbmcgdGhlIHNvdXJjZVxuICAgICd1c2Vfd2FsbGNsb2NrX2FzX3RpbWVzdGFtcHMnOiAxLFxuXG4gICAgLy8gTk9URTogdXNlIHN0ZGluIGFzIGEgc291cmNlXG4gICAgJ2knOiAncGlwZTowJyxcblxuICAgIC8vIE5PVEU6IHVzZSB0aGUgSC4yNjQgdmlkZW8gY29kZWNcbiAgICAnYzp2JzogJ2xpYngyNjQnLFxuXG4gICAgLy8gTk9URTogdXNlIHRoZSAndWx0cmFmYXN0JyBjb21wcmVzc2lvbiBwcmVzZXRcbiAgICAncHJlc2V0JzogJ3VsdHJhZmFzdCcsXG5cbiAgICAvLyBOT1RFOiB1c2UgdGhlIHl1djQyMHAgcGl4ZWwgZm9ybWF0ICh0aGUgbW9zdCB3aWRlbHkgc3VwcG9ydGVkKVxuICAgICdwaXhfZm10JzogJ3l1djQyMHAnLFxuXG4gICAgLy8gTk9URTogc2NhbGUgaW5wdXQgZnJhbWVzIHRvIG1ha2UgdGhlIGZyYW1lIGhlaWdodCBkaXZpc2libGUgYnkgMiAoeXV2NDIwcCdzIHJlcXVpcmVtZW50KVxuICAgICd2Zic6ICdzY2FsZT10cnVuYyhpdy8yKSoyOnRydW5jKGloLzIpKjInLFxuXG4gICAgLy8gTk9URTogc2V0IHRoZSBmcmFtZSByYXRlIHRvIDMwIGluIHRoZSBvdXRwdXQgdmlkZW8gKHRoZSBtb3N0IHdpZGVseSBzdXBwb3J0ZWQpXG4gICAgJ3InOiAzMFxufTtcblxuY29uc3QgRkZNUEVHX1NUQVJUX0RFTEFZID0gNTAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWRlb1JlY29yZGVyIGV4dGVuZHMgQXN5bmNFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvciAoYmFzZVBhdGgsIGZmbXBlZ1BhdGgsIGNvbm5lY3Rpb24sIGN1c3RvbU9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmRlYnVnTG9nZ2VyID0gZGVidWcoREVCVUdfTE9HR0VSX1BSRUZJWCArIGNvbm5lY3Rpb24uaWQpO1xuXG4gICAgICAgIHRoaXMuY3VzdG9tT3B0aW9ucyA9IGN1c3RvbU9wdGlvbnM7XG4gICAgICAgIHRoaXMudmlkZW9QYXRoICAgICA9IGJhc2VQYXRoO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gICAgPSBjb25uZWN0aW9uO1xuICAgICAgICB0aGlzLmZmbXBlZ1BhdGggICAgPSBmZm1wZWdQYXRoO1xuICAgICAgICB0aGlzLmZmbXBlZ1Byb2Nlc3MgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuZmZtcGVnU3Rkb3V0QnVmID0gJyc7XG4gICAgICAgIHRoaXMuZmZtcGVnU3RkZXJyQnVmID0gJyc7XG5cbiAgICAgICAgdGhpcy5mZm1wZWdDbG9zaW5nUHJvbWlzZSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLm9wdGlvbnNMaXN0ID0gdGhpcy5fZ2V0T3B0aW9uc0xpc3QoKTtcblxuICAgICAgICB0aGlzLmNhcHR1cmluZ1Byb21pc2UgPSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZmlsdGVyT3B0aW9uIChba2V5LCB2YWx1ZV0pIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKVxuICAgICAgICAgICAgcmV0dXJuIFsnLScgKyBrZXldO1xuXG4gICAgICAgIHJldHVybiBbJy0nICsga2V5LCB2YWx1ZV07XG4gICAgfVxuXG4gICAgX3NldHVwRkZNUEVHQnVmZmVycyAoKSB7XG4gICAgICAgIHRoaXMuZmZtcGVnUHJvY2Vzcy5zdGRvdXQub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmZtcGVnU3Rkb3V0QnVmICs9IFN0cmluZyhkYXRhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mZm1wZWdQcm9jZXNzLnN0ZGVyci5vbignZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZm1wZWdTdGRlcnJCdWYgKz0gU3RyaW5nKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZ2V0Q2hpbGRQcm9jZXNzUHJvbWlzZSAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZmbXBlZ1Byb2Nlc3Mub24oJ2V4aXQnLCByZXNvbHZlKTtcbiAgICAgICAgICAgIHRoaXMuZmZtcGVnUHJvY2Vzcy5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZ2V0T3B0aW9uc0xpc3QgKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zT2JqZWN0ID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCB0aGlzLmN1c3RvbU9wdGlvbnMpO1xuXG4gICAgICAgIGNvbnN0IG9wdGlvbnNMaXN0ID0gZmxhdHRlbihPYmplY3QuZW50cmllcyhvcHRpb25zT2JqZWN0KS5tYXAoVmlkZW9SZWNvcmRlci5fZmlsdGVyT3B0aW9uKSk7XG5cbiAgICAgICAgb3B0aW9uc0xpc3QucHVzaCh0aGlzLnZpZGVvUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnNMaXN0O1xuICAgIH1cblxuICAgIGFzeW5jIF9hZGRGcmFtZSAoZnJhbWVEYXRhKSB7XG4gICAgICAgIGNvbnN0IHdyaXRpbmdGaW5pc2hlZCA9IHRoaXMuZmZtcGVnUHJvY2Vzcy5zdGRpbi53cml0ZShmcmFtZURhdGEpO1xuXG4gICAgICAgIGlmICghd3JpdGluZ0ZpbmlzaGVkKVxuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UociA9PiB0aGlzLmZmbXBlZ1Byb2Nlc3Muc3RkaW4ub25jZSgnZHJhaW4nLCByKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2NhcHR1cmUgKCkge1xuICAgICAgICB3aGlsZSAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZyYW1lID0gYXdhaXQgdGhpcy5jb25uZWN0aW9uLnByb3ZpZGVyLmdldFZpZGVvRnJhbWVEYXRhKHRoaXMuY29ubmVjdGlvbi5pZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCdmcmFtZScpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9hZGRGcmFtZShmcmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1Z0xvZ2dlcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBpbml0ICgpIHtcbiAgICAgICAgdGhpcy5mZm1wZWdQcm9jZXNzID0gc3Bhd24odGhpcy5mZm1wZWdQYXRoLCB0aGlzLm9wdGlvbnNMaXN0LCB7IHN0ZGlvOiAncGlwZScgfSk7XG5cbiAgICAgICAgdGhpcy5fc2V0dXBGRk1QRUdCdWZmZXJzKCk7XG5cbiAgICAgICAgdGhpcy5mZm1wZWdDbG9zaW5nUHJvbWlzZSA9IHRoaXNcbiAgICAgICAgICAgIC5fZ2V0Q2hpbGRQcm9jZXNzUHJvbWlzZSgpXG4gICAgICAgICAgICAudGhlbihjb2RlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnTG9nZ2VyKGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnTG9nZ2VyKHRoaXMuZmZtcGVnU3Rkb3V0QnVmKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1Z0xvZ2dlcih0aGlzLmZmbXBlZ1N0ZGVyckJ1Zik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1Z0xvZ2dlcihlcnJvcik7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1Z0xvZ2dlcih0aGlzLmZmbXBlZ1N0ZG91dEJ1Zik7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1Z0xvZ2dlcih0aGlzLmZmbXBlZ1N0ZGVyckJ1Zik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBhd2FpdCBkZWxheShGRk1QRUdfU1RBUlRfREVMQVkpO1xuICAgIH1cblxuICAgIGFzeW5jIHN0YXJ0Q2FwdHVyaW5nICgpIHtcbiAgICAgICAgdGhpcy5jYXB0dXJpbmdQcm9taXNlID0gdGhpcy5fY2FwdHVyZSgpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMub25jZSgnZnJhbWUnKTtcbiAgICB9XG5cbiAgICBhc3luYyBmaW5pc2hDYXB0dXJpbmcgKCkge1xuICAgICAgICBpZiAodGhpcy5jbG9zZWQpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuY2FwdHVyaW5nUHJvbWlzZTtcblxuICAgICAgICB0aGlzLmZmbXBlZ1Byb2Nlc3Muc3RkaW4uZW5kKCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5mZm1wZWdDbG9zaW5nUHJvbWlzZTtcbiAgICB9XG59XG4iXX0=