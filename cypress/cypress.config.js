const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://localhost:50733', // URL-ul aplicației
    setupNodeEvents(on, config) {
      // Eventuale hooks, dacă este necesar
    },
    defaultCommandTimeout: 10000, // Timeout pentru comenzi (10 secunde)
    pageLoadTimeout: 60000, // Timeout pentru încărcarea paginilor (60 secunde)
    supportFile: false, // Dezactivăm fișierul de suport
  },
  retries: {
    runMode: 2, // Retries pentru testele automate
    openMode: 0, // Fără retries în mod interactiv
  },
});
