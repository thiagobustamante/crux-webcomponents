/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
/// <reference path="../../node_modules/@types/webdriverio/index.d.ts" />
import * as storyboard from "../lib/crux-storyboard";

const sb: storyboard.CruxStoryboard = 
<storyboard.CruxStoryboard>document.getElementsByTagName("crux-storyboard")[0];

describe("<crux-storyboard>", () => {

    it("should create a storyboard panel", () => {
	     let items = document.getElementsByTagName("crux-storyboard");
		 
		 expect(items).toBeDefined();
		 expect(items.length).toEqual(2);
    });
});

describe("CruxStoryboard element", () => {
    it("should be able to retrieve its items", () => {
		 expect(sb.items().length).toEqual(5);
		 expect(sb.items().item(1).innerHTML).toEqual("Item Teste 2");
    });
});

describe("CruxStoryboard Selection", () => {
	beforeEach(()=>{
	    sb.clearSelections();
	}); 
	
    it("should support 'multiple' item selection", (done) => {
		sb.selectionMode = "multiple";
		setTimeout(()=>{
			expect(sb.selectedItems().length).toEqual(0);

			let handler = (event) => {
				let firedBy: string =  event.selectedItem.id;
				expect(event.selectedItem.selected).toEqual(true);
				if (event.selectedItem.id === 'item1') {
					let item2: storyboard.CruxStoryboardItem = 
					<storyboard.CruxStoryboardItem>document.getElementById("item2");
					item2.click();
				}
				else {
					let selected = sb.selectedItems();
					expect(selected.length).toEqual(2);
					expect(['item1','item2']).toContain(selected.item(0).id);
					expect(['item1','item2']).toContain(selected.item(1).id);
					sb.removeEventListener('selection', handler, false);
					setTimeout(()=>{
						done();
					},1);
				}			
			};
			sb.addEventListener('selection', handler, false);
			let item: storyboard.CruxStoryboardItem = 
			<storyboard.CruxStoryboardItem>document.getElementById("item1");
			item.click();
		}, 1)
    });

    it("should use 'multiple' as default item selection", () => {
		sb.selectionMode = "invalid value";
		expect(sb.selectionMode).toEqual("multiple");
    });

    it("should support 'none' item selection", (done) => {
		sb.selectionMode = "none";
		expect(sb.selectedItems().length).toEqual(0);

		 let handler = (event) => {
			 fail("This element should not dispatch selection events with selectionMode = 'none'");
		 };
		 sb.addEventListener('selection', handler, false);
		 let item: storyboard.CruxStoryboardItem = 
		 <storyboard.CruxStoryboardItem>document.getElementById("item1");
		 
		 let clickHandler = (event) => {
			let selected = sb.selectedItems();
			expect(selected.length).toEqual(0);
			expect(item.selected).toEqual(false);
			sb.removeEventListener('selection', handler, false);
			item.removeEventListener('click', clickHandler, false);
			setTimeout(()=>{
				done();
			},1);
		 };

		 item.addEventListener('click', clickHandler, false);
		 item.click();
    });	

    it("should support 'single' item selection", (done) => {
		sb.selectionMode = "single";
		expect(sb.selectedItems().length).toEqual(0);

		 let handler = (event) => {
		 	expect(event.selectedItem.selected).toEqual(true);
			if (event.selectedItem.id === 'item1') {
				let item2: storyboard.CruxStoryboardItem = 
				<storyboard.CruxStoryboardItem>document.getElementById("item2");
				item2.click();
			}
			else {
				let selected = sb.selectedItems();
				expect(selected.length).toEqual(1);
				expect('item2').toEqual(selected.item(0).id);
				sb.removeEventListener('selection', handler, false);
				setTimeout(()=>{
					done();
				},1);
			}			
		 };
		 sb.addEventListener('selection', handler, false);
		 let item: storyboard.CruxStoryboardItem = 
		 <storyboard.CruxStoryboardItem>document.getElementById("item1");
		 item.click();
    });
});
