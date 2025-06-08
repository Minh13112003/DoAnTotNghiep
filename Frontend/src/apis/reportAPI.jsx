import * as urls from "./ConstantAPI";
import { apiService } from "../utils/interceptorAxios";

export const UpReport = (payload) => {
    return apiService.post_form(urls.URL_Upreport, payload);
}