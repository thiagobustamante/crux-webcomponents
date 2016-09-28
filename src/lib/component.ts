"use strict";

export class Events {
	static addEvent(element: Element, eventName: string, value: string) {
		element.addEventListener(eventName, <EventListener>Function("event", value));
	}
	static dispatchSelectionEvent(child: Element, parent: Element) {
		let selectionEvent = new Event('selection');
		selectionEvent['selectedItem'] = child;	
		parent.dispatchEvent(selectionEvent);	
	}
	static dispatchSwapEvent(child: Element, parent: Element) {
		let swapEvent = new Event('swap');
		swapEvent['currentItem'] = child;	
		parent.dispatchEvent(swapEvent);	
	}
}

export class Attributes {
	static initAttribute(element: Element, attrName: string, defaultValue?) {
		const value = element.getAttribute(attrName);
		if (typeof value !== "undefined") {
			element['attributeChangedCallback'](attrName, null, value);
		}
		else if (typeof defaultValue !== "undefined") {
			element['attributeChangedCallback'](attrName, null, defaultValue);
		}
	}

}

