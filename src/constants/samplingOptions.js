/**
 * This file contains constants for sampling options used in the application.
 * These options are used to define the sampling intervals for data queries.
 * @type {Array<{value: number, label: string}>}
 */
export const SAMPLINGOPTIONS = [
    {
        value: 0, 
        label: 'Default'
    },
    {
        value: 100000, 
        label: '100 milliseconds'
    },
    {
        value: 200000, 
        label: '200 milliseconds'
    },
    {
        value: 500000, 
        label: '500 milliseconds'
    },
    {
        value: 1000000, 
        label: '1 second'
    },
    {
        value: 2000000, 
        label: '2 seconds'
    },
    {
        value: 5000000, 
        label: '5 seconds'
    },
    {
        value: 10000000, 
        label: '10 seconds'
    },
    {
        value: 60000000, 
        label: '1 minute'
    },
    {
        value: 120000000, 
        label: '2 minutes'
    },
    {
        value: 300000000, 
        label: '5 minutes'
    },
    {
        value: 600000000, 
        label: '10 minutes'
    },
    {
        value: 3600000000, 
        label: '1 hour'
    },
    {
        value: 7200000000, 
        label: '2 hours'
    }
]