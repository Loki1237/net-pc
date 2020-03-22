import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export const getMyId = async () => {
    const res = await fetch('/api/auth/login-as', { method: "POST" });

    try {
        const user = await res.json();

        return user.id;
    } catch {
        return null;
    } 
}