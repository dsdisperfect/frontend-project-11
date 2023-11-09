export default (feed) => {
    const item = document.createElement('li')
    item.classList.add('list-group-item', 'border-0', 'border-end-0')
    
    const title = document.createElement('h3')
    title.classList.add('h6', 'm-0')
    title.textContent = feed.title
    
    const description = document.createElement('p')
    description.classList.add('m-0', 'small', 'text-black-50')
    description.textContent = feed.description

    item.append(title, description)

    document.querySelector('.feeds ul').append(item)
}