import {type Page, type Locator} from '@playwright/test'
import { type Carousel } from '../../helpers/carousel'

export class NewArrivalsCarousel implements Carousel
{
    private readonly page: Page
    readonly container: Locator
    readonly prevBtn: Locator
    readonly nextBtn: Locator
    readonly item: Locator
    readonly image?: Locator
    readonly price?: Locator
    readonly title?: Locator
    readonly cta?: Locator 

    constructor(page: Page){
        this.page = page
        this.container = this.page.locator(".owl-carousel").last()
        this.prevBtn = this.container.locator(".owl-prev")
        this.nextBtn = this.container.locator(".owl-next")
        this.item = this.container.locator(".product-item-info")
        this.image = this.container.locator("img")
        this.price = this.container.locator("span.price")
        this.title = this.container.locator("a[title]")
        this.cta = this.container.locator("button.action.tocart")

    }

    async getCarouselItems(): Promise<Locator[]> {
        return []
    }

    async moveUpCarousel(): Promise<void> {

    }

    //to be implemented
    async moveDownCarousel(): Promise<void> {
        
    }

    async confirmCarouselItems(): Promise<boolean> {
        let pattern: boolean[]= []
        
        while(true){
            const items = await this.item.all()

            for(const item of items){
                
                const price = item.locator("span.price")
                const title = item.locator("a[title]")
                const cta = item.locator("button.action.tocart")
                const isPriceVisble = await price.isVisible()
                const isTitleVisible = await title.isVisible()
                const isCTAVisible = await cta.isVisible()
                
                if(isPriceVisble && isTitleVisible && isCTAVisible){
                    pattern.push(true)
                } else pattern.push(false)
            }

            const isDisabled = (await this.nextBtn.getAttribute("class"))?.includes("disabled")

            if (isDisabled) {
                break
            } else {
                await this.nextBtn.click()
            }
        }

        return pattern.every(result => result ===true)
    }


}
