import {type Page, type Locator} from '@playwright/test'
import { MainMenu } from './components/mainMenu'
import { DepartmentsMenu } from './components/deptMenu'
import { FooterMenu } from './components/footerMenu'
import {Footer} from '../pages/footer'

export class BasePage
{
    //variables
    private readonly page: Page

    //header
    readonly mainMenu: MainMenu
    readonly deptMenu: DepartmentsMenu
    private readonly logo: Locator
    private readonly userBtn: Locator
    private readonly cartBtn: Locator
    private readonly searchInput: Locator

    //footer
    readonly footerMenu: FooterMenu

    //constructor
    constructor(page: Page){
        this.page = page
        this.mainMenu = new MainMenu(this.page)
        this.deptMenu = new DepartmentsMenu(this.page)
        this.footerMenu = new FooterMenu(this.page)
    }

    //methods
}