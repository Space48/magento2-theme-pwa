define(["require", "exports", "jquery", "./dataStore", "./router", "./routes/cart"], function (require, exports, $, DataStore, Router, CartRoute) {
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
    var App = {
        state: {
            title: null,
            url: null
        },
        initialize: function () {
            this.store = new DataStore();
            this.router = new Router(routerConfig).setDataStore(this.store).routes([
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
                document.title = updatedState.title;
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBSUEsWUFBWSxDQUFDO0lBV2IsSUFBTSxZQUFZLEdBQUc7UUFDakIsT0FBTyxFQUFFO1lBQ0wsSUFBSSxFQUFFO2dCQUNGLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxFQUFFO2dCQUNULEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2FBQ2hDO1NBQ0o7S0FDSixDQUFDO0lBRUYsSUFBTSxHQUFHLEdBQUc7UUFDUixLQUFLLEVBQUU7WUFDSCxLQUFLLEVBQUUsSUFBSTtZQUNYLEdBQUcsRUFBRSxJQUFJO1NBQ1o7UUFLRCxVQUFVO1lBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ25FO29CQUNJLElBQUksRUFBRSxlQUFlO29CQUNyQixNQUFNLEVBQUUsUUFBUTtvQkFDaEIsUUFBUSxFQUFFO3dCQUNOLFNBQVMsRUFBRSxDQUFDO29CQUNoQixDQUFDO2lCQUNKO2FBQ0osQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUVELEtBQUs7WUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRWYsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBS0QsbUJBQW1CO1lBQ2YsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFMUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFDLFlBQXNCO2dCQUN4QyxRQUFRLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBS0QsaUJBQWlCO1lBQ2IsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFbEQsYUFBYSxDQUFDLFNBQVMsQ0FBQyxVQUFDLElBQWM7Z0JBQ25DLENBQUMsQ0FBQyxNQUFNLENBQUM7cUJBQ0osV0FBVyxFQUFFO3FCQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBT0QsU0FBUyxFQUFUO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQztRQU9ELFlBQVksRUFBWjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RCLENBQUM7UUFPRCxVQUFVLEVBQVY7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3pDLENBQUM7S0FDSixDQUFDO0lBRUYsT0FBUyxHQUFHLENBQUMifQ==