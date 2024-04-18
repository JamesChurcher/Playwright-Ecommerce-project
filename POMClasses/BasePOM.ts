//James Churcher
//18/04/24

import { Page } from "@playwright/test";

export default class BasePOM
{
    readonly page :Page;

    constructor(page :Page){
        this.page = page;
    }
}
