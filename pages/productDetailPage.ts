import {type Page, type Locator} from '@playwright/test'
import { BasePage } from './basePage';

export class Product extends BasePage
{
    //variables
    private readonly productPage: Page
    readonly productTitle: Locator
    readonly productPrice: Locator
    readonly addToCartBtn: Locator

    //constructor
    constructor(page: Page){
        super(page)
        this.productPage = page
        this.productTitle = this.productPage.locator("h1.page-title")
        this.productPrice = this.productPage.locator("")
        this.addToCartBtn = this.productPage.locator("")
    }
    //methods

    async getProductTitle():Promise<string>{
        const title = await this.productTitle.innerText()
        return title
    }
    
}