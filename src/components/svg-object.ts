import { LitElement, css, svg, SVGTemplateResult, html, TemplateResult, render } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { until } from 'lit/directives/until.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export const enum LoadingState {
    pending = 'pending',
    loading = 'loading',
    ready = 'ready',
    error = 'error',
}

/**
 * This component is responsible for loading a SVG file into the web page
 *
 * @property {String} src - the path of the SVG file to load
 */
@customElement('svg-object')
export class SVGObject extends LitElement {
    @property() src: string;
    @property({ type: String, reflect: true }) state = LoadingState.pending;

    private svgData: SVGTemplateResult | Promise<SVGTemplateResult>;

    static styles = css`
        :host {
            display: block;
        }

        ::slotted(*) {
            width: 100%;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `;

    protected render(): TemplateResult {
        render(html`${until(this.getSVG(), html`<div class="loader"></div>`)}`, this);
        return html`<slot></slot>`;
    }

    private async getSVG(): Promise<SVGTemplateResult> {
        if (!this.svgData) {
            this.svgData = this.loadSVG();
        }

        return this.svgData;
    }

    private async loadSVG(): Promise<SVGTemplateResult> {
        this.state = LoadingState.loading;

        const headers: { [key: string]: string } = { 'Content-Type': 'image/svg+xml' };
        const response: Response = await fetch(this.src, { headers });

        if (response.status === 200) {
            const data: string = await response.text();

            this.state = LoadingState.ready;
            this.setReadyState();

            return svg`
                ${unsafeHTML(data)}
            `;
        }

        this.state = LoadingState.error;
        throw new Error('could not load svg image file');
    }

    private setReadyState(): void {
        setTimeout(
            () =>
                this.dispatchEvent(
                    new CustomEvent('svg-loaded', {
                        bubbles: true,
                        detail: {
                            svg: this.firstElementChild as SVGElement,
                        },
                    })
                ),
            0
        );
    }
}
