const enterScreen = document.getElementById("enter-screen");
const enterBtn = document.getElementById("enter-btn");
const bgAudio = document.getElementById("bg-audio");
const heroVideo = document.getElementById("hero-video");

const muteTogglePlayer = document.getElementById("mute-toggle-player");

const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".main-section");

const fileTabs = document.querySelectorAll(".file-tab");
const filePanels = document.querySelectorAll(".file-panel");

const fxButtons = document.querySelectorAll(".fx-btn");

const adminLoginBtn = document.getElementById("admin-login-btn");
const adminUser = document.getElementById("admin-user");
const adminPass = document.getElementById("admin-pass");
const adminLoginBox = document.getElementById("admin-login-box");
const adminDashboard = document.getElementById("admin-dashboard");

const openDiscordBtn = document.getElementById("open-discord");
const copyStatusBtn = document.getElementById("copy-status");

const videoTime = document.getElementById("video-time");
const videoDate = document.getElementById("video-date");
const clockBox = document.getElementById("clock-box");

const playTrackBtn = document.getElementById("play-track");
const pauseTrackBtn = document.getElementById("pause-track");
const stopTrackBtn = document.getElementById("stop-track");
const prevTrackBtn = document.getElementById("prev-track");
const nextTrackBtn = document.getElementById("next-track");
const playlistProgress = document.getElementById("playlist-progress");
const trackItems = document.querySelectorAll(".track-item");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");

const gameGrid = document.getElementById("game-grid");
const achievementGrid = document.getElementById("achievement-grid");
const gamesSummary = document.getElementById("games-summary");

let currentTrackIndex = 0;
let siteEntered = false;
let manualMute = false;

/*
  STEAM READY CONFIG
  Para integração real no futuro:
  - steamId: seu SteamID64
  - apiKey: normalmente exigiria backend/proxy
*/
const steamConfig = {
  enabled: false,
  steamId: "",
  apiKey: ""
};

/*
  Sistema local gamer / conquistas
*/
const localGameData = [
  {
    code: "RE2",
    name: "Resident Evil 2",
    genre: "Survival Horror",
    hours: 18,
    achievementsUnlocked: 24,
    achievementsTotal: 42,
    progress: 71
  },
  {
    code: "TQ",
    name: "The Quarry",
    genre: "Interactive Horror",
    hours: 11,
    achievementsUnlocked: 12,
    achievementsTotal: 35,
    progress: 43
  },
  {
    code: "UNCH",
    name: "Uncharted",
    genre: "Action Adventure",
    hours: 22,
    achievementsUnlocked: 28,
    achievementsTotal: 50,
    progress: 64
  },
  {
    code: "MC",
    name: "Minecraft",
    genre: "Sandbox",
    hours: 96,
    achievementsUnlocked: 18,
    achievementsTotal: 40,
    progress: 58
  }
];

const localAchievements = [
  {
    icon: "✦",
    title: "Primeira Noite",
    description: "Entrou no hub e deixou o ambiente tocar.",
    unlocked: true,
    game: "ALLZ HUB"
  },
  {
    icon: "⌘",
    title: "Hub Builder",
    description: "Montou a base principal do site pessoal.",
    unlocked: true,
    game: "ALLZ HUB"
  },
  {
    icon: "☾",
    title: "Dark Mood",
    description: "Ativou a estética nostálgica e melancólica.",
    unlocked: true,
    game: "ALLZ HUB"
  },
  {
    icon: "⚔",
    title: "Rookie Survivor",
    description: "Progresso salvo em jogos de campanha.",
    unlocked: true,
    game: "Resident Evil 2"
  },
  {
    icon: "♫",
    title: "AMV Loop",
    description: "Deixou música e vídeo rodando juntos.",
    unlocked: true,
    game: "ALLZ HUB"
  },
  {
    icon: "★",
    title: "Steam Sync",
    description: "Conectar perfil real da Steam futuramente.",
    unlocked: false,
    game: "Steam"
  }
];

