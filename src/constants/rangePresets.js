import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

const dayUTC = () => dayjs().utc()
const subtractTime = (time, unit) => [dayUTC().subtract(time, unit), dayUTC()]

/**
 * constants for range presets used in the application.
 * These presets are used to quickly select a range of time for queries.
 */
export const RANGEPRESETS = [
    {
        label: '5m',
        value: () => subtractTime(5, 'minute'),
    },
    {
        label: '30m',
        value: () => subtractTime(30, 'minute'),
    },
    {
        label: '1h',
        value: () => subtractTime(1, 'hour'),
    },
    {
        label: '6h',
        value: () => subtractTime(6, 'hour'),
    },
    {
        label: '12h',
        value: () => subtractTime(12, 'hour'),
    },
    {
        label: '24h',
        value: () => subtractTime(24, 'hour'),
    },
    {
        label: '2D',
        value: () => subtractTime(2, 'day'),
    },
    {
        label: '7D',
        value: () => subtractTime(7, 'day'),
    },
    {
        label: '14D',
        value: () => subtractTime(14, 'day'),
    },
    {
        label: '30D',
        value: () => subtractTime(30, 'day'),
    }
]