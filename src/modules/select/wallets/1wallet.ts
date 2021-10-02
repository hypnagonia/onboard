import {extensionInstallMessage, mobileWalletInstallMessage} from '../content'
import {WalletModule, Helpers, CommonWalletOptions, SdkWalletOptions} from '../../../interfaces'

import metamaskIcon from '../wallet-icons/icon-onewallet.svg'
import metamaskIcon2x from '../wallet-icons/icon-onewallet.svg'

const getProviderName = () => 'ONE Wallet'
import * as ONEWallet from '../../../1wallet/iFrame/oneWalletIFrame/index'

const wrapRPCResponse = (data: any, result: any) => {
    // console.log('response', {result})
    return {
        // @ts-ignore
        'jsonrpc': '2.0', 'id': data.id, result: result,
    }
}

const wrapRPCError = (data: any, err: any) => {
    return {'jsonrpc': '2.0', 'id': data.id, 'error': {'code': -32602, 'message': JSON.stringify(err)}}

}

const rpcHarmonyUrl = 'https://api.harmony.one'

const localStorageId = '1walletSessionAddress'

const storage = {
    saveAddress: (address: string) => window.localStorage.setItem(localStorageId, address),
    loadAddress: () => window.localStorage.getItem(localStorageId),
    deleteAddress: () => window.localStorage.removeItem(localStorageId),
}

function oneWallet(
    options: SdkWalletOptions & { networkId: number; rpcUrl: string },
): WalletModule {
    const {apiKey, rpcUrl, networkId, preferred, label, iconSrc, svg} = options

    return {
        name: label || '1Wallet',
        iconSrc: iconSrc || metamaskIcon,
        iconSrcSet: iconSrc || metamaskIcon2x,
        wallet: async (helpers: Helpers) => {

            // const provider = instance.getProvider()
            const {BigNumber, getAddress} = helpers

            let enabled: boolean
            let actualAddress: string | undefined


            return {
                provider: {
                    // @ts-ignore
                    send: (data, cb, ...rest) => {
                        const {method} = data

                        if (method === 'eth_accounts') {
                            const savedAddress = storage.loadAddress()
                            cb(null, wrapRPCResponse(data, [actualAddress || savedAddress]))
                            return
                        }

                        if (method === 'net_version') {
                            cb(null, wrapRPCResponse(data, '1666600000'))
                            return
                        }

                        if (method === 'eth_gasPrice') {
                            cb(null, wrapRPCResponse(data, '0x61a8'))
                            return
                        }


                        // todo move out rpc calls
                        if (method === 'eth_getCode') {
                            // @ts-ignore
                            const call = async () => {
                                // console.log('eth_getCode call', data)
                                try {
                                    const resRaw = await fetch(rpcHarmonyUrl, {
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        method: 'POST',
                                        body: JSON.stringify({
                                            ...data,
                                            params: Array.isArray(data.params[0]) ? data.params[0] : data.params,
                                        }),
                                    })

                                    const res = await resRaw.json()

                                    // console.log('eth_getCode success', res)
                                    cb(null, res)
                                } catch (e) {
                                    // console.log('eth_getCode err', e)
                                    cb(wrapRPCError(data, e), null)
                                }

                            }

                            return call()
                        }

                        if (method === 'eth_getTransactionReceipt') {
                            // @ts-ignore
                            const call = async () => {
                                // console.log('eth_getTransactionReceipt call', data)
                                try {
                                    const resRaw = await fetch(rpcHarmonyUrl, {
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        method: 'POST',
                                        body: JSON.stringify({
                                            ...data,
                                            params: Array.isArray(data.params[0]) ? data.params[0] : data.params,
                                        }),
                                    })

                                    const res = await resRaw.json()

                                    // console.log('eth_getTransactionReceipt success', res)
                                    cb(null, res)
                                } catch (e) {
                                    // console.log('eth_getTransactionReceipt err', e)
                                    cb(wrapRPCError(data, e), null)
                                }

                            }

                            return call()
                        }

                        if (method === 'eth_getTransactionByHash') {
                            // @ts-ignore
                            const call = async () => {
                                // console.log('eth_getTransactionByHash call', data)
                                try {
                                    const resRaw = await fetch(rpcHarmonyUrl, {
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        method: 'POST',
                                        body: JSON.stringify({
                                            ...data,
                                            params: Array.isArray(data.params[0]) ? data.params[0] : data.params,
                                        }),
                                    })

                                    const res = await resRaw.json()

                                    // console.log('eth_getTransactionByHash response', res)
                                    cb(null, res)
                                } catch (e) {
                                    // console.log('eth_getTransactionByHash err', e)
                                    cb(wrapRPCError(data, e), null)
                                }

                            }

                            return call()
                        }

                        if (method === 'eth_call') {
                            // @ts-ignore
                            const call = async () => {
                                //  console.log('eth_call call', data)
                                try {
                                    const resRaw = await fetch(rpcHarmonyUrl, {
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        method: 'POST',
                                        body: JSON.stringify({
                                            ...data,
                                            params: data.params,
                                        }),
                                    })

                                    const res = await resRaw.json()

                                    // console.log('eth_call response', res)
                                    cb(null, res)
                                } catch (e) {
                                    // console.log('eth_call err', e)
                                    cb(wrapRPCError(data, e), null)
                                }

                            }

                            return call()
                        }

                        if (method === 'eth_getBalance') {
                            // @ts-ignore
                            const call = async () => {
                                // console.log('eth_getBalance  call', data)
                                try {
                                    const resRaw = await fetch(rpcHarmonyUrl, {
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        method: 'POST',
                                        body: JSON.stringify({
                                            ...data,
                                            params: data.params,
                                        }),
                                    })

                                    const res = await resRaw.json()

                                    //  console.log('eth_getBalance  response', res)
                                    cb(null, res)
                                } catch (e) {
                                    //   console.log('eth_getBalance err', e)
                                    cb(wrapRPCError(data, e), null)
                                }

                            }

                            return call()
                        }


                        if (method === 'eth_sendTransaction') {
                            const call = async () => {
                                let res = []
                                for (const p of data.params) {
                                    const amount = p.value || p.amount || 0

                                    try {
                                        const r = await ONEWallet.call(p.to, p.data, amount)
                                        res.push(r)
                                    } catch (e) {
                                        return cb(wrapRPCError(data, e), null)
                                    }

                                }

                                const r = (res.length && res.length !== 1) ? res : res[0]
                                cb(null, wrapRPCResponse(data, r))
                            }

                            return call()
                        }

                        console.log('not supported', method, data)

                    },
                },
                interface: {
                    name: 'ONEWallet',
                    connect: async () => {
                        const savedAddress = storage.loadAddress()

                        if (savedAddress) {
                            return [savedAddress]
                        }

                        return ONEWallet.auth().then(address => {

                            if (address) {
                                enabled = true
                                actualAddress = address as string
                                storage.saveAddress(actualAddress as string)
                            }

                            return actualAddress ? [actualAddress] : undefined
                        })
                    },
                    disconnect: () => {
                        storage.deleteAddress()
                    },
                    address: {
                        get: () => {
                            const savedAddress = storage.loadAddress()
                            if (!enabled && !actualAddress && savedAddress) {
                                enabled = true
                                actualAddress = savedAddress
                            }
                            return ((enabled && actualAddress) ? Promise.resolve(actualAddress || '') : Promise.resolve(null))
                        },
                    },
                    network: {
                        get: () => Promise.resolve(networkId),
                    },
                    balance: {
                        get: async () => {
                            return '1'
                        },
                    },
                    dashboard: () => {
                    },
                },
            }
        },
        type: 'sdk',
        desktop: true,
        mobile: true,
        link: 'http://1wallet.crazy.one/',
        preferred,
    }
}

