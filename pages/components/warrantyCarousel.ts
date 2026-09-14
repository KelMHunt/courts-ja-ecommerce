import type {Page, Locator} from '@playwright/test'
import type { Carousel } from '../../test_data/helpers/carousel'
import { match } from 'node:assert'

export class WarrantyCarousel implements Carousel
{
    //variables
    readonly page: Page
    readonly container: Locator
    readonly prevBtn: Locator
    readonly nextBtn: Locator
    readonly item: Locator
    readonly price?: string | Locator

    //constructor
    constructor(page: Page){
        this.page = page
        this.container = this.page.locator(".warranty-wrapper")
        this.prevBtn = this.container.locator("i.fa-left")
        this.nextBtn = this.container.locator("i.fa-right")
        this.item = this.container.locator("li.item")
        this.price = this.item.locator("span")
    }

    //methods
    async getCarouselItems(): Promise<Locator[]> {
        const options = await this.item.all()

        return options
    }

    async moveUpCarousel(): Promise<void> {
        await this.nextBtn.click()
    }

    async moveDownCarousel(): Promise<void> {
        await this.prevBtn.click()
    }

    async confirmCarouselItems(): Promise<boolean> {
        return false
    }

    async selectWarranty(type:string): Promise<void>{
        const options = await this.getCarouselItems()

        for (const option of options) {
            const optionTitle = await option.locator("strong").innerText()
            if (optionTitle.toLowerCase().includes(type.toLowerCase())) {
                await option.click()
                break
            }

            const isDisabled = await this.nextBtn.getAttribute("aria-disabled")
            if (isDisabled){
                console.log("Your desired warranty was not found")
                break
            } else {
                await this.nextBtn.click()
            }
        }
    }

    async getDefaultOption():Promise<string | null>{
        const options = await this.getCarouselItems()

        for(const option of options){
            const isSelected = (await option.getAttribute("class"))?.includes("active")

            if(isSelected){
                const name = option.locator("strong").innerText()
                return name
            }
        }

        return null
    }
}