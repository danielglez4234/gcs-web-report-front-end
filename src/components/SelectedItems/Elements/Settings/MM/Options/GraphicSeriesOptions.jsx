import { useRef, useState } from 'react';
import { Autocomplete, Button, Checkbox, ClickAwayListener, Popper, TextField } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { ITEMSDEFAULTOPTIONS } from '../../../../../../constants/selectedItemsOptions';
import { MTUtil } from '../../../../../../utils/monitorTypeUtils';
import { useSelectedItemsStore } from '../../../../../../store/useSelectedItemsStore';
import { TwitterPicker } from 'react-color';


// DEFAULT OPTIONS
const { 
    graphicType: defaultGraphicType,
    stroke: defaultStroke,
    canvas: defaultCanvas,
    color: defaultColor,
    enabledColor: defaultEnabledColor
 } = ITEMSDEFAULTOPTIONS



function GraphicSeriesOptions({element}) {
    const colorAnchorRef = useRef(null)
    const [openHandleColor, setOpenHandleColor] = useState(false)

    const toggleOpenHandleColor = () => {
        setOpenHandleColor(!openHandleColor)
    }
    const handleCloseColor = () => {
        setOpenHandleColor(false)
    }

    const { updateOptions } = useSelectedItemsStore()
    const isEnumOrMonitor = (MTUtil.IsMagnitude(element.type))
        ? defaultGraphicType[1]
        : defaultGraphicType[0]
    
    // by destructuring the object we can set the default values
    // if the object does not have the properties
    const {
        graphicType = isEnumOrMonitor,
        stroke = defaultStroke[1],
        canvas = defaultCanvas[0],
        color = defaultColor,
        enabledColor = defaultEnabledColor
    } = element.options


    const [presentation, setPresentation] = useState({ graphicType, stroke, canvas, color, enabledColor })

    const handleOnChange = (value, name) => { // newValue is a parameter for autocomplete component
        setPresentation(prevState => ({
            ...prevState,
            [name]: value
        }))
        updateOptions(element.id, name, value)
    }

    return (
        <div className="monitor-selected-input-box">

            <div className="label-monitor-settings">Graphic Series:</div>

            <span className="monitor-selected-input-label-selects label-selects-grafic-type">Grafic Type:</span>
                <Autocomplete
                    disablePortal
                    disableClearable
                    id={`grafic-type` + element.id}
                    name={"graphicType"}
                    className="input-limits-grafic-options input-select-graphic grafic-type"
                    options={defaultGraphicType}
                    onChange={(e, newValue) => {
                        handleOnChange(newValue, "graphicType")
                    }}
                    value={presentation.graphicType}
                    renderInput={(params) => <TextField {...params} />}
                />
            <div className="visualization-monitor-settings">
            <span className="monitor-selected-input-label-selects">Stroke:</span>
                <Autocomplete
                    disablePortal
                    disableClearable
                    id={`strokeWidth` + element.id}
                    name="stroke"
                    className="input-limits-grafic-options input-select-graphic stroke-width"
                    options={defaultStroke}
                    onChange={(e, newValue) => {
                        handleOnChange(newValue, "stroke")
                    }}
                    value={presentation.stroke}
                    renderInput={(params) => <TextField {...params} />}
                />
            <span className="monitor-selected-input-label-selects">Canvas:</span>
                <Autocomplete
                    disablePortal
                    disableClearable
                    id={`canvas` + element.id}
                    name="canvas"
                    className="input-limits-grafic-options input-select-graphic canvas-width"
                    options={defaultCanvas}
                    onChange={(e, newValue) => {
                        handleOnChange(newValue, "canvas")
                    }}
                    value={presentation.canvas}
                    renderInput={(params) => <TextField {...params} />}
                />
            <span className="monitor-selected-input-label-selects">Color:</span>
            <div className="monitor-selected-checkbox-color">
                <Checkbox
                    sx={{ '&:hover': { bgcolor: 'transparent' }, position: "relative", top: "-5px" }}
                    size="small"
                    onChange={(e) => {
                        handleOnChange(e.target.checked, "enabledColor")
                        if(presentation.enabledColor) handleOnChange("", "color") // reset color
                        if(!e.target.checked) handleCloseColor()
                    }}
                    checkedIcon={<CheckBoxIcon sx={{color: "#fff"}} /> }
                    icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
                    checked={presentation.enabledColor} 
                />
                <Button
                    ref={colorAnchorRef}
                    disabled={!presentation.enabledColor}
                    variant='contained'
                    size='small'
                    sx={{backgroundColor: presentation.color, width: "30px", height: "30px", "&:hover": {backgroundColor: presentation.color}}}
                    onClick={(e) => {
                        toggleOpenHandleColor()
                    }}
                >
                </Button>
                <Popper
                    open={openHandleColor}
                    anchorEl={colorAnchorRef.current}
                    sx={{zIndex: 99}}
                    placement="bottom-start"
                    modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
                >
                    <TwitterPicker
                        color={ presentation.color }
                        onChangeComplete={(e) => {handleOnChange(e.hex, "color")}}
                    />
                </Popper>   
            </div>
            </div>
                            
        </div>
    );
}

export default GraphicSeriesOptions;