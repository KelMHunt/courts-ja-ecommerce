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

test.describe('Product Listing Page Tests', {tag: "@regression"}, () => {

    test('Verify user can move between product listing pages when more than one pages are available CFS-311', async () => {
        const searchText = data.search.item
        const productListing = await search.searchByButton(searchText)
        await productListing.movetoNextPage()
        await productListing.movetoNextPage()
        const currentPageNum = await productListing.getCurrentPageNumber()
        expect(currentPageNum).toBe("3")
    })

    test('Verify product listing page displays grid of products with correct details CFS-307', async () => {
        const searchText = data.search.item
        const productListing = await search.searchByButton(searchText)
        const result = await productListing.confirmProductListing()
        expect(result).toBeTruthy()
    })

    test('Verify product listing page is updated when filter is applied CFS-308', async () => {
        const searchText = data.search.item
        const productListing = await search.searchByButton(searchText)
        await productListing.applyFilter(data.filter.type, data.filter.option)
        const titles = await productListing.getAllProductTitles()
        titles.forEach(title => {
            expect(title.toLowerCase()).toContain(data.filter.option.toLowerCase())
        })
    })

    test('Verify items are correctly sorted when ascending price sort is applied CFS-309', async () => {
        const searchText = data.search.item
        const productListing = await search.searchByButton(searchText)
        const pricesBefore = (await productListing.getAllPrices()).map(price => parseFloat(price))
        const lowesttoHighest = pricesBefore.toSorted((p1, p2) => p1 - p2)

        //perform sort action on page
        await productListing.gotoPageNumber("1")
        await productListing.applyAscendingPriceSort()
        const pricesAfter = (await productListing.getAllPrices()).map(price => parseFloat(price))

        //debug
        // console.log(pricesBefore, lowesttoHighest, pricesAfter)

        //assert 
        expect(pricesAfter).toEqual(lowesttoHighest)

    })

    test('Verify items are correctly sorted when descending price sort is applied CFS-310', async () => {
        const searchText = data.search.item
        const productListing = await search.searchByButton(searchText)
        const pricesBefore = (await productListing.getAllPrices()).map(price => parseFloat(price))
        const highesttoLowest = pricesBefore.toSorted((p1, p2) => p2 - p1)

        //perform sort action on page
        await productListing.gotoPageNumber("1")
        await productListing.applyDescendingPriceSort()
        const pricesAfter = (await productListing.getAllPrices()).map(price => parseFloat(price))

        //debug
        // console.log(pricesBefore, highesttoLowest, pricesAfter)

        //assert 
        expect(pricesAfter).toEqual(highesttoLowest)

    })

    test('Verify user can add item to cart from product listing page CFS-313', async()=>{
        const searchText = data.search.item
        const productListing = await search.searchByButton(searchText)
        const cart = await productListing.addItemToCart(data.products.basic)
        const items = await cart?.getItemNames()
        //debug
        // console.log(items)
        expect(items).toContain(data.products.basic)
    })

    test('Verify clicking an item on product listing page opens correct product detail page CFS-314', async()=>{

    })
})
