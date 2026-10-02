import {test, expect} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import { SearchBox } from '../../../pages/components/search'
import * as data from '../../../test_data/labels'
import * as inputs from '../../../test_data/inputs'
import type { Product } from '../../../pages/productDetailPage'
import type { Cart } from '../../../pages/cart'


let searchBox: SearchBox
let base: BasePage
let productPage: Product | null
let cart: Cart | null
const searchText = inputs.search.item2

/* test setup - product detail page general tests
 * @test.beforeEach() - generate a product detail page
 */

test.beforeEach(async({page}) => {
    searchBox = new SearchBox(page)
    base = new BasePage(page)
    

    await page.goto("")
    await base.closePreferences()
    const productListing = await searchBox.searchByButton(searchText)
    productPage = await productListing.gotoProductDetailPage(data.products.discounted)
})

/* test teardown - product detail page general tests
* @test.afterEach() - close page
*/

test.afterEach(async({page}) => {
    await page.close()
})

test.describe('Product Detail Page General Tests', ()=> {

    test('Verify product page displays correct product info CFS-320', async() => {
        const image = await productPage?.getProductImage()
        const title = await productPage?.getProductTitle()
        const starRatingCount = await productPage?.getStarRatingCount()
        const ratingNumber = await productPage?.getRatingNumber()
        const status = await productPage?.getStatus()
        const productId = await productPage?.getProductId()
        const price = await productPage?.getProductPrice()

        //debug
        // console.log(image, title, starRatingCount, ratingNumber, status, productId, price)

        expect(image).toEqual(title)
        expect(status?.toLowerCase()).toContain(data.productDetails.status)
        expect(productId).toContain(data.productDetails.idText)
        expect(price).toEqual(72999.00)

        if(starRatingCount){
            expect(ratingNumber).toBeDefined()
            expect(parseFloat(ratingNumber!)).toBeGreaterThan(0)
        }
    })

    test('Verify description content is displayed when user selects description link CFS-326', async()=> {
        const descriptionText = await productPage?.getDescriptionContent()
        expect(descriptionText).toContain(data.products.discounted)
    })

    test('Verify specification content is displayed when user selects specifications link CFS-327', async()=> {
        const specsContent = await productPage?.getSpecsContent()
        expect(specsContent).toContain(data.productDetails.specs)
    })

   
})

test.describe('Product Detail Page Cart Tests', {tag:"@regression"}, ()=> {
    
    //test setup
    // @test.beforeEach() - add item to cart from product page and close the cart

    test.beforeEach(async()=> {
        cart = productPage ? await productPage.addToCart() : null
        await cart?.close()
    })

    test('Verify clicking add to cart button on product page adds item to cart CFS-328', async()=> {
        const qty = await cart?.getCartBadge()
        await expect(qty!).toHaveText("1")
    })

    test('Verify user can increase item quantity in cart from product page after adding item to cart CFS-329', async()=> {
        await productPage?.increaseQuantity(2)
        const qty = await cart?.getCartBadge()
        await expect(qty!).toHaveText("3")
    })

    test('Verify user can decrease item quantity in cart from product page after adding item to cart CFS-332', async()=> {
        await productPage?.increaseQuantity(1)
        await productPage?.decreaseQuantity(1)
        const qty = await cart?.getCartBadge()
        await expect(qty!).toHaveText("1")
    })

})
    