import axios from "axios";
/*
 * get server name from .env
 */
const { REACT_APP_SERVICES_IP, REACT_APP_SERVER_PORT} = process.env;
const SERVER_IP = `${REACT_APP_SERVICES_IP}:${REACT_APP_SERVER_PORT}`
const SERVER_MM_URL = `${SERVER_IP}/WebReport/rest`;

// replace "#" char for "%23" in url params
const fnReplacePad = (val) => val.replace(/#/g, '%23');

/*
 * log url request in console
 */
const logUrl = (params, route, action) => {
    console.log(`URL - ${action}: ${window.location.href.replace('3006', REACT_APP_SERVER_PORT)}/rest/${route}/${params.replace(/#/g,'%23')}`);
}

/*
 * set headers properties to avoid CORS rejection
 */
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};


/*
-------------------------------
*
* GET MONITORS DATA ROUTES
*
-------------------------------
*/


/*
 * GET all devices
 */
export const getDevices = async () => {
    console.log("🚀 ~ getDevices ~ ${SERVER_MM_URL}/components:", `${SERVER_MM_URL}/components`)
    const res = await axios.get(`${SERVER_MM_URL}/components`, {header: headers})
    return res.data
}

/*
 * GET all monitors from a device
 */
export const getMonitorsFromDevice = async (deviceName) => {
    const res = await axios.get(`${SERVER_MM_URL}/components/${deviceName}`, {header: headers})
    return res.data
}

/*
 * GET data from the server
 */
export const getSamples = async (url) => {
    const url_ecd = fnReplacePad(encodeURI(url))
    const decodedURI = decodeURIComponent(url_ecd)
    logUrl(decodedURI, "search", "GET")
    const res = await axios.get(`${SERVER_IP}/search/${decodedURI}`, {header: headers})
    return res.data
}

/*
 * GET csv transform data
 */
export const getDownloadData = async (url) => {
    const url_ecd = fnReplacePad(encodeURI(url))
    const decodedURI = decodeURIComponent(url_ecd)
    logUrl(decodedURI, "download", "GET")
    const res = await axios.get(`${SERVER_MM_URL}/download/${decodedURI}`, {header: headers})
    return res.data
}

/*
 * GET compatible conversion for a Unit type
 */
export const getUnitConversion = async (unitType) => {
    const res = await axios.get(`${SERVER_MM_URL}/units/${encodeURI(unitType)}`, {header: headers})
    return res.data
}



/*
-------------------------------
*
* STORE QUERY ROUTES
*
-------------------------------
*/


/*
 * GET all querys
 */
export const getAllQuerys = async () => {
    const res = await axios.get(`${SERVER_MM_URL}/query/`, {header: headers})
    return res.data
}

/*
 * get query by name 
 */
export const getQueryByName = async (name) => {
    const res = await axios.get(`${SERVER_MM_URL}/query/${encodeURI(name)}`, {header: headers})
    return res.data
}

/*
 * POST a new query
 */
export const insertQuery = async (payload) => {
    const res = await axios.post(`${SERVER_MM_URL}/query/`, payload, {header: headers})
    return res.data
}

/*
 * UPDATE a new query
 */
export const updateQuery = async (name, payload) => {
    const url_ecd = fnReplacePad(encodeURI(name))
    const res = await axios.put(`${SERVER_MM_URL}/query/${url_ecd}`, payload, {header: headers})
    return res.data
}

/*
 * DELETE query
 */
export const deleteQuery = async (params) => {
    const url_ecd = fnReplacePad(encodeURI(params))
    const res = await axios.delete(`${SERVER_MM_URL}/query?${url_ecd}`, {header: headers})
    return res.data
}


/*
-------------------------------
*
* SUMMARY ROUTES
*
-------------------------------
*/

/*
 * GET INTERVALS OF SUMMARY DATA
 */
export const getSummaryIntervals = async (component, magnitude) => {
    const magnitudeEcd = fnReplacePad(encodeURI(magnitude))
    const componentEcd = fnReplacePad(encodeURI(component))
    const res = await axios.get(`${SERVER_MM_URL}/components/${componentEcd}/monitors/${magnitudeEcd}/summary`, {header: headers})
    return res.data
}