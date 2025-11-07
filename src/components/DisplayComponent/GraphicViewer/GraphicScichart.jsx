import { useEffect } from 'react';
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import InsertChartIcon from '@mui/icons-material/InsertChart';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NearbyErrorIcon from '@mui/icons-material/NearbyError';
import usePopUpMessage from '../../../hooks/usePopUpMessage';
import { MESSAGES } from '../../../constants/messages';
import { useFetchStore } from '../../../store/useFetchStore';
import { useGraphicGeneralOptionsStore } from '../../../store/useGraphicGeneralOptionsStore';
import { useSelectedItemsStore } from '../../../store/useSelectedItemsStore';
import { GRAPHICCOMPONENTS } from "./graphicComponents/graphicComponents";
import { buildData } from './buildData';
import ButtonJumpNextPage from './ButtonJumpNextPage';

function inferBaseInterval(chartData) {
  let minDelta = Infinity;

  for (const serie of chartData) {
    const d = (serie?.data || []).slice().sort((a,b) => a.time_sample - b.time_sample);
    for (let i = 1; i < d.length; i++) {
      const dt = d[i].time_sample - d[i-1].time_sample;
      if (dt > 0 && dt < minDelta) minDelta = dt;
    }
  }

  if (!isFinite(minDelta) || minDelta <= 0) minDelta = 1000; // fallback to 1s

 // Mapea a "pasos bonitos" y, sobre todo, no ultra finos
  if (minDelta < 10)   return { timeUnit: "millisecond", count: 10  };
  if (minDelta < 50)   return { timeUnit: "millisecond", count: 50  };
  if (minDelta < 100)  return { timeUnit: "millisecond", count: 100 };
  if (minDelta < 250)  return { timeUnit: "millisecond", count: 250 };
  if (minDelta < 500)  return { timeUnit: "millisecond", count: 500 };
  if (minDelta < 1000) return { timeUnit: "millisecond", count: 100 }; // 1s
  if (minDelta < 5000) return { timeUnit: "second",      count: 1 };
  if (minDelta < 10000)return { timeUnit: "second",      count: 5 };
  if (minDelta < 60000)return { timeUnit: "second",      count: 10 };
  return { timeUnit: "minute", count: 1 };
}

// Lista de intervalos permitidos para el grid del eje (el eje elegirá según zoom)
const NICE_GRID_INTERVALS = [
  { timeUnit: "millisecond", count: 10  },
  { timeUnit: "millisecond", count: 50  },
  { timeUnit: "millisecond", count: 100 },
  { timeUnit: "millisecond", count: 250 },
  { timeUnit: "millisecond", count: 500 },
  { timeUnit: "second", count: 1   },
  { timeUnit: "second", count: 5   },
  { timeUnit: "second", count: 10  },
  { timeUnit: "minute", count: 1   },
  { timeUnit: "minute", count: 5   },
  { timeUnit: "hour", count: 1   }
];



const { boxplotSeriesConfiguration, lineSeriesConfiguration, medianSeriesConfiguration } = GRAPHICCOMPONENTS

const addSeries = (root, chart, xAxis, yAxis, serie, generalGraphicOptions) => {
    const { boxplotOnlyCollapseValues, isBoxplotEnable, stroke, canvas, filled } = serie
    let seriesType = null
    
    if(isBoxplotEnable && !boxplotOnlyCollapseValues) 
    {
        const medianSeries = medianSeriesConfiguration(root, chart, xAxis, yAxis)
        medianSeries.data.setAll(serie.data)
        seriesType = boxplotSeriesConfiguration(root, chart, xAxis, yAxis, serie)
    }
    else {
        seriesType = lineSeriesConfiguration(root, chart, xAxis, yAxis, serie, generalGraphicOptions)

        seriesType.strokes.template.setAll({
            strokeWidth: GRAPHICCOMPONENTS.getLineStroke(stroke),
            strokeDasharray: GRAPHICCOMPONENTS.getLineCanvas(canvas)
        })
        if(filled) {
            seriesType.fills.template.setAll({
                visible: true,
                fillOpacity: 0.3
            })
        }
    }
    return seriesType
}


