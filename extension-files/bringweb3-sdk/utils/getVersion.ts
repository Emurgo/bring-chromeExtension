import pJson from '../package.json'
import { ENV_VERSION } from './config'

const getVersion = (): string => {
    /*
     This is Emurgo local change.
     When we make local fork fixes we publish them with version like N.N.N-fix.N
     But Bring backend depends on receiving an expected version number to respond correctly.
     This split by `-` cuts off the `-fix.N` part and leaves the "official" version number only.

     This means local fork versions MUST always match something like <LAST_OFFICIAL_VERSION>-fix.N
     */
    return (ENV_VERSION || pJson.version).split('-')[0] as string
}

export default getVersion