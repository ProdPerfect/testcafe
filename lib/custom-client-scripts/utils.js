"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProblematicScripts = exports.setUniqueUrls = void 0;
const lodash_1 = require("lodash");
const testcafe_hammerhead_1 = require("testcafe-hammerhead");
const client_script_1 = __importDefault(require("./client-script"));
function getScriptGroupValues(collection, groupByPredicate, pickByPredicate) {
    return lodash_1.chain(collection)
        .groupBy(groupByPredicate)
        .pickBy(pickByPredicate)
        .values()
        .value();
}
function getDuplicatedScripts(collection) {
    const contentGroups = getScriptGroupValues(collection, (s) => s.hash, (g) => g.length > 1);
    const duplicatedScripts = [];
    contentGroups.forEach(contentGroup => {
        const pageGroups = getScriptGroupValues(contentGroup, (s) => s.page.toString());
        if (pageGroups.length === 1 && testcafe_hammerhead_1.RequestFilterRule.isANY(pageGroups[0][0].page)) { /*eslint-disable-line no-extra-parens*/
            duplicatedScripts.push(pageGroups[0][0]);
            return;
        }
        const forAllPagesGroup = pageGroups.find(pg => testcafe_hammerhead_1.RequestFilterRule.isANY(pg[0].page)); /*eslint-disable-line no-extra-parens*/
        if (forAllPagesGroup) {
            pageGroups
                .filter(pg => !testcafe_hammerhead_1.RequestFilterRule.isANY(pg[0].page)) /*eslint-disable-line no-extra-parens*/
                .forEach(pg => {
                duplicatedScripts.push(pg[0]);
            });
        }
        else {
            pageGroups
                .filter(pg => pg.length > 1)
                .forEach(pg => {
                duplicatedScripts.push(pg[0]);
            });
        }
    });
    return duplicatedScripts;
}
function setUniqueUrls(collection) {
    const scriptsWithDuplicatedUrls = getDuplicatedScripts(collection);
    for (let i = 0; i < scriptsWithDuplicatedUrls.length; i++)
        scriptsWithDuplicatedUrls[i].url = scriptsWithDuplicatedUrls[i].url + '-' + testcafe_hammerhead_1.generateUniqueId(client_script_1.default.URL_UNIQUE_PART_LENGTH);
    return collection;
}
exports.setUniqueUrls = setUniqueUrls;
function findProblematicScripts(collection) {
    const nonEmptyScripts = collection.filter(s => !!s.content);
    const duplicatedContent = getDuplicatedScripts(nonEmptyScripts);
    const empty = collection.filter(s => !s.content);
    return {
        duplicatedContent,
        empty
    };
}
exports.findProblematicScripts = findProblematicScripts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3VzdG9tLWNsaWVudC1zY3JpcHRzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG1DQUErQjtBQUMvQiw2REFBMEU7QUFDMUUsb0VBQTJDO0FBRzNDLFNBQVMsb0JBQW9CLENBQUUsVUFBMEIsRUFBRSxnQkFBMEIsRUFBRSxlQUFtRTtJQUN0SixPQUFPLGNBQUssQ0FBQyxVQUFVLENBQUM7U0FDbkIsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1NBQ3pCLE1BQU0sQ0FBQyxlQUFlLENBQUM7U0FDdkIsTUFBTSxFQUFFO1NBQ1IsS0FBSyxFQUFzQixDQUFDO0FBQ3JDLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFFLFVBQTBCO0lBQ3JELE1BQU0sYUFBYSxHQUF1QixvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdJLE1BQU0saUJBQWlCLEdBQW1CLEVBQUUsQ0FBQztJQUU3QyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQ2pDLE1BQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDLFlBQThCLEVBQUUsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUVoSCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLHVDQUFpQixDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsdUNBQXVDO1lBQ3RJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFpQixDQUFDLENBQUM7WUFFekQsT0FBTztTQUNWO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsdUNBQWlCLENBQUMsS0FBSyxDQUFFLEVBQUUsQ0FBQyxDQUFDLENBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLHVDQUF1QztRQUU5SSxJQUFJLGdCQUFnQixFQUFFO1lBQ2xCLFVBQVU7aUJBQ0wsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyx1Q0FBaUIsQ0FBQyxLQUFLLENBQUUsRUFBRSxDQUFDLENBQUMsQ0FBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHVDQUF1QztpQkFDNUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNWLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFpQixDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7U0FDVjthQUNJO1lBQ0QsVUFBVTtpQkFDTCxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDM0IsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNWLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFpQixDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7U0FDVjtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxpQkFBaUIsQ0FBQztBQUM3QixDQUFDO0FBRUQsU0FBZ0IsYUFBYSxDQUFFLFVBQTBCO0lBQ3JELE1BQU0seUJBQXlCLEdBQUcsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFbkUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHlCQUF5QixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDckQseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsc0NBQWdCLENBQUMsdUJBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBRXRJLE9BQU8sVUFBVSxDQUFDO0FBQ3RCLENBQUM7QUFQRCxzQ0FPQztBQUVELFNBQWdCLHNCQUFzQixDQUFFLFVBQTBCO0lBQzlELE1BQU0sZUFBZSxHQUFnQixVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6RSxNQUFNLGlCQUFpQixHQUFjLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sS0FBSyxHQUEwQixVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFeEUsT0FBTztRQUNILGlCQUFpQjtRQUNqQixLQUFLO0tBQ1IsQ0FBQztBQUNOLENBQUM7QUFURCx3REFTQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoYWluIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGdlbmVyYXRlVW5pcXVlSWQsIFJlcXVlc3RGaWx0ZXJSdWxlIH0gZnJvbSAndGVzdGNhZmUtaGFtbWVyaGVhZCc7XG5pbXBvcnQgQ2xpZW50U2NyaXB0IGZyb20gJy4vY2xpZW50LXNjcmlwdCc7XG5pbXBvcnQgUHJvYmxlbWF0aWNTY3JpcHRzIGZyb20gJy4vcHJvYmxlbWF0aWMtc2NyaXB0cyc7XG5cbmZ1bmN0aW9uIGdldFNjcmlwdEdyb3VwVmFsdWVzIChjb2xsZWN0aW9uOiBDbGllbnRTY3JpcHRbXSwgZ3JvdXBCeVByZWRpY2F0ZTogRnVuY3Rpb24sIHBpY2tCeVByZWRpY2F0ZT86ICgodmFsdWU6IENsaWVudFNjcmlwdFtdLCBrZXk6IHN0cmluZykgPT4gdW5rbm93bikpOiBDbGllbnRTY3JpcHRbXVtdIHtcbiAgICByZXR1cm4gY2hhaW4oY29sbGVjdGlvbilcbiAgICAgICAgLmdyb3VwQnkoZ3JvdXBCeVByZWRpY2F0ZSlcbiAgICAgICAgLnBpY2tCeShwaWNrQnlQcmVkaWNhdGUpXG4gICAgICAgIC52YWx1ZXMoKVxuICAgICAgICAudmFsdWUoKSBhcyBDbGllbnRTY3JpcHRbXVtdO1xufVxuXG5mdW5jdGlvbiBnZXREdXBsaWNhdGVkU2NyaXB0cyAoY29sbGVjdGlvbjogQ2xpZW50U2NyaXB0W10pOiBDbGllbnRTY3JpcHRbXSB7XG4gICAgY29uc3QgY29udGVudEdyb3VwcyAgICAgICAgICAgICAgICAgICAgID0gZ2V0U2NyaXB0R3JvdXBWYWx1ZXMoY29sbGVjdGlvbiwgKHM6IENsaWVudFNjcmlwdCkgPT4gcy5oYXNoLCAoZzogQ2xpZW50U2NyaXB0W10pID0+IGcubGVuZ3RoID4gMSk7XG4gICAgY29uc3QgZHVwbGljYXRlZFNjcmlwdHM6IENsaWVudFNjcmlwdFtdID0gW107XG5cbiAgICBjb250ZW50R3JvdXBzLmZvckVhY2goY29udGVudEdyb3VwID0+IHtcbiAgICAgICAgY29uc3QgcGFnZUdyb3VwcyA9IGdldFNjcmlwdEdyb3VwVmFsdWVzKGNvbnRlbnRHcm91cCBhcyBDbGllbnRTY3JpcHRbXSwgKHM6IENsaWVudFNjcmlwdCkgPT4gcy5wYWdlLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIGlmIChwYWdlR3JvdXBzLmxlbmd0aCA9PT0gMSAmJiBSZXF1ZXN0RmlsdGVyUnVsZS5pc0FOWSgocGFnZUdyb3Vwc1swXVswXSBhcyBDbGllbnRTY3JpcHQpLnBhZ2UpKSB7IC8qZXNsaW50LWRpc2FibGUtbGluZSBuby1leHRyYS1wYXJlbnMqL1xuICAgICAgICAgICAgZHVwbGljYXRlZFNjcmlwdHMucHVzaChwYWdlR3JvdXBzWzBdWzBdIGFzIENsaWVudFNjcmlwdCk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvckFsbFBhZ2VzR3JvdXAgPSBwYWdlR3JvdXBzLmZpbmQocGcgPT4gUmVxdWVzdEZpbHRlclJ1bGUuaXNBTlkoKHBnWzBdIGFzIENsaWVudFNjcmlwdCkucGFnZSkpOyAvKmVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXh0cmEtcGFyZW5zKi9cblxuICAgICAgICBpZiAoZm9yQWxsUGFnZXNHcm91cCkge1xuICAgICAgICAgICAgcGFnZUdyb3Vwc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIocGcgPT4gIVJlcXVlc3RGaWx0ZXJSdWxlLmlzQU5ZKChwZ1swXSBhcyBDbGllbnRTY3JpcHQpLnBhZ2UpKSAvKmVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXh0cmEtcGFyZW5zKi9cbiAgICAgICAgICAgICAgICAuZm9yRWFjaChwZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGR1cGxpY2F0ZWRTY3JpcHRzLnB1c2gocGdbMF0gYXMgQ2xpZW50U2NyaXB0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhZ2VHcm91cHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHBnID0+IHBnLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICAgICAgLmZvckVhY2gocGcgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkdXBsaWNhdGVkU2NyaXB0cy5wdXNoKHBnWzBdIGFzIENsaWVudFNjcmlwdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkdXBsaWNhdGVkU2NyaXB0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFVuaXF1ZVVybHMgKGNvbGxlY3Rpb246IENsaWVudFNjcmlwdFtdKTogQ2xpZW50U2NyaXB0W10ge1xuICAgIGNvbnN0IHNjcmlwdHNXaXRoRHVwbGljYXRlZFVybHMgPSBnZXREdXBsaWNhdGVkU2NyaXB0cyhjb2xsZWN0aW9uKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NyaXB0c1dpdGhEdXBsaWNhdGVkVXJscy5sZW5ndGg7IGkrKylcbiAgICAgICAgc2NyaXB0c1dpdGhEdXBsaWNhdGVkVXJsc1tpXS51cmwgPSBzY3JpcHRzV2l0aER1cGxpY2F0ZWRVcmxzW2ldLnVybCArICctJyArIGdlbmVyYXRlVW5pcXVlSWQoQ2xpZW50U2NyaXB0LlVSTF9VTklRVUVfUEFSVF9MRU5HVEgpO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUHJvYmxlbWF0aWNTY3JpcHRzIChjb2xsZWN0aW9uOiBDbGllbnRTY3JpcHRbXSk6IFByb2JsZW1hdGljU2NyaXB0cyB7XG4gICAgY29uc3Qgbm9uRW1wdHlTY3JpcHRzICAgICAgICAgICAgICA9IGNvbGxlY3Rpb24uZmlsdGVyKHMgPT4gISFzLmNvbnRlbnQpO1xuICAgIGNvbnN0IGR1cGxpY2F0ZWRDb250ZW50ICAgICAgICAgICAgPSBnZXREdXBsaWNhdGVkU2NyaXB0cyhub25FbXB0eVNjcmlwdHMpO1xuICAgIGNvbnN0IGVtcHR5ICAgICAgICAgICAgICAgICAgICAgICAgPSBjb2xsZWN0aW9uLmZpbHRlcihzID0+ICFzLmNvbnRlbnQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZHVwbGljYXRlZENvbnRlbnQsXG4gICAgICAgIGVtcHR5XG4gICAgfTtcbn1cbiJdfQ==