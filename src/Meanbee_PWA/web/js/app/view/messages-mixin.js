define(["require", "exports", "Meanbee_PWA/js/app/messages", "jquery/jquery-storageapi"], function (require, exports, Messages, cookieMessages) {
    "use strict";
    var Mixin = function (Component) {
        return Component.extend({
            initialize: function () {
                this._super();
                cookieMessages;
                Messages.set(this.cookieMessages);
                this.cookieMessages = Messages.getMessages();
            }
        });
    };
    return Mixin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMtbWl4aW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdmlldy9tZXNzYWdlcy1taXhpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBSUEsWUFBWSxDQUFDO0lBS2IsSUFBTSxLQUFLLEdBQUcsVUFBQyxTQUFjO1FBQ3pCLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQ3BCLFVBQVU7Z0JBQ04sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUVkLGNBQWMsQ0FBQztnQkFFZixRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakQsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQztJQUVGLE9BQVMsS0FBSyxDQUFDIn0=