// James Churcher
// 17/04/24

import { Page, TestInfo } from "@playwright/test";

//Helper methods that simplify funtions that are used regularly throughout the code

const screenshotPath = 'screenshots/'

export async function TakeAndAttachScreenshot(page :Page, testInfo :TestInfo, name :string, desc :string){
    const screenshot = await page.screenshot({ path: (screenshotPath+name+'.png'), fullPage: true });		//Take Screenshot
	await testInfo.attach(desc, { body: screenshot, contentType: 'image/png' });   //Attach Screenshot
}