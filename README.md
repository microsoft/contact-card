[![Build Status](https://msmobilecenter.visualstudio.com/Mobile-Center/_apis/build/status/office-contact-card?branchName=master)](https://msmobilecenter.visualstudio.com/Mobile-Center/_build/latest?definitionId=3232?branchName=master)

# Office Contact Card

Contact card in Office style is a React component, which provides contact card UX with information from your Azure Active Directory.

[[https://github.com/Microsoft/contact-card/blob/master/sample/i/preview.png|alt=Preview]]

Main functionality:
* Avatar preview
* Name and title resolution
* Hover card with:
  * Contact info summary
  * Manager summary
  * Contact info details
  * Full organization hierarchy
  * People navigation history


# How to Use it

## Installation

```shell
npm i office-contact-card -s
```

You'd need to install these peer dependencies as well if you have not yet:

```shell
npm i react react-dom office-ui-fabric-react -s
```

## Authentication

The component requires access to [MS Graph](https://developer.microsoft.com/en-us/graph).

## Example

```typescript
import { GraphServiceAuthenticator, PersonaWithCard, PersonaShowMode } from "office-contact-card";

GraphServiceAuthenticator.setAuthCallback(() => Promise.resolve("-token-") );

function renderCard() {
  return <PersonaWithCard email={"test@fabricam.com"} showMode={PersonaShowMode.NameTitle} />;
}
```

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
