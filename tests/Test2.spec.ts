import { chromium, expect, test } from '@playwright/test';


const capabilities = {
    'browserName': 'Chrome',
    'browserVersion': 'latest',
    'LT:Options': {
        'platform': 'Linux',
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

test('Scenario 1', async () => {
    // Step 1: Open LambdaTest Selenium Playground
    const browser = await chromium.connect(`wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.lambdatest.com/selenium-playground/', { waitUntil: 'load', timeout: 200000 });

    await page.getByRole('link', { name: 'Simple Form Demo' }).click();
    await expect(page.url()).toContain("simple-form-demo");
    const inputText = "Welcome to LambdaTest";
    await page.getByPlaceholder('Please enter your Message').fill(inputText);
    await page.locator('//button[@id="showInput"]').click();
    await page.waitForSelector('//p[@id="message"]')
    const messageText = await page.locator('//p[@id="message"]').textContent()
    try {
        expect(messageText).toEqual(inputText)
        // Mark the test as completed or failed
        await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Test scenario 1 passed' } })}`)
    } catch (e) {
        await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.stack } })}`)
        throw e;
    }
    await browser.close();
});

test('Scenario 2: Drag & Drop Sliders - Set value to 95', async () => {

    const browser = await chromium.connect(`wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`);
    const context = await browser.newContext();
    const page = await context.newPage();

    // Step 1: Open the LambdaTest Selenium Playground page
    await page.goto('https://www.lambdatest.com/selenium-playground/', { waitUntil: 'load', timeout: 200000 });

    const target = '95';
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

    try {
        let value = await page.locator('//output[@id="rangeSuccess"]').textContent()
        expect(value).toEqual(target)
        // Mark the test as completed or failed
        await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Test scenario 2 passed' } })}`)
    } catch (e) {
        await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.stack } })}`)
        throw e
    }
});

test('Scenario 3: Input Form Submit - Validate Error and Success Messages', async () => {

    const browser = await chromium.connect(`wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`);
    const context = await browser.newContext();
    const page = await context.newPage();

    // Step 1: Open the LambdaTest Selenium Playground page
    await page.goto('https://www.lambdatest.com/selenium-playground/', { waitUntil: 'load', timeout: 200000 });

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

    try {
        expect(successMessage).toHaveText('Thanks for contacting us, we will get back to you shortly.')
        // Mark the test as completed or failed
        await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Test scenario 3 passed' } })}`)
    } catch (e) {
        await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.stack } })}`)
        throw e
    }
});
