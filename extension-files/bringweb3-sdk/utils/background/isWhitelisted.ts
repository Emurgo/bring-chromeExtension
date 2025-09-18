import { ApiEndpoint } from "../apiEndpoint";
import getDomain from "../getDomain";
import storage from "../storage/storage";
import { searchCompressed } from "./domainsListCompression";
import { updateCache } from "./updateCache";

const isWhitelisted = async (url: string): Promise<boolean> => {
    try {
        const whitelistEndpoint = ApiEndpoint.getInstance().getWhitelistEndpoint()

        // ***** IMPORTANT BEGIN ***** //

        if ((whitelistEndpoint?.trim().length ?? 0) < 1) {
            // This is local EMURGO change we do not allow there to be a version with no whitelist
            throw new Error('Cashback redirection whitelist endpoint is required!');
        }

        // ***** IMPORTANT END ***** //

        let whitelist = await storage.get('redirectsWhitelist');

        if (!(whitelist instanceof Uint8Array) || !whitelist?.length) {
            await updateCache()
            whitelist = await storage.get('redirectsWhitelist')
        }

        // ***** IMPORTANT BEGIN ***** //

        /*
         This is an EMURGO local change
         to add a comment around the
         whitelist presence check
         */

        // This must not change!
        if (!whitelist?.length) return false

        /*
         Previous library version used to perform an additional check on
         whether the `whitelistEndpoint`
         is present or not, to consider
         a missing whitelist a true or false.

         We have been locally changing
         no whitelist to always be false response. Not it has changed to be
         so by library default as well.

         If this behavior ever changes
         it needs to be carefully reviewed
         and there needs to be a good reason for it.
         */

          // ***** IMPORTANT END ***** //

        const domain = getDomain(url)

        const { matched } = searchCompressed(whitelist, domain)

        return matched;

    } catch (error) {
        console.error("Invalid URL:", url);
        return false;
    }
}

export default isWhitelisted;