import * as React from "react";
import * as Enzyme from "enzyme";
import { renderOrgHierarchy } from "./OrgDetails";
import { buildProfile } from "../supporting/Profile";


test("renders full OrgDetails", () => {
    const wrap = Enzyme.shallow(<div>{renderOrgHierarchy(buildProfile(1), [buildProfile(2), buildProfile(3)], [buildProfile(4), buildProfile(5)], jest.fn())}</div>);
    expect(wrap).toMatchSnapshot();
});


test("renders OrgDetails w/o managers", () => {
    const wrap = Enzyme.shallow(<div>{renderOrgHierarchy(buildProfile(1), undefined, undefined, jest.fn())}</div>);
    expect(wrap).toMatchSnapshot();
});


test("renders OrgDetails w/o directs", () => {
    const wrap = Enzyme.shallow(<div>{renderOrgHierarchy(buildProfile(1), [buildProfile(2), buildProfile(3)], undefined, jest.fn())}</div>);
    expect(wrap).toMatchSnapshot();
});


test("OrgDetails handle clicks", () => {
    const onPersonaClick = jest.fn();
    const wrap = Enzyme.shallow(<div>{renderOrgHierarchy(buildProfile(1), [buildProfile(2), buildProfile(3)], [buildProfile(4), buildProfile(5)], onPersonaClick)}</div>);

    wrap.find(".person.manager").first().simulate("click");
    expect(onPersonaClick).toBeCalledWith(buildProfile(3));

    wrap.find(".person.direct").first().simulate("click");
    expect(onPersonaClick).toBeCalledWith(buildProfile(4));
});
