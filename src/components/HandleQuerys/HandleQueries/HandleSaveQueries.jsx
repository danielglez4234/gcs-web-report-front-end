import { useEffect, useState } from 'react';
import {
	insertQuery,
	updateQuery
} from '../../../services/services'
import { Modal, Box, Grid, Button, Backdrop, CircularProgress, Divider } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { useSelectedItemsStore } from '../../../store/useSelectedItemsStore';
import CloseIcon from '@mui/icons-material/Close';
import { useFetchStore } from '../../../store/useFetchStore';
import { useQueryStore } from '../../../store/useQueryStore';
import usePopUpMessage from '../../../hooks/usePopUpMessage';
import { MTUtil } from '../../../utils/monitorTypeUtils';

const { REACT_APP_QUERY_NAME_PATTERN } = process.env

const testRegex = (value, expression) => {
    const re = new RegExp(expression)
    return re.test(value)
}


function HandleSaveQueries() {
    const [, PopUpMessage] = usePopUpMessage()
    const [queryName, setQueryName] = useState("")
    const [queryDescription, setQueryDescription] = useState("")

    const { selectedItems } = useSelectedItemsStore((state) => ({
        selectedItems: state.selectedItems
    }))
    const { searchDetails } = useFetchStore((state) => ({
        searchDetails: state.searchDetails
    }))
    const { saveQuery, updateQuery, setEditingState } = useQueryStore()
    const { editing, loading, error, queryById } = useQueryStore((state) => ({ 
        editing: state.editing,
        loading: state.loading,
        error: state.error,
        queryById: state.queryById
    }))

    const [openBackDrop, setOpenBackDrop] = useState(false)
    const [openSaveQueryModal, setOpenSaveQueryModal] = useState(false)

    const backDropLoadOpen = () => setOpenBackDrop(true)
    const backDropLoadClose = () => setOpenBackDrop(false)

    const toggleOpenModal = () => {
        setOpenSaveQueryModal(!openSaveQueryModal)
    }

    /**
     * Build the payload for saving a query
     * @returns {Object} The payload object
     */
    const buildPayload = () => {
        return {
            name: queryName,
            description: queryDescription,
            iniDate: searchDetails?.beginDate || null,
            endDate: searchDetails?.endDate || null,
            sampling: searchDetails?.subSampling || null,
            created_by: null,               
            ...selectedItems.reduce(
                (acc, item) => {
                const category = MTUtil.getCategory(item.type)
                    const { options, ...rest } = item
                    const itemPayload = { id: rest.id, options }

                    if(category === "monitor")
                        acc.monitorDescriptions.push(itemPayload)
                    else if(category === "magnitude")
                        acc.magnitudeDescriptions.push(itemPayload)
                    else if(category === "state")
                        acc.states.push(itemPayload)
                    else
                        console.warn(`Unknown category for item type: ${itemPayload.type}`)
                    return acc
                },
                { monitorDescriptions: [], magnitudeDescriptions: [],  states: [] }
            )}
    }

    /**
     * Handle the submit of the form,
     * validate the form, build the payload
     * call the saveQuery function from the store
     */
    const onSubmit = () => {
		try {
			if(queryName === "" || queryName === undefined){
				PopUpMessage({type:'warning', message:'Name field cannot be empty'})
                return
			}
            else if(selectedItems.length === 0){
                PopUpMessage({type:'warning', message:'You must select at least one item to save the query'})
                return
            }
			else if(!testRegex(queryName, REACT_APP_QUERY_NAME_PATTERN)){
				PopUpMessage({type:'warning', message:"name cannot have special characters other than '_-@.()'"})
                return
			}

            backDropLoadOpen()
            const payload = buildPayload()
        
			if(!editing) { saveQuery(payload) }
            else {
				updateQuery(payload)
			}
		} catch (error) {
			PopUpMessage({type:'error', message:error})
		}
	}

    // useEffect(() => {
    //     if(!loading) {
    //         if(openBackDrop) backDropLoadClose()
    //         if(openSaveQueryModal) setOpenSaveQueryModal(false)
    //         setQueryName("")
    //         setQueryDescription("")
    //         setEditingState(false)
    //     }
    //     if(!loading && !error) {
    //         PopUpMessage({type:'success', message: editing ? 'Query updated successfully' : 'Query saved successfully'})
    //     } else if(!loading && error) {
    //         PopUpMessage({type:'error', message: editing ? 'Error updating query' : 'Error saving query'})
    //     }
    // }, [loading, error])


    return (
        <>
        <Button
            onClick={() => {toggleOpenModal()}}
            variant="contained"
            startIcon={<ArchiveIcon />}
            sx={{
                fontFamily: 'RobotoMono-SemiBold',
                backgroundColor: "#ac5978",
                fontSize: '12px',
                    '&:hover': {
                        background: "#b96584ff" ,
                    },
            }}
        >
            Save Queries
        </Button>
        	<Modal
				open={openSaveQueryModal}
				onClose={toggleOpenModal}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="save-query-modal">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px'}}>
					    <p style={{ margin: 0 }}>Save actual query</p>
                        <CloseIcon sx={{cursor: "pointer"}} onClick={toggleOpenModal} />
                    </div>
                    <Divider sx={{ backgroundColor: '#569d90' }}  />
                    <div className="save-query-details">
                        <p><strong>Date Range:</strong> {searchDetails?.beginDate || "xxx"} - {searchDetails?.endDate || "xxx"}</p>
                        <p><strong>Subsampling:</strong> {searchDetails?.subSampling ? + searchDetails?.subSampling + " (milliseconds)" : "None"}</p>
                    </div>
                    <Divider sx={{ backgroundColor: '#569d90' }}  />
                    <div className="save-query-form">
                        <p className="save-query-form-label"><strong>Name:</strong></p>
                        <input
                            type="text"
                            className="save-query-form-input"
                            placeholder="Enter query name"
                            value={queryName}
                            onChange={(e) => setQueryName(e.target.value)}
                        />
                        <p className="save-query-form-label"><strong>Description:</strong></p>
                        <input
                            type="text"
                            className="save-query-form-input"
                            placeholder="Enter query description"
                            value={queryDescription}
                            onChange={(e) => setQueryDescription(e.target.value)}
                        />
                    </div>
                    <p style={{ marginTop: "20px", }} >Selected Items:</p>
                    <div style={{ height: "200px", overflow: "auto", marginTop: "5px", borderRadius: "4px", border: "2px solid #5a6370"}}>
                        <table id="drop-area" className="save-query-table-monitor-list">
                            <tbody>
                                {
                                (selectedItems === "") ? <td></td>
                                :
                                selectedItems.map((value, index) => {
                                    return (
                                    <tr key={index} className="save-query-table-tr">
                                    <td>
                                        <div className="save-query-table-item-header">
                                            <p className="sv-component">{value.name}</p>
                                        </div>
                                        <div className="save-query-table-item-title">
                                            {value.magnitude}
                                        </div>
                                    </td>
                                    </tr>
                                    );
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px"}}>
                        <Button
                            loading={loading}
                            variant="contained" 
                            onClick={toggleOpenModal}
                            sx={{
                                backgroundColor: '#5a6370',
                                '&:hover': {
                                    background: '#5a6370',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={onSubmit}
                            sx={{
                                backgroundColor: '#569d90',
                                '&:hover': {
                                    background: '#569d90',
                                },
                            }} 
                        >
                           {editing ? "Update" : "Save"}
                        </Button>
                    </div>
				</Box>
			</Modal>
			<Backdrop
				className={{color: '#569d90', zIndex: (theme) => theme.zIndex.drawer + 13001 }}
				open={openBackDrop}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
        </>
    );
}

export default HandleSaveQueries;