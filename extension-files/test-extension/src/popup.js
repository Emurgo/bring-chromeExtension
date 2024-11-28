import { getTurnOff, setTurnOff } from "@bringweb3/chrome-extension-kit";

const radio1 = document.querySelector("#false");
const radio2 = document.querySelector("#true");

const update = async (value) => {
    const res = await setTurnOff(value)
    console.log(res);
    init()
}

radio1.addEventListener("click", () => {
    update(false)
})
radio2.addEventListener("click", () => {
    update(true)
})

const init = async () => {
    // Send message to background script
    const res = await getTurnOff()
    console.log('init', res);
    if (!res.isTurnedOff) {
        radio1.checked = true;
    } else {
        radio2.checked = true;
    }
}
init()