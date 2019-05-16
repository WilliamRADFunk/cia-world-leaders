const MAIN_INSTANCE_PATH = 'http://williamrobertfunk.com/instance/';
const COUNTRY_ONT_PATH = 'http://williamrobertfunk.com/ontologies/world-factbook#';
const MAIN_ONT_PATH = 'http://williamrobertfunk.com/ontologies/world-leaders#';
const GEO_ONT_PATH = 'http://www.w3.org/2003/01/geo/wgs84_pos#';
const WGS84_POS = {
	ALT: GEO_ONT_PATH + 'alt',
	LAT: GEO_ONT_PATH + 'lat',
	LAT_LONG: GEO_ONT_PATH + 'lat_long',
	LOCATION: GEO_ONT_PATH + 'location',
	LONG: GEO_ONT_PATH + 'long',
	POINT: GEO_ONT_PATH + 'Point',
	SPATIAL_THING: GEO_ONT_PATH + 'SpatialThing'
};

const BASE = {
	COUNTRY_BLACKLIST: [
		"please select a country to view",
		"world"
	],
	DATA_REQUEST_TIMEOUT: 40000,
	URL_BASE: 'https://www.cia.gov/library/publications/the-world-factbook/',
	URL_COUNTRY_BASE: 'https://www.cia.gov/library/publications/the-world-factbook/geos/',
	URL_LEADER_BASE: 'https://www.cia.gov/library/publications/resources/world-leaders-1/'
};

const ONTOLOGY = {
	// Ontology definition paths for (predicate) datatype properties
	DT_ISO_CODE: COUNTRY_ONT_PATH + 'countryCodeISO',
	// Ontology definition paths for (predicate) object/relation properties
	HAS_COUNTRY: COUNTRY_ONT_PATH + 'hasCountry',
	// Instance definition paths
	INST_COUNTRY: MAIN_INSTANCE_PATH + 'Country/',
	// Base path for all things instance definition
	MAIN_INSTANCE_PATH,
	// Base path for all things ontology definition
	MAIN_ONT_PATH,
	// Ontology class definition paths
	ONT_COUNTRY: COUNTRY_ONT_PATH + 'Country',
};

const RDFS = {
	label: 'http://www.w3.org/2000/01/rdf-schema#label'
};
class Constants {
	public BASE = BASE;
	public ONTOLOGY = ONTOLOGY;
	public RDFS = RDFS;
	public WGS84_POS = WGS84_POS;
};

export const consts = new Constants();