odoo.define('pos_quotation.SaveQuotationPopUp', function(require) {
    'use strict';

    const { useState, useRef } = owl.hooks;
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');

    class SaveQuotationPopUp extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
            this.state = useState({ inputValue: this.props.startingValue, quotationNumber: this.props.quotationNumber, customer: this.props.customer});
            this.inputRef = useRef('textarea');
        }
        mounted() {
            this.inputRef.el.focus();
        }
        getPayload() {
            return this.state.inputValue
        }

        async confirmPrint() {
            this.props.resolve({ confirmed: true, payload: await this.getPayload(), print: true });
            this.trigger('close-popup');
        }

        _cancelAtEscape(event) {
            super._cancelAtEscape(event);
            if (event.key === 'Enter') {
                this.confirm();
            }

        }
    }

    class SaveQuotationError extends AbstractAwaitablePopup {
      constructor() {
            super(...arguments);
             }
    }

    SaveQuotationPopUp.template = 'SaveQuotationPopUp';
    SaveQuotationError.template = 'SaveQuotationError';

    SaveQuotationPopUp.defaultProps = {
        confirmText: 'Save',
        cancelText: 'Cancel',
        title: '',
        body: '',
        startingValue: '',
    };
    SaveQuotationError.defaultProps = {
        confirmText: 'Save',
        cancelText: 'Cancel',
        title: 'Warning',
        body: 'Please make sure you are connected to the network.',
        startingValue: '',
    };

    Registries.Component.add(SaveQuotationPopUp);
    Registries.Component.add(SaveQuotationError);

    return SaveQuotationPopUp;
});
