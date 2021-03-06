"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = __importDefault(require("./packet"));
const runtime_1 = require("../../../errors/runtime");
const types_1 = require("../../../errors/types");
class MessageParser {
    constructor() {
        this.dataQueue = [];
        this.packetQueue = [];
    }
    static _concatPackets(packets) {
        const data = packets.map(packet => packet.data);
        return Buffer.concat(data);
    }
    _processPacket(packet) {
        if (packet.header.tail) {
            if (!packet.header.head && this.packetQueue.length === 0)
                throw new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.unexpectedIPCTailPacket);
            const packets = this.packetQueue.splice(0, this.packetQueue.length);
            const data = packet.header.head ? packet.data : MessageParser._concatPackets([...packets, packet]);
            return JSON.parse(data.toString());
        }
        if (packet.header.head && this.packetQueue.length !== 0) {
            this.packetQueue.splice(0, this.packetQueue.length);
            throw new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.unexpectedIPCHeadPacket);
        }
        if (!packet.header.head && !packet.header.tail && this.packetQueue.length === 0)
            throw new runtime_1.GeneralError(types_1.RUNTIME_ERRORS.unexpectedIPCBodyPacket);
        this.packetQueue.push(packet);
        return void 0;
    }
    _processData() {
        let buffer = Buffer.concat(this.dataQueue.splice(0, this.dataQueue.length));
        let packet = packet_1.default.parse(buffer);
        const messages = [];
        while (packet) {
            const message = this._processPacket(packet);
            if (message)
                messages.push(message);
            buffer = buffer.slice(packet.header.totalSize);
            packet = packet_1.default.parse(buffer);
        }
        if (buffer.length)
            this.dataQueue.unshift(buffer);
        return messages;
    }
    parse(data) {
        this.dataQueue.push(data);
        return this._processData();
    }
}
exports.MessageParser = MessageParser;
class MessageSerializer {
    static _chunkData(data) {
        const chunks = [];
        for (let index = 0; index < data.length; index += packet_1.default.MAX_PAYLOAD_SIZE) {
            const size = Math.min(data.length - index, packet_1.default.MAX_PAYLOAD_SIZE);
            const head = index === 0;
            const tail = index + size >= data.length;
            chunks.push(packet_1.default.serialize(data.slice(index, index + size), { head, tail }));
        }
        return chunks;
    }
    serialize(message) {
        return MessageSerializer._chunkData(Buffer.from(JSON.stringify(message)));
    }
}
exports.MessageSerializer = MessageSerializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy91dGlscy9pcGMvbWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUEyRDtBQUMzRCxxREFBdUQ7QUFDdkQsaURBQXVEO0FBR3ZELE1BQWEsYUFBYTtJQUl0QjtRQUNJLElBQUksQ0FBQyxTQUFTLEdBQUssRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTyxNQUFNLENBQUMsY0FBYyxDQUFFLE9BQXVCO1FBQ2xELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFaEQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTyxjQUFjLENBQUUsTUFBb0I7UUFDeEMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtZQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFDcEQsTUFBTSxJQUFJLHNCQUFZLENBQUMsc0JBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBRW5FLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sSUFBSSxHQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZ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RCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0sU0FBUyxDQUFFLE9BQWU7UUFDN0IsT0FBTyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDO0NBQ0o7QUFsQkQsOENBa0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVmYXVsdCBhcyBQYWNrZXQsIFBhcnNlZFBhY2tldCB9IGZyb20gJy4vcGFja2V0JztcbmltcG9ydCB7IEdlbmVyYWxFcnJvciB9IGZyb20gJy4uLy4uLy4uL2Vycm9ycy9ydW50aW1lJztcbmltcG9ydCB7IFJVTlRJTUVfRVJST1JTIH0gZnJvbSAnLi4vLi4vLi4vZXJyb3JzL3R5cGVzJztcblxuXG5leHBvcnQgY2xhc3MgTWVzc2FnZVBhcnNlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkYXRhUXVldWU6IEJ1ZmZlcltdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFja2V0UXVldWU6IFBhcnNlZFBhY2tldFtdO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5kYXRhUXVldWUgICA9IFtdO1xuICAgICAgICB0aGlzLnBhY2tldFF1ZXVlID0gW107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NvbmNhdFBhY2tldHMgKHBhY2tldHM6IFBhcnNlZFBhY2tldFtdKTogQnVmZmVyIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHBhY2tldHMubWFwKHBhY2tldCA9PiBwYWNrZXQuZGF0YSk7XG5cbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoZGF0YSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcHJvY2Vzc1BhY2tldCAocGFja2V0OiBQYXJzZWRQYWNrZXQpOiBvYmplY3R8dW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKHBhY2tldC5oZWFkZXIudGFpbCkge1xuICAgICAgICAgICAgaWYgKCFwYWNrZXQuaGVhZGVyLmhlYWQgJiYgdGhpcy5wYWNrZXRRdWV1ZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihSVU5USU1FX0VSUk9SUy51bmV4cGVjdGVkSVBDVGFpbFBhY2tldCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhY2tldHMgPSB0aGlzLnBhY2tldFF1ZXVlLnNwbGljZSgwLCB0aGlzLnBhY2tldFF1ZXVlLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhICAgID0gcGFja2V0LmhlYWRlci5oZWFkID8gcGFja2V0LmRhdGEgOiBNZXNzYWdlUGFyc2VyLl9jb25jYXRQYWNrZXRzKFsuLi5wYWNrZXRzLCBwYWNrZXRdKTtcblxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYWNrZXQuaGVhZGVyLmhlYWQgJiYgdGhpcy5wYWNrZXRRdWV1ZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucGFja2V0UXVldWUuc3BsaWNlKDAsIHRoaXMucGFja2V0UXVldWUubGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihSVU5USU1FX0VSUk9SUy51bmV4cGVjdGVkSVBDSGVhZFBhY2tldCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXBhY2tldC5oZWFkZXIuaGVhZCAmJiAhcGFja2V0LmhlYWRlci50YWlsICYmIHRoaXMucGFja2V0UXVldWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihSVU5USU1FX0VSUk9SUy51bmV4cGVjdGVkSVBDQm9keVBhY2tldCk7XG5cbiAgICAgICAgdGhpcy5wYWNrZXRRdWV1ZS5wdXNoKHBhY2tldCk7XG5cbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wcm9jZXNzRGF0YSAoKTogb2JqZWN0W10ge1xuICAgICAgICBsZXQgYnVmZmVyID0gQnVmZmVyLmNvbmNhdCh0aGlzLmRhdGFRdWV1ZS5zcGxpY2UoMCwgdGhpcy5kYXRhUXVldWUubGVuZ3RoKSk7XG4gICAgICAgIGxldCBwYWNrZXQgPSBQYWNrZXQucGFyc2UoYnVmZmVyKTtcblxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuXG4gICAgICAgIHdoaWxlIChwYWNrZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9wcm9jZXNzUGFja2V0KHBhY2tldCk7XG5cbiAgICAgICAgICAgIGlmIChtZXNzYWdlKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlci5zbGljZShwYWNrZXQuaGVhZGVyLnRvdGFsU2l6ZSk7XG5cbiAgICAgICAgICAgIHBhY2tldCA9IFBhY2tldC5wYXJzZShidWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJ1ZmZlci5sZW5ndGgpXG4gICAgICAgICAgICB0aGlzLmRhdGFRdWV1ZS51bnNoaWZ0KGJ1ZmZlcik7XG5cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xuICAgIH1cblxuICAgIHB1YmxpYyBwYXJzZSAoZGF0YTogQnVmZmVyKTogb2JqZWN0W10ge1xuICAgICAgICB0aGlzLmRhdGFRdWV1ZS5wdXNoKGRhdGEpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9jZXNzRGF0YSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJpYWxpemVyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBfY2h1bmtEYXRhIChkYXRhOiBCdWZmZXIpOiBCdWZmZXJbXSB7XG4gICAgICAgIGNvbnN0IGNodW5rcyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXggKz0gUGFja2V0Lk1BWF9QQVlMT0FEX1NJWkUpIHtcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbihkYXRhLmxlbmd0aCAtIGluZGV4LCBQYWNrZXQuTUFYX1BBWUxPQURfU0laRSk7XG4gICAgICAgICAgICBjb25zdCBoZWFkID0gaW5kZXggPT09IDA7XG4gICAgICAgICAgICBjb25zdCB0YWlsID0gaW5kZXggKyBzaXplID49IGRhdGEubGVuZ3RoO1xuXG4gICAgICAgICAgICBjaHVua3MucHVzaChQYWNrZXQuc2VyaWFsaXplKGRhdGEuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2l6ZSksIHsgaGVhZCwgdGFpbCB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2h1bmtzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXJpYWxpemUgKG1lc3NhZ2U6IG9iamVjdCk6IEJ1ZmZlcltdIHtcbiAgICAgICAgcmV0dXJuIE1lc3NhZ2VTZXJpYWxpemVyLl9jaHVua0RhdGEoQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpKTtcbiAgICB9XG59XG4iXX0=