/**
 * @param {string} html
 * @returns
 */
export function escapeHtml(html) {
  const div = document.createElement("div");
  div.textContent = html;
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

export function sucessAlert() {
  // <sl-alert variant="danger" closable>
  //   <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
  //   <strong>Changes cannot be saved.</strong><br />
  //   <span class="message"></span>
  // </sl-alert>
}
