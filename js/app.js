/**
 * SuperX Application Logic & Interactive Router
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Components
  window.superXComponents.init();

  // Setup Real-Time Status Bar Clock
  initClock();

  // Setup Studio Toolbar (View Modes, Sound, Quick Navigation)
  initStudioToolbar();

  // Setup Tab Navigation & Routing
  initTabNavigation();

  // Setup Screen Specific Handlers
  initTodayScreen();
  initWorkoutScreen();
  initClassesScreen();
  initProfileScreen();

  // Setup Dynamic Island
  initDynamicIsland();
});

// 1. Status Bar Clock
function initClock() {
  const clockEls = document.querySelectorAll('.ios-clock');
  function update() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    // Format 12-hour or 24-hour cleanly
    const timeStr = `${hours}:${minutes}`;
    clockEls.forEach(el => el.textContent = timeStr);
  }
  update();
  setInterval(update, 10000);
}

// 2. Studio Toolbar Controls
function initStudioToolbar() {
  const iphoneBtn = document.getElementById('view-iphone-btn');
  const responsiveBtn = document.getElementById('view-responsive-btn');
  const multiBtn = document.getElementById('view-multi-btn');
  const soundBtn = document.getElementById('sound-toggle-btn');
  const phoneContainer = document.getElementById('phone-container');
  const singleViewWrapper = document.getElementById('single-view-wrapper');
  const multiViewWrapper = document.getElementById('multi-view-wrapper');

  if (iphoneBtn && responsiveBtn && multiBtn) {
    iphoneBtn.addEventListener('click', () => {
      window.superXAudio.playTap();
      setActiveViewBtn(iphoneBtn);
      singleViewWrapper.classList.remove('hidden');
      multiViewWrapper.classList.add('hidden');
      phoneContainer.classList.remove('responsive-mode');
    });

    responsiveBtn.addEventListener('click', () => {
      window.superXAudio.playTap();
      setActiveViewBtn(responsiveBtn);
      singleViewWrapper.classList.remove('hidden');
      multiViewWrapper.classList.add('hidden');
      phoneContainer.classList.add('responsive-mode');
    });

    multiBtn.addEventListener('click', () => {
      window.superXAudio.playTap();
      setActiveViewBtn(multiBtn);
      singleViewWrapper.classList.add('hidden');
      multiViewWrapper.classList.remove('hidden');
    });
  }

  function setActiveViewBtn(activeBtn) {
    [iphoneBtn, responsiveBtn, multiBtn].forEach(btn => {
      if (!btn) return;
      btn.classList.remove('bg-primary-container', 'text-on-primary-fixed', 'font-bold');
      btn.classList.add('bg-surface-container', 'text-on-surface-variant');
    });
    activeBtn.classList.remove('bg-surface-container', 'text-on-surface-variant');
    activeBtn.classList.add('bg-primary-container', 'text-on-primary-fixed', 'font-bold');
  }

  // Audio SFX toggle
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const enabled = window.superXAudio.toggleSound();
      const icon = soundBtn.querySelector('.sound-icon');
      const label = soundBtn.querySelector('.sound-label');
      if (icon) icon.textContent = enabled ? 'volume_up' : 'volume_off';
      if (label) label.textContent = enabled ? 'Sound: ON' : 'Sound: OFF';
      soundBtn.classList.toggle('text-primary-container', enabled);
      soundBtn.classList.toggle('text-outline', !enabled);
      window.superXStore.showToast(enabled ? 'Tactile Sound Enabled 🔊' : 'Audio Muted 🔇');
    });
  }
}

// 3. Tab Navigation & Routing
function initTabNavigation() {
  const navLinks = document.querySelectorAll('[data-nav-tab]');
  const screenTitle = document.getElementById('header-screen-title');

  function switchTab(tabId) {
    // Hide all screen panels
    document.querySelectorAll('.screen-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    // Show target panel
    const targetPanel = document.getElementById(`panel-${tabId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
      targetPanel.scrollTop = 0;
    }

    // Update bottom navigation bar active states
    navLinks.forEach(link => {
      const isTarget = link.getAttribute('data-nav-tab') === tabId;
      link.classList.toggle('text-primary-container', isTarget);
      link.classList.toggle('font-bold', isTarget);
      link.classList.toggle('text-on-surface-variant', !isTarget);
      if (isTarget) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Update header title
    if (screenTitle) {
      const titleMap = {
        'today': 'Today',
        'workout': 'Workout',
        'classes': 'Classes',
        'profile': 'Profile'
      };
      screenTitle.textContent = titleMap[tabId] || 'SuperX';
    }

    // Trigger store event
    window.superXStore.state.activeTab = tabId;
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-nav-tab');
      window.superXAudio.playTap();
      switchTab(tabId);
    });
  });

  // Profile avatar shortcut
  document.querySelectorAll('[data-path="profile"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.superXAudio.playTap();
      switchTab('profile');
    });
  });

  // Listen to store tab changes
  window.superXStore.on('tabChanged', (tab) => switchTab(tab));
}

// 4. Dynamic Island Integration
function initDynamicIsland() {
  const island = document.getElementById('dynamic-island');
  if (!island) return;

  island.addEventListener('click', () => {
    window.superXAudio.playTap();
    island.classList.toggle('expanded');
    const isExpanded = island.classList.contains('expanded');
    const compactContent = island.querySelector('.compact-island');
    const expandedContent = island.querySelector('.expanded-island');

    if (compactContent && expandedContent) {
      compactContent.classList.toggle('hidden', isExpanded);
      expandedContent.classList.toggle('hidden', !isExpanded);
    }
  });

  // Live updates to dynamic island during rest/workout
  window.superXStore.on('restTimerTick', (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    const timeEl = island.querySelector('.island-timer');
    if (timeEl) timeEl.textContent = `${m}:${s}`;
  });

  window.superXStore.on('heartRateTick', (bpm) => {
    const hrEl = island.querySelector('.island-bpm');
    if (hrEl) hrEl.textContent = bpm;
  });
}

// 5. Today Screen Logic
function initTodayScreen() {
  // Start Workout CTA
  const startBtn = document.getElementById('start-workout-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      window.superXAudio.playTap();
      startBtn.innerHTML = `
        <span class="flex items-center gap-2 font-headline-sm text-headline-sm font-bold tracking-tight">
          <span class="material-symbols-outlined text-[24px] animate-spin">sync</span>
          LAUNCHING TRACKER...
        </span>
        <span class="material-symbols-outlined text-[20px]">fitness_center</span>
      `;

      setTimeout(() => {
        // Switch to workout tab
        window.superXStore.setTab('workout');
        window.superXStore.state.workout.active = true;
        
        // Expand dynamic island briefly to show workout active
        const island = document.getElementById('dynamic-island');
        if (island) {
          island.classList.add('expanded');
          const compactContent = island.querySelector('.compact-island');
          const expandedContent = island.querySelector('.expanded-island');
          if (compactContent) compactContent.classList.add('hidden');
          if (expandedContent) expandedContent.classList.remove('hidden');
        }

        // Reset button text
        startBtn.innerHTML = `
          <span class="flex items-center gap-2 font-headline-sm text-headline-sm font-bold tracking-tight">
            <span class="material-symbols-outlined text-[24px]">pause</span>
            RESUME WORKOUT
          </span>
          <span class="material-symbols-outlined text-[20px]">timer</span>
        `;
      }, 500);
    });
  }

  // Hydration card
  const waterBtn = document.getElementById('water-card');
  const waterVal = document.getElementById('water-val');
  const waterBar = document.getElementById('water-bar');
  if (waterBtn) {
    waterBtn.addEventListener('click', () => {
      window.superXStore.logWater(0.25);
    });
  }

  window.superXStore.on('hydrationUpdated', (h) => {
    if (waterVal) waterVal.textContent = h.current.toString();
    if (waterBar) {
      const pct = Math.min(100, Math.round((h.current / h.target) * 100));
      waterBar.style.width = pct + '%';
    }
  });

  // Protein card
  const proteinBtn = document.getElementById('protein-card');
  const proteinVal = document.getElementById('protein-val');
  const proteinBar = document.getElementById('protein-bar');
  if (proteinBtn) {
    proteinBtn.addEventListener('click', () => {
      window.superXStore.logProtein(15);
    });
  }

  window.superXStore.on('proteinUpdated', (p) => {
    if (proteinVal) proteinVal.textContent = p.current.toString();
    if (proteinBar) {
      const pct = Math.min(100, Math.round((p.current / p.target) * 100));
      proteinBar.style.width = pct + '%';
    }
  });

  // Daily Micro Challenge
  const challengeCard = document.getElementById('challenge-card');
  if (challengeCard) {
    challengeCard.addEventListener('click', () => {
      window.superXAudio.playSetComplete();
      window.superXStore.showToast('Micro-Challenge Claimed! +50 XP Awarded ⚡');
      const badge = challengeCard.querySelector('.challenge-badge');
      if (badge) {
        badge.textContent = 'CLAIMED';
        badge.classList.replace('text-on-surface-variant', 'text-primary-container');
      }
    });
  }
}

// 6. Workout Screen Logic
function initWorkoutScreen() {
  const weightEl = document.getElementById('weightDisplay');
  const repsEl = document.getElementById('repsDisplay');
  const timerDigits = document.getElementById('timerDigits');
  const ring = document.getElementById('restRing');
  const circumference = 264;

  // Steppers
  document.getElementById('weightPlus')?.addEventListener('click', () => {
    window.superXStore.adjustActiveSet(2, 0);
  });
  document.getElementById('weightMinus')?.addEventListener('click', () => {
    window.superXStore.adjustActiveSet(-2, 0);
  });
  document.getElementById('repsPlus')?.addEventListener('click', () => {
    window.superXStore.adjustActiveSet(0, 1);
  });
  document.getElementById('repsMinus')?.addEventListener('click', () => {
    window.superXStore.adjustActiveSet(0, -1);
  });

  window.superXStore.on('activeSetModified', (set) => {
    if (weightEl) weightEl.textContent = set.weight;
    if (repsEl) repsEl.textContent = set.reps;
  });

  // Rest Timer updates
  function renderRestRing(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    if (timerDigits) timerDigits.textContent = `${m}:${s}`;
    if (ring) {
      const progress = Math.max(0, Math.min(1, seconds / 90));
      ring.style.strokeDashoffset = circumference * (1 - progress);
    }
  }

  window.superXStore.on('restTimerTick', (seconds) => {
    renderRestRing(seconds);
  });

  window.superXStore.on('restTimerUpdated', (seconds) => {
    renderRestRing(seconds);
  });

  document.getElementById('plusRestBtn')?.addEventListener('click', () => {
    window.superXStore.adjustRest(30);
  });

  document.getElementById('minusRestBtn')?.addEventListener('click', () => {
    window.superXStore.adjustRest(-15);
  });

  // Audio Cue Toggle
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const enabled = window.superXAudio.toggleSound();
      if (audioIcon) {
        audioIcon.textContent = enabled ? 'volume_up' : 'volume_off';
        audioIcon.className = enabled ? 'material-symbols-outlined text-[18px] text-primary-container' : 'material-symbols-outlined text-[18px] text-outline';
      }
    });
  }

  // Heart Rate dynamic updates
  const hrValEl = document.getElementById('live-hr-val');
  window.superXStore.on('heartRateTick', (bpm) => {
    if (hrValEl) hrValEl.textContent = bpm;
  });

  // Video Form Modal trigger
  document.getElementById('open-form-video')?.addEventListener('click', () => {
    window.superXComponents.openVideoModal();
  });

  // Swap Exercise Modal trigger
  document.getElementById('open-swap-modal')?.addEventListener('click', () => {
    window.superXComponents.openSwapModal();
  });

  window.superXStore.on('exerciseSwapped', ({ name, pr }) => {
    const titleEl = document.getElementById('current-exercise-title');
    const prEl = document.getElementById('current-exercise-pr');
    if (titleEl) titleEl.textContent = name;
    if (prEl) prEl.textContent = `PR: ${pr}`;
  });

  // Log Set Primary CTA
  const logBtn = document.getElementById('logSetActionBtn');
  if (logBtn) {
    logBtn.addEventListener('click', () => {
      window.superXStore.logCurrentSet();
    });
  }

  window.superXStore.on('setLogged', ({ completedSet, nextSet }) => {
    // Update visual sets in list
    const set3Card = document.getElementById('set-3-card');
    const set4Card = document.getElementById('set-4-card');

    if (set3Card) {
      set3Card.innerHTML = `
        <div class="flex items-center justify-between p-space-md rounded-DEFAULT bg-surface-container-low transition-all">
          <div class="flex items-center gap-space-md">
            <div class="w-8 h-8 rounded-full bg-primary-container/20 text-primary-container flex items-center justify-center font-headline-sm text-body-md font-bold">
              <span class="material-symbols-outlined text-[20px]">check</span>
            </div>
            <div class="flex flex-col">
              <span class="text-on-surface font-headline-sm text-body-md font-semibold">Set 3</span>
              <span class="text-outline text-body-sm font-body-sm">Logged Load</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-baseline gap-1 text-right">
              <span class="font-headline-md text-headline-sm text-on-surface">${completedSet.weight}</span>
              <span class="text-outline text-body-sm">kg</span>
              <span class="text-outline mx-1">×</span>
              <span class="font-headline-md text-headline-sm text-on-surface">${completedSet.reps}</span>
              <span class="text-outline text-body-sm">reps</span>
            </div>
          </div>
        </div>
      `;
    }

    if (set4Card) {
      set4Card.className = "flex flex-col p-space-md rounded-DEFAULT bg-surface-container-high shadow-xl relative overflow-hidden transition-all";
      set4Card.innerHTML = `
        <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
        <div class="flex items-center justify-between pl-1">
          <div class="flex items-center gap-space-md">
            <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-body-md font-bold shadow-[0_0_12px_#caf300]">
              4
            </div>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="text-on-surface font-headline-sm text-body-md font-bold">Set 4</span>
                <span class="px-2 py-0.5 rounded-full bg-primary-container/15 text-primary-container text-[10px] font-label-caps uppercase tracking-wider font-semibold">Final Set</span>
              </div>
              <span class="text-on-surface-variant text-body-sm font-body-sm">Target RPE 9.0</span>
            </div>
          </div>
          <span class="text-primary-container font-label-caps text-label-caps uppercase tracking-widest">Active Set</span>
        </div>
        <div class="grid grid-cols-2 gap-space-md mt-space-md pt-space-sm pl-1">
          <div class="flex flex-col items-center bg-surface-container rounded-DEFAULT p-space-sm shadow-sm">
            <span class="text-outline font-label-caps text-[11px] uppercase tracking-wider mb-1">Weight (KG)</span>
            <div class="flex items-center justify-between w-full px-1">
              <button class="w-10 h-10 rounded-full bg-surface-variant text-on-surface hover:text-primary-container flex items-center justify-center active:scale-90 transition-transform" id="weightMinus" type="button">
                <span class="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight" id="weightDisplay">${nextSet.weight}</span>
              <button class="w-10 h-10 rounded-full bg-surface-variant text-on-surface hover:text-primary-container flex items-center justify-center active:scale-90 transition-transform" id="weightPlus" type="button">
                <span class="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </div>
          <div class="flex flex-col items-center bg-surface-container rounded-DEFAULT p-space-sm shadow-sm">
            <span class="text-outline font-label-caps text-[11px] uppercase tracking-wider mb-1">Reps Completed</span>
            <div class="flex items-center justify-between w-full px-1">
              <button class="w-10 h-10 rounded-full bg-surface-variant text-on-surface hover:text-primary-container flex items-center justify-center active:scale-90 transition-transform" id="repsMinus" type="button">
                <span class="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight" id="repsDisplay">${nextSet.reps}</span>
              <button class="w-10 h-10 rounded-full bg-surface-variant text-on-surface hover:text-primary-container flex items-center justify-center active:scale-90 transition-transform" id="repsPlus" type="button">
                <span class="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </div>
        </div>
      `;

      // Re-bind set 4 stepper events
      set4Card.querySelector('#weightPlus')?.addEventListener('click', () => window.superXStore.adjustActiveSet(2, 0));
      set4Card.querySelector('#weightMinus')?.addEventListener('click', () => window.superXStore.adjustActiveSet(-2, 0));
      set4Card.querySelector('#repsPlus')?.addEventListener('click', () => window.superXStore.adjustActiveSet(0, 1));
      set4Card.querySelector('#repsMinus')?.addEventListener('click', () => window.superXStore.adjustActiveSet(0, -1));
    }

    if (logBtn) {
      logBtn.innerHTML = `
        <span class="material-symbols-outlined text-[24px]">flag</span>
        <span>Log Set 4 & Complete Workout</span>
      `;
    }
  });

  window.superXStore.on('workoutCompleted', (summary) => {
    window.superXComponents.openWorkoutCompletedModal(summary);
  });
}

// 7. Classes Screen Logic
function initClassesScreen() {
  // Date chips
  const dateChips = document.querySelectorAll('.date-chip');
  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      window.superXAudio.playTap();
      dateChips.forEach(c => {
        c.classList.remove('bg-primary-container', 'text-on-primary-fixed', 'shadow-md', 'shadow-primary-container/20');
        c.classList.add('bg-surface-container-low', 'text-on-surface-variant');
        const num = c.querySelector('.font-metric-numeral-md');
        if (num) num.classList.replace('text-on-primary-fixed', 'text-on-surface');
      });

      chip.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
      chip.classList.add('bg-primary-container', 'text-on-primary-fixed', 'shadow-md', 'shadow-primary-container/20');
      const num = chip.querySelector('.font-metric-numeral-md');
      if (num) num.classList.replace('text-on-surface', 'text-on-primary-fixed');
    });
  });

  // Search input filter
  const searchInput = document.getElementById('class-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.class-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // Book class action buttons
  document.querySelectorAll('.book-action-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const classId = this.getAttribute('data-class-id') || 'c1';
      window.superXStore.bookClass(classId);
    });
  });

  window.superXStore.on('classBooked', (item) => {
    const btn = document.querySelector(`[data-class-id="${item.id}"]`);
    if (btn) {
      btn.innerHTML = `
        <span class="material-symbols-outlined text-[18px]">check</span>
        <span>Booked</span>
      `;
      btn.className = "book-action-btn flex items-center justify-center gap-space-xs px-space-lg py-2.5 rounded-full bg-secondary-container text-on-secondary-fixed font-headline-sm text-headline-sm font-bold active:scale-95 shadow-md shadow-secondary-container/20 transition-all";
    }
    const spotsEl = document.getElementById(`spots-${item.id}`);
    if (spotsEl) spotsEl.textContent = `${item.spotsLeft} spots left`;
  });

  window.superXStore.on('classCancelled', (item) => {
    const btn = document.querySelector(`[data-class-id="${item.id}"]`);
    if (btn) {
      btn.innerHTML = `
        <span>Book Spot</span>
        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
      `;
      btn.className = "book-action-btn flex items-center justify-center gap-space-xs px-space-lg py-2.5 rounded-full bg-primary-container text-on-primary-fixed font-headline-sm text-headline-sm font-bold active:scale-95 shadow-md shadow-primary-container/20 transition-all";
    }
    const spotsEl = document.getElementById(`spots-${item.id}`);
    if (spotsEl) spotsEl.textContent = `${item.spotsLeft} spots left`;
  });

  // Calendar sync buttons
  document.querySelectorAll('.calendar-sync-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      window.superXAudio.playSetComplete();
      const icon = this.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'event_available';
      this.classList.add('text-primary-container');
      window.superXStore.showToast('Class synchronized with iOS Calendar! 📅');
    });
  });
}

// 8. Profile Screen Logic
function initProfileScreen() {
  // NFC turnstile tap
  const nfcBtn = document.getElementById('nfcTriggerBtn');
  if (nfcBtn) {
    nfcBtn.addEventListener('click', () => {
      window.superXStore.triggerNfcScan();
    });
  }

  window.superXStore.on('nfcStatusChanged', (status) => {
    if (!nfcBtn) return;
    if (status === 'scanning') {
      nfcBtn.innerHTML = `
        <span class="material-symbols-outlined text-[20px] animate-spin">sync</span>
        <span>Scanning NFC...</span>
      `;
      nfcBtn.classList.add('opacity-80');
    } else if (status === 'unlocked') {
      nfcBtn.innerHTML = `
        <span class="material-symbols-outlined text-[20px] text-black" style="font-variation-settings: 'FILL' 1;">check_circle</span>
        <span class="text-black">Turnstile Unlocked</span>
      `;
      nfcBtn.classList.replace('bg-primary-container', 'bg-secondary-container');
    } else if (status === 'idle') {
      nfcBtn.innerHTML = `
        <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">sensors</span>
        <span>Tap NFC</span>
      `;
      nfcBtn.classList.replace('bg-secondary-container', 'bg-primary-container');
      nfcBtn.classList.remove('opacity-80');
    }
  });

  // Apple Wallet Pass Modal
  document.getElementById('open-wallet-btn')?.addEventListener('click', () => {
    window.superXComponents.openAppleWalletModal();
  });

  // PR Cards click to view progression
  document.getElementById('pr-deadlift')?.addEventListener('click', () => {
    window.superXComponents.openPRModal('Conventional Deadlift', '220 kg', '1 Rep Max • Belted');
  });

  document.getElementById('pr-squat')?.addEventListener('click', () => {
    window.superXComponents.openPRModal('Low Bar Back Squat', '180 kg', '1 Rep Max • Full Depth');
  });

  document.getElementById('pr-bench')?.addEventListener('click', () => {
    window.superXComponents.openPRModal('Paused Bench Press', '140 kg', '1 Rep Max • Competition Pause');
  });

  document.getElementById('pr-row')?.addEventListener('click', () => {
    window.superXComponents.openPRModal('2k Ergometer Sprint', '06:42 min', 'Concept2 Rower • Split 1:40.5');
  });

  // Locker PIN toggle
  const lockerPinEl = document.getElementById('locker-pin-val');
  const lockerCard = document.getElementById('locker-card');
  if (lockerCard && lockerPinEl) {
    lockerCard.addEventListener('click', () => {
      window.superXStore.toggleLockerPin();
    });
  }

  window.superXStore.on('lockerPinToggled', (visible) => {
    if (lockerPinEl) {
      lockerPinEl.textContent = visible ? '9402' : '••••';
      lockerPinEl.classList.toggle('blur-xs', !visible);
    }
  });

  // VIP Guest Pass Generator
  document.getElementById('guest-pass-card')?.addEventListener('click', () => {
    window.superXAudio.playTap();
    window.superXStore.showToast('VIP Guest Link Copied! Send to training buddy. 🔗');
  });

  // Muscle recovery items
  document.querySelectorAll('.recovery-muscle-row').forEach(row => {
    row.addEventListener('click', () => {
      window.superXAudio.playTap();
      const muscle = row.getAttribute('data-muscle') || 'Muscle Group';
      const pct = row.getAttribute('data-pct') || '80%';
      window.superXStore.showToast(`${muscle}: ${pct} Recovered. Recommended: Contrast shower & foam rolling.`);
    });
  });
}
