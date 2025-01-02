/**
 * Compare two version strings.
 * @param {string} version1 - First version string (e.g., "1.2.6")
 * @param {string} version2 - Second version string (e.g., "1.2.3")
 * @returns {number} 1 if version1 > version2, -1 if version1 < version2, 0 if equal
 */
const compareVersions = (version1: string, version2: string): number => {
    // Split versions into parts and convert to numbers
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    // Make arrays equal length by padding with zeros
    const maxLength = Math.max(v1Parts.length, v2Parts.length);
    while (v1Parts.length < maxLength) v1Parts.push(0);
    while (v2Parts.length < maxLength) v2Parts.push(0);

    // Compare each part
    for (let i = 0; i < maxLength; i++) {
        if (v1Parts[i] > v2Parts[i]) return 1;
        if (v1Parts[i] < v2Parts[i]) return -1;
    }

    return 0;
}

export default compareVersions;