export default function css(rules) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(rules);
  return sheet;
}
