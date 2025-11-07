import { useEffect, useState } from 'react';
import * as $ from 'jquery';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Micro from "@amcharts/amcharts5/themes/Micro";
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as d3 from "d3-shape";
import InsertChartIcon from '@mui/icons-material/InsertChart';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NearbyErrorIcon from '@mui/icons-material/NearbyError';
import usePopUpMessage from '../../hooks/usePopUpMessage';
import { GRAPHICCOMPONENTS } from './graphicComponents/graphicComponents';
import { MESSAGES } from '../../constants/messages';
import { useFetchStore } from '../../store/useFetchStore';
import { useGraphicGeneralOptionsStore } from '../../store/useGraphicGeneralOptionsStore';
import { useSelectedItemsStore } from '../../store/useSelectedItemsStore';

/*
 * declare constant variables
 */
const NUMERICFIELD = "value"
const DATEFIELD = "time_sample"
const LOWVALUEFIELD = "MIN"
const HIGHVALUEFIELD = "MAX"
const Q1VALUEFIELD = "Q1"
const Q3VALUEFIELD = "Q3"
const MEADIANVALUEFIELD = "MEDIAN"
const DATEFORMAT = "yyyy-MM-dd HH:mm:ss.SSS"

function Graphic() {
	const [_, PopUpMessage] = usePopUpMessage()
	const { generalGraphicOptions } = useGraphicGeneralOptionsStore((state) => ({
		generalGraphicOptions: state.generalGraphicOptions
	}))

	const { data, error } = useFetchStore((state) => ({
        data: state.data,
        error: state.error
    }))

	const { selectedItems } = useSelectedItemsStore((state) => ({
        selectedItems: state.selectedItems
    }))

	// const getResponse = useSelector(state => state.getResponse)
	// const monitor = useSelector(state => state.monitor)
	// const reload = useSelector(state => state.reload)
	// const error = useSelector(state => state.searchErrors)
	const [noDataReceived, setNoDataReceived] = useState(false)
	
    let root // graphic root variable initialization
    
    const convertToLogarithm = (value) => (value > 0 ? Math.log10(value) : null)

    const removeNullEntries = (array) => array.filter(el => el !== null)

	/*
	 * handle the server's values for display
	 */
	const buildGraphicValues = (date, value, logarithm) => {
		try {
			const parseDate = parseInt(date)
			const parseValue = parseFloat(value)
			const value_ = logarithm ? convertToLogarithm(parseValue) : parseValue

			if (value_ === null) {
				PopUpMessage({type:'warning', message: MESSAGES.CantConvertToLogarithm})
				return {}
			}
			return {
				[DATEFIELD]: parseDate, 
				[NUMERICFIELD]: value_ 
			}
		} catch (error) {
			PopUpMessage({type:'error', message: error})
		}
	}

	/*
	 * handle server's values for collapse display using the collapseBind object
	 */
	const buildBoxplotGraphicValues = (date, _value, collapseBind) => {
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
				PopUpMessage({type:'error', message: MESSAGES.NotValidData})
			}
		} catch (error) {
			console.log(error)
		}
	}


	/*
	 * set columns monitor objects
	 */
	const setColumnsRowObjects = (row) => {
		try {
			let { name, position, unit, storagePeriod, summaryPeriod } = row

			if(generalGraphicOptions?.legendTrunkName) {
				name = name.split("/").at(-1)
			}
			name = `${name} ${position ? `/ ${position}` : ""}`
			const unit_abbr = unit ? unit.abbreviature : ""

			return { name, unit_abbr, storagePeriod, summaryPeriod }
		} catch (error) {
			console.error(error)
			return ""
		}
	}

	/*
	 * create data for configuration in the chart
	 */
	const getArrangeByMonitorData = (data_) => {
		try {
			const { columns, samples } = data_
			// we remove these two fields so that the indexes of the graphical monitor options match more easily
			if (columns[0].name === "TimeStamp") columns.splice(0, 2) // delete timeStamp, timeStampLong
			// get the index if it exists in the other array as many times as it appears
			const indexOfFrom_ = GRAPHICCOMPONENTS.getIndexFromID(columns, selectedItems)

			return columns.map((columns_row, index) => {
				const options = selectedItems[indexOfFrom_[index] || 0].options
                const { logarithm, limit_min, limit_max, isBoxplotEnable, boxplotOnlyCollapseValues } = options
                const min_l = limit_min || -Infinity
                const max_l = limit_max || Infinity

                const data = removeNullEntries(samples.map((sample_val) => {
					const { stateOrMagnitudeValuesBind, summaryValuesBind } = columns_row
                    const date = sample_val[1].substring(0, sample_val[1].length - 3)
                    let value = sample_val[index + 2]

                    if (value === "") return null
                    if (stateOrMagnitudeValuesBind) value = stateOrMagnitudeValuesBind[value]

                    if (summaryValuesBind && isBoxplotEnable && !boxplotOnlyCollapseValues) {
                        return buildBoxplotGraphicValues(date, value, summaryValuesBind)
                    } else {
                        return (value > min_l && value < max_l) ? buildGraphicValues(date, value, logarithm) : null
                    }
                }))

                return { ...setColumnsRowObjects(columns_row), ...options, data }
            })
		} catch (error) {
			console.log(error)
		}
	}

	/*
	 * get root selected theme
	 */
	const getRootTheme = () => {
		try {
			const setThemes = []
			if (generalGraphicOptions?.animations) setThemes.push(am5themes_Animated.new(root))
			if (generalGraphicOptions?.microTheme) setThemes.push(am5themes_Micro.new(root))
			return setThemes
		} catch (error) {
			console.log(error)
		}
	}

	/*
	*  Chart init
	*   - When the component is mounted, the root is initialized, since responseData is empty for the moment nothing is shown
	+   - When the responseData subscriber receives the data the function is executed again, the change of [responseData] will trigger the update of the function.
	*       - the same for [reload] the function will be updated with the new data
	+   - The root element of amchart cannot be duplicated, we avoid this by using the 'retun () => {...}' method to execute the 'dispose()' when the component is unmount
	*/
	useEffect(() => {
		root = am5.Root.new("chartdiv") // Create root element =ref=> <div id="chartdiv"></div>
		root.fps = 40
		console.log("data", data)

		try {
			if (error || !Object.keys(data).length) {
				setNoDataReceived(true)
			} else {
				if (data.samples.length || data.reportInfo.totalPages > 1) {
	
					console.log("datadfgndfoñlkgl")
	
					root.setThemes(getRootTheme())
					const graphicData = getArrangeByMonitorData(data)
					
					if(graphicData) {
						generateGraphic(graphicData)
						setNoDataReceived(false) // clear no data message
					} 
					else PopUpMessage({ type:'error', message: MESSAGES.CantProcessGraphicData })
				}
				else {
					setNoDataReceived(true)
					$("#initialImg").addClass('display-none')
				}
			}
		} catch (error) {
			console.error(error)
		}
		// store current value of root and clean root element when update
		root.current = root
		return () => {
			root.dispose()
		}
	}, [data, error, generalGraphicOptions])


