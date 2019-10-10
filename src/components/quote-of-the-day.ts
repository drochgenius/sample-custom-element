import { LitElement, css, CSSResult, html, property, TemplateResult } from 'lit-element';
import { until } from 'lit-html/directives/until';

/**
 * `<quote-of-the-day>`
 * @demo ./index.html
 */
export class QuoteOfTheDay extends LitElement {
    @property() name = 'World';

    private readonly apiHost = 'https://s3.amazonaws.com/static.tribalnova.com';

    public static get styles(): CSSResult {
        return css`
            :host {
                display: inline-block;
            }

            div {
                padding: 1em;
                border: 1px solid red;
            }
            h3 {
                color: var(--header-color, inherit);
            }
            p {
                color: blue;
                border: 1px solid gray;
                padding: 0.5em;
            }
        `;
    }

    protected render(): TemplateResult {
        const { name } = this;
        return html`
            <div>
                <h3>Hello ${name}, here's the quote of the day:</h3>
                <p class="quote">${until(this.quote(), 'loading...')}</p>
            </div>
        `;
    }

    private async quote(): Promise<string> {
        const headers: { [key: string]: string } = { 'Content-Type': 'application/json' };
        const response: Response = await fetch(`${this.apiHost}/interview-data/qod.json`, { headers });

        if (response.status === 200) {
            return response.json();
        }

        return 'could not load the quote';
    }
}

customElements.define('quote-of-the-day', QuoteOfTheDay);
