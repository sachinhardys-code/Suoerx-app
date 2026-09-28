/**
 * SuperX Interactive Components & Modals
 */

class SuperXComponents {
  constructor() {
    this.modalContainer = null;
    this.toastContainer = null;
  }

  init() {
    this.modalContainer = document.getElementById('modal-container');
    this.toastContainer = document.getElementById('toast-notification');

    // Subscribe to store toasts
    window.superXStore.on('toastShow', (msg) => this.showToast(msg));
    window.superXStore.on('toastHide', () => this.hideToast());
  }

  showToast(message) {
    if (!this.toastContainer) return;
    const msgEl = this.toastContainer.querySelector('.toast-message');
    if (msgEl) msgEl.textContent = message;
    this.toastContainer.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    this.toastContainer.classList.add('opacity-100', 'translate-y-0');
  }

  hideToast() {
    if (!this.toastContainer) return;
    this.toastContainer.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    this.toastContainer.classList.remove('opacity-100', 'translate-y-0');
  }

  openModal(contentHtml) {
    if (!this.modalContainer) return;
    this.modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300" id="modal-backdrop">
        <div class="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#12141C] border border-white/10 p-6 shadow-2xl shadow-black/80 transform transition-all animate-modal-in text-on-surface">
          <button class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-on-surface hover:bg-white/20 flex items-center justify-center active:scale-95 transition-all z-20" id="modal-close-btn" type="button">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
          ${contentHtml}
        </div>
      </div>
    `;
    this.modalContainer.classList.remove('hidden');

    const closeBtn = document.getElementById('modal-close-btn');
    const backdrop = document.getElementById('modal-backdrop');

    const closeModal = () => {
      window.superXAudio.playTap();
      this.modalContainer.classList.add('hidden');
      this.modalContainer.innerHTML = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
  }

  closeModal() {
    if (this.modalContainer) {
      this.modalContainer.classList.add('hidden');
      this.modalContainer.innerHTML = '';
    }
  }

  // 1. Video Form Demonstration Modal
  openVideoModal() {
    window.superXAudio.playTap();
    const content = `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
          <span class="font-label-caps text-label-caps uppercase text-primary-container tracking-wider font-semibold">Form Telemetry & Biomechanics</span>
        </div>
        <h3 class="font-headline-md text-headline-md text-on-surface font-bold">Incline Dumbbell Press</h3>
        
        <!-- Video/Graphic Preview HUD -->
        <div class="relative w-full h-52 rounded-2xl overflow-hidden bg-surface-container-high border border-white/10 group flex items-center justify-center">
          <img class="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuuWK48ZosSqdAtXKL792fgkkPJwMyQ2pJq7FolmdWJUs_1YZsvFVfDZe3qBwXyHw8iGDas_QM1eWXb-YiDaauHN5n3OUhR9kppI3ZktacB14VoJTDFYfFRFOoky82hEC1xi-lKVUAyduw3OtO3Z6GuBA0kQjoySbW1eV1Vf2ShjleBBFbGbOS4JnyylK35Ivrl0pohtn_IG1mJ6Bv36cTnQ1WGq71dp2nWAMrarf6tj8GTCJSn5qI" alt="Exercise Demo">
          <div class="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
          
          <!-- Animated HUD Overlay -->
          <div class="absolute inset-0 flex flex-col justify-between p-3.5 pointer-events-none">
            <div class="flex justify-between items-center">
              <span class="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-label-caps text-secondary-fixed border border-secondary-fixed/30 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping"></span> 30° OPTIMAL INCLINE
              </span>
              <span class="px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-label-caps text-primary-container">60 FPS 4K</span>
            </div>
            <div class="flex justify-between items-end">
              <span class="text-xs font-mono text-outline">ELBOW TUCK: 45°</span>
              <span class="text-xs font-mono text-primary-container">TEMPO: 3-1-1</span>
            </div>
          </div>

          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-14 h-14 rounded-full bg-primary-container/90 text-on-primary-container flex items-center justify-center shadow-[0_0_24px_rgba(202,243,0,0.6)] cursor-pointer active:scale-95 transition-transform">
              <span class="material-symbols-outlined text-[28px] ml-1">play_arrow</span>
            </div>
          </div>
        </div>

        <!-- Biomechanical Execution Checklist -->
        <div class="flex flex-col gap-2.5 pt-1">
          <h4 class="font-headline-sm text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Kinetic Cues</h4>
          
          <div class="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container">
            <span class="material-symbols-outlined text-primary-container text-[20px] shrink-0 mt-0.5">check_circle</span>
            <div class="flex flex-col text-xs">
              <span class="text-on-surface font-semibold">Scapular Retraction & Arch</span>
              <span class="text-on-surface-variant mt-0.5">Drive shoulder blades down and back into the bench. Maintain slight natural lumbar arch.</span>
            </div>
          </div>

          <div class="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container">
            <span class="material-symbols-outlined text-secondary-container text-[20px] shrink-0 mt-0.5">check_circle</span>
            <div class="flex flex-col text-xs">
              <span class="text-on-surface font-semibold">45-Degree Elbow Flare</span>
              <span class="text-on-surface-variant mt-0.5">Avoid 90° T-bone flaring to safeguard anterior shoulder joint capsule under heavy loads.</span>
            </div>
          </div>

          <div class="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container">
            <span class="material-symbols-outlined text-primary-container text-[20px] shrink-0 mt-0.5">check_circle</span>
            <div class="flex flex-col text-xs">
              <span class="text-on-surface font-semibold">Full Clavicular Stretch</span>
              <span class="text-on-surface-variant mt-0.5">Pause for 0.5s at the bottom for maximal upper pectoral myofibrillar recruitment.</span>
            </div>
          </div>
        </div>

        <button class="w-full py-3.5 rounded-full bg-primary-container text-on-primary-fixed font-headline-sm text-headline-sm font-bold active:scale-[0.98] transition-all shadow-[0_0_16px_rgba(202,243,0,0.3)]" onclick="window.superXComponents.closeModal()">
          Got It, Resume Set
        </button>
      </div>
    `;
    this.openModal(content);
  }

  // 2. Exercise Swap Modal
  openSwapModal() {
    window.superXAudio.playTap();
    const alternatives = [
      { name: 'Incline Smith Machine Press', pr: '85 kg × 6 reps', strain: 'High Stability' },
      { name: 'Flat Barbell Bench Press', pr: '140 kg × 1 rep', strain: 'Max Power' },
      { name: 'Low-to-High Cable Fly', pr: '22 kg × 12 reps', strain: 'Peak Contraction' },
      { name: 'Heavy Incline DB Fly-Press', pr: '32 kg × 8 reps', strain: 'Deep Stretch' }
    ];

    const itemsHtml = alternatives.map(alt => `
      <div class="flex items-center justify-between p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high cursor-pointer transition-all active:scale-[0.99] border border-white/5" onclick="window.superXComponents.selectExercise('${alt.name}', '${alt.pr}')">
        <div class="flex flex-col">
          <span class="font-headline-sm text-sm font-bold text-on-surface">${alt.name}</span>
          <span class="text-xs text-on-surface-variant mt-0.5">PR: ${alt.pr} • <span class="text-secondary-fixed">${alt.strain}</span></span>
        </div>
        <span class="material-symbols-outlined text-primary-container text-[20px]">swap_horiz</span>
      </div>
    `).join('');

    const content = `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-container text-[20px]">sync_alt</span>
          <span class="font-label-caps text-label-caps uppercase text-primary-container tracking-wider font-semibold">Exercise Substitution</span>
        </div>
        <div>
          <h3 class="font-headline-md text-headline-md text-on-surface font-bold">Swap Movement</h3>
          <p class="text-xs text-on-surface-variant mt-1">Select an anatomically equivalent upper chest hypertrophic stimulus.</p>
        </div>

        <div class="flex flex-col gap-2.5">
          ${itemsHtml}
        </div>
      </div>
    `;
    this.openModal(content);
  }

  selectExercise(name, pr) {
    window.superXAudio.playTap();
    window.superXStore.state.workout.exercise.name = name;
    window.superXStore.state.workout.exercise.pr = pr;
    window.superXStore.emit('exerciseSwapped', { name, pr });
    this.closeModal();
    window.superXStore.showToast(`Swapped to: ${name}`);
  }

  // 3. Workout Completed Celebration Modal
  openWorkoutCompletedModal(data) {
    const content = `
      <div class="flex flex-col items-center text-center gap-4 py-2">
        <div class="relative w-20 h-20 rounded-full bg-primary-container/20 border-2 border-primary-container flex items-center justify-center shadow-[0_0_32px_rgba(202,243,0,0.5)]">
          <span class="material-symbols-outlined text-primary-container text-[40px]" style="font-variation-settings: 'FILL' 1;">military_tech</span>
        </div>

        <div>
          <span class="font-label-caps text-label-caps uppercase tracking-widest text-primary-container font-bold">Session Cleared</span>
          <h3 class="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">Upper Body Complete!</h3>
          <p class="text-xs text-on-surface-variant mt-1">Outstanding kinetic output. Your nervous system is primed.</p>
        </div>

        <!-- Telemetry Summary Grid -->
        <div class="grid grid-cols-3 gap-2.5 w-full py-2">
          <div class="flex flex-col p-3 rounded-2xl bg-surface-container border border-white/5">
            <span class="text-[10px] font-label-caps uppercase text-outline">Total Volume</span>
            <span class="font-metric-numeral-md text-primary-container font-bold mt-1">14,240 <span class="text-[10px] text-outline font-normal">kg</span></span>
          </div>
          <div class="flex flex-col p-3 rounded-2xl bg-surface-container border border-white/5">
            <span class="text-[10px] font-label-caps uppercase text-outline">Calories</span>
            <span class="font-metric-numeral-md text-secondary-fixed font-bold mt-1">368 <span class="text-[10px] text-outline font-normal">kcal</span></span>
          </div>
          <div class="flex flex-col p-3 rounded-2xl bg-surface-container border border-white/5">
            <span class="text-[10px] font-label-caps uppercase text-outline">XP Earned</span>
            <span class="font-metric-numeral-md text-on-surface font-bold mt-1">+150</span>
          </div>
        </div>

        <button class="w-full py-4 rounded-full bg-primary-container text-on-primary-fixed font-headline-sm text-headline-sm font-bold active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(202,243,0,0.4)]" onclick="window.superXStore.setTab('today'); window.superXComponents.closeModal();">
          Return to Dashboard
        </button>
      </div>
    `;
    this.openModal(content);
  }

  // 4. PR Detail Modal
  openPRModal(exercise, weight, meta) {
    window.superXAudio.playTap();
    const content = `
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary-container text-[20px]">verified</span>
            <span class="font-label-caps text-label-caps uppercase text-primary-container tracking-wider font-semibold">Verified Personal Record</span>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container text-[11px] font-bold">ALL-TIME BEST</span>
        </div>

        <div class="flex items-baseline justify-between">
          <div>
            <h3 class="font-headline-md text-headline-md text-on-surface font-bold">${exercise}</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">${meta}</p>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="font-display-hero-mobile text-display-hero-mobile font-bold text-on-surface">${weight}</span>
          </div>
        </div>

        <!-- 6-Month Progression Vector Graphic -->
        <div class="flex flex-col gap-2 p-3.5 rounded-2xl bg-surface-container border border-white/5">
          <div class="flex justify-between items-center text-xs text-outline font-label-caps">
            <span>6-MONTH PROGRESSION</span>
            <span class="text-primary-container font-bold">+15.2% GAIN</span>
          </div>
          <div class="h-28 w-full pt-2">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 300 80">
              <defs>
                <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#D4FF00" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#D4FF00" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M 0,65 L 60,58 L 120,48 L 180,42 L 240,28 L 300,10 L 300,80 L 0,80 Z" fill="url(#prGrad)" />
              <path d="M 0,65 L 60,58 L 120,48 L 180,42 L 240,28 L 300,10" fill="none" stroke="#D4FF00" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="300" cy="10" r="5" fill="#D4FF00" stroke="#12141C" stroke-width="2"/>
            </svg>
          </div>
          <div class="flex justify-between text-[10px] text-outline font-mono">
            <span>MAY</span>
            <span>JUL</span>
            <span>AUG</span>
            <span>SEP</span>
            <span class="text-primary-container font-bold">OCT (PR)</span>
          </div>
        </div>

        <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-high text-xs">
          <span class="text-on-surface-variant">Validated by Sensor Telemetry</span>
          <span class="text-secondary-fixed font-semibold">Rep Velocity: 0.28 m/s</span>
        </div>

        <button class="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-on-surface font-headline-sm text-headline-sm font-semibold active:scale-[0.98] transition-all" onclick="window.superXComponents.closeModal()">
          Close Telemetry
        </button>
      </div>
    `;
    this.openModal(content);
  }

  // 5. Apple Wallet Digital Membership Pass
  openAppleWalletModal() {
    window.superXAudio.playTap();
    const content = `
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary-container">account_balance_wallet</span>
            <span class="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">Apple Wallet Pass</span>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container text-[11px] font-bold">TIER 1 BLACK</span>
        </div>

        <!-- Realistic Wallet Pass Card -->
        <div class="relative w-full rounded-2xl bg-gradient-to-br from-[#1A1D27] via-[#11131B] to-[#0A0C14] border border-white/15 p-5 shadow-2xl overflow-hidden">
          <div class="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-primary-container/15 blur-2xl pointer-events-none"></div>
          
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-2">
              <img src="assets/logo.svg" alt="Logo" class="w-7 h-7">
              <span class="font-headline-sm text-sm font-bold tracking-wider uppercase text-primary">SUPERX ATHLETIC CLUB</span>
            </div>
            <span class="material-symbols-outlined text-[24px] text-secondary-container">contactless</span>
          </div>

          <div class="my-6 flex justify-between items-end">
            <div class="flex flex-col">
              <span class="font-label-caps text-[10px] uppercase text-outline">Cardholder</span>
              <span class="font-headline-md text-headline-md font-bold text-on-surface">Alex Mercer</span>
              <span class="text-xs text-on-surface-variant mt-0.5">Member #8842-X</span>
            </div>
            <div class="w-14 h-14 rounded-lg bg-primary-container p-1 flex items-center justify-center">
              <svg class="w-full h-full text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm-2 10h8v8H2v-8zm2 2v4h4v-4H4zm10-14h8v8h-8V2zm2 2v4h4V4h-4zm3 8h2v2h-2v-2zm-3 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm-8-2h2v2h-2v-2zm0-4h2v2h-2v-2z"></path>
              </svg>
            </div>
          </div>

          <div class="flex justify-between items-center pt-3 border-t border-white/10 text-xs font-mono text-outline">
            <span>EXP: 11/26</span>
            <span class="text-secondary-fixed">NFC AUTO-TRIGGER ACTIVE</span>
          </div>
        </div>

        <button class="w-full py-3.5 rounded-full bg-black text-white border border-white/20 font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all" onclick="window.superXStore.showToast('Pass synced to Apple Wallet! 📲'); window.superXComponents.closeModal();">
          <span class="material-symbols-outlined text-[20px]">add_circle</span>
          Add to Apple Wallet
        </button>
      </div>
    `;
    this.openModal(content);
  }
}

window.superXComponents = new SuperXComponents();
