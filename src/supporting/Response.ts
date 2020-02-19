import { buildProfileResponse } from "./Profile";

export function buildResponse(userId: number, status: number) {
    return new Response(JSON.stringify({
        responses: [
            {
                id: userId,
                body: buildProfileResponse(userId),
                status: status
            }
        ]
    }));
}
