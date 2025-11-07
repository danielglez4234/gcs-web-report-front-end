/**
 * Default options for the selected monitor.
 *
 * @type {Object}
 * @property {string[]} graphicType - The available graphic types.
 * @property {boolean} logarithm - Indicates if logarithm is enabled.
 * @property {boolean} curved - Indicates if curved lines are enabled.
 * @property {boolean} filled - Indicates if filled areas are enabled.
 * @property {boolean} enabledColor - Indicates if color is enabled.
 * @property {string} limitMax - The maximum limit.
 * @property {string} limitMin - The minimum limit.
 * @property {string} color - The line color.
 * @property {string[]} pos - The array positions.
 * @property {string[]} stroke - The line stroke options.
 * @property {string[]} canvas - The line canvas options.
 * @property {string[]} decimal - The decimal options.
 * @property {string[]} unit - The unit options.
 * @property {string[]} prefix - The prefix options.
 * @property {boolean} isBoxplotEnable - Indicates if boxplot is enabled.
 * @property {string} boxplotInterval - The boxplot interval.
 * @property {boolean} boxplotOnlyCollapseValues - Indicates if only collapse values are enabled.
 * @property {string} boxplotCollapseValue - The collapse value.
 */
export const ITEMSDEFAULTOPTIONS = {
    logarithm: false,
    curved: false,
    filled: false,
    limitMax: "",
    limitMin: "",
    graphicType: [ "Line Series", "Step Line Series" ],
    stroke: [ "Medium", "Light", "Bold", "Bolder" ],
    canvas: [ "Default", "Dotted", "Dashed", "Large Dashed", "Dotted Dashed"],
    enabledColor: false,
    color: "",
    unit: [""], // it gets filled with the unit of the monitor request on the server
    prefix: [""], // it gets filled with the prefix of the monitor request on the server
    decimal: [ "Default", "0.#", "0.##", "0.###", "0.####", "0.#####", "0.######", "0.#######", "0.########" ],
    pos: "",
    isBoxplotEnable: false,
    boxplotInterval: "1 minute",
    boxplotOnlyCollapseValues: false,
    boxplotCollapseValue: "",
}
/**
 * Category for the selected monitor options.
 * this is used to categorize the options for the selected monitor in the application.
 * meening that the options are grouped by their functionality.
 * For example, the options that are related to the graphic presentation
 * are grouped in the `presentation` category, and the options that are related to the position
 * are grouped in the `position` category. This is because they will be handled in different ways when the user does a request to the server.
 * At the same time there is a parent category for each group of options.
 * the graphicOnly category represents the options that are only related to the graphic presentation in the aplication.
 * the needFetch category represents the options that are related to petitioning the server for data arrangement.
 * This allows to easily access the options and to know which options are related to each other.
 * @type {Object}
 */
export const MONITOROPTIONSCATEGORY = {
    graphicOnly: {
        presentation: [
            "logarithm",
            "curved",
            "filled",
            "graphicType",
            "stroke",
            "canvas",
            "enabledColor",
            "limitMax",
            "limitMin",
            "color"
        ],
    },
    needFetch: {
        position: [
            "pos",
        ],
        unitConvertions: [
            "decimal",
            "unit",
            "prefix"
        ],
        summary: [
            "boxplotInterval",
            "boxplotCollapseValue"
        ]
    },
}

export const MONITOROPTIONSKEYS = Object.keys(ITEMSDEFAULTOPTIONS)
    
