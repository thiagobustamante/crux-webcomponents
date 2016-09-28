/// <reference path="./definitions.d.ts" />
/// <reference path="./animate.d.ts" />
"use strict";

let Animations = require("animate.css-js");
const SwapAnimations = {
	bounce: ['bounceIn', 'bounceOut'],
	bounceDown: ['bounceInDown', 'bounceOutDown'],
	bounceUp: ['bounceInUp', 'bounceOutUp'],
	bounceLeft: ['bounceInLeft', 'bounceOutRight'],
	bounceRight: ['bounceInRight', 'bounceOutLeft'],
	fade: ['fadeIn', 'fadeOut'],
	fadeDown: ['fadeInDownBig', 'fadeOutDownBig'],
	fadeUp: ['fadeInUpBig', 'fadeOutUpBig'],
	fadeLeft: ['fadeInLeftBig', 'fadeOutRightBig'],
	fadeRight: ['fadeInRightBig', 'fadeOutLeftBig'],
	zoom: ['zoomIn', 'zoomOut'],
	slideDown: ['slideInDown', 'slideOutDown'],
	slideUp: ['slideInUp', 'slideOutUp'],
	slideLeft: ['slideInLeft', 'slideOutRight'],
	slideRight: ['slideInRight', 'slideOutLeft'],
}


export enum SwapAnimationOrder {
	sequence, parallel
}

export interface SwapAnimationOptions {
	swapAnimation: string;
	order: SwapAnimationOrder;
	duration?: number;
	onCompleted?: () => void;
	onInElementCompleted?: (inElement: Element) => void;
	onInElementBeforeEntrance?: (inElement: Element) => void;
	onOutElementCompleted?: (outElement: Element) => void;
	onOutElementBeforeEntrance?: (outElement: Element) => void;
}

export class SwapAnimation {
	
	static animate(inElement: HTMLElement, outElement: HTMLElement, options: SwapAnimationOptions){
		if (options.order === SwapAnimationOrder.sequence) {
			this.animateInOrder(inElement, outElement, options);
		}
		else {
			this.animateParallel(inElement, outElement, options);
		}
	}
	
	protected static animateInOrder(inElement: HTMLElement, outElement: HTMLElement, options: SwapAnimationOptions) {
		const animation = (SwapAnimations[options.swapAnimation] || SwapAnimations['slideLeft']);
		const entranceAnimation = animation[0];
		const exitAnimation = animation[1];
		Animations.animate(outElement, {animationName: exitAnimation, callbacks:[
			() => {
				if (options.onOutElementBeforeEntrance) {
					options.onOutElementBeforeEntrance(outElement);
				}
				if (options.onInElementBeforeEntrance) {
					options.onInElementBeforeEntrance(inElement);
				}
				Animations.animate(inElement, {animationName: entranceAnimation, callbacks:[
					() => {
						if (options.onInElementCompleted) {
							options.onInElementCompleted(inElement);
						}
						if (options.onOutElementCompleted) {
							options.onOutElementCompleted(outElement);
						}
						if (options.onCompleted) {
							options.onCompleted();
						}
					}
				], duration: options.duration});
			}
		], duration: options.duration});
    }
	
	protected static animateParallel(inElement: HTMLElement, outElement: HTMLElement, options: SwapAnimationOptions)
    {
		const animation = (SwapAnimations[options.swapAnimation] || SwapAnimations['slideLeft']);
		const entranceAnimation = animation[0];
		const exitAnimation = animation[1];
		Animations.animate(outElement, {animationName: exitAnimation, duration: options.duration});
		// if (options.onOutElementBeforeEntrance) {
		// 	options.onOutElementBeforeEntrance(outElement);
		// }
		if (options.onInElementBeforeEntrance) {
			options.onInElementBeforeEntrance(inElement);
		}
		Animations.animate(inElement, {animationName: entranceAnimation, callbacks:[
			() => {
				if (options.onInElementCompleted) {
					options.onInElementCompleted(inElement);
				}
				if (options.onOutElementCompleted) {
					options.onOutElementCompleted(outElement);
				}
				if (options.onCompleted) {
					options.onCompleted();
				}
			}
		], duration: options.duration});
    }    
}