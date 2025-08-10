import pJson from '../package.json'
const version = process.env.VERSION

const getVersion = (): string => {
    return version || pJson.version
}

export default getVersion