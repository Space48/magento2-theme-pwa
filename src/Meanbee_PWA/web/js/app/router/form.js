define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    var Form = (function () {
        var history;
        var router;
        var eventNamespace = "Form";
        function init(router) {
            router = router;
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
            var additionalData = [data];
            var formData = formTarget.serializeArray().concat(additionalData);
            router.invalidateMessages();
            router.resolve({
                data: formData,
                method: formMethod,
                url: url.href
            });
        }
        function destroy() {
            $(document).off("submit." + eventNamespace);
            $(document).off("click." + eventNamespace);
        }
        return init;
    })();
    return Form;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXIvZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBSUEsWUFBWSxDQUFDO0lBU2IsSUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNWLElBQUksT0FBdUIsQ0FBQztRQUM1QixJQUFJLE1BQWMsQ0FBQztRQUNuQixJQUFJLGNBQWMsR0FBVyxNQUFNLENBQUM7UUFLcEMsY0FBYyxNQUFjO1lBQ3hCLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDaEIsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFNLFVBQVUsR0FBRztnQkFDZixPQUFPLEVBQUUsT0FBTzthQUNuQixDQUFDO1lBRUYsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDO1FBS0Q7WUFDSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVUsY0FBZ0IsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FDVixXQUFTLGNBQWdCLEVBQ3pCLDZEQUE2RCxFQUM3RCxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3BDLENBQUM7UUFDTixDQUFDO1FBUUQsZ0NBQWdDLEtBQXdCO1lBQ3BELElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7WUFDbkMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwQyxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUVoQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUk7Z0JBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDTixJQUFJLE1BQUE7b0JBQ0osS0FBSyxFQUFFLEdBQUc7aUJBQ2IsQ0FBQyxDQUFDO1lBRVAsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBUUQsdUJBQ0ksS0FBd0IsRUFDeEIsSUFBMEI7WUFFMUIsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsSUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQyxJQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQztZQUVyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDO1lBQ3ZELElBQU0sY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsSUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUVwRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNYLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUk7YUFDaEIsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQU9EO1lBQ0ksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFVLGNBQWdCLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVMsY0FBZ0IsQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFTCxPQUFTLElBQUksQ0FBQyJ9