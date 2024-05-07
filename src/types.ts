export interface APIRequest {
    method: "gdata"
    gidlist: Array<[string, string]>
    namespace: 1
}

export interface Row {
    tr: HTMLTableRowElement
    a: HTMLAnchorElement
    id: string
    key: string
}

export type RowRecord = Record<string, Row>

export type RowWithMetadata = Row & {
    metadata: {
        tags: string[]
    }
}

export type RowRecordWithMetadata = Record<string, RowWithMetadata>
