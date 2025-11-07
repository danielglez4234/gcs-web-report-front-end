import {Fragment, useState} from 'react';
import {
    TextField, 
    Autocomplete, 
    // CircularProgress,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { ITEMSDEFAULTOPTIONS } from '../../../../../../constants/selectedItemsOptions';
import { useSelectedItemsStore } from '../../../../../../store/useSelectedItemsStore';

// DEFAULT OPTIONS
const {
    isBoxplotEnable: defaultIsBoxplotEnable,
    boxplotOnlyCollapseValues: defaultBoxplotOnlyCollapseValues,
    boxplotInterval: defaultBoxplotInterval,
    boxplotCollapseValue: defaultBoxplotCollapseValue
} = ITEMSDEFAULTOPTIONS

const SummaryOptions = ({element}) => {
    const { updateOptions } = useSelectedItemsStore()

    const intervalOptions = element?.summaryConfigs?.data.map(x => x.interval) || []
	const collapseValuesOptions = element?.summaryConfigs?.values || []

    const [boxplot, setBoxplot] = useState({
		isBoxplotEnable: element?.options?.isBoxplotEnable || defaultIsBoxplotEnable,
		boxplotOnlyCollapseValues: element?.options?.boxplotOnlyCollapseValues || defaultBoxplotOnlyCollapseValues,
		boxplotInterval: element?.options?.boxplotInterval || defaultBoxplotInterval,
		boxplotCollapseValue: element?.options?.boxplotCollapseValue || defaultBoxplotCollapseValue
	})
    
    const handleOnChangeAutoComplete = (e, newValue) => {
        const name = e.target.name
        setBoxplot(prevState => ({
            ...prevState,
            [name]: newValue
        }))
        updateOptions(element.id, name, newValue)
    }

    const handleOnChangeCheckbox = (e) => {
        const name = e.target.name
        const value = e.target.checked
        setBoxplot(prevState => ({
            ...prevState,
            [name]: value
        }))
        updateOptions(element.id, name, value)
    }


    return (
        <div className="monitor-selected-input-box">
            <div className="label-monitor-settings">BoxPlot:</div>

            <div className="checkbox-monitor-selected">
                <div className="input-settings-checkbox">
                    <FormControlLabel
                        sx={{margin: "-2px 0px"}}
                        label={
                            <Fragment>
                                <b className="checkbox-monitor-selected-label">                  
                                    Enable BoxPlot
                                </b>
                            </Fragment>
                        }
                        control={
                            <Checkbox
                                sx={{ '&:hover': { bgcolor: 'transparent' }}}
                                size="small"
                                name="isBoxplotEnable"
                                onChange={(e) => {
                                    handleOnChangeCheckbox(e)
                                }}
                                checkedIcon={<CheckBoxIcon sx={{color: "#52c8bd"}} /> }
                                icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
                                checked={boxplot.isBoxplotEnable} 
                            />
                        }
                    />
                </div>
            </div>

          
			<span className="monitor-selected-input-label-selects label-selects-grafic-type">Summary Intervals:</span>
		
            <div className="limtis-monnitor-settings-box">
                <Autocomplete
                    disablePortal
                    disableClearable
                    className="input-limits-grafic-options input-select-prefix"
                    name="boxplotInterval"
                    options={intervalOptions}
                    onChange={(e, newValue) => {
                        handleOnChangeAutoComplete(e, newValue)
                    }}
                    value={boxplot.boxplotInterval}
                    renderInput={(params) => (
                        <TextField {...params} />
                    )}
                />
            </div>

            <div className="checkbox-monitor-selected space-on-top">
                <div className="input-settings-checkbox">
                    <FormControlLabel
                        sx={{margin: "-2px 0px"}}
                        label={
                            <Fragment>
                                <b className="checkbox-monitor-selected-label">{"Collapse value"}</b>
                            </Fragment>
                        }
                        control={
                            <Checkbox
                                sx={{ '&:hover': { bgcolor: 'transparent' }}}
                                size="small"
                                name="boxplotOnlyCollapseValues"
                                onChange={(e) => {
                                    handleOnChangeCheckbox(e)
                                }}
                                checkedIcon={<CheckBoxIcon sx={{color: "#52c8bd"}} /> }
                                icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
                                checked={boxplot.boxplotOnlyCollapseValues} 
                            />
                        }
                    />
                </div>
            </div>

          
			<span className="monitor-selected-input-label-selects label-selects-grafic-type">Collapse Values:</span>
		 
            <div className="limtis-monnitor-settings-box">
                <Autocomplete
                    disablePortal
                    disableClearable
                    className="input-limits-grafic-options input-select-prefix"
                    name="boxplotCollapseValue"
                    options={collapseValuesOptions}
                    onChange={(e, newValue) => {
                        handleOnChangeAutoComplete(e, newValue)
                    }}
                    value={boxplot.boxplotCollapseValue}
                    renderInput={(params) => (
                        <TextField {...params} />
                    )}
                />
            </div>
        </div>
     );
}

export default SummaryOptions;