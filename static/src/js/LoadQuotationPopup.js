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

			this.state = useState({ quotations: [] });
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
            this.selectQuoteId = selectedQuoteId;
            this.selectedQuote = selectedQuote;
             $(this.inputRef.el).val(this.selectedQuote.ref);
            $(this.dropDownRef.el).hide();
        }

        async fetchQuotations(event) {
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
                alert("Please Select Quotation");
                return ;
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
                }).then(function (quotations) {
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