function GraphicSciChart() {
    const [_, PopUpMessage] = usePopUpMessage()
	const { generalGraphicOptions } = useGraphicGeneralOptionsStore((state) => ({
		generalGraphicOptions: state.generalGraphicOptions
	}))
    const { loading, data, error, noDataReceived, needJumpToNextPage } = useFetchStore((state) => ({
        loading: state.loading,
        data: state.data,
        error: state.error,
        noDataReceived: state.noDataReceived,
        needJumpToNextPage: state.needJumpToNextPage
    }))
    const { selectedItems, appliedOptions } = useSelectedItemsStore((state) => ({
        selectedItems: state.selectedItems,
        appliedOptions: state.appliedOptions
    }))

    let root

    useEffect(() => {
        root = am5.Root.new("chartdiv")
        root.fps = 40
        try {
            if ((!error && !noDataReceived && !needJumpToNextPage) && Object.keys(data).length) 
            {
                root.setThemes(GRAPHICCOMPONENTS.getRootTheme(generalGraphicOptions, root)) 
                const chartData = buildData(data, selectedItems)
                initChart(chartData)
            }
        } catch (error) {
            console.error(error)
            PopUpMessage({ type:'error', message: MESSAGES.CantProcessGraphicData })
        }
		root.current = root
		return () => {
			root.dispose()
		}
	}, [loading, error, noDataReceived, appliedOptions])

    /**
     * Initialize the chart with the given data.
     * @param {am5.Object} chartData 
     */
    const initChart = (chartData) => {
        const sciNotation = (generalGraphicOptions?.scientificNotation) ? "e" : ""
        root.numberFormatter.setAll({
            numberFormat: "#" + sciNotation,
        })
 
        // Set Local Time Zone to avoid default date formating
        root.utc = true

        const chart = root.container.children.push(am5xy.XYChart.new(root, {
            panY: false,
			wheelY: "zoomX",
            paddingLeft: 0,
            maxTooltipDistance: 0
        }))


        // Create X date axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        const baseInterval = inferBaseInterval(chartData);
        console.log("🚀 ~ initChart ~ baseInterval:", baseInterval)
        const xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            groupData: false,
            maxDeviation: 0,
            baseInterval,
            markUnitChange: false,
            renderer: am5xy.AxisRendererX.new(root, {
                minorGridEnabled:true,
                minGridDistance: 100
            }),
            tooltip: am5.Tooltip.new(root, {})
        }))
        xAxis.set("gridIntervals", NICE_GRID_INTERVALS);
        xAxis.get("dateFormats")["millisecond"] = "HH:mm:ss.SSS"
        xAxis.setAll({
            strictMinMax: false
        })

        // Create Y value axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            extraTooltipPrecision: 1,
            min: generalGraphicOptions?.limitMIN ?? undefined,
            max: generalGraphicOptions?.limitMAX ?? undefined,
            renderer: am5xy.AxisRendererY.new(root, {
                opposite: false,
            })  
        }))

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        chartData.forEach((serie) => {
            const series = addSeries(root, chart, xAxis, yAxis, serie, generalGraphicOptions)

            // Set series data
            series.data.setAll(serie.data)
        })

        // Legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend/
        if (generalGraphicOptions?.showLegends) 
        {
            let legend
            const legendSettings = {
                width: am5.percent(100),
                height: GRAPHICCOMPONENTS.getLegendHeight(chartData.length),
                verticalScrollbar: am5.Scrollbar.new(root, {
                    orientation: "vertical"
                })
            }
            if (generalGraphicOptions?.legendPosition) { 
                legend = chart.bottomAxesContainer
                .children.push(am5.Legend.new(root, legendSettings)) 
            }
            else { 
                legend = chart.rightAxesContainer
                .children.push(am5.Legend.new(root, legendSettings)) 
            }

            legend.itemContainers.template.events.on("pointerover", function(e) {
            let itemContainer = e.target

            // As series list is data of a legend, dataContext is series
            let series = itemContainer.dataItem.dataContext

            chart.series.each(function(chartSeries) {
                if (chartSeries != series) {
                chartSeries.strokes.template.setAll({
                    strokeOpacity: 0.15,
                    stroke: am5.color(0x000000)
                })
                } else {
                chartSeries.strokes.template.setAll({
                    strokeWidth: 3
                })
                }
            })
            })

            // When legend item container is unhovered, make all series as they are
            legend.itemContainers.template.events.on("pointerout", function(e) {
            chart.series.each(function(chartSeries) {
                chartSeries.strokes.template.setAll({
                    strokeOpacity: 2,
                    strokeWidth: 2,
                    stroke: chartSeries.get("fill")
                })
            })
            })

            // align legends content in the container
            legend.itemContainers.template.set("width", am5.p100)
            legend.valueLabels.template.setAll({
                width: am5.p100,
                textAlign: "left"
            })
            // It is important to set the legend data after all events are set in the template, otherwise the events will not be applied.
            legend.data.setAll(chart.series.values)
        }

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "zoomX",
            xAxis: xAxis
        }))
        cursor.lineY.set("visible", false)
        cursor.set("snapToSeries", chart.series.values)

        // Exporting and Zooming
        const scrollbarX = am5.Scrollbar.new(root, {
            orientation: "horizontal",
            exportable: false
        })
        chart.set("scrollbarX", scrollbarX)
        // Vertical Zoom
        const scrollbarY = am5.Scrollbar.new(root, {
            orientation: "vertical",
            exportable: false
        })
        chart.set("scrollbarY", scrollbarY)
        chart.leftAxesContainer.children.push(scrollbarY)
        // Set Exporting menu
        am5exporting.Exporting.new(root, {
            menu: am5exporting.ExportingMenu.new(root, {}),
            // dataSource: data.responseData.samples,
            numericFields: ["value"],
            dateFields: ["time_sample"],
            dateFormat: "yyyy-MM-dd HH:mm:ss.SSS",
            dataFields: {
                value: "Value",
                time_sample: "Date"
            },
            dataFieldsOrder: ["date", "value"]
        })
    }
    
    return ( 
		<div className="display-graphic-section">
			<div id="chartdiv" className="grafic-box">
                {
                (loading) ? 
                    <div className="spinner-box">
                        <div className="spinner">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className="spinner-text">Getting data...</div>
                    </div>
                :
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
                :
                (needJumpToNextPage) ?
                    <div className="jump-next-page-message">
                        <ButtonJumpNextPage />
                    </div>
                :
                <InsertChartIcon id="initialImg" className="display-none" />
                }
			</div>
		</div>
    );
}

export default GraphicSciChart;



