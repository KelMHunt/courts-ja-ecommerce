import {type Page, type Locator} from '@playwright/test'
import * as data from '../../test_data/deptsMenuData'
import * as helper from '../../helpers/functions'

export class DepartmentsMenu
{
    //variables
    private readonly page: Page
    private readonly backBtn: Locator
    private readonly menuItem: Locator

    //constructor
    constructor(page:Page){
        this.page = page
        this.backBtn = this.page.locator("button.back-mainmenu").nth(1)
        this.menuItem = this.page.locator("li [role='menuitem']")
        
    }
    //methods

    async confirmDepts(): Promise<boolean[]>{
        const allItems = (await this.menuItem.all()).slice(12)//take second set of duplicated elements
        let pattern: boolean[] = []

        for(let i in allItems){
            const text = await allItems[i]?.innerText()
            
            if(text===data.departments[i]){
                pattern.push(true)
            } else {
                pattern.push(false)
            }
        }
        // console.log(pattern)
        return pattern
    }

    private async getSubMenuContents(item: Locator):Promise<string[]>{
        const subMenu = item.locator("~ ul[role='menu']")
        const contents = await subMenu.locator("li").allInnerTexts()

        return contents
    }

    async confirmDeptsCategories(): Promise<boolean[]>{
        const allItems = (await this.menuItem.all()).slice(12)
        let pattern: boolean[] = []
        
        for(const item of allItems){
            const dept = await item.innerText()
            await item.click()
            const contents = await this.getSubMenuContents(item)
            
            switch(dept){
                case data.TV.name:
                    pattern.push(helper.isEqual(contents, data.TV.categories))
                    break
                
                case data.phones.name:
                    pattern.push(helper.isEqual(contents, data.phones.categories))
                    break

                case data.furniture.name:
                    pattern.push(helper.isEqual(contents, data.furniture.categories))
                    break

                case data.homeAppliance.name:
                    pattern.push(helper.isEqual(contents, data.homeAppliance.categories))
                    break

                case data.smallAppliance.name:
                    pattern.push(helper.isEqual(contents, data.smallAppliance.categories))
                    break

                case data.automotive.name:
                    pattern.push(helper.isEqual(contents, data.automotive.categories))
                    break

                case data.sports.name:
                    pattern.push(helper.isEqual(contents, data.sports.categories))
                    break

                case data.hardware.name:
                    pattern.push(helper.isEqual(contents, data.hardware.categories))
                    break

                case data.home.name:
                    pattern.push(helper.isEqual(contents, data.home.categories))
                    break

                case data.healthAndBeauty.name:
                    pattern.push(helper.isEqual(contents, data.healthAndBeauty.categories))
                    break

                case data.technology.name:
                    pattern.push(helper.isEqual(contents, data.technology.categories))
                    break

                case data.giftCard.name:
                    pattern.push(helper.isEqual(contents, data.giftCard.categories))
                    break

                default:
                    pattern.push(false)
            }
        }
        console.log(pattern)
        return pattern
    }
}