const CONFIG = {
    tags: [
        // Hide all galleries with the "parody:..." tag except if the gallery has "parody:original"
        { hide: ["parody"], except: ["parody:original"] },

        // Hide all languages except english and chinese
        //   { hide: ['language'], except: ['language:english', 'language:chinese'] },

        // Hide all galleries with the tags containing the word "big" (eg "big breasts", "big penis")
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
}
