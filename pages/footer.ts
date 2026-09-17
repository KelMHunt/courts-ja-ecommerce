import {type Page, type Locator, type BrowserContext} from '@playwright/test'
import * as data from '../test_data/footerData'
import * as helper from '../helpers/functions'


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
    

    private async getSocialLinks(): Promise<string[]>{
        const allSocials = await this.socialLinks.all()
        let links: string[] = []

        for(const btn of allSocials){
            const link = await btn.locator("a").getAttribute("href")
            if(link){
                links.push(link)
            } else {
                console.log("Attribute does not exist")
            }
        }
        return links
    }


   private async getSocialIcons(): Promise<string[]>{
        const allSocials = await this.socialLinks.all()
        let icons: string[] = []
        
        for(const btn of allSocials){
            const icon = await btn.locator("i").getAttribute("class")
            if(icon){
                icons.push(icon)
            } else {
                console.log("Attribute does not exist")
            }

        }
        return icons
   }

    async confirmSocials(): Promise<boolean[]>{
        
        const links = await this.getSocialLinks()
        const icons = await this.getSocialIcons()
        let pattern: boolean[] = []

        for(let i=0; i<icons.length; i++){
            // const pg = pages[i]
            const link = links[i]
            const icon = icons[i]

            if(icon?.includes("facebook") && link?.includes(data.socials.facebook)){
                pattern.push(true)
            } else if (icon?.includes("instagram") && link?.includes(data.socials.instagram)){
                pattern.push(true)
            } else if(icon?.includes("tiktok") && link?.includes(data.socials.tiktok)){
                pattern.push(true)
            } else if (icon?.includes("whatsapp") && link?.includes(data.socials.whatsapp)){
                pattern.push(true)
            } else {
                pattern.push (false)
            }
        }
        console.log(pattern)
        return pattern
   }

   /* Social functions not in use yet */
   // context logic not working
   async getSocialUrl(context:BrowserContext, index:number): Promise<string>{
    const socialBtn = this.socialLinks.nth(index)
    
    const pagePromise = context.waitForEvent('page')
    
    await socialBtn.click()
    
    const newPage = await pagePromise
    
    await newPage.waitForLoadState()
    await newPage.bringToFront()

    const url = newPage.url()
    return url
   }

   async getSocialName(index:number): Promise<string | null>{
        const name = await this.socialLinks.nth(index).locator("i").getAttribute("class")

        return name
   }

   async verifySocial(url: string, name: string| null): Promise<boolean>{
       if (name?.includes("facebook") && url.includes(data.socials.facebook)) {
           return true
       } else if (name?.includes("instagram") && url.includes(data.socials.instagram)) {
           return true
       } else if (name?.includes("tiktok") && url.includes(data.socials.tiktok)) {
           return true
       } else if (name?.includes("whatsapp") && url.includes(data.socials.whatsapp)) {
           return true
       } else {
           return false
       }
   }



}