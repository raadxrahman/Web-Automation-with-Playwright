import fs from 'fs';
import {faker} from "@faker-js/faker";
import itemData from "../utils/item-data.json" assert {type: "json"};

class ItemPage {
    constructor(page) { // Initialize the ItemPage class with the Playwright page object

        this.page = page; // Store the page object for later use

        this.btnAddCost = page.getByRole('button', {name: 'Add Cost'});
        this.itemName = page.getByRole('textbox', {name: 'Item Name'});
        this.quantity = page.locator('div').filter({hasText: /^-\+$/}).getByRole('spinbutton');
        this.quantityPlusBtn = page.getByRole('button', {name: '+'});
        this.quantityMinusBtn = page.getByRole('button', {name: '-'});
        this.amountInpNum = page.getByRole('spinbutton', { name: 'Amount' })
        this.purchaseDate = page.getByRole('textbox', { name: 'Purchase Date' })
        this.month = page.getByLabel('Month')
        this.remarks = page.getByRole('textbox', { name: 'Remarks' })
        this.btnSubmit = page.getByRole('button', { name: 'Submit' })
    }

    async addItem() {

        const date = new Date(); // Get the current date

        let item = { // Create a new item object with random data

            itemName : faker.commerce.productName(),
            quantity:  Math.round(Math.random() * (10 - 1) + 1), // Random quantity between 1 and 10
            amount: Math.round(Math.random() * (1000 - 100) + 100), // Random amount between 100 and 1000
            purchaseDate : date.toISOString().slice(0, 10), // Format the date as YYYY-MM-DD
            month : date.toLocaleString('default', { month: 'short' }),
            remarks : faker.lorem.paragraph() // Random remarks using faker
        }

        await this.btnAddCost.click(); // Click the "Add Cost" button to open the item form
        await this.itemName.fill(item.itemName); // Fill the item name field with the generated item name

        for (let i = 0; i < item.quantity; i++) {
            await this.quantityPlusBtn.click();
        }
        
        await this.amountInpNum.fill(item.amount + "");
        await this.purchaseDate.fill(item.purchaseDate)
        await this.month.press(item.month.at(0))
        await this.remarks.fill(item.remarks)
        await this.btnSubmit.click();

        await itemData.push(item);
        await fs.writeFileSync('./utils/item-data.json', JSON.stringify(itemData, null, 2));
    }
}

export default ItemPage;