import {type Page, type Locator} from '@playwright/test'
import { Product } from './productDetailPage'
import { Cart } from './cart'
import type { FilterMenu } from './components/filterMenu'
import type { SortMenu } from './components/sortMenu'
import { BasePage } from './basePage'

export class ProductListing extends BasePage
{
    //variables
    private readonly listingPage: Page
    readonly productItems: Locator
    readonly resultTitle: Locator
    readonly filterBtn: Locator
    readonly sortBtn: Locator
    readonly pagination?: Locator
    readonly nextBtn: Locator
    readonly prevBtn: Locator
    readonly filterMenu: FilterMenu
    readonly sortMenu: SortMenu

    //constructor
    constructor(page: Page){
        super(page)
        this.listingPage = page
        this.productItems = this.listingPage.locator("li.item.product")
        this.resultTitle = this.listingPage.locator(".result-title")
        this.filterBtn = this.listingPage.locator("[data-section='filter']")
        this.sortBtn = this.listingPage.locator("[data-section='order']")
        this.pagination = this.listingPage.locator(".pages li")
        this.nextBtn = this.listingPage.locator(".action.next")
        this.prevBtn = this.listingPage.locator(".action.previous")
        this.filterMenu = this.listingPage.locator("")
        this.sortMenu = this.listingPage.locator("")
    }

    //methods
    async getProductCount():Promise<number>{
        const count = await this.productItems.count()
        return count
    }

    async getAllPrices():Promise<string[]>{
        let prices: string[] = []
        const allPages = await this.pagination?.all() ?? []

        while(true){
            const allProducts = await this.productItems.all()
            
            for (const product of allProducts) {
                const discount = product.locator(".discount")
                let price

                if (await discount.count() > 0) { //if discount is present, then take the second price
                    price = product.locator(".price").nth(0)
                } else {
                    price = product.locator(".price")
                }
                const priceText = (await price.innerText()).split("$")[1] ?? ""
                prices.push(priceText)
            }

            const currentPageNum = await this.getCurrentPageNumber()
            
            if(Number(currentPageNum) === allPages.length-1){ // break loop when last page is reached
                break
            }
            
            await this.movetoNextPage()

        }
        return await this.formatPrices(prices)
    }

    private async formatPrices(prices:string[]): Promise<string[]>{
        const formattedPrices = prices.map(price => price.replace(",", ""))
        return formattedPrices
    }

    async getAllProductTitles():Promise<string[]>{
        const allPages = await this.pagination?.all() ?? []
        let titles: string[] = []

        while(true){
            titles = titles.concat(await this.listingPage.locator(".product-item-link").allInnerTexts())
            
            if(allPages.length === 0){ // break loop if no pagination is present
                break
            } 

            const currentPageNum = await this.getCurrentPageNumber() 
            if(Number(currentPageNum) === allPages.length-1){ // break loop when last page is reached
                break
            }
            
            await this.movetoNextPage()
        }
        // debug
        // console.log(titles)
        return titles
    }

    async gotoProductDetailPage(item:string):Promise<Product | null>{
        const allPages = await this.pagination?.all() ?? []

        while (true) {
            
            const productTitles = await this.productItems.locator(".product-item-link").allInnerTexts()

            if(productTitles.includes(item)){
                const targetProduct = this.listingPage.locator('li.item.product', { has: this.listingPage.locator(".product-item-link", { hasText: `${item}` }) })

                if (targetProduct) {
                    await targetProduct.locator("img").click()
                    const productPage = new Product(this.listingPage)
                    await productPage.productTitle.waitFor({state: 'visible'})
                    return productPage
                }
            } else if (allPages.length === 0) { // break loop if no pagination is present
                break
            } else {
                const currentPageNum = await this.getCurrentPageNumber()
                if (Number(currentPageNum) === allPages.length - 1) { // break loop when last page is reached
                    break
                }

                await this.movetoNextPage()
            }
           
        }
        console.log("Item not found")
        return null
    }

    async addItemToCart(item:string): Promise<Cart | null>{
        const allPages = await this.pagination?.all() ?? []

        while(true){

            const productTitles = await this.productItems.locator(".product-item-link").allInnerTexts()

            if(productTitles.includes(item)){
                const targetProduct = this.listingPage.locator("li.item.product", { has: this.listingPage.locator(".product-item-link", { hasText: item }) })

                if (targetProduct) {
                    await targetProduct.locator("button.tocart").click()
                    const cart = new Cart(this.listingPage)
                    await cart.tray.waitFor({ state: 'visible' })
                    return cart
                }
            } else if(allPages.length === 0){ // break loop if no pagination is present
                break
            } else {

                const currentPageNum = await this.getCurrentPageNumber()
                if (Number(currentPageNum) === allPages.length - 1) { // break loop when last page is reached
                    break
                }

                await this.movetoNextPage()
            }
            
        }
        console.log("Item not found")
        return null
    }

    async addMultipleItemstoCart(items:string[]):Promise<void>{
        if (items.length > 0) {
            for (const item of items) {
                const cart = await this.addItemToCart(item)
                await cart?.tray.waitFor({ state: 'visible' })
                await cart?.close()

            }
        } else {
            console.log("No items were given to add to cart")
        }
    }

    async getPages():Promise<Locator[]>{
        return []
    }

    async movetoNextPage():Promise<void>{
        await this.nextBtn.click()
        await this.listingPage.waitForTimeout(3000)

    }

    async gotoPageNumber(pageNum:string):Promise<void>{
        const targetPage = this.listingPage.locator(".pages li", {hasText: pageNum})
        await targetPage.click()
        await this.listingPage.waitForTimeout(2000)
    }

    async getCurrentPageNumber():Promise<string>{
        const currentPage = this.listingPage.locator("li.item.current")
        const pageNum = await currentPage.locator("span").nth(1).innerText()
       
        return pageNum
    }

    async confirmProductListing():Promise<boolean>{
        const allProducts = await this.productItems.all()
        const pattern: boolean [] = []

        for(const product of allProducts){
            const title = product.locator(".product-item-link")
            const img = product.locator(".product-image-photo")
            const discount = product.locator(".discount")
            let price

            if(await discount.count() > 0){ //if discount is present, then take the second price
                price = product.locator(".price").nth(1)
            } else {
                price = product.locator(".price")
            }

            if(await title.isVisible() && await img.isVisible() && await price.isVisible()){
                pattern.push(true)
            } else {
                pattern.push(false)
            }

        }

        return pattern.every((val) => val === true) //will return true if all values are true, else false
    }

    async applyAscendingPriceSort(): Promise<void>{

        await this.sortBtn.click()
        await this.listingPage.waitForTimeout(2000)
        const ascendingPriceOption = this.listingPage.locator("[data-section='product_price_asc']")
        await ascendingPriceOption.click()
        await this.listingPage.waitForTimeout(2000)
    }

    async applyDescendingPriceSort():Promise<void>{
        
        await this.sortBtn.click()
        await this.listingPage.waitForTimeout(2000)
        const descendingPriceOption = this.listingPage.locator("[data-section='product_price_desc']")
        await descendingPriceOption.click()
        await this.listingPage.waitForTimeout(2000)
    }

    async applyFilter(type:string, option:string):Promise<void>{
        
        await this.filterBtn.click()
        await this.listingPage.waitForTimeout(2000)
        const filter = this.listingPage.locator(`.filter-options-title:has-text("${type}")`)
        await filter.click()
        const choice = this.listingPage.locator(".filter-options-item").getByLabel(option)
        await choice.click()
        await this.listingPage.waitForTimeout(2000)
    }
}