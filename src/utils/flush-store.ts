import { store } from "../constants/globalStore";

export function flushStore() {
	store.countries = {};
	store.countriesInList = [];
};