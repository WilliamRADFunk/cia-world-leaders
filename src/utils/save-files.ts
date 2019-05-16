import { consts } from '../constants/constants';
import { saveFile } from './save-file';

export function saveFiles() {
	saveFile('countries', 'countries', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('government-offices', 'govOffices', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('persons', 'persons', consts.ONTOLOGY.MAIN_ONT_PATH);
};