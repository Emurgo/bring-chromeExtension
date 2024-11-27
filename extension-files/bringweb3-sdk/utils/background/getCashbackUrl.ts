const getCashbackUrl = (cashbackUrl: string | undefined): string | undefined => {
    return cashbackUrl ? chrome.runtime.getURL(cashbackUrl) : undefined;
}

export default getCashbackUrl;