import * as React from "react";
import { Persona } from "./Persona";
import { GraphService } from "./GraphService";
import { PersonaShowMode, IPersonaProfile } from "./Types";
import { css, ActionButton, AnimationClassNames, FocusZone, KeyCodes, HoverCard, PersonaSize, Shimmer, TooltipHost } from "@fluentui/react";
import { renderContactDetails } from "./contactCard/ContactDetails";
import { renderOrgHierarchy } from "./contactCard/OrgDetails";
import { renderSummary } from "./contactCard/Summary";
import "./PersonaWithCard.scss";
import { openLink } from "./Tools";


export interface IPersonaWithCardProps {
    id?: string;
    email?: string;
    displayName?: string;
    showMode: PersonaShowMode;
    size?: PersonaSize;
}


enum CardShowModes {
    Summary,
    ContactDetails,
    OrgHierarchy
}


interface IPersonaWithCardState {
    profile: IPersonaProfile;
    isProfileLoading: boolean;
    manager: IPersonaProfile | undefined;
    isManagerLoading: boolean;
    allManagers: IPersonaProfile[] | undefined;
    directs: IPersonaProfile[] | undefined;
    cardShowMode: CardShowModes;
    history: IPersonaProfile[];
}


export class PersonaWithCard extends React.Component<IPersonaWithCardProps, IPersonaWithCardState> {
    private _isMounted: boolean;
    private readonly targetElementRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    constructor(props: IPersonaWithCardProps) {
        super(props);
        this.state = this.buildStateFromProps(props);
        this._isMounted = false;
    }


    public componentDidMount() {
        this._isMounted = true;
    }


    public componentWillUnmount() {
        this._isMounted = false;
    }


    public componentDidUpdate(prevProps: IPersonaWithCardProps) {
        if (prevProps.id !== this.props.id || prevProps.email !== this.props.email) {
            this.setState(this.buildStateFromProps(this.props));
        }
    }


    public render(): JSX.Element {
        return (
            <div ref={this.targetElementRef} data-is-focusable="true" tabIndex={0}>
                <HoverCard
                    expandingCardProps={{
                        onRenderCompactCard: this.renderCompactCard,
                        onRenderExpandedCard: this.renderExpandedCard
                    }}
                    onCardVisible={() => this.onCardVisible()}
                    instantOpenOnClick={true}
                    trapFocus={true}
                    setInitialFocus={true}
                    openHotKey={KeyCodes.enter}
                    className="persona-hover-card"
                    target={this.targetElementRef.current}
                >
                    <Persona
                        id={this.props.id}
                        email={this.props.email}
                        displayName={this.props.displayName}
                        showMode={this.props.showMode}
                        size={this.props.size}
                        className="contact-card-persona"
                    />
                </HoverCard>
            </div>
        );
    }


    private onCardVisible = () => {
        this.setState(this.buildStateFromProps(this.props), () => this.resolveProfile());        // reset the state
    }


    private buildStateFromProps = (props: IPersonaWithCardProps): IPersonaWithCardState => {
        if (!props.id && !props.email) {
            throw new Error("Either id or email is required");
        }

        return {
            profile: {
                id: (props.id || props.email) as string,
                email: props.email,
                displayName: props.displayName
            },
            isProfileLoading: true,
            manager: undefined,
            isManagerLoading: true,
            allManagers: undefined,
            directs: undefined,
            cardShowMode: CardShowModes.Summary,
            history: []
        };
    }


    private renderCompactCard = () => {
        return (
            <>
                {
                    this.state.history.length > 0 &&
                    <div className="back-section">
                        <TooltipHost content={`Back to ${this.state.history[this.state.history.length - 1].displayName}`}>
                            <ActionButton className="back-button" iconProps={{ iconName: "Back" }} onClick={() => this.showPrevPerson()} />
                        </TooltipHost>
                    </div>
                }
                {this.state.cardShowMode === CardShowModes.Summary ?
                    (
                        <div className="compact-card">
                            <Persona
                                id={this.state.profile.id}
                                email={this.state.profile.email}
                                displayName={this.state.profile.displayName}
                                showMode={PersonaShowMode.NameTitleDepartment}
                                size={PersonaSize.size72}
                            />
                            {this.renderCompactContacts()}
                        </div>
                    )
                    : (
                        <div className={css("compact-card", AnimationClassNames.scaleDownIn100)}>
                            <ActionButton className="person" onClick={() => this.showSummary()}>
                                <Persona
                                    id={this.state.profile.id}
                                    email={this.state.profile.email}
                                    displayName={this.state.profile.displayName}
                                    showMode={PersonaShowMode.NameOnly}
                                    size={PersonaSize.size40}
                                />
                            </ActionButton>
                        </div>
                    )
                }
            </>
        );
    }


