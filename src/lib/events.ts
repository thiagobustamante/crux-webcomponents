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

