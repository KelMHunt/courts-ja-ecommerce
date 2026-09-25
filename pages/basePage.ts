import {type Page, type Locator} from '@playwright/test'
import { MainMenu } from './components/mainMenu'
import { DepartmentsMenu } from './components/deptMenu'
import { FooterMenu } from './components/footerMenu'
import {Footer} from '../pages/footer'
import {HomePage} from '../pages/homePage'
import { AccountPage } from './accountPage'
import { Cart } from '../pages/cart'

export class BasePage
{
    //variables
    private readonly page: Page

    //header
    readonly mainMenu: MainMenu
    readonly deptMenu: DepartmentsMenu
    private readonly logo: Locator
    private readonly userBtn: Locator
    private readonly cartBtn: Locator
    private readonly searchInput: Locator
    private readonly popUpClose: Locator

    //footer
    readonly footerMenu: FooterMenu
    readonly footer: Footer

    //constructor
    constructor(page: Page){
        this.page = page
        this.mainMenu = new MainMenu(this.page)
        this.deptMenu = new DepartmentsMenu(this.page)
        this.footerMenu = new FooterMenu(this.page)
        this.footer = new Footer(this.page)
        this.popUpClose = this.page.locator(".onetrust-close-btn-handler")
        this.logo = this.page.locator(".header__logo")
        this.userBtn = this.page.locator("img[src*='user.png']")
        this.cartBtn = this.page.locator("img[alt='Cart']")
        this.searchInput = this.page.locator("#search")
    }

    //methods
    async closePreferences(): Promise<void>{
        await this.popUpClose.click()
    }

    async gotoHome(): Promise<HomePage>{
        await this.logo.click()
        const homePage = new HomePage(this.page)
        await homePage.brandsHeadline.waitFor({state:'visible'})
        return homePage
    }

    async gotoAccount(): Promise<AccountPage>{
        await this.userBtn.click()
        const acctPage = new AccountPage(this.page)
        //add waitFor statement
        return acctPage
    }

    async openCart(): Promise<Cart>{
        await this.cartBtn.click()
        const cart = new Cart(this.page)
        await cart.tray.waitFor({state:'visible'})
        return cart
    }

    async getUrl(page: Page):Promise<string>{
        const url = page.url()
        return url
    }

    async scrollTo(element: Locator): Promise<void>{
        const position = await element.evaluate(e => e.scrollHeight)
        let prevHeight = 0
       
        while(true){
            await this.page.evaluate(p => window.scrollTo(0, document.body.scrollHeight))

            const currHeight = await this.page.evaluate(p => document.body.scrollHeight)

            if(currHeight === position){
                break
            } else if(currHeight === prevHeight){
                break
            }
            prevHeight = currHeight
        }
    }
}