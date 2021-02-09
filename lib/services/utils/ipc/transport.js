"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceTransport = exports.HostTransport = void 0;
const io_1 = require("./io");
const async_event_emitter_1 = __importDefault(require("../../../utils/async-event-emitter"));
const runtime_1 = require("../../../errors/runtime");
const types_1 = require("../../../errors/types");
const interfaces_1 = require("./interfaces");
class HostTransport extends async_event_emitter_1.default {
    constructor(inputStream, outputStream, syncStream) {
        super();
        this.asyncReader = new io_1.AsyncReader(inputStream);
        this.asyncWriter = new io_1.AsyncWriter(outputStream);
        this.syncReader = new io_1.AsyncReader(syncStream);
        this.syncWriter = new io_1.AsyncWriter(syncStream);
        this.readers = [this.asyncReader, this.syncReader];
    }
    read() {
        this.readers.forEach(reader => {
            reader.on('data', data => this.emit('data', data));
            reader.read();
        });
    }
    async write(message) {
        const writer = message.sync ? this.syncWriter : this.asyncWriter;
        await writer.write(message);
    }
    readSync() {
        throw new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.methodIsNotAvailableForAnIPCHost);
    }
    writeSync() {
        throw new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.methodIsNotAvailableForAnIPCHost);
    }
}
exports.HostTransport = HostTransport;
class ServiceTransport extends async_event_emitter_1.default {
    constructor(inputStream, outputStream, syncFd) {
        super();
        this.asyncReader = new io_1.AsyncReader(inputStream);
        this.asyncWriter = new io_1.AsyncWriter(outputStream);
        this.syncReader = new io_1.SyncReader(syncFd);
        this.syncWriter = new io_1.SyncWriter(syncFd);
    }
    read() {
        this.asyncReader.on('data', data => this.emit('data', data));
        this.asyncReader.read();
    }
    async write(message) {
        await this.asyncWriter.write(message);
    }
    readSync() {
        const message = this.syncReader.readSync();
        if (!interfaces_1.isIPCResponsePacket(message))
            throw new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.malformedIPCMessage);
        return message;
    }
    writeSync(message) {
        this.syncWriter.writeSync(message);
    }
}
exports.ServiceTransport = ServiceTransport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3V0aWxzL2lwYy90cmFuc3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBS2M7QUFFZCw2RkFBOEQ7QUFDOUQscURBQXVEO0FBQ3ZELGlEQUF1RDtBQUN2RCw2Q0FLc0I7QUFHdEIsTUFBYSxhQUFjLFNBQVEsNkJBQVk7SUFRM0MsWUFBb0IsV0FBa0MsRUFBRSxZQUFtQyxFQUFFLFVBQXlEO1FBQ2xKLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGdCQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGdCQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGdCQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGdCQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFOUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTSxJQUFJO1FBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBSyxDQUFFLE9BQWtCO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFakUsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxRQUFRO1FBQ1gsTUFBTSxJQUFJLHNCQUFZLENBQUMsc0JBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFTSxTQUFTO1FBQ1osTUFBTSxJQUFJLHNCQUFZLENBQUMsc0JBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzVFLENBQUM7Q0FDSjtBQXhDRCxzQ0F3Q0M7QUFHRCxNQUFhLGdCQUFpQixTQUFRLDZCQUFZO0lBTTlDLFlBQW9CLFdBQWtDLEVBQUUsWUFBbUMsRUFBRSxNQUFjO1FBQ3ZHLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGdCQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGdCQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksZUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxJQUFJO1FBQ1AsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBSyxDQUFFLE9BQWtCO1FBQ2xDLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVNLFFBQVE7UUFDWCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRTNDLElBQUksQ0FBQyxnQ0FBbUIsQ0FBQyxPQUFPLENBQUM7WUFDN0IsTUFBTSxJQUFJLHNCQUFZLENBQUMsc0JBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBRS9ELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTSxTQUFTLENBQUUsT0FBa0I7UUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztDQUNKO0FBckNELDRDQXFDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQXN5bmNSZWFkZXIsXG4gICAgQXN5bmNXcml0ZXIsXG4gICAgU3luY1JlYWRlcixcbiAgICBTeW5jV3JpdGVyXG59IGZyb20gJy4vaW8nO1xuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uLy4uLy4uL3V0aWxzL2FzeW5jLWV2ZW50LWVtaXR0ZXInO1xuaW1wb3J0IHsgR2VuZXJhbEVycm9yIH0gZnJvbSAnLi4vLi4vLi4vZXJyb3JzL3J1bnRpbWUnO1xuaW1wb3J0IHsgUlVOVElNRV9FUlJPUlMgfSBmcm9tICcuLi8uLi8uLi9lcnJvcnMvdHlwZXMnO1xuaW1wb3J0IHtcbiAgICBJUENQYWNrZXQsXG4gICAgSVBDUmVzcG9uc2VQYWNrZXQsXG4gICAgSVBDVHJhbnNwb3J0LFxuICAgIGlzSVBDUmVzcG9uc2VQYWNrZXRcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuXG5leHBvcnQgY2xhc3MgSG9zdFRyYW5zcG9ydCBleHRlbmRzIEV2ZW50RW1pdHRlciBpbXBsZW1lbnRzIElQQ1RyYW5zcG9ydCB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3luY1JlYWRlcjogQXN5bmNSZWFkZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3luY1dyaXRlcjogQXN5bmNXcml0ZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBzeW5jUmVhZGVyOiBBc3luY1JlYWRlcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN5bmNXcml0ZXI6IEFzeW5jV3JpdGVyO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSByZWFkZXJzOiBBc3luY1JlYWRlcltdO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yIChpbnB1dFN0cmVhbTogTm9kZUpTLlJlYWRhYmxlU3RyZWFtLCBvdXRwdXRTdHJlYW06IE5vZGVKUy5Xcml0YWJsZVN0cmVhbSwgc3luY1N0cmVhbTogTm9kZUpTLlJlYWRhYmxlU3RyZWFtICYgTm9kZUpTLldyaXRhYmxlU3RyZWFtKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5hc3luY1JlYWRlciA9IG5ldyBBc3luY1JlYWRlcihpbnB1dFN0cmVhbSk7XG4gICAgICAgIHRoaXMuYXN5bmNXcml0ZXIgPSBuZXcgQXN5bmNXcml0ZXIob3V0cHV0U3RyZWFtKTtcblxuICAgICAgICB0aGlzLnN5bmNSZWFkZXIgPSBuZXcgQXN5bmNSZWFkZXIoc3luY1N0cmVhbSk7XG4gICAgICAgIHRoaXMuc3luY1dyaXRlciA9IG5ldyBBc3luY1dyaXRlcihzeW5jU3RyZWFtKTtcblxuICAgICAgICB0aGlzLnJlYWRlcnMgPSBbdGhpcy5hc3luY1JlYWRlciwgdGhpcy5zeW5jUmVhZGVyXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVhZCAoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVhZGVycy5mb3JFYWNoKHJlYWRlciA9PiB7XG4gICAgICAgICAgICByZWFkZXIub24oJ2RhdGEnLCBkYXRhID0+IHRoaXMuZW1pdCgnZGF0YScsIGRhdGEpKTtcbiAgICAgICAgICAgIHJlYWRlci5yZWFkKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyB3cml0ZSAobWVzc2FnZTogSVBDUGFja2V0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHdyaXRlciA9IG1lc3NhZ2Uuc3luYyA/IHRoaXMuc3luY1dyaXRlciA6IHRoaXMuYXN5bmNXcml0ZXI7XG5cbiAgICAgICAgYXdhaXQgd3JpdGVyLndyaXRlKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWFkU3luYyAoKTogbmV2ZXIge1xuICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKFJVTlRJTUVfRVJST1JTLm1ldGhvZElzTm90QXZhaWxhYmxlRm9yQW5JUENIb3N0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgd3JpdGVTeW5jICgpOiBuZXZlciB7XG4gICAgICAgIHRocm93IG5ldyBHZW5lcmFsRXJyb3IoUlVOVElNRV9FUlJPUlMubWV0aG9kSXNOb3RBdmFpbGFibGVGb3JBbklQQ0hvc3QpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU2VydmljZVRyYW5zcG9ydCBleHRlbmRzIEV2ZW50RW1pdHRlciBpbXBsZW1lbnRzIElQQ1RyYW5zcG9ydCB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3luY1JlYWRlcjogQXN5bmNSZWFkZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3luY1dyaXRlcjogQXN5bmNXcml0ZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBzeW5jUmVhZGVyOiBTeW5jUmVhZGVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgc3luY1dyaXRlcjogU3luY1dyaXRlcjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvciAoaW5wdXRTdHJlYW06IE5vZGVKUy5SZWFkYWJsZVN0cmVhbSwgb3V0cHV0U3RyZWFtOiBOb2RlSlMuV3JpdGFibGVTdHJlYW0sIHN5bmNGZDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5hc3luY1JlYWRlciA9IG5ldyBBc3luY1JlYWRlcihpbnB1dFN0cmVhbSk7XG4gICAgICAgIHRoaXMuYXN5bmNXcml0ZXIgPSBuZXcgQXN5bmNXcml0ZXIob3V0cHV0U3RyZWFtKTtcblxuICAgICAgICB0aGlzLnN5bmNSZWFkZXIgPSBuZXcgU3luY1JlYWRlcihzeW5jRmQpO1xuICAgICAgICB0aGlzLnN5bmNXcml0ZXIgPSBuZXcgU3luY1dyaXRlcihzeW5jRmQpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWFkICgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hc3luY1JlYWRlci5vbignZGF0YScsIGRhdGEgPT4gdGhpcy5lbWl0KCdkYXRhJywgZGF0YSkpO1xuICAgICAgICB0aGlzLmFzeW5jUmVhZGVyLnJlYWQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgd3JpdGUgKG1lc3NhZ2U6IElQQ1BhY2tldCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmFzeW5jV3JpdGVyLndyaXRlKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWFkU3luYyAoKTogSVBDUmVzcG9uc2VQYWNrZXQge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5zeW5jUmVhZGVyLnJlYWRTeW5jKCk7XG5cbiAgICAgICAgaWYgKCFpc0lQQ1Jlc3BvbnNlUGFja2V0KG1lc3NhZ2UpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihSVU5USU1FX0VSUk9SUy5tYWxmb3JtZWRJUENNZXNzYWdlKTtcblxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgd3JpdGVTeW5jIChtZXNzYWdlOiBJUENQYWNrZXQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zeW5jV3JpdGVyLndyaXRlU3luYyhtZXNzYWdlKTtcbiAgICB9XG59XG4iXX0=