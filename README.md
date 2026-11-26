# Site do Dr. Mateus Souza

Site institucional estático em HTML, CSS e JavaScript. Abra `index.html` no navegador para visualizar a página. Não há etapa de instalação ou compilação.

## Estrutura

- `index.html` contém o conteúdo, as seções e os links de contato.
- `assets/css/base.css` define a paleta, a tipografia e os estilos reutilizáveis.
- `assets/css/layout.css` concentra o cabeçalho, a abertura, os atalhos e o rodapé.
- `assets/css/sections.css` reúne os estilos das áreas de atuação, do perfil, do atendimento, das perguntas frequentes e do contato.
- `assets/js/navigation.js` controla o menu em telas pequenas.
- `assets/js/page-loader.js` exibe o emblema durante o carregamento inicial.
- `assets/js/contact-form.js` valida e envia o formulário e exibe o status do envio.
- `assets/images/` guarda as imagens do site.

O formulário usa o EmailJS. A configuração pública do serviço e do modelo fica em `assets/js/contact-form.js`. Para verificar o recebimento, teste o formulário a partir de um domínio autorizado na conta EmailJS.

