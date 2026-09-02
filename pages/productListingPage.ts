import {type Page, type Locator} from '@playwright/test'
import type { Product } from './productDetailPage'
import type { Cart } from './cart'
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
        let counter = 0

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
        return []
    }

    async gotoProductDetailPage():Promise<Product | null>{
        return null
    }

    async addItemToCart(item:string): Promise<Cart | null>{
        return null
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

    }
}