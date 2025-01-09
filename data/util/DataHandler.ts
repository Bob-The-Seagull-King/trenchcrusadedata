// Data File Imports -----------------------------------

/////////////////////////////// ENGLISH ///////////////////////////////
import en_modelsdata from '../data/player/models.json'
import en_addonsdata from '../data/player/addons.json'
import en_glossarydata from '../data/references/glossary.json'
import en_equipmentdata from '../data/player/equipment.json'
import en_factiondata from '../data/player/factions.json'
import en_variantdata from '../data/player/variants.json'
import en_scenariodata from '../data/scenarios/scenarios.json'
import en_injurydata from '../data/general/injuries.json'
import en_skilldata from '../data/general/skills.json'
import en_skillgroupdata from '../data/general/skillgroup.json'
import en_explorationtable from '../data/general/explorationcharts.json'
import en_explorationmodifiers from '../data/general/explorationmodifiers.json'
import en_location from '../data/general/explorationitems.json'
import en_tablechartdata from '../data/references/tablecharts.json'
import en_tableresultdata from '../data/references/tableresults.json'
import en_quickrulesdata from '../data/references/quickrules.json'
import en_campaignrulesdata from '../data/references/campaignrules.json'
import en_genDeeds from '../data/scenarios/gen_deeds.json'
import en_genDeployment from '../data/scenarios/gen_deployment.json'
import en_genScenario from '../data/scenarios/gen_scenario.json'
import en_upgradedata from '../data/player/upgrades.json'
/////////////////////////////// ENGLISH ///////////////////////////////

// -----------------------------------------------------


export interface LanguageDataTable {[languageID: string]: DataSetTC}

export interface DataSetTC {
    modelsdata : any,
    addonsdata : any,
    glossarydata : any,
    equipmentdata : any,
    factiondata : any,
    variantdata : any,
    scenariodata : any,
    injurydata : any,
    skilldata : any,
    skillgroupdata : any,
    explorationtable : any,
    explorationmodifiers : any,
    location : any,
    tablechartdata : any,
    tableresultdata : any,
    quickrulesdata : any,
    campaignrulesdata : any,
    genDeeds : any,
    genDeployment : any,
    genScenario : any,
    upgradedata : any
}

export const DataByLanguageTable : LanguageDataTable = {
    ln_english: {
        modelsdata : en_modelsdata,
        addonsdata : en_addonsdata,
        glossarydata : en_glossarydata,
        equipmentdata : en_equipmentdata,
        factiondata : en_factiondata,
        variantdata : en_variantdata,
        scenariodata : en_scenariodata,
        injurydata : en_injurydata,
        skilldata : en_skilldata,
        skillgroupdata : en_skillgroupdata,
        explorationtable : en_explorationtable,
        explorationmodifiers : en_explorationmodifiers,
        location : en_location,
        tablechartdata : en_tablechartdata,
        tableresultdata : en_tableresultdata,
        quickrulesdata : en_quickrulesdata,
        campaignrulesdata : en_campaignrulesdata,
        genDeeds : en_genDeeds,
        genDeployment : en_genDeployment,
        genScenario : en_genScenario,
        upgradedata : en_upgradedata
    }
}