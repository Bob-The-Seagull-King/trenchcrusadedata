
// Data File Imports -----------------------------------
import { DataByLanguageTable, DataSetTC } from "./DataHandler"
// -----------------------------------------------------

/**
 * Basic request interface
 */
interface IDataRequest {
    type: string // The data file to search within
    data: []
    language?: string
}

/**
 * Used for single-id collection and return-all-values-by-key collection
 */
interface IDataRequestID extends IDataRequest {
    id: string // The ID value being selected for
}

/**
 * Used for complex searches
 */
interface IDataRequestComplexSearch extends IDataRequest {
    request: IDataRequestSearchParam // The search reques to filter items by
}

/**
 * Used for complex searches to combine and contain search terms
 */
interface IDataRequestSearchParam {
    operator: string, // Can be 'and' (true if all terms and subparams return true) or 'or' (true if one term or subparam returns true)
    terms: IDataRequestSearchTerm[],
    subparams: IDataRequestSearchParam[]
}

/**
 * Used to validate if a given data item fits search criteria
 */
interface IDataRequestSearchTerm {
    item: string, // The string name of the key being checked
    value: any, // The desired value of the key
    equals: boolean, // true -> check if item == value, false -> check if item != value
    strict: boolean, // true -> exact match of value, false -> item includes value
    istag?: boolean, // true -> checks if a tag with tag_name=value has tagvalue
    tagvalue?: any, // if left blank, just checks if tag_name exists
}

/**
 * Static-only class that returns desired JSON data
 */
class DataResponder {

    /**
     * Grabs the correct json file to search.
     * @param type The type of data to be searched
     * @returns JSON array of data to search
     */
    private static GetDataType(type: string, data : any[], language : string | undefined) {
        let RelevantSet : DataSetTC;
        if (language != undefined) {
            RelevantSet = DataByLanguageTable[language]
        } else {
            RelevantSet = DataByLanguageTable['ln_english']
        }
        switch(type) {
            case "models": {
                return RelevantSet.modelsdata.concat(data)
            }
            case "addons": {
                return RelevantSet.addonsdata.concat(data)
            }
            case "equipment": {
                return RelevantSet.equipmentdata.concat(data)
            }
            case "faction": {
                return RelevantSet.factiondata.concat(data)
            }
            case "variants": {
                return RelevantSet.variantdata.concat(data)
            }
            case "glossary": {
                return RelevantSet.glossarydata.concat(data)
            }
            case "scenario": {
                return RelevantSet.scenariodata.concat(data)
            }
            case "injuries": {
                return RelevantSet.injurydata.concat(data)
            }
            case "skills": {
                return RelevantSet.skilldata.concat(data)
            }
            case "skillgroup": {
                return RelevantSet.skillgroupdata.concat(data)
            }
            case "location": {
                return RelevantSet.location.concat(data)
            }
            case "exploremodifiers": {
                return RelevantSet.explorationmodifiers.concat(data)
            }
            case "exploration": {
                return RelevantSet.explorationtable.concat(data)
            }
            case "tablechart": {
                return RelevantSet.tablechartdata.concat(data)
            }
            case "tableresult": {
                return RelevantSet.tableresultdata.concat(data)
            }
            case "quickrules": {
                return RelevantSet.quickrulesdata.concat(data)
            }
            case "campaignrules": {
                return RelevantSet.campaignrulesdata.concat(data)
            }
            case "upgrade": {
                return RelevantSet.upgradedata.concat(data)
            }
            case "genDeed": {
                return RelevantSet.genDeeds.concat(data)
            }
            case "genDeployment": {
                return RelevantSet.genDeployment.concat(data)
            }
            case "genScenario": {
                return RelevantSet.genScenario.concat(data)
            }
            default: {
                return data
            }
        }
    }

    /**
     * Based on the provided search type, performs the appropriate
     * search using the request.
     * 
     * @param request The request object being read
     * @param search_type the string name of the search type
     * @returns The data returned by the data repo in response to the request
     */
    public static GetResponse(request: any, search_type : string, language_set : string) {
        request.language = language_set;
        switch(search_type) {
            case "id": {
                return DataResponder.GetSingleEntry(request);
            }
            case "file": {
                return DataResponder.GetFullDataEntry(request);
            }
            case "keyvalues": {
                return DataResponder.GetAllOfKeyInData(request);
            }
            case "complex": {
                return DataResponder.ComplexSearch(request);
            }
            case "tags": {
                return DataResponder.GetAllTagsInData(request);
            }
            default: {
                return []
            }
        }
    }

    /**
     * Grabs a single entry based on ID value
     * @param request JSON structure that provides the file to search and the ID to search by
     * @returns JSON object, either empty or containing the found entry
     */
    public static GetSingleEntry(request: IDataRequestID) {
        const dataSet = DataResponder.GetDataType(request.type, request.data, request.language)
        let i = 0;
        for (i = 0; i < dataSet.length; i++) {
            if (dataSet[i].id == request.id) {
                return dataSet[i]
            }
        }
        return {}
    }

    /**
     * Gets an entire data file
     * @param request Contains the name of the file to grab
     * @returns JSON array of all data in the specified file
     */
    public static GetFullDataEntry(request: IDataRequest) {
        const dataSet = DataResponder.GetDataType(request.type, request.data, request.language)
        return dataSet;
    }

