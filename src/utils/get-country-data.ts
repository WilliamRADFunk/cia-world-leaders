import * as cheerio from 'cheerio';
import * as rp from 'request-promise';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { CountryReference } from "../models/country-reference";
import { dataScrapers } from '../scrapers/data-getters';
import { countryToId } from './country-to-id';

const numberOfScrapers: number = Object.keys(dataScrapers).length;

export function getCountryData(country: CountryReference, url: string): any {
    if (country && url) {
        return rp(url, { timeout: consts.BASE.DATA_REQUEST_TIMEOUT })
            .then((html) => {
                const $ = cheerio.load(html);
                const countryId = countryToId(country.name);
                dataScrapers.getNaturalResources($, country.name, countryId);
                store.progressLogger(country.name, 1 / numberOfScrapers);
                store.debugLogger(`Data scrape for ${country.name} is complete`);
            })
            .catch(err => {
                store.failedCountries.push(country);
                const errMsg = `${
                    new Date().toISOString()
                }\n\nIndividual country query failed:  ${
                country.name}\n${url}\n${err.toString().trim()}\n\n`;
                store.errorLogger(errMsg);
            });
    } else {
        return new Promise(resolve => {
            store.errorLogger(`${
                new Date().toISOString()}\n\nFailure to scrape data for ${
                country.name} at \n${url}\n\n`);
            resolve();
        }).then(() => { /* not empty */ });
    }
};