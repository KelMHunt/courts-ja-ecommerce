import type {Page, Locator} from '@playwright/test'
import type { Carousel } from '../../test_data/helpers/carousel';

export class ProductResultsCarousel implements Carousel
{
    //variables
    private readonly page: Page
    readonly container: Locator
    readonly prevBtn: Locator
    readonly nextBtn: Locator
    readonly item: Locator
    readonly image?: Locator
    readonly price?: Locator
    readonly title?: Locator

    //constructor
    constructor(page:Page){
        this.page = page
        this.container = this.page.locator("")
        this.prevBtn = this.page.locator("")
        this.nextBtn = this.page.locator("")
        this.item = this.page.locator("")
        this.image = this.page.locator("")
        this.price = this.page.locator("")
        this.title = this.page.locator("")
    }

    //methods
    async getCarouselItems(): Promise<string[]> {
        return []
    }

    async moveUpCarousel(): Promise<boolean[]> {
        return []
    }

    async moveDownCarousel(): Promise<boolean[]> {
        return []
    }

    async confirmCarouselItems(): Promise<boolean[]> {
        return []
    }

}