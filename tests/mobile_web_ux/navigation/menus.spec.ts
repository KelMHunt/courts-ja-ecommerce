import {test, expect, type Page} from '@playwright/test'
import { MainMenu } from '../../../pages/components/mainMenu'
import {BasePage} from '../../../pages/basePage'


let page: Page
let mainMenu: MainMenu

test.beforeAll(async({browser})=>{
    page = await browser.newPage()
    mainMenu = new MainMenu(page)
    await page.goto("")
})

test.fail('Verify clicking each main menu option routes user to correct page', async() => {
    await mainMenu.openMainMenu()
    const result = await mainMenu.confirmMainMenuOptions()
    result.forEach(val => expect(val).toBeTruthy())
})