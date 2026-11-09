import type { JurisdictionId } from "./jurisdictions";

interface CountyOption {
  label: string;
  value: string;
}

/** A county's official name, with a better-known local name in the label. */
const county = (name: string, alsoKnownAs?: string): CountyOption => ({
  label: alsoKnownAs ? `${name} (${alsoKnownAs})` : name,
  value: name,
});

/**
 * Counties for states where a form needs an exact county name.
 * AddressField shows a dropdown for these states and free text elsewhere,
 * so supporting a new state only means adding its list here.
 */
const COUNTIES: Partial<Record<JurisdictionId, readonly CountyOption[]>> = {
  // New York State Department of Public Service county list:
  // https://documents.dps.ny.gov/public/Common/SearchCounty.aspx
  ny: [
    county("Albany"),
    county("Allegany"),
    county("Bronx"),
    county("Broome"),
    county("Cattaraugus"),
    county("Cayuga"),
    county("Chautauqua"),
    county("Chemung"),
    county("Chenango"),
    county("Clinton"),
    county("Columbia"),
    county("Cortland"),
    county("Delaware"),
    county("Dutchess"),
    county("Erie"),
    county("Essex"),
    county("Franklin"),
    county("Fulton"),
    county("Genesee"),
    county("Greene"),
    county("Hamilton"),
    county("Herkimer"),
    county("Jefferson"),
    county("Kings", "Brooklyn"),
    county("Lewis"),
    county("Livingston"),
    county("Madison"),
    county("Monroe"),
    county("Montgomery"),
    county("Nassau"),
    county("New York", "Manhattan"),
    county("Niagara"),
    county("Oneida"),
    county("Onondaga"),
    county("Ontario"),
    county("Orange"),
    county("Orleans"),
    county("Oswego"),
    county("Otsego"),
    county("Putnam"),
    county("Queens"),
    county("Rensselaer"),
    county("Richmond", "Staten Island"),
    county("Rockland"),
    county("St. Lawrence"),
    county("Saratoga"),
    county("Schenectady"),
    county("Schoharie"),
    county("Schuyler"),
    county("Seneca"),
    county("Steuben"),
    county("Suffolk"),
    county("Sullivan"),
    county("Tioga"),
    county("Tompkins"),
    county("Ulster"),
    county("Warren"),
    county("Washington"),
    county("Wayne"),
    county("Westchester"),
    county("Wyoming"),
    county("Yates"),
  ],
};

/**
 * Given a state code in any case, return its counties, if listed.
 *
 * @example
 * getCountyOptions("NY")
 * // [{ label: "Albany", value: "Albany" }, …]
 */
export const getCountyOptions = (state?: string) =>
  state ? COUNTIES[state.toLowerCase() as JurisdictionId] : undefined;

/**
 * Given a state code and a county name from address autocomplete, return the
 * matching listed county, or the name unchanged if the state has no list.
 *
 * @example
 * matchCounty("NY", "Kings County")
 * // "Kings"
 */
export const matchCounty = (state: string | undefined, county: string) =>
  getCountyOptions(state)?.find(
    ({ value }) => county === value || county === `${value} County`,
  )?.value ?? county;
