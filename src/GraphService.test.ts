// tslint:disable-next-line:no-import-side-effect
import "jest-fetch-mock";
import { GraphService } from "./GraphService";
import { GraphServiceAuthenticator } from "./";
import { buildProfileResponse, buildProfile } from "./supporting/Profile";
import { buildResponse } from "./supporting/Response";

beforeEach(() => {
    fetchMock.resetMocks();
    GraphServiceAuthenticator.setAuthCallback(async () => Promise.resolve("auth_token"));
});


test("resolveProfile()", async () => {
    fetchMock.mockImplementationOnce(async (req: Request) => Promise.resolve(
        buildResponse((await req.json()).requests[0].id, 200)
    ));

    const profile = await GraphService.resolveProfile("userId1");
    expect(profile).toEqual(buildProfile(1));

    const cachedProfile = await GraphService.resolveProfile("userId1");
    expect(cachedProfile).toEqual(buildProfile(1));
});


test("resolveProfile() when individual request error", async () => {
    fetchMock.mockImplementationOnce(async (req: Request) => Promise.resolve(
        buildResponse((await req.json()).requests[0].id, 500)
    ));
    await expect(GraphService.resolveProfile("userId5")).rejects.toThrow("500");
});


test("resolveProfile() when batch fails", async () => {
    fetchMock.mockResponseOnce("", { status: 500, statusText: "err1" });
    await expect(GraphService.resolveProfile("userId6")).rejects.toThrow("err1");
});


test("resolveProfile() correctly batches when calls exceed API limit of 20", async () => {
    jest.useRealTimers();
    type SingleReq = { id: string; method: string; url: string };
    type ReqType = { requests: SingleReq[] };
    fetchMock
        .mockImplementation(async (req: Request) => {
            const reqs = <ReqType>(await req.json());

            const responses: Response[] = [];
            reqs.requests.forEach(r => {
                responses.push(buildResponse(parseInt(r.id, 10), 200));
            });

            return responses;
        });

    // Create 100 profiles and fetch their details from API
    const ids = [];
    for (let i = 1; i <= 100; i++) {
        ids.push(`userId${i}`);
    }
    const promises = [];
    for (const currentId of ids) {
        const promise = GraphService.resolveProfile(currentId).then((profile) => {/**/}).catch((err) => {/**/});
        promises.push(promise);
    }

    await Promise.all(promises);

    // There should be five calls to processBatch()
    expect(fetchMock.mock.calls.length).toEqual(5);
});


test("getPhotoUrl()", async () => {
    URL.createObjectURL = jest.fn().mockReturnValueOnce("blob://url1");

    fetchMock.mockResponseOnce("image-data");
    const photoUrl = await GraphService.getPhotoUrl("userId1");
    expect(photoUrl).toEqual("blob://url1");

    const cachedPhotoUrl = await GraphService.getPhotoUrl("userId1");
    expect(cachedPhotoUrl).toEqual("blob://url1");
});


test("getPhotoUrl() when request fails", async () => {
    fetchMock.mockResponseOnce("", { status: 500, statusText: "err1" });
    await expect(GraphService.getPhotoUrl("userId5")).rejects.toThrow("err1");
});


test("getManager()", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(buildProfileResponse(2)));
    const profile = await GraphService.getManager("userId1");
    expect(profile).toEqual(buildProfile(2));

    const cachedManager = await GraphService.getManager("userId1");
    expect(cachedManager).toEqual(buildProfile(2));

    const cachedProfile = await GraphService.resolveProfile("userId2");
    expect(cachedProfile).toEqual(buildProfile(2));
});


test("getAllManagers()", async () => {
    fetchMock
        .once(JSON.stringify(buildProfileResponse(12)))
        .once(JSON.stringify(buildProfileResponse(13)))
        .once("", { status: 404 });

    const managers = await GraphService.getAllManagers("userId11");
    expect(managers).toEqual([buildProfile(12), buildProfile(13)]);

    const cachedManagers = await GraphService.getAllManagers("userId11");
    expect(cachedManagers).toEqual([buildProfile(12), buildProfile(13)]);

    let cachedProfile = await GraphService.resolveProfile("userId12");
    expect(cachedProfile).toEqual(buildProfile(12));

    cachedProfile = await GraphService.resolveProfile("userId13");
    expect(cachedProfile).toEqual(buildProfile(13));
});


test("getAllManagers() when request fails", async () => {
    fetchMock.mockResponseOnce("", { status: 500, statusText: "err1" });
    await expect(GraphService.getAllManagers("userId15")).rejects.toThrow("err1");
});


test("getDirects()", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ value: [buildProfileResponse(22), buildProfileResponse(23)] }));

    const directs = await GraphService.getDirects("userId21");
    expect(directs).toEqual([buildProfile(22), buildProfile(23)]);

    const cachedDirects = await GraphService.getDirects("userId21");
    expect(cachedDirects).toEqual([buildProfile(22), buildProfile(23)]);

    let cachedProfile = await GraphService.resolveProfile("userId22");
    expect(cachedProfile).toEqual(buildProfile(22));

    cachedProfile = await GraphService.resolveProfile("userId23");
    expect(cachedProfile).toEqual(buildProfile(23));
});


test("getDirects() filters out disabled users", async () => {
    const profile33 = buildProfileResponse(33);
    // tslint:disable-next-line:no-any
    (<any>profile33).accountEnabled = false;
    fetchMock.mockResponseOnce(JSON.stringify({ value: [buildProfileResponse(32), profile33] }));

    const directs = await GraphService.getDirects("userId31");
    expect(directs).toEqual([buildProfile(32)]);
});


test("getDirects() when request fails", async () => {
    fetchMock.mockResponseOnce("", { status: 500, statusText: "err1" });
    await expect(GraphService.getDirects("userId35")).rejects.toThrow("err1");
});

