if (typeof setup === 'undefined') { setup = {} }

setup.language = function() {
  var progress = $.Deferred();

  navigator.globalization.getPreferredLanguage(
    function success(lang) {
      var langCode = lang.value.split('-')[0];
      strings = languages[langCode] || languages[defaults.language];
      console.log(langCode);
      progress.resolve();
    }, function failure() {
      strings = languages[defaults.language];
      progress.resolve();
    });

  return progress;
};
