/**
 * SuperX Central Reactive State Store
 */

class SuperXStore {
  constructor() {
    this.listeners = new Map();

    this.state = {
      activeTab: 'today',
      viewMode: 'iphone', // 'iphone' | 'responsive' | 'multi'
      soundEnabled: true,

      // Workout Session
      workout: {
        active: false,
        startTime: null,
        elapsedSeconds: 1240, // 20m 40s
        exercise: {
          name: 'Incline DB Press',
          category: 'Heavy Hypertrophy',
          pr: '38 kg × 6 reps',
          prDate: 'Oct 12',
          targetRest: 90,
          currentSetIndex: 2, // 0-indexed (Set 3)
          sets: [
            { id: 1, setNum: 1, phase: 'Warm-up phase', weight: 32, reps: 10, completed: true, rpe: '6.5' },
            { id: 2, setNum: 2, phase: 'RPE 7.5', weight: 34, reps: 10, completed: true, rpe: '7.5' },
            { id: 3, setNum: 3, phase: 'Working load', weight: 36, reps: 8, completed: false, rpe: '8.5' },
            { id: 4, setNum: 4, phase: 'Target RPE 9', weight: 38, reps: 8, completed: false, rpe: '9.0' },
          ]
        },
        heartRate: 148,
        heartRateZone: 'Zone 4',
        heartRateLabel: 'Anaerobic',
        calories: 340,
        restSeconds: 75,
        restTotal: 90,
        isResting: true
      },

      // Daily Objectives
      hydration: {
        current: 2.4,
        target: 3.5
      },
      protein: {
        current: 145,
        target: 180
      },
      streakDays: 18,
      readinessScore: 94,
      readinessStatus: 'PRIME',

      // Class Bookings
      selectedClassDate: 'Wed 16',
      selectedClassFilter: 'all',
      searchQuery: '',
      classes: [
        {
          id: 'c1',
          time: '08:00',
          timePeriod: 'AM — 08:50 AM',
          tag: 'High Capacity',
          zone: 'Zone 3',
          title: 'HYROX Power Circuit',
          description: 'Pacing, SkiErg, Sled & Burpee Intervals',
          coach: 'Elena Vance',
          coachShort: 'Elena V.',
          coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHy3OpOsljlyXeD7TNupE_nrXj7W30BPgdoN3VmBH521cnPFeudeiWZYhyBiyR4gHJ0b1qw8YUFLSj_YLAq1Bc79zZXdQx0U0XYgW2yRT6RT1bZYaTspulsjGygAZxlBVrlOoS4w5Jl3uM38o9VUoWMuYD7X1iAQRq2c-shvc_VWljGP5xU_sKHQy32L55YHSTLqahFslogShExm5Zj8Loi_ALSIUxQsR3hmC-TUN8zvCqCh-geM5B',
          strain: '8.8',
          room: 'Track Studio A',
          spotsLeft: 4,
          enrolled: 20,
          status: 'available', // 'available' | 'booked' | 'waitlist'
          friends: ['Alex', 'Marcus'],
          category: 'conditioning'
        },
        {
          id: 'c2',
          time: '09:30',
          timePeriod: 'AM — 10:30 AM',
          tag: 'Strength Max',
          zone: 'Barbell Pod',
          title: 'Olympic Lifting & Clean Form',
          description: 'Snatch mechanics, clean pulls & power telemetry',
          coach: 'Liam Brody',
          coachShort: 'Liam B.',
          coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbbtbE8d-z8b7hIK3M8j-XdWpzylq5CLHoGuJOXvf8nCW03xjvtVzXd4HdvMYUXgv5d6fv5BUk0NSVl9naKoNBIPy9Nr28Y_AOJQU_SqEg5YDKe5ESUKKdWaG2Ts_L3RRgF16pTvEhFZgT0lSJBkNe2lW-lP6hPwS42xqkjBVXPGwRpWoQW4oV3ExwtswlkkKU7KQdjXny1szoORqFVGhrqoysHl-p2txjQFa-MnOyvHN4nNr_ROu',
          strain: '9.4',
          room: 'Olympic Platforms',
          spotsLeft: 0,
          enrolled: 12,
          waitlistCount: 2,
          status: 'waitlist',
          friends: ['Jordan'],
          category: 'strength'
        },
        {
          id: 'c3',
          time: '12:15',
          timePeriod: 'PM — 01:00 PM',
          tag: 'Metabolic Conditioning',
          zone: 'Arena 1',
          title: 'SuperX MetCon 45',
          description: 'Full body lactate buffering & assault bike sets',
          coach: 'Marcus Hayes',
          coachShort: 'Marcus H.',
          coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc4bFCqw1Vn0E6VYizQIjO4BP7_M5PuhEr5Tiywe53k34d56g1rAO4Rd3av8h8Y0U4WrzYD84RaHCivbAqPw0ULnBQrpYfQa9zVLKaH0k9zMuhoaYxp3NeShfOYD1Ba9RoVlVf30epSOnXJr7M6RTsboEhkbZ8fNALwwCFwjUN3-hD-6i8z0AEe-LGu_QSuPYPWrt0T_n53uZ9rg3BvfBtcRj1c1Fr9xeDz2u3V1Vsp93d3LaHyI7s',
          strain: '9.1',
          room: 'Arena 1',
          spotsLeft: 2,
          enrolled: 22,
          status: 'booked',
          friends: ['Sarah', 'David'],
          category: 'conditioning'
        },
        {
          id: 'c4',
          time: '17:30',
          timePeriod: 'PM — 06:15 PM',
          tag: 'Recovery Flow',
          zone: 'Zone 1-2',
          title: 'Mobility & Decompression',
          description: 'Thoracic rotation, hip flexor release, infrared sauna prep',
          coach: 'Chloe Lin',
          coachShort: 'Chloe L.',
          coachAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAZW23zLmW4EODpbT2W_9BQHxS7sxVG9nl5P_QDzOS8SK8myRPqZ9z_ApVYrn_E0mS03XmUA4QV0kIEAATjotdI61raH37pLcU-llhqgDY_B9wHqBCYrV36omhmA1Jgg9oQMgDaUlvhW8eDcYFUwgX7voqUWcFEdtMmzb__E1pjPtFQlaFuTY7G1QOMnc2nPFWrYrTvJo2Ym4tPHCixH1aFrzKlPMEJgcV0f8-A9h6Brq1bdGFjTB5',
          strain: '4.2',
          room: 'Sanctuary Studio',
          spotsLeft: 8,
          enrolled: 16,
          status: 'available',
          friends: ['Maya'],
          category: 'recovery'
        }
      ],

      // Profile State
      lockerPinVisible: false,
      lockerPin: '9402',
      guestPassesRemaining: 3,
      nfcStatus: 'idle', // 'idle' | 'scanning' | 'unlocked'

      // Toast notification
      toast: null
    };

    this.startTelemetryLoop();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(payload));
    }
  }

  setTab(tab) {
    if (this.state.activeTab !== tab) {
      this.state.activeTab = tab;
      window.superXAudio.playTap();
      this.emit('tabChanged', tab);
    }
  }

  setViewMode(mode) {
    this.state.viewMode = mode;
    this.emit('viewModeChanged', mode);
  }

  // Hydration increment
  logWater(amount = 0.25) {
    if (this.state.hydration.current < this.state.hydration.target) {
      this.state.hydration.current = Math.min(
        this.state.hydration.target,
        +(this.state.hydration.current + amount).toFixed(2)
      );
      window.superXAudio.playDroplet();
      this.emit('hydrationUpdated', this.state.hydration);

      if (this.state.hydration.current >= this.state.hydration.target) {
        window.superXAudio.playSetComplete();
        this.showToast('Daily Hydration Goal Completed! +50 XP 💧');
      }
    }
  }

  // Protein increment
  logProtein(amount = 15) {
    if (this.state.protein.current < this.state.protein.target) {
      this.state.protein.current = Math.min(
        this.state.protein.target,
        this.state.protein.current + amount
      );
      window.superXAudio.playStep(true);
      this.emit('proteinUpdated', this.state.protein);
      this.showToast(`Logged +${amount}g Protein! 💪`);
    }
  }

  // Steppers for current active set
  adjustActiveSet(deltaWeight = 0, deltaReps = 0) {
    const activeSet = this.state.workout.exercise.sets[this.state.workout.exercise.currentSetIndex];
    if (!activeSet) return;

    if (deltaWeight !== 0) {
      const newWeight = Math.max(2, activeSet.weight + deltaWeight);
      if (newWeight !== activeSet.weight) {
        activeSet.weight = newWeight;
        window.superXAudio.playStep(deltaWeight > 0);
      }
    }

    if (deltaReps !== 0) {
      const newReps = Math.max(1, activeSet.reps + deltaReps);
      if (newReps !== activeSet.reps) {
        activeSet.reps = newReps;
        window.superXAudio.playStep(deltaReps > 0);
      }
    }

    this.emit('activeSetModified', activeSet);
  }

  // Log active set and trigger rest / next set
  logCurrentSet() {
    const exercise = this.state.workout.exercise;
    const curIdx = exercise.currentSetIndex;
    const curSet = exercise.sets[curIdx];

    if (!curSet || curSet.completed) return;

    curSet.completed = true;
    window.superXAudio.playSetComplete();

    // Check if that was the last set
    if (curIdx >= exercise.sets.length - 1) {
      // Workout completed!
      this.emit('workoutCompleted', {
        exercise: exercise.name,
        setsCompleted: exercise.sets.length,
        totalVolume: exercise.sets.reduce((sum, s) => sum + (s.weight * s.reps), 0),
        calories: this.state.workout.calories,
        duration: this.state.workout.elapsedSeconds
      });
      this.showToast('Workout Completed! Beast Mode Unlocked! 🏆');
    } else {
      // Advance to next set
      exercise.currentSetIndex++;
      this.state.workout.restSeconds = 90;
      this.state.workout.isResting = true;
      this.emit('setLogged', {
        completedSet: curSet,
        nextSet: exercise.sets[exercise.currentSetIndex]
      });
      this.showToast(`Set ${curSet.setNum} Logged! Rest timer started (90s) ⏱️`);
    }
  }

  // Adjust rest seconds
  adjustRest(deltaSeconds) {
    this.state.workout.restSeconds = Math.max(0, this.state.workout.restSeconds + deltaSeconds);
    window.superXAudio.playStep(deltaSeconds > 0);
    this.emit('restTimerUpdated', this.state.workout.restSeconds);
  }

  // Book class action
  bookClass(classId) {
    const item = this.state.classes.find(c => c.id === classId);
    if (!item) return;

    if (item.status === 'available') {
      item.status = 'booked';
      item.spotsLeft = Math.max(0, item.spotsLeft - 1);
      item.enrolled++;
      window.superXAudio.playSetComplete();
      this.showToast(`Booked: ${item.title} with ${item.coachShort}! 🎟️`);
      this.emit('classBooked', item);
    } else if (item.status === 'booked') {
      // Cancel booking
      item.status = 'available';
      item.spotsLeft++;
      item.enrolled--;
      window.superXAudio.playTap();
      this.showToast(`Reservation cancelled for ${item.title}`);
      this.emit('classCancelled', item);
    } else if (item.status === 'waitlist') {
      window.superXAudio.playTap();
      item.waitlistCount = (item.waitlistCount || 2) + 1;
      this.showToast(`Joined waitlist (#${item.waitlistCount}) for ${item.title} ⏳`);
      this.emit('waitlistJoined', item);
    }
  }

  // NFC Scan Simulation
  triggerNfcScan() {
    if (this.state.nfcStatus === 'scanning') return;
    this.state.nfcStatus = 'scanning';
    this.emit('nfcStatusChanged', 'scanning');
    window.superXAudio.playNfcScan();

    setTimeout(() => {
      this.state.nfcStatus = 'unlocked';
      this.emit('nfcStatusChanged', 'unlocked');
      this.showToast('Gate Alpha 02 Unlocked! Welcome Alex. 🔓');

      setTimeout(() => {
        this.state.nfcStatus = 'idle';
        this.emit('nfcStatusChanged', 'idle');
      }, 3500);
    }, 900);
  }

  // Toggle Locker PIN visibility
  toggleLockerPin() {
    this.state.lockerPinVisible = !this.state.lockerPinVisible;
    window.superXAudio.playTap();
    this.emit('lockerPinToggled', this.state.lockerPinVisible);
  }

  showToast(message, duration = 3000) {
    this.state.toast = message;
    this.emit('toastShow', message);
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      this.state.toast = null;
      this.emit('toastHide');
    }, duration);
  }

  // Dynamic Telemetry Simulator (Rest countdown, HR oscillation, ECG)
  startTelemetryLoop() {
    // 1-second interval loop for timers & calories
    setInterval(() => {
      if (this.state.workout.isResting && this.state.workout.restSeconds > 0) {
        this.state.workout.restSeconds--;
        this.emit('restTimerTick', this.state.workout.restSeconds);

        if (this.state.workout.restSeconds === 0) {
          window.superXAudio.playTimerAlert();
          this.showToast('🔔 Rest Time Complete! Ready for Next Set!');
          this.emit('restTimerFinished');
        }
      }

      // Elapsed workout time
      this.state.workout.elapsedSeconds++;
      if (this.state.workout.elapsedSeconds % 12 === 0) {
        this.state.workout.calories++;
        this.emit('caloriesUpdated', this.state.workout.calories);
      }
    }, 1000);

    // Heart rate realistic micro-fluctuation (145 to 152 BPM)
    setInterval(() => {
      const variation = (Math.random() * 4 - 2); // -2 to +2
      const base = 148;
      const newBpm = Math.round(Math.min(160, Math.max(140, base + variation)));
      this.state.workout.heartRate = newBpm;
      this.emit('heartRateTick', newBpm);
    }, 2400);
  }
}

window.superXStore = new SuperXStore();
