export const fetchRetailers = async () => {
    const res = await fetch('https://sandbox-api.bringweb3.io/v1/extension/domains?country=us', {
        headers: {
            'x-api-key': ''
        }
    })
    const json = await res.json()
    console.log({ json });
    return json
}
