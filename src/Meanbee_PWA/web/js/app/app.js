define(["require", "exports", "jquery", "./dataStore", "./router", "./routes/cart", "./debugger"], function (require, exports, $, DataStore, Router, CartRoute, Debugger) {
    "use strict";
    var routerConfig = {
        history: {
            root: {
                state: {},
                title: "",
                url: new URL(location.origin)
            }
        }
    };
    Debugger.enable();
    var ds = new DataStore();
    var router = new Router(routerConfig).setDataStore(ds);
    var App = {
        store: ds,
        router: router,
        state: {
            title: null,
            url: null
        },
        initialize: function () {
            this.router.routes([
                {
                    path: "checkout/cart",
                    action: "before",
                    callback: function () {
                        CartRoute();
                    }
                }
            ]);
            this._trackDocumentTitle();
            this._trackBodyClasses();
        },
        start: function () {
            var router = this.getRouter();
            router.start();
            return this;
        },
        _trackDocumentTitle: function () {
            var routerMeta = this.store.get("meta");
            routerMeta.subscribe(function (updatedState) {
                var title = updatedState && updatedState.title;
                if (!title) {
                    return;
                }
                document.title = decodeEntities(title);
            });
            function decodeEntities(encodedString) {
                var textArea = document.createElement("textarea");
                textArea.innerHTML = encodedString;
                return textArea.value;
            }
        },
        _trackBodyClasses: function () {
            var routerClasses = this.store.get("bodyClass");
            routerClasses.subscribe(function (data) {
                $("body")
                    .removeClass()
                    .addClass(data.join(" "));
            });
        },
        getRouter: function () {
            return this.router;
        },
        getDataStore: function () {
            return this.store;
        },
        getHistory: function () {
            return this.getRouter().getHistory();
        }
    };
    return App;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBSUEsWUFBWSxDQUFDO0lBV2IsSUFBTSxZQUFZLEdBQUc7UUFDakIsT0FBTyxFQUFFO1lBQ0wsSUFBSSxFQUFFO2dCQUNGLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxFQUFFO2dCQUNULEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2FBQ2hDO1NBQ0o7S0FDSixDQUFDO0lBRUYsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRWxCLElBQU0sRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7SUFDM0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXpELElBQU0sR0FBRyxHQUFHO1FBQ1IsS0FBSyxFQUFFLEVBQUU7UUFDVCxNQUFNLEVBQUUsTUFBTTtRQUVkLEtBQUssRUFBRTtZQUNILEtBQUssRUFBRSxJQUFJO1lBQ1gsR0FBRyxFQUFFLElBQUk7U0FDWjtRQUtELFVBQVU7WUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDZjtvQkFDSSxJQUFJLEVBQUUsZUFBZTtvQkFDckIsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLFFBQVEsRUFBRTt3QkFDTixTQUFTLEVBQUUsQ0FBQztvQkFDaEIsQ0FBQztpQkFDSjthQUNKLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzdCLENBQUM7UUFFRCxLQUFLO1lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVmLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUtELG1CQUFtQjtZQUNmLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBQyxZQUFzQjtnQkFDeEMsSUFBTSxLQUFLLEdBQUcsWUFBWSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUM7Z0JBRWpELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxRQUFRLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztZQUVILHdCQUF3QixhQUFxQjtnQkFDekMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbEQsUUFBUSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQzFCLENBQUM7UUFDTCxDQUFDO1FBS0QsaUJBQWlCO1lBQ2IsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFbEQsYUFBYSxDQUFDLFNBQVMsQ0FBQyxVQUFDLElBQWM7Z0JBQ25DLENBQUMsQ0FBQyxNQUFNLENBQUM7cUJBQ0osV0FBVyxFQUFFO3FCQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBT0QsU0FBUyxFQUFUO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQztRQU9ELFlBQVksRUFBWjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RCLENBQUM7UUFPRCxVQUFVLEVBQVY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3pDLENBQUM7S0FDSixDQUFDO0lBRUYsT0FBUyxHQUFHLENBQUMifQ==