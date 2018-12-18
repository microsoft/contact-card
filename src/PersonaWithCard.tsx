import * as React from "react";
import { Persona } from "./Persona";
import { GraphService } from "./GraphService";
import { PersonaShowMode, IPersonaProfile } from "./Types";
import { autobind, css, ActionButton, AnimationClassNames, FocusZone, HoverCard, Icon, Label, Link, PersonaSize, Shimmer, ShimmerElementType, TooltipHost } from "office-ui-fabric-react";
import "./PersonaWithCard.scss";

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
            <HoverCard
                expandingCardProps={{
                    onRenderCompactCard: this.renderCompactCard,
                    onRenderExpandedCard: this.renderExpandedCard,
                    compactCardHeight: this.state.cardShowMode === CardShowModes.Summary ? 145 : 145 - 60,
                    expandedCardHeight: this.state.cardShowMode === CardShowModes.Summary ? 385 : 385 + 60
                }}
                onCardVisible={() => this.onCardVisible()}
                instantOpenOnClick={true}
                trapFocus={true}
                className="persona-hover-card"
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
        );
    }


    @autobind
    private onCardVisible() {
        this.setState(this.buildStateFromProps(this.props), () => this.resolveProfile());        // reset the state
    }


    private buildStateFromProps(props: IPersonaWithCardProps): IPersonaWithCardState {
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


    @autobind
    private renderCompactCard() {
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
                            {
                                this.state.profile.email &&
                                <FocusZone>
                                    <ActionButton iconProps={{ iconName: "Mail" }} onClick={() => window.location.href = `mailto:${this.state.profile.email}`}>
                                        Send email
                                   </ActionButton>
                                    {this.state.profile.imAddress &&
                                        <TooltipHost content="Chat">
                                            <ActionButton iconProps={{ iconName: "Chat" }} onClick={() => window.location.href = `sip:${this.state.profile.imAddress}`} />
                                        </TooltipHost>
                                    }
                                </FocusZone>
                            }
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


    @autobind
    private renderExpandedCard() {
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
                    {this.state.cardShowMode === CardShowModes.Summary && this.renderSummary()}
                    {this.state.cardShowMode === CardShowModes.ContactDetails && this.renderContactDetails()}
                    {this.state.cardShowMode === CardShowModes.OrgHierarchy && this.renderOrgHierarchy()}
                </div>
            );
    }


    private renderSummary(): React.ReactNode {
        return (
            <ul tabIndex={-1} className="summary">
                <li>
                    <ActionButton className="section-title" onClick={() => this.showContactDetails()}>
                        Contact
                        <Icon iconName="ChevronRight" className="chevron-icon" />
                    </ActionButton>

                    <div className="contact-row">
                        <Icon iconName="Mail" className="contact-icon" />
                        <Link href={`mailto:${this.state.profile.email}`} className="contact-link">{this.state.profile.email}</Link>
                    </div>
                    {
                        this.state.profile.businessPhone &&
                        <div className="contact-row">
                            <Icon iconName="Phone" className="contact-icon" />
                            <Link href={`tel:${this.state.profile.businessPhone}`}>{this.state.profile.businessPhone}</Link>
                        </div>
                    }
                    <div className="contact-row">
                        <Icon iconName="POI" className="contact-icon" />
                        <span>{this.state.profile.officeLocation}</span>
                        <span>&nbsp;{this.state.profile.city}</span>
                    </div>
                    <ActionButton className="more-details" onClick={() => this.showContactDetails()}>
                        Show more
                    </ActionButton>
                </li>
                <li>
                    {(this.state.manager || this.state.isManagerLoading) &&
                        <>
                            <ActionButton className="section-title" onClick={() => this.showOrgHierarchy()}>
                                Reports to
                                <Icon iconName="ChevronRight" className="chevron-icon" />
                            </ActionButton>
                            {
                                this.state.manager ?
                                    <ActionButton className="person" onClick={() => this.showNextPerson(this.state.manager)}>
                                        <Persona
                                            id={this.state.manager.id}
                                            displayName={this.state.manager.displayName}
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
                    <ActionButton className="more-details" onClick={() => this.showOrgHierarchy()}>
                        Show organization
                    </ActionButton>
                </li>
            </ul>
        );
    }


    private renderContactDetails(): React.ReactNode {
        return (
            <ul className={css("contact-details", AnimationClassNames.slideLeftIn400)}>
                <li>
                    <Label>Email</Label>
                    <Link href={`mailto:${this.state.profile.email}`} className="contact-link">{this.state.profile.email}</Link>
                </li>
                {this.state.profile.imAddress && (
                    <li>
                        <Label>Chat</Label>
                        <Link href={`sip:${this.state.profile.email}`} className="contact-link">{this.state.profile.imAddress}</Link>
                    </li>
                )}
                <li>
                    <Label>Work phone</Label>
                    <Link href={`tel:${this.state.profile.businessPhone}`}>{this.state.profile.businessPhone}</Link>
                </li>
                <li>
                    <Label>Company</Label>
                    <span>{this.state.profile.companyName}</span>
                </li>
                <li>
                    <Label>Job title</Label>
                    <span>{this.state.profile.jobTitle}</span>
                </li>
                <li>
                    <Label>Department</Label>
                    <span>{this.state.profile.department}</span>
                </li>
                <li>
                    <Label>Office location</Label>
                    <span>{this.state.profile.officeLocation}</span>
                    <span>&nbsp;{this.state.profile.city}</span>
                </li>
            </ul>
        );
    }


    private renderOrgHierarchy(): React.ReactNode {
        return this.state.allManagers ?
            (
                <>
                    <Label className="org-hierarchy-title">Organization</Label>
                    <ul className={css("org-hierarchy", AnimationClassNames.slideLeftIn400)}>
                        {this.renderAllManagers()}
                        <li className="person-current">
                            <Persona
                                id={this.state.profile.id}
                                displayName={this.state.profile.displayName}
                                showMode={PersonaShowMode.NameTitleDepartment}
                                size={PersonaSize.size48}
                            />
                        </li>
                        {this.renderDirects()}
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


    private renderAllManagers(): React.ReactNode[] {
        const res: React.ReactNode[] = [];
        if (!this.state.allManagers) {
            return res;
        }

        for (let i = this.state.allManagers.length - 1; i >= 0; --i) {
            const mngr = this.state.allManagers[i];
            res.push(
                <li key={i}>
                    <ActionButton className="person" onClick={() => this.showNextPerson(mngr)}>
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


    private renderDirects(): React.ReactNode {
        if (!this.state.directs || !this.state.directs.length) {
            return <></>;
        }

        let key = 0;
        return (
            <>
                <div className="hierarchy-splitter" />
                <li className="directs">
                    <Label className="directs-label">Direct reports ({this.state.directs.length})</Label>
                    <ul>
                        {this.state.directs.map(direct => (
                            <li key={key++}>
                                <ActionButton className="person" onClick={() => this.showNextPerson(direct)}>
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

    @autobind
    private showSummary(): void {
        this.modifyState({ cardShowMode: CardShowModes.Summary });
    }


    @autobind
    private showContactDetails(): void {
        this.modifyState({ cardShowMode: CardShowModes.ContactDetails });
    }


    @autobind
    private showOrgHierarchy(): void {
        this.modifyState({ cardShowMode: CardShowModes.OrgHierarchy });

        GraphService.getAllManagers(this.state.profile.id)
            .then(allManagers => this.modifyState({ allManagers }))
            .catch(() => this.modifyState({ allManagers: undefined }));

        GraphService.getDirects(this.state.profile.id)
            .then(directs => this.modifyState({ directs }))
            .catch(() => this.modifyState({ directs: undefined }));
    }


    @autobind
    private showNextPerson(profile: IPersonaProfile | undefined) {
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

    private showPrevPerson() {
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


    private resolveProfile() {
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


    private modifyState(newState: Partial<IPersonaWithCardState>) {
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
