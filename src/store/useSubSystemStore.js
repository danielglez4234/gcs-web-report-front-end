import { create } from 'zustand';
import zustymiddleware from 'zustymiddleware';
import  { SUSBSYSTEMS } from '../constants/subSystems';


const getDefaultSubSystem = () => {
    const defaultSubSystem = Object.keys(SUSBSYSTEMS)[0]
    return defaultSubSystem || "";
}

const initialState = {
    activeSubSystem: getDefaultSubSystem(),
    subSystemKeys: Object.keys(SUSBSYSTEMS),
    availableSubSystems: Object.values(SUSBSYSTEMS),
}


export const useSubSystemStore = create(zustymiddleware((set, get) => ({
    ...initialState,
    
    getCurrentSubSystem: () => get().activeSubSystem,

    setSubSystem: (system) => {
        if (!system || typeof system !== 'string') {
            console.warn("Invalid subsystem name provided. It should be a non-empty string.")
            return
        }
        if (!get().subSystemKeys.includes(system)) {
            console.warn(`Subsystem "${system}" is not available. Available subsystems: ${get().subSystemKeys.join(', ')}`)
            return
        }
        set(() => ({ activeSubSystem: system }))
    },
}))
)

window.store = useSubSystemStore;