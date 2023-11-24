export default (instance, state, elements) => {
  const { input, feedback } = elements;
  if (state.form.error !== null) {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    if (state.form.error === 'this must be a valid URL') feedback.textContent = instance.t('errors.validError');

    if (state.form.error.includes('this must not be one of the following values: ')) feedback.textContent = instance.t('errors.existError');

    if (state.form.error === "Cannot read properties of null (reading 'textContent')") feedback.textContent = instance.t('errors.formatError');

    if (state.form.error === 'Network Error') feedback.textContent = instance.t('errors.networkError');
  } else {
    input.classList.remove('is-invalid');
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
  }
};
