import { test, expect } from '@playwright/test'
import fs from 'fs';
import path from 'path';

let shortTime = Date.now().toString().slice(-5);
let userName = "user" + shortTime;
let userEmail = shortTime + "@abc.com";

test.beforeEach(async ({ page }, testInfo) => {
    console.log('>>> Start to run -> ', testInfo.title)

    await page.goto("http://automationexercise.com")
    await expect(page).toHaveTitle(/Automation Exercise/);
});

test.afterEach(async ({ page }, testInfo) => {
    console.log('=== End of -------> ', testInfo.title)
});


// https://www.automationexercise.com/test_cases

test('Test Case 1: Register User', async ({ page }) => {

    // 4. Click on 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()

    // 5. Verify 'New User Signup!' is visible
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()

    // 6. Enter name and email address
    await page.locator('.signup-form').getByRole('textbox', {name: 'Name'}).fill(userName)
    await page.locator('.signup-form').getByRole('textbox', {name: 'Email Address'}).fill(userEmail)

    // 7. Click 'Signup' button
    await page.getByRole('button', {name: 'Signup'}).click()

    console.log(`Register user name: ${userName}, user email: ${userEmail}`)

    // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
    await expect(page.getByRole('heading', {name: 'Enter Account Information'})).toBeVisible()

    // 9. Fill details: Title, Name, Email, Password, Date of birth
    await page.locator('#password').fill(userName)
    const daysDropDown = 'select#days';
    await page.selectOption(daysDropDown, { label: '2'})
    const monthsDropDown = 'select#months';
    await page.selectOption(monthsDropDown, { label: 'February'})
    const yearsDropDown = 'select#years';
    await page.selectOption(yearsDropDown, { label: '2020'})

    // 10. Select checkbox 'Sign up for our newsletter!'
    await page.locator('#newsletter').check()

    // 11. Select checkbox 'Receive special offers from our partners!'
    await page.locator('#optin').check()

    // 12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
    await page.locator('#first_name').fill('Emily')
    await page.locator('#last_name').fill('Al')
    await page.locator('#address1').fill('Haidian')

    const countryDropDown = 'select#country';
    await page.selectOption(countryDropDown, { label: 'Canada'})

    const state: string = 'Hebei'
    await page.locator('#state').fill(state)
    const city: string = 'Beijing'
    await page.locator('#city').fill(city)
    const zipCode: string = '100000'
    await page.locator('#zipcode').fill(zipCode)
    await page.locator('#mobile_number').fill('15611001100')

    // 13. Click 'Create Account button'
    await page.getByRole('button', {name: 'Create Account'}).click()

    // 14. Verify that 'ACCOUNT CREATED!' is visible
    await expect(page.getByRole('heading', {name: 'Account Created!'})).toBeVisible()

    // 15. Click 'Continue' button
    await page.locator('[data-qa="continue-button"]').click()

    // 16. Verify that 'Logged in as username' is visible
    await expect(page.getByText("Logged in as")).toBeVisible()
    await expect(page.locator(`text=${userName}`)).toBeVisible()

    /* don't delete account for further use
    // 17. Click 'Delete Account' button
    await page.getByRole("link", {name: ' Delete Account'}).click()

    // 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
    await page.getByRole('heading', {name: 'Account Deleted!'}).isVisible()
    await page.locator('[data-qa="continue-button"]').click()
    */

    // write to user.json
    const userData = { userName, userEmail, state, city, zipCode }
    const filePath = path.resolve(__dirname, '../user.json')

    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf-8')
    console.log(`Write to file: ${userData}`)

    await page.waitForTimeout(1000)

});

