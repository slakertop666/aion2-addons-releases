const info = document.querySelector('#release-info');

async function showRelease() {
  try {
    const response = await fetch('./release.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Release feed unavailable');
    const release = await response.json();
    if (!release.available) {
      info.textContent = 'Установщик появится здесь после публикации первого релиза.';
      return;
    }

    const download = new URL(release.url, location.href);
    const localPreview = location.hostname === '127.0.0.1' && download.origin === location.origin;
    if ((!localPreview && download.protocol !== 'https:') ||
        download.username || download.password ||
        !/^\d+\.\d+\.\d+$/.test(release.version) ||
        !Number.isSafeInteger(release.size) || release.size <= 0 ||
        !/^[a-f0-9]{64}$/.test(release.sha256)) {
      throw new Error('Invalid release');
    }

    const link = document.querySelector('#download');
    link.href = download.href;
    link.hidden = false;
    const size = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(release.size / 1024 ** 2);
    info.textContent = `Версия ${release.version} · ${size} МБ`;
    document.querySelector('#release-notes').textContent = release.notes || '';
    document.querySelector('#checksum').textContent = release.sha256;
    document.querySelector('#release-meta').hidden = false;
  } catch {
    info.textContent = 'Не удалось загрузить данные релиза. Обнови страницу чуть позже.';
  }
}

showRelease();
