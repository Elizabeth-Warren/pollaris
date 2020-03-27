import { useEffect, useReducer } from 'react'

const defaultFormState = {
  isSubmitting: false,
  hasSubmitted: false,
  values: {},
  isFocused: {},
  hasFocused: {},
  validations: {},
  validationModule: {},
}

const SET_IS_SUBMITTING = 'SET_IS_SUBMITTING'
const SET_HAS_SUBMITTED = 'SET_HAS_SUBMITTED'
const SET_FIELD_VALUE = 'SET_FIELD_VALUE'
const SET_FIELD_FOCUS = 'SET_FIELD_FOCUS'
const SET_FIELD_VALIDATION = 'SET_FIELD_VALIDATION'
const VALIDATE_ALL_FIELDS = 'VALIDATE_ALL_FIELDS'
const SET_VALIDATION_MODULE = 'SET_VALIDATION_MODULE'
const CLEAR_FORM = 'CLEAR_FORM'

function getDefaultStateFromFieldMap(fieldMap) {
  const values = Object.entries(fieldMap).reduce(
    (accum, [key, { initialValue }]) => ({
      ...accum,
      ...(initialValue && { [key]: initialValue }),
    }),
    {}
  )

  return {
    ...defaultFormState,
    values,
  }
}

export default function useFormManager(fieldMap, onComplete) {
  const [formState, dispatch] = useReducer(
    formReducer,
    getDefaultStateFromFieldMap(fieldMap)
  )

  function setIsSubmitting(isSubmitting) {
    return dispatch({ type: SET_IS_SUBMITTING, isSubmitting })
  }

  function setHasSubmitted(hasSubmitted) {
    return dispatch({ type: SET_HAS_SUBMITTED, hasSubmitted })
  }

  function setFieldValue(id, value) {
    return dispatch({ type: SET_FIELD_VALUE, id, value })
  }

  function setFieldFocus(id, isFocused) {
    return dispatch({ type: SET_FIELD_FOCUS, id, isFocused })
  }

  function setFieldValidation(id, validation) {
    return dispatch({ type: SET_FIELD_VALIDATION, id, validation })
  }

  function validateAllFields() {
    return dispatch({ type: VALIDATE_ALL_FIELDS })
  }

  function clearForm() {
    return dispatch({ type: CLEAR_FORM })
  }

  function setValidationModule(module) {
    return dispatch({ type: SET_VALIDATION_MODULE, module })
  }

  function selectFieldValue(id) {
    return formState.values[id] || null
  }

  function selectFieldShouldDisplayValidation(id) {
    return (
      !!formState.hasFocused[id] &&
      !!formState.validations[id] &&
      !!formState.validations[id].length &&
      !formState.isFocused[id]
    )
  }

  function selectFieldValidations(id) {
    return formState.validations[id] || []
  }

  function selectFieldHasErrorValidation(id) {
    const validations = selectFieldValidations(id)

    if (!validations) {
      return false
    }

    return !!validations.find(validation => validation.isError)
  }

  function selectIsFormSubmittable() {
    const hasInvalidFields = !!Object.keys(fieldMap).find(id =>
      selectFieldValidations(id).find(validation => validation.isError)
    )

    return (
      !hasInvalidFields && !formState.isSubmitting && !formState.hasSubmitted
    )
  }

  useEffect(() => {
    let hasComponentStoppedRendering = false

    async function importValidationModule() {
      try {
        const module = await import(
          /* webpackChunkName: "vendor-extra-validation" */ '@ewarren/extra-validation'
        )

        if (hasComponentStoppedRendering) {
          return
        }

        setValidationModule(module)
        validateAllFields()
      } catch (error) {
        console.error(error)
      }
    }

    importValidationModule()

    return () => (hasComponentStoppedRendering = true)
  }, [])

  function formReducer(state, action) {
    const { type } = action

    switch (type) {
      case SET_FIELD_VALUE: {
        const { id, value } = action
        const { type, isOptional } = fieldMap[id]

        return {
          ...state,
          values: {
            ...state.values,
            [id]: value,
          },
          validations: {
            ...state.validations,
            [id]: validateField(
              type,
              isOptional,
              state.validationModule,
              value
            ),
          },
        }
      }

      case SET_FIELD_FOCUS: {
        const { id, isFocused } = action

        return {
          ...state,
          isFocused: {
            ...state.isFocused,
            [id]: isFocused,
          },
          hasFocused: {
            ...state.hasFocused,
            [id]: state.hasFocused[id] || true,
          },
        }
      }

      case SET_FIELD_VALIDATION: {
        const { id, validation } = action

        return {
          ...state,
          validations: {
            ...state.validations,
            [id]: validation,
          },
        }
      }

      case SET_IS_SUBMITTING: {
        const { isSubmitting } = action

        return {
          ...state,
          isSubmitting,
          // TODO: Probably shouldn't be this lazy...
          hasSubmitted: state.isSubmitting && !isSubmitting,
        }
      }

      case SET_HAS_SUBMITTED: {
        const { hasSubmitted } = action

        return {
          ...state,
          hasSubmitted,
        }
      }

      case VALIDATE_ALL_FIELDS: {
        const validations = Object.keys(fieldMap).reduce(
          (acc, fieldId) => ({
            ...acc,
            [fieldId]: validateField(
              fieldMap[fieldId].type,
              fieldMap[fieldId].isOptional,
              state.validationModule,
              state.values[fieldId]
            ),
          }),
          {}
        )

        return {
          ...state,
          validations: {
            ...state.validations,
            ...validations,
          },
        }
      }

      case SET_VALIDATION_MODULE: {
        const { module } = action

        return {
          ...state,
          validationModule: module,
        }
      }

      case CLEAR_FORM: {
        return {
          ...state,
          hasSubmitted: false,
          validations: {},
        }
      }

      default:
        return state
    }
  }

  function submit() {
    if (!selectIsFormSubmittable()) {
      return
    }

    setIsSubmitting(true)

    return async event => {
      if (onComplete) {
        await onComplete(event, formState)
      }

      setIsSubmitting(false)
    }
  }

  return {
    formState,
    setFieldValue,
    setFieldFocus,
    setFieldValidation,
    setIsSubmitting,
    setHasSubmitted,
    clearForm,
    selectFieldValue,
    selectFieldShouldDisplayValidation,
    selectFieldValidations,
    selectFieldHasErrorValidation,
    selectIsFormSubmittable,
    validateAllFields,
    isSubmitting: formState.isSubmitting,
    hasSubmitted: formState.hasSubmitted,
    submit,
  }
}
