import {test, expect} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import { SearchBox } from '../../../pages/components/search'
import type { Page } from '@playwright/test'
import * as data from '../../../test_data/labels'
import type { Product } from '../../../pages/productDetailPage'


let page: Page
let searchBox: SearchBox
let base: BasePage
let productPage: Product | null


test.beforeAll(async({browser}) => {
    page = await browser.newPage()
    searchBox = new SearchBox(page)
    base = new BasePage(page)
    const searchText = data.search.item2

    await page.goto("")
    await base.closePreferences()
    const productListing = await searchBox.searchByButton(searchText)
    productPage = await productListing.gotoProductDetailPage(data.products.discounted)
})

test.describe('General Product Detail Page Tests', ()=> {

    test('Verify product page displays correct product info CFS-320', async() => {
        const image = await productPage?.getProductImage()
        const title = await productPage?.getProductTitle()
        const starRatingCount = await productPage?.getStarRatingCount()
        const ratingNumber = await productPage?.getRatingNumber()
        const status = await productPage?.getStatus()
        const productId = await productPage?.getProductId()

        //debug
        // console.log(image, title, starRatingCount, ratingNumber, status, productId)

        expect(image).toEqual(title)
        expect(status?.toLowerCase()).toContain(data.productDetails.status)
        expect(productId).toContain(data.productDetails.idText)

        if(starRatingCount){
            expect(ratingNumber).toBeDefined()
            expect(parseFloat(ratingNumber!)).toBeGreaterThan(0)
        }
    })
})

