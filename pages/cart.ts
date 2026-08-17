import {type Page, type Locator} from '@playwright/test'


export class Cart
{
    //variables
    private readonly page: Page
    readonly tray: Locator
    readonly heading: Locator
    readonly closeBtn: Locator
    readonly quantity: Locator
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
        this.quantity = this.page.locator(".minicart_sidebar__heading__count")
        this.item = this.page.locator(".minicart_sidebar__content__items__item")
        this.totalPrice = this.page.locator(".cart-info .price")
        this.totalSavings = this.page.locator(".savings-amount div")
        this.viewCartBtn = this.page.locator(".btn-cart")
        this.removeItemBtn = this.page.locator(".cart-item-remove")
    }

    //methods
    
}