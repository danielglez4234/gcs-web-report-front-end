import { create } from 'zustand';
import { getSamples } from '../services/services';
// import { devtools } from 'zustand/middleware';

/**
 * needJumpToNextPage is a workaround to avoid the missunderstanding if the fisrt page is empty, but the next one has data.
 * if is set to true, the next page will be fetched automatically on around 5 seconds.
 * this is handle in the buttonFetchNextPage component.
 */

// const { REACT_APP_PAGE_SIZE } = process.env;
const initialState = {
    searchDetails:{beginDate: null, endDate: null, subSampling: null},
    currentSearch: "",
    error: false,
    loading: false,
    data: {},
    noDataReceived: false,
    totalPages: 0,
    currentPage: null,
    reportInfo: null,
    needJumpToNextPage: false,
}

export const useFetchStore = create((set, get) => ({
    ...initialState,

    /**
     * Save current search url parameters
     */
    setCurrentSearch: (currentSearch) => {
        set(() => ({ currentSearch: currentSearch }))
        
    },

    setSearchDetails: (searchDetails) => {
        set(() => ({ searchDetails: {...get().searchDetails, ...searchDetails} }))
    },

    setLoading: (boolean) => set(() => ({ loading: boolean })),

    fetchData: async ({payload, currentPage}) => {
        set(() => ({
            ...initialState,
            searchDetails: get().searchDetails,
            currentSearch: payload,
            loading: true,
            currentPage: currentPage || 0,
            // if nothing its sent on currentPage it means that a new search is being performed
            // so the totalpages does not get reset on a page change
            totalPages: (currentPage === undefined) ? 0 : get().totalPages
        }))

        // set currentPage on url if sent as parameter
        if(currentPage) { // !== 0
            const currentSearch = payload || get().currentSearch
            const params = new URLSearchParams(currentSearch.split("?")[1])
            params.set("page", currentPage)
            payload = `${payload.split("?")[0]}?${params.toString()}`
        }

        await Promise.resolve(getSamples(payload))
        .then((res) => {
            const dataLegnth_ = res?.samples.length
            const totalPages_ = res?.reportInfo?.totalPages

            if(dataLegnth_ === 0 && (totalPages_ === 1 || totalPages_ === 0)) {
                set(() => ({ noDataReceived: true }))
                return
            }
            set(() => ({
                noDataReceived: false,
                data: res,
                reportInfo: res.reportInfo,
                totalPages: totalPages_, // we separate the total pages for a more clear understanding
                needJumpToNextPage: dataLegnth_ === 0 && totalPages_ > 1,
            }))
        })
        .catch((err) => {
            console.error(err)
            set(() => ({
                error: err,
                data: []
            }))
        })
        .finally(() => {
            set(() => ({ loading: false }))
        })
    }
}))

