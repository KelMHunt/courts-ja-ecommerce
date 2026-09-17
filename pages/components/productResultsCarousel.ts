import type {Page, Locator} from '@playwright/test'
import type { Carousel } from '../../helpers/carousel';

export class ProductResultsCarousel implements Carousel
{
    //variables
    private readonly page: Page
    readonly container: Locator
    readonly prevBtn: Locator
    readonly nextBtn: Locator
    readonly item: Locator
    readonly image?: string
    readonly price?: string
    readonly title?: string

    //constructor
    constructor(page:Page){
        this.page = page
        this.container = this.page.locator(".livesearch.popover-container")
        this.prevBtn = this.container.locator(".left-arrow")
        this.nextBtn = this.container.locator(".right-arrow")
        this.item = this.page.locator(".product-result")
        this.image = "img"
        this.price = ".prod-price"
        this.title = ".product-name"
    }

    //methods
    async getCarouselItems(): Promise<Locator[]> {
        const allItems = await this.item.all()
        return allItems
    }

    async moveUpCarousel(): Promise<void> {
        await this.nextBtn.click()
        await this.page.waitForTimeout(1000)
    }

    async moveDownCarousel(): Promise<void> {
        await this.prevBtn.click()
        await this.page.waitForTimeout(1000)
    }

    async confirmCarouselItems(): Promise<boolean> {
        const allItems = await this.item.all()
        const pattern: boolean[] = []

        for(const item of allItems){
            const image = item.locator("img")
            const title = item.locator(".product-name")
            const price = item.locator(".prod-price")
            
            if(await image.isVisible() && await title.isVisible() && await price.isVisible()){
                pattern.push(true)
            } else {
                pattern.push(false)
            }
        }

        return pattern.every(result => result === true)
    }

}