import {GlobalWithFetchMock} from "jest-fetch-mock";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { setIconOptions } from "office-ui-fabric-react";

// tslint:disable:prefer-type-cast no-var-requires no-require-imports

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require("jest-fetch-mock");
customGlobal.fetchMock = customGlobal.fetch;

Enzyme.configure({ adapter: new Adapter() });


setIconOptions({
    disableWarnings: true
});
