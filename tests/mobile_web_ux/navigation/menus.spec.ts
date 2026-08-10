import {test, expect, type Page} from '@playwright/test'
import { MainMenu } from '../../../pages/components/mainMenu'
import {BasePage} from '../../../pages/basePage'


let page: Page
let base: BasePage

test.beforeAll(async({browser})=>{
    page = await browser.newPage()
    base = new BasePage(page)
    await page.goto("")
})

test.describe('Header tests', {tag: "@regression"}, ()=> {

    test.fail('Verify clicking each main menu option routes user to correct page', async() => {
    await base.mainMenu.openMainMenu()
    const result = await base.mainMenu.confirmMainMenuOptions()
    result.forEach(val => expect(val).toBeTruthy())
})

})

test.describe('Footer tests', {tag: "@regression"}, ()=> {

    test('Verify clicking a footer link category displays dropdown of footer links', async()=> {
        const result = await base.footerMenu.confirmFooterMenuOptions()
        result.forEach(val => expect(val).toBeTruthy())
    })
})


