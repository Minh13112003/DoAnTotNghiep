import * as urls from "./ConstantAPI";
import { apiService } from "../utils/interceptorAxios";

export const UpReport = (payload) => {
    return apiService.post_form(urls.URL_Upreport, payload);
}
export const ExecuteCommentReport = (Idcomment) =>{
    return apiService.post(`${urls.URL_ExecuteReport}/${Idcomment}`);
}
export const ResponseCommentReport = (ResponseReport) =>{
    return apiService.post(urls.URL_ResponseCommentReport, ResponseReport);
}

export const GetCommentReport = (Idcomment) =>{
    return apiService.get(`${urls.URL_GetCommentReport}/${Idcomment}`)
}