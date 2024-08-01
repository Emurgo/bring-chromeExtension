const splitWordMaxFive = (word: string): string => {
    if (word.length <= 10) {
        const middleIndex = Math.ceil(word.length / 2);
        return `${word.slice(0, middleIndex)}...${word.slice(middleIndex)}`
    }
    return `${word.slice(0, 5)}...${word.slice(-5)}`
}

export default splitWordMaxFive