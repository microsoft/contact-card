import * as React from "react";
import { css, ActionButton, AnimationClassNames, Label, PersonaSize, Shimmer, ShimmerElementType } from "@fluentui/react";
import { Persona } from "../Persona";
import { PersonaShowMode, IPersonaProfile } from "../Types";


export function renderOrgHierarchy(profile: IPersonaProfile, allManagers: IPersonaProfile[] | undefined, directs: IPersonaProfile[] | undefined, onPersonaClick: (profile: IPersonaProfile) => void): React.ReactNode {
    return allManagers ?
        (
            <>
                <Label className="org-hierarchy-title">Organization</Label>
                <ul className={css("org-hierarchy", AnimationClassNames.slideLeftIn400)}>
                    {renderAllManagers(allManagers, onPersonaClick)}
                    <li className="person-current">
                        <Persona
                            id={profile.id}
                            displayName={profile.displayName}
                            showMode={PersonaShowMode.NameTitleDepartment}
                            size={PersonaSize.size48}
                        />
                    </li>
                    {renderDirects(directs, onPersonaClick)}
                </ul>
            </>
        ) :
        (
            <ul className={css("org-hierarchy", AnimationClassNames.slideLeftIn400)}>
                <li className="person"><Shimmer shimmerElements={[{ type: ShimmerElementType.circle, height: 48 }, { type: ShimmerElementType.gap, width: 12 }, { type: ShimmerElementType.line }]} width={"80%"} /></li>
                <div className="hierarchy-splitter" />
                <li className="person"><Shimmer shimmerElements={[{ type: ShimmerElementType.circle, height: 48 }, { type: ShimmerElementType.gap, width: 12 }, { type: ShimmerElementType.line }]} width={"80%"} /></li>
                <div className="hierarchy-splitter" />
                <li className="person"><Shimmer shimmerElements={[{ type: ShimmerElementType.circle, height: 48 }, { type: ShimmerElementType.gap, width: 12 }, { type: ShimmerElementType.line }]} width={"80%"} /></li>
            </ul>
        );
}


function renderAllManagers(allManagers: IPersonaProfile[], onPersonaClick: (profile: IPersonaProfile) => void): React.ReactNode[] {
    const res: React.ReactNode[] = [];

    for (let i = allManagers.length - 1; i >= 0; --i) {
        const mngr = allManagers[i];
        res.push(
            <li key={i}>
                <ActionButton className="person manager" onClick={() => onPersonaClick(mngr)}>
                    <Persona
                        id={mngr.id}
                        displayName={mngr.displayName}
                        showMode={PersonaShowMode.NameTitleDepartment}
                        size={PersonaSize.size48}
                    />
                </ActionButton>
            </li>
        );
        res.push(<div className="hierarchy-splitter" key={`spl-${i}`} />);
    }

    return res;
}


function renderDirects(directs: IPersonaProfile[] | undefined, onPersonaClick: (profile: IPersonaProfile) => void): React.ReactNode {
    if (!directs || !directs.length) {
        return <></>;
    }

    let key = 0;
    return (
        <>
            <div className="hierarchy-splitter" />
            <li className="directs">
                <Label className="directs-label">Direct reports ({directs.length})</Label>
                <ul>
                    {directs.map(direct => (
                        <li key={key++}>
                            <ActionButton className="person direct" onClick={() => onPersonaClick(direct)}>
                                <Persona
                                    id={direct.id}
                                    displayName={direct.displayName}
                                    showMode={PersonaShowMode.NameTitle}
                                    size={PersonaSize.size48}
                                />
                            </ActionButton>
                        </li>
                    ))}
                </ul>
            </li>
        </>
    );
}
