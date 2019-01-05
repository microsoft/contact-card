import { openLink } from "./Tools";

let openSpy: jest.SpyInstance;

beforeEach(() => {
    openSpy = jest.spyOn(window, "open").mockImplementation();
});


afterEach(() => {
    openSpy.mockRestore();
});


test("openLink()", () => {
    openLink("mailto:test@contoso.com");
    expect(openSpy).toBeCalledWith("mailto:test@contoso.com", "_self");
});


test("openLink() prevents default handlers", () => {
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    // tslint:disable-next-line:no-any
    openLink("mailto:test@contoso.com", <any>{ preventDefault, stopPropagation });

    expect(preventDefault).toBeCalled();
    expect(stopPropagation).toBeCalled();
});
