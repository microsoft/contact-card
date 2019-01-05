import { IPersonaProfile } from "../Types";


export function buildProfileResponse(id: number) {
    return {
        id: `userId${id}`,
        displayName: `Display Name ${id}`,
        jobTitle: `Job Title ${id}`,
        department: `Department ${id}`,
        mail: `user${id}@contoso.com`,
        officeLocation: `1234-${id}`,
        city: "Redmond",
        businessPhones: [`555-123-456${id}`],
        imAddresses: [`im-user${id}@contoso.com`],
        companyName: "Contoso"
    };
}


export function buildProfile(id: number): IPersonaProfile {
    return {
        id: `userId${id}`,
        displayName: `Display Name ${id}`,
        jobTitle: `Job Title ${id}`,
        department: `Department ${id}`,
        email: `user${id}@contoso.com`,
        officeLocation: `1234-${id}`,
        city: "Redmond",
        businessPhone: `555-123-456${id}`,
        imAddress: `im-user${id}@contoso.com`,
        companyName: "Contoso"
    };
}
