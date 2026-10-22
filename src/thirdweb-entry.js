/**
 * Thirdweb SDK v5 Browser Entrypoint
 * Bundled with esbuild to provide reliable, zero-CDN-failure Web3 wallet connection.
 */
import { createThirdwebClient, defineChain } from 'thirdweb';
import { createWallet, inAppWallet } from 'thirdweb/wallets';
import { ethereum } from 'thirdweb/chains';
import { renderSVG } from 'uqr';

window.ThirdwebSDK = {
  createThirdwebClient,
  defineChain,
  createWallet,
  inAppWallet,
  ethereum,
  renderQRCodeSVG: renderSVG
};

console.log('[KamiZuki Web3] Thirdweb SDK v5 + QR Engine loaded.');
