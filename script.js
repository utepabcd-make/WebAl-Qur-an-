const surahSelect = document.getElementById('surahSelect');
const content = document.getElementById('content');

// Ambil daftar surat dari API
fetch("https://api.alquran.cloud/v1/surah")
  .then(res => res.json())
  .then(data => {
    data.data.forEach(surah => {
      const opt = document.createElement("option");
      opt.value = surah.number;
      opt.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
      surahSelect.appendChild(opt);
    });
  });

// Ketika memilih surat
surahSelect.addEventListener("change", e => {
  const surahNumber = e.target.value;
  loadSurah(surahNumber);
});

function loadSurah(num) {
  content.innerHTML = "<p>⏳ Memuat ayat...</p>";

  // Ambil ayat beserta terjemahan dan audio
  fetch(`https://api.alquran.cloud/v1/surah/${num}/ar.alafasy`)
    .then(res => res.json())
    .then(arabic => {
      fetch(`https://api.alquran.cloud/v1/surah/${num}/id.indonesian`)
        .then(res => res.json())
        .then(indo => {
          content.innerHTML = "";
          arabic.data.ayahs.forEach((ayah, i) => {
            const div = document.createElement("div");
            div.className = "ayah";
            div.innerHTML = `
              <p><b>Ayat ${ayah.numberInSurah}</b></p>
              <p class="arabic">${ayah.text}</p>
              <p class="translation">${indo.data.ayahs[i].text}</p>
              <audio controls>
                <source src="${ayah.audio}" type="audio/mp3">
              </audio>
            `;
            content.appendChild(div);
          });
        });
    });
}