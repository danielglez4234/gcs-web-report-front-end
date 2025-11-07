import { MESSAGES } from "../../../constants/messages"
import { GRAPHICCOMPONENTS } from "./graphicComponents/graphicComponents"


const NUMERICFIELD = "value"
const DATEFIELD = "time_sample"

const buildSeriesValues = (date, value, logarithm) => {
	try {
		const parseDate = parseInt(date)
		const parseValue = value ? parseFloat(value) : null
		const value_ = logarithm ? GRAPHICCOMPONENTS.convertToLogarithm(parseValue) : parseValue

		// if (value_ === null) {
		// 	console.error(MESSAGES.CantConvertToLogarithm)
		// 	return {}
		// }
		return {
			[DATEFIELD]: parseDate, 
			[NUMERICFIELD]: value_ 
		}
	} catch (error) {
		console.error(error)
		return {}
	}
}

const buildBoxplotSeriesValues = (date, _value, collapseBind) => {
	try {
		const arr_value = GRAPHICCOMPONENTS.stringToArray(_value)
		if(Array.isArray(arr_value)) {
			const instance = {}
			const time_sample = parseInt(date)

			for (const [key, valueIndex] of Object.entries(collapseBind)) {
				instance[key] = parseFloat(arr_value[valueIndex])
			}
			return { time_sample, ...instance }
		}
		else{
			console.error(MESSAGES.NotValidData)
			return {}
		}
	} catch (error) {
		console.log(error)
		return {}
	}
}

const buildSeriesDisplayInfo = (row) => {
	try {
		let { name, position, unit, storagePeriod, summaryPeriod } = row

		name = `${name} ${Object.is(position, -1) ? "": `/ ${position}` }`
		const unit_abbr = unit ? unit.abbreviature : ""

		return { name, unit_abbr, storagePeriod, summaryPeriod }
	} catch (error) {
		console.error(error)
		return ""
	}
}


/**
 * Sets the columns row objects with the necessary properties for the graphic components.
 */
export function buildData (data_, selectedItems_) {
	try {
		const { columns, samples } = data_
		// we remove these two fields so that the indexes of the graphical monitor options match more easily
		if (columns[0].name === "TimeStamp") columns.splice(0, 2) // delete timeStamp, timeStampLong
		// get the index if it exists in the other array as many times as it appears
		const indexOfFrom_ = GRAPHICCOMPONENTS.getIndexFromID(columns, selectedItems_)

		return columns.map((columns_row, index) => {
			const options = selectedItems_[indexOfFrom_[index] || 0].options
			const { logarithm, limitMin, limitMax, isBoxplotEnable, boxplotOnlyCollapseValues } = options
			const min_l = limitMin || -Infinity
			const max_l = limitMax || Infinity
			
			const data = GRAPHICCOMPONENTS.removeNullEntries(samples.map((sample_val) => {
				const { stateOrMagnitudeValuesBind, summaryValuesBind } = columns_row
				const date = sample_val[1].substring(0, sample_val[1].length - 3)
				// const date = sample_val[1] > 1e13 ? Math.floor(sample_val[1] / 1000) : sample_val[1];
				// console.log("🚀 ~ buildData ~ date:", date)
				let value = sample_val[index + 2]

				if (value === "") return null
				if (stateOrMagnitudeValuesBind) value = stateOrMagnitudeValuesBind[value]

				if (summaryValuesBind && isBoxplotEnable && !boxplotOnlyCollapseValues) {
					return buildBoxplotSeriesValues(date, value, summaryValuesBind)
				} else {
					return (value > min_l && value < max_l) ? buildSeriesValues(date, value, logarithm) : null
				}
			}))

			return { ...buildSeriesDisplayInfo(columns_row), ...options, data }
		})
	} catch (error) {
		console.log(error)
	}
}