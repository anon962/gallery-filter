Userscript for hiding galleries based on tag / title / uploader.

Some example use cases:

```ts
const CONFIG = {
    tags: [
        // Hide all galleries with the "parody:..." tag except if the gallery has "parody:original"
        { hide: ["parody"], except: ["parody:original"] },

        // Hide all languages except english and chinese
        //   { hide: ['language'], except: ['language:english', 'language:chinese'] },

        // Hide all galleries with tags containing the word "big" (eg "big breasts", "big penis")
        //   { hide: ['big'] },

        // Regex is okay too
        //   { hide: ['^z.*a$', '\sman'] },
    ],
    titles: [
        // Same as above
        // { hide: ["dorei"], except: ["maid"] },
    ],
    uploaders: [
        // Same as above
        //   Use the ^ and $ operators if you want an exact match
        //   For example, write ^some_name$ instead of some_name
        //     otherwise you'll end up blocking other users with similar names (eg some_name123 and user_with_some_name)
        // { hide: ['^some_name$'] }
    ],
    categories: [
        // Same as above, useful for favorites page where there's no filters
        // { hide: ["western"] },
    ],
}
```

### Usage

Copy-paste the latest `userscript.user.js` file from the [releases section](https://github.com/anon962/gallery-filter/releases/) into a userscript extension like [Violentmonkey](https://violentmonkey.github.io/get-it/).

Then edit the `GALLERY_FILTER_CONFIG` section at the top to suit your needs.

### Building

Install dependencies:

```bash
npm install
```

Compile into single js file:

```bash
npm run build
```

To install the userscript, copy-paste `dist/userscript.user.js` into whatever userscript extension you installed in the browser.

### Automatic builds

Alternatively, to recompile the script on every change:

```
npm run watch
```

And if you're using the Violentmonkey extension, the copy-paste step [can also be automated](https://violentmonkey.github.io/posts/how-to-edit-scripts-with-your-favorite-editor/#install-a-local-script).

The tldr is to first set up a web server to host the userscript

```bash
# -c-1 disables caching
npx http-server ./dist -c-1
```

Then when you visit http://localhost:8080/userscript.user.js, Violentmonkey should [ask for permission](https://github.com/anon962/gallery-filter/assets/80538688/008959fc-a00e-4a80-b0ee-5664c41aa790) to "track changes" and "reload tab" on change.

### TODO

-   Human-readable bundler output
    -   plus needing to download an AMD module loader is lame
