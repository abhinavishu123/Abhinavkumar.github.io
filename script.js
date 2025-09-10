// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

gsap.to(document.querySelectorAll('.skill-fill'), {
    width: function() {
        return this.targets()[0].dataset.width + '%';
    },
    duration: 2,
    ease: 'power2.out',
    stagger: 0.2,
    scrollTrigger: {
        trigger: '#skills',
        start: 'top 80%'
    }
});

gsap.utils.toArray('.fade-in').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 50 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.utils.toArray('.parallax').forEach((section, i) => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
            gsap.to(section, {
                y: self.progress * -100,
                ease: 'none'
            });
        }
    });
});

// Three.js Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const stars = [];
for (let i = 0; i < 1000; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const star = new THREE.Mesh(geometry, material);
    star.position.set(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000
    );
    scene.add(star);
    stars.push(star);
}

camera.position.z = 30;

const animate = function () {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    stars.forEach(star => star.rotateX(0.005));
    renderer.render(scene, camera);
};
animate();

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// EmailJS functionality
(function(){
  emailjs.init("YOUR_PUBLIC_KEY"); // from EmailJS dashboard
})();

document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
    .then(() => alert("Message sent!"), 
          (err) => alert("Failed to send: " + JSON.stringify(err)));
});