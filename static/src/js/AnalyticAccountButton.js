odoo.define("pos_quotation.AnalyticAccountButton", function(require) {
    "use strict";

    const PosComponent = require('point_of_sale.PosComponent');
    const SelectionPopup = require('point_of_sale.SelectionPopup');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const {
        useListener
    } = require('web.custom_hooks');
    const {
        useState
    } = owl.hooks
    const Registries = require('point_of_sale.Registries');
    var pos_model = require('point_of_sale.models');

    class AnalyticAccountButton extends PosComponent {
        constructor() {
            super(...arguments);
            let self = this;
            useListener('click', this.onClick);
            this.state = useState({
                'analyticAccount': this.getAccount()
            })
        }

        getAccount() {
            var self = this;
            return self.env.pos.analytic_accounts_ids.find((account) => account === self.currentOrder.analytic_account_id)
        }

        get currentOrder() {
            return this.env.pos.get_order();
        }

        async onClick() {
            var self = this;

            const selectionList = this.env.pos.analytic_accounts_ids.map(account => ({
                id: account.id,
                label: account.name,
                isSelected: this.currentOrder.analytic_account_id === account.id ? true : false,
                item: account,
            }));

            const {
                confirmed,
                payload
            } = await this.showPopup(
                'SelectionPopup', {
                    title: this.env._t('Select the MultiSelectionPopup'),
                    cancelText: this.env._t('Cancel'),
                    list: selectionList,
                }
            );

            if (confirmed) {
                this.currentOrder.analytic_account_id = payload.id;
                this.state.analyticAccount = this.getAccount()
                this.render()
            }
        }
    }
    AnalyticAccountButton.template = 'AnalyticAccountButton';

    ProductScreen.addControlButton({
        component: AnalyticAccountButton,
        condition: function() {
            return this.env.pos.config.analytic_accounts && this.env.pos.analytic_accounts_ids.length > 0;
        },
    });

    Registries.Component.add(AnalyticAccountButton);

    return AnalyticAccountButton;
});
