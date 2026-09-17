import {test, expect} from '@playwright/test'
import type {Page} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import { SearchBox } from '../../../pages/components/search'
import { ProductListing } from '../../../pages/productListingPage'
import { Cart } from '../../../pages/cart'
import * as data from '../../../test_data/labels'
import * as inputs from '../../../test_data/inputs'


let page: Page
let base: BasePage
let searchBox: SearchBox
let productListing: ProductListing
let cart: Cart | null
const searchText = inputs.search.item3
const item = data.products.discounted2

test.beforeAll(async({browser}) => {
    page = await browser.newPage()
    base = new BasePage(page)
    searchBox = new SearchBox(page)

    await page.goto("")
    await base.closePreferences()
    productListing = await searchBox.searchByButton(searchText)
    cart = await productListing.addItemToCart(item)
})

test.describe('Cart Tests', {tag:"@regression"}, async() => {

    test('Verify item quantity can be increased from cart CFS-333', async()=> {
        const itemQty = await cart?.incrementItem(item)
        expect(itemQty).toBe(2)
    })

    test('Verify item quantity can be decreased from cart CFS-334', async()=> {
        const qtyBefore = await cart?.incrementItem(item)
        const qtyAfter = await cart?.decrementItem(item)
        expect(qtyBefore).toBe(2)
        expect(qtyAfter).toBe(1)
    })

    test('Verify item can be removed from cart CFS-335', async()=> {
        
        await cart?.removeItem(item)
        await page.waitForTimeout(2000)
        const qty = await cart?.getCartQuantity()
        expect(qty).toEqual(0)
    })
    
})


