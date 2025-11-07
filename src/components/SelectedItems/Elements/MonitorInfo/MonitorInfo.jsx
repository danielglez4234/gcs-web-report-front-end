import * as $  from 'jquery';
import { MTUtil } from '../../../../utils/monitorTypeUtils';
import { Stack } from '@mui/material';

function MonitorInfo({element}) {
    // "equeals" represents a default state if the node isn`t found"
    const {
        id = "--",
        name = "--",
        version = "None",
        type = "None",
        magnitudeType: { name: magnitudeName } = { name: "" }, // variable is rename to magnitudName
        config: { storage_period } = { storage_period: 0 },
        unit = "None"
    } = element

    /**
     * convert storage_period string seconds to label
     * example 1000000 = 1m
     */
    const convertToMilliseconds = (millis) => {
        if(millis >= 100000 && millis < 1000000) // second
            return `${millis / 1000}ms`

        if(millis >= 1000000 && millis < 60000000) // second
            return `${millis / 1000000}s`

        if(millis >= 60000000 && millis < 3,6e+9) // minutes
            return `${Math.floor((millis / 1000000) / 60)}m`

        return `${Math.floor((millis / 1000000) / 60)}h`
    }

    // If the button is alredy active when a new monitor is selected, apply the changes
	let lessDetailIfActive
	if ($('#lessDetail-icon').hasClass('color-menu-active')) {
		lessDetailIfActive = 'display-none'
	}

    return (
        <Stack className={`monitor-selected-info_component_id ${lessDetailIfActive}`} direction="row">
            <div className="monitor-selected-info-component">
                <span>{ name }</span>
            </div>
            <div className="monitor-selected-info">
                {
                    (MTUtil.IsState(type)) ? ""
                    :
                    <>
                        <span className='monitor-selected-element-info'>version: <span>{ version }</span></span>
                        {
                        (MTUtil.IsMagnitude(type)) ?
                            <span className='monitor-selected-element-info'>magnitudeType: <span>{ magnitudeName }</span></span>
                        :
                            <span className='monitor-selected-element-info'>unit: <span className="default-unit">{ unit }</span></span>
                        }
                    </>
                }
                {
                    storage_period ? <span className='monitor-selected-element-info'>sampling: <span>{ convertToMilliseconds(storage_period) }</span></span> : ""
                }
                <span className='monitor-selected-element-info'>type: <span>{ type }</span></span>
                <span className='monitor-selected-element-info'>id: <span>{ id }</span></span>
            </div>
        </Stack>
    );
}

export default MonitorInfo;