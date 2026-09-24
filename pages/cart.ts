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

    async getItemPrices(): Promise<number[]>{
        const prices: number[] = []
        let prevHeight = 0
        let price

        await this.tray.hover()

        while(true){
        
            await this.tray.evaluate((e) => e.scrollTo(0, e.scrollHeight)) //scroll down cart tray

            const allItems = await this.item.all()
            const currHeight = await this.tray.evaluate((e) => e.scrollHeight)

            if (currHeight === prevHeight) { //break loop when end of cart tray is reached
                break
            } else {
                for (const item of allItems) {
                    const hasDiscount = item.locator("discount-label") ? true : false
                    
                    if(hasDiscount){
                        price = (await item.locator(".current-price").innerText()).split("$")[1]
                    } else {
                        price = (await item.locator(".price").innerText()).split("$")[1]
                    }
                    const formattedPrice = price?.replace(",","")
                    prices.push(parseFloat(formattedPrice!))
                }
            }
    
            prevHeight = currHeight
        }
        return prices
    }

    async getItemImages(): Promise<string[]>{
        const images: string[] = []
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
                    const img = await item.locator("img").getAttribute("alt") ?? ""
                    images.push(img)
                }
            }
    
            prevHeight = currHeight
        }

        return images
    }

    async getItemQuantities(): Promise<number[]>{
        const qtys: number[] = []
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
                    const amt = await item.locator("input").getAttribute("data-item-boxqty") ?? ""
                    qtys.push(parseInt(amt))
                }
            }
    
            prevHeight = currHeight
        }

        return qtys
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

    async getSubtotal():Promise<number>{
        const subtotal = (await this.tray.locator(".subtotal").innerText()).split("$")[1]
        const formattedSubtotal = subtotal?.replace(",", "")
        return parseFloat(formattedSubtotal!)
    }

    async getTaxTotal(): Promise<number>{
        const taxTotal = (await this.tray.locator(".tax").innerText()).split("$") [1]
        const formattedTaxTotal = taxTotal?.replace(",", "")
        return parseFloat(formattedTaxTotal!)
    }

    async getTotal(): Promise<number>{
        const total = (await this.tray.locator(".cart-info__total").innerText()).split("$")[1]
        const formattedTotal = total?.replace(",", "")
        return parseFloat(formattedTotal!)
    }

    async close(): Promise<void>{
        await this.closeBtn.click()
        await this.tray.waitFor({state:'hidden'})
    }

    async incrementItem(item:string): Promise<Locator | null>{
        const targetItem = this.item.filter({hasText: item})
        if(targetItem){
            const plusBtn = targetItem.locator(".ctrl__button--increment")
            await plusBtn.click()
            return targetItem.locator("input[data-item-boxqty]")

        }
        console.log("Item not in cart")
        return null
    }

    async decrementItem(item:string): Promise <Locator | null>{
        const targetItem = this.item.filter({hasText: item})
        if(targetItem){
            const plusBtn = targetItem.locator(".ctrl__button--decrement")
            await plusBtn.click()
            return targetItem.locator("input[data-item-boxqty]")
            
        }
        console.log("Item not in cart")
        return null
    }

    async removeItem(item:string): Promise<void>{
        const targetItem = this.item.filter({hasText: item})
        const confirmBtn = this.page.locator(".confirm .action-accept")

        if(targetItem){
            const deleteBtn = targetItem.locator(".fa-xmark")
            await deleteBtn.click()
        }
        await confirmBtn.waitFor({state:'visible'})
        await confirmBtn.click()
        await targetItem.waitFor({state:'detached'})
    }

    async removeAllItems(): Promise<void>{
        const allItems = await this.item.all()
        const confirmBtn = this.page.locator(".confirm .action-accept")

        for(const item of allItems){
            const deleteBtn = item.locator(".fa-xmark")
            await deleteBtn.click()
            await confirmBtn.waitFor({state:'visible'})
            await confirmBtn.click()
            await item.waitFor({state:'detached'})
        }
    }    
}