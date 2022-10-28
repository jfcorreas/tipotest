export async function fetchAPI(fetchParams) {
    try {
        const { apiUrl, path, subpath, objectId, filterParams, options } = fetchParams;

        let requestUrl = `${apiUrl}/${path}`;

        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (subpath) requestUrl = requestUrl + '/' + subpath;

        if (filterParams) {
            requestUrl = requestUrl + '?' +
                new URLSearchParams(filterParams).toString()
        }
        
        const result = await fetch(requestUrl, options)
        const data = await result.json()

        return data

    } catch (error) {
        throw error;
    }
}