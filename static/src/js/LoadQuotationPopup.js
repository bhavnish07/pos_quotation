odoo.define("pos_quotation.LoadQuotationPopup", function(require){
    "use strict";

    const { useState, useRef } = owl.hooks;
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');

    class LoadQuotationPopup extends AbstractAwaitablePopup {

        constructor() {
			super(...arguments);
			var self = this;
			this.selectedQuoteId = null;
			this.selectedQuote = null;
            this.quotationDetailsRef = useRef('quotation_details');
			this.state = useState({ quotations: [] , notes: '', customer: null, date: null, totalAmount: null, status: null});
            this.inputRef = useRef('input');
            this.dropDownRef = useRef('drop-down')
            useListener('select-quote', this.selectQuote);

        }
        mounted() {
            let self = this;
             $(this.inputRef.el).on('change', self.fetchQuotations.bind(self))
        }

        selectQuote(event) {
            const { selectedQuoteId, selectedQuote } = event.detail;
            this.selectedQuote = selectedQuote;
             $(this.inputRef.el).val(selectedQuote.ref);
            $(this.dropDownRef.el).hide();
            this.state.date = selectedQuote.quotation_date;
            this.state.totalAmount = selectedQuote.amount_total;
            this.state.status = selectedQuote.state;
            this.state.notes = selectedQuote.notes;
            this.state.customer = selectedQuote.partner_id ? selectedQuote.partner_id[2] : "";
            $(this.quotationDetailsRef.el).show();
        }

        async fetchQuotations(event) {
            $(this.quotationDetailsRef.el).hide();
            $(this.dropDownRef.el).show();
            const { quotations } = await this._fetchQuotations(event.currentTarget.value)
            this.state.quotations = quotations;
            this.env.pos.db.add_quotations(quotations);
        }

        getPayload() {
            return this.selectedQuote;
        }

        async confirm() {
            if (!this.selectedQuote) {
                this.showPopup('SaveQuotationError', {
                        body: this.env._t('Please Select Quotation'),
				    });
                    return;
                }
            this.props.resolve({ confirmed: true, payload: await this.getPayload() });
            this.trigger('close-popup');

        }



        _fetchQuotations(inputValue) {
            var self = this;
            return new Promise(function (resolve, reject) {
                if (!inputValue) {
                    resolve({'quotations': []});
                    return;
                }
                let domain = [['company_id', '=', self.env.pos.company.id], ['ref', 'ilike', self.props.value], ['state', '=', 'draft']]
                self.rpc({
                  model: 'pos.quotation',
                  method: 'search_read',
                  args: [domain],
                }).catch(function(unused, event) {
                self.showPopup('SaveQuotationError', {

                });
                return;
			     })
                .then(function (quotations) {
                    if (quotations){
                        quotations.reverse()
                    }
                    resolve({'quotations': quotations});

                });
            });
        }
    }



    LoadQuotationPopup.template = 'LoadQuotationPopUp';
    LoadQuotationPopup.defaultProps = { title: 'Confirm ?', value:'',  };
    Registries.Component.add(LoadQuotationPopup);

    return LoadQuotationPopup;
});

