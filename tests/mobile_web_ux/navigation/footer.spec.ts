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

test.describe('Footer Tests', {tag: "@regression"}, ()=> {
    
    test('Verify correct newsletter heading and message are displayed in footer CFS-302', async () => {
        const heading = (await base.footer.newsletterHeading.innerText()).trim()
        const note = (await base.footer.newsletterMessage.innerText()).trim()

        expect(heading).toContain(footerData.newsletter.heading)
        expect(note).toContain(footerData.newsletter.description)
    })

    test('Verify clicking location button opens dropdown modal of expected countries CFS-298', async () => {
        const result = await base.footer.confirmCountriesList()
        result.forEach(val => expect(val).toBeTruthy())
    })

    test('Verify correct url when different location is selected CFS-300', async () => {
        const choice = footerData.locations[2]!
        const result = await base.footer.selectCountry(choice)
        expect(result).toBeTruthy()
        expect(page.url()).toContain(choice.toLowerCase())
    })

    test.fail('Verify clicking currency button opens dropdown modal of expected currencies CFS-299', async () => {
        const result = await base.footer.confirmCurrenciesList()
        result.forEach(val => expect(val).toBeTruthy())
    })

    test.fail('Verify correct currency is displayed on home page when user selects different currency CFS-303', async () => {
        const currency = footerData.currencies[1]!
        const result = await base.footer.selectCurrency(currency)
        expect(result).toBeTruthy()
        //assert that home page displays price in chosen currency
    })

    test('Verify clicking each socials icon routes user to correct page', async({browser}) => {
        const context = await browser.newContext()
        const result = await base.footer.confirmSocials(context)
        result.forEach(val => expect(val).toBeTruthy())
        //test to be updated to use context variable
    })
})

