import { store } from '../constants/globalStore';

export function getLeaders(cheerioElem: CheerioSelector, country: string, countryId: string) {
	// Checking to see if country has the section needed before continuing.
    let bailOut = true;
    cheerioElem('#countryOutput').each(() => {
        bailOut = false;
    });
    if (bailOut) {
        return;
	}
	
	const objectProperties = store.countries[countryId].objectProperties;
	
	cheerioElem('#countryOutput ul li #chiefsOutput > div').each((index: number, element: CheerioElement) => {
		const personName = cheerioElem(element.lastChild).find('span > span').text();
		const officeName = cheerioElem(element).find('div > span > span').text()
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
		store.debugLogger(`${officeName}, ${personName}`);
    });
};