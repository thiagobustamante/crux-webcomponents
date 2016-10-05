/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
/// <reference path="../../node_modules/@types/webdriverio/index.d.ts" />
"use strict";

import * as swapPanel from "../lib/crux-swap-panel";

describe("<crux-swap-panel>", () => {
    beforeAll(()=>{
        browser.url("http://localhost:8000/test/crux-swap-panel.html");
    });
    it("should create a swap panel", () => {
	     browser.elements("crux-swap-panel", (result)=>{
			expect(result).toBeDefined();
			expect(result.value).toEqual(1);
		 });
    });
});

// describe("CruxSwapPanel element", () => {
//     beforeAll(()=>{
//         browser.url("http://localhost:8000/test/crux-swap-panel.html");
//     });

//     it("should be able to retrieve its content", () => {
// 		 let ret = browser['timeoutsAsyncScript'](5000).
// 		 executeAsync((done)=>{
// 			 const sb = <swapPanel.CruxSwapPanel>document.getElementById('swapPanel')
// 			 done({
// 				 content: sb.currentElement.innerHTML
// 			 })
// 		 });
// 		expect(ret.value.content).toEqual("Inicial Element");
//     });
// });
