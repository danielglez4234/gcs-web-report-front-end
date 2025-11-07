import { useEffect, useState } from "react";
import { useSelectedItemsStore } from "../../store/useSelectedItemsStore";
import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { ITEMSDEFAULTOPTIONS, MONITOROPTIONSCATEGORY } from '../../constants/selectedItemsOptions';

const { graphicOnly } = MONITOROPTIONSCATEGORY


function ApplyChangesButton() {
    const { selectedItems, appliedOptions } = useSelectedItemsStore((state) => ({
        selectedItems: state.selectedItems,
        appliedOptions: state.appliedOptions
    }))

    const { applyItemsOptions } = useSelectedItemsStore()
    
    const [hasChanges, setHasChanges] = useState(false)
    const [hasFetchedChanges, setHasFetchedChanges] = useState(false)
    
    useEffect(() => {
   
    function checkIfNeedFetchChanges(key) {
        try {
            return !graphicOnly.presentation.includes(key)
        } catch (error) {
            return false
        }
    }
    
    if (selectedItems.length === 0) {
        setHasChanges(false)
        setHasFetchedChanges(false)
        return
    }

    let changesDetected = false
    let fetchedChangesDetected = false

    outerLoop:
    for (const selected of selectedItems) {
        const applied = appliedOptions.find(a => a.id === selected.id)
        const selectedOptions = selected.options

        const baseOptions = applied
            ? applied.options
            : JSON.parse(JSON.stringify(ITEMSDEFAULTOPTIONS)) // clone to avoid ref issues
            
        for (const key of Object.keys(ITEMSDEFAULTOPTIONS)) {
            const selectedValue = selectedOptions[key]
            const baseValue = Array.isArray(baseOptions[key]) ? baseOptions[key][0] : baseOptions[key]
            
            const isArray = Array.isArray(ITEMSDEFAULTOPTIONS[key])
            let changed = false
            if (isArray) {
                changed = JSON.stringify(selectedValue || []) !== JSON.stringify(baseValue || [])
            } else {
                changed = selectedValue !== baseValue
            }
            if (changed) {
                if (checkIfNeedFetchChanges(key)) {
                    fetchedChangesDetected = true
                    break outerLoop
                } else {
                    changesDetected = true
                    // no break yet, maybe fetch changes exist further
                }
            }
        }
    }

    setHasFetchedChanges(fetchedChangesDetected)
    setHasChanges(!fetchedChangesDetected && changesDetected)
    }, [selectedItems, appliedOptions])


    const handleApplyChanges = () => {
        applyItemsOptions()
        if (hasFetchedChanges) 
        {
            // resetCurrentSearch()
            setHasFetchedChanges(false)
            return
        }
        setHasChanges(false)
    }


    return (
        <>
            {hasChanges || hasFetchedChanges ? (
                <Button
                    className="selected-monitors-save-options"
                    size="small"
                    variant="contained"
                    startIcon={<CachedIcon />}
                    onClick={handleApplyChanges}>
                    {
                        hasFetchedChanges
                            ? "FETCH & APPLY CHANGES"
                            : "APPLY CHANGES"
                    }
                </Button>
            )
            :""
        }
        </>
    );
}

export default ApplyChangesButton;
