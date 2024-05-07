const fs = require("fs")

const lib = fs.readFileSync("dist/lib.js").toString().trim()
const header = fs.readFileSync("src/header.js").toString().trim()
const config = fs.readFileSync("src/default-config.js").toString().trim()

const userScript = `${header}

${config}

require(["lib"], (lib) => lib.run(CONFIG))

${lib}
`

fs.writeFile("dist/userscript.user.js", userScript, function (err) {
    if (err) return console.log(err)
})
