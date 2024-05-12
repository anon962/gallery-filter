export interface Config {
    tags?: ConfigRule[]
    titles?: ConfigRule[]
    uploaders?: ConfigRule[]
    categories?: ConfigRule[]
}

export interface ConfigRule {
    hide: string[]
    except?: string[]
}

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
        title: string
        uploader: string
        category: string
    }
}

export type RowRecordWithMetadata = Record<string, RowWithMetadata>

declare global {
    interface Window {
        GALLERY_FILTER_CONFIG: Config
    }
}
