declare module "*.module.css" {
  const css: Record<string, string>;
  export default css;
}

declare const __USE_LIVE_RELOAD: boolean | undefined;
