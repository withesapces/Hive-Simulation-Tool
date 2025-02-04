function updateLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }
  
  let currentLang = localStorage.getItem('preferredLanguage') || "en";
  updateLanguage(currentLang);
  
  document.getElementById("lang-toggle").addEventListener("click", function(event) {
    if (event.target.matches('[data-lang]')) {
      currentLang = event.target.getAttribute('data-lang');
      updateLanguage(currentLang);
      localStorage.setItem('preferredLanguage', currentLang);
    }
  });
  