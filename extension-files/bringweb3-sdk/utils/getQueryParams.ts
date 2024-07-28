interface Query {
    [key: string]: string | undefined

}

interface props {
    query: Query
    prefix?: string
}

const getQueryParams = (props: props) => {
    const params = new URLSearchParams()
    const { query, prefix } = props

    Object.entries(query).forEach(([key, value]) => {
        if (!value) return
        if (prefix) key = `${prefix}_${key}`
        if (key === 'url') {
            params.append(key, encodeURIComponent(value))
        } else {
            params.append(key, value)
        }
    })
    return params.toString()
}

export default getQueryParams