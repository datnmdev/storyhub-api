const UrlResolverUtils = {
    createUrl(uri: string, params: object) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, value);
            }
        }
        return `${uri}?${queryParams.toString()}`
    }
}

export default UrlResolverUtils;