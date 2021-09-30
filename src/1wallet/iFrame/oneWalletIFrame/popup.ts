export const popUpDOMID = 'one-wallet-popup'
export const iFrameDOMID = 'one-wallet-iframe'

const popupDiv = document.createElement('div')
const popupWidth = 700
const popupHeight = 700

let iframeElement: HTMLElement | null = null

popupDiv.id = popUpDOMID


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
        padding: 0px;
        border-radius: 0px;
        border: none;
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

export const open = (url: string) => {
    isOpen = true
    removeIFrame()
    iframeElement = document.createElement('iframe')
    iframeElement.id = iFrameDOMID
    iframeElement.style.width = popupWidth + 'px'
    iframeElement.style.height = popupHeight + 'px'
    // @ts-ignore
    iframeElement.src = url
    popupDiv.appendChild(iframeElement)
    popupDiv.style.display = 'block'
}

export const close = () => {
    isOpen = false
    removeIFrame()
    popupDiv.style.display = 'none'
}