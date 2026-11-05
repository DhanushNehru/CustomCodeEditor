require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"]
});

const Sitemap = require("@snaddyvitch-dispenser/react-router-sitemap").default;
const router = require("./sitemapRoutes").default;

function generateSitemap() {
  return (
    new Sitemap(router)
      .build("https://custom-code-editor.vercel.app")
      .save("./public/sitemap.xml")
  );
}

generateSitemap();
