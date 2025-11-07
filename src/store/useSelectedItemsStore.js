import { create } from 'zustand';
import { ITEMSDEFAULTOPTIONS } from '../constants/selectedItemsOptions';
import { ArrayUtils } from '../utils/arrayUtils';

/**
 * initial state DEFAULTS for the selected items store.
 */
const initialState = {
    selectedItems: [],
    options: {
        ...ITEMSDEFAULTOPTIONS
    },
    appliedOptions: [] // in this object it will be store all the options when the apply button is clicked
}

/**
 * Sets the options for a monitor. Either is the default options or the options passed in.
 * @param {Object} itemInfo
 * @param {Object} defaultOptions
 * @returns
 */
const setOptions = (itemInfo, defaultOptions) => {
    itemInfo.options = {}

    Object.entries(defaultOptions).forEach(([key, value]) => {
        itemInfo.options[key] = Array.isArray(value) // if the value is an array select the first element as the default value
            ? value[0]
            : value
    })

    return itemInfo
}


export const useSelectedItemsStore = create((set, get) => ({
    ...initialState,

    getSelectedMonitors: () => get().selectedItems,

    // ------------------- Add

    add: (itemInfo) => {
        try {
            const selected = setOptions(itemInfo, get().options)
            set(() => ({ selectedItems: [...get().selectedItems, selected] }))
        }
        catch (error) { console.error(error) }
    },

    addMultiple: (monitors) => {
        try {
            
            set(() => ({ selectedItems: ArrayUtils.preventDuplicates(monitors) }))
        } catch (error) {
            
        }
    },

    concat: (monitors) => {
        
        try {
            const result = get().selectedItems.concat(monitors)
            set(() => ({ selectedItems: ArrayUtils.preventDuplicates(result) }))    
        } 
        catch (error) { console.error(error) }
    },

    // ------------------- Remove 

    remove: (id) => {
        set(() => ({ selectedItems: get().selectedItems.filter((el) => el.id !== id) }))
    },

    removeAll: () => {
        set(() => ({ selectedItems: [] }))
    },
    
    // ------------------- Options 

    resetDefaultsOptions: () => {
        try {
            const deep_ccopy = JSON.parse(JSON.stringify(get().selectedItems))
            const selected = deep_ccopy.map((itemInfo) => {
                return setOptions(itemInfo, get().options)
            })
            set(() => ({ selectedItems: selected })) // reset applied options when defaults are reset
        }
        catch (error) { console.error(error) }
    },

    updateOptions: (id, optionsName, optionsValue) => {
        try {
            const deep_copy = JSON.parse(JSON.stringify(get().selectedItems))

            const arr = deep_copy.map(obj => {
                if (obj.id === id){
                    obj.options[optionsName] = optionsValue
                    return obj
                }
                return obj
            })
            set(() => ({ selectedItems: arr }))
        }
        catch (error) { console.error(error) }
    },

    applyItemsOptions: (_selectedItems) => {
        const selectedItems = _selectedItems || get().selectedItems
        set(() => ({ appliedOptions: selectedItems}))
    }
})
)