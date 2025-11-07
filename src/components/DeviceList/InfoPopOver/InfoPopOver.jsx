import { useState } from "react";
import { Popover } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import DeblurIcon from '@mui/icons-material/Deblur';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';


function InfoPopOver() {
    const [anchorEl, setAnchorEl] = useState(null)
    const handleClick = (event) => { setAnchorEl(event.currentTarget) }
    const handleClose = () => { setAnchorEl(null) }
    const open = Boolean(anchorEl)
    const idPopOver = open ? 'simple-popover' : undefined


    return ( 
        <>
            <div aria-describedby={idPopOver} className="help-popover-monitor-types" onClick={handleClick}>
                <HelpCenterIcon sx={{cursor: "pointer"}}/>
            </div>
            <Popover
                id={idPopOver}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: 'center',horizontal: 'right',}}
                transformOrigin={{vertical: 'center',horizontal: 'left',}}
            >
                <p className="monitor-type-info-title">Monitor Type description:</p>
                <div>
                    <p className="monitor-type-info-row">
                        <DeblurIcon className ="icon-info-type color-type-indicator_state" /> 
                        STATE: decive state transitions list
                    </p>
                    <p className="monitor-type-info-row">
                        <CircleIcon className ="icon-info-type color-type-indicator_scalar_blue" /> 
                        SCALAR: numeric values
                    </p>
                    <p className="monitor-type-info-row">
                        <CircleIcon className ="icon-info-type color-type-indicator_magnitud_gray" /> 
                        ENUM: key-value lists
                    </p>
                    <p className="monitor-type-info-row">
                        <DonutSmallIcon className ="icon-info-type color-type-indicator_array_yellow" />
                        SIMPLE ARRAY: monitor with multiple values 
                    </p>
                    <p className="monitor-type-info-row">
                        <DonutSmallIcon className ="icon-info-type color-type-indicator_doubleArray_purple" /> 
                        DOUBLE ARRAY: monitor with two dimensional values
                    </p>
                </div>
            </Popover>
        </>
    );
}

export default InfoPopOver;