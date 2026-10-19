/**
 * KAMIZUKI PROJECT CONFIGURATION
 * 
 * Central configuration file for Thirdweb Web3 settings, Ethereum network settings,
 * 25 supported ERC-721 NFT partner collection contract addresses, ticket sale TBD architecture,
 * and stage metadata.
 */

window.KAMIZUKI_CONFIG = {
  PROJECT_NAME: "KamiZuki",
  TAGLINE: "A Play-to-Earn Adventure in a World of Gods, Samurai and Spirits",
  KANJI_TITLE: "神月",
  KANJI_TAGLINE: "神に挑め",
  
  // Thirdweb & Blockchain Environment Configuration
  THIRDWEB: {
    CLIENT_ID: "8f566ff051f67f08cf2c40c1737e9095", // Replace with your production Thirdweb Client ID
    DEFAULT_CHAIN_ID: 1, // 1 = Ethereum Mainnet
    NETWORK_NAME: "Ethereum Mainnet",
    SYMBOL: "ETH",
    // Public Ethereum Mainnet RPC endpoints for fast, reliable read-only balanceOf calls
    RPC_ENDPOINTS: [
      "https://ethereum-rpc.publicnode.com",
      "https://rpc.ankr.com/eth",
      "https://cloudflare-eth.com"
    ]
  },

  // Isolated Contract Configuration (Placeholders for future contract deployment)
  CONTRACTS: {
    TICKET_CONTRACT_ADDRESS: "TBD", // Will be updated when ticket contract is deployed
    TICKET_PRICE_ETH: "TBD",        // Will be updated when ticket price is finalized
    TOKEN_CONTRACT_ADDRESS: "TBD",  // Will be updated when token contract is deployed
    STAKING_CONTRACT_ADDRESS: "TBD"
  },

  // 25 Supported ERC-721 NFT Collection Contracts for Eligibility Checking
  // A connected wallet is ELIGIBLE if it owns >= 1 NFT from ANY of these collections.
  SUPPORTED_NFT_CONTRACTS: [
    { name: "KamiZuki Pass", address: "0x116eaa62241751e0c98da43d458600c6c17cd361" },
    { name: "Partner Collection 02", address: "0x12a4c7659a4b7c4a2870b5167c4f8b014c7fa690" },
    { name: "Partner Collection 03", address: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8" },
    { name: "CryptoPunks", address: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb" },
    { name: "Bored Ape Yacht Club", address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" },
    { name: "Mutant Ape Yacht Club", address: "0x60e4d786628fea6478f785a6d7e704777c86a7c6" },
    { name: "Partner Collection 07", address: "0x86ffb7988913e85a5a07d459a5165ab1273cfe62" },
    { name: "Partner Collection 08", address: "0x539cdd042c2f3d93ebc5be7dfff0c79f3b4fabf0" },
    { name: "Partner Collection 09", address: "0xca75df55cc9c476db27a7375d1fc8e794cf80721" },
    { name: "Partner Collection 10", address: "0x027aca2794e44f24950d81227dcd516ffbb49d6e" },
    { name: "Partner Collection 11", address: "0x387c41b0b2f1128de44db1bcf8baad085f26392c" },
    { name: "Pudgy Penguins", address: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e" },
    { name: "Azuki", address: "0xed5af388653567af2f388e6224dc7c4b3241c544" },
    { name: "Partner Collection 14", address: "0x9eb6e2025b64f340691e424b7fe7022ffde12438" },
    { name: "Partner Collection 15", address: "0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb" },
    { name: "Moonbirds", address: "0x23581767a106ae21c074b2276d25e5c3e136a68b" },
    { name: "Milady Maker", address: "0x5af0d9827e0c53e4799bb226655a1de152a425a5" },
    { name: "Partner Collection 18", address: "0x0000ec93127baa929e58e97dd0095a2bfb38ec1d" },
    { name: "Otherdeed for Otherside", address: "0x57a204aa1042f6e66dd7730813f4024114d74f37" },
    { name: "Partner Collection 20", address: "0xd4b7d9bb20fa20ddada9ecef8a7355ca983cccb1" },
    { name: "Partner Collection 21", address: "0xb8ea78fcacef50d41375e44e6814ebba36bb33c4" },
    { name: "Nouns", address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03" },
    { name: "Partner Collection 23", address: "0x307af7d28afee82092aa95d35644898311ca5360" },
    { name: "Partner Collection 24", address: "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7" },
    { name: "Partner Collection 25", address: "0x1fafd33d882e1c275c61066019a23c1999b5006e" }
  ],

  // 555 Total NFT Collection Allocation Breakdown
  NFT_COLLECTION_STATS: {
    TOTAL_SUPPLY: 555,
    FOUNDER_TEAM_ALLOCATION: 55,
    GAME_PRESALE_ALLOCATION: 200,
    PUBLIC_TICKET_ALLOCATION: 300
  },

  // Ticket Sale System Configuration
  TICKET_SYSTEM: {
    PHASE: "Presale Active",
    PRICE_PER_TICKET_ETH: "TBD",
    CURRENCY: "ETH",
    TICKET_CONTRACT: "TBD"
  },

  // Token Presale Configuration (All numerical values TBD)
  TOKENOMICS: {
    TOKEN_NAME: "TBD",
    TOKEN_SYMBOL: "TBD",
    TOTAL_SUPPLY: "TBD",
    PRESALE_PRICE: "TBD",
    PRESALE_ALLOCATION: "TBD",
    UTILITY_SUMMARY: "In-game economy, stage rewards, governance, staking multipliers.",
    REWARDS_SUMMARY: "Play-to-Earn stage completion rewards and raffle entry bonuses.",
    GOVERNANCE_SUMMARY: "Community-driven voting rights for upcoming stage mechanics."
  },

  // 6 Stages Metadata
  STAGES: [
    {
      id: 1,
      name: "The Fallen Shrine",
      kanji: "落日神社",
      status: "accessible",
      description: "Your first trial. Test your skill, defeat the boss, and unlock your allocation.",
      artwork: "assets/hero_bg.jpg",
      playable: true
    },
    {
      id: 2,
      name: "The Bamboo Vale",
      kanji: "竹林の渓",
      status: "locked",
      description: "Dense misty bamboo stalks harboring elusive spirit warriors and deadly traps.",
      artwork: "assets/stage2.jpg",
      playable: false
    },
    {
      id: 3,
      name: "The Crimson Fort",
      kanji: "深紅の砦",
      status: "locked",
      description: "An ancient Samurai stronghold guarded by fire demons and armoured general bosses.",
      artwork: "assets/stage3.jpg",
      playable: false
    },
    {
      id: 4,
      name: "The Sky Palace",
      kanji: "天空の宮殿",
      status: "locked",
      description: "Floating shrines among celestial clouds where gravity-shifting trials await.",
      artwork: "assets/stage4.jpg",
      playable: false
    },
    {
      id: 5,
      name: "The Spirit Realm",
      kanji: "幽冥世界",
      status: "locked",
      description: "A shadowy realm populated by ethereal spirits, glowing torii paths, and phantom bosses.",
      artwork: "assets/stage5.jpg",
      playable: false
    },
    {
      id: 6,
      name: "The Final Trial",
      kanji: "最終の試練",
      status: "locked",
      description: "The ultimate volcanic boss arena where legendary rewards and Kami power await.",
      artwork: "assets/stage6.jpg",
      playable: false
    }
  ]
};
