// dark-mode.js
class DarkMode {
    static init() {
      this.toggle = document.getElementById('dark-mode');
      
      // Cargar preferencia
      if (localStorage.getItem('darkMode') === 'enabled') {
        this.enable();
      }
      
      // Escuchar cambios
      if (this.toggle) {
        this.toggle.addEventListener('change', () => this.toggleMode());
      }
      
      // Sincronizar entre pestañas
      window.addEventListener('storage', (e) => {
        if (e.key === 'darkMode') {
          e.newValue === 'enabled' ? this.enable() : this.disable();
        }
      });
    }
  
    static toggleMode() {
      this.toggle.checked ? this.enable() : this.disable();
    }
  
    static enable() {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
      if (this.toggle) this.toggle.checked = true;
    }
  
    static disable() {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
      if (this.toggle) this.toggle.checked = false;
    }
    
  }
  
  // Inicializar al cargar
  document.addEventListener('DOMContentLoaded', () => DarkMode.init());
