import { create } from 'zustand';
import zustymiddleware from 'zustymiddleware';
import { GENERALOPTIONS } from '../constants/generalOptions';

/**
 * initial state
 */
const initialState = {
    generalGraphicOptions: GENERALOPTIONS
}


export const useGraphicGeneralOptionsStore = create(zustymiddleware((set, get) => ({
    ...initialState,
    
    getGeneralOptions: () => get().generalGraphicOptions,

    apllyGeneralOptions: (options) => {
        set(() => ({ generalGraphicOptions: {...get().generalGraphicOptions,  ...options} }))
    },
}))
)

window.store = useGraphicGeneralOptionsStore;