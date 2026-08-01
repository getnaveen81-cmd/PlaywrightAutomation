const {expect} = require('@playwright/test')

class OrdersHistoryPage{
    constructor(page){
        this.page = page
        this.ordersTable = page.locator('tbody')
        this.rows = page.locator('tbody tr')
        this.ordersIdDetails = page.locator('.col-text') 
    }

    async searchOrderAndSelect(orderId){
        await this.ordersTable.waitFor();         
         
           for (let i = 0; i < await this.rows.count(); ++i) {
              const rowOrderId = await this.rows.nth(i).locator("th").textContent();
              if (orderId.includes(rowOrderId)) {
                 await this.rows.nth(i).locator("button").first().click();
                 break;
              }
           }
           const orderIdDetails = await this.ordersIdDetails.textContent();
           expect(orderId.includes(orderIdDetails)).toBeTruthy();
         
    }

    async getOrderId()
    {
    return await this.ordersIdDetails.textContent();
    }
}
module.exports = { OrdersHistoryPage}