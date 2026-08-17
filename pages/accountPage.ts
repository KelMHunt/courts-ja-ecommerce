import {type Page, type Locator} from '@playwright/test'

export class AccountPage
{
    //variables
    private readonly page: Page


    //login section
    readonly loginSection: Locator
    readonly loginHeading: Locator
    readonly email: Locator
    readonly password: Locator
    readonly signInBtn: Locator
    readonly forgotPasswordBtn: Locator

    //social logins
    readonly googleLoginBtn: Locator
    readonly facebookLoginBtn: Locator

    //register section
    readonly registerSection: Locator
    readonly createAccountBtn: Locator

    //constructor
    constructor(page: Page){
        this.page = page
        this.loginSection = this.page.locator("div.block-customer-login").nth(1)
        this.loginHeading = this.page.locator("#block-customer-login-heading").nth(1)
        this.email = this.page.locator("div.field.email").nth(1)
        this.password = this.page.locator("div.field.password").nth(1)
        this.signInBtn = this.page.locator("button.login")
        this.forgotPasswordBtn = this.page.locator(".remind")
        this.googleLoginBtn = this.page.locator("button.-google")
        this.facebookLoginBtn = this.page.locator("button.-facebook")
        this.registerSection = this.page.locator("div.block-new-customer").nth(1)
        this.createAccountBtn = this.page.locator("a.create")
    }

    //methods
}