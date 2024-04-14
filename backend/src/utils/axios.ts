import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

const axiosRequestWrapper = async (
    config: AxiosRequestConfig
): Promise<AxiosResponse | AxiosError> => {
    try {
        return await axios(config);
    } catch (error) {
        return error as AxiosError;
    }
};

export default axiosRequestWrapper;
