import {type Page, type Locator} from '@playwright/test'
import * as data from '../../test_data/footerMenuData'
import * as helper from '../../helpers/functions'

export class FooterMenu
{
    //variables
    private readonly page: Page
    private readonly menuSection: Locator
    private readonly menuOptions: Locator
    private readonly menuLinks:string
    private readonly activeOption: Locator

    //constructor
    constructor(page: Page){
        this.page = page
        this.menuOptions = this.page.locator("h4.accordion")
        this.menuLinks = "div.panel li"
        this.menuSection = this.page.locator(".footer .container").nth(1) //second element
        this.activeOption = this.page.locator("h4.accordion.active")
    }


    //methods

    private async confirmFooterMenuLinks(name:string): Promise<boolean>{

        const links = (await this.activeOption.locator(`~ ${this.menuLinks}`).allInnerTexts()).map(e => e.trim())
        let check: boolean = false

        switch(name)
        {
            case data.aboutOptions.name:

                check = helper.isEqual(links, data.aboutOptions.links)
                break

            case data.ordersOptions.name:
                
                check = helper.isEqual(links, data.ordersOptions.links)
                break

            case data.servicesOptions.name:
                
                check = helper.isEqual(links, data.servicesOptions.links)
                break

            case data.benefitsOptions.name:
                
                check = helper.isEqual(links, data.benefitsOptions.links)
                break

            case data.contactOptions.name:
                const headings = (await this.page.locator(this.menuLinks).locator('h5').allInnerTexts()).map( e => e.trim())
                const details = (await this.page.locator(this.menuLinks).locator('p').allInnerTexts()).map( e => e.trim())

                check = (helper.isEqual(headings, data.contactOptions.headings) && helper.isEqual(details, data.contactOptions.details))
                break
                
        }
        return check
    }

    async confirmFooterMenuOptions():Promise<boolean[]>{
        const options = await this.menuOptions.all()
        let pattern: boolean [] = []
        let result: boolean

        for(const option of options){
            const title = await option.innerText()

            if(title){
                switch(title.trim())
                {
                    case data.aboutOptions.name:
                        await option.click() //collapse menu option
                        pattern.push(await this.confirmFooterMenuLinks(data.aboutOptions.name))
                        await option.click() //hide menu option
                        
                        break

                    case data.ordersOptions.name:
                        await option.click()
                        pattern.push(await this.confirmFooterMenuLinks(data.ordersOptions.name))
                        await option.click()

                        break
                    
                    case data.servicesOptions.name:
                        await option.click()
                        pattern.push(await this.confirmFooterMenuLinks(data.servicesOptions.name))
                        await option.click()
                        
                        break
                    
                    case data.benefitsOptions.name:
                        await option.click()
                        pattern.push(await this.confirmFooterMenuLinks(data.benefitsOptions.name))
                        await option.click()

                        break

                    case data.contactOptions.name:
                        await option.click()
                        pattern.push(await this.confirmFooterMenuLinks(data.contactOptions.name))
                        await option.click()
                        
                        break
                    
                    default:
                        pattern.push(false)
                }
            }
        }
        
        //debug
        // console.log(pattern)

        return pattern
    }

    
}