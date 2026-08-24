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
    readonly filterMenu: FilterMenu
    readonly sortMenu: SortMenu

    //constructor
    constructor(page: Page){
        super(page)
        this.listingPage = page
        this.productItems = this.listingPage.locator("")
        this.resultTitle = this.listingPage.locator(".result-title")
        this.filterBtn = this.listingPage.locator("")
        this.sortBtn = this.listingPage.locator("")
        this.pagination = this.listingPage.locator(".pages li")
        this.filterMenu = this.listingPage.locator("")
        this.sortMenu = this.listingPage.locator("")
    }

    //methods
    async getProductCount():Promise<number>{
        return 0
    }

    async getAllPrices():Promise<string[]>{
        return []
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
        const allPages = await this.pagination?.all() ?? []
    
        const currentPageIndex = allPages.findIndex(async (pg) =>
            (await pg.getAttribute("class"))?.includes("current")
        )
        
        if(currentPageIndex < allPages.length){
            const nextPageIndex = currentPageIndex + 1
            const nextPage = allPages.find((pg, index)=> index === nextPageIndex)
            await nextPage?.click()
            await this.listingPage.waitForTimeout(2000)
            // console.log(currentPageIndex, nextPageIndex)

        } else {
            console.log("No more pages left")
        }
    }

    async getCurrentPageNumber():Promise<string>{
        const currentPage = this.listingPage.locator("li.item.current")
        const pageNum = await currentPage.locator("span").nth(1).innerText()
       
        return pageNum
    }

    async confirmProductListing():Promise<boolean>{
        return false
    }
}