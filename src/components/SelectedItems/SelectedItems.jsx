
import SideBar from './ActionBars/SideBar';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import { useSelectedItemsStore } from '../../store/useSelectedItemsStore';
import BottomBar from './ActionBars/BottomBar';
import Elements from './Elements/Elements';
import ApplyChangesButton from './ApplyChangesButton';
import { useEffect } from 'react';
import { useSubSystemStore } from '../../store/useSubSystemStore';

const InitialInfoText = () => (
    <div className="no_monitor_selected">
        <DataUsageIcon className="img_monitor_selected"/>
        <p className="no_monitor_selected_message">Select an item from the list</p>
    </div>
)


function SelectedItems() {
    const { selectedItems } = useSelectedItemsStore((state) => {
        return {
            selectedItems: state.selectedItems
        };
    })
    const { activeSubSystem } = useSubSystemStore((state => ({
        activeSubSystem: state.activeSubSystem
    })))
    const { removeAll } = useSelectedItemsStore()
    console.log("🚀 ~ SelectedItems ~ selectedItems:", selectedItems)

    useEffect(() => {
        if(!activeSubSystem) return
        removeAll()
    }, [activeSubSystem])

    return ( 
        <div className="selected-monitors-section">
            <div className="selected-monitors-select-all">
                <div className="selected-monitors-select-all-title"> Selected Items </div>

				{/* <ResetToCurrentSearch /> */}
				<ApplyChangesButton />

            </div>
            <div className="menu-monitorSelected-contain">
                <SideBar />

                <div id="resizable" data-bottom="true" className="selected-monitors-box">
					{
					(selectedItems.length === 0) ? <InitialInfoText/> :
						<table id="drop-area" className="table-selected-monitors">
							<tbody>
							{
								selectedItems.map((element) =>
									<Elements
										key = { element.id  }
										id = { element.id }
										element = { element }
                                        activeSubSystem = { activeSubSystem }
									/>
								)
							}
							</tbody>
						</table>
					 }
				</div>

            </div>

            <BottomBar monitorsCount={selectedItems.length}/>

        </div>
    );
}

export default SelectedItems;