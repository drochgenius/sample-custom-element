import { LitElement, css, CSSResult, html, property, TemplateResult } from 'lit-element';
// import { render, svg, SVGTemplateResult } from 'lit-html';
// import { until } from 'lit-html/directives/until';
// import { unsafeHTML } from 'lit-html/directives/unsafe-html';

export interface CountryLanguage {
    iso639_1: string;
    iso639_2: string;
    name: string;
    nativeName: string;
}

export interface CountryCurrency {
    code: string;
    name: string;
    symbol: string;
}

export interface CountryInfo {
    code: string;
    alpha2Code: string;
    alpha3Code: string;
    name: string; // country name
    nativeName: string; // country name in own country language
    population: string; // country population
    capital: string; // capital city
    demonym: string; // how to you call people from this country
    region: string;
    subregion: string;
    timezones: string[];
    languages: CountryLanguage[];
    area: string;
}

type CountryData = { [code: string]: CountryInfo };

/**
 * `<quote-of-the-day>`
 * @demo ./index.html
 */
export class CountryCard extends LitElement {
    @property() code: string;
    @property() private info: CountryInfo;
    @property() private countryMap: SVGPathElement;
    private countryData: CountryData;
    private currentSelection: SVGPathElement;

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

    protected render(): TemplateResult {
        const { countryMap, info } = this;

        return html`
            <slot @svg-ready="${(): void => this.onSVGLoaded()}"></slot>
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
                              <!-- Timezone -->
                              <label>Timezones</label><span>${info.timezones.join(', ')}</span>
                          </section>
                          <footer>
                              <svg id="country-map">
                                  ${countryMap}
                              </svg>
                          </footer>
                      </aside>
                  `
                : html``}
        `;
    }

    private onSVGLoaded(): void {
        document.querySelectorAll('svg [id]').forEach((el: SVGPathElement) => {
            el.addEventListener('click', this.showCountryInfo.bind(this, el, el.id));
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

            if (this.code) {
                this.info = this.getCountryInfo(this.code);
            }
        } else {
            throw new Error('unable to load country data');
        }
    }

    private showCountryInfo(el: SVGPathElement, code: string): void {
        console.log('show country info', code);
        if (this.currentSelection) {
            this.currentSelection.classList.remove('selected');
        }
        el.classList.add('selected');
        this.currentSelection = el;
        this.info = this.getCountryInfo(code);
        this.countryMap = el.cloneNode(true) as any;
    }

    private getCountryInfo(code: string): CountryInfo {
        if (this.countryData && this.countryData[code]) {
            return this.countryData[code];
        }
        return null;
    }
}

customElements.define('country-card', CountryCard);
