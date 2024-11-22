document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  const GRAVITY = 0.5;

  class ImagePhysics {
    constructor(image) {
      this.image = image;
      this.x = 0;
      this.y = 0;
      this.velocityY = 0;
      this.isAnimating = false;
      this.initialHeight = 0;
      this.floor = window.innerHeight - image.height;
    }

    updateFloor() {
      this.floor = window.innerHeight - this.image.height;
      if (this.y > this.floor) {
        this.y = this.floor;
      }
    }

    update() {
      if (!this.isAnimating) return;

      // Apply gravity
      this.velocityY += GRAVITY;
      this.y += this.velocityY;

      // Check floor collision
      if (this.y >= this.floor) {
        // Set exactly at floor
        this.y = this.floor;

        // Calculate velocity needed to reach original height
        const heightDifference = this.floor - this.initialHeight;
        this.velocityY = -Math.sqrt(2 * GRAVITY * Math.abs(heightDifference));
      }

      // Update image position
      this.image.style.position = 'absolute';
      this.image.style.left = `${this.x}px`;
      this.image.style.top = `${this.y}px`;

      requestAnimationFrame(() => this.update());
    }

    startBouncing(x, y) {
      this.updateFloor(); // Ensure floor is correct before starting
      this.x = x;
      this.y = Math.min(y, this.floor); // Ensure starting position isn't below floor
      this.initialHeight = this.y;
      this.velocityY = 0;
      this.isAnimating = true;
      this.update();
    }
  }

  const physicsObjects = new Map();

  images.forEach(image => {
    const physics = new ImagePhysics(image);
    physicsObjects.set(image, physics);

    let isDragging = false;
    let offsetX, offsetY;

    image.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - image.offsetLeft;
      offsetY = e.clientY - image.offsetTop;
      e.preventDefault();
      physics.isAnimating = false;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const newY = e.clientY - offsetY;
      image.style.position = 'absolute';
      image.style.left = `${e.clientX - offsetX}px`;
      image.style.top = `${Math.min(newY, physics.floor)}px`; // Prevent dragging below floor
    });

    document.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;

      const releaseY = Math.min(e.clientY - offsetY, physics.floor);
      physics.startBouncing(e.clientX - offsetX, releaseY);
    });
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    images.forEach(image => {
      const physics = physicsObjects.get(image);
      physics.updateFloor();
      if (!physics.isAnimating) {
        physics.y = physics.floor;
        image.style.top = `${physics.y}px`;
      }
    });
  });
});
