import { AxiosRequestConfig, AxiosResponse } from 'axios';
import instance from './intercept';
import { CustomResponse } from './type';

class HttpRequest {
    protected baseURL: string = '/api/';

    protected headers = {
        ContentType: 'application/json;charset=UTF-8'
    };

    private apiAxios({
        baseURL = this.baseURL,
        headers = this.headers,
        method,
        url,
        data,
        params,
        responseType
    }: AxiosRequestConfig): Promise<CustomResponse> {
        return new Promise((resolve, reject) => {
            instance({
                baseURL,
                headers,
                method,
                url,
                params,
                data,
                responseType
            })
                .then((response: AxiosResponse) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * get请求
     * @param baseURL
     * @param headers
     * @param url
     * @param data
     * @param params
     * @param responseType
     * @protected
     */
    protected fetchGet({
        baseURL,
        headers,
        url,
        data,
        params,
        responseType
    }: AxiosRequestConfig): Promise<CustomResponse> {
        return this.apiAxios({
            baseURL,
            headers,
            method: 'GET',
            url,
            data,
            params,
            responseType
        });
    }

    /**
     * post请求
     * @param baseURL
     * @param headers
     * @param url
     * @param data
     * @param params
     * @param responseType
     * @protected
     */
    protected fetchPost({
        baseURL,
        headers,
        url,
        data,
        params,
        responseType
    }: AxiosRequestConfig): Promise<CustomResponse> {
        return this.apiAxios({
            baseURL,
            headers,
            method: 'POST',
            url,
            data,
            params,
            responseType
        });
    }
}

export default HttpRequest;
