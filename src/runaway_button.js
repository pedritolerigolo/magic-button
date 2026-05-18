export class RunawayButton {
  static sharedCursor = null;
  static mousePos = { x: 0, y: 0 };
  static offsetX = 0;
  static offsetY = 0;
  static instances = [];

  constructor(selector, options = {}) {
    this.el = document.querySelector(selector);
    this.speed = options.speed || 2;
    this.radius = options.radius || 150;
    this.mode = options.mode || 'escape';
    this.lastElementOver = null;

    if (this.el) {
      RunawayButton.instances.push(this);
      this.init();
    }
  }

  init() {
    if (!RunawayButton.sharedCursor) {
      this.createSharedCursor();
      this.startGlobalLoop();
    }
    
    document.body.style.cursor = 'none';
    
    window.addEventListener('mousemove', (e) => {
      RunawayButton.mousePos.x = e.clientX;
      RunawayButton.mousePos.y = e.clientY;
    });

    window.addEventListener('mousedown', () => this.simulateClick());
  }

  createSharedCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'magic-cursor';
    const cursorIcon = `url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='black' stroke='white' stroke-width='1'%3E%3Cpath d='M5.5 3.21V20.8l4.58-4.58 2.84 6.74 3.12-1.31-2.83-6.73h6.3L5.5 3.21z'/%3E%3C/svg%3E")`;

    Object.assign(cursor.style, {
      width: '24px', height: '24px',
      backgroundImage: cursorIcon, backgroundSize: 'contain',
      position: 'fixed', pointerEvents: 'none', zIndex: '9999',
      left: '0px', top: '0px', willChange: 'left, top'
    });

    document.body.appendChild(cursor);
    RunawayButton.sharedCursor = cursor;
  }

  startGlobalLoop() {
    const render = () => {
      let inZone = false;

      RunawayButton.instances.forEach(instance => {
        if (instance.isElementInViewport()) {
          const active = instance.calculateEffect();
          if (active) inZone = true;
        }
      });

      if (!inZone) {
        RunawayButton.offsetX *= 0.92;
        RunawayButton.offsetY *= 0.92;
      }

      const finalX = RunawayButton.mousePos.x + RunawayButton.offsetX;
      const finalY = RunawayButton.mousePos.y + RunawayButton.offsetY;

      RunawayButton.sharedCursor.style.left = `${finalX}px`;
      RunawayButton.sharedCursor.style.top = `${finalY}px`;

      this.simulateHover(finalX, finalY);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  isElementInViewport() {
    const rect = this.el.getBoundingClientRect();
    return (rect.top < window.innerHeight && rect.bottom > 0);
  }

  calculateEffect() {
    const rect = this.el.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = RunawayButton.mousePos.x - btnCenterX;
    const dy = RunawayButton.mousePos.y - btnCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.radius) {
      const power = (this.radius - distance) / this.radius;
      const angle = Math.atan2(dy, dx);
      
      if (this.mode === 'escape') {
        RunawayButton.offsetX += Math.cos(angle) * (this.speed * 0.5) * power;
        RunawayButton.offsetY += Math.sin(angle) * (this.speed * 0.5) * power;
      } else {
        const strength = (this.speed * 0.02) * power; 
        RunawayButton.offsetX -= (RunawayButton.offsetX + dx) * strength;
        RunawayButton.offsetY -= (RunawayButton.offsetY + dy) * strength;
      }
      return true;
    }
    return false;
  }

  simulateHover(x, y) {
    const el = document.elementFromPoint(x, y);
    if (this.lastElementOver !== el) {
      if (this.lastElementOver) this.lastElementOver.classList.remove('fake-hover');
      if (el) el.classList.add('fake-hover');
      this.lastElementOver = el;
    }
  }

  simulateClick() {
    if (!this.isElementInViewport()) return;
    const x = parseFloat(RunawayButton.sharedCursor.style.left);
    const y = parseFloat(RunawayButton.sharedCursor.style.top);
    const el = document.elementFromPoint(x, y);
    if (el) el.click();
  }
}