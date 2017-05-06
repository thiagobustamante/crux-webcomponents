/// <reference path="./definitions.d.ts" />
'use strict';

const animations = require('animate.css-js');
const swapAnimations = {
    bounce: ['bounceIn', 'bounceOut'],
    bounceDown: ['bounceInDown', 'bounceOutDown'],
    bounceLeft: ['bounceInLeft', 'bounceOutRight'],
    bounceRight: ['bounceInRight', 'bounceOutLeft'],
    bounceUp: ['bounceInUp', 'bounceOutUp'],
    fade: ['fadeIn', 'fadeOut'],
    fadeDown: ['fadeInDownBig', 'fadeOutDownBig'],
    fadeLeft: ['fadeInLeftBig', 'fadeOutRightBig'],
    fadeRight: ['fadeInRightBig', 'fadeOutLeftBig'],
    fadeUp: ['fadeInUpBig', 'fadeOutUpBig'],
    slideDown: ['slideInDown', 'slideOutDown'],
    slideLeft: ['slideInLeft', 'slideOutRight'],
    slideRight: ['slideInRight', 'slideOutLeft'],
    slideUp: ['slideInUp', 'slideOutUp'],
    zoom: ['zoomIn', 'zoomOut']
};

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

    static animate(inElement: HTMLElement, outElement: HTMLElement, options: SwapAnimationOptions) {
        if (options.order === SwapAnimationOrder.sequence) {
            this.animateInOrder(inElement, outElement, options);
        } else {
            this.animateParallel(inElement, outElement, options);
        }
    }

    protected static animateInOrder(inElement: HTMLElement, outElement: HTMLElement, options: SwapAnimationOptions) {
        const animation = ((<any>swapAnimations)[options.swapAnimation] || swapAnimations['slideLeft']);
        const entranceAnimation = animation[0];
        const exitAnimation = animation[1];
        animations.animate(outElement, {
            animationName: exitAnimation, callbacks: [
                () => {
                    if (options.onOutElementBeforeEntrance) {
                        options.onOutElementBeforeEntrance(outElement);
                    }
                    if (options.onInElementBeforeEntrance) {
                        options.onInElementBeforeEntrance(inElement);
                    }
                    animations.animate(inElement, {
                        animationName: entranceAnimation, callbacks: [
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
                        ], duration: options.duration
                    });
                }
            ], duration: options.duration
        });
    }

    protected static animateParallel(inElement: HTMLElement, outElement: HTMLElement, options: SwapAnimationOptions) {
        const animation = ((<any>swapAnimations)[options.swapAnimation] || swapAnimations['slideLeft']);
        const entranceAnimation = animation[0];
        const exitAnimation = animation[1];
        animations.animate(outElement, { animationName: exitAnimation, duration: options.duration });
        // if (options.onOutElementBeforeEntrance) {
        // 	options.onOutElementBeforeEntrance(outElement);
        // }
        if (options.onInElementBeforeEntrance) {
            options.onInElementBeforeEntrance(inElement);
        }
        animations.animate(inElement, {
            animationName: entranceAnimation, callbacks: [
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
            ], duration: options.duration
        });
    }
}
