import {type Page, type Locator} from '@playwright/test'
import { type Carousel } from '../../test_data/helpers/carousel'

export class HeroCarousel implements Carousel
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
        this.container = this.page.locator("")
        this.prevBtn = this.page.locator("")
        this.nextBtn = this.page.locator("")
        this.item = this.page.locator("")
    }

    //methods
    async getCarouselItems(): Promise<Locator[]> {
        return []
    }

    async moveUpCarousel(): Promise<void> {
       
    }

    async moveDownCarousel(): Promise<void> {
        
    }

    async confirmCarouselItems(): Promise<boolean> {
        return false
    }

}