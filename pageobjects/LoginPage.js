class LoginPage{
     constructor(page){
        this.page = page;
        this.signinButton = page.locator("[value='Login']");
        this.username= page.locator("#userEmail");
        this.password= page.locator("#userPassword");
     }

     async goto(){
        await this.page.goto("https://rahulshettyacademy.com/client")
     }

     async validLogin(username,password){
        await this.username.fill(username)
        await this.password.fill(password)
        await this.signinButton.click()
     }
}
module.exports = {LoginPage}