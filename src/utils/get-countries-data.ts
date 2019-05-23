import { store } from '../constants/globalStore';
import { flushStore } from '../utils/flush-store';
import { getCountryData } from '../utils/get-country-data';
import { getCountryURL } from '../utils/get-country-url';
import { saveFiles } from '../utils/save-files';

const createCountriesPromises = () => {
    const countryDataPromises: Array<Promise<any>> = [];
    const countries = store.countriesInList.slice();
    countries.forEach(country => {
        const url = getCountryURL(country.dataCode);
        countryDataPromises.push(getCountryData(country, url));
    });
    return countryDataPromises;
};

export async function getCountriesData() {
    store.countriesInList.sort();
    const promises = createCountriesPromises();
    await Promise.all(promises)
        .then(async () => {
            if (store.failedCountries.length) {
                store.countriesInList = store.failedCountries.slice();
                store.failedCountries.length = 0;
                await getCountriesData();
            } else {
                saveFiles();
                flushStore();
            }
        })
        .catch(err => {
            store.errorLogger(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
        });
}



