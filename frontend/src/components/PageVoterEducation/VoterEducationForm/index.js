import React, { useEffect } from 'react';
import { BodyCopy } from '@ewarren/persist';
import useBreakpoint from 'wr/hooks/useBreakpoint';
import theme from 'wr/theme';
import queryString from 'query-string';

import Form from 'wr/components/Form';
import FormElementMobileDisclaimer from 'wr/components/FormElementMobileDisclaimer';
import { LIGHT_COLOR_SCHEME, HALF_WIDTH } from 'wr/components/FormBlocks';
import useBSDFormManager from 'wr/hooks/useBSDFormManager';

import Blocks from './style';

const hiddenFieldProps = {
  type: 'hidden',
  isOptional: true,
};

function VoterEducationForm(props) {
  const {
    formCallToAction,
    bsdFormId,
    formSubmitButtonText,
    formPostSubmissionMessage,
  } = props;

  const isMobileLarge = useBreakpoint(theme.breakpoints.mobileLarge).width;

  const display = {
    colorScheme: LIGHT_COLOR_SCHEME,
    width: HALF_WIDTH,
  };

  const form = {
    formId: `${bsdFormId}`,
    firstName: {
      type: 'firstName',
      display,
    },
    lastName: {
      type: 'lastName',
      display,
    },
    email: {
      type: 'email',
      display,
    },
    phone: {
      type: 'phone',
      isOptional: true,
      display: {
        colorScheme: LIGHT_COLOR_SCHEME,
        ColumnComponent: Blocks.PhoneField,
        hideDisclaimer: !isMobileLarge,
      },
    },
    submit: {
      type: 'submit',
      label: formSubmitButtonText,
      display: {
        ComponentOverride: Blocks.FormSubmitButton,
      },
    },
    addr1: hiddenFieldProps,
    city: hiddenFieldProps,
    state_cd: hiddenFieldProps,
    zip: hiddenFieldProps,
    'custom-18410': hiddenFieldProps,
  };

  const formManager = useBSDFormManager(
    bsdFormId,
    form,
  );

  const { setFieldValue, formState } = formManager;

  useEffect(() => {
    const userLocation = queryString.parse(window.location.search);
    userLocation.voter_ed_page = window.location.href;

    Object.entries({
      addr1: ['street_number', 'street'],
      city: ['city'],
      zip: ['zip'],
      state_cd: ['state'],
      'custom-18410': ['voter_ed_page'],
    }).forEach(
      ([key, values]) => {
        setFieldValue(
          key,
          values.map((valKey) => userLocation[valKey]).join(' ').trim(),
        );
      },
    );
  }, []);

  return (
    <Blocks.FormContainer>
      <Blocks.FormHeader>
        <BodyCopy as={Blocks.FormHeaderText} color="navy" size="lg">
          {formState.hasSubmitted
            ? formPostSubmissionMessage : formCallToAction}
        </BodyCopy>
      </Blocks.FormHeader>
      {!formState.hasSubmitted
      && (
      <Blocks.FormWrapper>
        <Form
          formManager={formManager}
          form={form}
        />
        {!isMobileLarge
        && <FormElementMobileDisclaimer />}
      </Blocks.FormWrapper>
      )}
    </Blocks.FormContainer>
  );
}

export default VoterEducationForm;
