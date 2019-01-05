
export module GraphServiceAuthenticator {
    let authCallback: () => Promise<string>;
    let currentAuthPromise: Promise<string> | undefined;


    export function setAuthCallback(callback: () => Promise<string>): void {
        authCallback = callback;
    }


    export async function getAuthToken(): Promise<string> {
        if (!authCallback) {
            throw Error("AuthCallback is not set. Call GraphServiceAuthenticator.setAuthCallback() to initialize it");
        }

        if (!currentAuthPromise) {                      // prevent the callback bombarding. We can return a currently awaiting (and not fulfilled/rejected promise) in case there's one already
            currentAuthPromise = authCallback();
            currentAuthPromise
                .then(() => { currentAuthPromise = undefined; })
                .catch(() => { currentAuthPromise = undefined; });
        }

        return currentAuthPromise;
    }
}
