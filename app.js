(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const desktop = $('#desktop');
  const desktopIconLayer = $('#desktop-icon-layer');
  const boot = $('#boot-screen');
  const windowLayer = $('#window-layer');
  const taskButtons = $('#task-buttons');
  const startMenu = $('#start-menu');
  const contextLayer = $('#context-layer');
  const toast = $('#toast');
  let zIndex = 30;
  let toastTimer = null;
  let selectedShortcut = null;
  const iconPositionsKey = 'kpDesk95IconPositions_v2';
  const languageKey = 'kpDesk95Language_v1';
  let currentLanguage = 'fr';
  try { currentLanguage = localStorage.getItem(languageKey) === 'en' ? 'en' : 'fr'; } catch (_) {}
  const isEN = () => currentLanguage === 'en';
  let iconPositions = {};
  try { iconPositions = JSON.parse(localStorage.getItem(iconPositionsKey) || '{}') || {}; }
  catch (_) { iconPositions = {}; }
  let activeIconDrag = null;

  // Selected work is separated from skill folders. Source visibility is verified
  // against the current GitHub account and described per project.
  const projects = [
    {
      id: 'unyvon', key: 'unyvon', name: 'UNYVON', file: 'UNYVON.APP', title: 'UNYVON — Business OS',
      category: 'Produit web full-stack', subtitle: 'Un système de pilotage opérationnel pensé pour les PME africaines.',
      challenge: 'Rassembler ventes, stock, marges, encaissements et créances dans une expérience lisible pour les dirigeants de PME.',
      direction: 'Application web basée sur Next.js et React, avec Supabase pour les services de données. Le produit met en avant les alertes et analyses NOVA.',
      outcome: 'Un produit web de gestion pour les PME, publié en ligne avec son dépôt de code désormais public.',
      image: 'assets/projects/kp-unyvon.svg', kind: 'project', stage: 'En production · dépôt public',
      copy: 'UNYVON est un outil de pilotage opérationnel conçu pour aider les PME à suivre ventes, stocks, clients, marges, encaissements et créances, avec un espace d’analyse et d’alertes nommé NOVA.\n\nLe produit est consultable en production et son code source est maintenant public sur GitHub. Tu peux explorer le produit en ligne ou consulter directement le dépôt.',
      tags: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'Tailwind CSS 4'],
      links: [{label:'Voir le produit en production',url:'https://unyvon.vercel.app'},{label:'Voir le dépôt GitHub',url:'https://github.com/KennethKpn/UNYVON'},{label:'Profil GitHub',url:'https://github.com/KennethKpn'}]
    },
    {
      id: 'kaza', key: 'kaza', name: 'KAZA', file: 'KAZA.APP', title: 'KAZA — PropTech locative',
      category: 'Produit immobilier · Bénin', subtitle: 'Une expérience digitale pour rechercher, publier et gérer des logements.',
      challenge: 'Rendre la recherche immobilière plus claire et plus sûre, tout en simplifiant la relation entre locataires et bailleurs.',
      direction: 'Un produit web full-stack qui associe recherche géolocalisée, comptes par rôle, messagerie, paiements et outils de gestion locative.',
      outcome: 'Une plateforme en développement qui couvre le parcours immobilier, du repérage d’un logement au suivi locatif.',
      image: 'assets/projects/kp-kaza.svg', kind: 'project', stage: 'En développement · code source privé',
      copy: 'KAZA est une marketplace immobilière pensée pour le marché béninois. Le produit rassemble recherche de logements, publication d’annonces, échanges entre utilisateurs et outils de suivi locatif.\n\nLe périmètre technique documenté inclut Next.js, TypeScript, Supabase, PostgreSQL/PostGIS, la recherche géographique, les paiements Mobile Money via FedaPay et la génération de quittances. Le dépôt est privé ; l’aperçu du produit reste accessible séparément.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL / PostGIS', 'FedaPay · Mobile Money'],
      links: [{label:'Ouvrir l’aperçu',url:'https://kaza-web-chi.vercel.app'},{label:'Profil GitHub',url:'https://github.com/KennethKpn'}]
    },
    {
      id: 'marsal', key: 'marsal', name: 'Marsal Tech', file: 'MARSAL.APP', title: 'Marsal Technologies — sécurité & domotique',
      category: 'Site vitrine · Catalogue digital', subtitle: 'Une présence web pour un spécialiste des équipements de sécurité et des technologies intelligentes.',
      challenge: 'Présenter clairement plusieurs familles d’équipements et aider les particuliers comme les professionnels à identifier la bonne solution.',
      direction: 'Une vitrine multi-pages avec catalogue par univers, fiches produits, appels à l’action et parcours de demande de devis.',
      outcome: 'Un site structuré autour de la sécurité électronique, du contrôle d’accès, de la vidéosurveillance et de la domotique.',
      image: 'assets/projects/kp-marsal.svg', kind: 'project', stage: 'Site publié · dépôt public historique',
      copy: 'Le projet Marsal présente des solutions de sécurité électronique et de domotique au Bénin : serrures intelligentes, vidéosurveillance, interphones, contrôle d’accès, équipements solaires et maison connectée.\n\nLe site organise l’offre en catégories et met en avant le conseil, l’installation, la maintenance et la demande de devis. Le dépôt public MARSAL-THECNOLOGIE est une version associée plus ancienne ; il ne faut pas le confondre avec la source du site actuellement publié.',
      tags: ['React', 'Vite', 'JavaScript / TypeScript', 'Tailwind CSS', 'Framer Motion'],
      links: [{label:'Voir le site',url:'https://marsal-refont.vercel.app'},{label:'Dépôt public',url:'https://github.com/KennethKpn/MARSAL-THECNOLOGIE'}]
    },
    {
      id: 'eyram', key: 'eyram', name: 'E’YRAM Business', file: 'EYRAM.APP', title: 'E’YRAM Business — boutique digitale',
      category: 'Commerce · Site e-commerce', subtitle: 'Une vitrine élégante pour des collections de tissus, bijoux et accessoires.',
      challenge: 'Transformer une offre de boutique physique en une expérience web mobile, claire et facile à parcourir.',
      direction: 'Un catalogue responsive, une direction visuelle soignée, des contenus optimisés pour le référencement et un parcours de commande orienté WhatsApp.',
      outcome: 'Une présence commerciale en ligne pensée pour présenter les collections et faciliter les demandes et commandes.',
      image: 'assets/projects/kp-eyram.svg', kind: 'project', stage: 'Dépôt public · site publié',
      copy: 'E’YRAM Business met en valeur des tissus, des bijoux et des accessoires à Cotonou. Le dépôt décrit une page vitrine responsive avec catalogue, panier WhatsApp et éléments SEO.\n\nLe travail de conception cherche à faire ressortir les produits et à raccourcir le passage de la découverte à la prise de contact.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive design', 'SEO', 'WhatsApp ordering'],
      links: [{label:'Voir le site',url:'https://eyframbusiness.vercel.app/'},{label:'Dépôt public',url:'https://github.com/KennethKpn/E_YFRAM_BUSINESS'}]
    },
    {
      id: 'orca', key: 'orca', name: 'ORCA DECO', file: 'ORCA.APP', title: 'ORCA DECO — boutique maison',
      category: 'Commerce · Catalogue produits', subtitle: 'Une boutique en ligne de meubles et d’articles de décoration moderne.',
      challenge: 'Donner aux visiteurs une vue claire des univers produits et faciliter la prise de contact pour une commande locale.',
      direction: 'Un site multi-pages avec catalogue, catégories, pages de présentation et points de contact pour les zones desservies.',
      outcome: 'Une expérience de découverte et de commande de mobilier et décoration, pensée pour Abomey-Calavi et Cotonou.',
      image: 'assets/projects/kp-orca.svg', kind: 'project', stage: 'Dépôt public · site publié',
      copy: 'ORCA DECO présente une sélection de meubles et d’objets de décoration pour la maison. Le site met en place un catalogue, des entrées par catégories, des pages de présentation et des contacts pour la livraison locale.\n\nLe dépôt public associé contient plusieurs pages dédiées aux produits, au catalogue, à la présentation de l’enseigne et au contact.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive design', 'Catalogue produits'],
      links: [{label:'Voir la boutique',url:'https://orcadecobenin.com/'},{label:'Dépôt public',url:'https://github.com/KennethKpn/ORCA-DECO'}]
    },
    {
      id: 'iconlabs-brief', key: 'iconlabs', name: 'Iconlabs', file: 'ICONLABS.TXT', title: 'Iconlabs — Digital Studio',
      category: 'Agence digitale / co-fondation', subtitle: 'Une agence de création web et d’automatisation.',
      challenge: 'Aider les marques et les organisations à transformer leurs besoins en outils numériques simples et utiles.',
      direction: 'Associer conception d’interfaces, développement web et automatisation de tâches pour livrer des expériences cohérentes.',
      outcome: 'Un studio cofondé par Kenneth, positionné sur la création de sites web, d’interfaces et l’automatisation.',
      image: 'assets/projects/kp-iconlabs.svg', kind: 'project', stage: 'Studio cofondé · site public',
      copy: 'Iconlabs est le studio digital que Kenneth a cofondé. Son offre associe conception UI/UX, création de sites web, développement de solutions numériques et automatisation.\n\nLe site du studio présente les services, les réalisations, les modalités de contact et plusieurs pages de présentation.',
      tags: ['Co-founder', 'UI / UX', 'Web development', 'Digital strategy', 'Automation'],
      links: [{label:'Visiter Iconlabs',url:'https://iconlabs-inky.vercel.app'},{label:'Dépôt public',url:'https://github.com/KennethKpn/Iconlabs'}]
    },
    {
      id: 'uiux', key: 'uiux', name: 'UI / UX Design', file: 'UI_UX.PSD', kind: 'capability', title: 'UI / UX Design',
      category: 'Conception d’expérience', subtitle: 'Des interfaces pensées pour être claires, cohérentes et agréables à utiliser.',
      challenge: 'Comprendre les besoins réels avant de choisir une structure d’écran ou un style visuel.',
      direction: 'Travailler la hiérarchie, les parcours, les états d’interface, la lisibilité et l’adaptation aux écrans.',
      outcome: 'Une approche qui relie esthétique, compréhension et facilité d’usage.',
      image: 'assets/projects/kp-uiux.svg',
      copy: 'Kenneth s’intéresse autant à l’apparence d’une interface qu’à la logique qui la rend facile à comprendre. Il travaille le parcours, la hiérarchie visuelle et la cohérence des composants.',
      tags: ['UI design', 'UX thinking', 'Responsive design', 'Prototyping']
    },
    {
      id: 'frontend', key: 'frontend', name: 'Frontend', file: 'FRONTEND.TXT', kind: 'capability', title: 'Frontend Development',
      category: 'Développement web', subtitle: 'Transformer une maquette ou une idée en interface réactive.',
      challenge: 'Créer des interfaces fidèles, accessibles et confortables sur ordinateur comme sur mobile.',
      direction: 'HTML, CSS, JavaScript, React, TypeScript et Tailwind CSS selon les besoins du projet.',
      outcome: 'Des expériences web structurées, responsive et interactives.',
      image: 'assets/projects/kp-frontend.svg',
      copy: 'Le développement frontend est le point de rencontre entre le design UI/UX et le fonctionnement de l’application : composants, interactions, responsive et états d’interface.',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS']
    },
    {
      id: 'backend', key: 'backend', name: 'Backend', file: 'BACKEND.TXT', kind: 'capability', title: 'Backend Development',
      category: 'Logique applicative', subtitle: 'Construire la partie qui fait fonctionner le produit.',
      challenge: 'Relier les interfaces aux données, aux règles métier et aux services externes.',
      direction: 'Explorer et utiliser Node.js, PHP, Java et Python, avec des services de données comme Supabase.',
      outcome: 'Une vision full-stack qui prend en compte les échanges entre interface, logique et données.',
      image: 'assets/projects/kp-backend.svg',
      copy: 'Kenneth développe ses compétences sur plusieurs langages et environnements backend. Les technologies sont présentées comme son stack de travail et d’apprentissage, sans revendiquer un niveau uniforme sur chacune.',
      tags: ['Node.js', 'PHP', 'Java', 'Python', 'Supabase']
    },
    {
      id: 'automation', key: 'automation', name: 'Automation', file: 'AUTOMATION.TXT', kind: 'capability', title: 'Workflow Automation',
      category: 'Automatisation', subtitle: 'Réduire les tâches répétitives et fluidifier le travail.',
      challenge: 'Identifier les étapes manuelles qui ralentissent une activité ou créent des erreurs.',
      direction: 'Concevoir des workflows simples, connecter les outils et clarifier les déclencheurs et résultats.',
      outcome: 'Un axe de service porté par Iconlabs : rendre les processus plus fluides grâce au numérique.',
      image: 'assets/projects/kp-automation.svg',
      copy: 'L’automatisation fait partie de l’offre d’Iconlabs. L’objectif est pragmatique : faire gagner du temps, fiabiliser les opérations et éviter les doubles saisies lorsque c’est pertinent.',
      tags: ['Workflow design', 'Integrations', 'Process optimization']
    },
    {
      id: 'mobile', key: 'mobile', name: 'App Development', file: 'APPS.TXT', kind: 'capability', title: 'Web & App Development',
      category: 'Applications', subtitle: 'Penser les produits au-delà d’une seule taille d’écran.',
      challenge: 'Faire en sorte que les fonctions essentielles restent compréhensibles sur petit écran.',
      direction: 'Concevoir des interfaces adaptatives et organiser les fonctionnalités selon le contexte d’usage.',
      outcome: 'Une pratique orientée web et applications, avec une attention particulière à l’expérience utilisateur.',
      image: 'assets/projects/kp-mobile.svg',
      copy: 'Kenneth se présente comme développeur web et app full-stack. Cette rubrique rassemble cet intérêt pour les produits numériques utilisables aussi bien sur ordinateur que sur smartphone.',
      tags: ['Responsive UI', 'Web apps', 'App interfaces']
    },
    {
      id: 'stack', key: 'stack', name: 'Tech Stack', file: 'STACK.TXT', kind: 'capability', title: 'Tools & Technologies',
      category: 'Compétences techniques', subtitle: 'Un éventail de langages et d’outils mobilisés selon le projet.',
      challenge: 'Choisir une technologie adaptée au problème plutôt que multiplier les outils sans raison.',
      direction: 'Combiner fondamentaux du web, frameworks frontend, langages généralistes et services backend.',
      outcome: 'Une base technique variée, en évolution continue.',
      image: 'assets/projects/kp-stack.svg',
      copy: 'Stack déclaré : HTML, CSS, JavaScript, TypeScript, React, Tailwind CSS, Node.js, PHP, Java, Python et Supabase. Le dépôt UNYVON confirme notamment Next.js, React, TypeScript, Supabase et Tailwind CSS.',
      tags: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind', 'Node.js', 'PHP', 'Java', 'Python', 'Supabase']
    },
    {
      id: 'studies', key: 'studies', name: 'Education', file: 'STUDIES.TXT', kind: 'capability', title: 'Education — ESGIS Bénin',
      category: 'Formation', subtitle: 'Études supérieures en cours depuis 2025.',
      challenge: 'Construire progressivement des bases solides en informatique et en conception de solutions numériques.',
      direction: 'Formation à ESGIS Bénin, commencée en 2025, avec une licence prévue en 2028.',
      outcome: 'Un parcours académique mené en parallèle de projets personnels et d’activités entrepreneuriales.',
      image: 'assets/projects/kp-studies.svg',
      copy: 'Kenneth est en formation à ESGIS Bénin depuis 2025 et prévoit d’obtenir sa licence en 2028.',
      tags: ['ESGIS Bénin', '2025 — 2028', 'Licence prévue en 2028']
    },
    {
      id: 'contact-card', key: 'contact', name: 'Contact', file: 'CONTACT.TXT', kind: 'capability', title: 'Let’s connect',
      category: 'Contact professionnel', subtitle: 'Pour parler d’un projet, d’une collaboration ou d’une idée.',
      challenge: 'Faire passer une idée du message à une vraie conversation.',
      direction: 'Email, WhatsApp, Telegram et réseaux professionnels sont ouverts depuis cette archive.',
      outcome: 'Un point de contact direct pour les collaborations et les demandes de projets.',
      image: 'assets/projects/kp-contact.svg',
      copy: 'Retrouvez les coordonnées de Kenneth dans la fenêtre Contact ou utilisez les liens directs ci-dessous.',
      tags: ['Email', 'WhatsApp', 'Telegram', 'LinkedIn']
    }
  ];

  const projectEnglish = {
    unyvon: { category:'Full-stack web product', subtitle:'An operational management system designed for African SMEs.', challenge:'Bring sales, stock, margins, collections and receivables together in a clear experience for SME decision-makers.', direction:'A Next.js and React web application using Supabase for data services, with NOVA alerts and analytics.', outcome:'A business management product for SMEs, available in production with its source code now public.', stage:'In production · public repository', copy:'UNYVON is an operational management tool designed to help SMEs track sales, inventory, customers, margins, collections and receivables, with a dedicated analysis and alerts area called NOVA.\n\nThe product is available in production and its source code is public on GitHub. You can explore the live product or inspect the repository directly.', links:['View live product','View GitHub repository','GitHub profile'] },
    kaza: { category:'Real-estate product · Benin', subtitle:'A digital experience for finding, publishing and managing housing.', challenge:'Make property search clearer and safer while simplifying the relationship between tenants and landlords.', direction:'A full-stack web product combining geolocated search, role-based accounts, messaging, payments and rental management tools.', outcome:'A platform in development covering the housing journey, from finding a property to rental follow-up.', stage:'In development · private source', copy:'KAZA is a property marketplace designed for the Beninese market. It brings together property search, listings, user communication and rental management tools.\n\nThe documented technical scope includes Next.js, TypeScript, Supabase, PostgreSQL/PostGIS, geographic search, FedaPay Mobile Money payments and receipt generation. The repository is private; a separate product preview remains available.', links:['Open preview','GitHub profile'] },
    marsal: { category:'Showcase website · Digital catalogue', subtitle:'A web presence for a specialist in security equipment and smart technologies.', challenge:'Present several equipment families clearly and help both individuals and professionals identify the right solution.', direction:'A multi-page showcase with catalogue sections, product pages, calls to action and quote-request paths.', outcome:'A site structured around electronic security, access control, video surveillance and smart-home technology.', stage:'Published site · historical public repository', copy:'The Marsal project presents electronic security and smart-home solutions in Benin: smart locks, video surveillance, intercoms, access control, solar equipment and connected-home products.\n\nThe site organizes the offer by category and highlights advice, installation, maintenance and quote requests. The public MARSAL-THECNOLOGIE repository is an older associated version and should not be confused with the source of the currently published site.', links:['View site','Public repository'] },
    eyram: { category:'Commerce · E-commerce website', subtitle:'An elegant storefront for fabrics, jewellery and accessories.', challenge:'Turn a physical retail offer into a clear, mobile-friendly web experience that is easy to browse.', direction:'A responsive catalogue, polished visual direction, SEO-oriented content and a WhatsApp-first ordering path.', outcome:'An online commercial presence designed to showcase collections and make enquiries and orders easier.', stage:'Public repository · published site', copy:'E’YRAM Business showcases fabrics, jewellery and accessories in Cotonou. The repository describes a responsive storefront with catalogue, WhatsApp cart and SEO elements.\n\nThe design work focuses on making products stand out and shortening the path from discovery to contact.', links:['View site','Public repository'] },
    orca: { category:'Commerce · Product catalogue', subtitle:'An online shop for furniture and modern home decor.', challenge:'Give visitors a clear view of product collections and make local ordering enquiries easy.', direction:'A multi-page site with catalogue, categories, presentation pages and contact points for served areas.', outcome:'A furniture and home-decor discovery and ordering experience designed for Abomey-Calavi and Cotonou.', stage:'Public repository · published site', copy:'ORCA DECO presents a selection of furniture and home-decor products. The site provides a catalogue, category entry points, presentation pages and contacts for local delivery.\n\nThe public repository contains product, catalogue, brand presentation and contact pages.', links:['View shop','Public repository'] },
    'iconlabs-brief': { category:'Digital agency / co-founded studio', subtitle:'A studio for web creation and automation.', challenge:'Help brands and organisations turn their needs into simple, useful digital tools.', direction:'Combine interface design, web development and workflow automation to deliver coherent digital experiences.', outcome:'A studio co-founded by Kenneth, focused on websites, interfaces and automation.', stage:'Co-founded studio · public website', copy:'Iconlabs is the digital studio co-founded by Kenneth. Its offer combines UI/UX design, website creation, digital solution development and automation.\n\nThe studio website presents services, work, contact options and several presentation pages.', links:['Visit Iconlabs','Public repository'] }
  };
  function localProject(p) {
    if (!isEN()) return p;
    const e = projectEnglish[p.id];
    if (!e) return p;
    const linkMap = new Map((p.links||[]).map((l,i)=>[i,l]));
    return {...p, ...e, links:(e.links||[]).map((label,i)=>({...(linkMap.get(i)||{}),label}))};
  }

  const apps = [
    { id: 'photoshop', name: 'Design Lab', short: 'Design Lab', icon: '🎨', kind: 'app' },
    { id: 'computer', name: 'My Computer', short: 'My Computer', icon: '🖥️', kind: 'app' },
    { id: 'about', name: 'About Kenneth', short: 'About', icon: '🗒️', kind: 'app' },
    { id: 'contact', name: 'Contact', short: 'Contact', icon: '✉️', kind: 'app' },
    { id: 'github', name: 'GitHub', short: 'GitHub', icon: '🐙', kind: 'app' }
  ];
  const windowTitles = {
    about: 'Kenneth.txt - Notepad', computer: 'My Computer', photoshop: 'Design Lab', inbox: 'Contact / Inbox',
    projects: 'C:\\Portfolio', settings: 'Display Properties', shutdown: 'Shut Down Windows',
    iconlabs: 'Iconlabs — Studio', skills: 'Skills.txt - Notepad', education: 'Education.txt - Notepad',
    contact: 'Contact.txt - Notepad', github: 'GitHub — KennethKpn'
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function iconPath(project) { return project.image; }

  function handleDesktopIconPointerMove(event) {
    const drag = activeIconDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    drag.button.classList.add('is-dragging');
    const bounds = desktopIconLayer.getBoundingClientRect();
    const maxLeft = Math.max(0, bounds.width - drag.button.offsetWidth);
    const maxTop = Math.max(0, bounds.height - drag.button.offsetHeight);
    const left = Math.max(0, Math.min(maxLeft, event.clientX - bounds.left - drag.offsetX));
    const top = Math.max(0, Math.min(maxTop, event.clientY - bounds.top - drag.offsetY));
    drag.button.style.left = `${left}px`;
    drag.button.style.top = `${top}px`;
  }

  function finishDesktopIconPointer(event) {
    const drag = activeIconDrag;
    if (!drag || (event && drag.pointerId !== event.pointerId)) return;
    if (drag.moved) {
      const button = drag.button;
      const id = button.dataset.shortcut;
      const name = $('.shortcut-label', button)?.textContent || id;
      const x = Math.round(parseFloat(button.style.left) || 0);
      const y = Math.round(parseFloat(button.style.top) || 0);
      const bounds = desktopIconLayer.getBoundingClientRect();
      const maxLeft = Math.max(0, bounds.width - button.offsetWidth);
      const maxTop = Math.max(0, bounds.height - button.offsetHeight);
      iconPositions[id] = { x, y, xRatio: maxLeft ? x / maxLeft : 0, yRatio: maxTop ? y / maxTop : 0 };
      try { localStorage.setItem(iconPositionsKey, JSON.stringify(iconPositions)); } catch (_) {}
      button.dataset.dragMoved = 'true';
      button.classList.remove('is-dragging');
      setTimeout(() => { delete button.dataset.dragMoved; }, 450);
      showToast(`${name} déplacé · position mémorisée`);
    }
    activeIconDrag = null;
  }

  function createShortcut({ id, name, icon, image, type = 'app' }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `shortcut ${type === 'app' ? 'app-shortcut' : 'project-shortcut'}`;
    button.dataset.shortcut = id;
    button.dataset.shortcutType = type;
    button.setAttribute('aria-label', `${name}, double-click to open; drag to move`);
    button.title = 'Faire glisser pour déplacer · Double-cliquer pour ouvrir';
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = '';
      img.draggable = false;
      button.append(img);
    } else {
      const glyph = document.createElement('span');
      glyph.className = 'shortcut-icon';
      glyph.textContent = icon;
      button.append(glyph);
    }
    const label = document.createElement('span');
    label.className = 'shortcut-label';
    label.textContent = name;
    button.append(label);

    // Drag on mouse, pen or touch. Disable the browser's native image drag so it does not cancel Pointer Events.
    button.addEventListener('dragstart', (event) => event.preventDefault());
    button.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.target.closest('a')) return;
      const layerRect = desktopIconLayer.getBoundingClientRect();
      const rect = button.getBoundingClientRect();
      activeIconDrag = {
        button, pointerId: event.pointerId,
        startX: event.clientX, startY: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        layerRect, moved: false
      };
      // No explicit pointer capture: document-level tracking continues when the icon leaves its original hit area.
    });
    // Movement/up are handled at document level so dragging keeps working after the icon leaves its original hit area.
    // A drag should not be interpreted as a tap/click that opens the item.
    button.addEventListener('click', (event) => {
      if (button.dataset.dragMoved === 'true') {
        event.preventDefault();
        event.stopImmediatePropagation();
        delete button.dataset.dragMoved;
      }
    }, true);

    let lastTap = 0;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      selectShortcut(button);
      if (window.matchMedia('(max-width: 700px)').matches) {
        const now = Date.now();
        if (now - lastTap < 500) openTarget(id);
        else showToast(`${name} — appuyez deux fois pour ouvrir`);
        lastTap = now;
      }
    });
    button.addEventListener('dblclick', (event) => {
      event.preventDefault();
      openTarget(id);
    });
    button.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      selectShortcut(button);
      showShortcutMenu(event.clientX, event.clientY, id, name);
    });
    return button;
  }

  function selectShortcut(button) {
    $$('.shortcut.selected').forEach(el => el.classList.remove('selected'));
    button.classList.add('selected');
    selectedShortcut = button.dataset.shortcut;
  }

  projects.forEach(p => $('#project-shortcuts').append(createShortcut({ id: p.id, name: p.file, image: iconPath(p), type: 'project' })));
  apps.forEach(a => $('#app-shortcuts').append(createShortcut({ id: a.id, name: a.name, icon: a.icon, type: 'app' })));
  document.addEventListener('pointermove', handleDesktopIconPointerMove, { capture: true, passive: false });
  document.addEventListener('pointerup', finishDesktopIconPointer, true);
  document.addEventListener('pointercancel', finishDesktopIconPointer, true);

  function layoutDesktopIcons(reset = false) {
    if (!desktopIconLayer) return;
    const bounds = desktopIconLayer.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const width = bounds.width;
    const height = bounds.height;
    const mobile = window.innerWidth <= 700;
    const compact = window.innerWidth <= 1050;
    const shortLandscape = mobile && window.innerHeight <= 500;
    const projectButtons = $$('.project-shortcut', desktopIconLayer);
    const appButtons = $$('.app-shortcut', desktopIconLayer);
    const columns = shortLandscape ? 5 : 4;
    projectButtons.forEach((button, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      let x, y;
      if (mobile) {
        const cell = width / columns;
        x = Math.max(4, Math.round((cell - button.offsetWidth) / 2 + col * cell));
        y = 24 + row * (shortLandscape ? 65 : 78);
      } else if (compact) {
        x = 16 + col * 101;
        y = 20 + row * 110;
      } else {
        x = 34 + col * 136;
        y = 20 + row * 121;
      }
      const maxLeft = Math.max(0, width - button.offsetWidth);
      const maxTop = Math.max(0, height - button.offsetHeight);
      const saved = !reset && iconPositions[button.dataset.shortcut] && button.dataset.shortcut !== 'about';
      if (saved) {
        if (Number.isFinite(saved.xRatio) && Number.isFinite(saved.yRatio)) {
          x = saved.xRatio * maxLeft;
          y = saved.yRatio * maxTop;
        } else if (Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          x = saved.x;
          y = saved.y;
          saved.xRatio = maxLeft ? Math.max(0, Math.min(maxLeft, x)) / maxLeft : 0;
          saved.yRatio = maxTop ? Math.max(0, Math.min(maxTop, y)) / maxTop : 0;
        }
      }
      x = Math.max(0, Math.min(maxLeft, x));
      y = Math.max(0, Math.min(maxTop, y));
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
    });
    appButtons.forEach((button, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      let x, y;
      if (mobile) {
        const cell = width / Math.max(appButtons.length, 1);
        const fittedWidth = Math.max(48, Math.min(78, cell - 4));
        button.style.width = `${fittedWidth}px`;
        x = Math.max(2, Math.round((cell - fittedWidth) / 2 + index * cell));
        y = Math.max(20, height - button.offsetHeight - 7);
      } else if (button.dataset.shortcut === 'about') {
        // The video rabbit points here: keep About Kenneth in the visual centre-right target zone.
        x = Math.round(width * 0.55 - button.offsetWidth / 2);
        y = Math.round(height * 0.43);
      } else if (compact) {
        button.style.width = '';
        x = width - 190 + col * 86;
        y = 18 + row * 95;
      } else {
        button.style.width = '';
        x = width - 220 + col * 100;
        y = 18 + row * 104;
      }
      const maxLeft = Math.max(0, width - button.offsetWidth);
      const maxTop = Math.max(0, height - button.offsetHeight);
      const saved = !reset && iconPositions[button.dataset.shortcut] && button.dataset.shortcut !== 'about';
      if (saved) {
        if (Number.isFinite(saved.xRatio) && Number.isFinite(saved.yRatio)) {
          x = saved.xRatio * maxLeft;
          y = saved.yRatio * maxTop;
        } else if (Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          x = saved.x;
          y = saved.y;
          saved.xRatio = maxLeft ? Math.max(0, Math.min(maxLeft, x)) / maxLeft : 0;
          saved.yRatio = maxTop ? Math.max(0, Math.min(maxTop, y)) / maxTop : 0;
        }
      }
      x = Math.max(0, Math.min(maxLeft, x));
      y = Math.max(0, Math.min(maxTop, y));
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
    });
    if (reset) {
      iconPositions = {};
      try { localStorage.removeItem(iconPositionsKey); } catch (_) {}
      showToast('Les icônes ont retrouvé leur disposition d’origine.');
    } else {
      try { localStorage.setItem(iconPositionsKey, JSON.stringify(iconPositions)); } catch (_) {}
    }
  }
  function adaptOpenWindows() {
    if (window.matchMedia('(max-width: 700px)').matches) return;
    const bounds = windowLayer.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    $$('.window', windowLayer).forEach(win => {
      if (win.classList.contains('is-maximized')) return;
      const baseWidth = Number(win.dataset.preferredWidth) || 630;
      const baseHeight = Number(win.dataset.preferredHeight) || 460;
      const width = Math.min(baseWidth, Math.max(260, bounds.width - 12));
      const height = Math.min(baseHeight, Math.max(190, bounds.height - 12));
      const left = Math.max(4, Math.min(bounds.width - width - 4, parseFloat(win.style.left) || 4));
      const top = Math.max(4, Math.min(bounds.height - height - 4, parseFloat(win.style.top) || 4));
      win.style.width = `${width}px`;
      win.style.height = `${height}px`;
      win.style.left = `${left}px`;
      win.style.top = `${top}px`;
    });
  }
  let layoutFrame = 0;
  function scheduleViewportLayout() {
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      layoutDesktopIcons();
      adaptOpenWindows();
    });
  }
  layoutDesktopIcons();
  window.addEventListener('resize', scheduleViewportLayout, { passive: true });
  window.visualViewport?.addEventListener('resize', scheduleViewportLayout, { passive: true });
  if ('ResizeObserver' in window) {
    const viewportObserver = new ResizeObserver(scheduleViewportLayout);
    viewportObserver.observe(desktopIconLayer);
    viewportObserver.observe(windowLayer);
  }

  function aboutContent() {
    if (isEN()) return `<div class="about-body"><article class="about-paper"><div class="about-marquee">WELCOME TO KPANOU KENNETH’S DESKTOP · FULL-STACK DEVELOPER · UI / UX DESIGNER · BENIN</div><h2 class="about-heading">KPANOU Kenneth’s Digital Corner</h2><div class="about-photo-frame"><img class="about-portrait zoomable" src="assets/photos/kenneth-about.jpg" alt="Portrait of Kenneth on a red background" data-zoom="assets/photos/kenneth-about.jpg"></div><div class="about-caption">♥ that’s me!! — KP ♥</div><p class="about-intro">Hello, welcome to my digital corner! I’m Kenneth: a full-stack web & app developer and UI/UX designer. I like turning ideas into useful, polished and easy-to-use digital experiences.</p><div class="cv-download-panel"><div><strong>My résumé</strong><small>PDF · 1 page · French version</small></div><a class="old-link cv-download-button" href="assets/documents/CV-Yisse-Kpanou.pdf" download="CV-Yisse-Kpanou.pdf" type="application/pdf">↓ Download my CV (PDF)</a></div><p class="visitor-counter">studio tag &nbsp;<span>KP / DESIGN × CODE</span></p><div class="about-section">▶ THE BASICS</div><div class="about-facts"><b>Name:</b><span>KPANOU Kenneth</span><b>Base:</b><span>Benin</span><b>Role:</b><span>Full-stack web & app developer · UI/UX designer</span><b>Studio:</b><span>Co-founder at Iconlabs</span><b>School:</b><span>ESGIS Benin · 2025–2028</span></div><div class="about-section">▶ WHAT I DO</div><p>I design interfaces, build web applications and work on process automation. My approach connects design, technology and a clear understanding of the need.</p><div class="about-links"><button class="old-link" data-action="skills">My skills</button><button class="old-link" data-action="iconlabs">Iconlabs Studio</button><button class="old-link" data-action="education">My education</button><button class="old-link" data-action="contact">Contact me</button><button class="old-link" data-action="github">GitHub / projects</button></div><p style="text-align:center;margin-top:18px;font-size:10px">built with curiosity · powered by coffee + code ♥</p></article></div>`;
    return `<div class="about-body"><article class="about-paper"><div class="about-marquee">BIENVENUE SUR LE BUREAU DE KPANOU KENNETH · DÉVELOPPEUR FULL-STACK · DESIGNER UI / UX · BÉNIN</div><h2 class="about-heading">Le coin numérique de KPANOU Kenneth</h2><div class="about-photo-frame"><img class="about-portrait zoomable" src="assets/photos/kenneth-about.jpg" alt="Portrait de Kenneth sur fond rouge" data-zoom="assets/photos/kenneth-about.jpg"></div><div class="about-caption">♥ c’est moi !! — KP ♥</div><p class="about-intro">Bonjour, bienvenue dans mon petit espace numérique ! Je suis Kenneth : développeur web & app full-stack et designer UI/UX. J’aime transformer les idées en expériences digitales utiles, soignées et faciles à utiliser.</p><div class="cv-download-panel"><div><strong>Mon CV</strong><small>PDF · 1 page · version française</small></div><a class="old-link cv-download-button" href="assets/documents/CV-Yisse-Kpanou.pdf" download="CV-Yisse-Kpanou.pdf" type="application/pdf">↓ Télécharger mon CV (PDF)</a></div><p class="visitor-counter">studio tag &nbsp;<span>KP / DESIGN × CODE</span></p><div class="about-section">▶ L’ESSENTIEL</div><div class="about-facts"><b>Nom :</b><span>KPANOU Kenneth</span><b>Base :</b><span>Bénin</span><b>Rôle :</b><span>Développeur web & app full-stack · designer UI/UX</span><b>Studio :</b><span>Cofondateur d’Iconlabs</span><b>École :</b><span>ESGIS Bénin · 2025–2028</span></div><div class="about-section">▶ CE QUE JE FAIS</div><p>Je conçois des interfaces, développe des applications web et travaille sur l’automatisation de processus. Mon approche relie design, technique et compréhension du besoin.</p><div class="about-links"><button class="old-link" data-action="skills">Mes compétences</button><button class="old-link" data-action="iconlabs">Studio Iconlabs</button><button class="old-link" data-action="education">Ma formation</button><button class="old-link" data-action="contact">Me contacter</button><button class="old-link" data-action="github">GitHub / projets</button></div><p style="text-align:center;margin-top:18px;font-size:10px">built with curiosity · powered by coffee + code ♥</p></article></div>`;
  }

  function iconlabsContent() {
    if (isEN()) return `<div class="profile-page"><div class="profile-hero"><div class="profile-monogram">IL</div><div><p class="eyebrow">DIGITAL CREATIVE STUDIO</p><h2>Iconlabs</h2><p>Web creation & automation</p></div></div><p><strong>Iconlabs</strong> is the studio Kenneth co-founded. It helps brands and organisations with website creation and workflow automation.</p><p class="profile-actions"><a class="old-link" href="https://iconlabs-inky.vercel.app" target="_blank" rel="noopener">Visit the studio ↗</a><a class="old-link" href="https://github.com/KennethKpn/Iconlabs" target="_blank" rel="noopener">Public repository ↗</a></p><div class="profile-cards"><section><h3>01 / Web design & development</h3><p>Websites adapted to the identity, goals and users of each activity.</p></section><section><h3>02 / Automation</h3><p>Workflows that reduce repetitive tasks and make operations smoother.</p></section><section><h3>03 / Digital experience</h3><p>Attention to clarity, visual consistency and the mobile experience.</p></section></div><div class="profile-note">ROLE: CO-FOUNDER · FOCUS: WEB + AUTOMATION</div><p class="profile-actions"><button class="old-link" data-action="contact">Contact Kenneth</button></p></div>`;
    return `<div class="profile-page"><div class="profile-hero"><div class="profile-monogram">IL</div><div><p class="eyebrow">STUDIO CRÉATIF DIGITAL</p><h2>Iconlabs</h2><p>Création web & automatisation</p></div></div><p><strong>Iconlabs</strong> est l’agence que Kenneth a cofondée. Le studio accompagne les besoins numériques à travers la création de sites web et l’automatisation de tâches et de processus.</p><p class="profile-actions"><a class="old-link" href="https://iconlabs-inky.vercel.app" target="_blank" rel="noopener">Visiter le studio ↗</a><a class="old-link" href="https://github.com/KennethKpn/Iconlabs" target="_blank" rel="noopener">Dépôt public ↗</a></p><div class="profile-cards"><section><h3>01 / Web design & development</h3><p>Des sites web adaptés à l’identité, aux objectifs et aux utilisateurs de chaque activité.</p></section><section><h3>02 / Automation</h3><p>Des workflows qui réduisent les tâches répétitives et fluidifient les opérations.</p></section><section><h3>03 / Digital experience</h3><p>Une attention portée à la clarté, à la cohérence visuelle et à l’expérience sur mobile.</p></section></div><div class="profile-note">ROLE: CO-FOUNDER · FOCUS: WEB + AUTOMATION</div><p class="profile-actions"><button class="old-link" data-action="contact">Contacter Kenneth</button></p></div>`;
  }

  function skillsContent() {
    const groups = [['Frontend', ['HTML5','CSS3','JavaScript','TypeScript','React','Next.js','Tailwind CSS']],['Backend & languages', ['Node.js','PHP','Java','Python']],['Data & services', ['Supabase']],['Design', ['UI Design','UX Design','Responsive Design','Prototyping']],['Other', ['Git & GitHub']]];
    if (isEN()) return `<div class="profile-page"><p class="eyebrow">TECHNICAL TOOLBOX</p><h2>Skills & Technologies</h2><p>The tools I use or explore depending on the project context. My depth of practice can vary from one technology to another.</p><div class="skill-groups">${groups.map(([name,items])=>`<section class="skill-group"><h3>${name}</h3><div class="skill-tags">${items.map(item=>`<span>${item}</span>`).join('')}</div></section>`).join('')}</div><div class="profile-note">LEARNING BY BUILDING · DESIGN × CODE</div></div>`;
    return `<div class="profile-page"><p class="eyebrow">BOÎTE À OUTILS TECHNIQUE</p><h2>Compétences & technologies</h2><p>Les outils que j’utilise ou que j’explore selon le contexte du projet. La profondeur de pratique peut varier d’une technologie à l’autre.</p><div class="skill-groups">${groups.map(([name,items])=>`<section class="skill-group"><h3>${name}</h3><div class="skill-tags">${items.map(item=>`<span>${item}</span>`).join('')}</div></section>`).join('')}</div><div class="profile-note">LEARNING BY BUILDING · DESIGN × CODE</div></div>`;
  }

  function educationContent() {
    if (isEN()) return `<div class="profile-page"><p class="eyebrow">ACADEMIC PATH</p><h2>Education</h2><div class="timeline"><div class="timeline-item"><span class="timeline-date">2025 — 2028</span><div><h3>ESGIS Benin</h3><p>Higher education in progress. Bachelor’s degree expected in 2028.</p><span class="status-chip">IN PROGRESS</span></div></div></div><div class="profile-note">BASE: BENIN</div></div>`;
    return `<div class="profile-page"><p class="eyebrow">PARCOURS ACADÉMIQUE</p><h2>Formation</h2><div class="timeline"><div class="timeline-item"><span class="timeline-date">2025 — 2028</span><div><h3>ESGIS Bénin</h3><p>Formation supérieure en cours. Licence prévue en 2028.</p><span class="status-chip">EN COURS</span></div></div></div><div class="profile-note">BASE : BÉNIN</div></div>`;
  }

  function contactContent() {
    if (isEN()) return `<div class="profile-page"><p class="eyebrow">OPEN FOR COLLABORATION</p><h2>Let’s build something.</h2><p>A website, an application, an interface to design or a process to automate? Get in touch.</p><div class="contact-list"><a href="mailto:kpanoukenneth125@gmail.com"><span>EMAIL · PRIMARY</span><strong>kpanoukenneth125@gmail.com</strong></a><a href="mailto:yissekpanou96@gmail.com"><span>EMAIL · ALTERNATIVE</span><strong>yissekpanou96@gmail.com</strong></a><a href="https://wa.me/2290158593692" target="_blank" rel="noopener"><span>WHATSAPP</span><strong>+229 0158593692</strong></a><a href="https://t.me/+2290153594279" target="_blank" rel="noopener"><span>TELEGRAM</span><strong>Open Telegram</strong></a><a href="https://www.instagram.com/kpnkenneth.studio/" target="_blank" rel="noopener"><span>INSTAGRAM</span><strong>@kpnkenneth.studio</strong></a><a href="https://www.linkedin.com/in/kenneth-kpanou-2a216a352" target="_blank" rel="noopener"><span>LINKEDIN</span><strong>kenneth-kpanou</strong></a><a href="https://github.com/KennethKpn" target="_blank" rel="noopener"><span>GITHUB · PROFILE</span><strong>github.com/KennethKpn</strong></a></div><p class="profile-note">RESPONSE MODE: HUMAN · NO BOT REQUIRED :)</p></div>`;
    return `<div class="profile-page"><p class="eyebrow">OUVERT AUX COLLABORATIONS</p><h2>Construisons quelque chose.</h2><p>Un projet web, une application, une interface à concevoir ou un processus à automatiser ? Écris-moi.</p><div class="contact-list"><a href="mailto:kpanoukenneth125@gmail.com"><span>EMAIL · PRINCIPAL</span><strong>kpanoukenneth125@gmail.com</strong></a><a href="mailto:yissekpanou96@gmail.com"><span>EMAIL · ALTERNATIF</span><strong>yissekpanou96@gmail.com</strong></a><a href="https://wa.me/2290158593692" target="_blank" rel="noopener"><span>WHATSAPP</span><strong>+229 0158593692</strong></a><a href="https://t.me/+2290153594279" target="_blank" rel="noopener"><span>TELEGRAM</span><strong>Ouvrir Telegram</strong></a><a href="https://www.instagram.com/kpnkenneth.studio/" target="_blank" rel="noopener"><span>INSTAGRAM</span><strong>@kpnkenneth.studio</strong></a><a href="https://www.linkedin.com/in/kenneth-kpanou-2a216a352" target="_blank" rel="noopener"><span>LINKEDIN</span><strong>kenneth-kpanou</strong></a><a href="https://github.com/KennethKpn" target="_blank" rel="noopener"><span>GITHUB · PROFIL</span><strong>github.com/KennethKpn</strong></a></div><p class="profile-note">MODE DE RÉPONSE : HUMAIN · AUCUN BOT NÉCESSAIRE :)</p></div>`;
  }

  const publicRepoHighlights = [
    { name:'UNYVON', description:'Business OS for SMEs: sales, inventory, margins, collections, receivables and NOVA analytics.', url:'https://github.com/KennethKpn/UNYVON', preview:'https://unyvon.vercel.app' },
    { name:'MARSAL-THECNOLOGIE', description:'Website and catalogue for electronic security, access control and smart-home solutions.', url:'https://github.com/KennethKpn/MARSAL-THECNOLOGIE', preview:'https://marsal-refont.vercel.app' },
    { name:'E_YFRAM_BUSINESS', description:'Cotonou storefront for fabrics, jewellery and accessories, with a WhatsApp ordering journey.', url:'https://github.com/KennethKpn/E_YFRAM_BUSINESS', preview:'https://eyframbusiness.vercel.app/' },
    { name:'ORCA-DECO', description:'Digital catalogue of furniture and home-decor products.', url:'https://github.com/KennethKpn/ORCA-DECO', preview:'https://orcadecobenin.com/' },
    { name:'Iconlabs', description:'Website for the digital studio co-founded by Kenneth: design, development and automation.', url:'https://github.com/KennethKpn/Iconlabs', preview:'https://iconlabs-inky.vercel.app' }
  ];

  function githubContent() {
    const repoCards = publicRepoHighlights.map(repo => `<article class="github-repo-card" data-repo-name="${escapeHTML(repo.name)}"><div class="github-repo-head"><a href="${escapeHTML(repo.url)}" target="_blank" rel="noopener">${escapeHTML(repo.name)}</a><span class="repo-language">Public</span></div><p>${escapeHTML(repo.description)}</p><small data-repo-meta>${isEN() ? 'Selected project · public repository' : 'Projet sélectionné · dépôt public'}</small><a class="repo-home-link" href="${escapeHTML(repo.preview)}" target="_blank" rel="noopener">${isEN() ? 'View live site ↗' : 'Voir le site ↗'}</a></article>`).join('');
    if (isEN()) return `<div class="profile-page github-page"><p class="eyebrow">DEVELOPER PROFILE / SELECTED WORK</p><h2>KennethKpn on GitHub</h2><p>My main GitHub account is <strong>@KennethKpn</strong>. This selection highlights the public repositories that best represent my work instead of mixing in every experiment, prototype and archive.</p><p class="profile-actions"><a class="old-link" href="https://github.com/KennethKpn" target="_blank" rel="noopener">Open my GitHub profile ↗</a></p><div class="profile-cards github-featured"><section><h3>UNYVON · Business OS</h3><p>A management product for SMEs: sales, inventory, margins, collections, receivables and NOVA analytics.</p><p class="repo-tech">Next.js · React · TypeScript · Supabase</p><span class="status-chip">In production · public repository</span><p class="profile-actions"><a class="old-link" href="https://unyvon.vercel.app" target="_blank" rel="noopener">View live product ↗</a><a class="old-link" href="https://github.com/KennethKpn/UNYVON" target="_blank" rel="noopener">View source ↗</a></p></section><section><h3>KAZA · PropTech</h3><p>A real-estate marketplace and rental-management tools in development for Benin.</p><p class="repo-tech">Next.js · TypeScript · Supabase · PostGIS · FedaPay</p><span class="status-chip private-source">In development · private source</span> <a class="old-link" href="https://kaza-web-chi.vercel.app" target="_blank" rel="noopener">Open preview ↗</a></section></div><div class="github-repos-heading"><h3>Selected public repositories</h3><button class="old-link" data-action="refresh-github" type="button">↻ Refresh</button></div><p class="github-status" data-github-status>Selection available; refreshing GitHub metadata…</p><div class="github-repo-list" data-github-repos>${repoCards}</div><p class="profile-note"><a href="https://github.com/KennethKpn?tab=repositories" target="_blank" rel="noopener">View all my GitHub repositories ↗</a> · KAZA is identified as a private-source project.</p></div>`;
    return `<div class="profile-page github-page"><p class="eyebrow">PROFIL DÉVELOPPEUR / TRAVAIL SÉLECTIONNÉ</p><h2>KennethKpn sur GitHub</h2><p>Mon compte GitHub principal est <strong>@KennethKpn</strong>. Cette sélection met en avant les dépôts publics les plus représentatifs plutôt que de mélanger tous les essais, prototypes et archives.</p><p class="profile-actions"><a class="old-link" href="https://github.com/KennethKpn" target="_blank" rel="noopener">Ouvrir mon profil GitHub ↗</a></p><div class="profile-cards github-featured"><section><h3>UNYVON · Business OS</h3><p>Un produit de pilotage pour PME : ventes, stocks, marges, encaissements, créances et analyses NOVA.</p><p class="repo-tech">Next.js · React · TypeScript · Supabase</p><span class="status-chip">En production · dépôt public</span><p class="profile-actions"><a class="old-link" href="https://unyvon.vercel.app" target="_blank" rel="noopener">Voir le produit en production ↗</a><a class="old-link" href="https://github.com/KennethKpn/UNYVON" target="_blank" rel="noopener">Voir le code ↗</a></p></section><section><h3>KAZA · PropTech</h3><p>Marketplace immobilière et outils de gestion locative en cours de développement pour le Bénin.</p><p class="repo-tech">Next.js · TypeScript · Supabase · PostGIS · FedaPay</p><span class="status-chip private-source">Projet en développement · code privé</span> <a class="old-link" href="https://kaza-web-chi.vercel.app" target="_blank" rel="noopener">Ouvrir l’aperçu ↗</a></section></div><div class="github-repos-heading"><h3>Dépôts publics sélectionnés</h3><button class="old-link" data-action="refresh-github" type="button">↻ Actualiser</button></div><p class="github-status" data-github-status>La sélection est disponible ; actualisation des métadonnées GitHub…</p><div class="github-repo-list" data-github-repos>${repoCards}</div><p class="profile-note"><a href="https://github.com/KennethKpn?tab=repositories" target="_blank" rel="noopener">Voir tous mes dépôts GitHub ↗</a> · KAZA est identifié comme projet à code privé.</p></div>`;
  }

  async function loadGithubRepos(win) {
    const list = $('[data-github-repos]', win);
    const status = $('[data-github-status]', win);
    if (!list || !status) return;
    const cacheKey = 'kpDesk95GithubRepos_KennethKpn_v3';
    const updateMeta = (repos, cached = false) => {
      const byName = new Map((repos || []).map(repo => [String(repo.name || '').toLowerCase(), repo]));
      let refreshed = 0;
      publicRepoHighlights.forEach(highlight => {
        const repo = byName.get(highlight.name.toLowerCase());
        const card = $(`[data-repo-name="${highlight.name}"]`, list);
        const meta = card && $('[data-repo-meta]', card);
        if (!repo || !meta) return;
        const lang = repo.language || 'Code';
        const updated = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString(isEN() ? 'en-US' : 'fr-FR') : 'date inconnue';
        meta.textContent = `${lang} · ★ ${repo.stargazers_count || 0} · mis à jour ${updated}`;
        refreshed++;
      });
      status.textContent = cached
        ? isEN() ? `Metadata from the latest local cache · ${refreshed || publicRepoHighlights.length} project(s) kept.` : `Métadonnées issues du dernier cache local · ${refreshed || publicRepoHighlights.length} projet(s) conservé(s).`
        : isEN() ? `${refreshed} selected public repository/repositories confirmed by the GitHub API.` : `${refreshed} dépôt(s) sélectionné(s) confirmé(s) par l’API GitHub.`;
    };
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
      const response = await fetch('https://api.github.com/users/KennethKpn/repos?type=owner&sort=updated&per_page=100', {
        headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal
      });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`GitHub API ${response.status}`);
      const repos = await response.json();
      if (!Array.isArray(repos)) throw new Error('Unexpected GitHub response');
      const selected = repos.filter(repo => publicRepoHighlights.some(item => item.name.toLowerCase() === String(repo.name || '').toLowerCase()));
      try { localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), repos: selected })); } catch (_) {}
      updateMeta(selected);
    } catch (error) {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
        if (cached && Array.isArray(cached.repos)) { updateMeta(cached.repos, true); return; }
      } catch (_) {}
      status.textContent = isEN() ? 'Local selection kept. GitHub metadata will refresh when a connection is available.' : 'Sélection locale conservée. Les métadonnées GitHub seront actualisées lorsque la connexion sera disponible.';
    }
  }

  function projectContent(p) {
    p = localProject(p);
    const copy = (p.copy || '').split('\n\n').map(par => `<p class="project-copy">${escapeHTML(par)}</p>`).join('');
    const tags = (p.tags || []).map(tag => `<span class="project-tech">${escapeHTML(tag)}</span>`).join('');
    const links = (p.links || []).map(link => `<a class="old-link project-outlink" href="${escapeHTML(link.url)}" target="_blank" rel="noopener">${escapeHTML(link.label)} ↗</a>`).join('');
    return `<div class="project-page personal-project-page">
      <div class="personal-project-hero"><img class="project-hero-mark" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}"><div><p class="eyebrow">${escapeHTML(p.category)}</p><h2 class="project-name">${escapeHTML(p.title)}</h2><p class="project-subtitle">${escapeHTML(p.subtitle)}</p>${p.stage ? `<span class="status-chip project-stage ${/privé/i.test(p.stage) ? 'private-source' : ''}">${escapeHTML(p.stage)}</span>` : ''}</div></div>
      <section class="project-summary">
        <div><h4>${isEN() ? 'Overview' : 'Vue d’ensemble'}</h4><p>${escapeHTML(p.challenge)}</p></div>
        <div><h4>${isEN() ? 'Approach' : 'Approche'}</h4><p>${escapeHTML(p.direction)}</p></div>
        <div><h4>${isEN() ? 'Focus' : 'Impact'}</h4><p>${escapeHTML(p.outcome)}</p></div>
      </section>
      ${copy}
      ${tags ? `<h3 class="project-gallery-title">${isEN() ? 'Tools / Topics' : 'Outils / sujets'}</h3><div class="project-tech-list">${tags}</div>` : ''}
      ${links ? `<div class="project-outlinks">${links}</div>` : ''}
      <div class="project-credit">KPANOU KENNETH · PERSONAL ARCHIVE · ${escapeHTML(p.file)}</div>
    </div>`;
  }

  function computerContent() {
    if (isEN()) return `<div class="explorer"><div class="menu-strip"><span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Help</span></div><div class="toolbar"><button data-action="back">← Back</button><button data-action="up">↑ Up</button><button data-action="projects">Folders</button></div><div class="addressbar">📁 <span>Address</span> <strong>C:\\KPANOU</strong></div><div class="file-grid"><button class="file-item" data-action="projects"><span class="file-glyph">📁</span>Portfolio</button><button class="file-item" data-action="iconlabs"><span class="file-glyph">🧩</span>Iconlabs</button><button class="file-item" data-action="skills"><span class="file-glyph">🛠️</span>Skills</button><button class="file-item" data-action="education"><span class="file-glyph">🎓</span>Education</button><button class="file-item" data-action="contact"><span class="file-glyph">✉️</span>Contact</button><button class="file-item" data-action="settings"><span class="file-glyph">⚙️</span>Control Panel</button><button class="file-item" data-action="github"><span class="file-glyph">🐙</span>GitHub Profile</button></div></div>`;
    return `<div class="explorer"><div class="menu-strip"><span>Fichier</span><span>Édition</span><span>Affichage</span><span>Favoris</span><span>Aide</span></div><div class="toolbar"><button data-action="back">← Retour</button><button data-action="up">↑ Haut</button><button data-action="projects">Dossiers</button></div><div class="addressbar">📁 <span>Adresse</span> <strong>C:\\KPANOU</strong></div><div class="file-grid"><button class="file-item" data-action="projects"><span class="file-glyph">📁</span>Portfolio</button><button class="file-item" data-action="iconlabs"><span class="file-glyph">🧩</span>Iconlabs</button><button class="file-item" data-action="skills"><span class="file-glyph">🛠️</span>Compétences</button><button class="file-item" data-action="education"><span class="file-glyph">🎓</span>Formation</button><button class="file-item" data-action="contact"><span class="file-glyph">✉️</span>Contact</button><button class="file-item" data-action="settings"><span class="file-glyph">⚙️</span>Panneau de configuration</button><button class="file-item" data-action="github"><span class="file-glyph">🐙</span>Profil GitHub</button></div></div>`;
  }

  function projectsContent() {
    const selected = projects.filter(p => p.kind === 'project'); const capabilities = projects.filter(p => p.kind !== 'project');
    const renderFiles = items => items.map(p => { const q=localProject(p); return `<button class="file-item" data-project-open="${p.id}"><img src="${iconPath(p)}" alt=""><span>${escapeHTML(p.file)}</span>${q.stage ? `<small class="file-status">${escapeHTML(q.stage)}</small>` : ''}</button>`; }).join('');
    if (isEN()) return `<div class="explorer portfolio-explorer"><div class="menu-strip"><span>File</span><span>Edit</span><span>View</span><span>Help</span></div><div class="toolbar"><button data-action="computer">← Back</button><button data-action="photoshop">Open Design Lab</button></div><div class="addressbar">📁 <span>Address</span> <strong>C:\\KPANOU\\Portfolio</strong></div><section class="archive-section"><div class="archive-heading"><h3>Selected work</h3><span>${selected.length} projects</span></div><p>Concrete products and websites, with source-code status clearly indicated.</p><div class="file-grid">${renderFiles(selected)}</div></section><section class="archive-section"><div class="archive-heading"><h3>My résumé</h3><span>PDF · 1 page</span></div><p>Download a copy of my résumé.</p><div class="file-grid"><a class="file-item file-download-item" href="assets/documents/CV-Yisse-Kpanou.pdf" download="CV-Yisse-Kpanou.pdf" type="application/pdf"><span class="file-glyph">📄</span><strong>CV-Yisse-Kpanou.pdf</strong><small>Download PDF</small></a></div></section><section class="archive-section"><div class="archive-heading"><h3>Skills & areas</h3><span>${capabilities.length} documents</span></div><p>Skills, specialities and background.</p><div class="file-grid">${renderFiles(capabilities)}</div></section></div>`;
    return `<div class="explorer portfolio-explorer"><div class="menu-strip"><span>Fichier</span><span>Édition</span><span>Affichage</span><span>Aide</span></div><div class="toolbar"><button data-action="computer">← Retour</button><button data-action="photoshop">Ouvrir Design Lab</button></div><div class="addressbar">📁 <span>Adresse</span> <strong>C:\\KPANOU\\Portfolio</strong></div><section class="archive-section"><div class="archive-heading"><h3>Réalisations sélectionnées</h3><span>${selected.length} projets</span></div><p>Produits et sites concrets, avec l’état du code source clairement indiqué.</p><div class="file-grid">${renderFiles(selected)}</div></section><section class="archive-section"><div class="archive-heading"><h3>Mon CV</h3><span>PDF · 1 page</span></div><p>Télécharger une copie de mon CV.</p><div class="file-grid"><a class="file-item file-download-item" href="assets/documents/CV-Yisse-Kpanou.pdf" download="CV-Yisse-Kpanou.pdf" type="application/pdf"><span class="file-glyph">📄</span><strong>CV-Yisse-Kpanou.pdf</strong><small>Télécharger le PDF</small></a></div></section><section class="archive-section"><div class="archive-heading"><h3>Compétences & domaines</h3><span>${capabilities.length} documents</span></div><p>Compétences, spécialités et parcours.</p><div class="file-grid">${renderFiles(capabilities)}</div></section></div>`;
  }

  function photoshopContent() {
    return `<div class="photoshop"><div class="ps-menu">File &nbsp; Edit &nbsp; Image &nbsp; Layer &nbsp; Select &nbsp; Filter &nbsp; View &nbsp; Window &nbsp; Help</div>
      <div class="ps-workspace"><aside class="ps-tools"><button title="Move">✥</button><button title="Marquee">▧</button><button title="Lasso">⌁</button><button title="Crop">⌗</button><button title="Brush">🖌</button><button title="Type">T</button><button title="Zoom">⌕</button><button title="Hand">✋</button></aside>
      <div class="ps-canvas-wrap"><div class="design-canvas"><div class="design-canvas-kp">KP</div><strong>DESIGN IS HOW IT WORKS.</strong><span>UI / UX · DIGITAL PRODUCTS · WEB</span></div></div>
      <aside class="ps-side"><h4>Portfolio / Layers</h4>${projects.map((p,i)=>`<button class="ps-thumb ${i===0?'active':''}" data-ps-project="${p.id}" title="Open ${escapeHTML(p.file)}"><img src="${p.image}" alt=""><span>${escapeHTML(p.file)}</span></button>`).join('')}</aside></div>
      <div class="ps-footer">KPANOU KENNETH · DESIGN NOTES · RGB Color · 72 ppi</div></div>`;
  }


  function settingsContent() { if (isEN()) return `<div class="dialog-content"><div class="dialog-row"><div class="dialog-icon">🖥️</div><div><strong>Display Properties</strong><p>Choose the look of your Desk 95 workspace.</p></div></div><p><label><input type="radio" name="wallpaper" value="video" checked> Animated video wallpaper</label></p><p><label><input type="radio" name="wallpaper" value="teal"> Classic teal desktop</label></p><p><label><input type="radio" name="wallpaper" value="mint"> Soft mint</label></p><p><label><input type="radio" name="wallpaper" value="blue"> Classic blue</label></p><div class="dialog-actions"><button data-action="apply-wallpaper">Apply</button><button data-action="close-self">Close</button></div></div>`; return `<div class="dialog-content"><div class="dialog-row"><div class="dialog-icon">🖥️</div><div><strong>Propriétés d’affichage</strong><p>Choisissez l’apparence de votre espace Desk 95.</p></div></div><p><label><input type="radio" name="wallpaper" value="video" checked> Fond vidéo animé</label></p><p><label><input type="radio" name="wallpaper" value="teal"> Bureau turquoise classique</label></p><p><label><input type="radio" name="wallpaper" value="mint"> Bureau vert doux</label></p><p><label><input type="radio" name="wallpaper" value="blue"> Bureau bleu classique</label></p><div class="dialog-actions"><button data-action="apply-wallpaper">Appliquer</button><button data-action="close-self">Fermer</button></div></div>`; }

  function shutdownContent() { if (isEN()) return `<div class="dialog-content"><div class="dialog-row"><div class="dialog-icon">⏻</div><div><strong>What do you want the computer to do?</strong><p>Choose an option and press OK.</p></div></div><p><label><input type="radio" name="shutdown-choice" value="restart"> Restart the computer</label></p><p><label><input type="radio" name="shutdown-choice" value="standby" checked> Stand by</label></p><div class="dialog-actions"><button data-action="shutdown-confirm">OK</button><button data-action="close-self">Cancel</button></div></div>`; return `<div class="dialog-content"><div class="dialog-row"><div class="dialog-icon">⏻</div><div><strong>Que voulez-vous faire ?</strong><p>Choisissez une option puis appuyez sur OK.</p></div></div><p><label><input type="radio" name="shutdown-choice" value="restart"> Redémarrer l’ordinateur</label></p><p><label><input type="radio" name="shutdown-choice" value="standby" checked> Mettre en veille</label></p><div class="dialog-actions"><button data-action="shutdown-confirm">OK</button><button data-action="close-self">Annuler</button></div></div>`; }

  const appContent = {
    about: aboutContent,
    computer: computerContent,
    projects: projectsContent,
    photoshop: photoshopContent,
    inbox: contactContent,
    contact: contactContent,
    iconlabs: iconlabsContent,
    skills: skillsContent,
    education: educationContent,
    github: githubContent,
    settings: settingsContent,
    shutdown: shutdownContent
  };

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function openTarget(id) {
    toast.classList.remove('show');
    const p = projects.find(p => p.id === id);
    if (p) { const width = window.innerWidth <= 1050 ? Math.max(430, Math.min(760, window.innerWidth - 250)) : 780; openWindow(id, p.file, projectContent(p), { icon:'🗎', className:'project-window', width, height:650, status:`${p.category} · ${p.stage || (isEN() ? 'archive item' : 'élément d’archive')}` }); return; }
    const titles = isEN() ? ({about:'Kenneth.txt - Notepad',computer:'My Computer',photoshop:'Design Lab',inbox:'Contact / Inbox',projects:'C:\\Portfolio',settings:'Display Properties',shutdown:'Shut Down Windows',iconlabs:'Iconlabs — Studio',skills:'Skills.txt - Notepad',education:'Education.txt - Notepad',contact:'Contact.txt - Notepad',github:'GitHub — KennethKpn'}[id] || (apps.find(a=>a.id===id)?.name ?? id)) : (windowTitles[id] || (apps.find(a=>a.id===id)?.name ?? id));
    const icon = apps.find(a=>a.id===id)?.icon ?? (id==='projects'?'📁':'🖥️');
    const content = appContent[id]?.() ?? '';
    const sizes = {
      about: { width: 660, height: 500, className:'about-window' },
      computer: { width: 560, height: 430 }, projects: { width: 680, height: 500 },
      photoshop: { width: 760, height: 520 }, inbox: { width: 620, height: 490 }, contact: { width: 620, height: 490 },
      iconlabs: { width: 620, height: 480 }, skills: { width: 620, height: 500 }, education: { width: 560, height: 390 }, github: { width: 620, height: 450 },
      settings: { width: 400, height: 300 }, shutdown: { width: 390, height: 260 }
    };
    const size = sizes[id] || {};
    const opened = openWindow(id, titles, content, { icon, ...size, status: id==='computer'?(isEN()?'7 objects':'7 objets'):id==='projects'?`${projects.length} ${isEN()?'archive items':'éléments d’archive'}`:(isEN()?'Ready':'Prêt') });
    if (id === 'github') loadGithubRepos(opened);
  }

  function openWindow(id, title, content, options = {}) {
    let win = $(`.window[data-window="${id}"]`, windowLayer);
    if (win) {
      win.classList.remove('is-minimized');
      focusWindow(win);
      return win;
    }
    const order = $$('.window', windowLayer).length;
    const requestedWidth = options.width || 630;
    const requestedHeight = options.height || 460;
    const desktopMode = window.matchMedia('(max-width: 700px)').matches;
    const offset = (order % 6) * 26;
    const xOffset = options.className === 'project-window' ? -22 : offset;
    const yOffset = options.className === 'project-window' ? 46 : (id === 'about' ? 35 : offset);
    const layerBounds = windowLayer.getBoundingClientRect();
    const width = desktopMode ? requestedWidth : Math.min(requestedWidth, Math.max(260, layerBounds.width - 12));
    const height = desktopMode ? requestedHeight : Math.min(requestedHeight, Math.max(190, layerBounds.height - 12));
    const left = desktopMode ? 7 : Math.max(4, Math.min(layerBounds.width - width - 4, (layerBounds.width - width) / 2 + xOffset));
    const top = desktopMode ? 7 : Math.max(4, Math.min(layerBounds.height - height - 4, (layerBounds.height - height) / 2 + yOffset));
    win = document.createElement('section');
    win.className = `window ${options.className || ''}`;
    win.dataset.window = id;
    win.dataset.preferredWidth = String(requestedWidth);
    win.dataset.preferredHeight = String(requestedHeight);
    win.style.width = `${width}px`;
    win.style.height = `${height}px`;
    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
    win.innerHTML = `<header class="titlebar"><span class="window-app-icon">${options.icon || '🗎'}</span><strong class="window-title">${escapeHTML(title)}</strong><div class="window-controls"><button class="window-control minimize" aria-label="Minimize" title="Minimize">_</button><button class="window-control maximize" aria-label="Maximize" title="Maximize">□</button><button class="window-control close" aria-label="Close" title="Close">×</button></div></header><div class="window-body">${content}</div><div class="window-statusbar"><span>${escapeHTML(options.status || 'Ready')}</span></div>`;
    windowLayer.append(win);
    const task = document.createElement('button');
    task.type = 'button';
    task.className = 'task-button';
    task.dataset.task = id;
    task.innerHTML = `<span class="task-emoji">${options.icon || '🗎'}</span><span>${escapeHTML(title)}</span>`;
    task.addEventListener('click', () => {
      if (win.classList.contains('is-minimized')) win.classList.remove('is-minimized');
      else if (win.classList.contains('is-focused')) win.classList.add('is-minimized');
      focusWindow(win);
    });
    taskButtons.append(task);
    win.addEventListener('pointerdown', () => focusWindow(win));
    $('.close', win).addEventListener('click', () => closeWindow(id));
    $('.minimize', win).addEventListener('click', () => { win.classList.add('is-minimized'); task.classList.remove('active'); });
    $('.maximize', win).addEventListener('click', () => toggleMaximize(win));
    makeDraggable(win);
    win.addEventListener('click', handleWindowClick);
    focusWindow(win);
    return win;
  }

  function focusWindow(win) {
    $$('.window', windowLayer).forEach(w => { w.classList.remove('is-focused'); w.classList.add('is-inactive'); });
    $$('.task-button').forEach(b => b.classList.remove('active'));
    win.classList.remove('is-minimized','is-inactive');
    win.classList.add('is-focused');
    win.style.zIndex = String(++zIndex);
    const task = $(`.task-button[data-task="${win.dataset.window}"]`);
    if (task) task.classList.add('active');
  }

  function closeWindow(id) {
    $(`.window[data-window="${id}"]`, windowLayer)?.remove();
    $(`.task-button[data-task="${id}"]`)?.remove();
  }

  function toggleMaximize(win) {
    win.classList.toggle('is-maximized');
    const btn = $('.maximize', win);
    btn.textContent = win.classList.contains('is-maximized') ? '❐' : '□';
  }

  function makeDraggable(win) {
    const bar = $('.titlebar', win);
    let drag = null;
    bar.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button') || window.matchMedia('(max-width: 700px)').matches || win.classList.contains('is-maximized')) return;
      focusWindow(win);
      const rect = win.getBoundingClientRect();
      drag = { x:event.clientX, y:event.clientY, left:rect.left, top:rect.top };
      bar.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    bar.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const layerRect = windowLayer.getBoundingClientRect();
      const maxLeft = Math.max(0, layerRect.width - 180);
      const maxTop = Math.max(0, layerRect.height - 45);
      const left = Math.min(maxLeft, Math.max(0, drag.left + event.clientX - drag.x));
      const top = Math.min(maxTop, Math.max(0, drag.top + event.clientY - drag.y));
      win.style.left = `${left}px`;
      win.style.top = `${top}px`;
    });
    const end = () => { drag = null; };
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
  }

  function handleWindowClick(event) {
    const projectButton = event.target.closest('[data-project-open]');
    if (projectButton) { openTarget(projectButton.dataset.projectOpen); return; }
    const action = event.target.closest('[data-action]');
    if (action) {
      const win = event.currentTarget;
      switch(action.dataset.action) {
        case 'projects': openTarget('projects'); break;
        case 'about': openTarget('about'); break;
        case 'skills': openTarget('skills'); break;
        case 'iconlabs': openTarget('iconlabs'); break;
        case 'education': openTarget('education'); break;
        case 'contact': openTarget('contact'); break;
        case 'github': openTarget('github'); break;
        case 'refresh-github': loadGithubRepos(win); break;
        case 'inbox': openTarget('inbox'); break;
        case 'photoshop': openTarget('photoshop'); break;
        case 'computer': openTarget('computer'); break;
        case 'settings': openTarget('settings'); break;
        case 'back': openTarget('computer'); break;
        case 'up': openTarget('computer'); break;
        case 'audio': showToast('Audio CD (D:) — no disc in drive.'); break;
        case 'close-self': closeWindow(win.dataset.window); break;
        case 'apply-wallpaper': applyWallpaper(win); break;
        case 'shutdown-confirm': showToast('Desk 95 is staying right here.'); closeWindow(win.dataset.window); break;
        case 'compose': openTarget('contact'); break;
        case 'reply': openTarget('contact'); break;
        case 'delete-mail': showToast('There is no message to delete. Use Contact to reach Kenneth.'); break;
      }
    }
    const psButton = event.target.closest('[data-ps-project]');
    if (psButton) {
      const p = projects.find(x=>x.id===psButton.dataset.psProject);
      if (p) {
        const canvas = $('.design-canvas', event.currentTarget);
        canvas.innerHTML = `<div class="design-canvas-kp">${escapeHTML(p.title.split(' ')[0].slice(0,3))}</div><strong>${escapeHTML(p.title)}</strong><span>${escapeHTML(p.category)}</span>`;
        $$('.ps-thumb',event.currentTarget).forEach(b=>b.classList.toggle('active',b===psButton));
        $('.window-title',event.currentTarget).textContent = `Design Lab — ${p.file}`;
      }
    }
    const mailButton = event.target.closest('[data-mail]');
    if (mailButton) {
      const w = event.currentTarget;
      const body = $('.window-body',w);
      body.innerHTML = inboxContent(mailButton.dataset.mail);
    }
    const zoom = event.target.closest('.zoomable');
    if (zoom) openImageViewer(zoom.dataset.zoom || zoom.src);
  }

  function activateWallpaperVideo() {
    const video = $('#desktop-wallpaper-video');
    const wall = $('.desktop-wallpaper');
    if (!video || !wall || wall.dataset.mode !== 'video') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData === true;
    if (reducedMotion || saveData) {
      video.pause();
      wall.classList.remove('is-video');
      return;
    }
    if (!video.dataset.loaded) {
      video.src = video.dataset.src;
      video.dataset.loaded = 'true';
      video.load();
    }
    const playback = video.play();
    if (playback && typeof playback.then === 'function') {
      playback.then(() => wall.classList.add('is-video')).catch(() => wall.classList.remove('is-video'));
    }
  }

  function applyWallpaper(win) {
    const choice = $('input[name="wallpaper"]:checked',win)?.value || 'video';
    const wall = $('.desktop-wallpaper');
    const video = $('#desktop-wallpaper-video');
    wall.dataset.mode = choice;
    wall.classList.toggle('is-video', choice === 'video');
    if (choice === 'video') {
      wall.style.backgroundColor = 'var(--teal)';
      activateWallpaperVideo();
    } else {
      video?.pause();
      wall.classList.remove('is-video');
      wall.style.backgroundColor = choice === 'mint' ? '#65b8a6' : choice === 'blue' ? '#0000aa' : 'var(--teal)';
    }
    showToast('Desktop settings applied.');
  }

  function openImageViewer(src) {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.innerHTML = `<img src="${escapeHTML(src)}" alt="Agrandissement du visuel">`;
    viewer.addEventListener('click',()=>viewer.remove());
    document.body.append(viewer);
  }

  function showShortcutMenu(x,y,id,name) {
    hideContextMenu();
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `<button data-menu-action="open">Open</button><div class="menu-rule"></div><button data-menu-action="rename">Rename</button><button data-menu-action="properties">Properties</button>`;
    menu.style.left = `${Math.min(x, window.innerWidth-175)}px`;
    menu.style.top = `${Math.min(y, window.innerHeight-120)}px`;
    menu.addEventListener('click', (event) => {
      const action = event.target.closest('[data-menu-action]')?.dataset.menuAction;
      if (action==='open') openTarget(id);
      if (action==='rename') showToast('This archive shortcut is protected.');
      if (action==='properties') openProperties(name,id);
      hideContextMenu();
    });
    contextLayer.append(menu);
  }

  function openProperties(name,id) {
    openWindow(`properties-${id}`, `${name} Properties`, `<div class="dialog-content"><div class="dialog-row"><div class="dialog-icon">📄</div><div><strong>${escapeHTML(name)}</strong><p>Type: Desk 95 archive shortcut</p><p>Location: Desktop</p></div></div><div class="dialog-actions"><button data-action="close-self">OK</button></div></div>`, { width:350,height:220, icon:'📄' });
  }

  function hideContextMenu() { contextLayer.innerHTML = ''; }
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.context-menu')) hideContextMenu();
    if (!event.target.closest('#start-button') && !event.target.closest('#start-menu')) {
      startMenu.classList.add('is-hidden');
      $('#start-button').classList.remove('active');
      $('#start-button').setAttribute('aria-expanded','false');
    }
    if (!event.target.closest('.shortcut')) $$('.shortcut.selected').forEach(el=>el.classList.remove('selected'));
  });
  desktop.addEventListener('contextmenu', (event) => {
    if (event.target.closest('.shortcut,.window,.taskbar,.start-menu')) return;
    event.preventDefault();
    hideContextMenu();
    const menu=document.createElement('div'); menu.className='context-menu';
    menu.innerHTML='<button data-desktop-action="refresh">Refresh</button><button data-desktop-action="arrange">Arrange Icons</button><div class="menu-rule"></div><button data-desktop-action="properties">Properties</button>';
    menu.style.left=`${Math.min(event.clientX,window.innerWidth-180)}px`;
    menu.style.top=`${Math.min(event.clientY,window.innerHeight-120)}px`;
    menu.addEventListener('click',e=>{ const a=e.target.closest('[data-desktop-action]')?.dataset.desktopAction; if(a==='refresh') showToast('Desktop refreshed.'); if(a==='arrange') layoutDesktopIcons(true); if(a==='properties') openTarget('settings'); hideContextMenu(); });
    contextLayer.append(menu);
  });

  $('#start-button').addEventListener('click',(event)=>{
    event.stopPropagation();
    startMenu.classList.toggle('is-hidden');
    const open=!startMenu.classList.contains('is-hidden');
    $('#start-button').classList.toggle('active',open);
    $('#start-button').setAttribute('aria-expanded',String(open));
  });
  startMenu.addEventListener('click',(event)=>{
    const target=event.target.closest('[data-start]')?.dataset.start;
    if (!target) return;
    startMenu.classList.add('is-hidden'); $('#start-button').classList.remove('active'); $('#start-button').setAttribute('aria-expanded','false');
    if(target==='shutdown') openTarget('shutdown');
    else openTarget(target);
  });

  function updateClock() {
    const now = new Date();
    $('#clock').textContent = now.toLocaleTimeString([], { hour:'numeric', minute:'2-digit' });
  }
  updateClock();
  setInterval(updateClock, 30000);
  document.addEventListener('visibilitychange', () => {
    const video = $('#desktop-wallpaper-video');
    const wall = $('.desktop-wallpaper');
    if (!video || !wall) return;
    if (document.hidden) video.pause();
    else if (wall.dataset.mode === 'video' && !desktop.classList.contains('is-hidden')) activateWallpaperVideo();
  });

  const languageLabels = {
    fr: { about:'About Kenneth', computer:'My Computer', photoshop:'Design Lab', contact:'Contact', github:'GitHub / projets', iconlabs:'Iconlabs Studio', skills:'Compétences', education:'Formation', projects:'Projets', settings:'Paramètres', shutdown:'Éteindre…' },
    en: { about:'About Kenneth', computer:'My Computer', photoshop:'Design Lab', contact:'Contact', github:'GitHub / projects', iconlabs:'Iconlabs Studio', skills:'Skills', education:'Education', projects:'Projects', settings:'Settings', shutdown:'Shut Down…' }
  };
  function updateStaticLanguage() {
    document.documentElement.lang = currentLanguage;
    const labels = languageLabels[currentLanguage];
    const startMap = {about:'[data-start="about"] b',computer:'[data-start="computer"]',photoshop:'[data-start="photoshop"]',iconlabs:'[data-start="iconlabs"]',skills:'[data-start="skills"]',education:'[data-start="education"]',contact:'[data-start="contact"]',github:'[data-start="github"]',projects:'[data-start="projects"]',settings:'[data-start="settings"]',shutdown:'[data-start="shutdown"]'};
    Object.entries(startMap).forEach(([key,sel])=>{const el=$(sel); if(el) el.textContent=labels[key];});
    const langButtons=$$('.language-button'); langButtons.forEach(b=>{b.classList.toggle('active',b.dataset.lang===currentLanguage); b.setAttribute('aria-pressed',String(b.dataset.lang===currentLanguage));});
    const bootCopy=$('.boot-copy'); if(bootCopy) bootCopy.textContent=currentLanguage==='en' ? `A fatal exception 0E has occurred in KPANOU.EXE at 0028:C0011E36\nDESK95(01) + 00010E36.  The personal workspace will be\nloaded after this interruption.\n\n* Press any key to enter the desktop.\n* Open the files to explore my work, skills and story.\n* Press CTRL+ALT+DEL to restart the experience.\n\nKPANOU KENNETH · FULL-STACK DEVELOPER · UI/UX DESIGNER` : `Une exception fatale 0E est survenue dans KPANOU.EXE à 0028:C0011E36\nDESK95(01) + 00010E36.  L’espace personnel sera chargé\naprès cette interruption.\n\n* Appuyez sur une touche pour entrer sur le bureau.\n* Ouvrez les fichiers pour découvrir mon travail, mes compétences et mon parcours.\n* Appuyez sur CTRL+ALT+SUPPR pour redémarrer l’expérience.\n\nKPANOU KENNETH · DÉVELOPPEUR FULL-STACK · DESIGNER UI/UX`;
    const boot=$('.boot-screen'); if(boot) boot.setAttribute('aria-label',currentLanguage==='en'?'Windows startup screen for KPANOU Kenneth':'Écran de démarrage Windows pour KPANOU Kenneth');
  }
  function setLanguage(lang) {
    currentLanguage = lang === 'en' ? 'en' : 'fr';
    try { localStorage.setItem(languageKey,currentLanguage); } catch (_) {}
    const openIds=$$('.window',windowLayer).map(w=>w.dataset.window);
    openIds.forEach(id=>closeWindow(id));
    updateStaticLanguage();
    openIds.forEach(id=>openTarget(id));
  }
  $$('.language-button').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();setLanguage(button.dataset.lang);}));
  updateStaticLanguage();

  function startDesktop() {
    if (boot.classList.contains('leaving') || boot.classList.contains('is-hidden')) return;
    boot.classList.add('leaving');
    setTimeout(()=>{
      boot.classList.add('is-hidden');
      desktop.classList.remove('is-hidden');
      requestAnimationFrame(() => layoutDesktopIcons());
      const startWallpaper = () => activateWallpaperVideo();
      if ('requestIdleCallback' in window) requestIdleCallback(startWallpaper, { timeout: 1200 });
      else setTimeout(startWallpaper, 180);
    },420);
  }
  boot.addEventListener('click', startDesktop);
  document.addEventListener('keydown',(event)=>{
    if (!boot.classList.contains('is-hidden')) { startDesktop(); return; }
    if (event.key==='Escape') { hideContextMenu(); $('.image-viewer')?.remove(); }
    if (event.altKey && event.key==='F4') { event.preventDefault(); const active=$$('.window',windowLayer).filter(w=>!w.classList.contains('is-minimized')).sort((a,b)=>Number(b.style.zIndex)-Number(a.style.zIndex))[0]; if(active) closeWindow(active.dataset.window); }
    if (event.ctrlKey && event.altKey && event.key.toLowerCase()==='delete') { showToast('Restarting Desk 95…'); closeWindow('about'); setTimeout(()=>openTarget('about'),500); }
  });

  // Tap once to select, tap again to launch on touch devices; expose a long-press-like context menu on right click only.
  document.addEventListener('keydown',(event)=>{
    if(event.key==='F5') { event.preventDefault(); showToast('Desktop refreshed.'); }
  });
})();
