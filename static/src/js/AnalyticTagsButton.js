odoo.define("pos_quotation.AnalyticTagsButton", function(require){
"use strict";

const PosComponent = require('point_of_sale.PosComponent');
const ProductScreen = require('point_of_sale.ProductScreen');
const OrderManagementScreen = require('point_of_sale.OrderManagementScreen');
const { useListener } = require('web.custom_hooks');
const Registries = require('point_of_sale.Registries');
var pos_model = require('point_of_sale.models');

class AnalyticTagsButton extends PosComponent {

    constructor() {
        super(...arguments);
        useListener('click', this.onClick);
    }

    get currentOrder() {
        return this.env.pos.get_order();
    }

    async onClick() {
        var self = this;

        const selectionList = this.env.pos.account_analytic_tags.map(tag => ({
            id: tag.id,
            label: tag.name,
            isSelected: this.currentOrder.analytic_tags[tag.id] ? true: false,
            item: tag,
        }));

        const { confirmed, payload } = await this.showPopup(
            'MultiSelectionPopup', {
                title: this.env._t('Select the MultiSelectionPopup'),
                confirmText: this.env._t('Confirm'),
                cancelText: this.env._t('Cancel'),
                list: selectionList,
            }
        );

        if (confirmed) {
            this.currentOrder.analytic_tags = payload;
        }
    }
}
AnalyticTagsButton.template = 'AnalyticTagsButton';

ProductScreen.addControlButton({
    component: AnalyticTagsButton,
    condition: function() {
        return  this.env.pos.config.analytic_tags && this.env.pos.account_analytic_tags.length > 0;
    },
});

OrderManagementScreen.addControlButton({
    component: AnalyticTagsButton,
    condition: function() {
        return  this.env.pos.config.analytic_tags && this.env.pos.account_analytic_tags.length > 0;
    },
});

Registries.Component.add(AnalyticTagsButton);

return AnalyticTagsButton;

});