import {type Page, type Locator} from '@playwright/test'
import { BasePage } from './basePage'


export class HomePage
{
    //variables
    private readonly page : Page
    readonly heroCarousel: Locator
    readonly brandsSection: Locator
    readonly brandsHeadline: Locator
    readonly brandsCarousel: Locator
    readonly newArrivalsHeadline: Locator
    readonly newArrivalsCarousel: Locator

    //constructor
    constructor(page: Page){
        this.page = page
        this.heroCarousel = this.page.locator("[class*='image_carousel'].products-listing").first()
        this.brandsSection = this.page.locator("div.shop-by-brands")
        this.brandsHeadline = this.brandsSection.locator("h2")
        this.brandsCarousel = this.brandsSection.locator("[data-type='gallery']")
        this.newArrivalsHeadline = this.page.locator("h2", {hasText: /New Arrivals/})
        this.newArrivalsCarousel = this.page.locator("[class*='product_slider'].products-listing").last()
    }

    //methods
    
}