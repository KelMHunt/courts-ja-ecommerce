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

    test('Verify clicking each footer social link opens the correct company social media page CFS-301', async() => {
        
        const result = await base.footer.confirmSocials()
        result.forEach(val => expect(val).toBeTruthy())
    })

    //Preferred implementation to test social function --needs work
    test.fixme('Verify clicking each footer social link opens the correct company social media page CFS-301', async({browser})=> {
        const context = await browser.newContext()
        const buttons = await base.footer.socialLinks.all()
        let results: boolean[] = []

        for(let i=0; i< buttons.length; i++){
            const url = await base.footer.getSocialUrl(context, i)
            const name = await base.footer.getSocialName(i)
            const check = await base.footer.verifySocial(url, name)
            results.push(check)
        }

        //close context along with its pages
        await context.close()
        
        results.forEach(val => expect(val).toBeTruthy())
    })
})

