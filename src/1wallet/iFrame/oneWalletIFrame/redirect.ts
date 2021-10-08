import * as events from './events'
import * as popup from './popup'
import {isSafari, isPopupBlocked} from './utils'

const oneWalletURL = 'https://1wallet.crazy.one/auth'
const callbackLocation = '/one-wallet-iframe-callback'
const callbackURL = window.location.origin + callbackLocation
const callbackLocationBase64 = btoa(callbackURL)
const appName = 'Harmony MultiSig'



const redirect = (url: string) => {
    if (isSafari()) {
        const w = window.open(url, '_blank')

        if (isPopupBlocked(w)) {
            popup.openClickToRedirectModal(url)
        }

    } else {
        popup.open(url)
    }
}


export const auth = () => {
    const o = {
        caller: appName,
        callback: callbackLocationBase64,
    }

    const params = new URLSearchParams(o).toString()
    const url = oneWalletURL + '/connect?' + params

    redirect(url)
}

export const send = (from: string, to: string, amount: number) => {
    const o = {
        caller: appName,
        callback: callbackLocationBase64,
        amount: (BigInt(amount) * BigInt(1000000000000000000)).toString(),
        from,
        dest: to,
    }

    const params = new URLSearchParams(o).toString()
    const url = oneWalletURL + '/pay?' + params

    redirect(url)
}


/*
https://localhost:3000/auth/call?caller=Tip%20Jar&callback=aHR0cHM6Ly9nb29nbGUuY29t&amount=1000000000000000000&dest=0x37CCbeAa1d176f77227AEa39BE5888BF8768Bf85&calldata=eyJtZXRob2QiOiJyZW5ldyh1aW50MzIsYnl0ZXM0KSIsInBhcmFtZXRlcnMiOlt7Im5hbWUiOiJwZXJpb2QiLCJ2YWx1ZSI6MX0seyJuYW1lIjoic2lnbmF0dXJlIiwidmFsdWUiOiIweDEyMzQ1Njc4In1dLCJjb21tZW50IjoidGVzdGluZyIsImhleCI6IjB4ZjMyYWM1YTQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMTIzNDU2NzgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9
*/
export const call = (to: string, bytecode: string, amount: number) => {
    const calldata = btoa(JSON.stringify(
        {
            hex: bytecode,
        },
    ))

    const o = {
        caller: appName,
        callback: callbackLocationBase64,
        calldata,
        dest: to,
    }

    if (amount) {
        // @ts-ignore
        o.amount = (BigInt(amount) * BigInt(1000000000000000000)).toString()
    }

    const params = new URLSearchParams(o).toString()
    const url = oneWalletURL + '/call?' + params

    redirect(url)
}

const processONEWalletCallback = () => {
    const path = window.location.pathname

    if (path.indexOf(callbackLocation) === -1) {
        return
    }

    const params = new URLSearchParams(window.location.search)

    const success = +(params.get('success') || 0)
    const address = params.get('address')
    const txId = params.get('txId')

    if (success && address) {
        window.dispatchEvent(new CustomEvent(events.walletConnectedEvent, {detail: address}))
    } else if (success && txId) {
        window.dispatchEvent(new CustomEvent(events.transactionCallEvent, {detail: txId}))
    } else if (!success && txId) {
        window.dispatchEvent(new CustomEvent(events.transactionCallErrorEvent))
    } else {
        window.dispatchEvent(new CustomEvent(events.transactionCallErrorEvent))
    }

    window.close()
}

setTimeout(processONEWalletCallback, 0)
