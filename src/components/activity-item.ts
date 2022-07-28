import { LitElement, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CountryCard } from './country-card';

/**
 * This component implements a click-to-reveal activity to discover the countries of the World
 */
@customElement('activity-item')
export class ActivityItem extends LitElement {
    protected render(): TemplateResult {
        return html`<slot
            @svg-loaded="${(evt: CustomEvent): void => {
                this.onLoad(evt);
            }}"
        ></slot>`;
    }

    private async onLoad(evt: CustomEvent): Promise<void> {
        await this.updateComplete;
        const svg = evt.detail.svg as SVGElement;

        const countryCard: CountryCard = Array.from(this.children).find((el: HTMLElement) => el instanceof CountryCard) as CountryCard;

        svg.querySelectorAll('g[id], path[id]').forEach((countryElement: SVGElement): void => {
            countryElement.addEventListener('click', (): void => {
                countryCard.code = 'fr';
                countryElement.classList.add('selected');
            });
        });
    }
}
