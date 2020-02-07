import { IPersonaProfile, ResolveFunc, RejectFunc } from "./Types";
import { GraphServiceAuthenticator } from "./GraphServiceAuthenticator";

export module GraphService {
    const photosCache: { [userId: string]: Promise<string> } = {};
    const profilesCache: { [userId: string]: Promise<IPersonaProfile> } = {};
    const managersCache: { [userId: string]: Promise<IPersonaProfile> } = {};
    const directsCache: { [userId: string]: Promise<IPersonaProfile[]> } = {};

    const profileFields = "id,displayName,jobTitle,mail,department,officeLocation,city,businessPhones,imAddresses,companyName";
    const graphBaseUrl = "https://graph.microsoft.com";


    export async function resolveProfile(emailOrId: string): Promise<IPersonaProfile> {
        if (!profilesCache[emailOrId]) {
            const profilePromise = resolveProfileInternal(emailOrId);
            profilesCache[emailOrId] = profilePromise;
            cacheByIdOrEmail(profilePromise, profilePromise, profilesCache);
        }
        return profilesCache[emailOrId];
    }


    export async function getPhotoUrl(emailOrId: string): Promise<string> {
        if (!photosCache[emailOrId]) {
            photosCache[emailOrId] = getPhotoUrlInternal(emailOrId);
            cacheByIdOrEmail(profilesCache[emailOrId], photosCache[emailOrId], photosCache);
        }
        return photosCache[emailOrId];
    }


    export async function getManager(emailOrId: string): Promise<IPersonaProfile> {
        if (!managersCache[emailOrId]) {
            const mngrProfilePromise = getManagerInternal(emailOrId);
            managersCache[emailOrId] = mngrProfilePromise;

            cacheByIdOrEmail(profilesCache[emailOrId], mngrProfilePromise, managersCache);
            cacheByIdOrEmail(mngrProfilePromise, mngrProfilePromise, profilesCache);
        }
        return managersCache[emailOrId];
    }


    export async function getAllManagers(emailOrId: string): Promise<IPersonaProfile[]> {
        const res: IPersonaProfile[] = [];
        const maxDepth = 15;

        try {
            for (let i = 0; i < maxDepth; ++i) {
                const manager = await getManager(emailOrId);
                res.push(manager);
                emailOrId = manager.id;
            }
        } catch (e) {
            if (e.name !== "NotFound") {
                throw e;
            }
        }

        return res;
    }


    export async function getDirects(emailOrId: string): Promise<IPersonaProfile[]> {
        if (!directsCache[emailOrId]) {
            const directsPromise = getDirectsInternal(emailOrId);
            directsCache[emailOrId] = directsPromise;

            cacheByIdOrEmail(profilesCache[emailOrId], directsPromise, directsCache);
            directsPromise
                .then(directs => {
                    for (const direct of directs) {
                        cacheByIdOrEmail(Promise.resolve(direct), Promise.resolve(direct), profilesCache);
                    }
                })
                .catch(() => { /* nothing to cache */ });
        }
        return directsCache[emailOrId];
    }


    function cacheByIdOrEmail<T>(profilePromise: Promise<IPersonaProfile>, value: Promise<T>, cacheStorage: { [userId: string]: Promise<T> }) {
        if (!profilePromise) {
            return;
        }

        profilePromise
            .then(profile => {
                cacheStorage[profile.id] = value;
                if (profile.email) {
                    cacheStorage[profile.email] = value;
                }
            })
            .catch(() => { /* don't cache errors */ });
    }


    async function resolveProfileInternal(emailOrId: string): Promise<IPersonaProfile> {
        const response = await enqueueRequest(`/users/${emailOrId}?$select=${profileFields}`, "GET");
        if (response.status < 400) {
            return buildProfile(response.body);
        } else {
            throw Error((response.body && response.body.error && response.body.error.message) || response.status);
        }
    }

    // tslint:disable-next-line:no-any
    type BatchResponse = { id: string; status: number; headers: any; body: any };
    let queue: { [id: string]: { id: string; url: string; method: string; onResolve: ResolveFunc<BatchResponse>; onReject: RejectFunc } } = {};
    let lastRequestId = 0;
    let batchTimer: number | undefined;

