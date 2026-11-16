'use strict';
const music = document.querySelector('#wedding-music');
const musicToggle = document.querySelector('#music-toggle');
music.volume = 1;
function musicState() { const playing = !music.paused; musicToggle.setAttribute('aria-pressed',String(playing)); musicToggle.setAttribute('aria-label',playing?'Pausar música':'Reproducir música a volumen bajo'); musicToggle.querySelector('span').textContent=playing?'Pausar música':'Música'; }
async function startMusic() { try { await music.play(); } catch {} musicState(); }
musicToggle.addEventListener('click',()=>{ if(music.paused) startMusic(); else {music.pause();musicState();} });
document.querySelector('.enter').addEventListener('click',()=>{if(music.paused) startMusic();});
music.addEventListener('play',musicState); music.addEventListener('pause',musicState);
startMusic();
const film=document.querySelector('#wedding-film');
let resumeMusicAfterFilm=false;
film.addEventListener('play',()=>{resumeMusicAfterFilm=!music.paused;if(!music.paused)music.pause();});
function restoreMusic(){if(resumeMusicAfterFilm){resumeMusicAfterFilm=false;startMusic();}}
film.addEventListener('pause',restoreMusic);film.addEventListener('ended',restoreMusic);
const photos = window.ALBUM_PHOTOS || [];
const gallery = document.querySelector('#gallery');
const viewer = document.querySelector('#viewer');
const fullPhoto = document.querySelector('#full-photo');
const downloadOne = document.querySelector('#download-one');
let current = 0;
let lastOpener;
document.querySelector('#count').textContent = `${photos.length} FOTOGRAFÍAS`;
photos.forEach((photo, index) => {
  const card = document.createElement('div'); card.className = 'photo-card';
  const button = document.createElement('button'); button.className = 'photo-open';
  button.setAttribute('aria-label', `Ampliar fotografía ${index + 1}`);
  const img = document.createElement('img'); img.src = `thumbs/${encodeURIComponent(photo.name)}.jpg`;
  img.alt = `Recuerdo de la boda de Vanessa y Vincent, foto ${index + 1}`;
  img.width = photo.width; img.height = photo.height; img.loading = 'lazy'; img.decoding = 'async';
  button.append(img); button.addEventListener('click', () => openPhoto(index, button));
  const download = document.createElement('a'); download.className = 'photo-download';
  download.href = `photos/${encodeURIComponent(photo.name)}`; download.download = photo.name;
  download.textContent = '↓'; download.setAttribute('aria-label', `Descargar fotografía ${index + 1}`);
  card.append(button, download); gallery.append(card);
});
function showPhoto(index) {
  current = (index + photos.length) % photos.length;
  const photo = photos[current];
  fullPhoto.src = `photos/${encodeURIComponent(photo.name)}`;
  fullPhoto.alt = `Vanessa y Vincent — fotografía ${current + 1} de ${photos.length}`;
  downloadOne.href = fullPhoto.getAttribute('src'); downloadOne.download = photo.name;
  document.querySelector('#position').textContent = `${current + 1} / ${photos.length}`;
  document.querySelector('#photo-name').textContent = photo.name;
}
function openPhoto(index, opener) { lastOpener = opener; showPhoto(index); viewer.showModal(); document.body.classList.add('viewing'); document.querySelector('#close').focus(); }
document.querySelector('#close').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => { document.body.classList.remove('viewing'); lastOpener?.focus({preventScroll:true}); });
document.querySelector('#previous').addEventListener('click', () => showPhoto(current - 1));
document.querySelector('#next').addEventListener('click', () => showPhoto(current + 1));
viewer.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(current - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(current + 1); } });
let touchStart;
fullPhoto.addEventListener('touchstart', event => { if(event.touches.length === 1) touchStart = {x:event.touches[0].clientX,y:event.touches[0].clientY}; else touchStart = null; }, {passive:true});
fullPhoto.addEventListener('touchend', event => { if(!touchStart) return; const dx=event.changedTouches[0].clientX-touchStart.x; const dy=event.changedTouches[0].clientY-touchStart.y; if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5) showPhoto(current+(dx<0?1:-1)); touchStart=null; }, {passive:true});
