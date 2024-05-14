# -*- coding: utf-8 -*-
{
    'name': 'Custom Dashboard',
    'version': '1.0',
    'website': 'https://logicbite.wordpress.com',
    'author': 'Shah Alam Sumon',
    'summary': 'Custom Dashboard with ChartJS',
    'sequence': -1,
    'description': """
    Custom Dashboard with ChartJS
    =============================
    Make dashboard with chartJS and OWL.
    """,
    'category': 'Productivity',
    'depends': ['base', 'web', 'sale', 'board'],
    'data': [
        'views/sales_dashboard_menu.xml',
    ],
    'demo': [
    ],
    'installable': True,
    'application': True,
    'assets': {
        'web.assets_backend': [
            'odoo_custom_dashboard/static/src/components/**/*.js',
            'odoo_custom_dashboard/static/src/components/**/*.xml',
            # 'odoo_custom_dashboard/static/src/components/**/*.scss',
        ],
    },
    'license': 'LGPL-3',
}
