class Language {
    constructor(data = {}) {
      this.share = data.share || new LanguageValues();
      this.message = data.message|| new LanguageValues();
    }
  }
  
  class LanguageValues {
    constructor(data = {}) {
      this.value = data.value || "";
      this.defaultValue = data.defaultValue || "";
    }
  }