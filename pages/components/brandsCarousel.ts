import {type Page, type Locator} from '@playwright/test'
import { type Carousel } from '../../test_data/helpers/carousel'

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
        let index = 0
        //debug
        // console.log(`Images[] length: ${images.length}\n Images[] Contents: ${images}`)

        while (true) {
            const visibleItems = await this.item.locator("img").all()

            for (let i = index; i < visibleItems.length; i++) {
                const actualImg = await visibleItems[i]?.getAttribute("src")
                const expectedImg = images[i]

                if (actualImg === expectedImg) {
                    pattern.push(true)
                } else {
                    pattern.push(false)
                }
                ++ index
            }
            const isDisabled = (await this.nextBtn.getAttribute("class"))?.includes("disabled")

            if (isDisabled) {
                break
            } else {
                await this.nextBtn.click()
            }
        }

        // debug
        console.log(pattern)

        return pattern
    }

    //to be implemented
    async moveDownCarousel(): Promise<boolean[]> {
        return []
    }

    //to be implemented
    async confirmCarouselItems(): Promise<boolean[]> {
        return []
    }
}