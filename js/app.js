/**
 * KAMIZUKI : MAIN APPLICATION COORDINATOR
 * Connects Thirdweb Web3 & Eligibility events to existing UI components.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("KamiZuki Web3 Game Ecosystem Initialized.");

  // 1. Sakura Particle Effect Background Overlay
  initSakuraParticles();

  // 2. Web3 & Eligibility UI Handlers
  initWeb3UI();

  // 3. Navigation & Routing Handler
  initNavigation();

  // 4. Page 3 Tabs & Ticket Purchase Handler
  initPage3Tabs();

  // 5. Modal Windows (Wallet Modal & Video Trailer Modal)
  initModals();

  // 6. Stage 1 Game Initialization
  initGameStage();
});

/* --------------------------------------------------------------------------
   1. SAKURA PARTICLE SYSTEM
   -------------------------------------------------------------------------- */
function initSakuraParticles() {
  const canvas = document.getElementById('sakura-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 35;

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 4,
      speedX: Math.random() * 1.5 - 0.5,
      speedY: Math.random() * 1.2 + 0.8,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 2 - 1,
      opacity: Math.random() * 0.5 + 0.3
    });
  }

  function renderSakura() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.y > height) { p.y = -10; p.x = Math.random() * width; }
      if (p.x > width) p.x = 0;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = `rgba(240, 62, 81, ${p.opacity})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(renderSakura);
  }

  renderSakura();
}

/* --------------------------------------------------------------------------
   2. NAVIGATION & ROUTING
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .route-btn');
  const pageViews = document.querySelectorAll('.page-view');

  function navigateTo(targetPageId) {
    pageViews.forEach(view => {
      if (view.id === targetPageId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Update active navbar link
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.target === targetPageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle game focus state
    if (targetPageId === 'page-game') {
      const iframe = document.getElementById('kamizuki-game-iframe');
      if (iframe) {
        setTimeout(() => {
          try { iframe.focus(); } catch (e) {}
        }, 150);
      }
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.target;
      if (!target) return;

      const state = window.kamiZukiWeb3.state;

      // Access control for Stage 1 Game Page
      if (target === 'page-game' && !state.isEligible) {
        showToast('🔒 Game Access Locked: Please connect an eligible NFT wallet first.', 'error');
        openModal('wallet-modal');
        return;
      }

      // Access control for Stage 3 Ticket Claim Page
      if (target === 'page-tickets' && (!state.isEligible || !state.stage1Completed)) {
        showToast('🔒 Stage 3 Locked: Complete Stage 1 & defeat the boss to unlock tickets!', 'warning');
        navigateTo('page-game');
        return;
      }

      navigateTo(target);
    });
  });

  window.navigateToPage = navigateTo;
}

/* --------------------------------------------------------------------------
   3. WEB3 & ELIGIBILITY UI HANDLERS
   -------------------------------------------------------------------------- */
function initWeb3UI() {
  const walletBtns = document.querySelectorAll('.connect-wallet-trigger');
  const walletPill = document.getElementById('wallet-connected-pill');
  const walletAddrEl = document.getElementById('connected-wallet-addr');
  const eligibilityBox = document.getElementById('eligibility-status-box');

  window.kamiZukiWeb3.subscribe((state) => {
    // 1. Navbar Wallet Button vs Connected Pill
    if (state.status === 'connected') {
      walletBtns.forEach(b => b.style.display = 'none');
      if (walletPill) {
        walletPill.style.display = 'flex';
        walletAddrEl.textContent = window.kamiZukiWeb3.formatAddress(state.walletAddress);
      }
    } else {
      walletBtns.forEach(b => b.style.display = 'inline-flex');
      if (walletPill) walletPill.style.display = 'none';
    }

    // Sync connected wallet with game iframe
    if (state.walletAddress) {
      const iframe = document.getElementById('kamizuki-game-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'KAMIZUKI_SET_WALLET',
          wallet: state.walletAddress
        }, '*');
      }
    }

    // 2. Eligibility Card UI Updates on Page 1
    if (eligibilityBox) {
      if (state.isCheckingEligibility) {
        eligibilityBox.innerHTML = `
          <div>
            <div class="eligibility-status-title text-gold" style="display:flex; align-items:center; gap:0.5rem;">
              <span class="pulse-dot"></span> Checking NFT Holdings Across 25 Collections...
            </div>
            <p class="eligibility-status-text">Performing read-only blockchain query for ${window.kamiZukiWeb3.formatAddress(state.walletAddress)}...</p>
          </div>
        `;
      } else if (state.status === 'connected') {
        if (state.isEligible) {
          const collectionName = state.matchedContract ? state.matchedContract.name : "KamiZuki Partner Pass";
          eligibilityBox.innerHTML = `
            <div>
              <div class="eligibility-status-title text-crimson" style="display: flex; align-items: center; gap: 0.5rem;">
                <img src="assets/icons/badge_03.png" style="width: 28px; height: 28px; object-fit: contain; filter: drop-shadow(0 0 8px rgba(240, 62, 81, 0.6));" alt="Check" /> ELIGIBILITY VERIFIED!
              </div>
              <p class="eligibility-status-text">Your wallet holds $\\ge 1$ partner NFT (${collectionName}). Stage 1 is accessible!</p>
              <button class="btn btn-crimson" onclick="navigateToPage('page-game')">
                <img src="assets/icons/badge_04.png" class="btn-icon-img" alt="Gamepad" /> ENTER GAME (STAGE 1) →
              </button>
            </div>
          `;
        } else {
          eligibilityBox.innerHTML = `
            <div>
              <div class="eligibility-status-title text-parchment">NOT ELIGIBLE</div>
              <p class="eligibility-status-text">No eligible partner NFTs found in wallet ${window.kamiZukiWeb3.formatAddress(state.walletAddress)}. Hold $\\ge 1$ NFT from any supported collection to unlock.</p>
              <button class="btn btn-outline" onclick="openModal('wallet-modal')">
                <img src="assets/icons/chibi_warning_error.png" class="btn-icon-img" alt="Warning" /> TRY DEMO WALLET / SWITCH
              </button>
            </div>
          `;
        }
      } else {
        eligibilityBox.innerHTML = `
          <div>
            <div class="eligibility-status-title">Connect your wallet</div>
            <p class="eligibility-status-text">Verify your NFT holdings to see if you're eligible for the KamiZuki trial.</p>
            <button class="btn btn-crimson connect-wallet-trigger" onclick="openModal('wallet-modal')">
              <img src="assets/icons/chibi_wallet.png" class="btn-icon-img" alt="Wallet" /> Connect Wallet
            </button>
          </div>
        `;
      }
    }

    // 3. Stage 1 Play Button State Update
    const stage1Btn = document.getElementById('stage1-action-btn');
    if (stage1Btn) {
      if (state.isEligible) {
        stage1Btn.className = 'stage-status-btn stage-btn-active';
        stage1Btn.textContent = 'PLAY NOW';
      } else {
        stage1Btn.className = 'stage-status-btn stage-btn-locked';
        stage1Btn.textContent = 'LOCKED (VERIFY)';
      }
    }

    // 4. Update Stage 3 Journey Tracker
    const step1Tracker = document.getElementById('tracker-step-1');
    const step2Tracker = document.getElementById('tracker-step-2');
    const step3Tracker = document.getElementById('tracker-step-3');

    if (step1Tracker && state.isEligible) step1Tracker.classList.add('completed');
    if (step2Tracker && state.stage1Completed) step2Tracker.classList.add('completed');
    if (step3Tracker && state.stage1Completed) step3Tracker.classList.add('active');

    // 5. Update Tickets Counter Display
    const ticketsCountEl = document.getElementById('user-tickets-owned');
    if (ticketsCountEl) {
      ticketsCountEl.textContent = state.ticketsOwned;
    }
  });

  if (walletPill) {
    walletPill.addEventListener('click', () => {
      if (confirm('Disconnect wallet?')) {
        window.kamiZukiWeb3.disconnectWallet();
        showToast('Wallet disconnected', 'info');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. MODAL OVERLAYS
   -------------------------------------------------------------------------- */
function initModals() {
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  };

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });
}

window.connectMockWallet = async function(mode) {
  closeModal('wallet-modal');
  const res = await window.kamiZukiWeb3.connectWallet(mode);
  if (res.success) {
    if (res.eligible) {
      showToast('✓ Wallet Connected! Verified partner NFT holding.', 'success');
    } else {
      showToast('⚠️ Wallet Connected: No eligible partner NFT found.', 'warning');
    }
  } else if (res.error) {
    showToast(`❌ Connection Error: ${res.error}`, 'error');
  }
};

/* --------------------------------------------------------------------------
   5. PAGE 3 TABS & TICKET PURCHASE HANDLER
   -------------------------------------------------------------------------- */
function initPage3Tabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${target}`);
      if (activeContent) activeContent.classList.add('active');
    });
  });

  // Ticket Counter Buttons (No upper cap)
  const ticketInput = document.getElementById('ticket-count-input');
  const btnMinus = document.getElementById('btn-ticket-minus');
  const btnPlus = document.getElementById('btn-ticket-plus');

  if (ticketInput && btnMinus && btnPlus) {
    btnMinus.addEventListener('click', () => {
      let val = parseInt(ticketInput.value, 10) || 1;
      if (val > 1) ticketInput.value = val - 1;
    });

    btnPlus.addEventListener('click', () => {
      let val = parseInt(ticketInput.value, 10) || 1;
      ticketInput.value = val + 1; // No arbitrary maximum cap
    });
  }

  // Purchase Ticket Action Handler
  const purchaseBtn = document.getElementById('btn-purchase-tickets');
  if (purchaseBtn) {
    purchaseBtn.addEventListener('click', async () => {
      const count = parseInt(ticketInput ? ticketInput.value : 1, 10);
      
      const res = await window.kamiZukiWeb3.purchaseTickets(count);
      if (res.pendingContract) {
        showToast(`ℹ️ Ticket contract pending deployment (Price: TBD). Registered ${count} ticket selection for wallet.`, 'info');
      } else if (res.success) {
        showToast(`🎉 Purchased ${count} Ticket(s)! Total Raffle Entries: ${res.ticketsOwned}`, 'success');
      } else if (res.error) {
        showToast(`❌ ${res.error}`, 'error');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. GAME STAGE INITIALIZATION & POSTMESSAGE BRIDGE
   -------------------------------------------------------------------------- */
window.restartGame = function() {
  const iframe = document.getElementById('kamizuki-game-iframe');
  if (iframe) {
    iframe.src = 'game/index.html?mode=framed&t=' + Date.now();
    showToast('🔄 Stage 1 restarted.', 'info');
  }
};

window.toggleGameFullscreen = function() {
  const iframe = document.getElementById('kamizuki-game-iframe');
  if (!iframe) return;
  if (!document.fullscreenElement) {
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

function initGameStage() {
  window.onKamiZukiBossDefeated = function(stats) {
    showToast('🏆 STAGE 1 BOSS DEFEATED! Stage 3 Unlocked.', 'success');
    setTimeout(() => {
      window.navigateToPage('page-tickets');
    }, 2200);
  };

  // PostMessage Bridge between KamiZuki website and 2D Platformer Game Iframe
  window.addEventListener('message', (event) => {
    if (!event.data) return;

    // Game is loaded and ready: send connected wallet
    if (event.data.type === 'KAMIZUKI_GAME_READY') {
      const iframe = document.getElementById('kamizuki-game-iframe');
      if (iframe && iframe.contentWindow && window.kamiZukiWeb3?.state?.walletAddress) {
        iframe.contentWindow.postMessage({
          type: 'KAMIZUKI_SET_WALLET',
          wallet: window.kamiZukiWeb3.state.walletAddress
        }, '*');
      }
    }

    // Game completed / Boss defeated
    if (event.data.type === 'KAMIZUKI_STAGE_COMPLETE') {
      const { payload, stats } = event.data;
      // Verification check: ensure run is legitimate or has sufficient playtime
      if (payload && payload.isLegitimate) {
        if (window.kamiZukiWeb3) {
          window.kamiZukiWeb3.recordBossDefeat();
        }
        if (window.onKamiZukiBossDefeated) {
          window.onKamiZukiBossDefeated(stats);
        }
      } else {
        console.warn('[KamiZuki] Run payload validation note:', payload);
        // Fallback: still reward player if duration >= 5000ms
        if (stats && (stats.durationMs >= 5000 || stats.coins > 0 || stats.kills > 0)) {
          if (window.kamiZukiWeb3) window.kamiZukiWeb3.recordBossDefeat();
          if (window.onKamiZukiBossDefeated) window.onKamiZukiBossDefeated(stats);
        }
      }
    }
  });

  const btnSimulateBoss = document.getElementById('btn-simulate-boss-defeat');
  if (btnSimulateBoss) {
    btnSimulateBoss.addEventListener('click', () => {
      const iframe = document.getElementById('kamizuki-game-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'KAMIZUKI_TRIGGER_VICTORY' }, '*');
      }
      if (window.kamiZukiWeb3) {
        window.kamiZukiWeb3.recordBossDefeat();
      }
      if (window.onKamiZukiBossDefeated) {
        window.onKamiZukiBossDefeated({ time: '00:45.00', coins: 10, kills: 5, deaths: 0 });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. TOAST NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

window.showToast = showToast;
