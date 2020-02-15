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
