import { useState } from "react";
import { Box, Button, Divider, Grid, Modal } from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';
import CloseIcon from '@mui/icons-material/Close';
import QueryTable from "./Table/QueryTable";

function HandleLoadQueries() {
    const [openStoreQueryModal, setOpenStoreQueryModal] = useState(false)

    const toggleOpenModal = () => {
        setOpenStoreQueryModal(!openStoreQueryModal)
    }

    return (
        <>
        <Modal
            open={openStoreQueryModal}
            onClose={toggleOpenModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="view-query-modal">
                
                <Box className="view-query-modal-cont">
                    <Box className="store-query-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                        View Store Queries
                        <CloseIcon sx={{cursor: "pointer"}} onClick={toggleOpenModal} />
                    </Box>
                    <Divider sx={{ backgroundColor: '#569d90' }}  />
                    <Box sx={{ height: '100%' }}>

                        <QueryTable />
                        
                    </Box>
                </Box>
            </Box>
        </Modal>
        <Button
            sx={{
                fontFamily: 'RobotoMono-SemiBold',
                backgroundColor: "#4b6180",
                fontSize: '12px',
                '&:hover': {
                    background: "#587297ff" ,
                }
            }}
            onClick={toggleOpenModal}
            variant="contained"
            startIcon={<InventoryIcon />}
            // onClick={() => {handleOpenViewQuery()}}
        >
            Store Queries
        </Button>
        </>
    );
}

export default HandleLoadQueries;