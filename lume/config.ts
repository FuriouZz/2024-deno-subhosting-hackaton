import lume from "lume/mod.ts";
import theme from "theme/mod.ts";
import override from "./override.ts";

const site = lume({ src: "lume", dest: `lume/_site` })
  .use(theme())
  .use(override({
    rootPath: "_theme",
    entries: [
      "_data.yml",
      "_data",
      "_includes",
      "posts/_data.yml",
      "assets",
      "favicons",
    ],
  }))
  .data("type", "post", "/posts")
  .data("layout", "layouts/post.vto", "/posts")
  .data("author", "nobody", "/posts")
  .data("basename", "../posts", "/posts")
  .data("metas", { title: "=title", description: "" }, "/posts");

export default site;
