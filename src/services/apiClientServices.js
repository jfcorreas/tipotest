const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

export async function fetchAPI(fetchParams) {
    try {
        const { apiUrl, path, subpath, objectId, filterParams, options } = fetchParams;

        if (options && !options.headers) options.headers = headersList

        let requestUrl = `${apiUrl}/${path}`;

        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (subpath) requestUrl = requestUrl + '/' + subpath;

        if (filterParams) {
            requestUrl = `${requestUrl}?${new URLSearchParams(filterParams).toString()}`
        }
 
        const response = await fetch(requestUrl, options)
        const data = (response.status === 204)? null : await response.json()

        return data

    } catch (error) {
        throw error
    }
}