import {
    APIRequest,
    RowRecord,
    RowRecordWithMetadata,
    RowWithMetadata,
} from "./types"

// ===== Config =====

/** @type {ConfigRules} */
const RULES = {
    tags: [
        // Hide all galleries with the "parody:..." tag except if the gallery has "parody:original"
        { hide: ["parody"], except: ["parody:original"] },

        // Hide all languages except english and chinese
        //   { hide: ['language'], except: ['language:english', 'language:chinese'] },

        // Hide all galleries with the tags containing the word "big" (eg "big breasts", "big penis")
        //   { hide: ['big'] },
    ],
}

// ===== Types =====

/**
 * @typedef {object} Rule
 * @property {string[]} hide
 * @property {string[]=} except
 */

/**
 * @typedef {object} ConfigRules
 * @property {Rule[]} tags
 */

// ===== Logic =====

function selectGalleryRows(): RowRecord {
    const rows = Array.from(
        document.querySelectorAll("table.itg > tbody > tr:not(:has(th))")
    )
    console.log(`Found ${rows.length} galleries`, rows)

    return rows
        .map((tr) => {
            const a = tr.querySelector<HTMLAnchorElement>("a:has(.glink)")

            // https://e-hentai.org/g/2252604/9778b52cb2/
            const [protocol, _, domain, path, id, key, __] = a.href.split("/")

            const rowData = {
                tr,
                a,
                id,
                key,
            }

            console.debug("Parsed gallery row", rowData)
            return rowData
        })
        .reduce((acc, row) => {
            // Convert from array to object keyed by id
            return {
                ...acc,
                [row.id]: row,
            }
        }, {})
}

async function sendApiRequest(request) {
    const url = window.location.origin + "/api.php"

    console.log(`Sending API request to ${url}`, request)

    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(request, null, 2),
    })
}

// Based on Super's script: https://forums.e-hentai.org/index.php?showtopic=200041
async function fetchApiData(galleryRows: RowRecord) {
    const reqs = buildApiRequests(galleryRows)

    const resps = await Promise.all(
        reqs.map(async (req) => {
            const resp = await sendApiRequest(req)
            console.debug("Got API responses", resp)

            const data = await resp.json()
            console.debug("Got API data", data)

            return data
        })
    )

    // Extend rows with metadata
    const withMetadata: RowRecordWithMetadata = {}
    for (let resp of resps) {
        for (let metadata of resp.gmetadata) {
            const id = metadata.gid
            withMetadata[id] = {
                ...galleryRows[id],
                metadata,
            }
        }
    }

    return withMetadata

    function buildApiRequests(rs: RowRecord) {
        return Object.values(rs)
            .reduce(
                (acc, { id, key }) => {
                    const last = acc[acc.length - 1]
                    last.gidlist.push([id, key])

                    if (last.gidlist.length == 25) {
                        acc.push({
                            method: "gdata",
                            gidlist: [],
                            namespace: 1,
                        })
                    }

                    return acc
                },
                [{ method: "gdata", gidlist: [], namespace: 1 }] as APIRequest[]
            )
            .filter((req) => req.gidlist.length > 0)
    }
}

function checkGalleryVisibility(rowWithMetadata: RowWithMetadata) {
    for (let rule of RULES.tags) {
        const hidePatts = rule.hide.map((s) => stringToPatt(s))
        const activeHidePattern = findPatternMatchingSome(
            hidePatts,
            rowWithMetadata.metadata.tags
        )
        const shouldHide = !!activeHidePattern

        const exceptionPatts = rule.except?.map((s) => stringToPatt(s)) ?? []
        const activeException = findPatternMatchingSome(
            exceptionPatts,
            rowWithMetadata.metadata.tags
        )
        const isException = !!activeException

        const isHidden = shouldHide && !isException

        if (shouldHide && !isException) {
            console.debug(
                "Row matches a configured hide pattern",
                activeHidePattern
            )
        } else if (shouldHide && isException) {
            console.debug(
                "Row matches a configured hide pattern but also an exception pattern",
                activeHidePattern,
                activeException
            )
        } else {
            console.debug("Row does not match any hide patterns")
        }

        return !isHidden
    }

    function stringToPatt(string) {
        return new RegExp(string, "i")
    }

    function findPatternMatchingSome(patts, strings) {
        return patts.find((patt) => strings.some((name) => patt.test(name)))
    }
}

async function main() {
    const rows = selectGalleryRows()
    const rowsWithMetadata = await fetchApiData(rows)

    // Match order of what's seen on page
    const toCheck = Object.values(rowsWithMetadata)
    toCheck.sort((r1, r2) => {
        return findIndex(r1.tr) - findIndex(r2.tr)

        function findIndex(el) {
            return [...el.parentElement.childNodes].findIndex(
                (childEl) => childEl === el
            )
        }
    })

    for (let row of toCheck) {
        const title =
            row.tr.querySelector(".glink")?.textContent ??
            "@fixme: selector for title is broken"
        console.log(`Checking visibility of ${title}`, row.a.href, row)

        if (checkGalleryVisibility(row) === false) {
            row.tr.style.display = "none"
        }
    }
}

alert(7)
main()
;`
---DOCS---

Expected gallery layout:
<table class="itg">
    <tbody>
        <tr>
            <td>
                <a href="https://e-hentai.org/g/2126856/5d9bbf52e1/">
                    <div class="glink">
                        [nounanka (Abubu)] NPC Kan MOD 2 | NPC 강간 MOD 2 (The Elder Scrolls V: Skyrim) [Korean] [LWND]
                    </div>
                </a>
            </td>
        </tr>
    </tbody>
</table>

Example API response:
{
    "gmetadata": [
        {
            "gid": 619056,
            "token": "9cc6366c45",
            "archiver_key": "476419--ee0964b5e1fd633eb830ae7375b894cf6987d365",
            "title": "(C84) [UDON-YA (Kizuki Aruchu, ZAN)] Furohile Zero",
            "title_jpn": "(C84) [うどんや (鬼月あるちゅ, ZAN)] フロハイル·ゼロ",
            "category": "Doujinshi",
            "thumb": "https://ehgt.org/5a/1e/5a1e89d674b7495d6de5a46052abcaa33e1360f8-1870574-4265-6026-jpg_l.jpg",
            "uploader": "mmszhgny",
            "posted": "1376275096",
            "filecount": "26",
            "filesize": 83365118,
            "expunged": false,
            "rating": "4.67",
            "torrentcount": "0",
            "torrents": [],
            "tags": [
                "parody:original",
                "group:udon-ya",
                "artist:kizuki aruchu",
                "artist:zan",
                "male:virginity",
                "female:big breasts",
                "female:pantyhose",
                "female:selfcest",
                "other:full color",
                "other:multi-work series"
            ]
        }
    ]
}

`
