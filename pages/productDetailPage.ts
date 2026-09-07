import {type Page, type Locator} from '@playwright/test'
import { BasePage } from './basePage';
import { Cart } from './cart';

export class Product extends BasePage
{
    //variables
    private readonly productPage: Page
    readonly productImage: Locator
    readonly productTitle: Locator
    readonly productPrice: Locator
    readonly discount?: Locator
    readonly gallery: Locator
    readonly showGalleryBtn: Locator
    readonly ratingStars: Locator
    readonly ratingNumber: Locator
    readonly reviewLink: Locator
    readonly status: Locator
    readonly productId: Locator
    readonly addToCartBtn: Locator
    readonly buyNowBtn: Locator
    readonly descriptionBtn: Locator
    readonly specsBtn: Locator
    // readonly warrantyCarousel: WarrantyCarousel
    readonly writeReviewBtn: Locator
    // readonly productReview: ProductReview

    //constructor
    constructor(page: Page){
        super(page)
        this.productPage = page
        this.productImage = this.productPage.locator("[data-gallery-role='stage-shaft']")
        this.productTitle = this.productPage.locator("h1.page-title")
        this.productPrice = this.productPage.locator("")
        this.gallery = this.productPage.locator(".fs-gallery__dialog")
        this.showGalleryBtn = this.productPage.locator("[aria-label*='Show all']")
        this.ratingStars = this.productPage.locator(".rating-stars").first()
        this.ratingNumber = this.productPage.locator(".rating-number").first()
        this.reviewLink = this.productPage.locator(".reviews-count").first()
        this.status = this.productPage.locator(".stock")
        this.productId = this.productPage.locator(".product.sku")
        this.addToCartBtn = this.productPage.locator("#product-addtocart-button")
        this.buyNowBtn = this.productPage.locator("#buy-now")
        this.descriptionBtn = this.productPage.locator("a[href='#description']")
        this.specsBtn = this.productPage.locator("a[href='#additional']")
        this.discount = this.productPage.locator(".product-info-price .discount")
        // this.warrantyCarousel = new WarrantyCarousel(this.productPage)
        this.writeReviewBtn = this.productPage.locator("button.rr-write-review")
        // this.productReview = new ProductReview(this.productPage)
        
    }

    //methods
    async getProductTitle(): Promise<string>{
        const title = await this.productTitle.innerText()
        return title
    }

    async getProductImage(): Promise<string>{
        const image = this.productImage.locator("img").first()
        const imageText = await image.getAttribute("alt") ?? ""
        return imageText
    }

    async getStarRatingCount(): Promise<number>{
        const count = await this.ratingStars.locator("i").count()
        return count
    }

    async getRatingNumber(): Promise<string>{
        const ratingNum = await this.ratingNumber.innerText()
        return ratingNum
    }

    async getStatus(): Promise<string>{
        const status = await this.status.innerText()
        return status
    }

    async getProductId(): Promise<string>{
        const idText = await this.productId.innerText()
        return idText
    }

    async getProductPrice():Promise<number>{
        return 0
    }

    async getDescriptionContent():Promise<Locator | null>{
        return null
    }

    async getSpecsContent():Promise<Locator | null>{
        return null
    }

    async browseGallery():Promise<void>{

    }

    async addToCart(item:string):Promise<Cart |null>{
        return null
    }
    
    // async makeProductReview():Promise<ProductReview|null>{
    //     return null
    // }


}