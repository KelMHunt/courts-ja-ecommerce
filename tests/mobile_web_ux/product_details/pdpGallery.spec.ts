import {test, expect} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import { SearchBox } from '../../../pages/components/search'
import type { Product } from '../../../pages/productDetailPage'
import * as data from '../../../test_data/labels'
import * as inputs from '../../../test_data/inputs'


let searchBox: SearchBox
let base: BasePage
let productPage: Product | null
const searchText = inputs.search.item2

/* test setup - product detail page gallery tests
 * @test.beforeEach() - generate a product detail page and open gallery
 */

test.beforeEach(async({page})=> {
    base = new BasePage(page)
    searchBox = new SearchBox(page)
    
    await page.goto("")
    await base.closePreferences()
    const productListing = await searchBox.searchByButton(searchText)
    productPage = await productListing.gotoProductDetailPage(data.products.discounted)
    await productPage?.openGallery()
})

/* test teardown - product detail page gallery tests
 * @test.afterEach() - close page
 */

test.afterEach(async({page})=> {
    await page.close()
})

test.describe('Product Detail Gallery Tests', {tag:"@regression"}, ()=> {

    test('Verify user can open image gallery CFS-318', async()=> {
        const galleryTitle = await productPage?.getGalleryTitle()
        expect(galleryTitle?.toLowerCase()).toBe(data.products.discounted.toLowerCase())
    })

    test('Verify user can browse image gallery of product CFS-316', async()=> {
        await productPage?.browseGallery()
    })

    test('Verify user can close image gallery CFS-319', async()=> {
        await productPage?.closeGallery()
        if(productPage) await expect(productPage.gallery).toBeHidden()
    })

    test.skip('Verify that correct image is shown when browsing image gallery CFS-317', async()=> {

    })


})