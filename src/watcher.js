import onChange from 'on-change';
import renderCard from './renderCard.js';
import renderFeed from './renderFeed.js';
import renderModal from './renderModal.js';
import renderPosts from './renderPosts.js';

export default (state, instance) => {
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const watcher = onChange(state, (path, value, prev) => {
    if (path === 'feeds') {
      if (prev.length === 0) {
        renderCard(instance, 'feeds');
        renderCard(instance, 'posts');
      }
      feedback.textContent = instance.t('errors.successfull');
      renderFeed(value.at(-1));
    }

    if (path === 'posts') {
      renderPosts(instance, value);
      state.posts.forEach((post) => {
        document.querySelector(`.posts button[data-id='${post.id}']`).closest('.list-group-item').addEventListener('click', () => {
          post.visited = true;
          renderPosts(instance, value);
          watcher.modal = post;
        });
      });
    }

    if (path === 'modal') {
      renderModal(instance, value);
    }

    if (path === 'form.status') {
      input.closest('form').querySelector('button').classList.toggle('disabled');
    }

    if (path === 'form.error' && value !== null) {
      if (value === 'this must be a valid URL') feedback.textContent = instance.t('errors.validError');

      if (value.includes('this must not be one of the following values: ')) feedback.textContent = instance.t('errors.existError');

      if (value === "Cannot read properties of null (reading 'textContent')") feedback.textContent = instance.t('errors.formatError');

      if (value === 'Network Error') feedback.textContent = instance.t('errors.networkError');
      console.log(value);
    }

    if (path === 'form.validation') {
      if (value === false) {
        input.classList.add('is-invalid');
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
      } else {
        input.classList.remove('is-invalid');
        feedback.classList.add('text-success');
        feedback.classList.remove('text-danger');
      }
    }
  });
  return watcher;
};
