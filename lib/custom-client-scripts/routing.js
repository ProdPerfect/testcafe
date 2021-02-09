"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unRegister = exports.register = exports.isLegacyTest = void 0;
const get_url_1 = __importDefault(require("./get-url"));
const get_code_1 = __importDefault(require("./get-code"));
const content_types_1 = __importDefault(require("../assets/content-types"));
function isLegacyTest(test) {
    return !!test.isLegacy;
}
exports.isLegacyTest = isLegacyTest;
function register(proxy, tests) {
    const routes = [];
    tests.forEach(test => {
        if (isLegacyTest(test))
            return;
        test.clientScripts.forEach((script) => {
            const route = get_url_1.default(script);
            proxy.GET(route, {
                content: get_code_1.default(script),
                contentType: content_types_1.default.javascript
            });
            routes.push(route);
        });
    });
    return routes;
}
exports.register = register;
function unRegister(proxy, routes) {
    routes.forEach(route => {
        proxy.unRegisterRoute(route, 'GET');
    });
}
exports.unRegister = unRegister;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jdXN0b20tY2xpZW50LXNjcmlwdHMvcm91dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBaUQ7QUFDakQsMERBQW1EO0FBQ25ELDRFQUFvRDtBQWVwRCxTQUFnQixZQUFZLENBQUUsSUFBYztJQUN4QyxPQUFPLENBQUMsQ0FBRSxJQUFtQixDQUFDLFFBQVEsQ0FBQztBQUMzQyxDQUFDO0FBRkQsb0NBRUM7QUFFRCxTQUFnQixRQUFRLENBQUUsS0FBWSxFQUFFLEtBQWE7SUFDakQsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBRTVCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDakIsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ2xCLE9BQU87UUFFWCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQXdCLEVBQUUsRUFBRTtZQUNwRCxNQUFNLEtBQUssR0FBRyxpQkFBd0IsQ0FBQyxNQUFzQixDQUFDLENBQUM7WUFFL0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2IsT0FBTyxFQUFNLGtCQUF5QixDQUFDLE1BQXNCLENBQUM7Z0JBQzlELFdBQVcsRUFBRSx1QkFBYSxDQUFDLFVBQVU7YUFDeEMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQXBCRCw0QkFvQkM7QUFFRCxTQUFnQixVQUFVLENBQUUsS0FBWSxFQUFFLE1BQWdCO0lBQ3RELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbkIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBSkQsZ0NBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2V0Q3VzdG9tQ2xpZW50U2NyaXB0VXJsIGZyb20gJy4vZ2V0LXVybCc7XG5pbXBvcnQgZ2V0Q3VzdG9tQ2xpZW50U2NyaXB0Q29kZSBmcm9tICcuL2dldC1jb2RlJztcbmltcG9ydCBDT05URU5UX1RZUEVTIGZyb20gJy4uL2Fzc2V0cy9jb250ZW50LXR5cGVzJztcbmltcG9ydCBDbGllbnRTY3JpcHQgZnJvbSAnLi9jbGllbnQtc2NyaXB0JztcbmltcG9ydCB7IFByb3h5IH0gZnJvbSAndGVzdGNhZmUtaGFtbWVyaGVhZCc7XG5pbXBvcnQgQ2xpZW50U2NyaXB0SW5pdCBmcm9tICcuL2NsaWVudC1zY3JpcHQtaW5pdCc7XG5cbmludGVyZmFjZSBUZXN0IHtcbiAgICBjbGllbnRTY3JpcHRzOiBDbGllbnRTY3JpcHRJbml0W107XG59XG5cbmludGVyZmFjZSBMZWdhY3lUZXN0IHtcbiAgICBpc0xlZ2FjeTogYm9vbGVhbjtcbn1cblxudHlwZSBUZXN0SXRlbSA9IFRlc3QgfCBMZWdhY3lUZXN0O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNMZWdhY3lUZXN0ICh0ZXN0OiBUZXN0SXRlbSk6IHRlc3QgaXMgTGVnYWN5VGVzdCB7XG4gICAgcmV0dXJuICEhKHRlc3QgYXMgTGVnYWN5VGVzdCkuaXNMZWdhY3k7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlciAocHJveHk6IFByb3h5LCB0ZXN0czogVGVzdFtdKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHJvdXRlczogc3RyaW5nW10gPSBbXTtcblxuICAgIHRlc3RzLmZvckVhY2godGVzdCA9PiB7XG4gICAgICAgIGlmIChpc0xlZ2FjeVRlc3QodGVzdCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGVzdC5jbGllbnRTY3JpcHRzLmZvckVhY2goKHNjcmlwdDogQ2xpZW50U2NyaXB0SW5pdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgcm91dGUgPSBnZXRDdXN0b21DbGllbnRTY3JpcHRVcmwoc2NyaXB0IGFzIENsaWVudFNjcmlwdCk7XG5cbiAgICAgICAgICAgIHByb3h5LkdFVChyb3V0ZSwge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICAgICBnZXRDdXN0b21DbGllbnRTY3JpcHRDb2RlKHNjcmlwdCBhcyBDbGllbnRTY3JpcHQpLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBDT05URU5UX1RZUEVTLmphdmFzY3JpcHRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvdXRlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuUmVnaXN0ZXIgKHByb3h5OiBQcm94eSwgcm91dGVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHJvdXRlcy5mb3JFYWNoKHJvdXRlID0+IHtcbiAgICAgICAgcHJveHkudW5SZWdpc3RlclJvdXRlKHJvdXRlLCAnR0VUJyk7XG4gICAgfSk7XG59XG4iXX0=