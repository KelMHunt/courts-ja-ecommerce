import type {Page, Locator} from '@playwright/test'
import { BasePage } from './basePage';
import { Cart } from './cart';
import { WarrantyCarousel } from './components/warrantyCarousel';


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
    readonly warrantyCarousel: WarrantyCarousel
    readonly writeReviewBtn: Locator


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
        this.warrantyCarousel = new WarrantyCarousel(this.productPage)
        this.writeReviewBtn = this.productPage.locator("button.rr-write-review")
        
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

    async getGalleryTitle():Promise<string>{
        const title = await this.gallery.locator(".fs-gallery__title").innerText()
        return title
    }

    async openGallery():Promise<void>{
        await this.showGalleryBtn.click()
        await this.productPage.waitForTimeout(2000)
    }

    async closeGallery():Promise<void>{
        const closeBtn = this.gallery.locator("[aria-label='Close']")
        await closeBtn.click()
        await this.productPage.waitForTimeout(2000)
    }

    async browseGallery():Promise<void> {
        const nextBtn = this.gallery.locator(".fs-gallery__arrow--next")
        const galleryCounter = (await this.gallery.locator(".fs-gallery__counter").innerText()).split("/")[0]?.trim()
        const limit = (await this.gallery.locator(".fs-gallery__counter").innerText()).split("/")[1]?.trim()

        for(let i=parseInt(galleryCounter!); i<=parseInt(limit!); i++){
            await nextBtn.click()
        }
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

    async gotoReviews():Promise<void>{
        await this.reviewLink.click()
        await this.productPage.waitForTimeout(2000)
    }

    async getReviewsCount(): Promise<number>{
        const reviews = this.productPage.locator(".rr-review")
        return await reviews.count()
    }

    async makeProductReview(name:string, title:string, message:string, rating: number):Promise<void>{
       await this.writeReviewBtn.click()
       await this.productPage.waitForTimeout(2000)

       const reviewForm = this.productPage.locator("#review-form")
       const nameInput = reviewForm.locator("#nickname_field")
       const summaryInput = reviewForm.locator("#summary_field")
       const reviewInput = reviewForm.locator("#review_field")

       await nameInput.fill(name)
       await summaryInput.fill(title)
       await reviewInput.fill(message)

    //    await this.selectStarRating(rating)
       await this.productPage.waitForTimeout(2000)
    }

    //function not working -- not selecting star icons
    private async selectStarRating(choice:number):Promise<void>{

        const reviewForm = this.productPage.locator("#review-form")
        const votes = await reviewForm.locator(".review-control-vote input").all()
        let hasVote = false
        
        for(const vote of votes){
            const value = parseInt(await vote.inputValue())

            switch (choice) {
                case 1:
                    if(value===choice){
                        await reviewForm.locator("#Overall\ rating_1").click()
                        hasVote = true
                    }
                    break
                case 2:
                    if(value===choice){
                        await reviewForm.locator("#Overall\ rating_2").click()
                        hasVote = true
                    }
                    break
                case 3:
                    if(value===choice){
                        await reviewForm.locator("#Overall\ rating_3").click()
                        hasVote = true
                    }
                    break
                case 4:
                    if(value===choice){
                        await reviewForm.locator("#Overall\ rating_4").click()
                        hasVote = true
                    }
                    break
                case 5:
                    if(value===choice){
                        await reviewForm.locator("#Overall\ rating_5").click()
                        hasVote = true
                    }
                    break
                default:
                    console.log("Invalid choice")

            }
            if(hasVote) break
        }
        
    }

}