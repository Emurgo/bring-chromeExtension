import { ApiEndpoint } from "../apiEndpoint";

const isWhitelisted = (urlString: string, whitelist: string[]): boolean => {
    try {
        const whitelistEndpoint = ApiEndpoint.getInstance().getWhitelistEndpoint()

        if (!whitelist.length) {
            return !!whitelistEndpoint;
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