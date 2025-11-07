import { useState, useEffect } from "react";
import usePopUpMessage from '../../hooks/usePopUpMessage';
import MonitorElement from './Elements/MonitorElement';
import DeviceElement from './Elements/DeviceElement';
import InfoPopOver from "./InfoPopOver/InfoPopOver";
import { Error, NoMonitorElements, NoSelectedDevice, SkeletonList, NoResultFound } from "./ListStates/DeviceListStates";
import { getDevices, getMonitorsFromDevice } from '../../services/services';
import * as $  from 'jquery';
import Fuse from 'fuse.js';
import { useSelectedItemsStore } from "../../store/useSelectedItemsStore";
import { 
    Search,
    SearchIconWrapper,
    StyledInputBase 
 } from '../../assets/uiStyles/components';
import { Stack, IconButton } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import SearchIcon from '@mui/icons-material/Search';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useSubSystemStore } from "../../store/useSubSystemStore";
import { SUSBSYSTEMS } from "../../constants/subSystems";

const subSystemMM = SUSBSYSTEMS.MM;
const subSystemLM = SUSBSYSTEMS.LM;

function DeviceList() {
    const { selectedItems } = useSelectedItemsStore((state) => ({
        selectedItems: state.selectedItems
    }))
    const { add } = useSelectedItemsStore()
    const {activeSubSystem } = useSubSystemStore((state) => ({
        activeSubSystem: state.activeSubSystem
    }))

    const [, PopUpMessage] = usePopUpMessage()
    
    const [deviceList, setDeviceList] = useState([])
    const [monitorList, setMonitorList] = useState([])

    const [loadingDevices, setLoadingDevices] = useState(true) // the search start at render
    const [loadingMonitors, setLoadingMonitors] = useState(false)
    const [connectionError, setConnectionError] = useState(false)

    const [initialMonitorsListsState, setInitialMonitorsListsState] = useState(true)
    const [monitorsAvailable, setMonitorsAvailable] = useState(true)
    const [selectedDevice, setSelectedDevice] = useState("")

    // handle search result devices and monitors
    const [resultQueryDevices, setResultQueryDevices] = useState([])
    const [resultQueryMonitors, setResultQueryMonitors] = useState([])

    // on category control
    const [subSystemConf, setSubSystemConf] = useState({
        hideMonitorSection: false,
        selectableDevice: false,
    })

    /**
     * change the display of the device and monitor lists based on the selected subsystem
     * @param {string} subSystem 
     */
    const changeDisplay = (subSystem) => {
        // reset
        setMonitorList([])
        setResultQueryMonitors([])
        setInitialMonitorsListsState(true)
        setSelectedDevice("")

        if(subSystem === subSystemMM.id) {
            setSubSystemConf((prev) => ({
                ...prev,
                hideMonitorSection: false,
                selectableDevice: false
            }))
        } else if(subSystem === subSystemLM.id) {
            setSubSystemConf((prev) => ({
                ...prev,
                hideMonitorSection: true,
                selectableDevice: true
            }))
            setMonitorsAvailable(false)
        }
    }
    useEffect(() => {
        if(!activeSubSystem) return
        changeDisplay(activeSubSystem)
    }, [activeSubSystem])

    /**
     * @description get devices from the server
     */
    const loadDevices = () => {
        Promise.resolve( getDevices() )
        .then(res => {
            setConnectionError(false)
            setDeviceList(res)
            setResultQueryDevices(res)
        })
        .catch(error => {
            setConnectionError(true)
			PopUpMessage({type:'error', message:'Error fetching components data on the Server'})
            console.error(error)
        })
        .finally(() => {
            setLoadingDevices(false)
        })
    }

    /**
     * @description load devices on mount
     */
    useEffect(() => {
        $("#initialImg").removeClass('display-none')
        loadDevices()
    }, [])

    /**
     * @description try to reconnect asking for devices again
     */
    const tryReconnect = () => {
        setLoadingDevices(true)
        loadDevices()
    }

    /**
     * @description build the monitor list object from the selected device
     * @param {object} data
     * @returns {[{name, magnitude: string, id, type: string}, ...*, ...*]|*[]}
     */
    const buildMonitorList = (data) => {
        try {
            const{ 
                id: component_id, 
                name, 
                magnitudeDescriptions,
                monitorDescription
            } = data
            const magnitudes = magnitudeDescriptions.map(el => ({
                ...el,
                component_id,
                name
            }))
            const monitors = monitorDescription.map(el => ({
                ...el,
                component_id,
                name
            }))
            const stateDescriptions = {
                id: component_id,
                name,
                magnitude: 'STATE',
                type: 'state'
            }
            return [stateDescriptions, ...monitors, ...magnitudes]
        } catch (error) {
            PopUpMessage({type: 'error', message: 'Error building monitor list'})
            return []
        }
    }

    /**
     * @description get monitors from the selected device
     * @param {string} deviceName
     */
    const loadMonitors = (deviceName) => {
        if(selectedDevice === deviceName) // if the same device is clicked return
            return

        // reset the value of the search input when a component is clicked
        document.getElementById('searchInputCompMon').value = ''

        setInitialMonitorsListsState(false)
        setSelectedDevice(deviceName)
        setLoadingMonitors(true)

        Promise.resolve( getMonitorsFromDevice(deviceName) )
        .then(res => {
            const { magnitudeDescriptions, monitorDescription } = res
            if(magnitudeDescriptions.length > 0 || monitorDescription.length > 0)
            {
                setMonitorsAvailable(false) // reset if present
                const list = buildMonitorList(res)
                setMonitorList(list)
                setResultQueryMonitors(list)
            }
            else setMonitorsAvailable(true)
        })
        .catch(error => {
            PopUpMessage({type: 'error', message: 'Error fetching monitors data on the Server'})
            console.error(error)
        })
        .finally(() => {
            setLoadingMonitors(false)
        })
    }

    /**
     * @description handle search for devices
     * @param {string} value
     */
    const handleSearchDevices = value => {
        $('.component-list-items').scrollTop(0)
        const fuse = new Fuse(deviceList)
        const search = fuse.search(value)
        const results = search.map(r => r.item)
        setResultQueryDevices(value === '' ? deviceList : results)
    }

    /**
     * @description get current value of the search input from Components
     * @param {Object<Array>} currentTarget
     */
    const handleOnSearchDevice = ({ currentTarget = [] }) => {
		const { value } = currentTarget
		handleSearchDevices(value)
    }

    /**
     * @description handle search for monitors
     * @param {string} value
     */
	const handleSearchMonitors = value => {
		$('.monitors-list-items').scrollTop(0)
		const fuse = new Fuse(monitorList, {keys: ["magnitude"]});
		const search = fuse.search(value)
		const results = search.map(result => result.item)
        setResultQueryMonitors(value === '' ? monitorList : results)
	}

    /**
     * @description get current value of the search input from Monitors
     * @param {Object<Array>} currentTarget
     */
    const handleOnSearchMonitors = ({ currentTarget = [] }) => {
		const { value } = currentTarget
		handleSearchMonitors(value)
    }

    /**
     * @description hide or show the component and monitor list
     */
    const hideAndShowSection = () => {
		$('.SampleMonitorList-section').toggleClass('hide-sections')
		$('.arrow-showListSection').toggleClass('hide-sections')
    }

    /**
     * @description add monitor to the selected list stored in the global state
     * @param {object} jsonDescription
     */
    const select = (jsonDescription) => {
        try {
            if (selectedItems.filter(e => e["id"] === jsonDescription.id).length === 0){
                add(jsonDescription)
                return
            }
            PopUpMessage({
                type:'info', 
                message:'The monitor '+jsonDescription.magnitude+' is already selected'
            })
        } catch (error) {
            PopUpMessage({type: 'error', message: 'Error selecting monitor'})
            console.error(error)
        }
    }

    return ( 
        <div className="container-adjust-height">
            <div className="arrowShowHide arrow-showListSection hide-sections">
                <ArrowRightIcon onClick={() => { hideAndShowSection() }} className="arrow-rightSection" />
            </div>

            <div className="SampleMonitorList-section">
                <div style={{ height: subSystemConf.hideMonitorSection ? "100%" : "50%" }} className="sample-list-box">
                    <div className="sample-header sample-items-components">
                        <Stack direction="column" spacing={2}>
                            <Stack className="stack-row-components-title-buttons" direction="row">
								<p className="components-item-title">Device List</p>
								<ArrowLeftIcon onClick={() => { hideAndShowSection() }} className="hide_icon_componentList"/>
							</Stack>
                            <Search>
								<SearchIconWrapper>
									<SearchIcon />
								</SearchIconWrapper>
								<StyledInputBase
									placeholder="Search…"
									onChange={handleOnSearchDevice}
									inputProps={{ 'aria-label': 'search' }}
									className="searchInputCompMon"
								/>
							</Search>
                            {
								(connectionError) ?
									<IconButton 
										color="primary" 
										aria-label="upload picture" 
										component="span"
										className={"try-reconnect-button-box"}
									>
										<CachedIcon 
											className={"try-reconnect-button"}
											onClick = {() => {
												tryReconnect()
											}}
										/>
									</IconButton>
								: ""
							}
                        </Stack>
                    </div>
                    <div className="sample-items component-list-items">
						{
							(connectionError)  ? <Error /> :
							(loadingDevices) ? <SkeletonList /> :
							(resultQueryDevices.length === 0) ? <NoResultFound />  :
							resultQueryDevices.map((element, index) =>
								<DeviceElement
									key = { index }
									deviceName = { element }
									loadMonitors = { loadMonitors }
                                    selectableDevice = { subSystemConf.selectableDevice }
                                    select = { select }
								/>
							)
						}
					</div>
                </div>


                <div className="monitor-of-selected-sample-box">
                    <div className="sample-header sample-header-monitors">

                        {/* <InfoPopOver /> */}

                        <Stack direction="column" spacing={2}>
                            
                            <Stack className="stack-row-components-title-buttons" direction="row">
                                <p className="components-item-title">Monitor List</p>
                            </Stack>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    onChange={handleOnSearchMonitors}
                                    inputProps={{ 'aria-label': 'search' }}
                                    id="searchInputCompMon"
                                />
                            </Search>
                            
                        </Stack>
                        <p className="component-title">
                            {
                                selectedDevice
                            }
                        </p>
                    </div>

                    <div id="offer-area" className="sample-items monitors-list-items">
                        {
                            (initialMonitorsListsState) ? <NoSelectedDevice /> :
                            (loadingMonitors) ? <SkeletonList /> :
                            (resultQueryMonitors.length === 0 || monitorsAvailable) ? <NoMonitorElements /> :
                            resultQueryMonitors.map((element, index) =>
                                <MonitorElement
                                    key = { index }
                                    monitorDescription = { element }
                                    select = { select }
                                />
                            )
                        }
                    </div>
                </div>
                

            </div>

        </div>
     );
}

export default DeviceList;