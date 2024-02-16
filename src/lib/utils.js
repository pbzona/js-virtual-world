/**
 * Get a random color in hsl format
 * @returns {string}
 */
export function getRandomColor() {
  const hue = (290 + Math.floor(Math.random() * 260)) % 359;
  return `hsl(${hue}, 100%, 60%)`;
}
