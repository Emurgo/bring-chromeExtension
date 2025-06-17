import compareVersions from "./compareVersions";

// Function to handle timestamps for the extension, from version 1.4.3 onwards we use offsets instead of full timestamps, this function get an offset and returns a proper timestamp for the corresponding version
const parseTime = (offset: number, version: string) => {
    const isOffset = compareVersions(version, '1.4.3') >= 0;
    const timestamp = isOffset ? offset : Date.now() + offset;
    return timestamp;
}

export default parseTime;