/*
 * get Y renderer Axis
 */
const getYRenderer = (showGrid) => {
	try {
		const yRenderer = am5xy.AxisRendererY.new(root, { opposite: false })
		if (!showGrid) yRenderer.grid.template.set("visible", false)
		return yRenderer
	} catch (error) {
		console.log(error)
	}
}

/*
 * get X renderer Axis
 */
const getXRenderer = (showGrid) => {
	try {
		const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 100 })
		if (!showGrid) xRenderer.grid.template.set("visible", false)
		return xRenderer
	} catch (error) {
		console.log(error)
	}
}

/*
 * Calculate scale base count 
 */
const getMillisecondBaseCount = (graphicData) => {
	const globalSampling = data.sampling_period
	if (globalSampling === 0) {
		const totalSum = graphicData.reduce((sum, { summaryPeriod, storagePeriod }) => {
			const period = summaryPeriod || storagePeriod
			return sum + (period ? Math.trunc(period) : 2000000) / 1000
		}, 0)
		return totalSum / graphicData.length
	}
	return globalSampling / 1000
}

/*
 * Set properties configuration to a series function
 */
const seriesConfiguration = (data) => {
	try {
		const properties = {
			name: data.name,
			connect: !generalGraphicOptions?.gapsInData,
			valueYField: NUMERICFIELD,
			valueXField: DATEFIELD,
			calculateAggregates: true,
			legendLabelText: "{name}: ",
			legendRangeLabelText: "{name}: ",
			legendValueText: "[bold]{valueY}",
			legendRangeValueText: "{valueYClose}",
			minBulletDistance: 10
		}
		if (generalGraphicOptions?.showTooltip) {
			properties.tooltip = am5.Tooltip.new(root, {
				exportable: false,
				pointerOrientation: "horizontal",
				labelText: `[bold]{name}[/]\n{valueX.formatDate('${DATEFORMAT}')}\n[bold]{valueY}[/] ${data.unit_abbr}`
			})
		}
		if (data.curved) properties.curveFactory = d3.curveBumpX
		if (data.color) {
			properties.stroke = am5.color(data.color)
			properties.fill = am5.color(data.color)
		}
		return properties
	} catch (error) {
		console.log(error)
	}
}

/*
 * get CandlestickSeries default config
 */
