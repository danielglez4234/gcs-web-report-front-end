import { useEffect, useState, useCallback, useMemo } from 'react';
import { 
    ColumnsPanelTrigger,
    FilterPanelTrigger,
    QuickFilter,
    QuickFilterClear,
    QuickFilterControl,
    QuickFilterTrigger,
    ToolbarButton,
    gridPageCountSelector,
    gridPageSelector,
    // useGridApiContext,
    gridRowSelectionSelector,
    // useGridSelector,
    gridRowSelectionIdsSelector,
    gridRowSelectionCountSelector,
    // gridRowsLookupSelector,
    gridRowIdSelector,

    useGridApiContext,
    useGridEvent,
    useGridSelector,
    gridRowsLookupSelector, // public & stable
} from '@mui/x-data-grid';
import MuiPagination from '@mui/material/Pagination';
import { Toolbar } from '@mui/x-data-grid';
import { TextField, InputAdornment, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import { useSelectedItemsStore } from '../../../../store/useSelectedItemsStore';
import { useQueryStore } from '../../../../store/useQueryStore';

const StyledQuickFilter = styled(QuickFilter)({
    display: 'grid',
    alignItems: 'center',
    marginLeft: 'auto',
});

const StyledToolbarButton = styled(ToolbarButton)(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
}));

const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    overflowX: 'clip',
    width: ownerState.expanded ? 260 : 'var(--trigger-width)',
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(['width', 'opacity']),
}))

// Normalize whatever we get into a Set of IDs
function toIdSet(maybe) {
  if (maybe == null) return new Set()
  // Already a Set of ids
  if (maybe instanceof Set) return new Set(maybe)
  // Array of ids
  if (Array.isArray(maybe)) return new Set(maybe)
  // Object shapes (common in v8): { ids: Set|Array, type: 'include'|'exclude' }
  if (typeof maybe === 'object') {
    const ids = maybe.ids ?? maybe.rowSelectionModel ?? maybe.selectionModel
    if (ids instanceof Set) return new Set(ids)
    if (Array.isArray(ids)) return new Set(ids)
  }
  // Fallback: give up to empty set
  return new Set()
}

export function CustomToolbar({ onBulkAdd }) {
    const { concat } = useSelectedItemsStore()
    const { deleteQuery } = useQueryStore()
    
    const apiRef = useGridApiContext()

    // keep local selection as a Set to avoid identity/mutation issues
    const [selectedIdsSet, setSelectedIdsSet] = useState(() => new Set())

    // initialize once (in case grid already has a selection)
    useEffect(() => {
        const stateSel = apiRef.current?.state?.rowSelection
        setSelectedIdsSet(toIdSet(stateSel))
    }, [apiRef])

    // keep in sync with future selection changes
    useGridEvent(apiRef, 'rowSelectionChange', (payload) => {
        // payload can be Set, Array or { ids: ... }
        setSelectedIdsSet(toIdSet(payload))
    })

    // read rows lookup (Map<id, row>)
    const rowsLookup = useGridSelector(apiRef, gridRowsLookupSelector)

    const selectedIds = useMemo(
        () => Array.from(selectedIdsSet),
        [selectedIdsSet]
    )

    const getRowById = useCallback(
        (id) => (rowsLookup?.get ? rowsLookup.get(id) : rowsLookup?.[id]),
        [rowsLookup]
    )

    const selectedRows = useMemo(
        () => selectedIds.map(getRowById).filter(Boolean),
        [selectedIds, getRowById]
    )

    const hasSelection = selectedIds.length > 0

    return (
        <Toolbar>
            <Tooltip title={hasSelection ? `Add ${""} selected` : "Load multiple queries"}>
                <ToolbarButton
                    aria-describedby="multiple-load-tooltip"
                    onClick={() => {
                        // concat(selectedRows)
                        onBulkAdd()
                    }}
                    sx={{ borderRadius: "4px !important" }}
                    disabled={!hasSelection}
                >
                    <AddIcon fontSize="small" />
                    <Typography sx={{ fontFamily: "RobotoMono-Light", fontSize: "0.79rem", marginTop: "3px", marginLeft: "6px"}} variant="body2" color="textSecondary">
                        {hasSelection ? `Add ${""} selected` : ""}
                    </Typography>
                </ToolbarButton>
            </Tooltip>

            <ColumnsPanelTrigger render={<ToolbarButton aria-label="Columns" />}>
                <ViewColumnIcon fontSize="small" />
            </ColumnsPanelTrigger>

            <FilterPanelTrigger
                render={(props) => (
                    <ToolbarButton {...props} aria-label="Filters">
                        <FilterListIcon fontSize="small" />
                    </ToolbarButton>
                )}
            />

            <Tooltip title={"Delete multiple queries"}>
                <ToolbarButton
                    aria-describedby="multiple-delete-tooltip"
                    onClick={() => {
                        deleteQuery(selectedIds)
                        // onBulkDelete()
                    }}
                    sx={{ borderRadius: "4px !important", backgroundColor: "red" }}
                    disabled={!hasSelection}
                >
                    <DeleteForeverIcon fontSize="small" />
                    <Typography sx={{ 
                        fontFamily: "RobotoMono-Bold",
                        color: "white",
                        fontSize: "0.79rem", 
                        marginTop: "3px",
                        marginLeft: "6px",
                        "&:hover": { color: "#757575" }
                    }} variant="body2" color="textSecondary">
                        {hasSelection ? `Delete ${""} selected` : ""}
                    </Typography>
                </ToolbarButton>
            </Tooltip>

            <StyledQuickFilter>
                <QuickFilterTrigger
                    render={(triggerProps, state) => (
                        <Tooltip title="Search" enterDelay={0}>
                        <StyledToolbarButton
                            {...triggerProps}
                            ownerState={{ expanded: state.expanded }}
                            color="default"
                            aria-disabled={state.expanded}
                        >
                            <SearchIcon fontSize="small" />
                        </StyledToolbarButton>
                        </Tooltip>
                    )}
                />
                <QuickFilterControl
                    render={({ ref, ...controlProps }, state) => (
                        <StyledTextField
                        {...controlProps}
                        ownerState={{ expanded: state.expanded }}
                        inputRef={ref}
                        aria-label="Search"
                        placeholder="Search..."
                        size="small"
                        slotProps={{
                            input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: state.value ? (
                                <InputAdornment position="end">
                                <QuickFilterClear
                                    edge="end"
                                    size="small"
                                    aria-label="Clear search"
                                    material={{ sx: { marginRight: -0.75 } }}
                                >
                                    <CancelIcon fontSize="small" />
                                </QuickFilterClear>
                                </InputAdornment>
                            ) : null,
                            ...controlProps.slotProps?.input,
                            },
                            ...controlProps.slotProps,
                        }}
                        />
                    )}
                />
            </StyledQuickFilter>
        </Toolbar>
    );
}


export function Pagination({ page, onPageChange, className }) {
    const apiRef = useGridApiContext()
    const pageCount = useGridSelector(apiRef, gridPageCountSelector)

    return (
        <MuiPagination
            color="primary"
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => {
                onPageChange(event, newPage - 1)
            }}
        />
    )
}
