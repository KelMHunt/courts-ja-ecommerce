import {test, expect, type Page} from '@playwright/test'
import {BasePage} from '../../../pages/basePage'
import * as footerData from '../../../test_data/footerData'


let page: Page
let base: BasePage

test.beforeAll(async({browser})=>{
    page = await browser.newPage()
    base = new BasePage(page)
    await page.goto("")
    await base.closePreferences()
})

test.describe('Header Menu tests', {tag: "@regression"}, ()=> {

    test.fail('Verify clicking each main menu option routes user to correct page CFS-219', async() => {
    await base.mainMenu.openMainMenu()
    const result = await base.mainMenu.confirmMainMenuOptions()
    result.forEach(val => expect(val).toBeTruthy())
    }) //expected to fail due to test data

    test('Verify departments menu displays expected departments CFS-218', async()=> {

        await base.mainMenu.openMainMenu()
        const deptMenu = await base.mainMenu.openDeptsMenu()
        const result = await deptMenu.confirmDepts()
        result.forEach(val => expect(val).toBeTruthy())
    })

    test.fail('Verify clicking each departments menu item displays dropdown of product categories list CFS-216', async()=> {
        await base.mainMenu.openMainMenu()
        const deptMenu = await base.mainMenu.openDeptsMenu()
        const result = await deptMenu.confirmDeptsCategories()
        result.forEach(val => expect(val).toBeTruthy())
    }) // expected to fail due to lack of unique element selectors in dom
    

})

test.describe('Footer Menu tests', {tag: "@regression"}, ()=> {

    
    test('Verify clicking a footer link category displays dropdown of footer links CFS-291', async()=> {
        const result = await base.footerMenu.confirmFooterMenuOptions()
        result.forEach(val => expect(val).toBeTruthy())
    })

    
})


