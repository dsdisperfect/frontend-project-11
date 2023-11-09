export default (instance, post) => {

    document.querySelector('.modal-title').textContent = post.title

    document.querySelector('.modal-body').textContent = post.description

    document.querySelector('.modal-footer .btn-primary').setAttribute('href', post.link)
    document.querySelector('.modal-footer .btn-primary').textContent = instance.t('results.modal.open')

    document.querySelector('.modal-footer .btn-secondary').textContent = instance.t('results.modal.close')
}