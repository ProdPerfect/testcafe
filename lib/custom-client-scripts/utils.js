"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
// @ts-ignore Could not find a declaration file for module 'testcafe-hammerhead'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3VzdG9tLWNsaWVudC1zY3JpcHRzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQStCO0FBQy9CLGdGQUFnRjtBQUNoRiw2REFBMEU7QUFDMUUsb0VBQTJDO0FBRzNDLFNBQVMsb0JBQW9CLENBQUUsVUFBMEIsRUFBRSxnQkFBMEIsRUFBRSxlQUFtRTtJQUN0SixPQUFPLGNBQUssQ0FBQyxVQUFVLENBQUM7U0FDbkIsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1NBQ3pCLE1BQU0sQ0FBQyxlQUFlLENBQUM7U0FDdkIsTUFBTSxFQUFFO1NBQ1IsS0FBSyxFQUFzQixDQUFDO0FBQ3JDLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFFLFVBQTBCO0lBQ3JELE1BQU0sYUFBYSxHQUF1QixvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdJLE1BQU0saUJBQWlCLEdBQW1CLEVBQUUsQ0FBQztJQUU3QyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQ2pDLE1BQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFDLFlBQThCLEVBQUUsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUVoSCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLHVDQUFpQixDQUFDLEtBQUssQ0FBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsdUNBQXVDO1lBQ3RJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFpQixDQUFDLENBQUM7WUFFekQsT0FBTztTQUNWO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsdUNBQWlCLENBQUMsS0FBSyxDQUFFLEVBQUUsQ0FBQyxDQUFDLENBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLHVDQUF1QztRQUU5SSxJQUFJLGdCQUFnQixFQUFFO1lBQ2xCLFVBQVU7aUJBQ0wsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyx1Q0FBaUIsQ0FBQyxLQUFLLENBQUUsRUFBRSxDQUFDLENBQUMsQ0FBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHVDQUF1QztpQkFDNUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNWLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFpQixDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7U0FDVjthQUNJO1lBQ0QsVUFBVTtpQkFDTCxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDM0IsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNWLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFpQixDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7U0FDVjtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxpQkFBaUIsQ0FBQztBQUM3QixDQUFDO0FBRUQsU0FBZ0IsYUFBYSxDQUFFLFVBQTBCO0lBQ3JELE1BQU0seUJBQXlCLEdBQUcsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFbkUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHlCQUF5QixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDckQseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsc0NBQWdCLENBQUMsdUJBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBRXRJLE9BQU8sVUFBVSxDQUFDO0FBQ3RCLENBQUM7QUFQRCxzQ0FPQztBQUVELFNBQWdCLHNCQUFzQixDQUFFLFVBQTBCO0lBQzlELE1BQU0sZUFBZSxHQUFnQixVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6RSxNQUFNLGlCQUFpQixHQUFjLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sS0FBSyxHQUEwQixVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFeEUsT0FBTztRQUNILGlCQUFpQjtRQUNqQixLQUFLO0tBQ1IsQ0FBQztBQUNOLENBQUM7QUFURCx3REFTQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoYWluIH0gZnJvbSAnbG9kYXNoJztcbi8vIEB0cy1pZ25vcmUgQ291bGQgbm90IGZpbmQgYSBkZWNsYXJhdGlvbiBmaWxlIGZvciBtb2R1bGUgJ3Rlc3RjYWZlLWhhbW1lcmhlYWQnXG5pbXBvcnQgeyBnZW5lcmF0ZVVuaXF1ZUlkLCBSZXF1ZXN0RmlsdGVyUnVsZSB9IGZyb20gJ3Rlc3RjYWZlLWhhbW1lcmhlYWQnO1xuaW1wb3J0IENsaWVudFNjcmlwdCBmcm9tICcuL2NsaWVudC1zY3JpcHQnO1xuaW1wb3J0IFByb2JsZW1hdGljU2NyaXB0cyBmcm9tICcuL3Byb2JsZW1hdGljLXNjcmlwdHMnO1xuXG5mdW5jdGlvbiBnZXRTY3JpcHRHcm91cFZhbHVlcyAoY29sbGVjdGlvbjogQ2xpZW50U2NyaXB0W10sIGdyb3VwQnlQcmVkaWNhdGU6IEZ1bmN0aW9uLCBwaWNrQnlQcmVkaWNhdGU/OiAoKHZhbHVlOiBDbGllbnRTY3JpcHRbXSwga2V5OiBzdHJpbmcpID0+IHVua25vd24pKTogQ2xpZW50U2NyaXB0W11bXSB7XG4gICAgcmV0dXJuIGNoYWluKGNvbGxlY3Rpb24pXG4gICAgICAgIC5ncm91cEJ5KGdyb3VwQnlQcmVkaWNhdGUpXG4gICAgICAgIC5waWNrQnkocGlja0J5UHJlZGljYXRlKVxuICAgICAgICAudmFsdWVzKClcbiAgICAgICAgLnZhbHVlKCkgYXMgQ2xpZW50U2NyaXB0W11bXTtcbn1cblxuZnVuY3Rpb24gZ2V0RHVwbGljYXRlZFNjcmlwdHMgKGNvbGxlY3Rpb246IENsaWVudFNjcmlwdFtdKTogQ2xpZW50U2NyaXB0W10ge1xuICAgIGNvbnN0IGNvbnRlbnRHcm91cHMgICAgICAgICAgICAgICAgICAgICA9IGdldFNjcmlwdEdyb3VwVmFsdWVzKGNvbGxlY3Rpb24sIChzOiBDbGllbnRTY3JpcHQpID0+IHMuaGFzaCwgKGc6IENsaWVudFNjcmlwdFtdKSA9PiBnLmxlbmd0aCA+IDEpO1xuICAgIGNvbnN0IGR1cGxpY2F0ZWRTY3JpcHRzOiBDbGllbnRTY3JpcHRbXSA9IFtdO1xuXG4gICAgY29udGVudEdyb3Vwcy5mb3JFYWNoKGNvbnRlbnRHcm91cCA9PiB7XG4gICAgICAgIGNvbnN0IHBhZ2VHcm91cHMgPSBnZXRTY3JpcHRHcm91cFZhbHVlcyhjb250ZW50R3JvdXAgYXMgQ2xpZW50U2NyaXB0W10sIChzOiBDbGllbnRTY3JpcHQpID0+IHMucGFnZS50b1N0cmluZygpKTtcblxuICAgICAgICBpZiAocGFnZUdyb3Vwcy5sZW5ndGggPT09IDEgJiYgUmVxdWVzdEZpbHRlclJ1bGUuaXNBTlkoKHBhZ2VHcm91cHNbMF1bMF0gYXMgQ2xpZW50U2NyaXB0KS5wYWdlKSkgeyAvKmVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXh0cmEtcGFyZW5zKi9cbiAgICAgICAgICAgIGR1cGxpY2F0ZWRTY3JpcHRzLnB1c2gocGFnZUdyb3Vwc1swXVswXSBhcyBDbGllbnRTY3JpcHQpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmb3JBbGxQYWdlc0dyb3VwID0gcGFnZUdyb3Vwcy5maW5kKHBnID0+IFJlcXVlc3RGaWx0ZXJSdWxlLmlzQU5ZKChwZ1swXSBhcyBDbGllbnRTY3JpcHQpLnBhZ2UpKTsgLyplc2xpbnQtZGlzYWJsZS1saW5lIG5vLWV4dHJhLXBhcmVucyovXG5cbiAgICAgICAgaWYgKGZvckFsbFBhZ2VzR3JvdXApIHtcbiAgICAgICAgICAgIHBhZ2VHcm91cHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHBnID0+ICFSZXF1ZXN0RmlsdGVyUnVsZS5pc0FOWSgocGdbMF0gYXMgQ2xpZW50U2NyaXB0KS5wYWdlKSkgLyplc2xpbnQtZGlzYWJsZS1saW5lIG5vLWV4dHJhLXBhcmVucyovXG4gICAgICAgICAgICAgICAgLmZvckVhY2gocGcgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkdXBsaWNhdGVkU2NyaXB0cy5wdXNoKHBnWzBdIGFzIENsaWVudFNjcmlwdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYWdlR3JvdXBzXG4gICAgICAgICAgICAgICAgLmZpbHRlcihwZyA9PiBwZy5sZW5ndGggPiAxKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKHBnID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlZFNjcmlwdHMucHVzaChwZ1swXSBhcyBDbGllbnRTY3JpcHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZHVwbGljYXRlZFNjcmlwdHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRVbmlxdWVVcmxzIChjb2xsZWN0aW9uOiBDbGllbnRTY3JpcHRbXSk6IENsaWVudFNjcmlwdFtdIHtcbiAgICBjb25zdCBzY3JpcHRzV2l0aER1cGxpY2F0ZWRVcmxzID0gZ2V0RHVwbGljYXRlZFNjcmlwdHMoY29sbGVjdGlvbik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjcmlwdHNXaXRoRHVwbGljYXRlZFVybHMubGVuZ3RoOyBpKyspXG4gICAgICAgIHNjcmlwdHNXaXRoRHVwbGljYXRlZFVybHNbaV0udXJsID0gc2NyaXB0c1dpdGhEdXBsaWNhdGVkVXJsc1tpXS51cmwgKyAnLScgKyBnZW5lcmF0ZVVuaXF1ZUlkKENsaWVudFNjcmlwdC5VUkxfVU5JUVVFX1BBUlRfTEVOR1RIKTtcblxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFByb2JsZW1hdGljU2NyaXB0cyAoY29sbGVjdGlvbjogQ2xpZW50U2NyaXB0W10pOiBQcm9ibGVtYXRpY1NjcmlwdHMge1xuICAgIGNvbnN0IG5vbkVtcHR5U2NyaXB0cyAgICAgICAgICAgICAgPSBjb2xsZWN0aW9uLmZpbHRlcihzID0+ICEhcy5jb250ZW50KTtcbiAgICBjb25zdCBkdXBsaWNhdGVkQ29udGVudCAgICAgICAgICAgID0gZ2V0RHVwbGljYXRlZFNjcmlwdHMobm9uRW1wdHlTY3JpcHRzKTtcbiAgICBjb25zdCBlbXB0eSAgICAgICAgICAgICAgICAgICAgICAgID0gY29sbGVjdGlvbi5maWx0ZXIocyA9PiAhcy5jb250ZW50KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGR1cGxpY2F0ZWRDb250ZW50LFxuICAgICAgICBlbXB0eVxuICAgIH07XG59XG4iXX0=