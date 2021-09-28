import {extensionInstallMessage, mobileWalletInstallMessage} from '../content'
import {WalletModule, Helpers, CommonWalletOptions, SdkWalletOptions} from '../../../interfaces'

import metamaskIcon from '../wallet-icons/icon-onewallet.svg'
import metamaskIcon2x from '../wallet-icons/icon-onewallet.svg'
import {createModernProviderInterface} from '../../../1wallet/utilities'
import fortmaticIcon from '../wallet-icons/icon-fortmatic'
import {networkName} from '../../../utilities'

const getProviderName = () => 'ONE Wallet'
import * as ONEWallet from '../../../1wallet/iFrame/oneWalletIFrame/index'


const wrapRPCResponse = (data: any, result: any) => {
    // console.log('response', {result})
    return {
        // @ts-ignore
        'jsonrpc': '2.0', 'id': data.id, result: result,
    }
}

function oneWallet(
    options: SdkWalletOptions & { networkId: number; rpcUrl: string },
): WalletModule {
    const {apiKey, rpcUrl, networkId, preferred, label, iconSrc, svg} = options

    return {
        name: label || 'ONE Wallet',
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
                        try {
                            const {method} = data

                            if (method === 'eth_accounts') {
                                cb(null, wrapRPCResponse(data, [actualAddress]))
                                return
                            }

                            if (method === 'net_version') {
                                cb(null, wrapRPCResponse(data, '1666600000'))
                                return
                            }

                            if (method === 'eth_getCode') {
                                cb(null, wrapRPCResponse(data, ''))
                                return
                            }

                            if (method === 'eth_gasPrice') {
                                cb(null, wrapRPCResponse(data, '0x61a8'))
                                return
                            }


                            /*
                            "eth_sendTransaction"
                            send to from
                            * */


                            console.log('provider send', {data, cb, rest})

                        } catch (err) {
                            console.error(err)
                        }
                    },
                },
                interface: {
                    name: 'ONEWallet',
                    connect: () =>
                        ONEWallet.auth().then(address => {
                            console.log({address})
                            if (address) {
                                enabled = true
                                actualAddress = address as string
                            }

                            return actualAddress ? [actualAddress] : undefined
                        }),
                    disconnect: () => {
                    },
                    address: {
                        get: () => ((enabled && actualAddress) ? Promise.resolve(actualAddress || '') : Promise.resolve(null)),
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
