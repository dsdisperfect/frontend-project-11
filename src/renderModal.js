export default (instance, post, elements) => {
  const {
    modalBody, modalTitle, modalButtonOpen, modalButtonClose,
  } = elements;
  modalTitle.textContent = post.title;

  modalBody.textContent = post.description;

  modalButtonOpen.setAttribute('href', post.link);
  modalButtonOpen.textContent = instance.t('results.modal.open');

  modalButtonClose.textContent = instance.t('results.modal.close');
};
