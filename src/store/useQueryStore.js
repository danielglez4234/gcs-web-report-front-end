import { create } from 'zustand';
import zustymiddleware from 'zustymiddleware';
import {
    insertQuery,
    updateQuery,
    deleteQuery,
    getQueryByName,
    getAllQuerys
} from '../services/services';

const statusTypes = {        
    200: {message: "Query saved successfully"},
    201: {message: "Query updated successfully"},
    404: {message: "Query not found"},
    500: {message: "An error occurred while processing the query"},
}

/**
 * initial state
 */
const initialState = {
    editing: false,
    error: null,
    loading: false,
    queries: [],
    queryById: null,
    actionStatus: null,
}

/**
 * Zustand store to handle querys
 * this store will handle all the querys of each subsystem (MM, Logs, Alarms)
 */
export const useQueryStore = create(zustymiddleware((set, get) => ({
    ...initialState,

    setEditingState: (state) => {
        set(() => ({ editing: state }))
    },

    fetchAllQueries: async () => {
        set(() => ({
            ...initialState,
            loading: true,
            editing: get().editing,
        }))
        await Promise.resolve( getAllQuerys() )
        .then((data) => {
            set(() => ({ queries: data }))
        })
        .catch((error) => {
            console.error("Error fetching all querys:", error)
            set(() => ({ error: true }))
        })
        .finally(() => {
            set(() => ({ loading: false }))
        })
    },

    fetchQueryByNameId: async (name) => {
        set(() => ({
            ...initialState
        }))
        await Promise.resolve( getQueryByName(name) )
        .then((data) => {
            set(() => ({ queryStored: data }))
        })
        .catch((error) => {
            console.error(`Error fetching query by name ${name}:`, error)
            set(() => ({ error: true }))
        })
        .finally(() => {
            set(() => ({ loading: false }))
        })
    },

    saveQuery: async (payload, subsystem) => {
        set(() => ({ loading: true, error: false}))
        await Promise.resolve( insertQuery(payload) )
        .catch((error) => {
            console.error("Error saving query:", error)
            set(() => ({ error: true }))
            return 
        })
        .finally(() => {
            set(() => ({ loading: false }))
        })
    },

    updateQuery: async (payload, subsystem) => {
        set(() => ({ loading: true,  error: false }))
        await Promise.resolve( updateQuery(payload) )
        .catch((error) => {
            console.error("Error updating query:", error)
            set(() => ({ error: true }))
        })
        .finally(() => {
            set(() => ({ loading: false }))
        })
    },

    deleteQuery: async (setOfIds, subsystem) => {

        set(() => ({ loading: true,  error: false }))

        const idsArray = Array.isArray(setOfIds) ? setOfIds : [setOfIds]

        const ids = get().queries
            .filter(q => idsArray.includes(q.id))
            .map(q => `name=${encodeURIComponent(q.name)}`)
            .join('&')

        await Promise.resolve( deleteQuery(ids) )
        .catch((error) => {
            console.error("Error deleting query:", error)
            set(() => ({ error: true }))
        })
        .finally(() => {
            get().fetchAllQueries() // refresh the list after deletion
        })
    }
})))

window.store = useQueryStore;