const boxplotSeriesConfiguration = (name) => {

	return {
		fill: "#333",
		stroke: "#333",
		name: name,
		valueYField: Q1VALUEFIELD,
		openValueYField: Q3VALUEFIELD,
		lowValueYField: LOWVALUEFIELD,
		highValueYField: HIGHVALUEFIELD,
		valueXField: DATEFIELD,
		tooltip: am5.Tooltip.new(root, {
			pointerOrientation: "horizontal",
			labelText: `[bold]${name}[/]\n[bold]{valueX.formatDate('${DATEFORMAT}')}[/]\n${HIGHVALUEFIELD}: {highValueY}\n${Q3VALUEFIELD}: {openValueY}\n${MEADIANVALUEFIELD}: {MEDIAN}\n${Q1VALUEFIELD}: {valueY}\n${LOWVALUEFIELD}: {lowValueY}`
		})
	}
}

/*
 * // median series
 * get boxplot median values default options 
 */
const addMedianSeriesDefaultConf = (chart, dateAxis, valueAxis) => {
	return chart.series.push(
		am5xy.StepLineSeries.new(root, {
			stroke: "#d1d8d9",
			// name: MEADIANVALUEFIELD,
			xAxis: dateAxis,
			yAxis: valueAxis,
			valueYField: MEADIANVALUEFIELD,
			valueXField: DATEFIELD,
			noRisers: true
		})
	)
}

/*
 * add series to the chart 
 */
const addSeries = (chart, dateAxis, valueAxis, isBoxplotEnabled, elementData) => {
	try {
		const seriesType = elementData.graphicType
		const axis = { xAxis: dateAxis, yAxis: valueAxis }
		let series
		if(isBoxplotEnabled) {
			addMedianSeriesDefaultConf(chart, dateAxis, valueAxis).data.setAll(elementData.data)
			series = chart.series.push(am5xy.CandlestickSeries.new(root, 
				{...boxplotSeriesConfiguration(elementData.name), ...axis}))
		}
		else if(seriesType === "Step Line Series") {
			series = chart.series.push(am5xy.StepLineSeries.new(root, 
				{...seriesConfiguration(elementData), ...axis}))
		}
		else {
			series = chart.series.push(am5xy.LineSeries.new(root, 
				{...seriesConfiguration(elementData), ...axis}))
		}

		// Set Series line weight and dashArray view // this doesn't work with boxplot series type
		if(!isBoxplotEnabled){
			series.strokes.template.setAll({
				strokeWidth: GRAPHICCOMPONENTS.getLineStroke(elementData.stroke),
				strokeDasharray: GRAPHICCOMPONENTS.getLineCanvas(elementData.canvas)
			})
		}

		// Set filled
		if (elementData?.filled) {
			series.fills.template.setAll({
				visible: true,
				fillOpacity: 0.3
			})
		}
		return series
	} catch (error) {
		console.log(error)
	}
}

