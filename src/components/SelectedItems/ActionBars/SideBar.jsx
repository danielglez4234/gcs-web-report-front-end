import * as $  from 'jquery';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DetailsIcon from '@mui/icons-material/Details';
import { LtTooltip } from '../../../assets/uiStyles/components';
import { useSelectedItemsStore } from '../../../store/useSelectedItemsStore';


function SideBar() {
    const { removeAll } = useSelectedItemsStore()
    const { resetDefaultsOptions } = useSelectedItemsStore()
    /**
     * @description This function is used to toggle the display of the monitor-selected-info_component_id class
     */
	const lessDetails = () => {
		$('.monitor-selected-info_component_id').toggleClass('display-none')
		$('.lessDetail-icon').toggleClass('color-menu-active')
	}

    return ( 
        <div className="table-selected-monitors-options">
            <LtTooltip 
                onClick={() => {
                    resetDefaultsOptions()
                }} 
                title="Reset Options" 
                placement="left" 
                className="tool-tip-options"
            >
                <SettingsBackupRestoreIcon className="table-selected-clearAll-icon reset-menu-icon"/>
            </LtTooltip>
            <LtTooltip 
                onClick={() => { 
                    removeAll()
                }} 
                title="Clear All" 
                placement="left" 
                className="tool-tip-options"
            >
                <ClearAllIcon className="table-selected-clearAll-icon"/>
            </LtTooltip>
            <LtTooltip 
                onClick={() => {
                    lessDetails()
                }}
                title="Less Details"
                placement="left"
                className="tool-tip-options"
            >
                <DetailsIcon id="lessDetail-icon" className="table-selected-clearAll-icon lessDetail-icon"/>
            </LtTooltip>
        </div>
    )
}

export default SideBar;