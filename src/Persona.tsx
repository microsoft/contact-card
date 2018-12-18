import * as React from "react";
import { Persona as PersonaOF, PersonaSize } from "office-ui-fabric-react";
import { IPersonaProfile, PersonaShowMode, ShowModeFlags } from "./Types";
import { GraphService } from "./GraphService";

export interface IPersonaProps {
    id?: string;
    email?: string;
    displayName?: string;
    showMode: PersonaShowMode;
    size?: PersonaSize;
    className?: string;
}


interface IPersonaState {
    profile: IPersonaProfile;
    photoUrl?: string;
}


export class Persona extends React.Component<IPersonaProps, IPersonaState> {
    private _isMounted: boolean = false;

    constructor(props: IPersonaProps) {
        super(props);
        this.state = this.buildStateFromProps(props);
    }


    public componentDidMount() {
        this._isMounted = true;
        this.resolveProfile();
    }

    public componentWillUnmount() {
        this._isMounted = false;
    }


    public componentDidUpdate(prevProps: IPersonaProps) {
        if (prevProps.id !== this.props.id || prevProps.email !== this.props.email) {
            this.setState(this.buildStateFromProps(this.props), () => this.resolveProfile());
        }
    }


    public render(): JSX.Element {
        return (
            <PersonaOF
                className={this.props.className}
                size={this.props.size || PersonaSize.size40}
                text={this.state.profile.displayName}
                // tslint:disable-next-line:no-bitwise
                secondaryText={this.props.showMode & ShowModeFlags.Title ? this.state.profile.jobTitle : undefined}
                // tslint:disable-next-line:no-bitwise
                tertiaryText={this.props.showMode & ShowModeFlags.Department ? this.state.profile.department : undefined}
                imageUrl={this.state.photoUrl}
                imageAlt={this.state.profile.displayName}
            />
        );
    }


    private buildStateFromProps(props: IPersonaProps): IPersonaState {
        if (!props.id && !props.email) {
            throw new Error("Either id or email is required");
        }

        return {
            profile: {
                id: (props.id || props.email) as string,
                email: props.email,
                displayName: props.displayName || this.extractAlias(props.email)
            }
        };
    }


    private resolveProfile() {
        GraphService.resolveProfile(this.state.profile.id)
            .then(profile => {
                if (this._isMounted) {
                    this.setState({ profile, photoUrl: this.state.photoUrl });
                }
            })
            .catch(() => { /* swallow*/ });

        // tslint:disable-next-line:no-floating-promises -- because of the final `then`
        GraphService.getPhotoUrl(this.state.profile.id)
            .catch(() => undefined)
            .then((photoUrl: string | undefined) => {
                if (this._isMounted) {
                    this.setState({ profile: this.state.profile, photoUrl });
                }
            });
    }


    private extractAlias(email: string | undefined): string | undefined {
        if (!email) {
            return email;
        }

        const p = email.indexOf("@");
        return (p !== -1) ? email.substr(0, p) : email;
    }
}

