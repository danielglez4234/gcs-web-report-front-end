import { Fragment, useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { ITEMSDEFAULTOPTIONS } from '../../../../../../constants/selectedItemsOptions';
import { useSelectedItemsStore } from "../../../../../../store/useSelectedItemsStore";

// DEFAULT OPTIONS
const {
    logarithm: defaultLogarithm,
    curved: defaultCurved,
    filled: defaultFilled
} = ITEMSDEFAULTOPTIONS

function PresentationOptions({element}) {
    const { updateOptions } = useSelectedItemsStore()

    const [presentation, setPresentation] = useState({          
        logarithm: element?.options?.logarithm || defaultLogarithm,
        curved: element?.options?.curved || defaultCurved,
        filled: element?.options?.filled || defaultFilled
    })

    const handleOnChange = (e) => {
        const name = e.target.name
        const value = e.target.checked
        setPresentation(prevState => ({
            ...prevState,
            [name]: value
        }))
        updateOptions(element.id, name, value)
    }

    return (
        <div className="checkbox-monitor-selected">
            <div className="label-monitor-settings">Presentation:</div>
            <div className="input-settings-checkbox">
                <FormControlLabel
                    sx={{ margin: "-2px 0px"}}
                    label={
                        <Fragment>
                            <b className="checkbox-monitor-selected-label">{"Logarithm"}</b>
                        </Fragment>
                    }		
                    control={
                        <Checkbox
                            sx={{ '&:hover': { bgcolor: 'transparent' }}}
                            size="small"
                            name={"logarithm"}
                            onChange={(e) => {
                                handleOnChange(e)
                            }}
                            checkedIcon={<CheckBoxIcon sx={{color: "#ea1884 "}} /> }
                            icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
                            checked={ presentation.logarithm } 
                        />
                    }
                />
                <FormControlLabel
                    sx={{margin: "-2px 0px"}}
                    label={
                        <Fragment>
                            <b className="checkbox-monitor-selected-label">{"Curved"}</b>
                        </Fragment>
                    }
                    control={
                        <Checkbox
                            sx={{ '&:hover': { bgcolor: 'transparent' }}}
                            size="small"
                            name={"curved"}
                            onChange={(e) => {
                                handleOnChange(e)
                            }}
                            checkedIcon={<CheckBoxIcon sx={{color: "#52c8bd"}} /> }
                            icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
                            checked={ presentation.curved } 
                        />
                    }
                />
                <FormControlLabel
                    sx={{margin: "-2px 0px"}}
                    label={
                        <Fragment>
                            <b className="checkbox-monitor-selected-label">{"Filled"}</b>
                        </Fragment>
                    }
                    control={
                        <Checkbox
                            sx={{ '&:hover': { bgcolor: 'transparent' }}}
                            size="small"
                            name={"filled"}
                            onChange={(e) => {
                                handleOnChange(e)
                            }}
                            checkedIcon={<CheckBoxIcon sx={{color: "#99d9bb "}} /> }
                            icon={<CheckBoxOutlineBlankIcon sx={{color: "#9396a4"}} />}
                            checked={ presentation.filled }
                        />
                    }
                />
            </div>
        </div>
    );
}

export default PresentationOptions;