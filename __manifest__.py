
{
    'name': 'Point of Sale Quotations',
    'version': '1.0',
    'category': 'Sales/Point of Sale',
    'sequence': 6,
    'summary': 'Save Quotations of Point Of Sale',
    'description': """

This module allows the seller to quickly save quotation for load it n future

""",
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
