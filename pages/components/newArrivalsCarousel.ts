import {type Page, type Locator} from '@playwright/test'
import { type Carousel } from '../../test_data/helpers/carousel'

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

    async getCarouselItems(): Promise<string[]> {
        let images: string[] = []

        while (true) {
            const items = await this.item.all()

            for (const item of items) {
                const img = await item.locator("img").getAttribute("src")
                if (images.includes(img!)) {
                    continue
                } else {
                    images.push(img!)
                }
            }

            const isDisabled = (await this.nextBtn.getAttribute("class"))?.includes("disabled")

            if (isDisabled) {
                break
            } else {
                await this.nextBtn.click()
            }
        }
        return images
    }

    async moveUpCarousel(): Promise<boolean[]> {

        let pattern: boolean[] = []
        const images = await this.getCarouselItems()

        //debug
        // console.log(`Images[] length: ${images.length}\n Images[] Contents: ${images}`)

        while (true) {
            const visibleItems = await this.item.all()

            for (let i = 0; i < images.length; i++) {
                const actualImg = await visibleItems[i]?.locator("img").getAttribute("src")
                const expectedImg = images[i]

                if (actualImg === expectedImg) {
                    pattern.push(true)
                } else {
                    pattern.push(false)
                }
            }
            const isDisabled = (await this.nextBtn.getAttribute("class"))?.includes("disabled")

            if (isDisabled) {
                break
            } else {
                await this.nextBtn.click()
            }
        }

        // debug
        // console.log(pattern)

        return pattern
    }

    //to be implemented
    async moveDownCarousel(): Promise<boolean[]> {
        return []
    }

    async confirmCarouselItems(): Promise<boolean[]> {
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

        return pattern
    }


}
