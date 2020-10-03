import { LitElement, css, CSSResult, html, property, TemplateResult, internalProperty } from 'lit-element';
import { CountryData, CountryInfo, CountryLanguage } from '../typings';

/**
 * `<quote-of-the-day>`
 * @demo ./index.html
 */
export class CountryCard extends LitElement {
    @property() code: string;

    @internalProperty() private countryMap: SVGPathElement;
    @internalProperty() private info: CountryInfo;
    @internalProperty() private countryData: CountryData;

    public static get styles(): CSSResult {
        return css`
            :host {
                display: grid;
                grid-template-columns: 9fr 3fr;
                grid-gap: 1rem;
            }
            aside {
                background-color: white;
                border-radius: 0.25rem;
                overflow: hidden;
                margin: 0 1rem;
                background-color: rgb(240, 240, 240);
            }
            figure {
                background-color: lightskyblue;
                margin: 0;
                padding: 1rem;
                display: grid;
                grid-template-columns: auto 100px;
            }

            figcaption > h3 {
                margin: 0;
            }

            figcaption > p {
                margin: 0;
                color: rgb(0, 0, 200);
            }

            section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                align-content: space-around;
            }

            section > * {
                padding: 0.25rem 1rem;
                border-top: 1px solid rgb(200, 200, 200);
            }

            label {
                font-weight: bold;
            }

            img.flag {
                width: 100px;
                border: 1px solid rgb(200, 200, 200);
            }
        `;
    }

    public constructor() {
        super();
        this.loadCountryData();
    }

    protected shouldUpdate(changedProperties: Map<string, any>): boolean {
        if (changedProperties.has('code')) {
            this.computeCountryInfo();
        }
        return true;
    }

    protected render(): TemplateResult {
        const { countryMap, info } = this;

        return html`
            <slot @svg-ready="${(evt: CustomEvent): void => this.onSVGLoaded(evt)}"></slot>
            ${info && info.code
                ? html`
                      <aside>
                          <figure>
                              <figcaption>
                                  <h3>${info.name}</h3>
                                  <p>${info.nativeName}</p>
                              </figcaption>
                              <img class="flag" src="http://flagpedia.net/data/flags/w1160/${info.code}.webp" />
                          </figure>
                          <section>
                              <!-- Continent -->
                              <label>Region</label><span>${info.region}</span>
                              <!-- Region -->
                              <label>Sub-Region</label><span>${info.subregion}</span>
                              <!-- Country Population -->
                              <label>Population</label>
                              <span>${new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(parseInt(info.population) / 1e6)} million</span>
                              <!-- People -->
                              <label>People</label><span>${info.demonym}</span>
                              <!-- Languages -->
                              <label>Languages</label><span>${info.languages.map((lang: CountryLanguage) => lang.name).join(', ')}</span>
                              <!-- Capital City -->
                              <label>Capital City</label><span>${info.capital}</span>
                          </section>
                          <footer>
                              <svg id="country-map">${countryMap}</svg>
                          </footer>
                      </aside>
                  `
                : html``}
        `;
    }

    private onSVGLoaded(evt: CustomEvent): void {
        console.log('SVG Loaded', evt.target);
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
            this.computeCountryInfo();
        } else {
            throw new Error('unable to load country data');
        }
    }

    private computeCountryInfo(): void {
        if (this.code && this.countryData && this.countryData[this.code]) {
            this.info = this.countryData[this.code];
        }
    }
}

customElements.define('country-card', CountryCard);
