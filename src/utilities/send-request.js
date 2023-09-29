import { getToken } from "./users-service";
export default async function sendRequest(url, method = 'GET', payload=null, headers = {}){
    const options = { method, headers };
    if(payload){
        if (payload instanceof FormData) {
            options.body = payload;
            // Don't manually set Content-Type for FormData. Let the browser do it.
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(payload);
        }
    }
    
    const token = getToken();
    if(token){
        options.headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(url, options);
    
    if (res.ok){
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return res.json();
        } else {
            return res.text();
        }
    } else {
        const errorData = await res.text();
        throw new Error(`sendRequest failed: ${errorData}`);
    }
}