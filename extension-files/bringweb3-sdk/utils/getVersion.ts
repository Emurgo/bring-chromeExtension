import pJson from '../package.json'

const getVersion = (): string => {
    return pJson.version
}

export default getVersion