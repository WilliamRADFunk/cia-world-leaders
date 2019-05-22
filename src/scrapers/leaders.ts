import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';
import { getRelation } from '../utils/get-objectProperty';

export function getLeaders(cheerioElem: CheerioSelector, country: string, countryId: string) {
	// Checking to see if country has the section needed before continuing.
    let bailOut = true;
    cheerioElem('#countryOutput').each(() => {
        bailOut = false;
    });
    if (bailOut) {
        return;
	}
	// Some countries have duplicate titles that differentiated by the region they govern.
	// This captures the change so that an ontological note can be added for those specific offices.
	let specificRegion;
	cheerioElem('#countryOutput ul li #chiefsOutput > div').each((index: number, element: CheerioElement) => {
		// Capture a region specific header change.
		const regionName = cheerioElem(element).find('strong').text().trim();
		specificRegion = regionName ? regionName : (specificRegion || '');
		if (regionName) {
			specificRegion = specificRegion
				.replace('Admin.', 'Administrative')
				.replace('Govt.', 'Government');
		}
		// Captures names of office and person appointed to that office.
		const personName = cheerioElem(element.lastChild).find('span > span').text().trim();
		const officeName = cheerioElem(element).find('div > span > span').text().trim()
			.replace(personName, '')
			.replace('Min.-Del.', 'Minister-Delegate')
			.replace('Min.-Del', 'Minister-Delegate')
			.replace('Min.', 'Minister')
			.replace('Min. ', 'Minister ')
			.replace('Head, ', 'Head of the ')
			.replace('Min of ', 'Minister of ')
			.replace('Pres.', 'President')
			.replace('President, ', 'President of ')
			.replace('Dep.', 'Deputy')
			.replace('Dir.', 'Director')
			.replace('Fed.', 'Federal')
			.replace('Gen.', 'General')
			.replace('Sec.', 'Secretary')
			.replace('Secretary, ', 'Secretary of ')
			.replace('General, ', 'General of ')
			.replace('Director, ', 'Director of ')
			.replace('Dept.', 'Department')
			.replace('Gov.', 'Governor')
			.replace('Cdr.', 'Commander')
			.replace('Governor, ', 'Governor of the ')
			.replace('Commander, ', 'Commander of the ')
			.replace('Chmn.', 'Chairman')
			.replace('Chairman, ', 'Chairman of ')
			.replace('Premier, ', 'Premier of ')
			.replace('Ctte.', 'Committee')
			.replace('Chief, ', 'Chief of the ')
			.replace('Member, ', 'Member of the ')
			.replace('Admin. ', 'Administrative ')
			.replace('Govt. ', 'Government ')
			.replace(', State Council', ' of the State Council')
			.replace(' SPA ', ' Supreme People\'s Assembly ')
			.replace(' SAC ', ' State Affairs Commission ')
			.replace('Admin.', 'Administration');
		if (!officeName) {
			return;
		}
		// Fetch or create office entity
		const officeId = consts.ONTOLOGY.INST_GOVERNMENT_OFFICE + getUuid(country) + '-' + getUuid(officeName);
		let govObjectProp = {};
		if (!!store.govOffices[officeId]) {
			govObjectProp[consts.ONTOLOGY.HAS_GOVERNMENT_OFFICE] = store.govOffices[officeId];
		} else {
			govObjectProp = entityMaker(
				consts.ONTOLOGY.HAS_GOVERNMENT_OFFICE,
				consts.ONTOLOGY.ONT_GOVERNMENT_OFFICE,
				officeId,
				`The Office of ${officeName} (${country})`);
			store.govOffices[officeId] = govObjectProp[consts.ONTOLOGY.HAS_GOVERNMENT_OFFICE];
		}
		store.govOffices[officeId].datatypeProperties[consts.ONTOLOGY.DT_TITLE] = officeName;
		// Only add the region specific ontological note if there was one. Most countries don't have any.
		if (specificRegion) {
			store.govOffices[officeId].datatypeProperties[consts.ONTOLOGY.DT_REGION_SPECIFIC] = specificRegion;
		}
		const objectProperties = store.govOffices[officeId].objectProperties;
		const hasCountryRef = getRelation(objectProperties, consts.ONTOLOGY.HAS_COUNTRY);
		if (!hasCountryRef) {
			store.govOffices[officeId].objectProperties.push(
				entityRefMaker(
					consts.ONTOLOGY.HAS_COUNTRY,
					store.countries,
					countryId
			));
		}
		store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_GOVERNMENT_OFFICE, govObjectProp));

		// Parse name into first and last based on apparent pattern where last name is always all caps.
		if (personName) {
			const personNameDelimited = personName.trim().split(' ');
			let lastNameIndex = -1;
			const regExp = new RegExp('[A-Z]{2,}');
			personNameDelimited.forEach((val: string, i: number) => {
				const isMatch = val && val.match(regExp);
				if (lastNameIndex === -1 && isMatch) {
					lastNameIndex = i;
				}
			});
			const firstName = personNameDelimited.slice(0, lastNameIndex).join(' ');
			const lastName = personNameDelimited.slice(lastNameIndex).join(' ');

			// If name present fetch or create the associated entity
			const personId = consts.ONTOLOGY.INST_PERSON + getUuid(country) + '-' + getUuid(personName);
			let perObjectProp = {};
			if (!!store.persons[personId]) {
				perObjectProp[consts.ONTOLOGY.HAS_GOVERNMENT_OFFICIAL] = store.persons[personId];
			} else {
				perObjectProp = entityMaker(
					consts.ONTOLOGY.HAS_GOVERNMENT_OFFICIAL,
					consts.ONTOLOGY.ONT_PERSON,
					personId,
					`${personName}`);
				store.persons[personId] = perObjectProp[consts.ONTOLOGY.HAS_GOVERNMENT_OFFICIAL];
			}
			perObjectProp[consts.ONTOLOGY.HAS_GOVERNMENT_OFFICIAL].datatypeProperties[consts.ONTOLOGY.DT_NAME] = personName;
			// For cases like Queen ELIZABETH II, dispense with first and last name. Use only name.
			if (lastNameIndex > 0) {
				perObjectProp[consts.ONTOLOGY.HAS_GOVERNMENT_OFFICIAL].datatypeProperties[consts.ONTOLOGY.DT_FIRST_NAME] = firstName;
				perObjectProp[consts.ONTOLOGY.HAS_GOVERNMENT_OFFICIAL].datatypeProperties[consts.ONTOLOGY.DT_LAST_NAME] = lastName;
			}
			perObjectProp[consts.ONTOLOGY.HAS_GOVERNMENT_OFFICIAL].objectProperties.push(
				entityRefMaker(
					consts.ONTOLOGY.HAS_APPOINTED_GOVERNMENT_OFFICE,
					govObjectProp,
					consts.ONTOLOGY.HAS_GOVERNMENT_OFFICE)
			);
			store.govOffices[officeId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_GOVERNMENT_OFFICIAL, perObjectProp));
		}		
    });
};