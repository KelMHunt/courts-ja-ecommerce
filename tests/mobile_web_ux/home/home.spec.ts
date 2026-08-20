import {test, expect, type Page} from '@playwright/test'
import { HomePage } from '../../../pages/homePage'
import { BasePage } from '../../../pages/basePage'


let page:Page
let base
let home: HomePage

test.beforeAll(async({browser})=> {
    page = await browser.newPage()
    base = new BasePage(page)
    home = new HomePage(page)

    await page.goto("")
    await base.closePreferences()
})

test.describe('Home Page Tests', ()=> {
    test.skip('Verify clicking right arrow on carousel displays next image CFS-279', async()=> {
        const result = await home.heroCarousel.moveUpCarousel()
        result.forEach(val => expect(val).toBeTruthy())
    }) //logic not yet implemented

    test.skip('Verify clicking left arrow on carousel displays previous image CFS-278', async()=> {
        const result = await home.heroCarousel.moveDownCarousel()
        result.forEach(val => expect(val).toBeTruthy())
    }) //logic not yet implemented

    test.fixme('Verify clicking right arrow on brands carousel displays next image CFS-285', async()=> {
        const results = await home.brandsCarousel.moveUpCarousel()
        results.forEach(val => expect(val).toBeTruthy())
    }) //needs work

    test.fixme('Verify clicking left arrow on brands carousel displays previous image CFS-304', async()=> {
        const results = await home.brandsCarousel.moveDownCarousel()
        results.forEach(val => expect(val).toBeTruthy())
    }) //needs work

    test.fixme('Verify each product in new arrivals carousel displays image, price, title and button CFS-288', async()=> {
        const results = await home.newArrivalsCarousel.confirmCarouselItems()
        results.forEach(val => expect(val).toBeTruthy())
    })//needs work



})