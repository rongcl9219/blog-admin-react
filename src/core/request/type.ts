export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | '';
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export interface AxiosRequest {
    baseURL?: string;
    url: string;
    data?: any;
    params?: any;
    method?: Method;
    headers?: any;
    timeout?: number;
    responseType?: ResponseType;
}

export interface CustomResponse {
    readonly code: number;
    readonly status: boolean;
    readonly message: string;
    data?: any;
}

export interface AxiosResponse {
    data: CustomResponse;
    headers: any;
    request?: any;
    status?: number;
    msg: string;
    config: AxiosRequest;
}
