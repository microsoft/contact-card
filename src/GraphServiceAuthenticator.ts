
export module GraphServiceAuthenticator {
    let authCallback: () => Promise<string>;


    export function setAuthCallback(callback: () => Promise<string>): void {
        authCallback = callback;
    }


    export async function getAuthToken(): Promise<string> {
        if (!authCallback) {
            throw Error("AthCallback is not set. Call GraphServiceAuthenticator.setAuthCallback() to initialize it");
        }
        return authCallback();
    }
}
