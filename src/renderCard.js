export default (instance, cardName) => {
    const card = document.createElement('div')
    card.classList.add('card', 'border-0')

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    const h2 = document.createElement('h2')
    h2.textContent = instance.t(`results.${cardName}`)
    h2.classList.add('card-title', 'h4')
    cardBody.append(h2)

    const listGroup = document.createElement('ul')
    listGroup.classList.add('list-group', 'border-0', 'rounded-0')
    
    document.querySelector(`.${cardName}`).append(card)
    document.querySelector('.card').append(cardBody, listGroup)
}