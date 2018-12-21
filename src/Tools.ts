import * as React from "react";
import { Button, BaseButton, LinkBase } from "office-ui-fabric-react";

export function openLink(url: string, e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement | HTMLDivElement | BaseButton | Button | LinkBase>) {
    let target: string | undefined = "_self";   // open in same window by default. This also prevents empty tabs for `mailto:` links in Chrome

    if (window.self !== window.top) {           // CSP (Content Security Policy) can prevent URL changing if we're inside iFrame. We let browser to decide where to open the URL
        target = undefined;
    }

    window.open(url, target);

    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
}
