interface GIPagination {
    page: number;
    pageSize: number;
    total?: number;
}

interface GIObject {
    [key: string]: any;
}

interface GIFileInfo {
    key: string;
    url: string;
}
