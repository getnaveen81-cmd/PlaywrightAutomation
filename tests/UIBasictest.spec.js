const {test} = require('@playwright/test')

test('Child Windows Handling', async ({browser})=>{
   const context = await browser.newContext()
   const page = await context.newPage()
   await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
   const documentLink = page.locator('[href*="documents-request"]')
   const usernameInput = page.locator('#username')

   const [newPage] = await Promise.all(
    [ 
        context.waitForEvent('page'),
        documentLink.click(),
    ])

   const text = await newPage.locator(".red").textContent()
   console.log(text)
   const arrayText = text.split("@")
   const domain = arrayText[1].split(" ")[0]
   console.log(domain)
})
