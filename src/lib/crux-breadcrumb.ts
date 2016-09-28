"use strict";

import {Events} from "./events";

export class CruxBreadcrumbItem extends HTMLLIElement {
    enabled: boolean;
    breadcrumb: CruxBreadcrumb;
    name: string;
    text:string
    
    createdCallback() {
		this.tabIndex = 0;
		this.addEventListener('click', function(event) {
			if (!this.enabled || !this.breadcrumb.enabled) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }
            if (this.isActive()) {

            }
            else {

            }
            Events.dispatchSelectionEvent(this, this.breadcrumb);
		}, false);
        this.enabled = (this.getAttribute('enabled') === 'false')?false:true;
	}

    isSelected(): boolean {
		return this.classList.contains("crux-selected");
    }

    isActive(): boolean {
        return (this === this.breadcrumb.activeItem);
    }

    attachedCallback() {
        if (this.parentElement.tagName === 'CRUX-BREADCRUMB') {
            this.breadcrumb = <CruxBreadcrumb>this.parentElement;
        }
    }

    detachedCallback() {
        this.breadcrumb = null;
    }
}


export class CruxBreadcrumb extends HTMLOListElement {
    enabled: boolean;
    activeItem: CruxBreadcrumbItem;
    activateItemsOnSelection: boolean = true;
    collapsed: boolean;
    collapsible: boolean;
    removeInactiveItems: boolean;
    singleActivationModeEnabled: boolean;
    animationDuration: number;
//    collapseAnimation: InOutAnimation;

	createdCallback() {
		let onselection = this.getAttribute('onselection');
		if (onselection) {
			Events.addEvent(this, 'selection', onselection);
		}
        this.enabled = (this.getAttribute('enabled') === 'false')?false:true;
	}

    isSelected(): boolean {
		return this.classList.contains("crux-selected");
    }

    attachedCallback() {
    }

    detachedCallback() {

    }

	items() {
		return this.querySelectorAll(':scope > crux-breadcrumb-item');
	}
}

window['CruxBreadcrumbItemElement'] = document['registerElement']('crux-breadcrumb-item', CruxBreadcrumbItem);
window['CruxBreadcrumbElement'] = document['registerElement']('crux-breadcrumb', CruxBreadcrumb);

