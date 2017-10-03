define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    var Link = (function () {
        var history;
        var eventNamespace = "Link";
        function init(router) {
            history = router.getHistory();
            _bind();
            var public_api = {
                destroy: destroy
            };
            return public_api;
        }
        function _bind() {
            $(document).on("click." + eventNamespace, "a", handleDocumentClick.bind(Link));
        }
        function handleDocumentClick(event) {
            var target = $(event.currentTarget);
            if (!target.prop("href")) {
                return;
            }
            var targetUrl = new URL(target.prop("href"));
            var location = new URL(window.location.href);
            var currentUrl = new URL(location.href);
            if (targetUrl.origin !== currentUrl.origin) {
                return;
            }
            event.preventDefault();
            history.replace({
                state: {
                    scrollY: window.scrollY
                },
                title: "",
                url: location
            });
            history.push({
                state: {},
                title: "",
                url: targetUrl
            });
        }
        function destroy() {
            $(document).off("click." + eventNamespace);
        }
        return init;
    })();
    return Link;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXIvbGluay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBSUEsWUFBWSxDQUFDO0lBU2IsSUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNWLElBQUksT0FBdUIsQ0FBQztRQUM1QixJQUFJLGNBQWMsR0FBVyxNQUFNLENBQUM7UUFLcEMsY0FBYyxNQUFjO1lBQ3hCLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDOUIsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFNLFVBQVUsR0FBRztnQkFDZixPQUFPLEVBQUUsT0FBTzthQUNuQixDQUFDO1lBRUYsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDO1FBS0Q7WUFDSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUNWLFdBQVMsY0FBZ0IsRUFDekIsR0FBRyxFQUNILG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDakMsQ0FBQztRQUNOLENBQUM7UUFRRCw2QkFBNkIsS0FBd0I7WUFDakQsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQy9DLElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0MsSUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFJdkIsT0FBTyxDQUFDLE9BQU8sQ0FBQztnQkFDWixLQUFLLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2lCQUMxQjtnQkFDRCxLQUFLLEVBQUUsRUFBRTtnQkFDVCxHQUFHLEVBQUUsUUFBUTthQUNoQixDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNULEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxFQUFFO2dCQUNULEdBQUcsRUFBRSxTQUFTO2FBQ2pCLENBQUMsQ0FBQztRQUNQLENBQUM7UUFPRDtZQUNJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBUyxjQUFnQixDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVMLE9BQVMsSUFBSSxDQUFDIn0=