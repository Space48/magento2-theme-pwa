define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    var LocationChange = (function () {
        var history;
        var eventNamespace = "LocationChange";
        function init(router) {
            history = router.getHistory();
            _bind();
            var public_api = {
                destroy: destroy
            };
            return public_api;
        }
        function _bind() {
            $(document).on("locationChange." + eventNamespace, handleLocationChange.bind(LocationChange));
        }
        function handleLocationChange(event, data) {
            if (!data || !data.href) {
                return;
            }
            var url = new URL(data.href);
            if (url.origin !== location.origin) {
                return;
            }
            event.preventDefault();
            history.push({
                state: {},
                title: "",
                url: url
            });
        }
        function destroy() {
            $(document).off("locationChange." + eventNamespace);
        }
        return init;
    })();
    return LocationChange;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25DaGFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91dGVyL2xvY2F0aW9uQ2hhbmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7SUFJQSxZQUFZLENBQUM7SUFTYixJQUFNLGNBQWMsR0FBRyxDQUFDO1FBQ3BCLElBQUksT0FBdUIsQ0FBQztRQUM1QixJQUFJLGNBQWMsR0FBVyxnQkFBZ0IsQ0FBQztRQUs5QyxjQUFjLE1BQWM7WUFDeEIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM5QixLQUFLLEVBQUUsQ0FBQztZQUVSLElBQU0sVUFBVSxHQUFHO2dCQUNmLE9BQU8sRUFBRSxPQUFPO2FBQ25CLENBQUM7WUFFRixNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3RCLENBQUM7UUFLRDtZQUNJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQ1Ysb0JBQWtCLGNBQWdCLEVBQ2xDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FDNUMsQ0FBQztRQUNOLENBQUM7UUFTRCw4QkFDSSxLQUF3QixFQUN4QixJQUFtQjtZQUVuQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDVCxLQUFLLEVBQUUsRUFBRTtnQkFDVCxLQUFLLEVBQUUsRUFBRTtnQkFDVCxHQUFHLEtBQUE7YUFDTixDQUFDLENBQUM7UUFDUCxDQUFDO1FBT0Q7WUFDSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFrQixjQUFnQixDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVMLE9BQVMsY0FBYyxDQUFDIn0=