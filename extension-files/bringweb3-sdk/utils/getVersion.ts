import pJson from '../package.json'
import { ENV_VERSION } from './config'

const getVersion = (): string => {
    return (ENV_VERSION || pJson.version).split('-')[0] as string
}

export default getVersion