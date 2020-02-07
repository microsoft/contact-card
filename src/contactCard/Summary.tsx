import * as React from "react";
import { ActionButton, Icon, Link, PersonaSize, Shimmer, ShimmerElementType } from "office-ui-fabric-react";
import { Persona } from "../Persona";
import { IPersonaProfile, PersonaShowMode } from "../Types";
import { openLink } from "../Tools";


export function renderSummary(
    profile: IPersonaProfile,
    manager: IPersonaProfile | undefined,
    isManagerLoading: boolean,
    onContactDetailsClick: () => void,
    onOrgDetailsClick: () => void,
    onPersonaClick: (profile: IPersonaProfile) => void
): React.ReactNode {
    return (
        <ul tabIndex={-1} className="summary">
            {renderContactSummary(profile, onContactDetailsClick)}
            {renderOrgSummary(manager, isManagerLoading, onOrgDetailsClick, onPersonaClick)}
        </ul>
    );
}


function renderContactSummary(profile: IPersonaProfile, onContactDetailsClick: () => void): React.ReactNode {
    return (
        <li>
            <ActionButton className="section-title contact-details-button" onClick={onContactDetailsClick}>
                Contact <Icon iconName="ChevronRight" className="chevron-icon" />
            </ActionButton>

            <div className="contact-row">
                <Icon id="emailIcon" iconName="Mail" className="contact-icon" aria-label="email"/>
                <Link id="emailLink" href={`mailto:${profile.email}`} className="contact-link email" onClick={e => openLink(`mailto:${profile.email}`, e)} aria-labelledby="emailIcon emailLink">{profile.email}</Link>
            </div>
            {
                profile.businessPhone &&
                <div className="contact-row">
                    <Icon id="phoneIcon" iconName="Phone" className="contact-icon" aria-label="phone"/>
                    <Link id="phoneLink" href={`tel:${profile.businessPhone}`} className="contact-link business-phone" onClick={e => openLink(`tel:${profile.businessPhone}`, e)} aria-labelledby="phoneIcon phoneLink">{profile.businessPhone}</Link>
                </div>
            }
            <div className="contact-row">
                <Icon iconName="POI" className="contact-icon" />
                <span>{profile.officeLocation}</span>
                <span>&nbsp;{profile.city}</span>
            </div>
            <ActionButton className="more-details contact-details" onClick={onContactDetailsClick}>
                Show more
            </ActionButton>
        </li>
    );
}


function renderOrgSummary(
    manager: IPersonaProfile | undefined,
    isManagerLoading: boolean,
    onOrgDetailsClick: () => void,
    onPersonaClick: (profile: IPersonaProfile) => void
): React.ReactNode {
    return (
        <li>
            {(manager || isManagerLoading) &&
                <>
                    <ActionButton className="section-title org-details-button" onClick={onOrgDetailsClick}>
                        Reports to <Icon iconName="ChevronRight" className="chevron-icon" />
                    </ActionButton>
                    {
                        manager ?
                            <ActionButton className="person manager" onClick={() => onPersonaClick(manager)}>
                                <Persona
                                    id={manager.id}
                                    displayName={manager.displayName}
                                    showMode={PersonaShowMode.NameTitle}
                                    size={PersonaSize.size40}
                                />
                            </ActionButton>
                            :
                            <div className="person">
                                <Shimmer shimmerElements={[{ type: ShimmerElementType.circle, height: 40 }, { type: ShimmerElementType.gap, width: 12 }, { type: ShimmerElementType.line }]} width={"80%"} />
                            </div>
                    }
                </>
            }
            <ActionButton className="more-details org-details" onClick={onOrgDetailsClick}>
                Show organization
            </ActionButton>
        </li>
    );
}
