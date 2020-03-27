import React, { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { BodyCopy, Button } from '@ewarren/persist'
import Form from 'wr/components/Form'
import { LIGHT_COLOR_SCHEME } from 'wr/components/FormBlocks'
import fade from './fade'

const hiddenFieldProps = {
  type: 'hidden',
  isOptional: true,
}

const fadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const FormWrapper = styled.div`
  opacity: 0;
  animation: ease-in forwards 1s ${fadeInAnimation};
  ${fade()}

  h4 {
    margin-bottom: 32px;
  }
`

const BSDUserLocation = {
  addr1: ['street_number', 'street'],
  city: ['city'],
  zip: ['zip5'],
}

function LocationResultsForm(props) {
  const { setStep, settings, locationOfVoter, userDetails, isFading } = props
  const {
    volunteerBSDFormCustomFields: { volunteerCheckboxes, events },
    volunteerBsdFormId,
    issuesVerb,
  } = settings

  const form = {
    formId: `${volunteerBsdFormId}-vol-form`,
    [events]: {
      type: 'checkbox',
      isOptional: true,
      label: issuesVerb,
      options: volunteerCheckboxes,
      display: {
        columns: 1,
        showBottomDivider: false,
        colorScheme: LIGHT_COLOR_SCHEME,
      },
    },
    submit: {
      type: 'submit',
      label: settings.sendToSelfFormButton,
      display: {
        ComponentOverride: buttonProps => (
          <Button {...buttonProps} level="tertiary" size="sm" />
        ),
      },
    },
    email: hiddenFieldProps,
    firstName: hiddenFieldProps,
    lastName: hiddenFieldProps,
    addr1: hiddenFieldProps,
    city: hiddenFieldProps,
    state_cd: hiddenFieldProps,
    zip: hiddenFieldProps,
    phone: hiddenFieldProps,
  }

  // const formManager = useFormManager(volunteerBsdFormId, form, () => setStep(2))

  // const { setFieldValue } = formManager

  useEffect(() => {
    Object.entries(BSDUserLocation).forEach(([key, value]) => {
      setFieldValue(key, value.map(valKey => locationOfVoter[valKey]).join(' '))
    })

    Object.entries(userDetails).forEach(([key, value = '']) => {
      setFieldValue(key, value)
    })

    setFieldValue([events], volunteerCheckboxes)
  }, [locationOfVoter, userDetails])

  return (
    <FormWrapper isFading={isFading}>
      <BodyCopy size="md" as="h4">
        {settings.issuesFormBody}
      </BodyCopy>
      {/* <Form formManager={formManager} form={form} /> */}
    </FormWrapper>
  )
}

export default LocationResultsForm
