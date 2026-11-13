let audio;
let melody;

function stopChime() {
  melody?.disconnect();
  melody = undefined;
}

// Cria o contexto durante o clique, enquanto o navegador permite iniciar áudio.
function playChime(theme, day) {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  try {
    audio ??= new Audio();
    audio.resume().catch(() => {});
    stopChime();
    const output = audio.createGain();
    melody = output;
    output.gain.value = .65;
    output.connect(audio.destination);
    const start = audio.currentTime + .025;
    const { wave, step, notes, long } = themes[theme];
    const transpose = [0, 2, -2, 5, -3, 3][day % 6];
    let offset = 0;
    notes.forEach((note, index) => {
      const time = start + offset;
      const duration = step * (long.includes(index) ? 2 : 1);
      offset += duration;
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      oscillator.type = wave;
      oscillator.frequency.value = 440 * Math.pow(2, (note + transpose - 69) / 12);
      envelope.gain.setValueAtTime(.001, time);
      envelope.gain.exponentialRampToValueAtTime(.20, time + .012);
      envelope.gain.exponentialRampToValueAtTime(.001, time + duration + .17);
      oscillator.connect(envelope);
      envelope.connect(output);
      oscillator.start(time);
      oscillator.stop(time + duration + .18);
    });
  } catch {
    // A ficha também funciona quando o navegador bloqueia o áudio.
    stopChime();
  }
}
