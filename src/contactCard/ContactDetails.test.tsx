import * as React from "react";
import * as Enzyme from "enzyme";
import { renderContactDetails } from "./ContactDetails";
import { buildProfile } from "../supporting/Profile";

jest.mock("../Tools");
import { openLink } from "../Tools";


test("renders full ContactDetails", () => {
    const wrap = Enzyme.shallow(<div>{renderContactDetails(buildProfile(1))}</div>);
    expect(wrap).toMatchSnapshot();
});


test("renders ContactDetails w/o IM", () => {
    const profile = buildProfile(1);
    profile.imAddress = undefined;
    const wrap = Enzyme.shallow(<div>{renderContactDetails(profile)}</div>);
    expect(wrap).toMatchSnapshot();
});


test("ContactDetails opens links", () => {
    const wrap = Enzyme.shallow(<div>{renderContactDetails(buildProfile(1))}</div>);
    wrap.find(".contact-link.email").simulate("click");
    wrap.find(".contact-link.chat").simulate("click");
    wrap.find(".contact-link.business-phone").simulate("click");
    expect(openLink).toBeCalledTimes(3);
});
