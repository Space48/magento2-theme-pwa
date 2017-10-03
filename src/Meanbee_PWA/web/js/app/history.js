define(["require", "exports", "jquery", "underscore", "knockout"], function (require, exports, $, _, ko) {
    "use strict";
    var HistoryTracker = (function () {
        function HistoryTracker(config) {
            this.state = {
                currentIndex: ko.observable(-1),
                history: ko.observableArray(),
                previousIndex: ko.observable(-1)
            };
            this.root = config.root;
            if (typeof this.root.url == "string") {
                this.root.url = new URL(this.root.url);
            }
            else {
                this.root.url = this.root.url;
            }
            this.history = window.history;
            this.location = window.location;
            if ("scrollRestoration" in this.history) {
                this.history.scrollRestoration = "manual";
            }
            this._bindListeners();
            this.state.history.push({
                state: {},
                title: "",
                url: new URL(this.location.href)
            });
            this.state.currentIndex(0);
            return this;
        }
        HistoryTracker.prototype._isSameOrigin = function (url) {
            return url.origin === this.root.url.origin;
        };
        HistoryTracker.prototype._bindListeners = function () {
            $(window).on("popstate." + this.eventNamespace, this._handlePopState.bind(this));
        };
        HistoryTracker.prototype._handlePopState = function (event) {
            var url = new URL(this.location.href);
            var previous = this.getPrevious();
            var next = this.getNext();
            if (_.isEmpty(previous) && _.isEmpty(next)) {
                var state = event.state ? event.state : {};
                return this.replace({
                    state: state,
                    title: "",
                    url: url
                });
            }
            return this._updateIndexes(url, previous, next);
        };
        HistoryTracker.prototype._updateIndexes = function (url, previous, next) {
            var index = this.state.currentIndex;
            var previousIndex = this.state.previousIndex;
            previousIndex(index());
            var prevUrl = previous && previous.url && previous.url.href;
            var nextUrl = next && next.url && next.url.href;
            if (prevUrl === url.href) {
                return index(index() - 1);
            }
            if (nextUrl === url.href) {
                return index(index() + 1);
            }
            return index(0);
        };
        HistoryTracker.prototype.getLength = function () {
            return this.state.history().length;
        };
        HistoryTracker.prototype.get = function (index) {
            var entry = this.state.history.slice(index, index + 1);
            return entry && (_a = Object).assign.apply(_a, [{}].concat(entry));
            var _a;
        };
        HistoryTracker.prototype.getCurrent = function () {
            var index = this.state.currentIndex();
            return this.get(index);
        };
        HistoryTracker.prototype.getPrevious = function () {
            var index = this.state.currentIndex();
            var current = this.getLength() > 1 && this.state.history.slice(index - 1, index);
            return current && (_a = Object).assign.apply(_a, [{}].concat(current));
            var _a;
        };
        HistoryTracker.prototype.getNext = function () {
            var index = this.state.currentIndex();
            var current = this.getLength() > 1 &&
                this.state.history.slice(index + 1, index + 2);
            return current && (_a = Object).assign.apply(_a, [{}].concat(current));
            var _a;
        };
        HistoryTracker.prototype.replace = function (history) {
            var state = history.state, title = history.title, url = history.url;
            if (!this._isSameOrigin(url)) {
                throw new Error("History cannot replace on a different origin");
            }
            this.history.replaceState(state, title, url.href);
            this.state.history.splice(this.state.currentIndex(), 1, history);
        };
        HistoryTracker.prototype.push = function (history) {
            var state = history.state;
            var title = history.title, url = history.url;
            var currentIndex = this.state.currentIndex();
            if (!this._isSameOrigin(url)) {
                throw new Error("History cannot replace on a different origin");
            }
            state = state || { scrollY: 0 };
            if (url.href === this.location.href) {
                return;
            }
            this.state.history.splice(currentIndex + 1, this.getLength());
            this.history.pushState(state, title, url.href);
            this.state.history.push(history);
            this.state.previousIndex(currentIndex);
            return this.state.currentIndex(currentIndex + 1);
        };
        HistoryTracker.prototype.back = function () {
            var currentIndex = this.state.currentIndex();
            if (currentIndex - 1 < 0) {
                this.push(this.root);
                this.history.go(0);
                return -1;
            }
            return this.history.back();
        };
        HistoryTracker.prototype.forward = function () {
            var currentIndex = this.state.currentIndex();
            this.history.forward();
            this.state.previousIndex(currentIndex);
            return this.state.currentIndex(currentIndex + 1);
        };
        HistoryTracker.prototype.watch = function (path, observable) {
            var _this = this;
            return this.state.currentIndex.subscribe(function (update) {
                var current = _this.getCurrent();
                var url = !_.isEmpty(current) && current.url;
                var status = url && url.pathname === path;
                observable(status);
            });
        };
        HistoryTracker.prototype.listen = function (fn, context) {
            var _this = this;
            return this.state.currentIndex.subscribe(function (update) {
                var current = _this.getCurrent();
                var previousIndex = _this.state.previousIndex();
                var from = _this.get(previousIndex);
                if (_.isEmpty(current)) {
                    current = _this.root;
                }
                return fn.call(context, current, from);
            }, this);
        };
        HistoryTracker.prototype.destroy = function () {
            $(window).off("popstate." + this.eventNamespace);
        };
        return HistoryTracker;
    }());
    return HistoryTracker;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oaXN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7SUFLQSxZQUFZLENBQUM7SUFNYjtRQWlCSSx3QkFBWSxNQUFxQjtZQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHO2dCQUNULFlBQVksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixPQUFPLEVBQUUsRUFBRSxDQUFDLGVBQWUsRUFBRTtnQkFDN0IsYUFBYSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkMsQ0FBQztZQUVGLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ2xDLENBQUM7WUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBRWhDLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQztZQUM5QyxDQUFDO1lBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBR3RCLElBQUksQ0FBQyxL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