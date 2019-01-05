import * as React from "react";
import * as Enzyme from "enzyme";
import { Persona } from "./Persona";
import { buildProfile } from "./supporting/Profile";
import { PersonaShowMode } from "./Types";
import { GraphService } from "./GraphService";
import { waitNextTick } from "./supporting/Promise";
import { PersonaSize } from "office-ui-fabric-react";

jest.mock("./GraphService");


afterEach(() => {
    jest.resetAllMocks();
});


test("renders Persona by Id", async () => {
    GraphService.resolveProfile = () => Promise.resolve(buildProfile(1));
    GraphService.getPhotoUrl = () => Promise.resolve("blob://pic1");

    const wrap = Enzyme.shallow(<Persona id="userId1" showMode={PersonaShowMode.NameOnly} />);
    await waitNextTick();
    expect(wrap).toMatchSnapshot();
});


test("renders Persona by Email", async () => {
    const wrap = Enzyme.shallow(<Persona email="userId1@contoso.com" showMode={PersonaShowMode.NameOnly} />);
    expect(wrap).toMatchSnapshot();
});


test("renders Persona with Title", async () => {
    GraphService.resolveProfile = () => Promise.resolve(buildProfile(1));
    GraphService.getPhotoUrl = () => Promise.resolve("blob://pic1");

    const wrap = Enzyme.shallow(<Persona id="userId1" showMode={PersonaShowMode.NameTitle} />);
    await waitNextTick();
    expect(wrap).toMatchSnapshot();
});


test("renders Persona with Title and Department", async () => {
    GraphService.resolveProfile = () => Promise.resolve(buildProfile(1));
    GraphService.getPhotoUrl = () => Promise.resolve("blob://pic1");

    const wrap = Enzyme.shallow(<Persona id="userId1" showMode={PersonaShowMode.NameTitleDepartment} />);
    await waitNextTick();
    expect(wrap).toMatchSnapshot();
});


test("renders Persona with extra props", async () => {
    const wrap = Enzyme.shallow(<Persona id="userId1" displayName="Initial Display Name 1" size={PersonaSize.size100} className="class1" showMode={PersonaShowMode.NameOnly} />);
    expect(wrap).toMatchSnapshot();
});


test("renders Persona fails if no Id or EMail", async () => {
    expect(() => Enzyme.shallow(<Persona showMode={PersonaShowMode.NameOnly} />))
        .toThrowError(/required/);
});


test("renders Persona with failed profile", async () => {
    GraphService.resolveProfile = () => Promise.reject(new Error());
    GraphService.getPhotoUrl = () => Promise.reject(new Error());

    const wrap = Enzyme.shallow(<Persona id="userId1" showMode={PersonaShowMode.NameOnly} />);
    await waitNextTick();
    expect(wrap).toMatchSnapshot();
});


test("re-renders Persona by Email", async () => {
    const wrap = Enzyme.shallow(<Persona email="userId1@contoso.com" showMode={PersonaShowMode.NameOnly} />);
    const render1 = wrap.html();

    wrap.setProps({ email: "userId2@contoso.com", showMode: PersonaShowMode.NameOnly });
    const render2 = wrap.html();

    expect(render1).not.toBe(render2);
});
