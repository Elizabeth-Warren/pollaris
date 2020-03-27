import React from 'react';
import FormBlocks from 'wr/components/FormBlocks';
import useSourcedLink from 'wr/hooks/useSourcedLink';
import useContent from 'wr/hooks/useContent';
import select from 'wr/utils/select';

function FormElementMobileDisclaimer(props) {
  const { contentfulSettings } = useContent();
  const { smsCopy, smsLink } = select(contentfulSettings, 'formLabels.disclaimers');

  const [makeSourcedLink] = useSourcedLink();

  const overrideStyles = select(props, 'field.display.overrideStyles');

  const overrideText = select(props, 'field.textOverride');

  const ariaLabel = `${smsCopy} ${select(contentfulSettings, 'a11yLabels.linkNewWindow') || ''}`;

  if (overrideStyles) {
    return (
      <FormBlocks.DisclaimerCopy overrideStyles={overrideStyles}>
        {`${overrideText || smsCopy} `}
        <a
          href={makeSourcedLink(smsLink)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          {smsLink}
        </a>
      </FormBlocks.DisclaimerCopy>
    );
  }

  return (
    <FormBlocks.DisclaimerCopy>
      {`${overrideText || smsCopy} `}
      <a
        href={makeSourcedLink(smsLink)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {smsLink}
      </a>
    </FormBlocks.DisclaimerCopy>
  );
}

export default FormElementMobileDisclaimer;
