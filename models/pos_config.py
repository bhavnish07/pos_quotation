from odoo import models, api, fields


class PosConfig(models.Model):
    _inherit = "pos.config"

    account_analytic_tags = fields.Many2many("account.analytic.tag")
    analytic_account_ids = fields.Many2many('account.analytic.account')
    analytic_accounts = fields.Boolean("Analytic Account")
    analytic_tags = fields.Boolean("Analytic Tags")
    analytic_account_group = fields.Boolean(compute='compute_analytic_account_group')
    analytic_tags_group = fields.Boolean(compute='compute_analytic_tags_group')

    def compute_analytic_account_group(self):
        for rec in self:
            rec.analytic_account_group = self.env.user.has_group('analytic.group_analytic_accounting')

    def compute_analytic_tags_group(self):
        for rec in self:
            rec.analytic_tags_group = self.env.user.has_group('analytic.group_analytic_tags')