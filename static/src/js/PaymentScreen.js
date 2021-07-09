odoo.define('pos_quotation.PosQuotationPaymentScreen', function (require) {
    'use strict';

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');

    const PosQuotationPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            async selectAnalyticAccount (ev) {
                var self = this;

                const selectionList = this.env.pos.analytic_accounts_ids.map(account => ({
                    id: account.id,
                    label: account.name,
                    isSelected: this.currentOrder.analytic_account_id === account.id ? true: false,
                    item: account,
                }));

                const { confirmed, payload } = await this.showPopup(
                    'SelectionPopup', {
                        title: this.env._t('Select the MultiSelectionPopup'),
                        cancelText: this.env._t('Cancel'),
                        list: selectionList,
                    }
                );

                if (confirmed) {
                    this.currentOrder.analytic_account_id = payload.id;
                }
            }

            async selectAnalyticAccountTags (ev) {
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
        };

    Registries.Component.extend(PaymentScreen, PosQuotationPaymentScreen);
    return PosQuotationPaymentScreen;
});