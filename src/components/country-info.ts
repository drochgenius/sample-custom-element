import { LitElement, css, CSSResult, html, property, TemplateResult } from 'lit-element';
// import { render, svg, SVGTemplateResult } from 'lit-html';
// import { until } from 'lit-html/directives/until';
// import { unsafeHTML } from 'lit-html/directives/unsafe-html';

export interface CountryInfo {
    code: string;
    alpha2Code: string;
    alpha3Code: string;
    name: string; // country name
    population: string; // country population
    capital: string; // capital city
    demonym: string; // how to you call people from this country
}

type CountryData = { [code: string]: CountryInfo };

/**
 * `<quote-of-the-day>`
 * @demo ./index.html
 */
export class CountryInformations extends LitElement {
    @property() src: string;

    @property() private info: CountryInfo;
    private countryData: CountryData;

    public static get styles(): CSSResult {
        return css`
            :host {
                display: block;
            }
            textarea {
                width: 100%;
                height: 200px;
            }

            figure {
                display: grid;
                grid-template-columns: auto 100px;
            }

            section {
                display: grid;
                grid-template-columns: 1fr 1fr;
            }

            img.flag {
                width: 100px;
            }
        `;
    }

    public constructor() {
        super();
        this.loadCountryData();
    }

    protected render(): TemplateResult {
        const { info } = this;

        return html`
            <slot @svg-ready="${(): void => this.onSVGLoaded()}"></slot>
            ${info && info.code
                ? html`
                      <aside>
                          <figure>
                              <figcaption>${info.name}</figcaption>
                              <img class="flag" src="http://flagpedia.net/data/flags/w1160/${info.code}.webp" />
                          </figure>
                          <section><label>Capital City</label><span>${info.capital}</span></section>
                      </aside>
                  `
                : html``}
        `;
    }

    private onSVGLoaded(): void {
        document.querySelectorAll('svg [id]').forEach((el: SVGPathElement) => {
            el.addEventListener('click', this.showCountryInfo.bind(this, el.id));
        });
    }

    private async loadCountryData(): Promise<void> {
        const url = '/static/countries.json';
        const headers: { [key: string]: string } = { 'Content-Type': 'application/json' };
        const response: Response = await fetch(url, { headers });

        if (response.status === 200) {
            const rawData: CountryInfo[] = await response.json();

            const countryData: CountryData = {};
            rawData.forEach((info: CountryInfo) => {
                info.code = info.alpha2Code.toLowerCase();
                countryData[info.code] = info;
            });
            this.countryData = countryData;
            console.log('countryData', countryData);
            return;
        }

        throw new Error('unable to load country data');
    }

    private async showCountryInfo(code: string): Promise<void> {
        console.log('show country info', code);
        this.info = this.getCountryInfo(code);
    }

    public getCountryInfo(code: string): CountryInfo {
        if (this.countryData && this.countryData[code]) {
            return this.countryData[code];
        }

        throw new Error(`unable to resolve infos for country code: ${code}`);
    }
}

customElements.define('country-info', CountryInformations);
