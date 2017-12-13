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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBSUEsWUFBWSxDQUFDO0lBV2IsSUFBTSxZQUFZLEdBQUc7UUFDakIsT0FBTyxFQUFFO1lBQ0wsSUFBSSxFQUFFO2dCQUNGLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxFQUFFO2dCQUNULEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2FBQ2hDO1NBQ0o7S0FDSixDQUFDO0lBRUYsSUFBTSxHQUFHLEdBQUc7UUFDUixLQUFLLEVBQUU7WUFDSCxLQUFLLEVBQUUsSUFBSTtZQUNYLEdBQUcsRUFBRSxJQUFJO1NBQ1o7UUFLRCxVQUFVO1lBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ25FO29CQUNJLElBQUksRUFBRSxlQUFlO29CQUNyQixNQUFNLEVBQUUsUUFBUTtvQkFDaEIsUUFBUSxFQUFFO3dCQUNOLFNBQVMsRUFBRSxDQUFDO29CQUNoQixDQUFDO2lCQUNKO2FBQ0osQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUVELEtBQUs7WUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRWYsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBS0QsbUJBQW1CO1lBQ2YsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFMUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFDLFlBQXNCO2dCQUN4QyxJQUFNLEtBQUssR0FBRyxZQUFZLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQztnQkFFakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUVELFFBQVEsQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1lBRUgsd0JBQXdCLGFBQWE7Z0JBQ2pDLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ2xELFFBQVEsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO2dCQUNuQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUMxQixDQUFDO1FBQ0wsQ0FBQztRQUtELGlCQUFpQjtZQUNiLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRWxELGFBQWEsQ0FBQyxTQUFTLENBQUMsVUFBQyxJQUFjO2dCQUNuQyxDQUFDLENBQUMsTUFBTSxDQUFDO3FCQUNKLFdBQVcsRUFBRTtxQkFDYixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQU9ELFNBQVMsRUFBVDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7UUFPRCxZQUFZLEVBQVo7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN0QixDQUFDO1FBT0QsVUFBVSxFQUFWO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN6QyxDQUFDO0tBQ0osQ0FBQztJQUVGLE9BQVMsR0FBRyxDQUFDIn0=