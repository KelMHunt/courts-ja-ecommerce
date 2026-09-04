import type {Page, Locator} from '@playwright/test'
import { ProductListing } from '../productListingPage'
import { Product } from '../productDetailPage'
import { ProductResultsCarousel } from './productResultsCarousel'

export class SearchBox
{
    //variables
    private readonly page: Page
    readonly searchInput: Locator
    readonly searchBtn: Locator
    readonly searchSuggestions: Locator
    readonly productResults: ProductResultsCarousel
    
    //constructor
    constructor(page: Page){
        this.page = page
        this.searchInput = this.page.locator("#search")
        this.searchBtn = this.page.locator("button.search")
        this.searchSuggestions = this.page.locator(".search-suggestions")
        this.productResults = new ProductResultsCarousel(this.page)
    }

    //methods
    async fillSearchInput(searchText:string): Promise<void>{
        await this.searchInput.fill(searchText)
        await this.page.waitForTimeout(3000)
    }

    async getSearchSuggestions(searchText:string): Promise<string[]>{
        
        await this.fillSearchInput(searchText)
        
        const isSearchSuggestionsVisible = await this.searchSuggestions.isVisible()

        if(isSearchSuggestionsVisible){
            const searchSuggestions = (await this.searchSuggestions.locator("li").allInnerTexts()).map(e => e.trim())
            return searchSuggestions
        }

        return []
    }

    async getProductResults(searchText:string): Promise<string[]>{
        await this.fillSearchInput(searchText)

        const allItems = await this.productResults.getCarouselItems()
        let titles = []

        for(const item of allItems){
            titles.push(await item.locator(this.productResults.title!).innerText())
        }

        return titles
    }

    async searchBySuggestion(searchText:string): Promise<ProductListing | null>{
        
        await this.searchInput.fill(searchText)
        await this.page.waitForTimeout(3000)
        const isVisible = await this.searchSuggestions.isVisible()

        if(isVisible){
            await this.searchSuggestions.locator("li").first().click()
            await this.page.waitForTimeout(3000)
            const productListing = new ProductListing(this.page)
            return productListing
        }

        return null
    }

    async searchByButton(searchText:string): Promise<ProductListing>{
       
        await this.searchInput.fill(searchText)
        await this.searchBtn.click()
        await this.page.waitForTimeout(3000)

        const productListing = new ProductListing(this.page)
        
        return productListing
    }

    async gotoProductDetailsPage(name:string): Promise<Product | null>{
        const items = await this.productResults.getCarouselItems()

        for(let i=0; i<items.length; i++){
            const title1 = await items[i]?.locator(this.productResults.title!).innerText()
            const title2 = await items[i+1]?.locator(this.productResults.title!).innerText()
            
            // debug
            console.log(title1, title2)

            if(title1?.toLowerCase().includes(name.toLowerCase())){
                await items[i]?.locator(this.productResults.image!).click()
                await this.page.waitForTimeout(3000)
                const productPage = new Product(this.page)
                return productPage

            } else if (title2?.toLowerCase().includes(name.toLowerCase())){
                await items[i+1]?.locator(this.productResults.image!).click()
                await this.page.waitForTimeout(3000)
                const productPage = new Product(this.page)
                return productPage
            }
            
            const nextBtnIsDisabled = (await this.productResults.nextBtn.getAttribute("class"))?.includes("disabled")
            if(nextBtnIsDisabled){
                break
            }
            await this.productResults.moveUpCarousel()
        }
        return null
    }

    async deleteSearch():Promise<boolean>{
        const isEmpty = await this.searchInput.inputValue() === null ? true: false
        
        if(isEmpty){
            return true
        }

        await this.searchInput.clear()
        await this.page.waitForTimeout(2000)
        return true
    }
}