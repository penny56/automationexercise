import { test, expect } from '@playwright/test'

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

    await page.locator('#state').fill('Hebei')
    await page.locator('#city').fill('Beijing')
    await page.locator('#zipcode').fill('100000')
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

    await page.waitForTimeout(1000)

});

test.skip('Test Case 2: Login User with correct email and password', async ({ page }) => {

    // 4. Click on 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()

    // 5. Verify 'Login to your account' is visible
    await expect(page.getByRole('heading', {name: 'Login to your account'})).toBeVisible()

    // 6. Enter correct email address and password
    // we use the userName as the password while register
    await page.locator('.login-form').getByRole('textbox', {name: 'Email Address'}).fill(userEmail)
    await page.locator('.login-form').getByRole('textbox', {name: 'Password'}).fill(userName)

    // 7. Click 'login' button
    await page.getByRole('button', {name: 'Login'}).click()
    console.log(`Login user name: ${userName}, user email: ${userEmail}`)

    // 8. Verify that 'Logged in as username' is visible
    await expect(page.getByText("Logged in as")).toBeVisible()
    await expect(page.locator(`text=${userName}`)).toBeVisible()

    await page.waitForTimeout(1000)
});

test.skip('Test Case 3: Login User with incorrect email and password', async ({ page }) => {

    // 4. Click on 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()

    // 5. Verify 'Login to your account' is visible
    await expect(page.getByRole('heading', {name: 'Login to your account'})).toBeVisible()

    // 6. Enter incorrect email address and password
    // we use the in-correct password
    await page.locator('.login-form').getByRole('textbox', {name: 'Email Address'}).fill(userEmail)
    await page.locator('.login-form').getByRole('textbox', {name: 'Password'}).fill('typo-password')

    // 7. Click 'login' button
    await page.getByRole('button', {name: 'Login'}).click()
    console.log(`Login user email: ${userEmail} with wrong password.`)

    // 8. Verify error 'Your email or password is incorrect!' is visible
    await expect(page.getByText("Your email or password is incorrect!")).toBeVisible()

    await page.waitForTimeout(1000)
});


test.skip('Test Case 4: Logout User', async ({ page }) => {

    // 4. Click on 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()

    // 5. Verify 'Login to your account' is visible
    await expect(page.getByRole('heading', {name: 'Login to your account'})).toBeVisible()

    // 6. Enter correct email address and password
    // we use the userName as the password while register
    await page.locator('.login-form').getByRole('textbox', {name: 'Email Address'}).fill(userEmail)
    await page.locator('.login-form').getByRole('textbox', {name: 'Password'}).fill(userName)

    // 7. Click 'login' button
    await page.getByRole('button', {name: 'Login'}).click()
    console.log(`Login user name: ${userName}, user email: ${userEmail}`)

    // 8. Verify that 'Logged in as username' is visible
    await expect(page.getByText("Logged in as")).toBeVisible()
    await expect(page.locator(`text=${userName}`)).toBeVisible()

    // 9. Click 'Logout' button
    await page.getByRole('link', {name: 'Logout'}).click()

    // 10. Verify that user is navigated to login page
    await expect(page.getByRole('heading', {name: 'Login to your account'})).toBeVisible()

    await page.waitForTimeout(1000)
});

test.skip('Test Case 5: Register User with existing email', async ({ page }) => {

    // 4. Click on 'Signup / Login' button
    await page.getByRole('link', { name: 'Signup' }).click()

    // 5. Verify 'New User Signup!' is visible
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()

    // 6. Enter name and already registered email address
    await page.locator('.signup-form').getByRole('textbox', {name: 'Name'}).fill(userName)
    await page.locator('.signup-form').getByRole('textbox', {name: 'Email Address'}).fill(userEmail)

    // 7. Click 'Signup' button
    await page.getByRole('button', {name: 'Signup'}).click()

    // 8. Verify error 'Email Address already exist!' is visible
    await expect(page.getByText("Email Address already exist!")).toBeVisible()


    await page.waitForTimeout(1000)
});

test('Test Case 6: Contact Us Form', async ({ page }) => {

    // 4. Click on 'Contact Us' button
    await page.getByRole('link', { name: ' Contact us' }).click()

    // 5. 5. Verify 'GET IN TOUCH' is visible
    await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible()

    // 6. Enter name, email, subject and message
    await page.locator('.contact-form').getByRole('textbox', {name: 'Name'}).fill(userName)
    await page.locator('.contact-form').getByRole('textbox', {name: 'Email'}).fill(userEmail)
    await page.locator('.contact-form').getByRole('textbox', {name: 'Subject'}).fill('This is Subject')
    await page.locator('.contact-form').getByRole('textbox', {name: 'Your Message Here'}).fill('This is Message.')

    // 7. Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('package.json')
    // await expect(page.locator('.upload-success')).toBeVisible()


    // 监听弹窗事件
    page.on('dialog', async dialog => {
        console.log(dialog.message()); // 打印弹窗文字：Press OK to proceed!
        await dialog.accept(); // 点击“确定”
    });

    // 8. Click 'Submit' button
    await page.getByRole('button', { name: 'Submit' }).click();

    // 9. Click OK button
    await page.locator('[data-qa="submit-button"]').click(); // 触发弹窗

    // 10. Verify success message 'Success! Your details have been submitted successfully.' is visible
    //<div class="status alert alert-success" style="display: block;">Success! Your details have been submitted successfully.</div>
    await expect(page.getByRole('textbox', {name: 'Success! Your details have been submitted successfully.'})).toBeVisible()
    

    await page.waitForTimeout(1000)
});