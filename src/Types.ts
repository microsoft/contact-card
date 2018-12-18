// tslint:disable:no-bitwise

export interface IPersonaProfile {
    id: string;
    displayName?: string;
    jobTitle?: string;
    department?: string;
    email?: string;
    businessPhone?: string;
    imAddress?: string;
    officeLocation?: string;
    city?: string;
    companyName?: string;
}


export enum ShowModeFlags {
    Name = 1,
    Title = 2,
    Department = 4
}


export enum PersonaShowMode {
    NameOnly = ShowModeFlags.Name,
    NameTitle = ShowModeFlags.Name | ShowModeFlags.Title,
    NameTitleDepartment = ShowModeFlags.Name | ShowModeFlags.Title | ShowModeFlags.Department
}


export type ResolveFunc<T> = (value?: T | PromiseLike<T> | undefined) => void;

// tslint:disable-next-line:no-any
export type RejectFunc = (reason?: any) => void;