    private renderCompactContacts = () => {
        return this.state.profile.email &&
            (
                <FocusZone>
                    <ActionButton iconProps={{ iconName: "Mail" }} className="mail-link" onClick={e => openLink(`mailto:${this.state.profile.email}`, e)}>
                        Send email
                    </ActionButton>
                    {this.state.profile.imAddress &&
                        <TooltipHost content="Chat">
                            <ActionButton iconProps={{ iconName: "Chat" }} className="chat-link" ariaLabel="Chat button" onClick={e => openLink(`sip:${this.state.profile.imAddress}`, e)} />
                        </TooltipHost>}
                </FocusZone>
            );
    }


    private renderExpandedCard = () => {
        return this.state.isProfileLoading ?
            (
                <div className="extended-card">
                    <Shimmer className="shimmer" />
                    <Shimmer className="shimmer" />
                    <Shimmer className="shimmer" />
                </div>
            ) :
            (
                <div className="extended-card">
                    {this.state.cardShowMode === CardShowModes.Summary && renderSummary(this.state.profile, this.state.manager, this.state.isManagerLoading, this.showContactDetails, this.showOrgHierarchy, this.showNextPerson)}
                    {this.state.cardShowMode === CardShowModes.ContactDetails && renderContactDetails(this.state.profile)}
                    {this.state.cardShowMode === CardShowModes.OrgHierarchy && renderOrgHierarchy(this.state.profile, this.state.allManagers, this.state.directs, this.showNextPerson)}
                </div>
            );
    }


    private showSummary = () => {
        this.modifyState({ cardShowMode: CardShowModes.Summary });
    }


    private showContactDetails = () => {
        this.modifyState({ cardShowMode: CardShowModes.ContactDetails });
    }


    private showOrgHierarchy = () => {
        this.modifyState({ cardShowMode: CardShowModes.OrgHierarchy });

        GraphService.getAllManagers(this.state.profile.id)
            .then(allManagers => this.modifyState({ allManagers }))
            .catch(() => this.modifyState({ allManagers: undefined }));

        GraphService.getDirects(this.state.profile.id)
            .then(directs => this.modifyState({ directs }))
            .catch(() => this.modifyState({ directs: undefined }));
    }


    private showNextPerson = (profile: IPersonaProfile | undefined) => {
        if (!profile) {
            return;
        }

        this.setState(
            {
                profile,
                isProfileLoading: false,
                manager: undefined,
                isManagerLoading: false,
                allManagers: undefined,
                directs: undefined,
                cardShowMode: CardShowModes.Summary,
                history: this.state.history.concat(this.state.profile)
            },
            () => this.resolveProfile());
    }


    private showPrevPerson = () => {
        if (!this.state.history.length) {
            return;
        }

        this.setState(
            {
                profile: this.state.history[this.state.history.length - 1],
                isProfileLoading: false,
                manager: undefined,
                isManagerLoading: false,
                allManagers: undefined,
                directs: undefined,
                cardShowMode: CardShowModes.Summary,
                history: this.state.history.slice(0, this.state.history.length - 1)
            },
            () => this.resolveProfile());
    }


    private resolveProfile = () => {
        GraphService.resolveProfile(this.state.profile.id)
            .then(profile => {
                this.modifyState({ profile, isProfileLoading: false });
            })
            .catch(() => {
                this.modifyState({ isProfileLoading: false });
            });

        GraphService.getManager(this.state.profile.id)
            .then(profile => {
                this.modifyState({ manager: profile, isManagerLoading: false });
            })
            .catch(() => {
                this.modifyState({ manager: undefined, isManagerLoading: false });
            });
    }


    private modifyState = (newState: Partial<IPersonaWithCardState>) => {
        const stateCopy: Partial<IPersonaWithCardState> = {};
        for (const key of Object.keys(this.state)) {
            stateCopy[key] = this.state[key];
        }
        for (const key of Object.keys(newState)) {
            stateCopy[key] = newState[key];
        }

        if (this._isMounted) {
            this.setState(stateCopy as IPersonaWithCardState);
        }
    }
}
