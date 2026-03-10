const enterScreen = document.getElementById("enter-screen");
const enterBtn = document.getElementById("enter-btn");
const bgAudio = document.getElementById("bg-audio");
const heroVideo = document.getElementById("hero-video");

const muteToggleTop = document.getElementById("mute-toggle-top");
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

let currentTrackIndex = 0;
let siteEntered = false;
let manualMute = false;

function formatClock(date) {
  return date.toLocaleTimeString("pt-BR", { hour12: false });
}

function formatDate(date) {
  return date.toLocaleDateString("pt-BR");
}

function updateMuteButtons() {
  const text = manualMute ? "UNMUTE" : "MUTE";
  if (muteToggleTop) {
    muteToggleTop.textContent = manualMute ? "DESMUTAR" : "MUTAR";
  }
  if (muteTogglePlayer) {
    muteTogglePlayer.textContent = text;
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

if (muteToggleTop) muteToggleTop.addEventListener("click", toggleMute);
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

setTrack(0, false);
updateMuteButtons();

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
