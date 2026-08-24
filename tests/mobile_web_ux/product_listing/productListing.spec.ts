import {test, expect} from '@playwright/test'
import type {Page} from '@playwright/test'
import { ProductListing } from '../../../pages/productListingPage'
import { SearchBox } from '../../../pages/components/search'
import * as data from '../../../test_data/labels'

let page:Page
let productListing:ProductListing
let search: SearchBox

test.beforeAll(async({browser}) => {
    page = await browser.newPage()
    productListing = new ProductListing(page)
    search = new SearchBox(page)

    await page.goto("")
    await productListing.closePreferences()
})

test('Verify user can move between product listing pages when more than one pages are available CFS-311', async()=> {
    const searchText = data.search.item
    const productListing = await search.searchByButton(searchText)
    await productListing.movetoNextPage()
    const currentPageNum = await productListing.getCurrentPageNumber()
    expect(currentPageNum).toBe("2")
})

test('Verify product listing page displays grid of products with correct details CFS-307', async()=> {

})

test('Verify product listing page is updated when filter is applied CFS-308', async()=> {

})

test('Verify items are correctly sorted when ascending price sort is applied CFS-309', async()=> {

})

test('Verify items are correctly sorted when descending price sort is applied CFS-310', async()=> {
    
})
