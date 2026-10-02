import {test, expect} from '@playwright/test'
import { BasePage } from '../../../pages/basePage'
import { SearchBox } from '../../../pages/components/search'
import { ProductListing } from '../../../pages/productListingPage'
import { Cart } from '../../../pages/cart'
import * as data from '../../../test_data/labels'
import * as inputs from '../../../test_data/inputs'
import * as helper from '../../../helpers/functions'


let base: BasePage
let searchBox: SearchBox
let productListing: ProductListing
let cart: Cart | null


test.describe('Cart (Single Item) Tests', {tag:"@regression"}, async() => {
    const item = data.products.basic
    /* test setup - single item cart tests
    
    * @test.beforeEach() - generate a product listing page and freshly add an item to cart from it
    */

    test.beforeEach(async({page})=> {
        base = new BasePage(page)
        searchBox = new SearchBox(page)
        const searchText = inputs.search.item

        await page.goto("")
        await base.closePreferences()
        productListing = await searchBox.searchByButton(searchText)
        cart = await productListing.addItemToCart(item)
    })

    /* test teardown - single item cart tests
    * @test.afterEach() - close the page after each test
    */

    test.afterEach(async({page})=> {
        // await cart?.removeAllItems()
        // await cart?.close()
        await page.close()
    })

    test('Verify item quantity can be increased from cart CFS-333', async()=> {
        const itemQty = await cart?.incrementItem(item)
        await expect(itemQty!).toHaveValue("2")
    })

    test('Verify item quantity can be decreased from cart CFS-334', async()=> {
        const qtyBefore = await cart?.incrementItem(item)
        await expect(qtyBefore!).toHaveValue("2")
        const qtyAfter = await cart?.decrementItem(item)
        await expect(qtyAfter!).toHaveValue("1")
    })

    test('Verify item can be removed from cart CFS-335', async()=> {
        await cart?.removeItem(item)
        const qty = await cart?.getCartQuantity()
        expect(qty).toEqual(0)
    })

    test('Verify cart subtotal reflects the discounted price when discounted item is added to cart CFS-339', async()=> {
        const subtotal = await cart?.getSubtotal() 
        const prices = await cart?.getItemPrices()
        expect(subtotal).toEqual(prices![0])
    })

    test('Verify tax total reflects 15% of the cost of each item in the cart CFS-340', async()=> {
        const taxTotal = await cart?.getTaxTotal()
        const prices = await cart?.getItemPrices()
        const sum = helper.findSum(prices!)
        const calcTax = helper.calcTax(sum)
        expect(taxTotal).toEqual(calcTax)
    })

    
    test('Verify cart item is preserved when user closes cart and returns CFS-342', async({page})=> {
        const itemsBefore = await cart?.getItemNames()
        await cart?.close()
        await page.waitForTimeout(5000) //simulating time away from cart
        await base.openCart()
        const itemsAfter = await cart?.getItemNames()
        expect(itemsAfter).toEqual(itemsBefore)
    })

    test('Verify cart items are preserved when user goes back to previous page after adding item to cart CFS-343', async({page})=> {
        await cart?.item.first().waitFor({state:'visible'})
        const qtyBefore = await cart?.getCartQuantity()
        await cart?.close()
        const response = await page.goBack()
        expect(response === null || response?.ok()).toBeTruthy()
        await page.waitForLoadState()
        await base.openCart()
        const qtyAfter = await cart?.getCartQuantity()
        expect(qtyBefore).toEqual(qtyAfter)
    })
})

test.describe('Cart (Multiple Items) Tests', {tag:"@regression"}, ()=> {
    const items = data.products.bedding

    /* test setup - multiple item cart tests
    * @test.beforeEach() - generate a product listing page and add multiple items from that page to the cart
    */
    test.beforeEach('Multiple Items Test', async({page})=> {
        base = new BasePage(page)
        searchBox = new SearchBox(page)
        cart = new Cart(page)
        const searchText = inputs.search.category

        await page.goto("")
        await base.closePreferences()
        productListing = await searchBox.searchByButton(searchText)
        await productListing.addMultipleItemstoCart(items)
        await base.openCart()
    })
    
    test('Verify correct details are displayed for each cart item CFS-338', async()=> {
        const names = await cart?.getItemNames()
        const prices = await cart?.getItemPrices()
        const images = await cart?.getItemImages()
        const quantities = await cart?.getItemQuantities()
        
        expect(names).toEqual(images)
        expect(prices).toBeDefined()
        expect(quantities?.every(qty => qty === 1)).toBeTruthy()
    })

    test('Verify cart total correctly reflects the total cost of all cart items inclusive of tax CFS-340', async()=> {
        const actualTotal = await cart?.getTotal()
        const prices = await cart?.getItemPrices()
        const sum = helper.findSum(prices!)
        const calcTax = helper.calcTax(sum)
        const expectedTotal = parseFloat((sum + calcTax).toFixed(2))
        expect(actualTotal).toEqual(expectedTotal)
    }) 
})


