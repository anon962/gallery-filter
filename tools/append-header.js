const fs = require("fs")

const script = fs.readFileSync("dist/main.js").toString()
const header = `// ==UserScript==
// @name        Hide Galleries
// @namespace   E-Hentai
// @grant       none
// @include     https://e-hentai.org/
// @include     https://e-hentai.org/?*
// @include     https://e-hentai.org/tag/*
// @include     https://e-hentai.org/uploader/*
// @include     https://e-hentai.org/doujinshi*
// @include     https://e-hentai.org/manga*
// @include     https://e-hentai.org/artistcg*
// @include     https://e-hentai.org/gamecg*
// @include     https://e-hentai.org/western*
// @include     https://e-hentai.org/non-h*
// @include     https://e-hentai.org/imageset*
// @include     https://e-hentai.org/cosplay*
// @include     https://e-hentai.org/asianporn*
// @include     https://e-hentai.org/misc*
// @require     https://cdn.jsdelivr.net/npm/alameda@1.4.0/alameda.js
// @version     0.2.0
// ==/UserScript==

require(["main"]);

`

const userScript = header + script
fs.writeFile("dist/userscript.user.js", userScript, function (err) {
    if (err) return console.log(err)
})
