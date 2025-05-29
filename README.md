# Web Automation with PlaywrightJS
This repository contains Playwright Automation Tests for the DailyFinance application (`https://dailyfinance.roadtocareer.net/`). The goal is to automate key user flows, including registration, login, item management, profile updates, and password reset.

## Prerequisites

Before running the tests, ensure you have the following installed:

* **Node.js**: LTS version (recommended)
* **npm**: Node Package Manager (comes with Node.js)
* **Web Browsers**: Chromium (automatically installed by Playwright)
* **Java JRE/JDK**: Required for Allure Report generation.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name # Replace with your actual repo name
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    ```
    This will install Playwright, Faker.js, dotenv, allure-playwright, and any other packages listed in `package.json`.

3.  **Environment Variables:**
    Create a `.env` file in the root of your project and add necessary variables, such as:
    ```
    # .env
    email_prefix=testuser
    # Add your Gmail API access token here for email testing (if applicable)
    access_token=YOUR_GMAIL_API_ACCESS_TOKEN
    ```
    *Make sure to add `.env` to your `.gitignore` file to prevent it from being committed.*

4.  **Create a dummy image file:**
    For the profile photo upload test, please create a small `.png` or `.jpg` file (e.g., a 100x100 pixel image) and save it as `test-image.png` in the root of your project directory.

## How to Run Tests

To execute the automation suite, follow these steps:

1.  **Run all tests:**
    ```bash
    npx playwright test
    ```

2.  **Run tests in headed mode (browser visible):**
    ```bash
    npx playwright test --headed
    ```

3.  **Run a specific test file:**
    ```bash
    npx playwright test tests/testrunner.spec.js
    # or
    npx playwright test tests/dailyfinance.negative.spec.js # If you have a separate negative test file
    ```

## Allure Reports
#### 1. Overview 
![Screenshot 2025-05-29 232123](https://github.com/user-attachments/assets/b8d61ad2-8a8b-48f8-a6f2-a7983f957813)

#### 2. Behaviours 
![Screenshot 2025-05-29 232138](https://github.com/user-attachments/assets/2faed43f-8144-4d52-b62d-5a9f37381c3f)

##  Author

Mahbubur Rahman
