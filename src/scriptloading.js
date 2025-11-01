document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loadingScreen');
  if (!loading) return;

  loading.style.opacity = loading.style.opacity || '1';
  loading.style.transition = 'opacity 500ms ease';

  setTimeout(() => {
    loading.style.opacity = '0';
    setTimeout(() => {
      try {
        loading.style.display = 'none';
      } catch (e) {
      }
    }, 200);
  }, 1000);
});
