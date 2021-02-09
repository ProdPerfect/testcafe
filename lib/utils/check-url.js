"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const startsWithWildcardRegExp = /^\*\./;
const endsWithWildcardRegExp = /\.\*$/;
const trailingSlashesRegExp = /\/.*$/;
const portRegExp = /:(\d+)$/;
const protocolRegExp = /^(\w+):\/\//;
const wildcardRegExp = /\\\.\\\*/g;
function parseUrl(url) {
    if (!url || typeof url !== 'string')
        return null;
    let protocol = url.match(protocolRegExp);
    protocol = protocol ? protocol[1] : null;
    url = url.replace(protocolRegExp, '');
    url = url.replace(trailingSlashesRegExp, '');
    let port = url.match(portRegExp);
    port = port ? parseInt(port[1], 10) : null;
    url = url.replace(portRegExp, '');
    return { protocol, url, port };
}
function prepareRule(url) {
    const rule = parseUrl(url);
    if (rule) {
        rule.url = rule.url.replace(startsWithWildcardRegExp, '.');
        rule.url = rule.url.replace(endsWithWildcardRegExp, '.');
    }
    return rule;
}
function urlMatchRule(sourceUrl, rule) {
    if (!sourceUrl || !rule)
        return false;
    const matchByProtocols = !rule.protocol || !sourceUrl.protocol || rule.protocol === sourceUrl.protocol;
    const matchByPorts = !rule.port || sourceUrl.port === rule.port;
    const domainRequiredBeforeRule = rule.url.startsWith('.');
    const domainRequiredAfterRule = rule.url.endsWith('.');
    let regExStr = '^';
    if (domainRequiredBeforeRule)
        regExStr += '.+';
    regExStr += lodash_1.escapeRegExp(rule.url).replace(wildcardRegExp, '\\..*');
    if (domainRequiredAfterRule)
        regExStr += '.+';
    regExStr += '$';
    return new RegExp(regExStr).test(sourceUrl.url) && matchByProtocols && matchByPorts;
}
function default_1(url, rules) {
    if (!Array.isArray(rules))
        rules = [rules];
    return rules.some(rule => urlMatchRule(parseUrl(url), prepareRule(rule)));
}
exports.default = default_1;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stdXJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2NoZWNrLXVybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFrRDtBQUVsRCxNQUFNLHdCQUF3QixHQUFHLE9BQU8sQ0FBQztBQUN6QyxNQUFNLHNCQUFzQixHQUFLLE9BQU8sQ0FBQztBQUN6QyxNQUFNLHFCQUFxQixHQUFNLE9BQU8sQ0FBQztBQUN6QyxNQUFNLFVBQVUsR0FBaUIsU0FBUyxDQUFDO0FBQzNDLE1BQU0sY0FBYyxHQUFhLGFBQWEsQ0FBQztBQUMvQyxNQUFNLGNBQWMsR0FBYSxXQUFXLENBQUM7QUFFN0MsU0FBUyxRQUFRLENBQUUsR0FBRztJQUNsQixJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVE7UUFDL0IsT0FBTyxJQUFJLENBQUM7SUFFaEIsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV6QyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN6QyxHQUFHLEdBQVEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0MsR0FBRyxHQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFbEQsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVqQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDM0MsR0FBRyxHQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRW5DLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ25DLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBRSxHQUFHO0lBQ3JCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUUzQixJQUFJLElBQUksRUFBRTtRQUNOLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUM1RDtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBRSxTQUFTLEVBQUUsSUFBSTtJQUNsQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSTtRQUNuQixPQUFPLEtBQUssQ0FBQztJQUVqQixNQUFNLGdCQUFnQixHQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsUUFBUSxDQUFDO0lBQy9HLE1BQU0sWUFBWSxHQUFlLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDNUUsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxRCxNQUFNLHVCQUF1QixHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXhELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQztJQUVuQixJQUFJLHdCQUF3QjtRQUN4QixRQUFRLElBQUksSUFBSSxDQUFDO0lBRXJCLFFBQVEsSUFBSSxxQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRWhFLElBQUksdUJBQXVCO1FBQ3ZCLFFBQVEsSUFBSSxJQUFJLENBQUM7SUFFckIsUUFBUSxJQUFJLEdBQUcsQ0FBQztJQUVoQixPQUFPLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksZ0JBQWdCLElBQUksWUFBWSxDQUFDO0FBQ3hGLENBQUM7QUFFRCxtQkFBeUIsR0FBRyxFQUFFLEtBQUs7SUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3JCLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBTEQsNEJBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBlc2NhcGVSZWdFeHAgYXMgZXNjYXBlUmUgfSBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCBzdGFydHNXaXRoV2lsZGNhcmRSZWdFeHAgPSAvXlxcKlxcLi87XG5jb25zdCBlbmRzV2l0aFdpbGRjYXJkUmVnRXhwICAgPSAvXFwuXFwqJC87XG5jb25zdCB0cmFpbGluZ1NsYXNoZXNSZWdFeHAgICAgPSAvXFwvLiokLztcbmNvbnN0IHBvcnRSZWdFeHAgICAgICAgICAgICAgICA9IC86KFxcZCspJC87XG5jb25zdCBwcm90b2NvbFJlZ0V4cCAgICAgICAgICAgPSAvXihcXHcrKTpcXC9cXC8vO1xuY29uc3Qgd2lsZGNhcmRSZWdFeHAgICAgICAgICAgID0gL1xcXFxcXC5cXFxcXFwqL2c7XG5cbmZ1bmN0aW9uIHBhcnNlVXJsICh1cmwpIHtcbiAgICBpZiAoIXVybCB8fCB0eXBlb2YgdXJsICE9PSAnc3RyaW5nJylcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgcHJvdG9jb2wgPSB1cmwubWF0Y2gocHJvdG9jb2xSZWdFeHApO1xuXG4gICAgcHJvdG9jb2wgPSBwcm90b2NvbCA/IHByb3RvY29sWzFdIDogbnVsbDtcbiAgICB1cmwgICAgICA9IHVybC5yZXBsYWNlKHByb3RvY29sUmVnRXhwLCAnJyk7XG4gICAgdXJsICAgICAgPSB1cmwucmVwbGFjZSh0cmFpbGluZ1NsYXNoZXNSZWdFeHAsICcnKTtcblxuICAgIGxldCBwb3J0ID0gdXJsLm1hdGNoKHBvcnRSZWdFeHApO1xuXG4gICAgcG9ydCA9IHBvcnQgPyBwYXJzZUludChwb3J0WzFdLCAxMCkgOiBudWxsO1xuICAgIHVybCAgPSB1cmwucmVwbGFjZShwb3J0UmVnRXhwLCAnJyk7XG5cbiAgICByZXR1cm4geyBwcm90b2NvbCwgdXJsLCBwb3J0IH07XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVSdWxlICh1cmwpIHtcbiAgICBjb25zdCBydWxlID0gcGFyc2VVcmwodXJsKTtcblxuICAgIGlmIChydWxlKSB7XG4gICAgICAgIHJ1bGUudXJsID0gcnVsZS51cmwucmVwbGFjZShzdGFydHNXaXRoV2lsZGNhcmRSZWdFeHAsICcuJyk7XG4gICAgICAgIHJ1bGUudXJsID0gcnVsZS51cmwucmVwbGFjZShlbmRzV2l0aFdpbGRjYXJkUmVnRXhwLCAnLicpO1xuICAgIH1cblxuICAgIHJldHVybiBydWxlO1xufVxuXG5mdW5jdGlvbiB1cmxNYXRjaFJ1bGUgKHNvdXJjZVVybCwgcnVsZSkge1xuICAgIGlmICghc291cmNlVXJsIHx8ICFydWxlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBtYXRjaEJ5UHJvdG9jb2xzICAgICAgICAgPSAhcnVsZS5wcm90b2NvbCB8fCAhc291cmNlVXJsLnByb3RvY29sIHx8IHJ1bGUucHJvdG9jb2wgPT09IHNvdXJjZVVybC5wcm90b2NvbDtcbiAgICBjb25zdCBtYXRjaEJ5UG9ydHMgICAgICAgICAgICAgPSAhcnVsZS5wb3J0IHx8IHNvdXJjZVVybC5wb3J0ID09PSBydWxlLnBvcnQ7XG4gICAgY29uc3QgZG9tYWluUmVxdWlyZWRCZWZvcmVSdWxlID0gcnVsZS51cmwuc3RhcnRzV2l0aCgnLicpO1xuICAgIGNvbnN0IGRvbWFpblJlcXVpcmVkQWZ0ZXJSdWxlICA9IHJ1bGUudXJsLmVuZHNXaXRoKCcuJyk7XG5cbiAgICBsZXQgcmVnRXhTdHIgPSAnXic7XG5cbiAgICBpZiAoZG9tYWluUmVxdWlyZWRCZWZvcmVSdWxlKVxuICAgICAgICByZWdFeFN0ciArPSAnLisnO1xuXG4gICAgcmVnRXhTdHIgKz0gZXNjYXBlUmUocnVsZS51cmwpLnJlcGxhY2Uod2lsZGNhcmRSZWdFeHAsICdcXFxcLi4qJyk7XG5cbiAgICBpZiAoZG9tYWluUmVxdWlyZWRBZnRlclJ1bGUpXG4gICAgICAgIHJlZ0V4U3RyICs9ICcuKyc7XG5cbiAgICByZWdFeFN0ciArPSAnJCc7XG5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdFeFN0cikudGVzdChzb3VyY2VVcmwudXJsKSAmJiBtYXRjaEJ5UHJvdG9jb2xzICYmIG1hdGNoQnlQb3J0cztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHVybCwgcnVsZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocnVsZXMpKVxuICAgICAgICBydWxlcyA9IFtydWxlc107XG5cbiAgICByZXR1cm4gcnVsZXMuc29tZShydWxlID0+IHVybE1hdGNoUnVsZShwYXJzZVVybCh1cmwpLCBwcmVwYXJlUnVsZShydWxlKSkpO1xufVxuIl19