export default oneWallet


/*function oneWallet(
    options: CommonWalletOptions & { isMobile: boolean },
): WalletModule {
    const {preferred, label, iconSrc, svg, isMobile} = options

    // @ts-ignore
    return {
        name: label || 'ONE Wallet',
        iconSrc: iconSrc || metamaskIcon,
        iconSrcSet: iconSrc || metamaskIcon2x,
        svg,
        wallet: async (helpers: Helpers) => {


            const provider =
                (window as any).ethereum ||
                ((window as any).web3 && (window as any).web3.currentProvider)

            return {
                provider,
                // @ts-ignore
                interface: createModernProviderInterface(provider),
            }
        },
        type: 'injected',
        // link: `https://metamask.app.link/dapp/${window.location.host}`,
        link: 'http://1wallet.crazy.one/',
        installMessage: isMobile
            ? mobileWalletInstallMessage
            : extensionInstallMessage,
        desktop: true,
        mobile: true,
        preferred,
    }
}

export default oneWallet*/

/*

curl --location --request POST 'https://a.api.s0.t.hmny.io' \
--header 'Content-Type: application/json' \
--data-raw '{
"jsonrpc": "2.0",
  "method": "eth_getLogs",
  "id": 1,
  "params": [{"fromBlock": "0x7ec6ab", "toBlock": "0x7ec6345353453453453445ab"}]
}'

 */