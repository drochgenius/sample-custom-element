import { LitElement, css, CSSResult, html, property, TemplateResult } from 'lit-element';
import { render, svg, SVGTemplateResult } from 'lit-html';
import { until } from 'lit-html/directives/until';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

export const enum LoadingState {
    pending = 'pending',
    loading = 'loading',
    ready = 'ready',
    error = 'error',
}

/**
 * `<quote-of-the-day>`
 * @demo ./index.html
 */
export class SVGObject extends LitElement {
    @property() src: string;
    @property({ attribute: 'aspect-ratio', type: Number }) aspectRatio = 1;
    @property({ type: String, reflect: true }) state = LoadingState.pending;

    private svgData: SVGTemplateResult | Promise<SVGTemplateResult>;

    public static get styles(): CSSResult {
        return css`
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
    }

    protected render(): TemplateResult {
        render(
            html`
                ${until(
                    this.getSVG(),
                    html`
                        <div class="loader"></div>
                    `
                )}
            `,
            this
        );

        return html`
            <slot></slot>
        `;
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
            this.setReadyState();
            return svg`
                ${unsafeHTML(data)}
            `;
        }

        this.state = LoadingState.error;
        throw new Error('could not load svg image file');
    }

    private async setReadyState(): Promise<void> {
        this.state = LoadingState.ready;

        setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent('svg-ready', {
                    bubbles: true,
                    composed: true,
                })
            );
        }, 0);
    }
}

customElements.define('svg-object', SVGObject);
