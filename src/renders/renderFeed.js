export default (instance, state, elements) => {
  const { feedsList, input, feedback } = elements;
  input.value = '';
  input.focus();

  feedback.textContent = instance.t('errors.successfull');

  const item = document.createElement('li');
  item.classList.add('list-group-item', 'border-0', 'border-end-0');

  const title = document.createElement('h3');
  title.classList.add('h6', 'm-0');
  title.textContent = state.feeds.at(-1).title;

  const description = document.createElement('p');
  description.classList.add('m-0', 'small', 'text-black-50');
  description.textContent = state.feeds.at(-1).description;

  item.append(title, description);

  feedsList.querySelector('ul').prepend(item);
};
