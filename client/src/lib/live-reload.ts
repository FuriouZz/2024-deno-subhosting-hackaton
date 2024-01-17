export default function livereload() {
  // __USE_LIVE_RELOAD is defined in `define` and gets replaced by esbuild
  console.log("Using live reload");
  const e = new EventSource("/api/live-reload");

  e.addEventListener("message", (a) => {
    console.log(a);
  });

  e.addEventListener(
    "change",
    (e) => {
      console.log(e);
      location.reload();
    },
  );
}
