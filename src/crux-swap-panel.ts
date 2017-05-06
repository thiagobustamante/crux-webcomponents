/// <reference path='./definitions.d.ts' />
'use strict';

import { Attributes, Events } from './component';
import { SwapAnimation, SwapAnimationOrder } from './swap-animations';

export class CruxSwapPanel extends HTMLElement {
    static get observedAttributes() {
        return ['animation', 'animationdisabled', 'animationduration', 'animationorder', 'fixedheight', 'onswap', 'width', 'height'];
    }
    private animating: boolean;
    private currentPanel: HTMLDivElement;
    private initialized = false;
    private nextPanel: HTMLDivElement;
    private shadow: ShadowRoot;

    private static template: HTMLTemplateElement;

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        const clone = document.importNode(CruxSwapPanel.getTemplate().content, true);
        this.shadow.appendChild(clone);
    }

    connectedCallback() {
        if (!this.initialized) {
            this.currentPanel = <HTMLDivElement>this.shadowRoot.getElementById('currentPanel');
            this.nextPanel = <HTMLDivElement>this.shadowRoot.getElementById('nextPanel');
            this.style.display = 'block';

            Attributes.initAttribute(this, 'animationDuration', 200);
            Attributes.initAttribute(this, 'animation', 'slideLeft');
            Attributes.initAttribute(this, 'animationOrder', 'parallel');
            if (!this.fixedHeight) {
                this.updateHeight(this.currentPanel);
            } else {
                Attributes.initAttribute(this, 'height', 'auto');
            }

            this.initialized = true;
        }
    }

    attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
        if (/^on/.test(attrName)) {
            Events.addEvent(this, attrName.slice(2), newValue);
        } else if (attrName === 'width') {
            this.width = newValue;
        } else if (attrName === 'height') {
            this.height = newValue;
        } else if (attrName === 'fixedheight') {
            if (oldValue && !newValue) {
                this.updateChildrenHeights(true);
            } else if (newValue) {
                this.updateChildrenHeights(false);
            }
        }
    }

    /**
     * Inform if the animations are disabled.
     */
    get animationDisabled(): boolean {
        return this.hasAttribute('animationdisabled');
    }

    set animationDisabled(value: boolean) {
        if (value) {
            this.setAttribute('animationdisabled', '');
        } else {
            this.removeAttribute('animationdisabled');
        }
    }

    /**
     * If true, the component will keep a fixed height (provided by height property). If false, the component will change
     * its height on every swap to fit to its child height.
     */
    get fixedHeight(): boolean {
        return this.hasAttribute('fixedheight');
    }

    set fixedHeight(value: boolean) {
        if (value) {
            this.setAttribute('fixedheight', '');
        } else {
            this.removeAttribute('fixedheight');
        }
    }

    /**
     * The component width
     */
    get width(): string {
        return this.style.width;
    }

    set width(value: string) {
        this.style.width = value;
    }

    /**
     * The component height. It must be used with fixedHeight to work.
     */
    get height(): string {
        return this.style.height;
    }

    set height(value: string) {
        this.style.height = value;
    }

    /**
     * The animation used to sawp panels.
     * It uses entrance and exit animations from the [animate.css](https://daneden.github.io/animate.css/) library.
     * You can choose one of:
     *   - bounce: ['bounceIn', 'bounceOut'],
     *   - bounceDown: ['bounceInDown', 'bounceOutDown'],
     *   - bounceLeft: ['bounceInLeft', 'bounceOutRight'],
     *   - bounceRight: ['bounceInRight', 'bounceOutLeft'],
     *   - bounceUp: ['bounceInUp', 'bounceOutUp'],
     *   - fade: ['fadeIn', 'fadeOut'],
     *   - fadeDown: ['fadeInDownBig', 'fadeOutDownBig'],
     *   - fadeLeft: ['fadeInLeftBig', 'fadeOutRightBig'],
     *   - fadeRight: ['fadeInRightBig', 'fadeOutLeftBig'],
     *   - fadeUp: ['fadeInUpBig', 'fadeOutUpBig'],
     *   - slideDown: ['slideInDown', 'slideOutDown'],
     *   - slideLeft: ['slideInLeft', 'slideOutRight'],
     *   - slideRight: ['slideInRight', 'slideOutLeft'],
     *   - slideUp: ['slideInUp', 'slideOutUp'],
     *   - zoom: ['zoomIn', 'zoomOut']
     */
    get animation(): string {
        return this.getAttribute('animation');
    }

    set animation(value: string) {
        this.setAttribute('animation', value);
    }

    /**
     * Specify the order of the entrance and exit animations.
     * You can choose one of the values:
     *   - parallel - The exit animation occurs in parallel with entrance animation.
     *   - sequence - The exit animation occurs after the entrance animation concludes.
     */
    get animationOrder(): string {
        return this.getAttribute('animationorder');
    }

    set animationOrder(value: string) {
        this.setAttribute('animationorder', value);
    }

    /**
     * The animation duration in miliseconds
     */
    get animationDuration(): number {
        return parseInt(this.getAttribute('animationduration'), 10);
    }

    set animationDuration(value: number) {
        this.setAttribute('animationduration', ''+value);
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
            if (!this.fixedHeight) {
                this.updateHeight(element);
            }
        }
        // this.currentPanel.firstElementChild;
    }

    /**
     * Clear the panel content
     */
    clear() {
        this.clearCurrentPanel();
        this.clearNextPanel();
    }

    /**
     * Change the panel content to a new provided panel. If animations are enabled,
     * use the provided animations to swap the two panels.
     */
    swapTo(target: HTMLElement, options?: SwapOptions) {
        if (!this.animating) {
            this.animating = true;
            this.clearNextPanel();
            this.nextPanel.appendChild(target);

            let animationEnabled = !this.animationDisabled;
            if (options) {
                if (options.animationDisabled === true) {
                    animationEnabled = false;
                } else if (options.animationDisabled === false) {
                    animationEnabled = true;
                }
            }
            if (animationEnabled) {
                const animation = (options && options.animation)
                    ? options.animation : this.animation;
                const animationOrder = (options && options.animationOrder)
                    ? SwapAnimationOrder[options.animationOrder]
                    : (<any>SwapAnimationOrder)[this.animationOrder];
                const duration = (options && options.animationDuration)
                    ? options.animationDuration : this.animationDuration;

                const self = this;
                SwapAnimation.animate(this.nextPanel, this.currentPanel, {
                    duration: duration,
                    order: animationOrder,
                    swapAnimation: animation,
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
                        if (!self.fixedHeight) {
                            self.updateHeight(target);
                        }
                        self.completeAnimation(options ? options.onCompleted : null);
                    }
                });
            } else {
                if (!this.fixedHeight) {
                    this.updateHeight(target);
                }
                this.completeAnimation(options ? options.onCompleted : null);
            }
        }
    }

    private updateHeight(element: HTMLElement) {
        setTimeout(() => {
            this.style.height = element.offsetHeight + 'px';
        }, 1);
    }

    private updateChildrenHeights(auto: boolean) {
        if (auto) {
            this.currentPanel.style.height = 'auto';
            this.currentPanel.style.overflow = '';
            this.nextPanel.style.height = 'auto';
            this.nextPanel.style.overflow = '';
        } else {
            setTimeout(() => {
                const styles = window.getComputedStyle(this);
                const padding = parseFloat(styles.paddingTop) +
                    parseFloat(styles.paddingBottom);
                const height = this.clientHeight - padding;
                this.currentPanel.style.maxHeight = height + 'px';
                this.currentPanel.style.overflow = 'scroll';
                this.nextPanel.style.maxHeight = height + 'px';
                this.nextPanel.style.overflow = 'scroll';
            }, 1);
        }
    }

    private completeAnimation(onCompleted?: () => void) {
        if (this.animating) {
            this.clearCurrentPanel();
            this.currentPanel.appendChild(this.nextPanel.firstElementChild);
            this.clearNextPanel();
            this.animating = false;
            Events.dispatchEvent('swap', this, [
                { name: 'currentItem', value: this.currentPanel.firstElementChild }
            ]);

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

    private static getTemplate() {
        if (!CruxSwapPanel.template) {
            CruxSwapPanel.template = document.createElement('template');
            CruxSwapPanel.template.innerHTML = require('./crux-swap-panel.template.html');
            const cssTag: HTMLStyleElement = document.createElement('style');
            (<any>cssTag).language = 'text/css';
            cssTag.innerText = require('./crux-swap-panel.template.css');
            CruxSwapPanel.template.content.appendChild(cssTag);
        }
        return CruxSwapPanel.template;
    }
}
export interface SwapOptions {
    animation: string;
    animationDuration?: number;
    animationDisabled?: boolean;
    onCompleted?: () => void;
    animationOrder?: 'sequence' | 'parallel';
}

customElements.define('crux-swap-panel', CruxSwapPanel);
// (<any>window)['CruxSwapPanelElement'] = (<any>document).registerElement('crux-swap-panel', CruxSwapPanel);
