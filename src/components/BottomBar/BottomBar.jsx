import { Box, Button, LinearProgress, Pagination, Popper, Stack } from "@mui/material";
import { useFetchStore } from "../../store/useFetchStore";
import { useState } from "react";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ButtonGeneralOptions from "./ButtonGeneralOptions";


function BottomBar() {
    const { 
		loading,
		reportInfo,
		noDataReceived,
		currentPage,
		totalPages,
		currentSearch
	} = useFetchStore((state) => ({
        loading: state.loading,
        reportInfo: state.reportInfo,
		noDataReceived: state.noDataReceived,
		currentPage: state.currentPage,
		totalPages: state.totalPages,
		currentSearch: state.currentSearch
    }))
	const { fetchData } = useFetchStore()

	const [openPageInfo, setopenPageInfo] = useState(false)
  	const [anchorEl, setAnchorEl] = useState(null)

	const toggleOpenPageInfo = (event) => {
		setAnchorEl(event.currentTarget)
		setopenPageInfo((previousOpen) => !previousOpen)
	}
	const canBeOpen = openPageInfo && Boolean(anchorEl)
	const id = canBeOpen ? 'transition-popper' : undefined


	const handleChangePage = (_, value) => {
		const page = value - 1 // Pagination starts at 1, but we need 0-based index
		if(page === currentPage) return // No need to fetch if the page is the same
		fetchData({payload: currentSearch, currentPage: page})
	}

    return ( 
        	<div className="grafic-options-section">
			<div className="cover_amchart5-promotion"></div>
			{
				(loading) ?
					<div className="loading-graphic-page-box">
						<LinearProgress className="loading-graphic-page" color="secondary" />
					</div>
				: ""
			}
			<Stack className="grafic-option-display-width" direction="row" spacing={2}>
			<div className="grafic-option-box">
				<div className="display-option-for-grafic">

					<ButtonGeneralOptions />

					{/* {
						<ButtonMagnitudeReference 
							magnitudeTitles={referenceComponent}
							magnitudeReferences={references}
						/>
					} */}
					{
						// <RangeThresholdsOptions />
					}
				</div>

				<div className="displayTotal-responseData">
					{
					(noDataReceived || (totalPages === 0 || totalPages === 1)) ? "" :
						<div className="pagination-box">
							<Pagination
								id="pagination"
								count={totalPages}
								disabled={loading}
								page={currentPage+1}
								onChange={handleChangePage}
								showFirstButton
								showLastButton
								size="small"
								shape="rounded"
								siblingCount={1}
								boundaryCount={1}
								defaultValue={1}
							/>
						</div>
					}
				</div>
				{
				(!currentSearch || noDataReceived) ? "" :
					<div className="totalRecord-box">
						<Button
							aria-describedby={id}
							variant="contained" 
							onClick={toggleOpenPageInfo} 
							className="totalRecord-button" 
							endIcon={openPageInfo ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
						>
							Total Samples:  <span className="totalRecord-button-data"> {reportInfo?.totalDisplaySamplesByPage.toLocaleString() || "..."} </span>
						</Button>

						<Popper id={id} open={openPageInfo} anchorEl={anchorEl}>
							<Box className="totalRecord-button-Popover">
								<p className="totalRecord-button-Popover-box">
									<span className="totalRecord-button-Popover-label">Total Samples:</span>  
									<span className="totalRecord-button-Popover-data">{reportInfo?.totalDisplaySamplesByPage.toLocaleString() || "..."} </span>
								</p>
								<p className="totalRecord-button-Popover-box">
									<span className="totalRecord-button-Popover-label">Total Estimated:</span> 
									<span className="totalRecord-button-Popover-data"> {reportInfo?.totalSamples.toLocaleString() || "..."} </span>
								</p>
							</Box>
						</Popper>		
					</div>
				}
			</div>
			</Stack>
		</div>
    );
}

export default BottomBar;