//----------------------------------------Generate Graphic-----------------------------------------------------
const generateGraphic = (graphicData) => {    
	// Set the root format number for received values depending on whether the number is integer or not
	const sciNotation = (generalGraphicOptions?.scientificNotation) ? "e" : ""
    root.numberFormatter.setAll({
		numberFormat: NUMBERFORMAT + sciNotation,
    })

    // Set Local Time Zone to avoid default date formating
    root.utc = true

    // Create chart
    const chart = root.container.children.push(
		am5xy.XYChart.new(root, {
			panY: false,
			wheelY: "zoomX",
			maxTooltipDistance: 0
		})
    )

    //  Add Value Y Axis, format suported -> 5e-7 or 0.0000005, 450000 or 45e+4
    // ***WARNING*** on this version the exponential format is up to 7, this does not work in the plugin: 1e-8, +etc...     
    const valueAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
		extraTooltipPrecision: 1,
		min: generalGraphicOptions?.limitMIN || false,
		max: generalGraphicOptions?.limitMAX || false,
		renderer: getYRenderer(generalGraphicOptions?.showGrid)
    }))

    // Set the format for representing the values and set the data count interval 
    const dateAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
		groupData: generalGraphicOptions?.groupData,
		maxDeviation: 0,
		baseInterval: {
			timeUnit: TIMEINTERVAL,
			count: getMillisecondBaseCount(graphicData)
		},
		renderer: getXRenderer(generalGraphicOptions?.showGrid)
    }))

    // Format the date depending on the time unit to be displayed
    dateAxis.get("dateFormats")[TIMEINTERVAL] = TIMEFORMAT

    // --- --- --- 
	// --- --- --- Add All series --- --- --- 
	// --- --- --- 


	graphicData.forEach(elementData => {
		// Is boxplot enabled
		const isBoxplotEnabled = elementData?.isBoxplotEnable && !elementData?.boxplotOnlyCollapseValues
		// Set Series
		const series = addSeries(chart, dateAxis, valueAxis, isBoxplotEnabled, elementData)
		// Set up data processor to parse string dates		
		series.data.processor = am5.DataProcessor.new(root, {
			dateFormat: TIMEINTERVAL,
			dateFields: [DATEFIELD]
		});
		// Set series DATA
		console.log("🚀 ~ generateGraphic ~ elementData.data:", elementData.data)
		series.data.setAll(elementData.data)
		// series.data.setAll(datas)
	});


	// TODO:
	// Create axis ranges
	// function createRange(series, value, endValue, color) {
	//   var rangeDataItem = valueAxis.makeDataItem({
	//     value: value,
	//     endValue: endValue
	//   });
	
	//   var range = series.createAxisRange(rangeDataItem);
	
	//   range.strokes.template.setAll({
	//     stroke: color,
	//     strokeWidth: 2
	//   });
	
	//   rangeDataItem.get("axisFill").setAll({
	//     fill: color,
	//     fillOpacity: 0.05,
	//     visible: true
	//   });
	// }
	// createRange(series, 30, 20, am5.color(0xf41a1a));
	// createRange(series, 10, 14, am5.color(0xf41a1a));



    /*
     * Set legends to the chart
     */
    if (generalGraphicOptions?.showLegends) {
		let chartLegend
		const legendSettings = {
			width: am5.percent(100),
			height: GRAPHICCOMPONENTS.getLegendHeight(graphicData.length),
			verticalScrollbar: am5.Scrollbar.new(root, {
				orientation: "vertical"
			})
		}

      	if (generalGraphicOptions?.legendPosition) { 
			chartLegend = chart.bottomAxesContainer
			.children.push(am5.Legend.new(root, legendSettings)) 
		}
    	else { 
			chartLegend = chart.rightAxesContainer
			.children.push(am5.Legend.new(root, legendSettings)) 
		}

		// align legends content in the container
		chartLegend.itemContainers.template.set("width", am5.p100)
		chartLegend.valueLabels.template.setAll({
			width: am5.p100,
			textAlign: "left"
		})
		// It is important to set the legend data after all events are set in the template, otherwise the events will not be applied.
		chartLegend.data.setAll(chart.series.values)
    }


	/*
	 * Set Cursor XY on the chart
	 */
	chart.set("cursor", am5xy.XYCursor.new(root, {
		behavior: "zoomX",
		xAxis: dateAxis
	}))

	/*
	 * if microTheme is active
	 */
	if (!generalGraphicOptions?.microTheme) {
		valueAxis.set("tooltip", am5.Tooltip.new(root, {
			themeTags: ["axis"]
		}));

		dateAxis.set("tooltip", am5.Tooltip.new(root, {
			themeTags: ["axis"]
		}))
	}

	/*
	 * Set Zoom ScrollBar
	 */
	// Horizontal Zoom
	const scrollbarX = am5.Scrollbar.new(root, {
		orientation: "horizontal",
		exportable: false
	})
	chart.set("scrollbarX", scrollbarX)
	// chart.bottomAxesContainer.children.push(scrollbarX);

	// Vertical Zoom
	const scrollbarY = am5.Scrollbar.new(root, {
		orientation: "vertical",
		exportable: false
	})
	chart.set("scrollbarY", scrollbarY)
	chart.leftAxesContainer.children.push(scrollbarY)

	/*
	 * Set Exporting menu
	 */
	am5exporting.Exporting.new(root, {
		menu: am5exporting.ExportingMenu.new(root, {}),
		// dataSource: data.responseData.samples,
		numericFields: [NUMERICFIELD],
		dateFields: [DATEFIELD],
		dateFormat: DATEFORMAT,
		dataFields: {
			value: "Value",
			time_sample: "Date"
		},
		dataFieldsOrder: ["date", "value"]
	})
} // end generateGraphic




	return(
		<div className="display-graphic-section">
			<div id="chartdiv" className="grafic-box">

			{/* The Graphic will be display here  => id="chartdiv"*/}
			{/* <InsertChartIcon id="initialImg" className="display-none" /> */}

			{
			(error) ? 
				<div className="server-error-error-message"> 
					<NearbyErrorIcon className="icon-server-error error-icon error-color" />
					<p>An error has ocurred!</p>
					<p>If the error persist</p>
					<p>please contact the administrators.</p>
				</div>
			:
			(noDataReceived) ?
				<div className="no-data-error-message">
					<LiveHelpIcon className="icon-no-data help-icon" />
					<MoreHorizIcon className="icon-no-data dot-icon" />
					<p>No Data Available.</p>
					<p>Try to use a different date range or a different Monitor.</p>
				</div>
			: ""
			}
			</div>
		</div>
	);
}

export default Graphic;