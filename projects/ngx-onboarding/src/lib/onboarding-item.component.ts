import {Component, ElementRef, Inject, Input, LOCALE_ID, ViewChild, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash';
import {OnboardingHtmlElementHelper, VisibleOnboardingItem} from './models';
import {WindowRef} from './services/window-ref.service';


const TopPadding = 25;
const RightPadding = 25;
const LeftPadding = 25;

/**
 * used by onboarding component
 * shows the headline and detail text of the OnboardingItem
 * calculates the positions of the item
 */
@Component({
    selector: 'rosen-onboarding-item',
    templateUrl: './onboarding-item.component.html',
    styleUrls: ['./onboarding-item.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class OnboardingItemComponent {

    /**
     * the onboarding item with headline and text and the target html element
     */
    @Input()
    public item: VisibleOnboardingItem;

    /**
     * the onboarding item container
     * used to calculate the position
     */
    @ViewChild('container')
    private container: ElementRef;

    constructor(@Inject(LOCALE_ID) private readonly locale: string, private windowRef: WindowRef) {
    }

    /**
     * used by template
     * calculates the position of the OnboardingItemComponent
     */
    public getStyle() {
        const pos = OnboardingHtmlElementHelper.getPosition(this.item.element);
        let transform = 'none';

        switch (this.item.item.position) {
            case 'top':
                pos.x += this.item.element.offsetWidth / 2;
                if (pos.x < this.getContainerWidth() / 2) {
                    pos.x = this.getContainerWidth() / 2;
                } else if (pos.x > this.getWindowScreenWidth() - this.getContainerWidth()) {
                    pos.x = this.getWindowScreenWidth() - this.getContainerWidth();
                }
                pos.y -= TopPadding;
                transform = 'translate(-50%,-100%)';
                break;
            case 'right':
                pos.x += Math.min(this.item.element.offsetWidth + RightPadding, this.getWindowScreenWidth() - this.getContainerWidth() / 2);
                pos.y += this.item.element.offsetHeight / 2;
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > this.getWindowScreenHeight() - this.getContainerHeight() / 2) {
                    pos.y = this.getWindowScreenHeight() - this.getContainerHeight() / 2;
                }
                transform = 'translateY(-50%)';
                break;
            case 'left':
                pos.x -= LeftPadding;
                pos.y += this.item.element.offsetHeight / 2;
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > this.getWindowScreenHeight() - this.getContainerHeight() / 2) {
                    pos.y = this.getWindowScreenHeight() - this.getContainerHeight() / 2;
                }
                transform = 'translate(-100%,-50%)';
                break;
            case 'topleft':
                pos.x -= LeftPadding;
                pos.y -= TopPadding;
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > this.getWindowScreenHeight() - this.getContainerHeight() / 2) {
                    pos.y = this.getWindowScreenHeight() - this.getContainerHeight() / 2;
                }
                transform = 'translate(-100%,-100%)';
                break;

            case 'bottom':
            default:
                pos.x += this.item.element.offsetWidth / 2;
                if (pos.x < this.getContainerWidth() / 2) {
                    pos.x = this.getContainerWidth() / 2;
                } else if (pos.x > this.getWindowScreenWidth() - this.getContainerWidth()) {
                    pos.x = this.getWindowScreenWidth() - this.getContainerWidth();
                }
                pos.y += this.item.element.offsetHeight;
                transform = 'translate(-50%,25%)';
                break;
        }
        return {
            left: pos.x + 'px',
            transform: transform,
            top: pos.y + 'px'
        };
    }

    public getHeadline(): string {
        const description = _.find(this.item.item.descriptions, d => d.language === this.locale); // TODO en-EN vs en
        return description ? description.headline : this.item.item.headline;
    }

    public getDetails(): string {
        const description = _.find(this.item.item.descriptions, d => d.language === this.locale); // TODO en-EN vs en
        return description ? description.details : this.item.item.details;
    }

    public getTextAlignClass(): string {
        if (_.isEmpty(this.item.item.textAlign) || this.item.item.textAlign === 'center') {
            return ''; // ==> center
        }
        return `align-${this.item.item.textAlign}`;
    }

    private getContainerWidth(): number {
        return this.container.nativeElement.offsetWidth;
    }

    private getContainerHeight(): number {
        return this.container.nativeElement.offsetHeight;
    }

    private getWindowScreenWidth(): number {
        return this.windowRef.nativeWindow ? this.windowRef.nativeWindow.screen.width : 1024;
    }

    private getWindowScreenHeight(): number {
        return this.windowRef.nativeWindow ? this.windowRef.nativeWindow.screen.height : 768;
    }


}