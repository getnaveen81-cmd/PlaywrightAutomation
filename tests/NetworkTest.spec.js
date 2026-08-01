const { test, expect, request } = require('@playwright/test')
const {APiUtils}  = require('../utils/APiUtils')
const loginPayLoad = {userEmail: "getnaveen81@gmail.com", userPassword: "Rahulshetty@1234"} 
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68"}]}  
const fakePayLoadOrders = { data: [], message: "No Orders" };
let response;  

test.use({ ignoreHTTPSErrors: true });

test.beforeAll( async()=>{
const apiContext = await request.newContext({ ignoreHTTPSErrors: true})
const apiUtils = new APiUtils(apiContext,loginPayLoad)
response =  await apiUtils.createOrder(orderPayload)


})

test('Place the order',async({page})=>{

await page.addInitScript(value => {
    window.localStorage.setItem('token',value)
}, response.token) 

await page.goto('https://rahulshettyacademy.com/client/')

await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
    async route =>{
       const orderResponse =  await page.request.fetch(route.request())
       let body = JSON.stringify(fakePayLoadOrders)
       route.fulfill(
        {
            orderResponse,
            body
        }
       )
    } 
)

await page.locator("[routerlink='/dashboard/myorders']").click()
await page.waitForResponse('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*')
console.log(await page.locator('.mt-4').textContent())


})