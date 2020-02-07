import * as React from "react";
import { css, AnimationClassNames, Label, Link } from "office-ui-fabric-react";
import { IPersonaProfile } from "../Types";
import { openLink } from "../Tools";


export function renderContactDetails(profile: IPersonaProfile): React.ReactNode {
    return (
        <ul className={css("contact-details", AnimationClassNames.slideLeftIn400)}>
            <li>
                <Label id="emailLabel">Email</Label>
                <Link id="emailLink" href={`mailto:${profile.email}`} className="contact-link email" onClick={e => openLink(`mailto:${profile.email}`, e)} aria-labelledby="emailLabel emailLink">{profile.email}</Link>
            </li>
            {profile.imAddress && (
                <li>
                    <Label id="chatLabel">Chat</Label>
                    <Link id="chatLink" href={`sip:${profile.imAddress}`} className="contact-link chat" onClick={e => openLink(`sip:${profile.imAddress}`, e)} aria-labelledby="chatLabel chatLink" >{profile.imAddress}</Link>
                </li>
            )}
            <li>
                <Label id="workPhoneLabel">Work phone</Label>
                <Link id="workPhoneLink" href={`tel:${profile.businessPhone}`} className="contact-link business-phone" onClick={e => openLink(`tel:${profile.businessPhone}`, e)} aria-labelledby="workPhoneLabel workPhoneLink">{profile.businessPhone}</Link>
            </li>
            <li>
                <Label>Company</Label>
                <span>{profile.companyName}</span>
            </li>
            <li>
                <Label>Job title</Label>
                <span>{profile.jobTitle}</span>
            </li>
            <li>
                <Label>Department</Label>
                <span>{profile.department}</span>
            </li>
            <li>
                <Label>Office location</Label>
                <span>{profile.officeLocation}</span>
                <span>&nbsp;{profile.city}</span>
            </li>
        </ul>
    );
}
