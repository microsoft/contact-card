// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`renders Summary w/o any manager 1`] = `
<div>
  <ul
    className="summary"
    tabIndex={-1}
  >
    <li>
      <CustomizedActionButton
        className="section-title contact-details-button"
        onClick={[MockFunction]}
      >
        Contact 
        <Icon
          className="chevron-icon"
          iconName="ChevronRight"
        />
      </CustomizedActionButton>
      <div
        className="contact-row"
      >
        <Icon
          className="contact-icon"
          iconName="Mail"
        />
        <StyledLinkBase
          aria-label="Email user1@contoso.com"
          className="contact-link email"
          href="mailto:user1@contoso.com"
          onClick={[Function]}
        >
          user1@contoso.com
        </StyledLinkBase>
      </div>
      <div
        className="contact-row"
      >
        <Icon
          className="contact-icon"
          iconName="Phone"
        />
        <StyledLinkBase
          aria-label="Phone 555-123-4561"
          className="contact-link business-phone"
          href="tel:555-123-4561"
          onClick={[Function]}
        >
          555-123-4561
        </StyledLinkBase>
      </div>
      <div
        className="contact-row"
      >
        <Icon
          className="contact-icon"
          iconName="POI"
        />
        <span>
          1234-1
        </span>
        <span>
           
          Redmond
        </span>
      </div>
      <CustomizedActionButton
        aria-expanded={true}
        aria-label="Show more"
        aria-live="polite"
        className="more-details contact-details"
        data-focus="button"
        onClick={[Function]}
      >
        Show more Click Here
      </CustomizedActionButton>
    </li>
    <li>
      <CustomizedActionButton
        className="more-details org-details"
        onClick={[MockFunction]}
      >
        Show organization
      </CustomizedActionButton>
    </li>
  </ul>
</div>
`;

exports[`renders Summary with loading manager 1`] = `
<div>
  <ul
    className="summary"
    tabIndex={-1}
  >
    <li>
      <CustomizedActionButton
        className="section-title contact-details-button"
        onClick={[MockFunction]}
      >
        Contact 
        <Icon
          className="chevron-icon"
          iconName="ChevronRight"
        />
      </CustomizedActionButton>
      <div
        className="contact-row"
      >
        <Icon
          className="contact-icon"
          iconName="Mail"
        />
        <StyledLinkBase
          aria-label="Email user1@contoso.com"
          className="contact-link email"
          href="mailto:user1@contoso.com"
          onClick={[Function]}
        >
          user1@contoso.com
        </StyledLinkBase>
      </div>
      <div
        className="contact-row"
      >
        <Icon
          className="contact-icon"
          iconName="Phone"
        />
        <StyledLinkBase
          aria-label="Phone 555-123-4561"
          className="contact-link business-phone"
          href="tel:555-123-4561"
          onClick={[Function]}
        >
          555-123-4561
        </StyledLinkBase>
      </div>
      <div
        className="contact-row"
      >
        <Icon
          className="contact-icon"
          iconName="POI"
        />
        <span>
          1234-1
        </span>
        <span>
           
          Redmond
        </span>
      </div>
      <CustomizedActionButton
        aria-expanded={true}
        aria-label="Show more"
        aria-live="polite"
        className="more-details contact-details"
        data-focus="button"
        onClick={[Function]}
      >
        Show more Click Here
      </CustomizedActionButton>
    </li>
    <li>
      <CustomizedActionButton
        className="section-title org-details-button"
        onClick={[MockFunction]}
      >
        Reports to 
        <Icon
          className="chevron-icon"
          iconName="ChevronRight"
        />
      </CustomizedActionButton>
      <div
        className="person"
      >
        <StyledShimmerBase
          shimmerElements={
            Array [
              Object {
                "height": 40,
                "type": 2,
              },
              Object {
                "type": 3,
                "width": 12,
              },
              Object {
                "type": 1,
              },
            ]
          }
          width="80%"
        />
      </div>
      <CustomizedActionButton
        className="more-details org-details"
        onClick={[MockFunction]}
      >
        Show organization
      </CustomizedActionButton>
    </li>
  </ul>
</div>
`;

exports[`renders full Summary 1`] = `
<div>
  <ul
    className="summary"
    tabIndex={-1}
  >
    <li>
      <CustomizedActionButton
        className="section-title contact-details-button"
        onClick={[MockFunction]}
      >
        Contact 
        <Icon
          className="chevron-icon"
          iconName="ChevronRight"
        />
      </CustomizedActionButton>
      <div
        className="contact-row"
      >
        <Icon
          className="contact-icon"
          iconName="Mail"
        />
        <StyledLinkBase
          aria-label="Email user1@contoso.com"
          className="contact-link email"
          href="mailto:user1@contoso.com"
          onClick={[Function]}
        >
          user1@contoso.com
        </StyledLinkBase>
      </div>
      <div
        className="contact-row"
      >
        <Icon
          className="contact-icon"
          iconName="Phone"
        />
        <StyledLinkBase
          aria-label="Phone 555-123-4561"
          className="contact-link business-phone"
          href="tel:555-123-4561"
          onClick={[Function]}
        >
          555-123-4561
        </StyledLinkBase>
      </div>
      <div
        className="contact-row"
      >
        <Icon
          className="contact-icon"
          iconName="POI"
        />
        <span>
          1234-1
        </span>
        <span>
           
          Redmond
        </span>
      </div>
      <CustomizedActionButton
        aria-expanded={true}
        aria-label="Show more"
        aria-live="polite"
        className="more-details contact-details"
        data-focus="button"
        onClick={[Function]}
      >
        Show more Click Here
      </CustomizedActionButton>
    </li>
    <li>
      <CustomizedActionButton
        className="section-title org-details-button"
        onClick={[MockFunction]}
      >
        Reports to 
        <Icon
          className="chevron-icon"
          iconName="ChevronRight"
        />
      </CustomizedActionButton>
      <CustomizedActionButton
        className="person manager"
        onClick={[Function]}
      >
        <Persona
          displayName="Display Name 2"
          id="userId2"
          showMode={3}
          size={12}
        />
      </CustomizedActionButton>
      <CustomizedActionButton
        className="more-details org-details"
        onClick={[MockFunction]}
      >
        Show organization
      </CustomizedActionButton>
    </li>
  </ul>
</div>
`;