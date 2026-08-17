import {type Page, type Locator} from '@playwright/test'
import {DepartmentsMenu} from '../components/deptMenu'
import { mainMenuData as data } from '../../test_data/mainMenuData'

export class MainMenu 
{
    //variables (elements)
    private readonly page
    private readonly menuIcon: Locator
    private readonly logoClose: Locator
    private readonly menuTray: Locator
    private readonly menuOptions: Locator
    private readonly deptsLink: Locator
    private readonly orderHistoryLink: Locator
    private readonly accountLink: Locator
    private readonly wishlistLink: Locator
    private readonly payBillLink: Locator
    private readonly getCreditLink: Locator
    private readonly giftCardsLink: Locator
    private readonly helpLink: Locator
    private readonly contactUsLink: Locator
    private readonly storesLink: Locator
    private readonly feedbackLink: Locator
    private readonly loginBtn: Locator
    private readonly socialsList: Locator

    
    
    //constructor
    constructor(page: Page){
        this.page = page
        this.menuIcon = this.page.locator(".side-menu__mobile")
        this.logoClose = this.page.locator(".close").first()
        this.menuTray = this.page.locator(".navigation").last()
        this.deptsLink = this.page.getByRole("link", {name: /Departments/})
        this.orderHistoryLink = this.page.locator("a#header_order_01").first()
        this.accountLink = this.page.getByText(/Account/)
        this.wishlistLink = this.page.locator("a#header_wishlist_01").first()
        this.payBillLink = this.page.getByText(/Pay Bill/)
        this.getCreditLink = this.page.getByText(/Get Credit/)
        this.giftCardsLink = this.page.getByText(/Giftcards/)
        this.helpLink = this.page.getByText(/Help/)
        this.contactUsLink = this.page.getByText(/Contact Us/)
        this.storesLink = this.page.getByText(/Stores/)
        this.feedbackLink = this.page.getByText(/Give Feedback/)
        this.loginBtn = this.page.getByRole("button", {name: /Sign in or Create Account/})
        this.socialsList = this.page.locator(".social-network ul")
        this.menuOptions = this.page.locator(".navigation__submenu li")
        
    }

    //methods

    async openMainMenu():Promise<boolean>{
        await this.menuIcon.click()
        const isMenuOpen = await this.menuTray.isVisible()
        return isMenuOpen
    }

    async closeMainMenu():Promise<boolean>{
        await this.logoClose.click()
        const isMenuClosed = await this.menuTray.isHidden()
        return isMenuClosed
    }

    async openDeptsMenu():Promise<DepartmentsMenu>{
        await this.deptsLink.click()
        const deptMenu = new DepartmentsMenu(this.page)
        return deptMenu
    }

    async confirmMainMenuOptions(): Promise<boolean[]>{
        const options = await this.menuOptions.all()
        let pattern: boolean[] = []

        for(let i in options.slice(0,11)){ //iterate first 11 elements of list due to duplicate dom elements
            const text = await options[i]?.innerText()
            const link = await options[i]?.locator('a').getAttribute("href")
            
            if(text){
                if(text.trim() === data.labels[i]) {
                    if(link){
                        if(link.includes(data.links[i]!)){
                            pattern.push(true)
                        } else {
                            pattern.push(false)
                        }
                    }
                } else {
                    pattern.push(false)
                }
            }
        }

        return pattern

        // debug
        // console.log(text, link)
        // console.log(pattern)
        
    }

}