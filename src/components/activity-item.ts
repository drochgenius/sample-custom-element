import { LitElement, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CountryCard } from './country-card';

@customElement('activity-item')
export class ActivityItem extends LitElement {
    protected render(): TemplateResult {
        return html`<slot @svg-loaded="${(evt: CustomEvent) => this.onLoad(evt)}"></slot>`;
    }

    private async onLoad(evt: CustomEvent): Promise<void> {
        await this.updateComplete;
        const svg = evt.detail.svg as SVGElement;

        const countryCard: CountryCard = Array.from(this.children).find((el: HTMLElement) => el instanceof CountryCard) as CountryCard;

        svg.querySelectorAll('g[id], path[id]').forEach((countryElement: SVGElement) => {
            countryElement.addEventListener('click', () => {
                countryCard.code = 'fr';
                countryElement.classList.add('selected');
            });
        });
    }
}
