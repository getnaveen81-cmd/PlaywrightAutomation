const { test, expect } = require('@playwright/test')

/* test.describe.configure({ mode: "parallel" }) instructs Playwright 
to run all tests within the current file or describe block concurrently 
instead of sequentially. Each test runs in its own isolated browser context 
and page, which reduces overall execution time. It should only be used 
when tests are independent and do not rely on shared state or execution order. */

/* test.describe.configure({ mode: "serial" }) configures all tests 
in the current describe block or file to run sequentially. If any 
test fails, Playwright skips the remaining tests in that serial group. 
It's useful when tests have dependencies, such as multi-step business 
workflows where each test relies on the successful completion of the previous one. */

test.describe.configure({mode:"parallel"})
// Test: handling popups and basic navigation/visibility interactions
test('@Web handling popups', async ({ page }) => {
    // Navigate to a practice page that contains UI controls we'll use
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')

    // Navigate away and back to demonstrate browser history actions
    await page.goto('https://www.google.com/')
    await page.goBack()      // back to the practice page
    await page.goForward()   // forward to Google
    await page.goBack()      // back again to the practice page

    // Verify an element with id `displayed-text` is visible
    await expect(page.locator('#displayed-text')).toBeVisible()

    // Click the button that hides the textbox, then assert it's hidden
    await page.locator('#hide-textbox').click()
    await expect(page.locator('#displayed-text')).toBeHidden()

    // Set up a handler to automatically dismiss any dialog that appears
    // (e.g., confirm/alert) so the test doesn't hang waiting for input.
    page.on('dialog', dialog => dialog.dismiss())

    // Click a button that triggers a confirm dialog. The dialog will be
    // dismissed by the handler above (equivalent to clicking "Cancel").
    await page.locator('#confirmbtn').click()


    // Demonstrate hovering over an element (useful for revealing menus/tooltips)
    await page.locator('#mousehover').hover()

    // const framePage = page.frameLocator('[name="iframe-name"]')

    // //  await framePage.locator("a[href*='lifetime-access']:visible").click()
    // await framePage.locator("a[href*='lifetime-access']").first().click()
    const framePage = page.frameLocator('[name="iframe-name"]');

    await framePage.locator("a[href*='lifetime-access']:visible").click();
     const text = await framePage.locator('.text h2').textContent()
     console.log("number of happy subscribers: "+ text.split(" ")[1])
})

test("Screeshot & Visual comaparision", async ({page})=>{
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    await expect(page.locator('#displayed-text')).toBeVisible()
    await page.screenshot({path: 'fullpage.png',fullPage: true});
    await page.locator('.right-align fieldset').nth(1).screenshot({path : "partialScreenshot.png"})
    await page.locator('#hide-textbox').click()
    await page.screenshot({path : "screenshot.png"})
    await expect(page.locator('#displayed-text')).toBeHidden()

})

test('visual', async({page})=>{
    await page.goto('https://www.flightaware.com/')
    expect(await page.screenshot()).toMatchSnapshot('landingpage.png')
})