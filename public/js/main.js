document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.password-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;

      if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = 'visibility_off';
      } else {
        input.type = 'password';
        toggle.textContent = 'visibility';
      }
    });
  });
});
