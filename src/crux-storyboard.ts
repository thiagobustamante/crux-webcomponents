/// <reference path='./definitions.d.ts' />
'use strict';

import { Events } from './component';

export class CruxStoryboardItem extends HTMLElement {
    private initialized = false;

    constructor() {
        super();
        this.addEventListener('click', function(event) {
            toggleSelection(<CruxStoryboardItem>this, <CruxStoryboard>this.parentElement);
        }, false);

    }

    get selected(): boolean {
        return this.classList.contains('crux-selected');
    }

    connectedCallback() {
        if (!this.initialized) {
            this.tabIndex = 0;
            this.style.display = 'inline-table';
            this.initialized = true;
        }
        configHeightWidth(this, <CruxStoryboard>this.parentElement);
    }
}

enum SelectionMode { none, multiple, single }

export class CruxStoryboard extends HTMLElement {
    static get observedAttributes() {
        return ['itemheight', 'itemwidth', 'floatingheight',
                'floatingwidth', 'selectionmode', 'horizontalalignment',
                'onselection', 'width', 'height'];
    }
    private initialized = false;

    connectedCallback() {
        if (!this.initialized) {
            if (DEVICE === 'phone') {
                if(!this.itemHeight) {
                    this.itemHeight = '75px';
                }
                if(!this.itemWidth) {
                    this.itemWidth = '100%';
                }
            } else {
                if(!this.itemHeight) {
                    this.itemHeight = '200px';
                }
                if(!this.itemWidth) {
                    this.itemWidth = '200px';
                }
            }
            this.style.display = 'block';
            this.initialized = true;
        }
        configHeightWidth(this, <CruxStoryboard>this.parentElement);
    }

    get itemHeight(): string {
        return this.getAttribute('itemheight');
    }

    set itemHeight(value: string) {
        this.setAttribute('itemheight', value);
    }

    get itemWidth(): string {
        return this.getAttribute('itemwidth');
    }

    set itemWidth(value: string) {
        this.setAttribute('itemwidth', value);
    }

    get floatingHeight(): boolean {
        return this.hasAttribute('floatingheight');
    }

    set floatingHeight(value: boolean) {
        if (value) {
            this.setAttribute('floatingheight', '');
            } else {
            this.removeAttribute('floatingheight');
        }
    }

    get floatingWidth(): boolean {
        return this.hasAttribute('floatingwidth');
    }

    set floatingWidth(value: boolean) {
        if (value) {
            this.setAttribute('floatingwidth', '');
            } else {
            this.removeAttribute('floatingwidth');
        }
    }

    get selectionMode(): string {
        return this.getAttribute('selectionmode');
    }

    set selectionMode(value: string) {
        this.setAttribute('selectionmode', (value in SelectionMode ? value : 'multiple'));
    }

    get horizontalAlignment(): string {
        return this.style.textAlign;
    }

    set horizontalAlignment(value: string) {
        this.style.textAlign = value;
    }

    get width(): string {
        return this.style.width;
    }

    set width(value: string) {
        this.style.width = value;
    }

    get height(): string {
        return this.style.height;
    }

    set height(value: string) {
        this.style.height = value;
    }

    attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
        if (/^on/.test(attrName)) {
            Events.addEvent(this, attrName.slice(2), newValue);
        } else if (attrName === 'selectionmode') {
            this.clearSelections();
        } else if (attrName === 'horizontalalignment') {
            this.horizontalAlignment = newValue;
        } else if (attrName === 'width') {
            this.width = newValue;
        } else if (attrName === 'height') {
            this.height = newValue;
        } else {
            this.configHeightWidth();
        }
    }

    isSelected(index: number): boolean {
        return this.items().item(index).classList.contains('crux-selected');
    }

    setSelected(selected: boolean, index: number) {
        if (this.selectionMode === 'single') {
            this.clearSelections();
            if (selected) {
                this.items().item(index).classList.toggle('crux-selected');
            }
        } else if (this.selectionMode !== 'none') {
            this.items().item(index).classList.toggle('crux-selected');
        }
    }

    clearSelections() {
        const selectedItems = this.selectedItems();
        const length = selectedItems.length;
        for (let i = 0; i < length; i++) {
            selectedItems.item(i).classList.remove('crux-selected');
        }
    }

    items() {
        return this.querySelectorAll(':scope > crux-storyboard-item');
    }

    selectedItems() {
        return this.querySelectorAll(':scope > crux-storyboard-item[class*=\'crux-selected\']');
    }

    protected configHeightWidth() {
        const items = this.items();
        const length = items.length;
        for (let i = 0; i < length; i++) {
            const item = items.item(i);
            configHeightWidth(<CruxStoryboardItem>item, this);
        }
    }
}

function toggleSelection(child: CruxStoryboardItem, parent: CruxStoryboard) {
    if (parent.selectionMode !== 'none') {
        if (parent.selectionMode === 'single' && !child.selected) {
            parent.clearSelections();
        }
        child.classList.toggle('crux-selected');
        setTimeout(() => {
            Events.dispatchEvent('selection', parent, [
                { name: 'selectedItem', value: child }
            ]);
        }, 1);
    }
}

function configHeightWidth(child: HTMLElement, parent: CruxStoryboard) {
    if (parent.itemHeight) {
        if (parent.floatingHeight) {
            child.style.minHeight = parent.itemHeight;
        } else {
            child.style.height = parent.itemHeight;
        }
    }

    if (parent.itemWidth) {
        if (parent.floatingWidth) {
            child.style.minWidth = parent.itemWidth;
        } else {
            child.style.width = parent.itemWidth;
        }
    }
}

customElements.define('crux-storyboard-item', CruxStoryboardItem);
customElements.define('crux-storyboard', CruxStoryboard);

// (<any>window)['CruxStoryboardItemElement'] = (<any>document).registerElement('crux-storyboard-item', CruxStoryboardItem);
// (<any>window)['CruxStoryboardElement'] = (<any>document).registerElement('crux-storyboard', CruxStoryboard);
