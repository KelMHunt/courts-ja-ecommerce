import {test, expect} from '@playwright/test'
import type { Page } from '@playwright/test'
import { SearchBox } from '../../../pages/components/search'
import { BasePage } from '../../../pages/basePage'
import * as data from '../../../test_data/labels'

let page: Page
let base: BasePage
let searchBox: SearchBox

test.beforeAll(async({browser})=> {
    page = await browser.newPage()
    searchBox = new SearchBox(page)
    base = new BasePage(page)

    await page.goto("")
    await base.closePreferences()
})

test.describe('Search Tests', {tag:"@regression"}, ()=> {

    test('Verify user can search by product category CFS-222', async()=> {
        const searchText = data.search.category
        const searchSuggestions = await searchBox.getSearchSuggestions(searchText)
        
        for(const result of searchSuggestions){
            expect(result).toContain(searchText)
        }
    })

    test('Verify user can search by brand name CFS-223', async()=> {
        const searchText = data.search.brand
        const searchSuggestions = await searchBox.getSearchSuggestions(searchText)
        
        for(const result of searchSuggestions){
            expect(result).toContain(searchText)
        }
    })

    test('Verify user can search by item type CFS-224', async()=> {
        const searchText = data.search.item
        const searchSuggestions = await searchBox.getSearchSuggestions(searchText)
        
        for(const result of searchSuggestions){
            expect(result).toContain(searchText)
        }
    })

    test.fixme('Verify live search results is displayed when user input search text CFS-225', async()=> {

    })

    test.fixme('Verify clicking right arrow on product results carousel displays next product CFS-226', async()=> {

    })

    test.fixme('Verify clicking left arrow on product results carousel displays next product CFS-227', async()=> {

    })

    test('Verify user can delete search text CFS-229', async()=> {
        const searchText = data.search.item
        const searchSuggestions = await searchBox.getSearchSuggestions(searchText)

        const isEmpty = await searchBox.deleteSearch()
        expect(isEmpty).toBeTruthy()
    })

    test('Verify user can go to product listing page by clicking a search suggestion CFS-305', async()=> {
        const searchText = data.search.item
        const productListing = await searchBox.searchBySuggestion(searchText)
        if(productListing){
            expect(productListing.resultTitle).toContainText(searchText)
        } else console.log("Product listing variable is undefined")
    })

    test('Verify user can go to product listing page by clicking search button CFS-306', async()=> {
        const searchText = data.search.item
        const productListing = await searchBox.searchByButton(searchText)
        
        await expect(productListing.resultTitle).toContainText(searchText)
    })
})