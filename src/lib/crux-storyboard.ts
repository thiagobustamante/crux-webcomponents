/// <reference path="./definitions.d.ts" />
"use strict";

import {Events} from "./events";

export class CruxStoryboardItem extends HTMLDivElement {
	createdCallback() {
		this.tabIndex = 0;
		this.addEventListener('click', function(event) {
			toggleSelection(this, <CruxStoryboard>this.parentElement);
		}, false);
		
	    this.style.display = "inline-table";
	}

    isSelected(): boolean {
		return this.classList.contains("crux-selected");
    }

    attachedCallback() {
		configHeightWidth(this, <CruxStoryboard>this.parentElement);
    }

    detachedCallback() {

    }
}

export enum SelectionMode{none, multiple, single}

export class CruxStoryboard extends HTMLDivElement {
    itemHeight: string;
    itemWidth: string; 
    fixedHeight: boolean;
    fixedWidth: boolean;
	selectionMode: SelectionMode = SelectionMode.multiple;

    createdCallback() {
		this.itemHeight = this.getAttribute('itemHeight');
		this.itemWidth = this.getAttribute('itemWidth');
		if (DEVICE_SIZE === 'small') {
			if (!this.itemHeight) {
				this.itemHeight = '75px';
			}
			if (!this.itemWidth) {
				this.itemWidth = '100%';
			}
		}
		else {
			if (!this.itemHeight) {
				this.itemHeight = '200px';
			}
			if (!this.itemWidth) {
				this.itemWidth = '200px';
			}
		}

		this.fixedHeight = (this.getAttribute('fixedHeight') === 'false')?false:true;
		this.fixedWidth = (this.getAttribute('fixedWidth') === 'false')?false:true;
		let horizontalAlignment = this.getAttribute('horizontalAlignment');
		if (horizontalAlignment) {
			this.attributeChangedCallback('horizontalAlignment', null, horizontalAlignment);
		}		
		let selectionMode = this.getAttribute('selectionMode');
		if (selectionMode) {
			this.selectionMode = SelectionMode[selectionMode];
		}		
		let onselection = this.getAttribute('onselection');
		if (onselection) {
			Events.addEvent(this, 'selection', onselection);
		}
		this.style.display = "block";		
    }
 
    attributeChangedCallback(attrName: string, oldValue, newValue) {
        if (attrName === 'horizontalAlignment') {
            this.style.textAlign = newValue;
        }
        else if (attrName === 'itemHeight' 
		    || attrName === 'itemWidth' 
		    || attrName === 'fixedHeight'
			|| attrName === 'fixedWidth') {
			this[attrName] = newValue;
			this.configHeightWidth();
        }
		else if (attrName === 'selectionMode') {
			this.selectionMode = SelectionMode[<string>newValue];
			this.clearSelections();
		}
    }

    isSelected(index: number): boolean {
		return this.items().item(index).classList.contains("crux-selected");
    }

	setSelected(selected: boolean, index: number) {
		if (this.selectionMode === SelectionMode.single) {
			this.clearSelections();
			if (selected) {
				this.items().item(index).classList.toggle("crux-selected");
			}
		}
		else {
			this.items().item(index).classList.toggle("crux-selected");
		} 
    }

	clearSelections() {
		const selectedItems = this.selectedItems();
		const length = selectedItems.length;
		for(let i = 0; i < length; i++) {
			selectedItems.item(i) .classList.remove("crux-selected");
		}
	}

	items() {
		return this.querySelectorAll(':scope > crux-storyboard-item');
	}

	selectedItems() {
		return this.querySelectorAll(':scope > crux-storyboard-item[class*="crux-selected"]');
	}

	protected configHeightWidth() {
		let items = this.items();
		let length = items.length;
		for (let i = 0; i < length; i++) {
			let item = items.item(i);
			configHeightWidth(<CruxStoryboardItem>item, this);
		}
	}
}

function toggleSelection(child: CruxStoryboardItem, parent: CruxStoryboard) {
	if (parent.selectionMode !== SelectionMode.none) {
		if (parent.selectionMode === SelectionMode.single && !child.isSelected()) {
			parent.clearSelections();
		}
		child.classList.toggle("crux-selected");
		setTimeout(()=>{
			Events.dispatchSelectionEvent(child, parent);
		}, 1);
	}	
}

function configHeightWidth(child: HTMLElement, parent: CruxStoryboard) {
	if (parent.itemHeight) {
		if(parent.fixedHeight) {
			child.style.height = parent.itemHeight;
		}
		else {
			child.style.minHeight = parent.itemHeight;
		}
	}
	
	if (parent.itemWidth) {
		if(parent.fixedWidth) {
			child.style.width = parent.itemWidth;
		}
		else {
			child.style.minWidth = parent.itemWidth;
		}
	}
}
window['CruxStoryboardItemElement'] = document['registerElement']('crux-storyboard-item', CruxStoryboardItem);
window['CruxStoryboardElement'] = document['registerElement']('crux-storyboard', CruxStoryboard);
