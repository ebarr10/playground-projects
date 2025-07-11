const fs = require("fs");
const path = require("path");

const basePath = "./";
const folders = fs
  .readdirSync(basePath)
  .filter((file) => fs.statSync(path.join(basePath, file)).isDirectory());

const links = folders
  .map((f) => `<li><a href="${f}/">${f}</a></li>`)
  .join("\n");

const html = `
<!DOCTYPE html>
<html>

<head>
    <title>My Web Demos</title>
</head>

<body>
    <h1>My Web Demos</h1>
    <ul>
        ${links}
    </ul>
</body>

</html>
`;

fs.writeFileSync(path.join(basePath, "index.html"), html);
console.log("index.html generated!");
