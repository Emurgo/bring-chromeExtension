export const fetchRetailers = async () => {
    const res = await fetch('http://localhost:3001')
    const json = await res.json()
    return json
}
