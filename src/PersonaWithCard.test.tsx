import * as React from "react";
import * as Enzyme from "enzyme";
import { buildProfile } from "./supporting/Profile";
import { PersonaShowMode, IPersonaProfile } from "./Types";
import { GraphService } from "./GraphService";
import { waitNextTick } from "./supporting/Promise";
import { PersonaSize, HoverCard } from "office-ui-fabric-react";
import { PersonaWithCard } from "./PersonaWithCard";
import { renderContactDetails } from "./contactCard/ContactDetails";
import { renderOrgHierarchy } from "./contactCard/OrgDetails";
import { renderSummary } from "./contactCard/Summary";
import { openLink } from "./Tools";

jest.mock("./Tools");
jest.mock("./GraphService");
jest.mock("./contactCard/ContactDetails");
jest.mock("./contactCard/OrgDetails");
jest.mock("./contactCard/Summary");

// tslint:disable:no-non-null-assertion

beforeEach(() => {
    // we've tested this components separately, we can mock them now
    (renderContactDetails as jest.Mock).mockImplementation((...args) => <div {...args} id="ContactDetailsMock" />);
    (renderOrgHierarchy as jest.Mock).mockImplementation((...args) => <div {...args} id="OrgHierarchyMock" />);
    (renderSummary as jest.Mock).mockImplementation((...args) => <div {...args} id="SummaryMock" />);
});


afterEach(() => {
    jest.resetAllMocks();
});


test("renders PersonaWithCard initial state", async () => {
    const wrap = Enzyme.shallow(<PersonaWithCard id="userId1" showMode={PersonaShowMode.NameOnly} />);
    expect(wrap).toMatchSnapshot();
});


test("renders PersonaWithCard with extra props", async () => {
    const wrap = Enzyme.shallow(<PersonaWithCard id="userId1" displayName="Initial Display Name 1" size={PersonaSize.size100} showMode={PersonaShowMode.NameOnly} />);
    expect(wrap).toMatchSnapshot();
});


test("renders PersonaWithCard fails if no Id and EMail", async () => {
    expect(() => Enzyme.shallow(<PersonaWithCard showMode={PersonaShowMode.NameOnly} />))
        .toThrowError(/required/);
});


test("re-renders PersonaWithCard by Email", async () => {
    const wrap = Enzyme.shallow(<PersonaWithCard email="userId1@contoso.com" showMode={PersonaShowMode.NameOnly} />);
    const render1 = wrap.html();

    wrap.setProps({ email: "userId2@contoso.com", showMode: PersonaShowMode.NameOnly });
    const render2 = wrap.html();

    expect(render1).not.toBe(render2);
});


test("renders Compact card", async () => {
    const compactCard = renderCompactCard(await renderOpenedCard());
    expect(compactCard).toMatchSnapshot();
});


test("renders Compact card w/o IM address", async () => {
    const profile = buildProfile(1);
    profile.imAddress = undefined;
    const compactCard = renderCompactCard(await renderOpenedCard(profile));
    expect(compactCard).toMatchSnapshot();
});


test("opens link in Compact card", async () => {
    const compactCard = renderCompactCard(await renderOpenedCard());

    compactCard.find(".mail-link").simulate("click");
    expect(openLink).toBeCalledWith(`mailto:${buildProfile(1).email}`, undefined);

    compactCard.find(".chat-link").simulate("click");
    expect(openLink).toBeCalledWith(`sip:${buildProfile(1).imAddress}`, undefined);
});


test("renders Expanded card with progress", async () => {
    GraphService.resolveProfile = async () => Promise.resolve(buildProfile(1));
    GraphService.getManager = async () => Promise.resolve(buildProfile(2));

    const openedCard = Enzyme.shallow(<PersonaWithCard id="userId1" showMode={PersonaShowMode.NameOnly} />);
    openedCard.find(HoverCard).props().onCardVisible!();

    const expandedCard = renderExpandedCard(openedCard);
    expect(expandedCard).toMatchSnapshot();
});


