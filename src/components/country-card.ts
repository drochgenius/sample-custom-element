import { LitElement, css, html, TemplateResult } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';

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

export type CountryData = { [code: string]: CountryInfo };

/**
 * This component is responsible for displaying informations for a given country
 *
 * @property {String} code - the ISO country code of the coutry for which to display infos.
 */
@customElement('country-card')
export class CountryCard extends LitElement {
    @property({ reflect: true }) code: string;

    @state() private countryData: Promise<CountryData>;

    static styles = css`
        :host {
            border-radius: 0.25rem;
            overflow: hidden;
            margin: 0 1rem;
            background-color: var(--color-grey-light-3);
        }
        figure {
            background-color: var(--color-primary-light, lightskyblue);
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

    public constructor() {
        super();
        this.countryData = this.loadCountryData();
    }

    protected render(): TemplateResult {
        return html`${until(this.renderCountryInfo(this.code), html`xxx`)}`;
    }

    private async renderCountryInfo(code: string): Promise<TemplateResult> {
        console.log(code);
        const info = await this.getCountryInfo(code);
        return html`
            <figure>
                <figcaption>
                    <h3>${info.name}</h3>
                    <p>${info.nativeName}</p>
                </figcaption>
                <img class="flag" src="http://flagpedia.net/data/flags/w1160/${info.code}.webp" />
            </figure>
            <section>
                <label>Region</label><span>${info.region}</span> <label>Sub-Region</label><span>${info.subregion}</span>
                <label>Population</label>
                <span>${new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(parseInt(info.population) / 1e6)} million</span>
                <label>People</label><span>${info.demonym}</span> <label>Languages</label
                ><span>${info.languages.map((lang: CountryLanguage) => lang.name).join(', ')}</span> <label>Capital City</label><span>${info.capital}</span>
            </section>
        `;
    }

    private async getCountryInfo(code: string): Promise<CountryInfo> {
        const data = await this.countryData;
        return data[code];
    }

    private async loadCountryData(): Promise<CountryData> {
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

            return countryData;
        } else {
            throw new Error('unable to load country data');
        }
    }
}
