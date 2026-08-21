import {type Page, type Locator} from '@playwright/test'
import type { Product } from './productDetailPage'
import type { Cart } from './cart'
import type { FilterMenu } from './components/filterMenu'
import type { SortMenu } from './components/sortMenu'
import { BasePage } from './basePage'

export class ProductListing extends BasePage
{
    //variables
    // private readonly page: Page
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
        this.productItems = page.locator("")
        this.resultTitle = page.locator(".result-title")
        this.filterBtn = page.locator("")
        this.sortBtn = page.locator("")
        this.pagination = page.locator("")
        this.filterMenu = page.locator("")
        this.sortMenu = page.locator("")
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