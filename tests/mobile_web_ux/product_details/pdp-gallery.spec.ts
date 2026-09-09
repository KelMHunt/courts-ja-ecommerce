import {test, expect} from '@playwright/test'
import type {Page} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import { SearchBox } from '../../../pages/components/search'
import type { Product } from '../../../pages/productDetailPage'
import * as data from '../../../test_data/labels'

let page: Page
let searchBox: SearchBox
let base: BasePage
let productPage: Product | null

test.beforeAll(async({browser})=> {
    page = await browser.newPage()
    base = new BasePage(page)
    searchBox = new SearchBox(page)
    const searchText = data.search.item2

    await page.goto("")
    await base.closePreferences()
    const productListing = await searchBox.searchByButton(searchText)
    productPage = await productListing.gotoProductDetailPage(data.products.discounted)
})

test.describe('Product Detail Gallery Tests', {tag:"@regression"}, ()=> {

    test('Verify user can open image gallery CFS-318', async()=> {
        await productPage?.openGallery()
        const galleryTitle = await productPage?.getGalleryTitle()
        expect(galleryTitle?.toLowerCase()).toBe(data.products.discounted.toLowerCase())
    })

    test('Verify user can browse image gallery of product CFS-316', async()=> {
        await productPage?.openGallery()
        await productPage?.browseGallery()
    })

    test('Verify user can close image gallery CFS-319', async()=> {
        await productPage?.openGallery()
        await productPage?.closeGallery()
        if(productPage) await expect(productPage.gallery).toBeHidden()
    })

    test.skip('Verify that correct image is shown when browsing image gallery CFS-317', async()=> {

    })


})