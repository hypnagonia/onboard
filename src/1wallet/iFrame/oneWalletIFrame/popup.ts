export const popUpDOMID = 'one-wallet-popup'
export const iFrameDOMID = 'one-wallet-iframe'

const popupDiv = document.createElement('div')
const popupDivBackground = document.createElement('div')
const popupWidth = 700
const popupHeight = 700

let iframeElement: HTMLElement | null = null

popupDiv.id = popUpDOMID
popupDivBackground.id = popUpDOMID + '-background'

const style = document.createElement('style')
style.innerHTML = `
      #${popUpDOMID} {
        background-color: white;
        width: ${popupWidth}px;
        height: ${popupHeight}px;
        color:black;
        top: 100px;
        left: calc(50% - ${popupWidth / 2}px);
        position: fixed;
        z-index: 99999;
        border-radius: 0px;
        border: none;
        display: none;
        margin: auto;
        padding: 0px;
        text-align:center;
        box-sizing: border-box;
      }
      
      #${popUpDOMID}-background {
        background-color: black;
        position: fixed;
        top: 0;
        height: 0;
        opacity: 0.2;
        width: 100%;
        height: 100%;
        display: none; 
      }
    `
document.head.appendChild(style)
document.body.appendChild(popupDiv)

const removeIFrame = () => {
    iframeElement && iframeElement.remove()
    iframeElement = null
}

export let isOpen = false

const openModal = (padding = '0px') => {
    isOpen = true
    popupDiv.style.paddingTop = padding
    popupDiv.style.display = 'block'
    popupDivBackground.style.display = 'block'
}

const closeModal = () => {
    isOpen = false
    popupDiv.style.display = 'none'
    popupDivBackground.style.display = 'block'
}

export const open = (url: string) => {
    openModal()
    removeIFrame()
    iframeElement = document.createElement('iframe')
    iframeElement.id = iFrameDOMID
    iframeElement.style.width = popupWidth + 'px'
    iframeElement.style.border = '0'
    // @ts-ignore
    iframeElement.style.frameBorder = '0'
    iframeElement.style.height = popupHeight + 'px'
    // @ts-ignore
    iframeElement.src = url
    popupDiv.appendChild(iframeElement)
}

export const close = () => {
    closeModal()
    removeIFrame()
}

export const openClickToRedirectModal = (url: string) => {
    const a = document.createElement('a')
    const linkText = document.createTextNode('Open 1wallet')
    a.appendChild(linkText)
    a.title = 'Click to open 1wallet'
    a.href = url
    a.target = '_blank'
    a.onclick = () => {
        closeClickToRedirectModal()
        popupDiv.removeChild(a)
    }
    popupDiv.appendChild(a)

    openModal('200px')
}

export const closeClickToRedirectModal = () => {
    closeModal()
}