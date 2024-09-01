//All functions are written so they would be compatible with both Manifest V2 and V3.

const set = async (key: string, value: any) => {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.local.set({ [`bring_${key}`]: value }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

const get = async (key: string) => {
    return new Promise<any>((resolve, reject) => {
        chrome.storage.local.get([`bring_${key}`], (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data[`bring_${key}`]);
            }
        });
    });
}

const remove = async (key: string) => {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.local.remove([`bring_${key}`], () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

// const clear = async () => {
//     return new Promise<void>((resolve, reject) => {
//         chrome.storage.local.clear(() => {
//             if (chrome.runtime.lastError) {
//                 reject(chrome.runtime.lastError);
//             } else {
//                 resolve();
//             }
//         });
//     });
// }

export default {
    set,
    get,
    remove,
    // clear
}