    /**
     * Grabs all values of a given key in a data file
     * @param request The file to search and the name of the key to get values from
     * @returns Array of all values associated with the requested key in the requested file
     */
    public static GetAllOfKeyInData(request: IDataRequestID) {
        const dataSet = DataResponder.GetDataType(request.type, request.data, request.language)
        const valueSet: any = []

        let i = 0;
        for (i = 0; i < dataSet.length; i++) {
            const data = dataSet[i];
            const dynamicKey = request.id as keyof (typeof data);
            if ((data[dynamicKey] != undefined) && (data[dynamicKey] != "") && (!valueSet.includes(data[dynamicKey]))) {
                valueSet.push(data[dynamicKey])
            }
        }

        return valueSet;
    }

    /**
     * Grab all the different types of tag found in a given file
     * @param request The file to search the tags of
     * @returns Array of string names of tags
     */
    public static GetAllTagsInData(request: IDataRequest) {
        const dataSet = DataResponder.GetDataType(request.type, request.data, request.language)
        const valueSet: any = []

        let i = 0;
        for (i = 0; i < dataSet.length; i++) {

            let j = 0;
            for (j = 0; j < dataSet[i].tags.length; j++) {
                if (!valueSet.includes(dataSet[i].tags[j].tag_name)) {
                    valueSet.push(dataSet[i].tags[j].tag_name.toString())
                }
            }

        }

        return valueSet;
    }

    /**
     * Performs a complex search with a variety of filtering terms
     * by iterating through each entry in a data file and validating
     * if they meet the criteria
     * @param search Determines the file to search and criteria to search by
     * @returns JSON array of entries in a data file that match the criteria
     */
    public static ComplexSearch(search: IDataRequestComplexSearch) {
        const dataSet = DataResponder.GetDataType(search.type, search.data, search.language)
        const dataSelect = []

        let i = 0;
        for (i = 0; i < dataSet.length; i++) {
            if (DataResponder.ValidateComplexSearch(search.request, dataSet[i])) {
                dataSelect.push(dataSet[i]);
            }
        }
        return dataSelect;
    }

    /**
     * Validates if a data object should be included in the search based on a
     * parameter that combines multiple search terms with AND or OR operators.
     * @param term the list of search terms and sub-params
     * @param data the data object to check
     * @returns boolean if the data match all search criteria
     */
    public static ValidateComplexSearch(term: IDataRequestSearchParam, data: any) {
        let isvalid = false;
        let i = 0;
        
        for (i = 0; i < term.terms.length; i++) {
            const isSearch = DataResponder.ValidateBySearch(term.terms[i], data)
            if (term.operator == "and") {
                if (isSearch == false) {
                    return false;
                } else {
                    isvalid = true;
                }
            } else {
                if (isSearch) {
                    isvalid = true;
                }
            }
        }

        for (i = 0; i < term.subparams.length; i++) {
            const isSearch = DataResponder.ValidateComplexSearch(term.subparams[i], data)
            if (term.operator == "and") {
                if (isSearch == false) {
                    return false;
                } else {
                    isvalid = true;
                }
            } else {
                if (isSearch) {
                    isvalid = true;
                }
            }
        }

        return isvalid;
    }

    /**
     * Checks if the values of a data object match a single desired search term
     * @param term The desired key to check, value to want, and other requirements
     * @param data The data object being validated
     * @returns boolean if the data object matches the search term
     */
    public static ValidateBySearch(term: IDataRequestSearchTerm, data: any) {
        if (!term.istag) {
            const dynamicKey = term.item as keyof (typeof data);
            let isvalid = false;
            if (data[dynamicKey] != null) {
                if (term.strict) {
                    isvalid = data[dynamicKey].toString().toLowerCase() == term.value.toString().toLowerCase()
                } else {
                    isvalid = data[dynamicKey].toString().toLowerCase().includes(term.value.toString().toLowerCase())
                }
            } else {
                isvalid = false;
            }
            if (term.equals) {
                return (isvalid)
            } else {
                return (!isvalid)
            }
        } else {
            const dynamicKey = term.item as keyof (typeof data);

            if (term.tagvalue == "") {
                let i = 0;
                for (i = 0; i < data[dynamicKey].length; i++) {
                    if (term.strict) {
                        if (data[dynamicKey][i].tag_name.toString().toLowerCase() == term.value.toString().toLowerCase()) {
                            return (term.equals == true)
                        }
                    } else {
                        if (data[dynamicKey][i].tag_name.toString().toLowerCase().includes( term.value.toString().toLowerCase())) {
                            return (term.equals == true)
                        }
                    }
                }
                return (term.equals == false);
            } else {
                
                let i = 0;
                for (i = 0; i < data[dynamicKey].length; i++) {
                    if (data[dynamicKey][i].tag_name == term.value) {
                        if (term.strict) {
                            if (data[dynamicKey][i].val.toString().toLowerCase() == term.tagvalue.toString().toLowerCase()) {
                                return (term.equals == true)
                            }
                        } else {
                            if (data[dynamicKey][i].val.toString().toLowerCase().includes(term.tagvalue.toString().toLowerCase())) {
                                return (term.equals == true)
                            }
                        }
                    }
                }
                return (term.equals == false);
            }
        }
    }
}

export {DataResponder}