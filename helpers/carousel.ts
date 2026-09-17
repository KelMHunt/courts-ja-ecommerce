import {type Locator} from '@playwright/test'


export interface Carousel
{
    //variables
    readonly container: Locator
    readonly prevBtn: Locator
    readonly nextBtn: Locator
    readonly item: Locator
    readonly image?: Locator| string
    readonly price?: Locator| string
    readonly title?: Locator| string
    readonly cta?: Locator


    //methods
    
    getCarouselItems(): Promise<Locator[]> ;
    moveUpCarousel(): Promise<void> ; 
    moveDownCarousel(): Promise<void> ;
    confirmCarouselItems(): Promise<boolean>;

}