    async function enqueueRequest(relativeUrl: string, method: string): Promise<BatchResponse> {
        ++lastRequestId;

        let onResolve: ResolveFunc<BatchResponse> = () => { /**/ };
        let onReject: RejectFunc = () => { /**/ };
        // tslint:disable-next-line:promise-must-complete -- will be resolved in a separate function
        const p = new Promise<BatchResponse>((resolve, reject) => {
            onResolve = resolve;
            onReject = reject;
        });

        queue[`${lastRequestId}`] = { id: `${lastRequestId}`, url: relativeUrl, method, onResolve, onReject };
        if (batchTimer) {
            clearTimeout(batchTimer);
        }
        batchTimer = window.setTimeout(async () => { await processBatch(); }, 0);

        return p;
    }


    async function processBatch() {
        let batchNumber = 0;
        const batchLimit = 20;
        const batches = {
            0: []
        };
        const processingQueue = queue;
        queue = {};

        // Create a dictionary mapping indices to arrays of 20 requests each
        for (const id of Object.keys(processingQueue)) {
            const req = processingQueue[id];

            if (batches[batchNumber].length >= batchLimit) {
                batchNumber += 1;
                batches[batchNumber] = [];
            }

            batches[batchNumber].push({
                id: req.id,
                method: req.method,
                url: req.url
            });
        }

        // Process each batch of 20 requests one at a time
        for (const current of Object.keys(batches)) {
            const requests = batches[current];
            const adToken = await GraphServiceAuthenticator.getAuthToken();
            const batchRequest = new Request(`${graphBaseUrl}/v1.0/$batch`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${adToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ requests })
            });

            try {
                const batchResponse = await fetch(batchRequest);
                if (batchResponse.ok) {
                    const data = await batchResponse.json();
                    for (const response of <BatchResponse[]>data.responses) {
                        processingQueue[response.id].onResolve(response);
                    }
                } else {
                    throw buildErrorFromResponse(batchResponse);
                }
            } catch (e) {
                // reject all
                for (const id of Object.keys(processingQueue)) {
                    processingQueue[id].onReject(e);
                }
            }
        }
    }


    async function getManagerInternal(emailOrId: string): Promise<IPersonaProfile> {
        const adToken = await GraphServiceAuthenticator.getAuthToken();
        const request = new Request(`${graphBaseUrl}/v1.0/users/${emailOrId}/manager?$select=${profileFields}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${adToken}` }
        });

        const response = await fetch(request);
        if (response.ok) {
            const data = await response.json();
            return buildProfile(data);
        } else {
            throw buildErrorFromResponse(response);
        }
    }


    async function getPhotoUrlInternal(emailOrId: string): Promise<string> {
        const adToken = await GraphServiceAuthenticator.getAuthToken();
        const request = new Request(`${graphBaseUrl}/v1.0/users/${emailOrId}/photo/$value`, {
            method: "GET",
            headers: { Authorization: `Bearer ${adToken}` }
        });

        const response = await fetch(request, { cache: "force-cache" });
        if (response.ok) {
            const photoData = await response.blob();
            return URL.createObjectURL(photoData);
        } else {
            throw buildErrorFromResponse(response);
        }
    }


    async function getDirectsInternal(emailOrId: string): Promise<IPersonaProfile[]> {
        const adToken = await GraphServiceAuthenticator.getAuthToken();
        const request = new Request(`${graphBaseUrl}/v1.0/users/${emailOrId}/directReports?$select=${profileFields},accountEnabled`, {
            method: "GET",
            headers: { Authorization: `Bearer ${adToken}` }
        });

        const response = await fetch(request);
        if (response.ok) {
            const data = await response.json();
            return data.value
                // tslint:disable-next-line:no-any
                .filter((p: any) => p.accountEnabled !== false)
                .map(buildProfile);
        } else {
            throw buildErrorFromResponse(response);
        }
    }


    // tslint:disable-next-line:no-any
    function buildProfile(data: any): IPersonaProfile {
        return {
            id: data.id,
            displayName: data.displayName,
            jobTitle: data.jobTitle,
            department: data.department,
            email: data.mail,
            officeLocation: data.officeLocation,
            city: data.city,
            businessPhone: (data.businessPhones && data.businessPhones.length) ? data.businessPhones[0] : undefined,
            imAddress: (data.imAddresses && data.imAddresses.length) ? data.imAddresses[0] : undefined,
            companyName: data.companyName
        };
    }


    function buildErrorFromResponse(response: Response) {
        const ex = new Error(response.statusText);
        if (response.status === 404) {
            ex.name = "NotFound";
        }
        return ex;
    }
}
