"use strict";

export class Events {
	static addEvent(element: Element, eventName: string, value: string) {
		element.addEventListener(eventName, <EventListener>Function("event", value));
	}
	static dispatchEvent(name: string, targetElement: Element, 
									properties?:Array<EventProperty>) {
		let targetEvent = new Event(name);
		if (properties) {
			properties.forEach((property)=>{
				targetEvent[property.name] = property.value;	
			});
		}
		targetElement.dispatchEvent(targetEvent);	
	}
}

export interface EventProperty {
	name: string;
	value: any;
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

