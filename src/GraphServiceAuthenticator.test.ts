import { GraphServiceAuthenticator } from "./GraphServiceAuthenticator";


test("getAuthToken() returns authToken", async () => {
    GraphServiceAuthenticator.setAuthCallback(async () => Promise.resolve("auth_token"));
    await expect(GraphServiceAuthenticator.getAuthToken()).resolves.toBe("auth_token");
});


test("getAuthToken() rejects if authCallback fails", async () => {
    GraphServiceAuthenticator.setAuthCallback(async () => Promise.reject(new Error("err1")));
    await expect(GraphServiceAuthenticator.getAuthToken()).rejects.toThrow("err1");
});


test("getAuthToken() fails if authCallback is not set", async () => {
    // tslint:disable-next-line:no-any
    GraphServiceAuthenticator.setAuthCallback(<any>undefined);
    await expect(GraphServiceAuthenticator.getAuthToken()).rejects.toThrow(/AuthCallback/);
});


test("getAuthToken() calls authCallback() only once if there's a pile", async () => {
    const authCallback = jest.fn().mockResolvedValue("auth_token");
    GraphServiceAuthenticator.setAuthCallback(authCallback);

    await Promise.all([
        GraphServiceAuthenticator.getAuthToken(),
        GraphServiceAuthenticator.getAuthToken(),
        GraphServiceAuthenticator.getAuthToken()
    ]);

    expect(authCallback).toBeCalledTimes(1);
});
