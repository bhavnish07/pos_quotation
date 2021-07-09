odoo.define('point_of_sale.MultiSelectionPopup', function (require) {
    'use strict';

    const { useState } = owl.hooks;
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');

    class MultiSelectionPopup extends AbstractAwaitablePopup {

        constructor() {
            super(...arguments);
            var selectedListObject = {}
            this.props.list.forEach((item) => {
                if (item.isSelected)  {
                    selectedListObject[item.id] = item;
                }
            });
            this.state = useState({ selectionListObject:selectedListObject, originalList: this.props.list});
        }
        selectItem(itemId, ev) {
            if (this.state.selectionListObject[itemId]) {
                delete this.state.selectionListObject[itemId]
            } else {
                this.state.selectionListObject[itemId] = this.props.list.find(item => item.id === itemId);
            }

        }
        /**
         * We send as payload of the response the selected item.
         *
         * @override
         */
        getPayload() {
            var self = this;
            return this.state.selectionListObject;
        }
    }
    MultiSelectionPopup.template = 'MultiSelectionPopup';
    MultiSelectionPopup.defaultProps = {
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        title: 'Select',
        body: '',
        list: [],
    };

    Registries.Component.add(MultiSelectionPopup);

    return MultiSelectionPopup;
});
