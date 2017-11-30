define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    var Form = (function () {
        var router;
        var eventNamespace = "Form";
        function init(routerInstance) {
            router = routerInstance;
            _bind();
            var public_api = {
                destroy: destroy
            };
            return public_api;
        }
        function _bind() {
            $(document).on("submit." + eventNamespace, _handleSubmit.bind(Form));
            $(document).on("click." + eventNamespace, 'form button:not([type="button"]), form input[type="submit"]', _handleClickFormSubmit.bind(Form));
        }
        function _handleClickFormSubmit(event) {
            var target = event.currentTarget;
            var form = target.closest("form");
            var name = $(target).prop("name");
            var data = [];
            if (!form) {
                return;
            }
            name &&
                data.push({
                    name: name,
                    value: "1"
                });
            $(form).trigger("submit", data);
            return false;
        }
        function _handleSubmit(event, data) {
            var form = $(event.target).is("form");
            var formTarget = $(event.target);
            var formAction = formTarget.prop("action") || null;
            if (!form || !formAction) {
                return;
            }
            var url = new URL(formAction);
            if (url.origin !== location.origin) {
                return;
            }
            event.preventDefault();
            var formMethod = formTarget.prop("method") || "post";
            var additionalData = data;
            var formData = formTarget.serializeArray();
            additionalData && formData.concat([additionalData]);
            router.invalidateMessages();
            var req = router.resolve({
                data: formData,
                method: formMethod,
                url: url.href
            });
            req();
        }
        function destroy() {
            $(document).off("submit." + eventNamespace);
            $(document).off("click." + eventNamespace);
        }
        return init;
    })();
    return Form;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXIvZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBSUEsWUFBWSxDQUFDO0lBUWIsSUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNWLElBQUksTUFBYyxDQUFDO1FBQ25CLElBQUksY0FBYyxHQUFXLE1BQU0sQ0FBQztRQUtwQyxjQUFjLGNBQXNCO1lBQ2hDLE1BQU0sR0FBRyxjQUFjLENBQUM7WUFDeEIsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFNLFVBQVUsR0FBRztnQkFDZixPQUFPLEVBQUUsT0FBTzthQUNuQixDQUFDO1lBRUYsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDO1FBS0Q7WUFDSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVUsY0FBZ0IsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FDVixXQUFTLGNBQWdCLEVBQ3pCLDZEQUE2RCxFQUM3RCxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3BDLENBQUM7UUFDTixDQUFDO1FBUUQsZ0NBQWdDLEtBQXdCO1lBQ3BELElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7WUFDbkMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwQyxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUVoQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUk7Z0JBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDTixJQUFJLE1BQUE7b0JBQ0osS0FBSyxFQUFFLEdBQUc7aUJBQ2IsQ0FBQyxDQUFDO1lBRVAsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBUUQsdUJBQ0ksS0FBd0IsRUFDeEIsSUFBMEI7WUFFMUIsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsSUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQyxJQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQztZQUVyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDO1lBQ3ZELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFN0MsY0FBYyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBRXBELE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZCLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUk7YUFDaEIsQ0FBQyxDQUFDO1lBRUgsR0FBRyxFQUFFLENBQUM7UUFDVixDQUFDO1FBT0Q7WUFDSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVUsY0FBZ0IsQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBUyxjQUFnQixDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVMLE9BQVMsSUFBSSxDQUFDIn0=