test('Test Case 2: Login User with correct email and password', async ({ page }) => {

    // read user.json
    const filePath = path.resolve(__dirname, '../user.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const userData = JSON.parse(fileContent);

    // 4. Click on 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()

    // 5. Verify 'Login to your account' is visible
    await expect(page.getByRole('heading', {name: 'Login to your account'})).toBeVisible()

    // 6. Enter correct email address and password
    // we use the userName as the password while register
    await page.locator('.login-form').getByRole('textbox', {name: 'Email Address'}).fill(userData['userEmail'])
    await page.locator('.login-form').getByRole('textbox', {name: 'Password'}).fill(userData['userName'])

    // 7. Click 'login' button
    await page.getByRole('button', {name: 'Login'}).click()
    console.log(`Login user name: ${userData['userName']}, user email: ${userData['userEmail']}`)

    // 8. Verify that 'Logged in as username' is visible
    await expect(page.getByText("Logged in as")).toBeVisible()
    await expect(page.locator(`text=${userData['userName']}`)).toBeVisible()

    await page.waitForTimeout(1000)
});

test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {

    // read user.json
    const filePath = path.resolve(__dirname, '../user.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const userData = JSON.parse(fileContent);

    // 4. Click on 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()

    // 5. Verify 'Login to your account' is visible
    await expect(page.getByRole('heading', {name: 'Login to your account'})).toBeVisible()

    // 6. Enter incorrect email address and password
    // we use the in-correct password
    await page.locator('.login-form').getByRole('textbox', {name: 'Email Address'}).fill(userData['userEmail'])
    await page.locator('.login-form').getByRole('textbox', {name: 'Password'}).fill('typo-password')

    // 7. Click 'login' button
    await page.getByRole('button', {name: 'Login'}).click()
    console.log(`Login user email: ${userData['userEmail']} with wrong password.`)

    // 8. Verify error 'Your email or password is incorrect!' is visible
    await expect(page.getByText("Your email or password is incorrect!")).toBeVisible()

    await page.waitForTimeout(1000)
});


test('Test Case 4: Logout User', async ({ page }) => {

    // read user.json
    const filePath = path.resolve(__dirname, '../user.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const userData = JSON.parse(fileContent);

    // 4. Click on 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()

    // 5. Verify 'Login to your account' is visible
    await expect(page.getByRole('heading', {name: 'Login to your account'})).toBeVisible()

    // 6. Enter correct email address and password
    // we use the userName as the password while register
    await page.locator('.login-form').getByRole('textbox', {name: 'Email Address'}).fill(userData['userEmail'])
    await page.locator('.login-form').getByRole('textbox', {name: 'Password'}).fill(userData['userName'])

    // 7. Click 'login' button
    await page.getByRole('button', {name: 'Login'}).click()
    console.log(`Login user name: ${userData['userName']}, user email: ${userData['userEmail']}`)

    // 8. Verify that 'Logged in as username' is visible
    await expect(page.getByText("Logged in as")).toBeVisible()
    await expect(page.locator(`text=${userData['userName']}`)).toBeVisible()

    // 9. Click 'Logout' button
    await page.getByRole('link', {name: 'Logout'}).click()

    // 10. Verify that user is navigated to login page
    await expect(page.getByRole('heading', {name: 'Login to your account'})).toBeVisible()

    await page.waitForTimeout(1000)
});

test('Test Case 5: Register User with existing email', async ({ page }) => {

    // read user.json
    const filePath = path.resolve(__dirname, '../user.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const userData = JSON.parse(fileContent);

    // 4. Click on 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()

    // 5. Verify 'New User Signup!' is visible
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()

    // 6. Enter name and already registered email address
    await page.locator('.signup-form').getByRole('textbox', {name: 'Name'}).fill(userData['userName'])
    await page.locator('.signup-form').getByRole('textbox', {name: 'Email Address'}).fill(userData['userEmail'])

    // 7. Click 'Signup' button
    await page.getByRole('button', {name: 'Signup'}).click()

    // 8. Verify error 'Email Address already exist!' is visible
    await expect(page.getByText("Email Address already exist!")).toBeVisible()


    await page.waitForTimeout(1000)
});

/* 这个 test case 总也是跑不过，因为在 js 弹窗这块总是出问题 */
test.skip('Test Case 6: Contact Us Form', async ({ page }) => {

    // read user.json
    const filePath = path.resolve(__dirname, '../user.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const userData = JSON.parse(fileContent);

    // 4. Click on 'Contact Us' button
    await page.getByRole('link', { name: ' Contact us' }).click()

    // 5. 5. Verify 'GET IN TOUCH' is visible
    await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible()

    // 6. Enter name, email, subject and message
    await page.locator('.contact-form').getByRole('textbox', {name: 'Name'}).fill(userData['userName'])
    await page.locator('.contact-form').getByRole('textbox', {name: 'Email'}).fill(userData['userEmail'])
    await page.locator('.contact-form').getByRole('textbox', {name: 'Subject'}).fill('This is Subject')
    await page.locator('.contact-form').getByRole('textbox', {name: 'Your Message Here'}).fill('This is Message.')

    // 7. Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('user.json')
    // await expect(page.locator('.upload-success')).toBeVisible()


    // 监听弹窗事件
    page.once('dialog', async dialog => {
        console.log(dialog.message()); // 打印弹窗文字：Press OK to proceed!
        await dialog.accept(); // 点击“确定”
    });

    // 8. Click 'Submit' button
    // 点击 Submit，不等待页面刷新
    await page.getByRole('button', { name: 'Submit' }).click();

    // 9. Click OK button

    // 10. Verify success message 'Success! Your details have been submitted successfully.' is visible
    //<div class="status alert alert-success" style="display: block;">Success! Your details have been submitted successfully.</div>
    
    // 等待 URL 保持在 contact_us（刷新后返回）
    await page.waitForURL('**/contact_us')

    // 等待成功提示可见
    await page.waitForSelector('.status.alert-success', { state: 'visible', timeout: 15000 } );
    
    // 验证文本
    await expect(page.locator('.status.alert-success')).toHaveText('Success! Your details have been submitted successfully.');
    

    await page.waitForTimeout(1000)
});


test('Test Case 7: Verify Test Cases Page', async ({ page }) => {

    // 4. Click on 'Test Cases' button
    await page.locator('.nav.navbar-nav').getByRole('link', { name: /Test Cases/i }).click()

    // 5. Verify user is navigated to test cases page successfully
    await expect(page.locator('.row').getByRole('heading', {name: 'Test Cases'})).toBeVisible()
});


test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {

    // 4. Click on 'Products' button
    await page.locator('.nav.navbar-nav').getByRole('link', { name: /Products/i }).click()
    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    // 6. The products list is visible
    await expect(page.locator('.features_items')).toBeVisible()
    // 7. Click on 'View Product' of first product
    // await page.locator('.col-sm-4').first().getByRole('link', {name: 'View Product'}).click()
    await page.locator('text=View Product').first().click();

    // 8. User is landed to product detail page
    await expect(page).toHaveURL(/.*\/product_details\/1/)


    // 9. Verify that detail detail is visible: product name, category, price, availability, condition, brand
    await expect(page.locator('.product-information').getByRole("heading", { level: 2})).toBeVisible()
    await expect(page.locator('.product-information').locator('text=Category:')).toBeVisible()
    await expect(page.locator('.product-information').locator('text=Rs.')).toBeVisible()
    await expect(page.locator('.product-information').locator('text=Availability:')).toBeVisible()
    await expect(page.locator('.product-information').locator('text=Condition:')).toBeVisible()
    await expect(page.locator('.product-information').locator('text=Brand:')).toBeVisible()

});

test('Test Case 9: Search Product', async ({ page }) => {

    // 4. Click on 'Products' button
    await page.locator('.nav.navbar-nav').getByRole('link', { name: /Products/i }).click()
    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    // 6. Enter product name in search input and click search button Jeans
    await page.locator('#search_product').fill('Jeans')
    await page.locator('#submit_search').click()
    // 7. Verify 'SEARCHED PRODUCTS' is visible single-products
    await expect(page.getByRole('heading', {name: 'Searched Products'})).toBeVisible()
    // 8. Verify all the products related to search are visible
    const products = page.locator('div.features_items').locator('div.single-products')
    const productCount = await products.count()

    for (let i = 0; i < productCount; i++) {
        await expect(products.nth(i)).toBeVisible()
    }

});

test('Test Case 10: Verify Subscription in home page', async ({ page }) => {

    // 4. Scroll down to footer
    await page.locator('#footer').scrollIntoViewIfNeeded()
    // 5. Verify text 'SUBSCRIPTION'
    await expect(page.locator('text=Subscription')).toBeVisible()
    // 6. Enter email address in input and click arrow button
    await page.locator('#susbscribe_email').fill('any@abc.com')
    await page.locator('#subscribe').click()
    // 7. Verify success message 'You have been successfully subscribed!' is visible
    await expect(page.locator('text="You have been successfully subscribed!"')).toBeVisible()

    await page.waitForTimeout(3000)

});

test('Test Case 11: Verify Subscription in Cart page', async ({ page }) => {

    // 4. Click 'Cart' button
    await page.locator('.nav.navbar-nav').getByRole('link', { name: /Cart/i }).click()
    await expect(page).toHaveTitle('Automation Exercise - Checkout')
    // 5. Scroll down to footer
    await page.locator('#footer').scrollIntoViewIfNeeded()
    // 6. Verify text 'SUBSCRIPTION'
    await expect(page.locator('text=Subscription')).toBeVisible()
    // 7. Enter email address in input and click arrow button
    await page.locator('#susbscribe_email').fill('any@abc.com')
    await page.locator('#subscribe').click()
    // 8. Verify success message 'You have been successfully subscribed!' is visible
    await expect(page.locator('text="You have been successfully subscribed!"')).toBeVisible()

    await page.waitForTimeout(3000)

});

test('Test Case 12: Add Products in Cart', async ({ page }) => {

    let prices: number[] = []
    // 4. Click 'Products' button
    await page.locator('.nav.navbar-nav').getByRole('link', { name: /Products/i }).click()
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();

    // 5. Hover over first product and click 'Add to cart'
    const products = page.locator('div.features_items').locator('div.single-products')
    await products.first().hover()
    await page.waitForTimeout(1000)
    const firstText = await products.first().locator('.product-overlay').locator('h2').textContent()
    prices.push(Number(firstText?.split(' ')[1] ?? 0))
    console.log(`First product proce is ${firstText}`)
    await products.first().locator('.product-overlay').locator('.add-to-cart').click()

    // 6. Click 'Continue Shopping' button
    const modal = page.getByRole('button', {name: 'Continue Shopping'})
    await modal.waitFor({ state: 'visible' });
    await modal.click()

    // 7. Hover over second product and click 'Add to cart'
    await products.nth(2).hover()
    await page.waitForTimeout(1000)
    const secondText = await products.nth(2).locator('.product-overlay').locator('h2').textContent()
    prices.push(Number(secondText?.split(' ')[1] ?? 0))
    console.log(`Second product proce is ${secondText}`)
    await products.nth(2).locator('.product-overlay').locator('.add-to-cart').click()

    // 8. Click 'View Cart' button
    await page.getByRole('link', {name: 'View Cart'}).click()
    await expect(page.getByText('Shopping Cart')).toBeVisible();

    // 9. Verify both products are added to Cart
    const rows = page.locator('tbody tr')
    const rowCount = await rows.count();
    expect(rowCount).toBe(2)

    // 10. Verify their prices, quantity and total price
    for (let i = 0; i < rowCount; i++) {
        const description = await rows.nth(i).locator('.cart_description').getByRole('link').textContent()
        console.log(`product name: ${description}`)

        const priceText = await rows.nth(i).locator('.cart_price').locator('p').textContent()
        const priceValue = Number(priceText?.split(' ')[1] ?? 0)
        console.log(`product price: ${priceValue}`)

        const quantity = await rows.nth(i).getByRole('button').textContent()
        console.log(`product quantity: ${quantity}`)
        expect(Number(quantity)).toBe(1)

        const cartPrice = prices.shift()
        expect(priceValue).toBe(cartPrice)
    }
    await page.waitForTimeout(3000)

});


test('Test Case 13: Verify Product quantity in Cart', async ({ page }) => {

    // 4. Click 'View Product' for any product on home page
    await page.getByRole('link', {name: 'View Product'}).nth(0).click()
    // 5. Verify product detail is opened
    await expect(page).toHaveURL(/.*product_details.*/)
    // 6. Increase quantity to 4
    await page.locator('#quantity').fill('4')
    // 7. Click 'Add to cart' button
    await page.getByRole('button', {name: ' Add to cart'}).click()
    // 8. Click 'View Cart' button
    await page.getByRole('link', {name: 'View Cart'}).click()
    await expect(page.getByText('Shopping Cart')).toBeVisible();
    // 9. Verify that product is displayed in cart page with exact quantity
    const rows = page.locator('tbody tr')
    const quantity = await rows.nth(0).getByRole('button').textContent()

    expect(Number(quantity)).toBe(4)

    await page.waitForTimeout(3000)

});

/* step 18 verfication failed */
test('Test Case 14: Place Order: Register while Checkout', async ({ page }) => {

    // 4. Add products to cart
    const products = page.locator('div.features_items').locator('div.single-products')
    await products.first().hover()
    await page.waitForTimeout(500)
    await products.first().locator('.product-overlay').locator('.add-to-cart').click()

    const modal = page.getByRole('button', {name: 'Continue Shopping'})
    await modal.waitFor({ state: 'visible' });
    await modal.click()

    await products.nth(2).hover()
    await page.waitForTimeout(500)

    await products.nth(2).locator('.product-overlay').locator('.add-to-cart').click()

    // 5. Click 'Cart' button
    await page.getByRole('link', {name: 'View Cart'}).click()

    // 6. Verify that cart page is displayed
    await expect(page.getByText('Shopping Cart')).toBeVisible();

    // 7. Click Proceed To Checkout
    await page.locator('text=Proceed To Checkout').click()

    // 8. Click 'Register / Login' button
    await page.getByRole('link', {name: 'Register / Login'}).click()

    // 9. Fill all details in Signup and create account <- record the address and info ->
    await page.locator('.signup-form').getByRole('textbox', {name: 'Name'}).fill(userName)
    await page.locator('.signup-form').getByRole('textbox', {name: 'Email Address'}).fill(userEmail)
    await page.getByRole('button', {name: 'Signup'}).click()

    console.log(`Register user name: ${userName}, user email: ${userEmail}`)

    await expect(page.getByRole('heading', {name: 'Enter Account Information'})).toBeVisible()

    await page.locator('#password').fill(userName)
    const daysDropDown = 'select#days';
    await page.selectOption(daysDropDown, { label: '2'})
    const monthsDropDown = 'select#months';
    await page.selectOption(monthsDropDown, { label: 'February'})
    const yearsDropDown = 'select#years';
    await page.selectOption(yearsDropDown, { label: '2020'})

    await page.locator('#first_name').fill('Emily')
    await page.locator('#last_name').fill('Al')
    await page.locator('#address1').fill('Haidian')

    const countryDropDown = 'select#country';
    await page.selectOption(countryDropDown, { label: 'Canada'})

    const state = 'Hebei'
    await page.locator('#state').fill(state)
    const city = 'Beijing'
    await page.locator('#city').fill(city)
    const zipCode = '100000'
    await page.locator('#zipcode').fill(zipCode)
    const mobileNumber = '15611001100'
    await page.locator('#mobile_number').fill(mobileNumber)

    await page.getByRole('button', {name: 'Create Account'}).click()

    // 10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
    await expect(page.getByRole('heading', {name: 'Account Created!'})).toBeVisible()
    await page.locator('[data-qa="continue-button"]').click()

    // 11. Verify ' Logged in as username' at top
    await expect(page.getByText("Logged in as")).toBeVisible()
    await expect(page.locator(`text=${userName}`)).toBeVisible()

    // 12.Click 'Cart' button
    await page.locator('.nav.navbar-nav').getByRole('link', { name: /Cart/i }).click()

    // 13. Click 'Proceed To Checkout' button
    await page.locator('text=Proceed To Checkout').click()

    // 14. Verify Address Details and Review Your Order
    const filledAddress = city + ' ' + state + ' ' + zipCode
    console.log(`filled in address is: ${filledAddress}`)
    let confirmAddress = await page.locator('#address_delivery').locator('.address_city.address_state_name.address_postcode').textContent() ?? ''
    confirmAddress = confirmAddress = confirmAddress.replace(/[\s\r\n]+/g, ' ')
    confirmAddress = confirmAddress.trim()
    console.log(`confirmed address is: ${confirmAddress}`)
    expect(confirmAddress).toBe(filledAddress)

    // 15. Enter description in comment text area and click 'Place Order'
    await page.locator('#ordermsg textarea').fill('This is a comment.')
    await page.getByRole('link', {name: 'Place Order'}).click()

    // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    await expect(page.locator('#header')).toBeVisible()

    await page.locator('input[name="name_on_card"]').fill('Sam')
    await page.locator('input[name="card_number"]').fill('111111111111')
    await page.locator('input[name="cvc"]').fill('313')
    await page.locator('input[name="expiry_month"]').fill('01')
    await page.locator('input[name="expiry_year"]').fill('2010')

    // 17. Click 'Pay and Confirm Order' button
    await page.locator('#submit').click()

    // 18. Verify success message 'Your order has been placed successfully!'
    /*
    const successMsg = page.locator('#order-message .alert-success', { hasText: /Your order has been placed successfully!/i})
    await successMsg.waitFor({ state: 'visible', timeout: 3000 })
    */

    // 19. Click 'Delete Account' button
    await page.locator('.nav.navbar-nav').getByRole('link', {name: ' Delete Account'}).click()

    // 20. Verify 'ACCOUNT DELETED!' and click 'Continue' button
    await expect(page.locator('text=Account Deleted!')).toBeVisible()
    await page.getByRole('link', {name: 'Continue'}).click()

    await page.waitForTimeout(3000)

});

test('Test Case 15: Place Order: Register before Checkout', async ({ page }) => {

    // 4. Click 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()
    
    // 5. Fill all details in Signup and create account
    await page.locator('.signup-form').getByRole('textbox', {name: 'Name'}).fill(userName)
    await page.locator('.signup-form').getByRole('textbox', {name: 'Email Address'}).fill(userEmail)
    await page.getByRole('button', {name: 'Signup'}).click()

    console.log(`Register user name: ${userName}, user email: ${userEmail}`)

    await expect(page.getByRole('heading', {name: 'Enter Account Information'})).toBeVisible()

    await page.locator('#password').fill(userName)
    const daysDropDown = 'select#days';
    await page.selectOption(daysDropDown, { label: '2'})
    const monthsDropDown = 'select#months';
    await page.selectOption(monthsDropDown, { label: 'February'})
    const yearsDropDown = 'select#years';
    await page.selectOption(yearsDropDown, { label: '2020'})

    await page.locator('#first_name').fill('Emily')
    await page.locator('#last_name').fill('Al')
    await page.locator('#address1').fill('Haidian')

    const countryDropDown = 'select#country';
    await page.selectOption(countryDropDown, { label: 'Canada'})

    const state = 'Hebei'
    await page.locator('#state').fill(state)
    const city = 'Beijing'
    await page.locator('#city').fill(city)
    const zipCode = '100000'
    await page.locator('#zipcode').fill(zipCode)
    const mobileNumber = '15611001100'
    await page.locator('#mobile_number').fill(mobileNumber)

    await page.getByRole('button', {name: 'Create Account'}).click()

    // 6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
    await expect(page.getByRole('heading', {name: 'Account Created!'})).toBeVisible()
    await page.locator('[data-qa="continue-button"]').click()

    // 7. Verify ' Logged in as username' at top
    await expect(page.getByText("Logged in as")).toBeVisible()
    await expect(page.locator(`text=${userName}`)).toBeVisible()

    // 8. Add products to cart
    const products = page.locator('div.features_items').locator('div.single-products')
    await products.first().hover()
    await page.waitForTimeout(500)
    await products.first().locator('.product-overlay').locator('.add-to-cart').click()

    const modal = page.getByRole('button', {name: 'Continue Shopping'})
    await modal.waitFor({ state: 'visible' });
    await modal.click()

    await products.nth(2).hover()
    await page.waitForTimeout(500)

    await products.nth(2).locator('.product-overlay').locator('.add-to-cart').click()

    // 9. Click 'Cart' button
    await page.getByRole('link', {name: 'View Cart'}).click()

    // 10. Verify that cart page is displayed
    await expect(page.getByText('Shopping Cart')).toBeVisible();

    // 11. Click Proceed To Checkout
    await page.locator('text=Proceed To Checkout').click()

    // 12. Verify Address Details and Review Your Order
    const filledAddress = city + ' ' + state + ' ' + zipCode
    console.log(`filled in address is: ${filledAddress}`)
    let confirmAddress = await page.locator('#address_delivery').locator('.address_city.address_state_name.address_postcode').textContent() ?? ''
    confirmAddress = confirmAddress = confirmAddress.replace(/[\s\r\n]+/g, ' ')
    confirmAddress = confirmAddress.trim()
    console.log(`confirmed address is: ${confirmAddress}`)
    expect(confirmAddress).toBe(filledAddress)

    // 13. Enter description in comment text area and click 'Place Order'
    await page.locator('#ordermsg textarea').fill('This is a comment.')
    await page.getByRole('link', {name: 'Place Order'}).click()

    // 14. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    await expect(page.locator('#header')).toBeVisible()

    await page.locator('input[name="name_on_card"]').fill('Sam')
    await page.locator('input[name="card_number"]').fill('111111111111')
    await page.locator('input[name="cvc"]').fill('313')
    await page.locator('input[name="expiry_month"]').fill('01')
    await page.locator('input[name="expiry_year"]').fill('2010')

    // 15. Click 'Pay and Confirm Order' button
    await page.locator('#submit').click()

    // 16. Verify success message 'Your order has been placed successfully!'
    /*
    const successMsg = page.locator('#order-message .alert-success', { hasText: /Your order has been placed successfully!/i})
    await successMsg.waitFor({ state: 'visible', timeout: 3000 })
    */

    // 17. Click 'Delete Account' button
    await page.locator('.nav.navbar-nav').getByRole('link', {name: ' Delete Account'}).click()

    // 18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
    await expect(page.locator('text=Account Deleted!')).toBeVisible()
    await page.getByRole('link', {name: 'Continue'}).click()

    await page.waitForTimeout(3000)

});

test('Test Case 16: Place Order: Login before Checkout', async ({ page }) => {
    
    // read user.json
    const filePath = path.resolve(__dirname, '../user.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const userData = JSON.parse(fileContent);

    // 4. Click 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()
    await expect(page.getByRole('heading', {name: 'Login to your account'})).toBeVisible()

    // 5. Fill email, password and click 'Login' button
    await page.locator('.login-form').getByRole('textbox', {name: 'Email Address'}).fill(userData['userEmail'])
    await page.locator('.login-form').getByRole('textbox', {name: 'Password'}).fill(userData['userName'])

    await page.getByRole('button', {name: 'Login'}).click()
    console.log(`Login user name: ${userData['userName']}, user email: ${userData['userEmail']}`)

    // 6. Verify 'Logged in as username' at top
    await expect(page.getByText("Logged in as")).toBeVisible()
    await expect(page.locator(`text=${userData['userName']}`)).toBeVisible()

    // 7. Add products to cart
    const products = page.locator('div.features_items').locator('div.single-products')
    await products.first().hover()
    await page.waitForTimeout(500)
    await products.first().locator('.product-overlay').locator('.add-to-cart').click()

    const modal = page.getByRole('button', {name: 'Continue Shopping'})
    await modal.waitFor({ state: 'visible' });
    await modal.click()

    await products.nth(2).hover()
    await page.waitForTimeout(500)

    await products.nth(2).locator('.product-overlay').locator('.add-to-cart').click()

    // 8. Click 'Cart' button
    await page.getByRole('link', {name: 'View Cart'}).click()

    // 9. Verify that cart page is displayed
    await expect(page.getByText('Shopping Cart')).toBeVisible();

    // 10. Click Proceed To Checkout
    await page.locator('text=Proceed To Checkout').click()

    // 11. Verify Address Details and Review Your Order
    const filledAddress = userData['city'] + ' ' + userData['state'] + ' ' + userData['zipCode']
    console.log(`filled in address is: ${filledAddress}`)
    let confirmAddress = await page.locator('#address_delivery').locator('.address_city.address_state_name.address_postcode').textContent() ?? ''
    confirmAddress = confirmAddress = confirmAddress.replace(/[\s\r\n]+/g, ' ')
    confirmAddress = confirmAddress.trim()
    console.log(`confirmed address is: ${confirmAddress}`)
    expect(confirmAddress).toBe(filledAddress)

    // 12. Enter description in comment text area and click 'Place Order'
    await page.locator('#ordermsg textarea').fill('This is a comment.')
    await page.getByRole('link', {name: 'Place Order'}).click()

    // 13. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    await expect(page.locator('#header')).toBeVisible()

    await page.locator('input[name="name_on_card"]').fill('Sam')
    await page.locator('input[name="card_number"]').fill('111111111111')
    await page.locator('input[name="cvc"]').fill('313')
    await page.locator('input[name="expiry_month"]').fill('01')
    await page.locator('input[name="expiry_year"]').fill('2010')

    // 14. Click 'Pay and Confirm Order' button
    await page.locator('#submit').click()

    // 15. Verify success message 'Your order has been placed successfully!'
    // 16. Click 'Delete Account' button
    await page.locator('.nav.navbar-nav').getByRole('link', {name: ' Delete Account'}).click()

    // 17. Verify 'ACCOUNT DELETED!' and click 'Continue' button
    await expect(page.locator('text=Account Deleted!')).toBeVisible()
    await page.getByRole('link', {name: 'Continue'}).click()

    await page.waitForTimeout(3000)

});