// /src/utilities/comments-service.js:
import * as contactAPI from './contact-api'

export async function postMessage(comment) {
    try {
        const response = await contactAPI.postMessage(comment);
        return (response && !response.error) ?
            { data: response, error: null }
            :
            { data: null, error: response.error };
    } catch (err) {
        return { data: null, error: `Failed to post comment: ${err.message}` };
    }
}