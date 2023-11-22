import onChange from 'on-change';
import renderCard from './renderCard.js';
import renderFeed from './renderFeed.js';
import renderModal from './renderModal.js';
import renderPosts from './renderPosts.js';

export default (state, instance, elements) => {
  const { input, feedback, form } = elements;
  const watcher = onChange(state, (path, value, prev) => {
    if (path === 'feeds') {
      input.value = '';
      input.focus();
      if (prev.length === 0) {
        renderCard(instance, 'feeds');
        renderCard(instance, 'posts');
      }
      feedback.textContent = instance.t('errors.successfull');
      renderFeed(value.at(-1), elements);
    }

    if (path === 'posts') {
      renderPosts(instance, value, elements);
      value.map((post) => {
        document.querySelector(`.posts button[data-id='${post.id}']`).closest('.list-group-item').addEventListener('click', (e) => {
          e.target.closest('li').querySelector('a').classList.add('fw-normal', 'link-secondary');
          post.visited = true;
          watcher.modal = post;
        });
        return post;
      });
    }

    if (path === 'modal') {
      renderModal(instance, value, elements);
    }

    if (path === 'form.status') {
      form.querySelector('button').classList.toggle('disabled');
    }

    if (path === 'form.error') {
      if (value !== null) {
        input.classList.add('is-invalid');
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
        if (value === 'this must be a valid URL') feedback.textContent = instance.t('errors.validError');

        if (value.includes('this must not be one of the following values: ')) feedback.textContent = instance.t('errors.existError');

        if (value === "Cannot read properties of null (reading 'textContent')") feedback.textContent = instance.t('errors.formatError');

        if (value === 'Network Error') feedback.textContent = instance.t('errors.networkError');
      } else {
        input.classList.remove('is-invalid');
        feedback.classList.add('text-success');
        feedback.classList.remove('text-danger');
      }
    }
  });
  return watcher;
};
