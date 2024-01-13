import lume from "lume/mod.ts";
import theme from "theme/mod.ts";

const site = lume({ src: "lume/_theme", dest: `lume/_site` });

site.use(theme()).copy("assets").copy("favicons", ".");

export default site;
