Userscript for filtering galleries based on tags. Similar to the My Tags page on EH but supports regex.

### Building

Install dependencies:

```bash
npm install
```

Compile into single js file:

```bash
npm run build
```

To install the userscript, copy-paste `dist/userscript.user.js` into whatever userscript extension you use in the browser.

### Automatic builds

Alternatively, to recompile the script on every change:

```
npm run watch
```

And if you're using the Violentmonkey userscript extension, the copy-paste step [can also be automated](https://violentmonkey.github.io/posts/how-to-edit-scripts-with-your-favorite-editor/#install-a-local-script).

The tldr is to first setup a web server to host the userscript

```bash
cd dist
python3 -m http.server
```

Then when you visit http://localhost:8000/userscript.user.js, Violentmonkey should ask for permission to "track changes" and "reload tab" on change.

### TODO

-   Human-readable bundler output
    -   plus needing to download an AMD module loader is lame
