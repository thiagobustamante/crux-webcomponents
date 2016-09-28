declare interface AnimationOptions {
    animationName: string;
    duration?: number;
    callbacks?: Array<()=>void>;
}
declare interface AnimationShowOptions {
    animationName?: string;
    duration?: number;
    callbacks?: Array<()=>void>;
}
declare function animate(element: HTMLElement, options: AnimationOptions);
declare function show(element: HTMLElement, options?: AnimationShowOptions);
declare function hide(element: HTMLElement, options?: AnimationShowOptions);