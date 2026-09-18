# Courts Ecommerce Test Automation Project

## Description:
* Welcome! My name is Kelcy M Hunter and this is my personal project using Playwright to automate software testing of the e2e userflow of a locally based real-world ecommerce web application (Courts JA).

## Features:
1. Milestone 1: 
    * Header & Footer Navigation
    * Home Page
2. Milestone 2: 
    * Search Navigation
    * Product Listing Page (PLP)
3. Milestone 3:
    * Product Detail Page
    * Cart
4. Milestone 4:
    * Account
    * Checkout

## Requirements:
* Node JS - verson 11.12.1 or higher
* IDE (eg VS Code)
* Playwright - version 1.62.0 or higher
* Typescript - version 7.0.2 or higher

## Installation:
1. **Clone git repository on your local machine** *(preferrably using SSH):* `git clone git@github.com:KelMHunt/courts-ja-ecommerce.git`. 
    * If not already set up with SSH, see easy set up instructions here: [https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account] 

2. **Enter the git project:** `cd courts-ja-ecommerce`

3. **Install dependencies:**
    * (i) Download NodeJS for your machine -- [https://nodejs.org/en/download]
    * (ii) Run `npm -version` in VS Code terminal to verify successful download
    * (iii) Run `npm install typescript`
    * (iv) Run `npm init playwright@latest`

4. **Test Instructions:**
    * Regression: `npm run test:regression`
    * Specific test: `npm run test {filename.spec.ts}`
    * Headed mode: add `--headed` to the test command in terminal to visually view test execution. *Note tests run headlessly by default.*


