import { ApiEndpoint } from "../apiEndpoint";
import storage from "../storage";
import { updateCache } from "./updateCache";

const isWhitelisted = async (urlString: string, whitelist: string[]): Promise<boolean> => {
    const whitelistEndpoint = ApiEndpoint.getInstance().getWhitelistEndpoint()
    if (whitelistEndpoint?.trim().length < 1) {
        // This is local EMURGO change we do not allow there to be a version with no whitelist
        throw new Error('Cashback redirection whitelist endpoint is required!');
    }
    try {
        if (whitelistEndpoint && !whitelist?.length) {
            await updateCache()
            whitelist = await storage.get('redirectsWhitelist')
        }

        if (!whitelist?.length) {
            // This is local EMURGO change we do not allow there to be a version with no whitelist
            return false;
        };

        const url = new URL(urlString);
        let domain = url.hostname.toLowerCase();

        // Remove "www." if present
        domain = domain.replace('www.', '');

        // Direct match check
        if (whitelist.includes(domain)) {
            return true;
        }

        return whitelist.some((pattern) => {
            if (pattern.startsWith("*.")) {
                const baseDomain = pattern.slice(2); // Remove "*."
                return domain.endsWith(baseDomain);
            }
            return false;
        });
    } catch (error) {
        console.error("Invalid URL:", urlString);
        return false;
    }
}

export default isWhitelisted;