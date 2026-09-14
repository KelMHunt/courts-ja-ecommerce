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

test.describe('Warranty Product Detail Tests', {tag:"@regression"}, ()=> {

    test('Verify user can select a warranty option in warranty carousel on product page CFS-325', async()=> {
        await productPage?.warrantyCarousel.selectWarranty("3")
    })

    test('Verify no warranty option is auto-selected in warranty carousel on product page CFS-324', async()=> {
        const defaultOption = await productPage?.warrantyCarousel.getDefaultOption()
        expect(defaultOption?.toLowerCase()).toContain(data.productDetails.defaultWarranty.toLowerCase())
    })

})