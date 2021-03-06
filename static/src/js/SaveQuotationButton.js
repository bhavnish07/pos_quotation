odoo.define("pos_quotation.SaveQuotationButton", function(require){
    "use strict";

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');

    class SaveQuotationButton extends PosComponent {

        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }

        get client() {
            return this.env.pos.get_client();
        }

        get currentOrder() {
            return this.env.pos.get_order();
        }

        async onClick() {
            var quotation_number = null;
            var self = this;
            try{quotation_number = await this.rpc({
                 model: 'pos.quotation',
                method: 'get_quotation_number',
                args: [],
                kwargs: {context: this.env.session.user_context},
            })}
            catch(error){
			    self.showPopup('SaveQuotationError', {
				});
				return;
			}

            const { confirmed, payload, print } = await this.showPopup('SaveQuotationPopUp',{
                title: this.env._t('Save Quotation'),
                startingValue: '',
                quotationNumber: quotation_number,
                customer: this.client ? this.client.name : 'Not Selected'
            });

            if (confirmed) {
                if (!this.currentOrder.export_as_JSON().lines.length){
                    self.showPopup('SaveQuotationError', {
                            body: self.env._t('Please select product before saving'),
				    });
                    return;
                }
                if (print) {
                    self.showScreen("ReceiptScreen");
                }
                const val = this.formatCurrentOrder(payload, quotation_number);
                this.rpc({
                    model: 'pos.quotation',
                    method: 'create_quotation',
                    args: [val],
                    kwargs: {context: this.env.session.user_context},
                }).catch(function(unused, event) {
			    self.showPopup('SaveQuotationError', {
				 });
				return;
			     })
                .then((result) => {
                    if (result) {
                        self.env.pos.quotation_number = result[1];
                        let counter = self.currentOrder.orderlines.length
                        for (let i=0; i<counter;i++) {
                            self.currentOrder.remove_orderline(self.currentOrder.orderlines.models[0])
                        }
                        self.env.pos.db.add_quotations(result[0])
                        self.currentOrder.destroy({'reason':'abandon'});
                    }
                    self.showPopup('SaveQuotationError', {
                            body: self.env._t('Quotation Saved'),
                            title: self.env._t('Success'),
                            quotationNumber: quotation_number,
				    });
                });
            }
        }

        formatCurrentOrder(payload, quotation_number) {
            const cashier = this.env.pos.get_cashier()
            const order = this.currentOrder.export_as_JSON();
            let val = {
                ref: quotation_number,
                amount_tax: order.amount_tax,
                amount_total: order.amount_total,
                fiscal_position_id: order.fiscal_position_id,
                partner_id: order.partner_id,
                pos_session_id: order.pos_session_id,
                user_id: order.user_id,
                employee_id: cashier.id ? cashier.id : undefined,
                pricelist_id: order.pricelist_id,
                analytic_account_id: order.analytic_account_id,
                analytic_account_tags: order.analytic_account_tags,
                lines: [],
                notes: payload,
            };
            order.lines.forEach((line) => {
                val['lines'].push([0, 0, {
                    product_id: line[2].product_id,
                    qty: line[2].qty,
                    price_unit: line[2].price_unit,
                    price_subtotal: line[2].price_subtotal,
                    price_subtotal_incl: line[2].price_subtotal_incl,
                    discount: line[2].discount,
                    tax_ids: line[2].tax_ids,
                }])
            })

            return val
        }
    }



    SaveQuotationButton.template = 'SaveQuotationButton';

    ProductScreen.addControlButton({
        component: SaveQuotationButton,
        condition: function () {
            return true;
        },
    });

    Registries.Component.add(SaveQuotationButton);

    return SaveQuotationButton;
});