
import { useRef, useState } from 'react';
import { DatePicker } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';
import {
  Stack, MenuItem, FormControl, Select,
  IconButton,
  Button,
  Popper,
  ClickAwayListener,
  Box,
} from '@mui/material';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import DownloadIcon from '@mui/icons-material/Download';
import usePopUpMessage from '../../hooks/usePopUpMessage';
import { useFetchStore } from '../../store/useFetchStore';
import { useSelectedItemsStore } from '../../store/useSelectedItemsStore';
// import { useEditingQueryStore } from '../../store/useEditingQueryStore';
import { SAMPLINGOPTIONS } from '../../constants/samplingOptions';
import { RANGEPRESETS } from '../../constants/rangePresets';
import { buildUrl } from './buildUrl';


const convertToUnix = (date) => {
    const format = date.split(" ")[0].split(/[-/]/).reverse().join('/') + " " + date.split(" ")[1]
    return new Date(format).getTime();
}

function HandleSearch() {
    const [, PopUpMessage] = usePopUpMessage()
    const [openDateRanges, setOpenDateRanges] = useState(false)
    const dateRangesRef = useRef(null)
    const [subSampling, setSubSampling] = useState(0)

    const { selectedItems } = useSelectedItemsStore((state) => ({
        selectedItems: state.selectedItems
    }))
    const { applyItemsOptions } = useSelectedItemsStore()
    
    const { loading,  } = useFetchStore((state) => ({
        loading: state.loading,
    }))
    const { fetchData, setSearchDetails } = useFetchStore()
    
    // String Base format to use with moment.js on date manipulation necessary for materialUI DatePicker
    const [beginDateString, setBeginDateString] = useState("")
    const [endDateString, setEndDateString] = useState("")

    const [dateRange, setDateRange] = useState({
        beginDate: "",
        endDate: "",
    })

    const onRangeChange = (date, value, dateFieldName) => {
        try {
            setDateRange(prevState => ({
                ...prevState,
                [dateFieldName]: value,
            }))
            
            setSearchDetails({ [dateFieldName]: value, subSampling })
            if (dateFieldName === "beginDate") setBeginDateString(date)
            else if (dateFieldName === "endDate") setEndDateString(date)
        } catch (error) {
            PopUpMessage({ type: 'error', message: error.message })
        }
    }

    const checkOnSubmit = () => {
        try {
            const unixBeginDate = convertToUnix(dateRange.beginDate)
            const unixEndDate = convertToUnix(dateRange.endDate)
    
            if (!dateRange.beginDate || !dateRange.endDate) {
                PopUpMessage({ type: 'warning', message: 'The Date Fields cannot be empty' })
                return false
            }
            if (unixBeginDate > unixEndDate) {
                PopUpMessage({ type: 'warning', message: 'The begin Date cannot be greater than end Date' })
                return false
            }
            if (dateRange.beginDate === dateRange.endDate) {
                PopUpMessage({ type: 'warning', message: 'The begin and end Date cannot be the same' })
                return false
            }
            if (!selectedItems[0]) {
                PopUpMessage({ type: 'warning', message: 'There are no selected monitors' })
                return false
            }
            return true
        } catch (error) {
            PopUpMessage({ type: 'error', message: "A fatal error occurred, please contact the administrator" })
            return false
        }
    }


    const onSubmit = () => {
        try {
            if (!checkOnSubmit()) return

            setSearchDetails({ ...dateRange, subSampling }) // to udpate searchDetails in case user has not changed subsampling option
            applyItemsOptions()
            const payload = buildUrl(selectedItems, dateRange, subSampling)
            fetchData({payload: payload})
        } catch (error) {
            PopUpMessage({ type: 'error', message: error.message })
        }
    }

    const onSubmitDownload = () => {
        try {
            if (!checkOnSubmit()) return

            // open confirm popup to download data
            applyItemsOptions()
            const payload = buildUrl(selectedItems, dateRange, subSampling)
            // fetchAndDownloadData(payload)
        } catch (error) {
            PopUpMessage({ type: 'error', message: error.message })
        }
    }

    const toggleOpenDateRanges = () => {
        setOpenDateRanges(!openDateRanges)
    }

    const handleRangePresetClick = (preset) => {
        const FORMAT = 'DD/MM/YYYY HH:mm:ss';
        onRangeChange(preset.value()[0], preset.value()[0].format(FORMAT), "beginDate")
        onRangeChange(preset.value()[1], preset.value()[1].format(FORMAT), "endDate")
    }

    return ( 
        <>
        {
            !openDateRanges ? "" 
            :
            <Popper
                open={openDateRanges}
                anchorEl={dateRangesRef.current}
                sx={{zIndex: 99}}
                placement="left-start"
                modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
            >
            <ClickAwayListener onClickAway={toggleOpenDateRanges}>
                <Box className={"setting-date-range-box"} sx={{boxShadow: 3}}>
                    <div className="corner-decoration" onClick={toggleOpenDateRanges}></div>
                    <div className="label-daterange-settings">(UTC) Get the latest... </div>
                    <div className="date-range-select-box">
                        {
                        RANGEPRESETS.map((preset, index) => (
                            <div 
                                className="date-range-button-box "
                                key={index}
                                onClick={() => handleRangePresetClick(preset)}
                            >
                                <span className="date-range-button-text">{preset.label}</span>
                            </div>
                        ))
                        }
                    </div>
                </Box>
            </ClickAwayListener>
            </Popper>
        }
        <div className="sample-header-perform-query">
            <Stack direction="column" spacing={1}>
            <Stack className="stack-row-components-title-buttons" direction="row">
                <p className="components-item-title">Perform Queries</p>
            </Stack>
            <div className="perform-query-date-time-picker">

                <div className="perform-query-date-time-picker-startdate">
                    <IconButton
                        ref={dateRangesRef}
                        color="primary" 
                        aria-label="upload picture" 
                        component="span"
                        variant="contained"
                        onClick={toggleOpenDateRanges}
                        sx={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '10%', backgroundColor: '#515760', color: '#FFF' }}
                    >
                        <EventRepeatIcon sx={{ width: '20px', height: '20px' }} />
                    </IconButton>
                    <DatePicker
                        id="beginDate"
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        format="DD/MM/YYYY HH:mm:ss"
                        placeholder="Start Date"
                        style={{ fontFamily: "RobotoMono-Bold" }}
                        value={beginDateString}
                        onChange={(date, dateString) => {onRangeChange(date, dateString, "beginDate")}}
                    />
                </div>

                <div className="perform-query-date-time-picker-startdate">
                    <IconButton
                        color="primary" 
                        aria-label="upload picture" 
                        component="span"
                        variant="contained"
                        disabled
                        sx={{ "&.Mui-disabled": { backgroundColor: '#515760', color: '#FFF' },  width: '30px', height: '30px', marginRight: '10px', borderRadius: '10%', backgroundColor: '#515760', color: '#FFF' }}
                    >
                    </IconButton>
                    <DatePicker
                        id="endDate"
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        format="DD/MM/YYYY HH:mm:ss"
                        placeholder="End Date"
                        style={{ fontFamily: "RobotoMono-Bold" }}
                        value={endDateString}
                        onChange={(date, dateString) => {onRangeChange(date, dateString, "endDate")}}
                    />
                </div>

            </div>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                <p className="components-item-title">Get samples every:</p>
                <FormControl sx={{ m: 1, width: 150, marginRight: '0px'}}>
                    <Select
                        className="select-sampling-perform-query"
                        value={subSampling}
                        onChange={(e) => { 
                            setSubSampling(e.target.value)
                            setSearchDetails({ ...dateRange, subSampling: e.target.value }) // TODO: añadir al onchange
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem disabled value="">
                            <em className="default-select-sampling">SubSampling</em>
                        </MenuItem>
                        {
                            SAMPLINGOPTIONS.map((e, i) => {
                                return <MenuItem className="select-sampling-item" key={i} value={e.value}>{e.label}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            </Stack>
        </div>
        <div className="perform-query-buttons-box">
            <Stack spacing={1}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: "5px" }}>
                    <Button
                        onClick={() => {
                            onSubmit()
                        }}
                        fullWidth
                        loading={loading}
                        loadingPosition="start"
                        className="perfrom-query-button-search"
                        variant="contained"
                        startIcon={<PlayCircleFilledWhiteIcon />}
                    >
                        Search
                    </Button>
                    <IconButton
                        variant="contained"
                        loading={loading}
                        onClick={() => {
                            onSubmitDownload()
                        }}
                        className="perfrom-query-button-download-data"
                    >
                        <DownloadIcon sx={{width: '20px', height: '20px'}}/>
                    </IconButton>
                </div>
            </Stack>
        </div>
        </>
    );
}

export default HandleSearch;