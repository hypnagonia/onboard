import {extensionInstallMessage, mobileWalletInstallMessage} from '../content'
import {WalletModule, Helpers, CommonWalletOptions} from '../../../interfaces'

import metamaskIcon from '../wallet-icons/icon-onewallet.svg'
import metamaskIcon2x from '../wallet-icons/icon-onewallet.svg'
import {createModernProviderInterface} from '../../../1wallet/utilities'

const getProviderName = () => 'ONE Wallet'

function metamask(
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

export default metamask
