import {test, expect} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import { SearchBox } from '../../../pages/components/search'
import type { Page } from '@playwright/test'
import * as data from '../../../test_data/labels'
import * as inputs from '../../../test_data/inputs'
import type { Product } from '../../../pages/productDetailPage'


let page: Page
let searchBox: SearchBox
let base: BasePage
let productPage: Product | null


test.beforeAll(async({browser}) => {
    page = await browser.newPage()
    searchBox = new SearchBox(page)
    base = new BasePage(page)
    const searchText = inputs.search.item2

    await page.goto("")
    await base.closePreferences()
    const productListing = await searchBox.searchByButton(searchText)
    productPage = await productListing.gotoProductDetailPage(data.products.discounted)
})

test.describe('General Product Detail Page Tests', ()=> {

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

    test('Verify clicking add to cart button on product page adds item to cart CFS-328', async()=> {
        const cart = await productPage?.addToCart()
        const qty = await cart?.getCartBadge()
        expect(qty).toEqual(1)
    })

    test('Verify user can increase item quantity in cart from product page after adding item to cart CFS-329', async()=> {
        const cart = await productPage?.addToCart(2)
        const qty = await cart?.getCartBadge()
        expect(qty).toEqual(2)
    })

    test('Verify user can decrease item quantity in cart from product page after adding item to cart CFS-332', async()=> {
        const cart = await productPage?.addToCart(3)
        await productPage?.decreaseQuantity(2)
        await page.waitForTimeout(5000)
        await base.openCart()
        const qty = await cart?.getCartQuantity()
        expect(qty).toEqual(1)
    })
})

