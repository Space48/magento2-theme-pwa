const CartRoutes = () => {
    require(["Magento_Checkout/js/action/get-totals"], (totals: any) => {
        totals([]);
    });
};

export = CartRoutes;
