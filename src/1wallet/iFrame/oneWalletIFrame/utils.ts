export const isSafari = () => {
    return navigator.userAgent.toLowerCase().indexOf('safari/') > -1 && navigator.userAgent.toLowerCase().indexOf('chrome') === -1
}

export const isPopupBlocked = (w: Window | any) => {
    return !w || w.closed || w.closed === 'undefined'
}