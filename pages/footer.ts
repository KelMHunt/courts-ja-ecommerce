import {type Page, type Locator} from '@playwright/test'
import * as data from '../test_data/footerData'
import * as helper from '../test_data/helpers/functions'

export class Footer
{
    //variables
    private readonly page: Page
    readonly newsletterContent: Locator
    readonly newsletterHeading: Locator
    readonly newsletterMessage: Locator
    readonly newsletterSignUpInput: Locator
    readonly newsletterSignUpBtn: Locator
    readonly socialLinks: Locator
    readonly paymentMethods: Locator
    readonly locationBtn: Locator
    readonly currencyBtn: Locator


    constructor(page: Page){
        this.page = page
        this.newsletterContent = this.page.locator(".footer__newsletter__content")
        this.newsletterHeading = this.page.locator(".newsletter-title")
        this.newsletterMessage = this.page.locator(".newsletter-message")
        this.newsletterSignUpInput = this.page.locator(".field.newsletter")
        this.newsletterSignUpBtn = this.page.locator("button.subscribe")
        this.socialLinks = this.page.locator(".footer__middle .social-links li")
        this.paymentMethods = this.page.locator("img[alt*=/Payment Methods/]")
        this.locationBtn = this.page.locator("#switcher-store")
        this.currencyBtn = this.page.locator("#switcher-currency")

    }

    //methods

    async confirmCountriesList(): Promise<boolean[]>{
        await this.locationBtn.click()

        const options = await this.locationBtn.locator("li").all()
        let pattern: boolean[] = []
        
        for(let i=0; i<options.length; i++){
            const country = await options[i]?.innerText()
            const img = options[i]?.locator("span[style*='background-image']")

            if(country?.trim()===data.locations[i] && img?.isVisible()){
                pattern.push(true)
            } else {
                pattern.push(false)
            }
        }
        // console.log(pattern)
        
        return pattern
    }

    async selectCountry(name:string): Promise<boolean>{
        await this.locationBtn.click()
        let isFound: boolean = false
        const options = await this.locationBtn.locator("li").all()
        
        for(const option of options){
            const country = (await option.innerText()).trim()
            if(country===name){
                await option.click()
                isFound = true
                break
            }
        }
        if(!isFound){
            console.log("Country does not exist in the list")
        }
        return isFound
    }

    async confirmCurrenciesList(): Promise<boolean[]>{
        const options = await this.currencyBtn.locator("li").all()
        let pattern: boolean[] = []

        for(let i=0; i<options.length; i++){
            const currency = await options[i]?.innerText()
            

            if(currency?.trim()===data.currencies[i]){
                pattern.push(true)
            } else {
                pattern.push(false)
            }
        }
        if(options.length<1){
            console.log("There are no options available")
            pattern.push(false)
        }
        // debug
        console.log(options,pattern)
        
        return pattern

    }

    async selectCurrency(name: string): Promise<boolean>{
        await this.currencyBtn.click()
        let isFound:boolean = false
        const options = await this.currencyBtn.locator("li").all()

        for(const option of options){
            const currency = (await option.innerText()).trim()
            if(currency===name){
                await option.click()
                isFound = true
                break
            }
        }
        if(options.length<1){
            console.log("There are no options available")
        } else if(!isFound){
            console.log("Currency does not exist in the list")
        }
        return isFound
    }
}