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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBSUEsWUFBWSxDQUFDO0lBVWIsSUFBTSxZQUFZLEdBQUc7UUFDakIsT0FBTyxFQUFFO1lBQ0wsSUFBSSxFQUFFO2dCQUNGLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxFQUFFO2dCQUNULEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2FBQ2hDO1NBQ0o7S0FDSixDQUFDO0lBRUYsSUFBTSxFQUFFLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUMzQixJQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFekQsSUFBTSxHQUFHLEdBQUc7UUFDUixLQUFLLEVBQUUsRUFBRTtRQUNULE1BQU0sRUFBRSxNQUFNO1FBRWQsS0FBSyxFQUFFO1lBQ0gsS0FBSyxFQUFFLElBQUk7WUFDWCxHQUFHLEVBQUUsSUFBSTtTQUNaO1FBS0QsVUFBVTtZQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNmO29CQUNJLElBQUksRUFBRSxlQUFlO29CQUNyQixNQUFNLEVBQUUsUUFBUTtvQkFDaEIsUUFBUSxFQUFFO3dCQUNOLFNBQVMsRUFBRSxDQUFDO29CQUNoQixDQUFDO2lCQUNKO2FBQ0osQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUVELEtBQUs7WUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRWYsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBS0QsbUJBQW1CO1lBQ2YsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFMUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFDLFlBQXNCO2dCQUN4QyxJQUFNLEtBQUssR0FBRyxZQUFZLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQztnQkFFakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUVELFFBQVEsQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1lBRUgsd0JBQXdCLGFBQXFCO2dCQUN6QyxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNsRCxRQUFRLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztnQkFDbkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDMUIsQ0FBQztRQUNMLENBQUM7UUFLRCxpQkFBaUI7WUFDYixJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUVsRCxhQUFhLENBQUMsU0FBUyxDQUFDLFVBQUMsSUFBYztnQkFDbkMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztxQkFDSixXQUFXLEVBQUU7cUJBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFPRCxTQUFTLEVBQVQ7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDO1FBT0QsWUFBWSxFQUFaO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEIsQ0FBQztRQU9ELFVBQVUsRUFBVjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDekMsQ0FBQztLQUNKLENBQUM7SUFFRixPQUFTLEdBQUcsQ0FBQyJ9