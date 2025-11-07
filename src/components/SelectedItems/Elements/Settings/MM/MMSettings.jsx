import { useState, useRef } from 'react';
import { Box, ClickAwayListener, Divider, IconButton, Popper } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import PresentationOptions from './Options/PresentationOptions';
import LimitsOptions from './Options/LimitsOptions';
import GraphicSeriesOptions from './Options/GraphicSeriesOptions';
import UnitsOptions from './Options/UnitsOptions';
import ArraysSelectionOptions from './Options/ArraysSelectionOptions';
import { MTUtil } from '../../../../../utils/monitorTypeUtils';
import SummaryOptions from './Options/SummaryOptions';
import { ITEMSDEFAULTOPTIONS, MONITOROPTIONSCATEGORY } from '../../../../../constants/selectedItemsOptions';

// get catogory of the options
const { 
    needFetch: {
        summary, 
        unitConvertions 
    }, 
    graphicOnly:{
        presentation
    }
} = MONITOROPTIONSCATEGORY

function MMSettings({element}) {
    const { id, type } = element
    const [openSettingsOptions, setOpenSettings] = useState(false)
    const settingdAnchorRef = useRef(null)
    const [openUnitConverionOptions, setOpenUnitConverion] = useState(false)
    const unitAnchorRef = useRef(null)
    const [openSummaryOptions, setOpenSummaryOptions] = useState(false)
    const summaryAnchorRef = useRef(null)

    /**
     * Toggles the visibility of the settings options.
     */
    const toggleOpenSettings = () => {
        setOpenSettings(!openSettingsOptions)
    }

    /**
     * Toggles the visibility of the unit conversion options.
     */
    const toggleOpenUnitConverion = () => {
        setOpenUnitConverion(!openUnitConverionOptions)
    }

    /**
     * Toggles the visibility of the summary options.
     */
    const toggleOpenSummaryOptions = () => {
        setOpenSummaryOptions(!openSummaryOptions)
    }

    /**
     * base on the category recieved it will check if the option is distinct from the default value
     * @param {array<string>} category - The category of the option to check.
     */
    const isDistinctFromDefault = (_element, category) => {
        return category.some(option => {
            const currentValue = _element?.options?.[option]
            const defaultValue = ITEMSDEFAULTOPTIONS[option]
            if (Array.isArray(defaultValue)) {
                return currentValue !== undefined && currentValue !== defaultValue[0]
            }
            return currentValue !== undefined && currentValue !== defaultValue
        })
    }

    return (
        <>
            {
                (!MTUtil.IsArray(type)) ? ""
                :
                <ArraysSelectionOptions element={ element } />
            }
            {
                (!element?.summaryConfigs) ? ""
                :
                <IconButton
                    ref={summaryAnchorRef}
                    onClick={() => {
                        toggleOpenSummaryOptions()
                    }}
                    arai-label="tune-setings"
                    className={`opt-button-color-white id-TuneIcon-sett` + id}
                >
                    <CandlestickChartIcon sx={{color: isDistinctFromDefault(element, summary) ? "#ffd841" : "#FFFFFF"}} />
                </IconButton>
            }
            {
                (MTUtil.IsMagnitude(type) || MTUtil.IsState(type) || (element?.monitorUnit?.name?.toLowerCase() === "none")) ? ""
                :
                <IconButton
                    ref={unitAnchorRef}
                    onClick={() => {
                        toggleOpenUnitConverion()
                    }}
                    arai-label="tune-setings"
                    className={`opt-button-color-white id-TuneIcon-unit-sett` + id}
                >
                    <FormatUnderlinedIcon sx={{color: isDistinctFromDefault(element, unitConvertions) ? "#ffd841" : "#FFFFFF"}} />
                </IconButton>
            }
            <IconButton
                ref={settingdAnchorRef}
                onClick={() => {
                    toggleOpenSettings()
                }}
                arai-label="tune-setings"
                className={`opt-button-color-white id-TuneIcon-sett` + id}
            >
                <TuneIcon sx={{color: isDistinctFromDefault(element, presentation) ? "#ffd841" : "#FFFFFF"}} />
            </IconButton>

            {
                (!element?.summaryConfigs) ? ""
                :
                <Popper
                    open={openSummaryOptions}
                    anchorEl={summaryAnchorRef.current}
                    sx={{zIndex: 99}}
                    placement="right-start"
                    modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
                >
                <ClickAwayListener onClickAway={toggleOpenSummaryOptions}>
                    <Box className={`setting-selectd-monitor-options-box id-mon-sett-unit` +id} id="mon-settings-unit-sx" sx={{boxShadow: 3}}>
                        <div className="corner-decoration" onClick={toggleOpenSummaryOptions}></div>

                        <div className="monitor-selected-select-contain"></div>
                        <div className="monitor-selected-select-box">
                            <SummaryOptions element={element} />
                        </div>
                    </Box>
                </ClickAwayListener>
                </Popper>
            }

            {
                (MTUtil.IsMagnitude(type) || MTUtil.IsState(type)) ? ""
                :
                <Popper
                    open={openUnitConverionOptions}
                    anchorEl={unitAnchorRef.current}
                    sx={{zIndex: 99}}
                    placement="right-start"
                    modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
                >
               <ClickAwayListener onClickAway={toggleOpenUnitConverion}>
                    <Box className={`setting-selectd-monitor-options-box id-mon-sett-unit` +id} id="mon-settings-unit-sx" sx={{boxShadow: 3}}>
                        <div className="corner-decoration" onClick={toggleOpenUnitConverion}></div>

                        {/* <div className="monitor-selected-select-contain"></div> */}
                        <div className="monitor-selected-select-box">
                            <UnitsOptions element={ element } />
                        </div>
                    </Box>
                </ClickAwayListener>
                </Popper>
            }
            {
                !openSettingsOptions ? ""
                :
                <Popper
                    open={openSettingsOptions}
                    anchorEl={settingdAnchorRef.current}
                        sx={{zIndex: 99}}
                        placement="right-start"
                        modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
                    >
                    <ClickAwayListener onClickAway={toggleOpenSettings}>
                        <Box className={`setting-selectd-monitor-options-box id-mon-sett` + id} id="mon-settings-sx" sx={{boxShadow: 7}}>
                            <div className="corner-decoration" onClick={toggleOpenSettings}></div>

                            <div className="monitor-selected-select-box">
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                    <PresentationOptions element={ element } />
                                    <Divider sx={{borderColor: "#ffffff3b", margin: "15px 0"}} flexItem />
                                    <LimitsOptions element={ element } />
                                </div>
                                <Divider sx={{borderColor: "#ffffff3b", margin: "0 15px"}} orientation='vertical' flexItem />
                                <GraphicSeriesOptions element={ element } />
                            </div>

                        </Box>
                    </ClickAwayListener>
                </Popper>
            }
        </>
    );
}

export default MMSettings;