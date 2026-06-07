// app.js - Pure Vanilla JS Interactivity

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mouse Tracking for Parallax & Glow Effect
  const mouseGlow = document.querySelector('.mouse-glow');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');

  // Track mouse coordinates
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  // Smoothing factor for parallax
  const easing = 0.05;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateParallax() {
    // Interpolate mouse coordinates for smooth lag effect
    currentX += (mouseX - currentX) * easing;
    currentY += (mouseY - currentY) * easing;

    // Update Mouse Glow Position
    if (mouseGlow) {
      mouseGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    }

    // Calculate delta from screen center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = currentX - centerX;
    const deltaY = currentY - centerY;

    // Update all parallax layers based on their specific data-speed attribute
    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-speed')) || 0;
      if (speed !== 0) {
        // Negate delta to move opposite to mouse (classic parallax)
        const xPos = -(deltaX * speed);
        const yPos = -(deltaY * speed);
        
        // Preserve any existing transform functions (like floating micro-animations) if possible,
        // but for pure parallax layers, translate3d is the most performant.
        layer.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
      }
    });

    requestAnimationFrame(animateParallax);
  }

  // Start the animation loop
  animateParallax();


  // 2. 3D Tilt Effect for Cards
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      // Mouse position relative to the card
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Card dimensions
      const width = rect.width;
      const height = rect.height;

      // Calculate rotation angles (max 15 degrees)
      const maxRotateX = 15;
      const maxRotateY = 15;

      const rotateX = maxRotateX * ((y - height / 2) / (height / 2)) * -1; // Invert Y
      const rotateY = maxRotateY * ((x - width / 2) / (width / 2));

      // Apply transform
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      // Smoothly snap back to 0
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });


  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only reveal once
      }
    });
  }, {
    root: null,
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px"
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Trigger reveal on load for elements already in viewport
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('active');
      }
    });
  }, 100);

  // 4. Comic Click/Tap Effects (Miles Morales Style)
  const comicWords = ["THWIP!", "BAM!", "POW!", "ZAP!", "WHAM!", "CRASH!", "ZING!", "SMASH!", "BOOM!"];
  const comicColors = ["var(--neon-red)", "var(--electric-blue)", "var(--yellow)", "#b180ff", "var(--white)"];

  document.addEventListener('pointerdown', (e) => {
    // Only primary button for mouse
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const container = document.createElement('div');
    container.className = 'comic-click-container';
    container.style.left = `${e.clientX}px`;
    container.style.top = `${e.clientY}px`;

    const ring = document.createElement('div');
    ring.className = 'comic-click-ring';
    ring.style.borderColor = comicColors[Math.floor(Math.random() * comicColors.length)];

    const text = document.createElement('div');
    text.className = 'comic-click-text';
    text.innerText = comicWords[Math.floor(Math.random() * comicWords.length)];
    
    const color1 = comicColors[Math.floor(Math.random() * comicColors.length)];
    let color2 = comicColors[Math.floor(Math.random() * comicColors.length)];
    while(color1 === color2) color2 = comicColors[Math.floor(Math.random() * comicColors.length)];

    text.style.color = color1;
    // Heavy comic shadow
    text.style.textShadow = `3px 3px 0 var(--black), -2px -2px 0 ${color2}`;

    container.appendChild(ring);
    container.appendChild(text);
    document.body.appendChild(container);

    // Clean up DOM after animation finishes
    setTimeout(() => {
      if (container.parentNode) container.remove();
    }, 550);
  });

});
