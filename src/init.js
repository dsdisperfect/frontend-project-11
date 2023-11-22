import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cloneDeep, uniqueId } from 'lodash';
import resources from './locales/index.js';
import initialRender from './initialRender.js';
import parser from './parser.js';
import watcher from './watcher.js';

const makeProxy = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get?');
  proxyUrl.searchParams.set('url', url);
  proxyUrl.searchParams.set('disableCache', true);
  return proxyUrl.toString();
};

const getXML = (url) => axios.get(makeProxy(url))
  .then((res) => res.data.contents);

const updater = (view) => {
  const postsLinks = view.posts.map((post) => post.link);
  const request = view.feeds.map((feed) => {
    const id = view.feeds.indexOf(feed);
    getXML(view.feeds[id].url).then((xml) => {
      const { posts } = parser(xml);
      const newPosts = posts.filter((post) => !postsLinks.includes(post.link));
      newPosts.forEach((post) => {
        post.id = uniqueId('post_');
        post.visited = false;
      });
      return newPosts;
    })
      .then((newPosts) => {
        view.posts = [...newPosts, ...cloneDeep(view.posts)];
        return view.posts;
      })
      .catch(console.log);
    return null;
  });
  Promise.all(request)
    .finally(() => setTimeout(() => updater(view), 5000));
};

export default () => {
  const instance = i18next.createInstance();

  instance.init({
    lng: 'ru',
    debugger: true,
    resources,
  }).then(() => {
    const state = {
      feeds: [],
      posts: [],
      form: {
        status: 'ready',
        error: null,
      },
      modal: null,
      visitedPosts: [],
    };

    const elements = {
      main: document.querySelector('main'),
      input: document.querySelector('#url-input'),
      form: document.querySelector('.rss-form'),
      feedback: document.querySelector('.feedback'),
      feedsList: document.querySelector('.feeds'),
      postsList: document.querySelector('.posts'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalButtonOpen: document.querySelector('.modal-footer .btn-primary'),
      modalButtonClose: document.querySelector('.modal-footer .btn-secondary'),
    };
    initialRender(instance, elements);

    const validate = (url) => {
      const emailUrl = yup.string().required().url().notOneOf(state.feeds.map((e) => e.url));
      return emailUrl.validate(url);
    };

    elements.form.addEventListener('submit', (event) => {
      const formdata = new FormData(event.target);
      const url = formdata.get('url');
      event.preventDefault();
      validate(url)
        .then(() => {
          watcher(state, instance, elements).form.status = 'loading';
          return getXML(url);
        })
        .then((xml) => {
          watcher(state, instance, elements).form.error = null;
          watcher(state, instance, elements).form.validation = true;

          const feed = parser(xml).feedInfo;
          const { posts } = parser(xml);
          posts.forEach((post) => {
            post.id = uniqueId('post_');
            post.visited = false;
          });
          feed.url = url;

          watcher(state, instance, elements).feeds.push(feed);
          watcher(state, instance, elements).posts = [...posts, ...state.posts];

          watcher(state, instance, elements).form.status = 'ready';
        })

        .catch((e) => {
          watcher(state, instance, elements).form.validation = false;
          watcher(state, instance, elements).form.error = e.message;
          watcher(state, instance, elements).form.status = 'ready';
        });
    });
    updater(watcher(state, instance, elements));
  });
};
