define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    var Messages = {
        state: ko.observable(),
        getMessages: function () {
            return this.state;
        },
        set: function (data) {
            return this.state(data);
        }
    };
    return Messages;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtJQUlBLFlBQVksQ0FBQztJQUliLElBQU0sUUFBUSxHQUFHO1FBQ2IsS0FBSyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUU7UUFPdEIsV0FBVztZQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RCLENBQUM7UUFRRCxHQUFHLFlBQUMsSUFBUztZQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUM7S0FDSixDQUFDO0lBRUYsT0FBUyxRQUFRLENBQUMifQ==