import * as React from "react";
import { ActionButton, Icon, Link, PersonaSize, Shimmer, ShimmerElementType } from "@fluentui/react";
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
            <ActionButton 
                className="section-title contact-details-button" 
                onClick={e => handleDetailsClick(onContactDetailsClick, e)}
            >
                Contact <Icon iconName="ChevronRight" className="chevron-icon" />
            </ActionButton>

            <div className="contact-row">
                <Icon iconName="Mail" className="contact-icon" />
                <Link 
                    href={`mailto:${profile.email}`} 
                    className="contact-link email" 
                    onClick={e => openLink(`mailto:${profile.email}`, e)}
                    aria-label={`Email ${profile.email}`}
                >
                    {profile.email}
                </Link>
            </div>
            {
                profile.businessPhone &&
                <div className="contact-row">
                    <Icon iconName="Phone" className="contact-icon" />
                    <Link 
                        href={`tel:${profile.businessPhone}`}
                        className="contact-link business-phone"
                        onClick={e => openLink(`tel:${profile.businessPhone}`, e)}
                        aria-label={`Phone ${profile.businessPhone}`}
                    >
                        {profile.businessPhone}
                    </Link>
                </div>
            }
            <div className="contact-row">
                <Icon iconName="POI" className="contact-icon" />
                <span>{profile.officeLocation}</span>
                <span>&nbsp;{profile.city}</span>
            </div>
            <ActionButton 
                className="more-details contact-details" 
                onClick={e => handleDetailsClick(onContactDetailsClick, e)} 
                aria-label={"show more"} 
                data-focus="button" 
                aria-live="assertive"
                role="button"
            >
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
                    <ActionButton 
                        className="section-title org-details-button" 
                        onClick={e => handleDetailsClick(onOrgDetailsClick, e)}
                    >
                        Reports to <Icon iconName="ChevronRight" className="chevron-icon" />
                    </ActionButton>
                    {
                        manager
                            ? <ActionButton className="person manager" onClick={() => onPersonaClick(manager)}>
                                <Persona
                                    id={manager.id}
                                    displayName={manager.displayName}
                                    showMode={PersonaShowMode.NameTitle}
                                    size={PersonaSize.size40}
                                />
                            </ActionButton>
                            : <div className="person">
                                <Shimmer
                                    shimmerElements={[{ type: ShimmerElementType.circle, height: 40 }, { type: ShimmerElementType.gap, width: 12 }, { type: ShimmerElementType.line }]} 
                                    width={"80%"} 
                                />
                            </div>
                    }
                </>
            }
            <ActionButton 
                className="more-details org-details"
                onClick={e => handleDetailsClick(onOrgDetailsClick, e)}
            >
                    Show organization
            </ActionButton>
        </li>
    );
}

const handleDetailsClick = (onDetailsClick: () => void, e?: React.MouseEvent<any>) => {
    // Manually set focus on contact card for screen readers
    if (e) {
        e.preventDefault();
        (document.querySelector(".ms-Callout") as HTMLElement).focus();
    }
    
    onDetailsClick();
}