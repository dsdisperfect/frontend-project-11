export default (instance) => {
    const main = document.querySelector('main');
    main.querySelector('h1.display-3').textContent = instance.t('main.title')
    main.querySelector('p.lead').textContent = instance.t('main.description')
    main.querySelector('label').textContent = instance.t('main.urlInput')
    main.querySelector('button').textContent = instance.t('main.button')
    main.querySelector('p.text-muted').textContent = instance.t('main.example')

    
}