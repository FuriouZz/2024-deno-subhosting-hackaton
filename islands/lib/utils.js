/**
 * @param {string} html
 * @returns
 */
export function escapeHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerHTML;
}

/**
 * @param {number} ms
 */
export function milliseconds(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