test("renders Expanded card with Summary", async () => {
    const expandedCard = renderExpandedCard(await renderOpenedCard());
    expect(expandedCard).toMatchSnapshot();
});


test("renders Expanded card with ContactDetails", async () => {
    const openedCard = await renderOpenedCard();
    let expandedCard = renderExpandedCard(openedCard);

    (renderSummary as jest.Mock).mock.calls[0][3]();        // call showContactDetails()
    expandedCard = renderExpandedCard(openedCard);
    expect(expandedCard).toMatchSnapshot();
});


test("renders Compact card with ContactDetails", async () => {
    const openedCard = await renderOpenedCard();
    renderExpandedCard(openedCard);
    (renderSummary as jest.Mock).mock.calls[0][3]();        // call showContactDetails()

    const compactCard = renderCompactCard(openedCard);
    expect(compactCard).toMatchSnapshot();
});


test("switches to summaryMode when clicking on person in Compact card", async () => {
    const openedCard = await renderOpenedCard();
    renderExpandedCard(openedCard);
    (renderSummary as jest.Mock).mock.calls[0][3]();        // call showContactDetails()
    const compactCard = renderCompactCard(openedCard);
    compactCard.find(".person").simulate("click");

    const expandedCard = renderExpandedCard(openedCard);
    expect(expandedCard).toMatchSnapshot();
});


test("renders Expanded card with OrgHierarchy", async () => {
    GraphService.getAllManagers = async () => Promise.resolve([buildProfile(2), buildProfile(3)]);
    GraphService.getDirects = async () => Promise.resolve([buildProfile(12), buildProfile(13)]);

    const openedCard = await renderOpenedCard();
    let expandedCard = renderExpandedCard(openedCard);

    (renderSummary as jest.Mock).mock.calls[0][4]();        // call showOrgHierarchy()
    await waitNextTick();
    expandedCard = renderExpandedCard(openedCard);
    expect(expandedCard).toMatchSnapshot();
});


test("renders next Person", async () => {
    const openedCard = await renderOpenedCard();
    renderExpandedCard(openedCard);

    (renderSummary as jest.Mock).mock.calls[0][5](buildProfile(2));        // call showNextPerson()
    await waitNextTick();

    const compactCard = renderCompactCard(openedCard);
    expect(compactCard).toMatchSnapshot();
});


test("renders prev Person", async () => {
    const openedCard = await renderOpenedCard();
    renderExpandedCard(openedCard);

    (renderSummary as jest.Mock).mock.calls[0][5](buildProfile(2));        // call showNextPerson()
    await waitNextTick();
    let compactCard = renderCompactCard(openedCard);
    compactCard.find(".back-button").simulate("click");
    await waitNextTick();

    compactCard = renderCompactCard(openedCard);
    expect(compactCard).toMatchSnapshot();
});


async function renderOpenedCard(profile?: IPersonaProfile) {
    const extractNum = (s: string) => parseInt(s.match(/\d+/)![0], 10);
    GraphService.resolveProfile = async (userId) => Promise.resolve(profile || buildProfile(extractNum(userId)));
    GraphService.getManager = async (userId) => Promise.resolve(buildProfile(extractNum(userId) + 1));

    const wrap = Enzyme.shallow(<PersonaWithCard id="userId1" showMode={PersonaShowMode.NameOnly} />);
    wrap.find(HoverCard).props().onCardVisible();

    await waitNextTick();

    return wrap;
}


function renderCompactCard(openedCard: Enzyme.ShallowWrapper) {
    return Enzyme.shallow(<div>{openedCard.find(HoverCard).props().expandingCardProps.onRenderCompactCard()}</div>);
}


function renderExpandedCard(openedCard: Enzyme.ShallowWrapper) {
    return Enzyme.shallow(<div>{openedCard.find(HoverCard).props().expandingCardProps.onRenderExpandedCard()}</div>);
}
