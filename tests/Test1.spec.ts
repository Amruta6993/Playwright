const { test, expect, chromium } = require('@playwright/test');


const capabilities = {
    'browserName': 'Chrome',
    'browserVersion': 'latest',
    'LT:Options': {
        'platform': 'Windows 10',
        'build': 'Playwright Sample Build',
        'name': 'Playwright Sample Test',
        // 'user': process.env.LT_USERNAME,
        // 'accessKey': process.env.LT_ACCESS_KEY,
        'user': 'amruta.tapadiya6993',
        'accessKey': 'Nw2j0UWvQkcyU44LkJteT3wjEAFdq5ev22qYJIHGcsKfvkUlA0',
        'network': true,
        'video': true,
        'console': true
    }
};

test('Scenario 1', async ({ }) => {
    // Step 1: Open LambdaTest Selenium Playground
    const browser = await chromium.connect(`wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.lambdatest.com/selenium-playground/', { waitUnitl: 'load', timeout: 120000 });

    // Step 2: Click “Simple Form Demo”
    await page.click('text=Simple Form Demo');

    // Step 3: Validate that the URL contains “simple-form-demo”
    const url = page.url();
    if (!url.includes('simple-form-demo')) {
        console.error('URL does not contain "simple-form-demo"');
        await browser.close();
        return;
    }

    // Step 4: Create a variable for a string value
    const message = 'Welcome to LambdaTest';

    // Step 5: Use this variable to enter values in the “Enter Message” text box
    await page.fill('#user-message', message);

    // Step 6: Click “Get Checked Value”
    await page.click('#showInput');

    // Step 7: Validate whether the same text message is displayed
    const displayedMessage = await page.textContent('#message');
    if (displayedMessage.trim() === message) {
        console.log('Test passed: The message is displayed correctly.');
    } else {
        console.error('Test failed: The message is not displayed correctly.');
    }

    await browser.close();
});

test('Scenario 2: Drag & Drop Sliders - Set value to 95', async ({ }) => {

    const browser = await chromium.connect(`wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`);
    const context = await browser.newContext();
    const page = await context.newPage();

    // Step 1: Open the LambdaTest Selenium Playground page
    await page.goto('https://www.lambdatest.com/selenium-playground/', { waitUntil: 'load', timeout: 120000 });

    // Step 2: Click “Drag & Drop Sliders”
    await page.click('text=Drag & Drop Sliders');

    // Step 3: Validate that the URL contains “drag-drop-range-sliders-demo”
    await expect(page).toHaveURL(/.*drag-drop-range-sliders-demo/);

    // Step 4: Select the slider “Default value 15” and drag the bar to make it 95
    const slider = page.locator('//input[@type="range" and  @value="15"]');
    const rangeValue = page.locator('#rangeSuccess'); // Assuming the range value element has this ID

    slider.focus();

    while (await rangeValue.textContent() !== '95') {
        await slider.press('ArrowRight');
    }

    // for (let i = 15; i <= 95; i++) {await slider.press('ArrowRight'); }

    // Step 5: Validate whether the range value shows 95
    await expect(rangeValue).toHaveText('95');
});

test('Scenario 3: Input Form Submit - Validate Error and Success Messages', async ({ }) => {

    const browser = await chromium.connect(`wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`);
    const context = await browser.newContext();
    const page = await context.newPage();

    // Step 1: Open the LambdaTest Selenium Playground page
    await page.goto('https://www.lambdatest.com/selenium-playground/', { waitUntil: 'load', timeout: 120000 });

    // Step 2: Click “Input Form Submit”
    await page.click('text=Input Form Submit');

    // Step 3: Validate that the URL contains “input-form-demo”
    await expect(page).toHaveURL(/.*input-form-demo/);

    page.on('dialog', async alert => {

        const text = alert.message();
        console.log(text);
    });

    // Step 4: Click “Submit” without filling in any information in the form
    await page.click('(//button[@type="submit"])[2]');

    // Step 5: Assert “Please fill out this field.” error message
    const nameField = page.locator('input[name="name"]');
    await expect(nameField).toHaveAttribute('required', '');

    // Step 6: Fill in Name, Email, and other fields
    await nameField.fill('John Doe');
    await page.fill('#inputEmail4', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="company"]', 'Example Inc.');
    await page.fill('input[name="website"]', 'https://example.com');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="address_line1"]', '123 Main St');
    await page.fill('input[name="address_line2"]', 'Suite 100');
    await page.fill('#inputState', 'NY');
    await page.fill('input[name="zip"]', '10001');

    // Step 7: From the Country drop-down, select “United States” using the text property
    await page.selectOption('select[name="country"]', { label: 'United States' });

    // Step 8: Fill in all fields and click “Submit”
    await page.click('(//button[@type="submit"])[2]');

    // Step 9: Validate the success message “Thanks for contacting us, we will get back to you shortly.” on the screen
    const successMessage = page.locator('//p[@class="success-msg hidden"]');
    await expect(successMessage).toHaveText('Thanks for contacting us, we will get back to you shortly.');
});
