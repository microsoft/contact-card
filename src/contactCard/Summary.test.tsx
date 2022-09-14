import * as React from "react";
import * as Enzyme from "enzyme";
import { renderSummary } from "./Summary";
import { buildProfile } from "../supporting/Profile";

jest.mock("../Tools");
import { openLink } from "../Tools";


test("renders full Summary", () => {
    const wrap = Enzyme.shallow(<div>{renderSummary(buildProfile(1), buildProfile(2), false, jest.fn(), jest.fn(), jest.fn())}</div>);
    expect(wrap).toMatchSnapshot();
});


test("renders Summary with loading manager", () => {
    const wrap = Enzyme.shallow(<div>{renderSummary(buildProfile(1), undefined, true, jest.fn(), jest.fn(), jest.fn())}</div>);
    expect(wrap).toMatchSnapshot();
});


test("renders Summary w/o any manager", () => {
    const wrap = Enzyme.shallow(<div>{renderSummary(buildProfile(1), undefined, false, jest.fn(), jest.fn(), jest.fn())}</div>);
    expect(wrap).toMatchSnapshot();
});


test("Summary handles clicks", () => {
    const onContactDetailsClick = jest.fn();
    const onOrgDetailsClick = jest.fn();
    const onPersonaClick = jest.fn();
    const wrap = Enzyme.shallow(<div>{renderSummary(buildProfile(1), buildProfile(2), false, onContactDetailsClick, onOrgDetailsClick, onPersonaClick)}</div>);

    wrap.find(".contact-details-button").simulate("click");
    expect(onContactDetailsClick).toBeCalledTimes(1);

    onContactDetailsClick.mockReset();
    wrap.find(".more-details.contact-details").simulate("click");
    expect(onContactDetailsClick).toBeCalledTimes(1);

    wrap.find(".org-details-button").simulate("click");
    expect(onOrgDetailsClick).toBeCalledTimes(1);

    onOrgDetailsClick.mockReset();
    wrap.find(".more-details.org-details").simulate("click");
    expect(onOrgDetailsClick).toBeCalledTimes(1);

    wrap.find(".person.manager").simulate("click");
    expect(onPersonaClick).toBeCalledTimes(1);
    expect(onPersonaClick.mock.calls[0][0]).toEqual(buildProfile(2));
});


test("Summary opens links", () => {
    const wrap = Enzyme.shallow(<div>{renderSummary(buildProfile(1), buildProfile(2), false, jest.fn(), jest.fn(), jest.fn())}</div>);
    wrap.find(".contact-link.email").simulate("click");
    wrap.find(".contact-link.business-phone").simulate("click");
    expect(openLink).toBeCalledTimes(2);
});
