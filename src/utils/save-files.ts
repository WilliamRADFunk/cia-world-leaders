import { consts } from '../constants/constants';
import { saveFile } from './save-file';

export function saveFiles() {
	saveFile('countries', 'countries', consts.ONTOLOGY.MAIN_ONT_PATH);
	saveFile('natural-resources', 'naturalResources', consts.ONTOLOGY.MAIN_ONT_PATH);
};