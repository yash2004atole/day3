

/* ── PHOTO TILT (CSS 3D) ── */
const movePhoto = document.querySelector('.frame');
if (movePhoto) {
  movePhoto.addEventListener('mouseleave', () => {
    movePhoto.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    movePhoto.style.transition = 'transform .4s ease';
  });
}
/* ── INTERSECTION OBSERVER: reveal ── */
const io = new IntersectionObserver(es => {
  es.forEach(e => { 
    if (e.isIntersecting) 
      {
         e.target.classList.add('on'); 
        io.unobserve(e.target);
       } });
},
 { 
  threshold: .1 
});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => io.observe(el));
