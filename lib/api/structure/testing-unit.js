"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_unit_1 = __importDefault(require("./base-unit"));
const test_page_url_1 = require("../test-page-url");
const handle_tag_args_1 = __importDefault(require("../../utils/handle-tag-args"));
const delegated_api_1 = require("../../utils/delegated-api");
const type_assertions_1 = require("../../errors/runtime/type-assertions");
const flag_list_1 = __importDefault(require("../../utils/flag-list"));
const option_names_1 = __importDefault(require("../../configuration/option-names"));
class TestingUnit extends base_unit_1.default {
    constructor(testFile, unitTypeName) {
        super(unitTypeName);
        this.testFile = testFile;
        this.name = null;
        this.pageUrl = null;
        this.authCredentials = null;
        this.meta = {};
        this.only = false;
        this.skip = false;
        this.requestHooks = [];
        this.clientScripts = [];
        this.disablePageReloads = void 0;
        this.disablePageCaching = false;
        this.apiMethodWasCalled = new flag_list_1.default([option_names_1.default.clientScripts, option_names_1.default.requestHooks]);
        const unit = this;
        this.apiOrigin = function apiOrigin(...args) {
            return unit._add(...args);
        };
        delegated_api_1.delegateAPI(this.apiOrigin, this.constructor.API_LIST, { handler: this });
    }
    _add() {
        throw new Error('Not implemented');
    }
    _only$getter() {
        this.only = true;
        return this.apiOrigin;
    }
    _skip$getter() {
        this.skip = true;
        return this.apiOrigin;
    }
    _disablePageReloads$getter() {
        this.disablePageReloads = true;
        return this.apiOrigin;
    }
    _enablePageReloads$getter() {
        this.disablePageReloads = false;
        return this.apiOrigin;
    }
    _page$(url, ...rest) {
        this.pageUrl = handle_tag_args_1.default(url, rest);
        type_assertions_1.assertType(type_assertions_1.is.string, 'page', 'The page URL', this.pageUrl);
        test_page_url_1.assertUrl(this.pageUrl, 'page');
        this.pageUrl = test_page_url_1.resolvePageUrl(this.pageUrl, this.testFile.filename);
        return this.apiOrigin;
    }
    _httpAuth$(credentials) {
        type_assertions_1.assertType(type_assertions_1.is.nonNullObject, 'httpAuth', 'credentials', credentials);
        type_assertions_1.assertType(type_assertions_1.is.string, 'httpAuth', 'credentials.username', credentials.username);
        type_assertions_1.assertType(type_assertions_1.is.string, 'httpAuth', 'credentials.password', credentials.password);
        if (credentials.domain)
            type_assertions_1.assertType(type_assertions_1.is.string, 'httpAuth', 'credentials.domain', credentials.domain);
        if (credentials.workstation)
            type_assertions_1.assertType(type_assertions_1.is.string, 'httpAuth', 'credentials.workstation', credentials.workstation);
        this.authCredentials = credentials;
        return this.apiOrigin;
    }
    _meta$(...args) {
        type_assertions_1.assertType([type_assertions_1.is.string, type_assertions_1.is.nonNullObject], 'meta', `${this.unitTypeName}.meta`, args[0]);
        const data = typeof args[0] === 'string' ? { [args[0]]: args[1] } : args[0];
        Object.keys(data).forEach(key => {
            this.meta[key] = data[key];
        });
        return this.apiOrigin;
    }
    _disablePageCaching$getter() {
        this.disablePageCaching = true;
        return this.apiOrigin;
    }
    static _makeAPIListForChildClass(ChildClass) {
        ChildClass.API_LIST = TestingUnit.API_LIST.concat(delegated_api_1.getDelegatedAPIList(ChildClass.prototype));
    }
}
exports.default = TestingUnit;
TestingUnit.API_LIST = delegated_api_1.getDelegatedAPIList(TestingUnit.prototype);
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZy11bml0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9zdHJ1Y3R1cmUvdGVzdGluZy11bml0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQW1DO0FBQ25DLG9EQUE2RDtBQUM3RCxrRkFBd0Q7QUFDeEQsNkRBQTZFO0FBQzdFLDBFQUFzRTtBQUN0RSxzRUFBNkM7QUFDN0Msb0ZBQTREO0FBRzVELE1BQXFCLFdBQVksU0FBUSxtQkFBUTtJQUM3QyxZQUFhLFFBQVEsRUFBRSxZQUFZO1FBQy9CLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVwQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUV6QixJQUFJLENBQUMsSUFBSSxHQUFjLElBQUksQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFXLElBQUksQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFjLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxHQUFjLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFjLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsWUFBWSxHQUFNLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsYUFBYSxHQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztRQUVoQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxtQkFBUSxDQUFDLENBQUMsc0JBQVksQ0FBQyxhQUFhLEVBQUUsc0JBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBRWhHLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUVsQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxDQUFFLEdBQUcsSUFB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RUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRCwwQkFBMEI7UUFDdEIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztRQUUvQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBRSxVQUFVO1FBQ3hDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsbUNBQW1CLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDakcsQ0FBQztDQUNKO0FBekdELDhCQXlHQztBQUVELFdBQVcsQ0FBQyxRQUFRLEdBQUcsbUNBQW1CLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VVbml0IGZyb20gJy4vYmFzZS11bml0JztcbmltcG9ydCB7IGFzc2VydFVybCwgcmVzb2x2ZVBhZ2VVcmwgfSBmcm9tICcuLi90ZXN0LXBhZ2UtdXJsJztcbmltcG9ydCBoYW5kbGVUYWdBcmdzIGZyb20gJy4uLy4uL3V0aWxzL2hhbmRsZS10YWctYXJncyc7XG5pbXBvcnQgeyBkZWxlZ2F0ZUFQSSwgZ2V0RGVsZWdhdGVkQVBJTGlzdCB9IGZyb20gJy4uLy4uL3V0aWxzL2RlbGVnYXRlZC1hcGknO1xuaW1wb3J0IHsgYXNzZXJ0VHlwZSwgaXMgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZS90eXBlLWFzc2VydGlvbnMnO1xuaW1wb3J0IEZsYWdMaXN0IGZyb20gJy4uLy4uL3V0aWxzL2ZsYWctbGlzdCc7XG5pbXBvcnQgT1BUSU9OX05BTUVTIGZyb20gJy4uLy4uL2NvbmZpZ3VyYXRpb24vb3B0aW9uLW5hbWVzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0aW5nVW5pdCBleHRlbmRzIEJhc2VVbml0IHtcbiAgICBjb25zdHJ1Y3RvciAodGVzdEZpbGUsIHVuaXRUeXBlTmFtZSkge1xuICAgICAgICBzdXBlcih1bml0VHlwZU5hbWUpO1xuXG4gICAgICAgIHRoaXMudGVzdEZpbGUgPSB0ZXN0RmlsZTtcblxuICAgICAgICB0aGlzLm5hbWUgICAgICAgICAgICA9IG51bGw7XG4gICAgICAgIHRoaXMucGFnZVVybCAgICAgICAgID0gbnVsbDtcbiAgICAgICAgdGhpcy5hdXRoQ3JlZGVudGlhbHMgPSBudWxsO1xuICAgICAgICB0aGlzLm1ldGEgICAgICAgICAgICA9IHt9O1xuICAgICAgICB0aGlzLm9ubHkgICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNraXAgICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlcXVlc3RIb29rcyAgICA9IFtdO1xuICAgICAgICB0aGlzLmNsaWVudFNjcmlwdHMgICA9IFtdO1xuXG4gICAgICAgIHRoaXMuZGlzYWJsZVBhZ2VSZWxvYWRzID0gdm9pZCAwO1xuICAgICAgICB0aGlzLmRpc2FibGVQYWdlQ2FjaGluZyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYXBpTWV0aG9kV2FzQ2FsbGVkID0gbmV3IEZsYWdMaXN0KFtPUFRJT05fTkFNRVMuY2xpZW50U2NyaXB0cywgT1BUSU9OX05BTUVTLnJlcXVlc3RIb29rc10pO1xuXG4gICAgICAgIGNvbnN0IHVuaXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuYXBpT3JpZ2luID0gZnVuY3Rpb24gYXBpT3JpZ2luICguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5pdC5fYWRkKC4uLmFyZ3MpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGRlbGVnYXRlQVBJKHRoaXMuYXBpT3JpZ2luLCB0aGlzLmNvbnN0cnVjdG9yLkFQSV9MSVNULCB7IGhhbmRsZXI6IHRoaXMgfSk7XG4gICAgfVxuXG4gICAgX2FkZCAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gICAgfVxuXG4gICAgX29ubHkkZ2V0dGVyICgpIHtcbiAgICAgICAgdGhpcy5vbmx5ID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxuXG4gICAgX3NraXAkZ2V0dGVyICgpIHtcbiAgICAgICAgdGhpcy5za2lwID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxuXG4gICAgX2Rpc2FibGVQYWdlUmVsb2FkcyRnZXR0ZXIgKCkge1xuICAgICAgICB0aGlzLmRpc2FibGVQYWdlUmVsb2FkcyA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9lbmFibGVQYWdlUmVsb2FkcyRnZXR0ZXIgKCkge1xuICAgICAgICB0aGlzLmRpc2FibGVQYWdlUmVsb2FkcyA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwaU9yaWdpbjtcbiAgICB9XG5cbiAgICBfcGFnZSQgKHVybCwgLi4ucmVzdCkge1xuICAgICAgICB0aGlzLnBhZ2VVcmwgPSBoYW5kbGVUYWdBcmdzKHVybCwgcmVzdCk7XG5cbiAgICAgICAgYXNzZXJ0VHlwZShpcy5zdHJpbmcsICdwYWdlJywgJ1RoZSBwYWdlIFVSTCcsIHRoaXMucGFnZVVybCk7XG5cbiAgICAgICAgYXNzZXJ0VXJsKHRoaXMucGFnZVVybCwgJ3BhZ2UnKTtcblxuICAgICAgICB0aGlzLnBhZ2VVcmwgPSByZXNvbHZlUGFnZVVybCh0aGlzLnBhZ2VVcmwsIHRoaXMudGVzdEZpbGUuZmlsZW5hbWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwaU9yaWdpbjtcbiAgICB9XG5cbiAgICBfaHR0cEF1dGgkIChjcmVkZW50aWFscykge1xuICAgICAgICBhc3NlcnRUeXBlKGlzLm5vbk51bGxPYmplY3QsICdodHRwQXV0aCcsICdjcmVkZW50aWFscycsIGNyZWRlbnRpYWxzKTtcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5zdHJpbmcsICdodHRwQXV0aCcsICdjcmVkZW50aWFscy51c2VybmFtZScsIGNyZWRlbnRpYWxzLnVzZXJuYW1lKTtcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5zdHJpbmcsICdodHRwQXV0aCcsICdjcmVkZW50aWFscy5wYXNzd29yZCcsIGNyZWRlbnRpYWxzLnBhc3N3b3JkKTtcblxuICAgICAgICBpZiAoY3JlZGVudGlhbHMuZG9tYWluKVxuICAgICAgICAgICAgYXNzZXJ0VHlwZShpcy5zdHJpbmcsICdodHRwQXV0aCcsICdjcmVkZW50aWFscy5kb21haW4nLCBjcmVkZW50aWFscy5kb21haW4pO1xuICAgICAgICBpZiAoY3JlZGVudGlhbHMud29ya3N0YXRpb24pXG4gICAgICAgICAgICBhc3NlcnRUeXBlKGlzLnN0cmluZywgJ2h0dHBBdXRoJywgJ2NyZWRlbnRpYWxzLndvcmtzdGF0aW9uJywgY3JlZGVudGlhbHMud29ya3N0YXRpb24pO1xuXG4gICAgICAgIHRoaXMuYXV0aENyZWRlbnRpYWxzID0gY3JlZGVudGlhbHM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9tZXRhJCAoLi4uYXJncykge1xuICAgICAgICBhc3NlcnRUeXBlKFtpcy5zdHJpbmcsIGlzLm5vbk51bGxPYmplY3RdLCAnbWV0YScsIGAke3RoaXMudW5pdFR5cGVOYW1lfS5tZXRhYCwgYXJnc1swXSk7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJyA/IHsgW2FyZ3NbMF1dOiBhcmdzWzFdIH0gOiBhcmdzWzBdO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIHRoaXMubWV0YVtrZXldID0gZGF0YVtrZXldO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxuXG4gICAgX2Rpc2FibGVQYWdlQ2FjaGluZyRnZXR0ZXIgKCkge1xuICAgICAgICB0aGlzLmRpc2FibGVQYWdlQ2FjaGluZyA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIHN0YXRpYyBfbWFrZUFQSUxpc3RGb3JDaGlsZENsYXNzIChDaGlsZENsYXNzKSB7XG4gICAgICAgIENoaWxkQ2xhc3MuQVBJX0xJU1QgPSBUZXN0aW5nVW5pdC5BUElfTElTVC5jb25jYXQoZ2V0RGVsZWdhdGVkQVBJTGlzdChDaGlsZENsYXNzLnByb3RvdHlwZSkpO1xuICAgIH1cbn1cblxuVGVzdGluZ1VuaXQuQVBJX0xJU1QgPSBnZXREZWxlZ2F0ZWRBUElMaXN0KFRlc3RpbmdVbml0LnByb3RvdHlwZSk7XG5cblxuIl19