function formatClock(date) {
  return date.toLocaleTimeString("pt-BR", { hour12: false });
}

function formatDate(date) {
  return date.toLocaleDateString("pt-BR");
}

function updateMuteButtons() {
  if (muteTogglePlayer) {
    muteTogglePlayer.textContent = manualMute ? "UNMUTE" : "MUTE";
  }
}

function toggleMute() {
  manualMute = !manualMute;
  bgAudio.muted = manualMute;
  updateMuteButtons();
}

async function syncStartMedia() {
  try {
    bgAudio.pause();
    heroVideo.pause();

    bgAudio.currentTime = 0;
    heroVideo.currentTime = 0;

    bgAudio.volume = 0.2;
    bgAudio.muted = manualMute;

    const playVideo = heroVideo.play();
    const playAudio = bgAudio.play();

    await Promise.allSettled([playVideo, playAudio]);
  } catch (error) {
    console.error("Erro ao iniciar mídia:", error);
  }
}

async function startHub() {
  if (siteEntered) return;
  siteEntered = true;
  enterScreen.classList.add("hidden");
  await syncStartMedia();
}

enterBtn.addEventListener("click", startHub);

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    startHub();
  }
});

if (muteTogglePlayer) muteTogglePlayer.addEventListener("click", toggleMute);

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.section;

    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    sections.forEach((section) => section.classList.remove("active"));
    document.getElementById(`section-${target}`).classList.add("active");
  });
});

fileTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.filetab;

    fileTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    filePanels.forEach((panel) => panel.classList.remove("active"));
    document.getElementById(`filetab-${target}`).classList.add("active");
  });
});

fxButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const fx = btn.dataset.fx;
    const className = `effects-${fx}`;
    document.body.classList.toggle(className);
    btn.classList.toggle("active");
  });
});

adminLoginBtn.addEventListener("click", () => {
  const user = adminUser.value.trim();
  const pass = adminPass.value.trim();

  if (user === "admin" && pass === "2009") {
    adminLoginBox.classList.add("hidden");
    adminDashboard.classList.remove("hidden");
  } else {
    alert("Login inválido.");
  }
});

function updateClocks() {
  const now = new Date();
  clockBox.textContent = formatClock(now);
  videoDate.textContent = formatDate(now);
}
setInterval(updateClocks, 1000);
updateClocks();

function formatVideoSeconds(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

heroVideo.addEventListener("timeupdate", () => {
  videoTime.textContent = formatVideoSeconds(heroVideo.currentTime || 0);
});

const tracks = Array.from(trackItems).map((item) => ({
  src: item.dataset.src,
  title: item.dataset.title,
  artist: item.dataset.artist
}));

function setTrack(index, autoPlay = false) {
  currentTrackIndex = index;

  trackItems.forEach((item, i) => {
    item.classList.toggle("active", i === currentTrackIndex);
  });

  const current = tracks[currentTrackIndex];
  bgAudio.src = current.src;
  trackTitle.textContent = current.title;
  trackArtist.textContent = current.artist;
  bgAudio.volume = 0.2;
  bgAudio.muted = manualMute;

  if (autoPlay) {
    bgAudio.play().catch(() => {});
  }
}

trackItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    setTrack(index, true);
  });
});

playTrackBtn.addEventListener("click", () => {
  bgAudio.play().catch(() => {});
});

pauseTrackBtn.addEventListener("click", () => {
  bgAudio.pause();
});

stopTrackBtn.addEventListener("click", () => {
  bgAudio.pause();
  bgAudio.currentTime = 0;
});

prevTrackBtn.addEventListener("click", () => {
  const nextIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  setTrack(nextIndex, true);
});

nextTrackBtn.addEventListener("click", () => {
  const nextIndex = (currentTrackIndex + 1) % tracks.length;
  setTrack(nextIndex, true);
});

