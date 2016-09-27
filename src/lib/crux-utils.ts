"use strict";

export class Utils {
	static addEvent(element: HTMLElement, eventName: string, value: string) {
		element.addEventListener(eventName, <EventListener>Function("event", value));
	}
	static dispatchSelectionEvent(child: HTMLElement, parent: HTMLElement) {
		let selectionEvent = new Event('selection');
		selectionEvent['selectedItem'] = child;	
		parent.dispatchEvent(selectionEvent);	
	}
}

