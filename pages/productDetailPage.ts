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
        this.productPrice = this.productPage.locator(".product-info-price .price")
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
        let price
        
        if(this.discount){
            price = this.productPrice.first()
        } else {
            price = this.productPrice
        }

        const priceText = (await price.innerText()).split("$")[1] ?? ""
        const formattedPrice = priceText?.replace(",", "")
        return parseFloat(formattedPrice)
       
    }

    async getDescriptionContent():Promise<string | null>{
        await this.descriptionBtn.click()
        const descriptionContent = await this.productPage.locator(".description .text-content").innerText()
        return descriptionContent
    }

    async getSpecsContent():Promise<string[] | null>{
        await this.specsBtn.click()
        const specsTable = this.productPage.locator("#product-attribute-specs-table")
        const specsHeadings = (await specsTable.locator("th").allInnerTexts()).map(text => text.toLowerCase())
        return specsHeadings
    }

    async browseGallery():Promise<void>{

    }

    async addToCart(qty?: number):Promise<Cart| null>{
        await this.addToCartBtn.click()
        await this.productPage.waitForTimeout(2000)
        const cart = new Cart(this.productPage)
        await cart.close()

        const increaseBtn = this.productPage.locator("[aria-label='Increase quantity']")
    
        if(qty && qty>1){
            await increaseBtn.click({clickCount:qty-1})
            await increaseBtn.waitFor({state:'visible'})
        }
        await this.productPage.waitForTimeout(2000)
        return cart
    }
    
    async decreaseQuantity(qty?:number):Promise<void>{
        const decreaseBtn = this.productPage.locator("[aria-label='Decrease quantity']")
    
        if(qty && qty>1){
            await decreaseBtn.click({clickCount: qty})
            await decreaseBtn.waitFor({state: 'visible'})
            
        } else {
            await decreaseBtn.click()
        }
        await this.productPage.waitForTimeout(2000)
    }

    // async makeProductReview():Promise<ProductReview|null>{
    //     return null
    // }


}