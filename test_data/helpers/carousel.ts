import {type Locator} from '@playwright/test'


export interface Carousel
{
    //variables
    readonly container: Locator
    readonly prevBtn: Locator
    readonly nextBtn: Locator
    readonly item: Locator
    readonly image?: Locator
    readonly price?: Locator
    readonly title?: Locator
    readonly cta?: Locator


    //methods
    
    getCarouselItems(): Promise<string[]> ;
    moveUpCarousel(): Promise<boolean[]> ; 
    moveDownCarousel(): Promise<boolean[]> ;
    confirmCarouselItems(): Promise<boolean[]>;

}