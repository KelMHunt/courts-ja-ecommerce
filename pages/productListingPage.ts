import {type Page, type Locator} from '@playwright/test'
import type { Product } from './productDetailPage'
import type { Cart } from './cart'
import type { FilterMenu } from './components/filterMenu'
import type { SortMenu } from './components/sortMenu'

export class ProductListing
{
    //variables
    private readonly page: Page
    readonly productItems: Locator
    readonly filterBtn: Locator
    readonly sortBtn: Locator
    readonly pagination?: Locator
    readonly filterMenu: FilterMenu
    readonly sortMenu: SortMenu

    //constructor
    constructor(page: Page){
        this.page = page
        this.productItems = this.page.locator("")
        this.filterBtn = this.page.locator("")
        this.sortBtn = this.page.locator("")
        this.pagination = this.page.locator("")
        this.filterMenu = this.page.locator("")
        this.sortMenu = this.page.locator("")
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

    async gotoProductDetailPage():Promise<Product>{
        return
    }

    async addItemToCart(item:string): Promise<boolean>{
        return false
    }

    async getPages():Promise<Locator[]>{
        return []
    }

    async moveBetweenPages():Promise<boolean>{
        return false
    }
}