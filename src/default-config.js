window.GALLERY_FILTER_CONFIG = {
    tags: [
        // Hide all galleries with the "parody:..." tag except if the gallery has "parody:original"
        { hide: ["parody"], except: ["parody:original"] },

        // Hide all languages except english and chinese
        //   { hide: ['language'], except: ['language:english', 'language:chinese'] },

        // Hide all galleries with the tags containing the word "big" (eg "big breasts", "big penis")
        //   { hide: ['big'] },
    ],
}
