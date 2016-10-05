/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
/// <reference path="../../node_modules/@types/webdriverio/index.d.ts" />
"use strict";

import * as storyboard from "../lib/crux-storyboard";


describe("<crux-storyboard>", () => {
	beforeAll(()=>{
		browser.url("http://localhost:8000/test/crux-storyboard.html");
	});
    it("should create a storyboard panel", () => {
	     browser.elements("crux-storyboard", (result)=>{
			expect(result).toBeDefined();
			expect(result.value).toEqual(2);
		 });
    });
});


describe("CruxStoryboard element", () => {
	beforeAll(()=>{
		browser.url("http://localhost:8000/test/crux-storyboard.html");
	});
    it("should be able to retrieve its items", () => {
		 let ret = browser['timeoutsAsyncScript'](5000).
		 executeAsync((done)=>{
			 const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD')
			 done({
				 size: sb.items().length,
				 item1HTML: sb.items().item(1).innerHTML
			 })
		 });
		expect(ret.value.size).toEqual(5);
		expect(ret.value.item1HTML).toEqual("Item Teste 2");
    });
});

describe("CruxStoryboard Selection", () => {
	beforeAll(()=>{
		browser.url("http://localhost:8000/test/crux-storyboard.html");
	});
	beforeEach(()=>{
	    browser.execute(()=>{
			const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD')
			sb.clearSelections();
			return true;
		});
	});
		
    it("should support 'multiple' item selection", (done) => {
		 let ret = browser['timeoutsAsyncScript'](5000).
		 executeAsync((done)=>{
			const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD')
			sb.selectionMode = "multiple";
			let countAfterSelectionModeChange = sb.selectedItems().length;
			let chooseItemisSelected = false;
			 
			setTimeout(()=>{
				let handler = (event) => {
					chooseItemisSelected = event.selectedItem.selected;
					if (event.selectedItem.id === 'item1') {
						let item2: storyboard.CruxStoryboardItem = 
						<storyboard.CruxStoryboardItem>document.getElementById("item2");
						item2.click();
					}
					else {
						let selected = sb.selectedItems();
						sb.removeEventListener('selection', handler, false);
						setTimeout(()=>{
							done({
								countAfterSelectionModeChange: countAfterSelectionModeChange,
								chooseItemisSelected: chooseItemisSelected,
								totalItemsSleceted: selected.length,
								item1Selected : (['item1','item2'].indexOf(selected.item(0).id) >= 0),
								item2Selected : (['item1','item2'].indexOf(selected.item(1).id) >= 0)
							});
						},1);
					}			
				};
				sb.addEventListener('selection', handler, false);
				let item: storyboard.CruxStoryboardItem = 
				<storyboard.CruxStoryboardItem>document.getElementById("item1");
				item.click();
			}, 1);			 
		 });
		expect(ret.value.countAfterSelectionModeChange).toEqual(0);
		expect(ret.value.chooseItemisSelected).toEqual(true);
		expect(ret.value.totalItemsSleceted).toEqual(2);
		expect(ret.value.item1Selected).toEqual(true);
		expect(ret.value.item2Selected).toEqual(true);

    });

    it("should use 'multiple' as default item selection", () => {
	    let ret = browser.execute(()=>{
			const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD')
			sb.selectionMode = "invalid value";
			return sb.selectionMode;
		});
		expect(ret['value']).toEqual("multiple");

    });

    it("should support 'none' item selection", (done) => {
		 let ret = browser['timeoutsAsyncScript'](5000).
		 executeAsync((done)=>{
			const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD')
			sb.selectionMode = "none";
			let countAfterSelectionModeChange = sb.selectedItems().length;
			let selectionExecuted = false;
			 
			setTimeout(()=>{
				let handler = (event) => {
					selectionExecuted = true;
				};
				sb.addEventListener('selection', handler, false);
				let item: storyboard.CruxStoryboardItem = 
				<storyboard.CruxStoryboardItem>document.getElementById("item1");
				
				let clickHandler = (event) => {
					let selected = sb.selectedItems();
					sb.removeEventListener('selection', handler, false);
					item.removeEventListener('click', clickHandler, false);
					setTimeout(()=>{
						done({
							countAfterSelectionModeChange: countAfterSelectionModeChange,
							totalItemsSleceted: selected.length,
							itemSelected: item.selected,
							selectionExecuted: selectionExecuted
						});
					},1);
				};

				item.addEventListener('click', clickHandler, false);
				item.click();
			}, 1);			 
		 });
		expect(ret.value.countAfterSelectionModeChange).toEqual(0);
		expect(ret.value.selectionExecuted).toEqual(false);
		expect(ret.value.totalItemsSleceted).toEqual(0);
		expect(ret.value.itemSelected).toEqual(false);
    });	

    it("should support 'single' item selection", (done) => {
		 let ret = browser['timeoutsAsyncScript'](5000).
		 executeAsync((done)=>{
			const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD')
			sb.selectionMode = "single";
			let countAfterSelectionModeChange = sb.selectedItems().length;
			let chooseItemisSelected = false;
			 
			setTimeout(()=>{
				let handler = (event) => {
					chooseItemisSelected = event.selectedItem.selected;
					if (event.selectedItem.id === 'item1') {
						let item2: storyboard.CruxStoryboardItem = 
						<storyboard.CruxStoryboardItem>document.getElementById("item2");
						item2.click();
					}
					else {
						let selected = sb.selectedItems();
						sb.removeEventListener('selection', handler, false);
						setTimeout(()=>{
							done({
								countAfterSelectionModeChange: countAfterSelectionModeChange,
								chooseItemisSelected: chooseItemisSelected,
								totalItemsSleceted: selected.length,
								item2Selected : 'item2' === selected.item(0).id,
							});
						},1);
					}			
				};
				sb.addEventListener('selection', handler, false);
				let item: storyboard.CruxStoryboardItem = 
				<storyboard.CruxStoryboardItem>document.getElementById("item1");
				item.click();
			}, 1);			 
		 });
		expect(ret.value.countAfterSelectionModeChange).toEqual(0);
		expect(ret.value.chooseItemisSelected).toEqual(true);
		expect(ret.value.totalItemsSleceted).toEqual(1);
		expect(ret.value.item2Selected).toEqual(true);
    });
});