bgAudio.addEventListener("timeupdate", () => {
  if (!isFinite(bgAudio.duration) || bgAudio.duration <= 0) return;
  const progress = (bgAudio.currentTime / bgAudio.duration) * 100;
  playlistProgress.value = progress;
});

playlistProgress.addEventListener("input", () => {
  if (!isFinite(bgAudio.duration) || bgAudio.duration <= 0) return;
  bgAudio.currentTime = (playlistProgress.value / 100) * bgAudio.duration;
});

bgAudio.addEventListener("ended", () => {
  const nextIndex = (currentTrackIndex + 1) % tracks.length;
  setTrack(nextIndex, true);
});

function renderGames() {
  if (!gameGrid) return;

  gameGrid.innerHTML = "";

  localGameData.forEach((game) => {
    const achievementPercent = Math.round((game.achievementsUnlocked / game.achievementsTotal) * 100);

    const card = document.createElement("article");
    card.className = "game-card";
    card.innerHTML = `
      <div class="game-cover">${game.code}</div>
      <div class="game-info">
        <strong>${game.name}</strong>
        <span>${game.genre}</span>
      </div>
      <div class="game-meta-row">
        <span>${game.hours}h</span>
        <span>${game.progress}%</span>
      </div>
      <div class="game-meta-row">
        <span>${game.achievementsUnlocked}/${game.achievementsTotal} conquistas</span>
        <span>${achievementPercent}%</span>
      </div>
      <div class="game-achievements-line">
        <div class="game-achievements-fill" style="width:${achievementPercent}%"></div>
      </div>
    `;
    gameGrid.appendChild(card);
  });

  if (gamesSummary) {
    gamesSummary.textContent = `${localGameData.length} jogos`;
  }
}

function renderAchievements() {
  if (!achievementGrid) return;

  achievementGrid.innerHTML = "";

  localAchievements.forEach((achievement) => {
    const card = document.createElement("article");
    card.className = `achievement-card ${achievement.unlocked ? "unlocked" : "locked"}`;
    card.innerHTML = `
      <div class="achievement-top">
        <div class="achievement-badge">${achievement.icon}</div>
        <div class="achievement-state">${achievement.unlocked ? "desbloqueada" : "bloqueada"}</div>
      </div>
      <strong>${achievement.title}</strong>
      <span>${achievement.description}</span>
      <small>${achievement.game}</small>
    `;
    achievementGrid.appendChild(card);
  });
}

function updateGamingProfileStats() {
  const gamesCount = localGameData.length;
  const totalAchievementsUnlocked = localGameData.reduce((sum, game) => sum + game.achievementsUnlocked, 0);
  const totalHours = localGameData.reduce((sum, game) => sum + game.hours, 0);

  const profileGamesCount = document.getElementById("profile-games-count");
  const profileAchievementCount = document.getElementById("profile-achievement-count");
  const steamGames = document.getElementById("steam-games");
  const steamAchievements = document.getElementById("steam-achievements");
  const steamHours = document.getElementById("steam-hours");

  if (profileGamesCount) profileGamesCount.textContent = String(gamesCount);
  if (profileAchievementCount) profileAchievementCount.textContent = String(totalAchievementsUnlocked);
  if (steamGames) steamGames.textContent = String(gamesCount);
  if (steamAchievements) steamAchievements.textContent = String(totalAchievementsUnlocked);
  if (steamHours) steamHours.textContent = `${totalHours}h`;
}

