
export module GraphServiceAuthenticator {
    let authCallback: () => Promise<string>;
    let p: Promise<string> | undefined;


    export function setAuthCallback(callback: () => Promise<string>): void {
        authCallback = callback;
    }


    export async function getAuthToken(): Promise<string> {
        if (!authCallback) {
            throw Error("AthCallback is not set. Call GraphServiceAuthenticator.setAuthCallback() to initialize it");
        }
        if (!p) {
            p = authCallback();
            p
                .then(() => { p = undefined; })
                .catch(() => { p = undefined; });
        }

        return p;
    }
}
