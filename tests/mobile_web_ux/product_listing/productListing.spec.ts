import {test, expect} from '@playwright/test'
import type {Page} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import { SearchBox } from '../../../pages/components/search'
import * as data from '../../../test_data/labels'
import * as inputs from '../../../test_data/inputs'
import type { ProductListing } from '../../../pages/productListingPage'

let page:Page
let base: BasePage
let searchBox: SearchBox
let productListing: ProductListing
const searchText = inputs.search.item

test.beforeAll(async({browser}) => {
    page = await browser.newPage()
    base = new BasePage(page)
    searchBox = new SearchBox(page)

    await page.goto("")
    await base.closePreferences()
})

test.describe('Product Listing Page Tests', {tag: "@regression"}, () => {

    test.beforeAll (async() => {
        productListing = await searchBox.searchByButton(searchText)
    })

    test('Verify user can move between product listing pages when more than one pages are available CFS-311', async () => {
        await productListing.movetoNextPage()
        await productListing.movetoNextPage()
        const currentPageNum = await productListing.getCurrentPageNumber()
        expect(currentPageNum).toBe("3")
    })

    test('Verify product listing page displays grid of products with correct details CFS-307', async () => {
        const result = await productListing.confirmProductListing()
        expect(result).toBeTruthy()
    })

    test('Verify product listing page is updated when filter is applied CFS-308', async () => {
        await productListing.applyFilter(data.filter.type, data.filter.option)
        const titles = await productListing.getAllProductTitles()
        titles.forEach(title => {
            expect(title.toLowerCase()).toContain(data.filter.option.toLowerCase())
        })
    })

    test('Verify items are correctly sorted when ascending price sort is applied CFS-309', async () => {
        const pricesBefore = (await productListing.getAllPrices()).map(price => parseFloat(price))
        const lowesttoHighest = pricesBefore.toSorted((p1, p2) => p1 - p2)

        //perform sort action on page
        await productListing.gotoPageNumber("1")
        await productListing.applyAscendingPriceSort()
        const pricesAfter = (await productListing.getAllPrices()).map(price => parseFloat(price))

        expect(pricesAfter).toEqual(lowesttoHighest)

    })

    test('Verify items are correctly sorted when descending price sort is applied CFS-310', async () => {
        const pricesBefore = (await productListing.getAllPrices()).map(price => parseFloat(price))
        const highesttoLowest = pricesBefore.toSorted((p1, p2) => p2 - p1)

        //perform sort action on page
        await productListing.gotoPageNumber("1")
        await productListing.applyDescendingPriceSort()
        const pricesAfter = (await productListing.getAllPrices()).map(price => parseFloat(price))
        expect(pricesAfter).toEqual(highesttoLowest)

    })

    test('Verify user can add item to cart from product listing page CFS-313', async()=>{
        const cart = await productListing.addItemToCart(data.products.basic)
        const items = await cart?.getItemNames()
        expect(items).toContain(data.products.basic)
    })

    test('Verify clicking an item on product listing page opens correct product detail page CFS-314', async()=>{
        const productPage = await productListing.gotoProductDetailPage(data.products.basic)
        const title = await productPage?.getProductTitle()
        expect(title).toBe(data.products.basic)
    })

})

test.describe('Add Multiple Items PLP Test', {tag:"@regression"}, ()=> {

    test('Verify multiple items can be added to cart CFS-336', async()=> {
        const searchText = inputs.search.category
        productListing = await searchBox.searchByButton(searchText)
        await productListing.addMultipleItemstoCart(data.products.bedding)
    })
})
