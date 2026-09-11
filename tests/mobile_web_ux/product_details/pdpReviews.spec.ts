import {test, expect} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import { SearchBox } from '../../../pages/components/search'
import type { Page } from '@playwright/test'
import * as data from '../../../test_data/labels'
import * as inputs from '../../../test_data/inputs'
import type { Product } from '../../../pages/productDetailPage'


let page: Page
let searchBox: SearchBox
let base: BasePage
let productPage: Product | null


test.beforeAll(async({browser}) => {
    page = await browser.newPage()
    searchBox = new SearchBox(page)
    base = new BasePage(page)
    const searchText = inputs.search.item2

    await page.goto("")
    await base.closePreferences()
    const productListing = await searchBox.searchByButton(searchText)
    productPage = await productListing.gotoProductDetailPage(data.products.discounted)
})

test.describe('Product Reviews Tests', {tag:"@regression"}, ()=> {

    test.fixme('Verify user can write a product review on product page CFS-331', async()=> {
        const customerName = inputs.review.name
        const reviewTitle = inputs.review.title
        const reviewMsg = inputs.review.msg
        const rating = 3
        await productPage?.makeProductReview(customerName, reviewTitle, reviewMsg, rating)
    })

    test('Verify user can view product reviews by clicking review link on product page CFS-330', async()=> {
        await productPage?.gotoReviews()
        const numOfReviews = await productPage?.getReviewsCount()
        await expect(productPage!.writeReviewBtn).toBeVisible()
        expect(numOfReviews).toBeGreaterThan(0)
    })
})