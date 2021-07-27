odoo.define("pos.quotation", function(require) {
    var models = require('point_of_sale.models');

    var _super_pos = models.PosModel.prototype;
    _super_pos.models.push({
        model:  'pos.quotation',
        label: 'load_quotations',
        fields: ['name','pos_session_id','company_id','config_id','quotation_date','ref','user_id',
                 'amount_tax','amount_total','pricelist_id','partner_id','fiscal_position_id','write_date',
                 'notes','currency_id', 'lines'],
        domain: function(self){ return [['company_id','=', self.company.id], ['state',  '=', 'draft']]; },
        loaded: function(self,quotations){
            self.quotations = quotations;
            self.db.add_quotations(quotations);
        },
    });
    _super_pos.models.push({
        model:  'pos.quotation.line',
        label: 'load_quotations_line',
        fields: ['company_id','product_id','price_unit','qty','price_subtotal','price_subtotal_incl',
                 'discount','quotation_id','product_uom_id','currency_id','tax_ids'],
        domain: function(self){ return [['company_id','=', self.company.id]]; },
        loaded: function(self,quotations_line){
            self.quotations_line = quotations_line;
            self.db.add_quotations_lines(quotations_line);
        },
    });

    _super_pos.models.push({
        model:  'account.analytic.tag',
        label: 'analytic_tags',
        fields: [],
        condition: function (self) { return self.config.analytic_tags_group && self.analytic_tags; },
        domain: function(self){ return [['id','=', self.config.account_analytic_tags]]; },
        loaded: function(self,account_analytic_tags){
            self.account_analytic_tags = account_analytic_tags;
        },
    });

    _super_pos.models.push({
        model:  'account.analytic.account',
        label: 'analytic_accounts',
        fields: [],
        condition: function (self) { return self.config.analytic_account_group && self.analytic_accounts; },
        domain: function(self){ return [['id','=', self.config.analytic_account_ids]]; },
        loaded: function(self,analytic_accounts){
            self.analytic_accounts_ids = analytic_accounts;
        },
    });

    models.PosModel = models.PosModel.extend({
        initialize: function(attributes,options){
            this.analytic_accounts_ids = [];
            this.account_analytic_tags = [];
            _super_pos.initialize.apply(this, arguments);
        },
    });


    var _super_pos_order = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function(attributes,options){
            this.analytic_account_id = false;
            this.analytic_tags = {}
            _super_pos_order.initialize.apply(this, arguments);
            return this;
        },
        export_as_JSON: function(){
            let json = _super_pos_order.export_as_JSON.apply(this, arguments);
            json.quotation_id = this.quotation_id;
            json.quotation_name = this.quotation_name;
            json.seller_id = this.seller_id;
            json.seller_id_employee = this.seller_id_employee;
            json.analytic_account_tags = [];
            for (key of Object.keys(this.analytic_tags)) {
                json.analytic_account_tags.push(key);
            }
            json.seller_id = this.seller_id;
            json.analytic_account_id = this.analytic_account_id;
            return json;
        },

        export_for_printing: function() {
            var self = this;
            var receipt =  _super_pos_order.export_for_printing.apply(this, arguments);
            if (this.seller_id_employee) {
                receipt['seller'] = self.pos.seller_employees_by_id[this.seller_id_employee].name
            } else if (this.seller_id) {
                const user = self.pos.users.find((user) => user.id = self.seller_id);
                if (user) {
                    receipt['seller'] = user.name
                }
            }
            if (this.quotation_id) {
                var quotation = this.pos.db.get_quotation_by_id(this.quotation_id)
                if (quotation) {
                    receipt['quotation'] = {
                        name: quotation.ref,
                        id: quotation.id,

                    }
                }
            }
           return receipt
        }
    });

    models.load_models([{
        model:  'hr.employee',
        fields: ['name', 'id', 'user_id'],
        domain: function(self){
            return [['company_id', '=', self.config.company_id[0]]];
        },
        loaded: function(self, employees) {
            if (self.config.module_pos_hr) {
                self.seller_employees = employees;
                self.seller_employees_by_id = {};
                self.seller_employees.forEach(function(employee) {
                    self.seller_employees_by_id[employee.id] = employee;
                    var hasUser = self.users.some(function(user) {
                        if (user.id === employee.user_id[0]) {
                            employee.role = user.role;
                            return true;
                        }
                        return false;
                    });
                    if (!hasUser) {
                        employee.role = 'cashier';
                    }
                });
            }
        }
    }]);
});