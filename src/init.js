import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import initialRender from './initialRender.js';
import axios from 'axios';
import parser from './parser.js'
import watcher from './watcher.js';
import { cloneDeep, uniqueId } from 'lodash';


const getXML = (url) => {
    const proxyUrl = new URL(`https://allorigins.hexlet.app/get?`)
    proxyUrl.searchParams.set('url', url)
    proxyUrl.searchParams.set('disableCache', true)
    return axios.get(proxyUrl).then(res => res.data.contents)
}

const updater = (watcher) => {
    if (watcher.feeds.length !== 0) {
        const postsLinks = watcher.posts.map(post => post.link)
        for (let feed of watcher.feeds) {
            const id = watcher.feeds.indexOf(feed)
            getXML(watcher.feeds[id].url).then((xml) => {
                const posts = parser(xml).posts
                const newPosts = posts.filter(post => !postsLinks.includes(post.link))
                newPosts.forEach(post => {
                    post.id = uniqueId('post_')
                    post.visited = false;
                })
                return newPosts
            }).then((newPosts) => watcher.posts = [...newPosts, ...cloneDeep(watcher.posts)])
            .catch(console.log)
        }
    }
    
    setTimeout(() => updater(watcher), 5000)
}

export default () => {
    const instance = i18next.createInstance()

    instance.init({
        lng: 'ru',
        debugger: true,
        resources
    }).then(() => {
        const state = {
            feeds: [],
            posts: [],
            form: {
                status: 'ready',
                error: null,
                validation: true
            },
            modal: null
        }

        initialRender(instance);


        const validate = (url) => {
            const emailUrl = yup.string().required().url().notOneOf(state.feeds.map(e => e.url))
            return emailUrl.validate(url)
        }

        document.querySelector('.rss-form').addEventListener('submit', (event) => {
            const url = event.target.closest('.rss-form').querySelector('#url-input').value
            event.preventDefault();
            validate(url)
                .then(() => {
                    watcher(state, instance).form.status = 'loading';
                    return getXML(url)
                })
                .then((xml) => {
                    watcher(state, instance).form.error = null;
                    watcher(state, instance).form.validation = true;

                    const feed = parser(xml).feedInfo;
                    const posts = parser(xml).posts;
                    posts.forEach(post => {
                        post.id = uniqueId('post_')
                        post.visited = false;
                    })
                    feed.url = url

                    watcher(state, instance).feeds.push(feed)
                    watcher(state, instance).posts = [...posts, ...state.posts]

                    event.target.querySelector('#url-input').value = ''
                    event.target.querySelector('#url-input').focus()
                    watcher(state, instance).form.status = 'ready'
                })

                .catch((e) => {
                    watcher(state, instance).form.validation = false;
                    watcher(state, instance).form.error = e.message;
                    watcher(state, instance).form.status = 'ready'
                })
        })
        updater(watcher(state, instance))
    })
}