function setupSteamBlockLocal() {
  const steamModeLabel = document.getElementById("steam-mode-label");
  const steamConnectionStatus = document.getElementById("steam-connection-status");
  const steamName = document.getElementById("steam-name");
  const steamIdLabel = document.getElementById("steam-id-label");
  const steamBio = document.getElementById("steam-bio");
  const steamAvatar = document.getElementById("steam-avatar");

  if (steamModeLabel) steamModeLabel.textContent = steamConfig.enabled ? "steam ativo" : "modo local";
  if (steamConnectionStatus) steamConnectionStatus.textContent = steamConfig.enabled ? "steam sync" : "local system";
  if (steamName) steamName.textContent = "Allz";
  if (steamIdLabel) steamIdLabel.textContent = steamConfig.steamId ? steamConfig.steamId : "Steam ID não conectado";
  if (steamBio) {
    steamBio.textContent = steamConfig.enabled
      ? "Integração configurada. Ajuste o backend/proxy para puxar dados reais."
      : "Você pode usar este bloco como perfil Steam fake agora, ou integrar depois com dados reais.";
  }
  if (steamAvatar) {
    steamAvatar.src = document.getElementById("profile-large-avatar").src;
  }
}

/*
  Opcional para futuro:
  Dá para tentar buscar dados públicos por endpoints alternativos/proxy,
  mas não deixei isso ativo para não quebrar o site sem backend.
*/
async function trySteamIntegration() {
  if (!steamConfig.enabled || !steamConfig.steamId) {
    setupSteamBlockLocal();
    return;
  }

  setupSteamBlockLocal();
}

setTrack(0, false);
updateMuteButtons();
renderGames();
renderAchievements();
updateGamingProfileStats();
setupSteamBlockLocal();
trySteamIntegration();

async function loadDiscordStatus() {
  try {
    const response = await fetch("https://api.lanyard.rest/v1/users/513830615225860096");
    const result = await response.json();

    if (!result.success || !result.data) return;

    const data = result.data;
    const discordUser = data.discord_user || {};
    const activities = data.activities || [];
    const activity = activities.find((act) => act.type !== 4) || activities[0] || null;

    const avatarHash = discordUser.avatar;
    const userId = discordUser.id || "513830615225860096";
    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=256`
      : "https://cdn.discordapp.com/embed/avatars/0.png";

    const displayName = discordUser.display_name || discordUser.global_name || discordUser.username || "ALLZ";
    const username = discordUser.username ? `@${discordUser.username}` : "@unknown";
    const status = data.discord_status || "offline";
    const activityText = activity
      ? `${activity.name}${activity.details ? " — " + activity.details : ""}`
      : "sem atividade";

    document.getElementById("discord-avatar").src = avatarUrl;
    document.getElementById("discord-name").textContent = displayName;
    document.getElementById("discord-username").textContent = username;
    document.getElementById("discord-activity").textContent = activityText;
    document.getElementById("discord-state-top").textContent = status;

    document.getElementById("profile-avatar-left").src = avatarUrl;
    document.getElementById("profile-name-left").textContent = displayName;
    document.getElementById("profile-user-left").textContent = username;
    document.getElementById("profile-status-left").textContent = status;

    document.getElementById("profile-large-avatar").src = avatarUrl;
    document.getElementById("profile-display-name").textContent = displayName;
    document.getElementById("profile-username-main").textContent = username;
    document.getElementById("profile-status-main").textContent = status;

    const steamAvatar = document.getElementById("steam-avatar");
    if (steamAvatar && !steamConfig.enabled) {
      steamAvatar.src = avatarUrl;
    }

    openDiscordBtn.onclick = () => {
      window.open(`https://discord.com/users/${userId}`, "_blank");
    };

    copyStatusBtn.onclick = async () => {
      const text = `${displayName} | ${status} | ${activityText}`;
      try {
        await navigator.clipboard.writeText(text);
        copyStatusBtn.textContent = "COPIADO";
        setTimeout(() => {
          copyStatusBtn.textContent = "COPIAR";
        }, 1500);
      } catch {
        copyStatusBtn.textContent = "ERRO";
        setTimeout(() => {
          copyStatusBtn.textContent = "COPIAR";
        }, 1500);
      }
    };
  } catch (error) {
    console.error("Erro ao carregar Discord:", error);
  }
}

loadDiscordStatus();
setInterval(loadDiscordStatus, 30000);
