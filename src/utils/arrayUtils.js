export const ArrayUtils = {
    /*
     * map obect key into an array
     */
    mapKeys: (array) => array.map(val => {
        if(typeof val === 'object'){
            return Object.keys(val)
        }
        return null
    }),
    /*
     * remove duplicates entries from array
     */
    uniqueKeys: (array) => array.reduce((res, itm) => {
        let result = res.find(item => JSON.stringify(item) === JSON.stringify(itm))
        if(!result) return res.concat(itm)
        return res
    }, []),
    /*
     * remove duplicates entries from array of object
     */
    uniqueObjectKeys: (array, objectKey) => {
        const uniqueIds = new Set()
        return array.filter(element => {
            const isDuplicate = uniqueIds.has(element[objectKey])
            uniqueIds.add(element[objectKey])

            if (!isDuplicate) return true
            return false
        })
    },
    /*
     * remove null and undefined entries
     */
    clean: (array) => array.filter(element => {
        return element !== undefined && element !== null
    }),
    /*
     * check of object send is empty
     */
    isEmpty: (x) => {
        try {
            if(Array.isArray(x))
                return x.length === 0
            else if(x instanceof Object)
                return Object.keys(x).length === 0
            else
                return false
        } catch (error) {
            console.error(error)
        }
    },

    /*
     * positions array to string
     */
    posTostring: (pos) => {
        try {
            return "[" + pos.join(";") + "]"
        } catch (error) {
            console.error(error)
        }
    },

    /**
     * Prevent duplicates from array of objects
     */
    preventDuplicates: (array) => {
        // if the first position of the array is not an object do nothing
        if(!array[0] instanceof Object) return array

        return array.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.id === value.id
            ))
        )
    }
}