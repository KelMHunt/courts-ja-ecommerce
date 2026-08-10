import {test, expect, type Page} from '@playwright/test'
import {BasePage} from '../../../pages/basePage'
import { locations } from '../../../test_data/footerData'


let page: Page
let base: BasePage

test.beforeAll(async({browser})=>{
    page = await browser.newPage()
    base = new BasePage(page)
    await page.goto("")
    await base.closePreferences()
})

test.describe('Header tests', {tag: "@regression"}, ()=> {

    test.fail('Verify clicking each main menu option routes user to correct page CFS-219', async() => {
    await base.mainMenu.openMainMenu()
    const result = await base.mainMenu.confirmMainMenuOptions()
    result.forEach(val => expect(val).toBeTruthy())
})

})

test.describe('Footer tests', {tag: "@regression"}, ()=> {

    test('Verify clicking a footer link category displays dropdown of footer links CFS-291', async()=> {
        const result = await base.footerMenu.confirmFooterMenuOptions()
        result.forEach(val => expect(val).toBeTruthy())
    })

    test('Verify clicking location button opens dropdown modal of expected countries CFS-298', async()=> {
        const result = await base.footer.confirmCountriesList()
        result.forEach(val => expect(val).toBeTruthy())
    })

    test('Verify correct url when different location is selected CFS-300', async() => {
        const choice = locations[2]!
        const result = await base.footer.selectCountry(choice)
        expect(result).toBeTruthy()
        expect(page.url()).toContain(choice.toLowerCase())
    })
})


