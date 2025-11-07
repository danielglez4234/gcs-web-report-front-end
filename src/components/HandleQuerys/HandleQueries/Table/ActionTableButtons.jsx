import {
    Button,
    Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { useSelectedItemsStore } from '../../../../store/useSelectedItemsStore';
import { useQueryStore } from '../../../../store/useQueryStore';
import { useState } from 'react';


const buildMonitorList = (cellValues) => {
    console.log("🚀 ~ buildMonitorList ~ cellValues:", cellValues)
    try {
        const{
            magnitudeDescriptions = [],
            monitorDescription = [],
            states = []
        } = cellValues?.row?.monitor_info

        const monitors_ = monitorDescription.map(el => {
            const { prefix, unit, decimal, pos, options = {}, ...rest } = el
            return {
                ...rest,
                options: { ...options, prefix, unit, decimal, pos },
            }
        })
        return [...states, ...monitors_, ...magnitudeDescriptions]
    } catch (error) {
        console.log(error)
        return []
    }
}

function ActionTableButtons({cellValues, type}) {
    const [openConfirm, setOpenConfirm] = useState(false)
    const { concat, add } = useSelectedItemsStore()
    const { deleteQuery } = useQueryStore()

    const handleClickOpen = () => {
        setOpenConfirm(true)
    }

    const handleClose = () => {
        setOpenConfirm(false)
    }

    return (
        <>
        <Dialog
            open={openConfirm}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                "& .MuiDialog-paper": {
                    textAlign: "center",
                },
            }}
        >
            <DialogTitle sx={{fontFamily: "RobotoMono-Regular", fontSize: "1.10rem"}} id="alert-dialog-title">
                <ReportProblemIcon 
                    sx={{
                        fontSize: "3.5rem", 
                        color: "#ff4444",
                        verticalAlign: "middle",
                        marginRight: "0.3rem",
                        marginBottom: "0.44rem"
                    }}
                />
                <br />
                Are you sure you want to delete
                <br />
                <b>{cellValues.row?.name}?</b>
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{fontFamily: "RobotoMono-Light", fontSize: "0.805rem"}} id="alert-dialog-description">
                    This action is irreversible.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button sx={{fontFamily: "RobotoMono-Bold"}} onClick={handleClose}>Cancel</Button>
                <Button 
                    sx={{fontFamily: "RobotoMono-Bold"}} 
                    variant="contained" 
                    color="error"
                    onClick={() => {
                        deleteQuery(cellValues.row.id)
                        handleClose()
                    }}
                    autoFocus
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>

        <Tooltip
            title="Load"
            disableInteractive
            enterDelay={500}
            leaveDelay={200}
        >
            <IconButton
                color="primary"
                aria-label="load"
                onClick={(event) => {
                    add(buildMonitorList(cellValues))
                }}
            >
                <UploadIcon className="rotate90 blue-iconcolor"/>
            </IconButton>
        </Tooltip>
        <Tooltip
            title="Edit"
            disableInteractive
            enterDelay={500}
            leaveDelay={200}
        >
            <IconButton
                color="secondary"
                aria-label="load"
                onClick={(event) => {
                    // handleLoadQuery(cellValues, true);
                }}
            >
                <EditIcon className="gray-iconcolor" />
            </IconButton>
        </Tooltip>
        <Tooltip
            title="Delete"
            disableInteractive
            enterDelay={500}
            leaveDelay={200}
        >
            <IconButton
                color="error"
                aria-label="delete"
                onClick={(event) => {
                    handleClickOpen()
                }}
            >
                <DeleteIcon className="red-iconcolor" />
            </IconButton>
        </Tooltip>
        <Tooltip
            title="Add To Favorites"
            disableInteractive
            enterDelay={500}
            leaveDelay={200}
        >
            <IconButton
                color="error"
                aria-label="delete"
                // onClick={(event) => {addItemtoLocalStorage(cellValues.row)}} // TODO: temporal
            >
                <BookmarkAddIcon sx={{color: "#2fd38e"}}/>
            </IconButton>
        </Tooltip>
        </>
    );
}

export default ActionTableButtons;