/* Splits a string into two sections separated by three dots.
 * @param text The string to split
 * @param firstSectionLength Optional length for the first section
 * @param secondSectionLength Optional length for the second section
 * @returns The split string with three dots in the middle
 */
const splitStringWithDots = (
  text: string,
  firstSectionLength?: number,
  secondSectionLength?: number
): string => {
  if (!text) return '';

  // Default values if not provided
  const firstLength = firstSectionLength || Math.floor(text.length / 2);
  const secondLength = secondSectionLength || Math.floor(text.length / 2);

  // If the string is shorter than the combined length, split it in the middle
  if (text.length <= firstLength + secondLength) {
    const middlePoint = Math.floor(text.length / 2);
    const firstPart = text.substring(0, middlePoint);
    const secondPart = text.substring(middlePoint);
    return `${firstPart}...${secondPart}`;
  }

  // Otherwise, use the specified lengths
  const firstPart = text.substring(0, firstLength);
  const secondPart = text.substring(text.length - secondLength);

  return `${firstPart}...${secondPart}`;
}

export default splitStringWithDots;