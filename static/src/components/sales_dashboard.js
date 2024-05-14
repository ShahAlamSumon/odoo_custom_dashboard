/** @odoo-module */

import { registry } from "@web/core/registry"
import { KpiCard } from "./kpi_card/kpi_card"
import { ChartRenderer } from "./chart_renderer/chart_renderer"
import { useService } from "@web/core/utils/hooks"

const { Component, useState, onWillStart } = owl;
const { DateTime } = luxon;

export class OwlSalesDashboard extends Component {
    setup(){
        this.state = useState({
            quotations: {
                value:10,
                percentage:6,
            },
            period:90,
        })
        this.orm = useService("orm")

        onWillStart(async ()=>{
            this.getDates()
            await this.getQuotations()
            await this.getOrders()
        })
    }
    async onChangePeriod(){
        this.getDates()
        await this.getQuotations()
    }
    getDates(){
        this.state.current_date = DateTime.now().minus({ days: this.state.period }).toLocaleString(DateTime.DATE_SHORT);
        this.state.previous_date = DateTime.now().minus({ days: this.state.period * 2 }).toLocaleString(DateTime.DATE_SHORT);
    }
    async getQuotations(){
        let domain = [['state', 'in', ['sent', 'draft']]]
        if (this.state.period > 0){
            domain.push(['date_order','>', this.state.current_date])
        }
        const data = await this.orm.searchCount("sale.order", domain)
        this.state.quotations.value = data

        // previous period
        let prev_domain = [['state', 'in', ['sent', 'draft']]]
        if (this.state.period > 0){
            prev_domain.push(['date_order','>', this.state.previous_date], ['date_order','<=', this.state.current_date])
        }
        const prev_data = await this.orm.searchCount("sale.order", prev_domain)
        const percentage = ((data - prev_data)/prev_data) * 100
        this.state.quotations.percentage = percentage.toFixed(2)
    }

    async getOrders(){
    let domain = [["state", "in", ["sale", "done"]]]
    if (this.state.period > 0){
        domain.push(["date_order",">", this.state.current_date])
    }
    const data = await this.orm.searchCount("sale.order", domain)

    // previous period
    let prev_domain = [["state", "in", ["sale", "done"]]]
    if (this.state.period > 0){
        prev_domain.push(["date_order",">", this.state.previous_date], ["date_order","<=", this.state.current_date])
    }
    const prev_data = await this.orm.searchCount("sale.order", prev_domain)
    const percentage = ((data - prev_data)/prev_data) * 100

    //revenues
    const current_revenue = await this.orm.readGroup("sale.order", domain, ["amount_total:sum"], [])
    const prev_revenue = await this.orm.readGroup("sale.order", prev_domain, ["amount_total:sum"], [])
    const revenue_percentage = ((current_revenue[0].amount_total - prev_revenue[0].amount_total) / prev_revenue[0].amount_total) * 100

    //average
    const current_average = await this.orm.readGroup("sale.order", domain, ["amount_total:avg"], [])
    const prev_average = await this.orm.readGroup("sale.order", prev_domain, ["amount_total:avg"], [])
    const average_percentage = ((current_average[0].amount_total - prev_average[0].amount_total) / prev_average[0].amount_total) * 100

    this.state.orders = {
        value: data,
        percentage: percentage.toFixed(2),
        revenue: `$${(current_revenue[0].amount_total/1000).toFixed(2)}K`,
        revenue_percentage: revenue_percentage.toFixed(2),
        average: `$${(current_average[0].amount_total/1000).toFixed(2)}K`,
        average_percentage: average_percentage.toFixed(2),
    }
    }

}

OwlSalesDashboard.template = "owl.OwlSalesDashboard"
OwlSalesDashboard.components = { KpiCard, ChartRenderer }

registry.category("actions").add("owl.sales_dashboard", OwlSalesDashboard)