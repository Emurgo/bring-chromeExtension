import { ApiEndpoint } from "../apiEndpoint";
import storage from "../storage";
import { updateCache } from "./updateCache";

const isWhitelisted = async (urlString: string, whitelist: string[]): Promise<boolean> => {
    try {
        const whitelistEndpoint = ApiEndpoint.getInstance().getWhitelistEndpoint()

        if (whitelistEndpoint && !whitelist?.length) {
            await updateCache()
            whitelist = await storage.get('redirectsWhitelist')
        }

        if (!whitelist?.length) {
            return whitelistEndpoint ? false : true;
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