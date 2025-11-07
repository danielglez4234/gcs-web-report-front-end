import { useState } from "react";
import { ITEMSDEFAULTOPTIONS } from "../../../../../../constants/selectedItemsOptions";
import { useSelectedItemsStore } from '../../../../../../store/useSelectedItemsStore';

// DEFAULT OPTIONS
const {
    limitMax: defaultLimitMax,
    limitMin: defaultLimitMin
} = ITEMSDEFAULTOPTIONS

function LimitsOptions({element}) {
    const { updateOptions } = useSelectedItemsStore()

    const [limits, setLimits] = useState({
        limitMax: element?.options?.limitMax || defaultLimitMax,
        limitMin: element?.options?.limitMin || defaultLimitMin
    })

    const handleOnCange = (e) => {       
        setLimits(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    /**
     * onblur update the options
     */
    const handleOnBlur = (e) => {
        updateOptions(element.id, e.target.name, e.target.value)
    }

    return (
        <div className="limtis-monnitor-settings-box">
            <div className="label-monitor-settings">Limits:</div>
            <div className="limtis-monnitor-settings-inputs">
                <label className="monitor-limits-label "> Max: </label>
                <input
                    className="input-limits-grafic-options yaxisMax"
                    name="limitMax"
                    type="text"
                    max="9999999"
                    min="-9999999"
                    placeholder="0.."
                    onBlur={(e) => {
                        handleOnBlur(e)
                    }}
                    onChange={(e) => {
                        handleOnCange(e)
                    }}
                    value={limits.limitMax}
                />
                <label className="monitor-limits-label"> Min: </label>
                <input
                    className="input-limits-grafic-options yaxisMin"
                    name="limitMin"
                    type="text"
                    max="9999999"
                    min="-9999999"
                    placeholder="0.."
                    onBlur={(e) => {
                        handleOnBlur(e)
                    }}
                    onChange={(e) => {
                        handleOnCange(e)
                    }}
                    value={limits.limitMin}
                />
            </div>
        </div>
    );
}

export default LimitsOptions;