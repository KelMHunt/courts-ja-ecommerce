import type {Page, Locator} from '@playwright/test'
import { ProductListing } from '../productListingPage'
import type { Product } from '../productDetailPage'
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
    async getSearchSuggestions(searchText:string): Promise<string[]>{
        
        await this.searchInput.fill(searchText)
        await this.page.waitForTimeout(3000)
        
        const isSearchSuggestionsVisible = await this.searchSuggestions.isVisible()

        if(isSearchSuggestionsVisible){
            const searchSuggestions = (await this.searchSuggestions.locator("li").allInnerTexts()).map(e => e.trim())
            return searchSuggestions
        }

        return []
    }

    async getProductResults(searchText:string): Promise<string[]>{
        return await this.productResults.getCarouselItems()
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

    async gotoProductDetailsPage(searchText:string): Promise<Product | null>{
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