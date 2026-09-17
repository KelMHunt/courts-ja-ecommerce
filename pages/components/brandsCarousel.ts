import {type Page, type Locator} from '@playwright/test'
import { type Carousel } from '../../helpers/carousel'

export class BrandsCarousel implements Carousel
{
    //variables
    private readonly page: Page
    readonly container: Locator
    readonly prevBtn: Locator
    readonly nextBtn: Locator
    readonly item: Locator

    //constructor
    constructor(page: Page){
        this.page = page
        this.container = this.page.locator("div.shop-by-brands [data-type='gallery']")
        this.prevBtn = this.container.locator(".owl-prev")
        this.nextBtn = this.container.locator(".owl-next")
        this.item = this.container.locator(".item")
    }

    //methods
    async getCarouselItems(): Promise<Locator[]> {
        return []
    }

    async moveUpCarousel(): Promise<void> {
           
    }

    //to be implemented
    async moveDownCarousel(): Promise<void> {
        
    }

    //to be implemented
    async confirmCarouselItems(): Promise<boolean> {
        return false
    }
}