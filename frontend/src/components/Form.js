// import React from 'react'
// import FormBlocks from './FormBlocks'
// import FormElement from './FormElement'
// import select from '../utils/select'

// function Form(props) {
//   const { formManager, form, GridComponent } = props

//   const elements = Object.keys(form)
//     .map(fieldId => ({
//       fieldId,
//       formManager,
//       elementId: `${form.formId || 'ew-form'}-${fieldId}`,
//       field: form[fieldId],
//     }))
//     .filter(element => select(element, 'field.display.hidden') !== true)

//   const Wrapper = GridComponent || FormBlocks.PrimaryFormGrid

//   return (
//     <Wrapper>
//       {elements.map(elementProps => (
//         <FormElement key={elementProps.fieldId} {...elementProps} />
//       ))}
//     </Wrapper>
//   )
// }

// export default Form;
