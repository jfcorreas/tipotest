const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

export async function fetchAPI(fetchParams) {
    try {
        const {
            apiUrl,
            path, objectId,
            subpath, subObjectId,
            filterParams, options
        } = fetchParams

        if (options && !options.headers) options.headers = headersList

        let requestUrl = `${apiUrl}/${path}`

        if (objectId) requestUrl += `/${objectId}`
        if (subpath) requestUrl += `/${subpath}`
        if (subObjectId) requestUrl += `/${subObjectId}`
        if (filterParams) {
            requestUrl += `?${new URLSearchParams(filterParams).toString()}`
        }
 
        const response = await fetch(requestUrl, options)
        const data = (response.status === 204)? null : await response.json()

        return data

    } catch (error) {
        throw error
    }
}