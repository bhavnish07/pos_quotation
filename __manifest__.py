# -*- coding: utf-8 -*-
{
    'name': 'Point of Sale Quotations',
    'version': '1.0',
    'sequence': 6,
    'summary': 'Create and Save Quotations of Point Of Sale',
    'description': """
        This module allows the seller to quickly save quotation to load it in future
    """,

    'author': "AB Tech",
    'website': '',
    'category': 'Sales/Point of Sale',
    'depends': ['point_of_sale', 'hr'],
    'data': [
        'security/ir.model.access.csv',
        'views/assests.xml',
        'views/pos_quotation.xml',
        'data/ir_sequence.xml',
        'views/pos_config.xml',
        'views/pos_order.xml',
    ],
    'qweb': [
        'static/src/xml/AnalyticAccountButton.xml',
        'static/src/xml/AnalyticTagsButton.xml',
        'static/src/xml/LoadQuotationButton.xml',
        'static/src/xml/SaveQuotationButton.xml',
        'static/src/xml/SaveQuotationPopUp.xml',
        'static/src/xml/LoadQuotationPopup.xml',
        'static/src/xml/MultiSelectionPopup.xml',
        'static/src/xml/PaymentScreen.xml',
        'static/src/xml/OrderReceipt.xml',
    ],
    'installable': True,
}