interface GetQueryParamsProps {
    [key: string]: string
}

const getQueryParams = (query: GetQueryParamsProps) => {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
        if (key === 'url') {
            params.append(key, encodeURIComponent(value))
        } else {
            params.append(key, value)
        }
    })
    return params.toString()
}

export default getQueryParams