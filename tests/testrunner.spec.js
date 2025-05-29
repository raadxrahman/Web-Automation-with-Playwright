import {test, expect} from '@playwright/test';
import {faker} from "@faker-js/faker";
import fs from 'fs';
import {config} from "dotenv";

config();

import RegistrationPage from "../pages/RegistrationPage.js";
import LoginPage from "../pages/LoginPage.js";
import ItemPage from "../pages/ItemPage.js";

import GmailService from '../service/gmail-service';

import UserData from "../utils/user-data.json" assert {type: "json"};
import ItemData from "../utils/item-data.json" assert {type: "json"};



// Test 01: User Registration, Toast Message & Email Confirmation Assertion
test('Test 01: User Registration, Toast Message & Email Confirmation Assertion', 
    async ({page, request}) => { // Visit the site and register a user
    
    await page.goto('/register'); // Navigate to the registration page
    const user = await new RegistrationPage(page).
    registerUser(process.env.email_prefix); // Register a new user with a unique email prefix

    await test.step("assert the toast message", async () => { // Assert that the toast message is displayed after registration
        await expect(page.getByText(`User ${user.firstName} ${user.lastName} registered`)).toBeVisible();
    });

    await test.step("assert the congratulation mail is sent", async () => { // Assert that the congratulation email is sent to the registered user
        await page.waitForTimeout(15000);
        const latestGmail = await GmailService.gmail(request);
        await expect(latestGmail.toString()).toEqual(`Dear ${user.firstName}, Welcome to our platform! We&#39;re excited to have you onboard. Best regards, Road to Career`);

        UserData.push(user); // Add the registered user to the UserData array
        fs.writeFileSync("./utils/user-data.json", JSON.stringify(UserData, null, 2)); // Save the updated UserData array to the JSON file
    });
});

// Test 02: User Login, Add Items and Assert Items Visibility on the Item List.
test('Test 02: User Login, Add Items and Assert Items Visibility on the Item List',
    async ({page}) => { // User Login, Add Items and Assert Items Visibility on the Item List
    
    await page.goto('/login'); 

    const latestUser = await UserData[UserData.length - 1]; // Get the latest registered user from UserData
    await new LoginPage(page).loginForm(latestUser.email, latestUser.password); // Log in with the latest user's credentials
    await expect(page.getByText('Dashboard')).toBeVisible() // Assert that the dashboard is visible after login

    await test.step("add random 2 items", async () => { // Add two random items to the item list
        while (ItemData.length > 0)
            ItemData.pop();

        const itemPage = await new ItemPage(page);
        await itemPage.addItem();
        await itemPage.addItem();
    });

    await test.step("assert that 2 items are showing on the item list", async () => { // Assert that the item list shows 2 items
        
        const searchBox = await page.getByRole('textbox', {name: 'Search items...'});
        
        await searchBox.fill(ItemData[0].itemName);
        await expect(page.getByText('Total Rows:')).toContainText("Total Rows: 1")
        await searchBox.clear();
        await searchBox.fill(ItemData[1].itemName);
        await expect(page.getByText('Total Rows:')).toContainText("Total Rows: 1")
    });
});

// Test 03: Navigating to Profile Settings, Uploading a Profile Picture, then Logging Out.
test('Test 03: Navigating to Profile Settings, Uploading a Profile Picture, then Logging Out', 
    async ({page}) => { // Navigating to Profile Settings, Uploading a Profile Picture, then Logging Out
    
    await page.goto('/login'); 

    const latestUser = await UserData[UserData.length - 1]; // Get the latest registered user from UserData

    await new LoginPage(page).loginForm(latestUser.email, latestUser.password); // Log in with the latest user's credentials
    await expect(page.getByText('Dashboard')).toBeVisible()

    await page.goto('/user'); // Navigate to the user profile page
    await page.getByRole('button', { name: 'account of current user' }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page.getByRole('heading', { name: 'User Details' })).toBeVisible()

    await page.getByRole('button', { name: 'Edit' }).click(); // Click the "Edit" button to enable profile editing
    await page.locator('input[type="file"]').setInputFiles(`${process.cwd()}\\resources\\sample.png`); // Upload a profile picture from the specified path
    await page.getByRole('button', { name: 'Upload Image' }).click();
    await page.waitForTimeout(5000);


    await page.getByRole('button', { name: 'account of current user' }).click(); // Click the user account button to open the user menu
    await page.getByRole('menuitem', { name: 'Logout' }).click(); // Click the "Logout" menu item to log out the user
});

// Test 04: Clicking on "Reset it here" From Login Page, Setting New Password.
test('Test 04: Clicking on "Reset it here" From Login Page, Setting New Password', 
    async ({page, request}) => { // Clicking on "Reset it here" From Login Page, Setting New Password
    
    await page.goto('/login'); 
    await page.getByRole('link', {name: 'Reset it here'}).click(); // Click the "Reset it here" link to navigate to the password reset page

    const latestUser = await UserData[UserData.length - 1]; // Get the latest registered user from UserData

    await page.getByRole('textbox', {name: 'Email'}).fill(latestUser.email); // Fill the email field with the latest user's email
    await page.getByRole('button', {name: 'Send Reset Link'}).click();

    const responseMessage = page.getByText('Password reset link sent to'); // Get the response message after clicking the "Send Reset Link" button

    await expect(responseMessage).toContainText("Password reset link sent to your email"); // Assert that the response message contains the expected text

    await test.step("reset new password", async () => { // Reset the password using the link sent to the user's email
        
        await page.waitForTimeout(15000);

        const latestGmail = await GmailService.gmail(request);
        const resetUrl = await latestGmail.slice(52, latestGmail.length); // Extract the reset URL from the latest email

        await page.goto(resetUrl);
        await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible()

        const newPassword = faker.internet.password(); // Generate a new random password using Faker.js

        await page.getByRole('textbox', { name: 'New Password' }).fill(newPassword);
        await page.getByRole('textbox', {name: 'Confirm Password'}).fill(newPassword);
        await page.getByRole('button', { name: 'Reset Password' }).click()
        await page.getByText('Password reset successfully')

        latestUser.password = newPassword;

        fs.writeFileSync('./utils/user-data.json', JSON.stringify(UserData, null, 2)); // Update the UserData array with the new password
        
        await page.waitForTimeout(4000);
    });

});

// Test 05: Login with Updated Password, Succesful Login Assertion.
test('Test 05: Login with Updated Password, Succesful Login Assertion.', 
    async ({page, request}) => { // Login with Updated Password, Succesful Login Assertion.

    await page.goto('/login'); // Navigate to the login page

    const latestUser = await UserData[UserData.length - 1]; // Get the latest registered user from UserData

    await new LoginPage(page).loginForm(latestUser.email, latestUser.password); // Log in with the latest user's updated credentials

    await expect(page.getByText('Dashboard')).toBeVisible() // Assert that the dashboard is visible after successful login

});

