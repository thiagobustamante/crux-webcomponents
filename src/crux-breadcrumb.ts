'use strict';

import { Events } from './component';

export class CruxBreadcrumbItem extends HTMLLIElement {
    private breadcrumb: CruxBreadcrumb;

    constructor() {
        super();
        const self = this;
        // this.tabIndex = 0;
        this.addEventListener('click', function(event) {
            if (self.disabled || self.breadcrumb.disabled) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }
            // if (self.active) {

            // }
            // else {

            // }
            Events.dispatchEvent('selection', self.breadcrumb, [
                { name: 'selectedItem', value: this }
            ]);
        }, false);
        // Attributes.initAttribute(this, 'enabled', true);
    }

    get disabled(): boolean {
        return this.hasAttribute('disabled');
    }

    set disabled(value: boolean) {
        if (value) {
            this.setAttribute('disabled', '');
            } else {
            this.removeAttribute('disabled');
        }
    }

    get name(): string {
        return this.getAttribute('name');
    }

    get text(): string {
        return this.getAttribute('text');
    }

    get selected(): boolean {
        return this.classList.contains('crux-selected');
    }

    get active(): boolean {
        return (this === this.breadcrumb.activeItem);
    }

    attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
        if (/^on/.test(attrName)) {
            Events.addEvent(this, attrName.slice(2), newValue);
        }
    }

    adoptedCallback() {
        if (this.parentElement.tagName === 'CRUX-BREADCRUMB') {
            this.breadcrumb = <CruxBreadcrumb>this.parentElement;
        }
    }

    disconnectedCallback() {
        this.breadcrumb = null;
    }
}

export class CruxBreadcrumb extends HTMLOListElement {
    activeItem: CruxBreadcrumbItem;
    activateItemsOnSelection: boolean = true;
    collapsed: boolean;
    collapsible: boolean;
    removeInactiveItems: boolean;
    singleActivationModeEnabled: boolean;
    animationDuration: number;
    //    collapseAnimation: InOutAnimation;

    constructor() {
        super();
        // const onselection = this.getAttribute('onselection');
        // if (onselection) {
        //     Events.addEvent(this, 'selection', onselection);
        // }
        // this.enabled = (this.getAttribute('enabled') === 'false') ? false : true;
    }

    get disabled(): boolean {
        return this.hasAttribute('disabled');
    }

    set disabled(value: boolean) {
        if (value) {
            this.setAttribute('disabled', '');
            } else {
            this.removeAttribute('disabled');
        }
    }

    isSelected(): boolean {
        return this.classList.contains('crux-selected');
    }

    items() {
        return this.querySelectorAll(':scope > crux-breadcrumb-item');
    }
}

customElements.define('crux-breadcrumb-item', CruxBreadcrumbItem);
customElements.define('crux-breadcrumb', CruxBreadcrumb);
