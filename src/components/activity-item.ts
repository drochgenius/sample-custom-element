import { LitElement, html, TemplateResult, queryAssignedNodes } from 'lit-element';
import { CountryCard } from './country-card';

export class ActivityItem extends LitElement {
    @queryAssignedNodes() private assignedNodes: HTMLElement[];

    protected render(): TemplateResult {
        return html`<slot @load="${(evt: Event) => this.onLoad(evt)}"></slot>`;
    }

    private onLoad(evt: Event) {
        const svg = evt.target as SVGElement;

        const countryCard: CountryCard = this.assignedNodes.find((el: HTMLElement) => el instanceof CountryCard) as CountryCard;

        svg.querySelectorAll('g[id], path[id]').forEach((el: SVGElement) => {
            el.addEventListener('click', () => {
                countryCard.code = 'br';
            });
        });
    }
}

customElements.define('activity-item', ActivityItem);
