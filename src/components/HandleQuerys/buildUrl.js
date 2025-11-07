import { ITEMSDEFAULTOPTIONS, MONITOROPTIONSCATEGORY } from '../../constants/selectedItemsOptions';
import { MTUtil } from '../../utils/monitorTypeUtils';

const { REACT_APP_IDISPLAYLENGTH } = process.env

/**
 * URL expected result example:
 * http://calp-vwebrepo:8081/WebReport/rest/search/27/07/2025@00:00:00.000/29/07/2025@00:00:00.000/  \
 * ?idmonitor=8262 \  || no options where selected   
 * &idmonitor=8259%7Bunit:Dimensionless,prefix:Tera,decimal:0.%23%23%23%7D \ || % are keywords scapes for url special characters
 * &idmonitor=573%5B%5B0%5D;%5B2%5D%5D \
 * &sampling=1000000 \
 * &page=0&length=50000 
 * 
 * %7B → {
 * %7D → }
 * %5B → [
 * %5D → ]
 * %23 → #
 * %3B → ;
 */

/**
 * if is diferent return a value else return false
 */
const isDistinctFromDefault = (optionName, optionValue) => {
    const defaultValue = ITEMSDEFAULTOPTIONS[optionName]
    if (Array.isArray(defaultValue)) {
        return optionValue !== undefined && optionValue !== defaultValue[0]
    }
    return optionValue !== undefined && optionValue !== defaultValue
}

const getOptionKeyName = (key) => {
    // rename summary to interval
    if (key === "summary") return "interval"
    // rename collapseValue to attr
    if (key === "collapseValue") return "attr"

    return key
}

/*
 * build monitor prefix, unit and decimal options
 */
const buildOptions = (options) => {
    const needFetchKeysForFormat = [
        ...Object.values(MONITOROPTIONSCATEGORY?.needFetch.unitConvertions).flat(),
        ...Object.values(MONITOROPTIONSCATEGORY?.needFetch.summary).flat()
    ]
    const optionkeys = Object.keys(options).filter(
        key => needFetchKeysForFormat.includes(key)
    )
    const optionsMap = optionkeys.map((key) => {
        const value = options[key]
        if (
            value !== undefined &&
            value !== "" &&
            !(Array.isArray(value)) &&
            isDistinctFromDefault(key, value)
        ) {
            return `${getOptionKeyName(key)}:${value}`
        }
        return null
    }).filter(Boolean) // filter out false values, atomatically removes null or undefined values

    return optionsMap.length ? `${options.pos}{${optionsMap.join(",")}}` : `${options.pos}`; // join the position on the string even if no options were selected
}

/*
 * get format date
 */
const DateFormat = (date) => {
    try {
        return date.replace(/\s{1}/,"@") + ".000"
    } catch (error) {
        console.error(error)
    }
}

/*
 * buid url params // => main
 */
export function buildUrl(selectedItems, dateRange, subSampling) {
    try {
        const params = new URLSearchParams()

        selectedItems.forEach(({ id, name, type, options }) => {
            let paramsName = `id${MTUtil.getCategory(type)}` // idmonitor, idstate, idmagnitud
            let value = ""

            if (MTUtil.IsScalar(type) || MTUtil.IsArray(type)) {
                value += id
            } else if (MTUtil.IsState(type)) {
                value += name // device name
            } else {
                console.error("Error: Type is not supported. \n Please contact the system administrator.")
            }
            if (!MTUtil.IsMagnitude(type) || !MTUtil.IsState(type)) {
                value += buildOptions(options)
            }
            params.append(paramsName, value.toString())
        })
        params.append("sampling", subSampling)
        params.append("page", 0)
        params.append("length", REACT_APP_IDISPLAYLENGTH || 50000)

        console.log("~ Url:", params.toString())
        return `${DateFormat(dateRange.beginDate)}/${DateFormat(dateRange.endDate)}/?${params.toString()}`
    } catch (error) {
        console.error(error)
    }
}