(() => {
  'use strict';

  const form = document.getElementById('contact-form');
  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const feedback = document.getElementById('form-feedback');
  const whatsappFallback = document.getElementById('form-whatsapp');
  const { retorno, email, telefone, assunto } = form.elements;
  const emailConfig = {
    service: 'service_k31vq86',
    template: 'template_qthc1i8',
    publicKey: 'iCmB2Kfj2cYT8ifvG'
  };

  function showFeedback(state, message) {
    feedback.dataset.state = state;
    whatsappFallback.hidden = state !== 'error';
    status.textContent = message;
  }

  function updateReturnFields() {
    const byWhatsApp = retorno.value === 'whatsapp';
    email.disabled = byWhatsApp;
    email.closest('.field').hidden = byWhatsApp;
    telefone.disabled = !byWhatsApp;
    telefone.closest('.field').hidden = !byWhatsApp;
  }

  retorno.addEventListener('change', updateReturnFields);
  updateReturnFields();

  document.querySelectorAll('[data-contact-subject]').forEach((link) => {
    link.href = '#contact-form';
    link.addEventListener('click', () => {
      assunto.value = link.dataset.contactSubject;
    });
  });

  form.hidden = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;

    const data = new FormData(form);
    const name = data.get('nome').trim();
    if (!name) {
      const nameInput = form.elements.nome;
      nameInput.setCustomValidity('Informe seu nome.');
      nameInput.reportValidity();
      return;
    }

    const byWhatsApp = data.get('retorno') === 'whatsapp';
    const phone = byWhatsApp ? data.get('telefone').trim() : '';
    if (byWhatsApp && !/^\s*(?:\+?55[\s.-]*)?\(?[1-9]\d\)?[\s.-]*\d{4,5}[\s.-]*\d{4}\s*$/.test(phone)) {
      telefone.setCustomValidity('Informe um número de WhatsApp com DDD.');
      telefone.reportValidity();
      return;
    }

    const emailClient = window.emailjs;
    if (typeof emailClient?.send !== 'function') {
      showFeedback('error', 'O serviço de envio está indisponível. Tente novamente ou fale pelo WhatsApp.');
      return;
    }

    const subject = data.get('assunto');
    const returnChannel = byWhatsApp ? 'WhatsApp' : 'e-mail';
    const caseDescription = data.get('mensagem').trim();
    const message = [
      `Assunto do contato: ${subject}.`,
      `Retorno por ${returnChannel}: ${phone || data.get('email')}.`,
      caseDescription
    ].filter(Boolean).join('\n\n');
    submitButton.disabled = true;
    showFeedback('pending', 'Enviando…');

    try {
      await emailClient.send(emailConfig.service, emailConfig.template, {
        from_name: name,
        from_email: data.get('email') ?? '',
        phone,
        area: subject,
        message
      }, { publicKey: emailConfig.publicKey });

      form.reset();
      updateReturnFields();
      showFeedback('success', `Mensagem enviada. O retorno será por ${returnChannel}.`);
    } catch {
      showFeedback('error', 'Não foi possível enviar. Seus dados continuam no formulário para você tentar novamente.');
    } finally {
      submitButton.disabled = false;
    }
  });

  form.elements.nome.addEventListener('input', (event) => {
    event.target.setCustomValidity('');
  });

  telefone.addEventListener('input', () => telefone.setCustomValidity(''));
})();
