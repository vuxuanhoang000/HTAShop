import { getAuthToken } from "../utils/localStorage";
export function getHeaders() {
    const token = getAuthToken();
    return {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
    };
}
