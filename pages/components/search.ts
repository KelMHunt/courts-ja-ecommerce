import type {Page, Locator} from '@playwright/test'
import type { ProductListing } from '../productListingPage'
import type { Product } from '../productDetailPage'
import { ProductResultsCarousel } from './productResultsCarousel'

export class SearchBox
{
    //variables
    private readonly page: Page
    readonly searchInput: Locator
    readonly searchSuggestions: Locator
    readonly productResults: ProductResultsCarousel
    
    //constructor
    constructor(page: Page){
        this.page = page
        this.searchInput = this.page.locator("#search")
        this.searchSuggestions = this.page.locator(".search-suggestions")
        this.productResults = new ProductResultsCarousel(this.page)
    }

    //methods
    async getSearchSuggestions(searchText:string): Promise<string[]>{
        return []
    }

    async getProductResults(searchText:string): Promise<string[]>{
        return await this.productResults.getCarouselItems()
    }

    async searchBySuggestion(searchText:string): Promise<ProductListing>{
        return 
    }

    async searchByButton(searchText:string): Promise<ProductListing>{
        return 
    }

    async gotoProductDetailsPage(searchText:string): Promise<Product>{
        return
    }

    async deleteSearch(searchText:string):Promise<boolean>{
        return false
    }
}