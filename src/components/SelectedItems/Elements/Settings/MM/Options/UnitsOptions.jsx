import { Fragment, useEffect, useState } from "react";
import { ITEMSDEFAULTOPTIONS } from '../../../../../../constants/selectedItemsOptions';
import usePopUpMessage from '../../../../../../hooks/usePopUpMessage';
import { LtTooltip } from "../../../../../../assets/uiStyles/components";
import { ArrayUtils } from '../../../../../../utils/arrayUtils';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import HelpIcon from '@mui/icons-material/Help';
import { getUnitConversion } from '../../../../../../services/services';
import { useSelectedItemsStore } from "../../../../../../store/useSelectedItemsStore";


// DEFAULT OPTIONS
const {
    unit: defaultUnit, // rename
    decimal: defaultDecimal // rename
} = ITEMSDEFAULTOPTIONS

const ApplyChangesWarning = () => ( 
    <LtTooltip
        title={
            <Fragment>
                <b className="label-indHlp-tooltip">{"To apply these changes you have"}</b><br />
                <b className="label-indHlp-tooltip">{"to press the "}<i>{"'Search & Display'"}</i></b><br />
                <b className="label-indHlp-tooltip">{"button again."}</b>
            </Fragment>
        }
            placement="left" className="tool-tip-options">
        <AnnouncementIcon className="index-help-icon"/>
    </LtTooltip>
)


function UnitsOptions({element}) {
    const [_, PopUpMessage] = usePopUpMessage()
    const { updateOptions } = useSelectedItemsStore()

    const {
        unit, prefix, decimal
    } = element.options
    const { monitorUnit: { name: elementUnit /* rename to elementUnit */ } } = element


    const [inputs, setInputs] = useState({
        unit,
        prefix, 
        decimal
    })
    const [unitOptions, setUnitOptions] = useState([unit]) // [unit] -> is the default active option
    const [prefixesOptions, setPrefixesOptions] = useState([prefix]) // [prefix] -> is the default active option

    const handleOnCange = (value, name) => {
        setInputs(prevState => ({
            ...prevState,
            [name]: value
        }))
        updateOptions(element.id, name, value)
    }

	const [loading, setLoading] = useState(false)

	/**
	 * prevent duplicates and add default option
     */
	const preventDuplicatesOptions = (optionRecived, options) => {
		const options_ = [...defaultUnit, optionRecived, ...options] 
		return options_.filter((value, index, self) =>
			index === self.findIndex((t) => (
				t === value
			))
		)
	}

    /**
     * search on render
     */
    useEffect(() => {
        if(unitOptions.length < 2) {
            getcompatibleconversion()
        }
    }, [])

    /**
     *  get list of compatible units from the server
     */
    const getcompatibleconversion = () => {
        try {
            if(!elementUnit) {
                PopUpMessage({type:'error', message:'Falied to process the correponding unit conversion.'})
                return 
            }
            
            setLoading(true)
            Promise.resolve( getUnitConversion(elementUnit) )
            .then(res => {
                const { units = [], prefixes = [] } = res
                const fullName = prefixes.map(value => value.fullName)

                setUnitOptions(
                    (ArrayUtils.isEmpty(units)) ? defaultUnit : preventDuplicatesOptions(elementUnit, units).filter(item => item !== elementUnit)
                ) 
                setPrefixesOptions(
                    (ArrayUtils.isEmpty(units)) ? [] : preventDuplicatesOptions(prefix, fullName)
                )
            })
            .catch(error => {
                console.log(error)
                PopUpMessage({type:'error', message:'Error obtaining conpatible unit conversion.'})
                setUnitOptions([])
                setPrefixesOptions([])
            })
            .finally(() => {
                setLoading(false)
            })
        } catch (error) {
            console.log(error)
            PopUpMessage({type:'error', message:'Error prosesing the compatible unit conversion.'})
            setUnitOptions([])
            setPrefixesOptions([])
        }
    }



    return ( 
        <div className="monitor-selected-input-box">
            <div className="label-monitor-settings">Unit Conversion:</div>

            <div className="monitor-selected-input-label-selects">
                <span className="label-selects-grafic-type">Prefix:</span>
                <ApplyChangesWarning />
            </div>
            <div className="unit-and-prefix-box">

                <Autocomplete
                    disablePortal // --> disabled entrys not related with the select
                    disableClearable // --> disabled the posibility to leave the input empty
                    className="input-limits-grafic-options input-select-prefix prefix"
                    name="deimnalPattern"
                    loading={loading}
                    options={prefixesOptions}
                    onChange={(_, newValue) => {
                        handleOnCange(newValue, "prefix")
                    }}
                    value={inputs.prefix}
                    slotProps={{listbox : { sx: { '& li': { height: 32 } } }}}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        className={""}
                        slotProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                {loading ? <CircularProgress size={16} className="cicularProgress-unit" /> : null}
                                {params.InputProps.endAdornment}
                                </Fragment>
                            ),
                        }}
                    />
                    )}
                />

                <div className="monitor-selected-input-label-selects">
                    <span className="monitor-selected-input-label-selects label-selects-grafic-type">Unit:</span>
                    <ApplyChangesWarning />
                </div>

                <Autocomplete
                    disablePortal // --> disabled entrys not related with the select
                    className="input-limits-grafic-options input-select-unit"
                    name="deimnalPattern"
                    disableClearable
                    onOpen={() => {
                        if(unitOptions.length < 2) {
                            getcompatibleconversion()
                        }
                    }}
                    loading={loading}
                    options={unitOptions}
                    onChange={(e, newValue) => {
                        handleOnCange(newValue, "unit")
                    }}
                    value={inputs.unit}
                    slotProps={{listbox : { sx: { '& li': { height: 32 } } }}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            className={"unit-type"}
                            slotProps={{
                            ...params.InputProps,
                                endAdornment: (
                                    <Fragment>
                                    {loading ? <CircularProgress size={16} className="cicularProgress-unit" /> : null}
                                    {params.InputProps.endAdornment}
                                    </Fragment>
                                ),
                            }}
                        />
                    )}
                />
            </div>

            <div className="monitor-selected-input-label-selects">
                <span className="monitor-limits-label">Decimal Pattern: </span>
                <LtTooltip
                title={
                    <Fragment>
                    <b className="label-indHlp-tooltip">{"Info:"}</b><br />
                    <span className="indHlp-vis">{"This option set how many decimals places"}</span><br />
                    <span className="indHlp-vis">{"you want to display in the value."}</span><br />
                    </Fragment>
                }
                placement="left" className="tool-tip-options">
                <HelpIcon className="index-help-icon"/>
                </LtTooltip>

                <ApplyChangesWarning />

            </div>
            <Autocomplete
                disablePortal
                disableClearable
                id={`Pattern` + element.id}
                name="deimnalPattern"
                className="input-limits-grafic-options input-select-pattern deimnalPattern"
                options={defaultDecimal}
                onChange={(e, newValue) => {
                    handleOnCange(newValue, "decimal")
                }}
                value={inputs.decimal}
                renderInput={(params) => <TextField {...params} />}
            />
        </div> 
    );
}

export default UnitsOptions;