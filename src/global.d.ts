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

interface RuleValidator<T> {
    (rule: any, value: T): Promise<void>;
}

interface GIGlobalLoading {
    isLoading: boolean;
    loadingTips?: string;
}
