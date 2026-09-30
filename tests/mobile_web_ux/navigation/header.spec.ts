import {test, expect, type Page} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import * as labels from '../../../test_data/labels'

let page: Page
let base: BasePage

test.beforeEach(async({page})=> {
    // page = await browser.newPage()
    base = new BasePage(page)

    await page.goto("")
    await base.closePreferences()
})

test.afterEach(async({page})=> {
    await page.close()
})

test.describe('Header Tests', {tag: "@regression"}, ()=> {
    test('Verify clicking company logo routes user to home page CFS-206', async()=> {
        const homePage = await base.gotoHome()
        await expect(homePage.brandsHeadline).toBeVisible()
        await expect(homePage.brandsHeadline).toHaveText(labels.home.brandsHeadline)
    })

    test('Verify clicking user account button icon routes user to account page CFS-207', async()=>{
        const accountPage = await base.gotoAccount()
        await expect(accountPage.loginHeading).toBeVisible()
        await expect(accountPage.loginHeading).toHaveText(labels.account.loginHeading)
    })

    test('Verify clicking cart button icon opens cart tray CFS-208', async()=> {
        const cart = await base.openCart()
        await expect(cart.tray).toBeVisible()
        await expect(cart.heading).toBeVisible()
        await expect(cart.heading).toHaveText(labels.cart.heading)
    })

    test('Verify clicking side menu button icon opens side menu CFS-209', async()=> {
        const mainMenu = await base.openMainMenu()
        await expect(mainMenu.menuTray).toBeVisible()
    })


})