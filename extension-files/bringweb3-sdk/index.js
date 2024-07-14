const fetchRetailers = async () => {
    const res = fetch('http://localhost:3001')
    const json = await res.json()
    console.log(json);
}

module.exports = {
    fetchRetailers
}