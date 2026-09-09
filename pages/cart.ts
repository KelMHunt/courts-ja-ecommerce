import {type Page, type Locator} from '@playwright/test'


export class Cart
{
    //variables
    private readonly page: Page
    readonly tray: Locator
    readonly heading: Locator
    readonly closeBtn: Locator
    readonly cartQuantity: Locator
    readonly badge: Locator
    readonly item: Locator
    readonly totalPrice: Locator
    readonly totalSavings: Locator
    readonly viewCartBtn: Locator
    readonly removeItemBtn: Locator

    //constructor
    constructor(page: Page){
        this.page = page
        this.tray = this.page.locator("#minicart-sidebar")
        this.heading = this.tray.locator("h4")
        this.closeBtn = this.page.locator(".close-drawer")
        this.cartQuantity = this.page.locator(".minicart_sidebar__heading__count")
        this.badge = this.page.locator(".counter-number")
        this.item = this.page.locator(".minicart_sidebar__content__items__item")
        this.totalPrice = this.page.locator(".cart-info .price")
        this.totalSavings = this.page.locator(".savings-amount div")
        this.viewCartBtn = this.page.locator(".btn-cart")
        this.removeItemBtn = this.page.locator(".cart-item-remove")
    }

    //methods
    async getItemNames(): Promise<string[]>{
        const itemNames: string[] = []
        let prevHeight = 0

        await this.tray.hover()

        while(true){
        
            await this.tray.evaluate((e) => e.scrollTo(0, e.scrollHeight)) //scroll down cart tray

            const allItems = await this.item.all()
            const currHeight = await this.tray.evaluate((e) => e.scrollHeight)

            if (currHeight === prevHeight) { //break loop when end of cart tray is reached
                break
            } else {
                for (const item of allItems) {
                    const name = await item.locator(".product-name").innerText()
                    itemNames.push(name)
                }
            }
    
            prevHeight = currHeight
        }

        return itemNames
    }

    async getCartBadge(): Promise<number>{
        const qty = await this.badge.innerText()
        return parseInt(qty)
    }

    async getCartQuantity():Promise<number>{
        const qty = (await this.cartQuantity.innerText()).split(" ")[0] ?? ""
        // console.log(qty)
        return parseInt(qty)
    }

    async getTotalPrice(): Promise<string>{
        return ""
    }

    async close(): Promise<void>{
        await this.closeBtn.click()
        await this.page.waitForTimeout(2000)
    }
    
}