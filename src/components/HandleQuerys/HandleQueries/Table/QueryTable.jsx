import {useState, useEffect, useMemo} from 'react';
import {
	DataGrid,
 } from '@mui/x-data-grid';
import {
	Box, 
} from '@mui/material';
import {PLACEHOLDER_COLUMNS, HEADS, visibilityModel} from './columnsHeads'
import { CustomToolbar, Pagination } from './TableComponents';
import ActionTableButtons from './ActionTableButtons';
import usePopUpMessage from '../../../../hooks/usePopUpMessage';
import { useQueryStore } from '../../../../store/useQueryStore';


function QueryTable() {
    const rowsPerPage = 10
    const [, PopUpMessage] = usePopUpMessage()
    const { setEditingState, fetchAllQueries } = useQueryStore()
    const { queries, loading, error } = useQueryStore((state) => ({ 
        queries: state.queries,
        loading: state.loading,
        error: state.error,
    }))

    const [tableData, setTableData] = useState({
        rows: [],
        columns: PLACEHOLDER_COLUMNS
    })
    const [rowSelectionModel, setRowSelectionModel] = useState({
        type: 'include',
        ids: new Set(),
    })

    useEffect(() => {
        fetchAllQueries()
    }, [])

    useEffect(() => {
        if(!queries.length)
            return
        
        setTableData(prev => ({
            ...prev,
            rows: buildRows(queries),
            columns: buildColumns()
        }))
    }, [queries])

    const buildRows = (data) => {
        try {
            const rows = data.map(item => (
                {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    created_by: item.created_by,
                    creation_time: item.creation_time,
                    update_time: item.update_time,
                    sampling: item.sampling,
                    monitor_info: [
                        ...item.magnitudeDescriptions, 
                        ...item.monitorDescriptions, 
                        ...item.states
                    ]
                }
            ))
            return rows || []
        } catch (error) {
            console.error("Error building rows:", error)
            return []
        }
    }

    const getButtonsCell = (type) => {
		return (cellValues) => (
            <ActionTableButtons type={type} cellValues={cellValues} />
        )
	}

    const buildColumns = () => {
        try {
            const columns = HEADS.map(head => ({
                headerClassName: 'store-query-table-headers',
                renderCell: (head?.actionCell)
                    ? getButtonsCell(head?.actionCellType)
                    : undefined,
                ...head
            }))
            return columns || []
        } catch (error) {
            console.error("Error building columns:", error)
            return []
        }
    }

    const selectedRows = useMemo(() => {
		if (!tableData.rows?.length || !rowSelectionModel?.length) return []
		const selectedSet = new Set(rowSelectionModel)
		return tableData.rows.filter((r) => selectedSet.has(r.id))
	}, [tableData.rows, rowSelectionModel])

    return (
        <>
        <Box
            sx={{
                height: '100%',
                width: '100%',
            }}
        >
            <DataGrid
                {...tableData}
                sx={{
                    height: '100%',
                    "& .MuiDataGrid-columnHeaderTitleContainer": {
                        fontFamily: 'RobotoMono-SemiBold',
                        textTransform: 'Capitalize',
                    },
                    "& .MuiDataGrid-cell": {
                        fontFamily: 'RobotoMono-Regular',
                    },
                    "& .MuiTablePagination-displayedRows": {
                        marginTop: '12px',
                        fontFamily: 'RobotoMono-Regular',
                    },
                }}
                showToolbar
                checkboxSelection
                disableRowSelectionOnClick
                keepNonExistentRowsSelected 
                onRowSelectionModelChange={setRowSelectionModel}
                rowSelectionModel={rowSelectionModel}
                initialState={{
                    ...tableData.initialState,
                    pagination: { paginationModel: { pageSize: rowsPerPage } },
                    columns: { columnVisibilityModel: visibilityModel() },
                }}
                pageSizeOptions={[rowsPerPage]}
                onPaginationModelChange={() => {/* disabled option handler */}}
                loading={loading}
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                    basePagination: {
                        material: {
                            ActionsComponent: Pagination,
                        },
                    },
                    toolbar: {
                        csvOptions: { disableToolbarButton: true },
                        printOptions: { disableToolbarButton: true },
                        //-------------------
                        selectedIds: rowSelectionModel,
                        selectedRows,
                        onBulkAdd: () => {
                            PopUpMessage(`${selectedRows.length} rows selected`);
                        },
                        // ------------------
                    },
                    loadingOverlay: {
                        variant: 'skeleton',
                        noRowsVariant: 'skeleton',
                    },
                }}
            />
        </Box>
        </>
    );
}

export default QueryTable;