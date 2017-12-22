define(["require", "exports"], function (require, exports) {
    "use strict";
    var Debugger = (function () {
        function Debugger(className) {
            this.className = className;
        }
        Debugger.enable = function () {
            Debugger.enabled = true;
        };
        Debugger.disable = function () {
            Debugger.enabled = false;
        };
        Debugger.prototype.log = function (message, method, context) {
            if (context === void 0) { context = {}; }
            if (Debugger.enabled) {
                console.log("%c%s", 'background:black;color:white;padding:3px 5px;', this.formatMessage(message, method), context);
            }
        };
        Debugger.prototype.warn = function (message, method, context) {
            if (context === void 0) { context = {}; }
            if (Debugger.enabled) {
                console.warn(this.formatMessage(message, method), context);
            }
        };
        Debugger.prototype.formatMessage = function (message, method) {
            var where = (method === null) ? this.className : this.className + "::" + method;
            return "\uD83D\uDC30 [" + where + "] " + message;
        };
        Debugger.enabled = false;
        return Debugger;
    }());
    return Debugger;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGVidWdnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFBQTtRQUdJLGtCQUFvQixTQUFpQjtZQUFqQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQUcsQ0FBQztRQUVsQyxlQUFNLEdBQWI7WUFDSSxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUM1QixDQUFDO1FBRU0sZ0JBQU8sR0FBZDtZQUNJLFFBQVEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQzdCLENBQUM7UUFFRCxzQkFBRyxHQUFILFVBQUksT0FBZSxFQUFFLE1BQXFCLEVBQUUsT0FBWTtZQUFaLHdCQUFBLEVBQUEsWUFBWTtZQUNwRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsK0NBQStDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkgsQ0FBQztRQUNMLENBQUM7UUFFRCx1QkFBSSxHQUFKLFVBQUssT0FBZSxFQUFFLE1BQXFCLEVBQUUsT0FBWTtZQUFaLHdCQUFBLEVBQUEsWUFBWTtZQUNyRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvRCxDQUFDO1FBQ0wsQ0FBQztRQUVELGdDQUFhLEdBQWIsVUFBYyxPQUFlLEVBQUUsTUFBcUI7WUFDaEQsSUFBTSxLQUFLLEdBQUcsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFJLElBQUksQ0FBQyxTQUFTLFVBQUssTUFBUSxDQUFDO1lBRWxGLE1BQU0sQ0FBQyxtQkFBTyxLQUFLLFVBQUssT0FBUyxDQUFDO1FBQ3RDLENBQUM7UUE1QmMsZ0JBQU8sR0FBWSxLQUFLLENBQUM7UUE2QjVDLGVBQUM7S0FBQSxBQTlCRCxJQThCQztJQUVELE9BQVMsUUFBUSxDQUFDIn0=