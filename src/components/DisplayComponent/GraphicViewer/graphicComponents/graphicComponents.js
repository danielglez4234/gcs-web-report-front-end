import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Micro from "@amcharts/amcharts5/themes/Micro";
import * as am5 from "@amcharts/amcharts5";
import * as d3 from "d3-shape";
import * as am5xy from "@amcharts/amcharts5/xy";

const NUMERICFIELD = "value"
const DATEFIELD = "time_sample"
const LOWVALUEFIELD = "MIN"
const HIGHVALUEFIELD = "MAX"
const Q1VALUEFIELD = "Q1"
const Q3VALUEFIELD = "Q3"
const MEADIANVALUEFIELD = "MEDIAN"
const DATEFORMAT = "yyyy-MM-dd HH:mm:ss.SSS"


export const GRAPHICCOMPONENTS = {
/**
 * Convert to logarithm
 */
convertToLogarithm: (value) => {
	try {
		if (value > 0) return Math.log10(value)
		return null
	} catch (error) {
		return null
	}
},
/*
 * obtain the index of the element of the second matrix that matches it
 */
getIndexFromID: (fromArray, inArray) => {
    return fromArray.map((val) => inArray.findIndex(object => object.id === val.id))
},
/*
 * transform from string to array
 * expected str => eg. "[12, 32 ,3456, 7865, 345, 34]"
 */
stringToArray: (str) => {
	try {
		// delete first and last "[ ]" and split
		return str.substring(1).slice(0, -1).split(',')
	} catch (error) {
		console.error(error)
		return []
	}
},
/*
 * remove null entries from array
 */
removeNullEntries: (array) => {
    return array.filter((el) => el !== null)
},



getRootTheme: (g_options, root) => {
    try {
        const setThemes = []
        if (g_options?.animations) setThemes.push(am5themes_Animated.new(root))
        if (g_options?.microTheme) setThemes.push(am5themes_Micro.new(root))
        return setThemes
    } catch (error) {
        console.log(error)
    }
},

/**
 * 
 */

medianSeriesConfiguration: (root, chart, xAxis, yAxis) => {
    return chart.series.push(
        am5xy.StepLineSeries.new(root, {
            stroke: "#d1d8d9",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: MEADIANVALUEFIELD,
			valueXField: DATEFIELD,
            noRisers: true
        })
    )
},

boxplotSeriesConfiguration: (root, chart, xAxis, yAxis, serie) => {
    return chart.series.push(
        am5xy.CandlestickSeries.new(root, {
            fill: "#333",
            stroke: "#333",
            name: serie.name,
            xAxis: xAxis,
			yAxis: yAxis,
            valueYField: Q1VALUEFIELD,
            openValueYField: Q3VALUEFIELD,
            lowValueYField: LOWVALUEFIELD,
            highValueYField: HIGHVALUEFIELD,
            valueXField: DATEFIELD,
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: `[bold]${serie.name}[/]\n[bold]{valueX.formatDate('${DATEFORMAT}')}[/]\n${HIGHVALUEFIELD}: {highValueY}\n${Q3VALUEFIELD}: {openValueY}\n${MEADIANVALUEFIELD}: {MEDIAN}\n${Q1VALUEFIELD}: {valueY}\n${LOWVALUEFIELD}: {lowValueY}`
            })
        })
    )
},

lineSeriesConfiguration: (root, chart, xAxis, yAxis, serie, generalGraphicOptions) => {
    const { graphicType, name, curved, color, unit_abbr } = serie
    const props = {
        name: name,
        connect: true,
        xAxis: xAxis,
		yAxis: yAxis,
        valueYField: NUMERICFIELD,
        valueXField: DATEFIELD,
        calculateAggregates: false,
        legendLabelText: "{name} ",
        legendRangeLabelText: "{name} ",
        // legendValueText: "[bold]{valueY}",
        // legendRangeValueText: "{valueYClose}",
        minBulletDistance: 10,
    }
    if (generalGraphicOptions?.showTooltip) {
        props.tooltip = am5.Tooltip.new(root, {
            exportable: false,
            pointerOrientation: "horizontal",
            labelText: `[bold]{name}[/]\n{valueX.formatDate('${DATEFORMAT}')}\n[bold]{valueY}[/] ${unit_abbr}`
        })
    }
    if (curved) {
		props.curveFactory = d3.curveBumpX
	}
    if (color) {
        props.stroke = am5.color(color)
        props.fill = am5.color(color)
    }
    return chart.series.push(
        graphicType === "Step Line Series" 
            ? am5xy.StepLineSeries.new(root, props)
            : am5xy.LineSeries.new(root, props)
    )
},


/*
 * get line stroke
 */
getLineStroke: (stroke) => {
	try {
		const stroke_ = {
			default: 1,
			light: 1,
			medium: 2,
			bold: 3,
			bolder: 4
		}
		return stroke_[stroke.toLowerCase()] || stroke_.default
	} catch (error) {
		console.log(error)
	}
},
/*
 * get line canvas 
 */
getLineCanvas: (canvas) => {
	try {
		const canvas_ = {
			default: false,
			dotted: ["1"],
			dashed: ["3","3"],
			largedashed: ["10"],
			dotteddashed: ["10", "5", "2", "5"]
		}
		return canvas_[canvas.trim().toLowerCase()] || canvas_.default
	} catch (error) {
		console.log(error)
	}
},
/*
 * get legend height
 */
getLegendHeight: (length) => {
	try {
		const lengendLength_ = {
			default: 150,
			"1": 50,
			"2": 50,
			"3": 80,
			"4": 110
		}
		return lengendLength_[length.toString()] || lengendLength_.default
	} catch (error) {
		console.log(error)
	}
},
}