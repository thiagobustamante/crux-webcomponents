/// <reference path="./definitions.d.ts" />
/// <reference path="./animate.d.ts" />
"use strict";

import {Attributes, Events} from "./component";
import {SwapAnimation, SwapAnimationOrder} from "./swap-animations";

export class CruxSwapPanel extends HTMLDivElement {
	private animating: boolean;
	animationDuration: number;
	animationDisabled: boolean;
	contentPanel: HTMLDivElement;
	currentPanel: HTMLDivElement;
	nextPanel: HTMLDivElement;
	animation: string;
	animationOrder: string;
	height: string = "auto";
	_fitToChildrenHeight: boolean;
	
	private static template: HTMLTemplateElement = CruxSwapPanel.getTemplate();

	private static getTemplate() {
		const template: HTMLTemplateElement = document.createElement("template");
		template.innerHTML = require("./crux-swap-panel.template.html");
		const cssTag: HTMLStyleElement = document.createElement("style");
		cssTag['language'] = "text/css";
		cssTag.innerText = require("./crux-swap-panel.template.css");
		template.content.appendChild(cssTag);
		return template;
	}

	createdCallback() {
		let shadow = this['createShadowRoot']();
		var clone = document.importNode(CruxSwapPanel.template.content, true);
		shadow.appendChild(clone);

		this.currentPanel = <HTMLDivElement>shadow.getElementById('currentPanel');
		this.nextPanel = <HTMLDivElement>shadow.getElementById('nextPanel');

		Attributes.initAttribute(this, 'fitToChildrenHeight', true);
		Attributes.initAttribute(this, 'animationDuration');
		Attributes.initAttribute(this, 'animationDisabled', false);
		Attributes.initAttribute(this, 'animation', 'slideLeft');
		Attributes.initAttribute(this, 'animationOrder', 'parallel');
		Attributes.initAttribute(this, 'width');
		let onswap = this.getAttribute('onswap');
		if (onswap) {
			Events.addEvent(this, 'swap', onswap);
		}
		if (this.fitToChildrenHeight) {
			this.updateHeight(this.currentPanel);		
		}
		else {
			Attributes.initAttribute(this, 'height');
		}
	}

    attributeChangedCallback(attrName: string, oldValue, newValue) {
        if (attrName === 'animationDisabled') {
			this.animationDisabled = (newValue === 'true' || newValue === true);
        }
        else if (attrName === 'animationDuration') {
			this.animationDuration = parseInt(newValue);
        }
        else if (attrName === 'animation') {
			this.animation = newValue;
        }
        else if (attrName === 'width') {
			this.style.width = newValue;
        }
        else if (attrName === 'height') {
			this.style.height = newValue;
        }
        else if (attrName === 'animationOrder') {
			this.animationOrder = newValue;
        }
		else if (attrName === 'fitToChildrenHeight') {
			this.fitToChildrenHeight = (newValue === 'true' || newValue === true);
        }
	}

	clear() {
		this.clearCurrentPanel();
		this.clearNextPanel();
	}

	get currentElement(): HTMLElement {
		return <HTMLElement>this.currentPanel.firstElementChild;
	}

	set currentElement(element: HTMLElement) {
		if (element) {
			if (this.animating) {
				this.completeAnimation();
			}
			this.clearCurrentPanel();
			this.currentPanel.appendChild(element);
			if (this.fitToChildrenHeight) {
				this.updateHeight(element);
			}
		}
		this.currentPanel.firstElementChild;
	}

	get fitToChildrenHeight() {
		return this._fitToChildrenHeight;
	}

	set fitToChildrenHeight(value: boolean) {
		if (!this.fitToChildrenHeight && value){
			this.updateChildrenHeights(true);
		}
		else if (!value) {
			this.updateChildrenHeights(false);
		}		
		this._fitToChildrenHeight = value;
	}

	swapTo(target: HTMLElement, options?: SwapOptions) {
		if (!this.animating) {
			this.animating = true;
			this.clearNextPanel();
			this.nextPanel.appendChild(target);

			let animationEnabled = !this.animationDisabled;
			if (options) {
				if (options.animationDisabled === true){
					animationEnabled = false;
				}
				else if (options.animationDisabled === false){
					animationEnabled = true;
				}
			}
			if (animationEnabled) {
				const animation = (options && options.animation)
												? options.animation : this.animation;
				const animationOrder =  (options && options.animationOrder) 
												? SwapAnimationOrder[options.animationOrder]
												: SwapAnimationOrder[this.animationOrder];
				const duration =  (options && options.animationDuration) 
												? options.animationDuration : this.animationDuration;
				
				let self = this;
				SwapAnimation.animate(this.nextPanel, this.currentPanel, {
					swapAnimation: animation,
					order: animationOrder,
					duration: duration,
					onInElementCompleted(inElement: HTMLElement) {
						inElement.style.display = 'none';
					},
					onInElementBeforeEntrance(inElement: HTMLElement) {
						inElement.style.display = 'block';
						inElement.style.top = '0px';
					},
					onOutElementCompleted(outElement: HTMLElement) {
						outElement.style.display = 'block';
					},
					onOutElementBeforeEntrance(outElement: HTMLElement) {
						outElement.style.display = 'none';
						outElement.style.top = '0px';
					}, 
					onCompleted() {
						if (self.fitToChildrenHeight) {
							self.updateHeight(target);
						}
						self.completeAnimation(options?options.onCompleted:null);
					}
				});
			}
			else {
				if (this.fitToChildrenHeight) {
					this.updateHeight(target);
				}
				this.completeAnimation(options?options.onCompleted:null);
			}
		}
	}

    attachedCallback() {
    }

    detachedCallback() {
    }
	
	private updateHeight(element) {
		setTimeout(()=>{
			this.style.height = element.offsetHeight + "px";
		},1);
	}

	private updateChildrenHeights(auto: boolean) {
		if (auto) {
			this.currentPanel.style.height = "auto";
			this.currentPanel.style.overflow = "";
			this.nextPanel.style.height = "auto";
			this.nextPanel.style.overflow = "";
		}
		else{
			setTimeout(()=>{
				const styles = window.getComputedStyle(this);
				const padding = parseFloat(styles.paddingTop) +
								parseFloat(styles.paddingBottom);
				const height = this.clientHeight - padding;
				this.currentPanel.style.maxHeight = height + "px";
				this.currentPanel.style.overflow = "scroll";
				this.nextPanel.style.maxHeight = height + "px";
				this.nextPanel.style.overflow = "scroll";
			}, 1);
		}
	}

	private completeAnimation(onCompleted?: () => void) {
    	if (this.animating) {
	    	this.clearCurrentPanel();
	    	this.currentPanel.appendChild(this.nextPanel.firstElementChild);
	    	this.clearNextPanel();
	    	this.animating = false;
			Events.dispatchSwapEvent(this.currentPanel.firstElementChild, this);
	    	if (onCompleted) {
	    		onCompleted();
	    	}
	    }
    }

	private clearCurrentPanel() {
		while (this.currentPanel.firstChild) {
    		this.currentPanel.removeChild(this.currentPanel.firstChild);
		}
	}

	private clearNextPanel() {
		while (this.nextPanel.firstChild) {
    		this.nextPanel.removeChild(this.nextPanel.firstChild);
		}
	}
}
//TODO valor default das propriedades todas
export interface SwapOptions {
	animation: string;
	animationDuration?: number;
	animationDisabled?: boolean;
	onCompleted?: () => void;
	animationOrder?: "sequence" | "parallel"
}

window['CruxSwapPanelElement'] = document['registerElement']('crux-swap-panel', CruxSwapPanel);
