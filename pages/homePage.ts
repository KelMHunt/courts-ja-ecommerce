import {type Page, type Locator} from '@playwright/test'
import { BasePage } from './basePage'
import * as helper from '../helpers/functions'
import { NewArrivalsCarousel } from './components/newArrivalsCarousel'
import { BrandsCarousel } from './components/brandsCarousel'
import { HeroCarousel } from './components/heroCarousel'

export class HomePage
{
    //variables
    private readonly page : Page
    readonly heroCarousel: HeroCarousel
    readonly brandsSection: Locator
    readonly brandsHeadline: Locator
    readonly brandsCarousel: BrandsCarousel
    readonly newArrivalsHeadline: Locator
    readonly newArrivalsCarousel: NewArrivalsCarousel

    //constructor
    constructor(page: Page){
        this.page = page
        this.heroCarousel = new HeroCarousel(this.page)
        this.brandsSection = this.page.locator("div.shop-by-brands")
        this.brandsHeadline = this.brandsSection.locator("h2")
        this.brandsCarousel = new BrandsCarousel(this.page)
        this.newArrivalsHeadline = this.page.locator("h2", {hasText: /New Arrivals/})
        this.newArrivalsCarousel = new NewArrivalsCarousel(this.page)
    }

}