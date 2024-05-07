import {
    APIRequest,
    Config,
    ConfigRule,
    RowRecord,
    RowRecordWithMetadata,
    RowWithMetadata,
} from "./types"

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
                [{ method: "gdata", gidlist: [], namespace: 1 } as APIRequest]
            )
            .filter((req) => req.gidlist.length > 0)
    }
}

function checkRule(rule: ConfigRule, strings: string[]): boolean {
    const hidePatts = rule.hide.map((s) => stringToPatt(s))
    const activeHidePattern = findPatternMatchingSome(hidePatts, strings)
    const shouldHide = !!activeHidePattern

    const exceptionPatts = rule.except?.map((s) => stringToPatt(s)) ?? []
    const activeException = findPatternMatchingSome(exceptionPatts, strings)
    const isException = !!activeException

    if (shouldHide && !isException) {
        console.log("Row matches a configured hide pattern", activeHidePattern)

        return true
    } else if (shouldHide && isException) {
        console.log(
            "Row matches a configured hide pattern but also an exception pattern",
            activeHidePattern,
            activeException
        )

        return false
    } else {
        return false
    }

    function stringToPatt(string: string) {
        return new RegExp(string, "i")
    }

    function findPatternMatchingSome(patts: RegExp[], strings: string[]) {
        return patts.find((patt) => strings.some((name) => patt.test(name)))
    }
}

function checkGalleryHidden(cfg: Config, row: RowWithMetadata): boolean {
    const bannedByTag = cfg.tags.some((rule) =>
        checkRule(rule, row.metadata.tags)
    )
    const bannedByTitle = cfg.titles.some((rule) =>
        checkRule(rule, [row.metadata.title])
    )
    const bannedByUploader = cfg.uploaders.some((rule) =>
        checkRule(rule, [row.metadata.uploader])
    )

    return bannedByTag || bannedByTitle || bannedByUploader
}

export async function run(cfg: Config) {
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

        if (checkGalleryHidden(cfg, row)) {
            row.tr.style.display = "none"
        }
    }
}
