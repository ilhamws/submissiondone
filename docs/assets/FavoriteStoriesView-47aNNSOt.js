import{M as r}from"./MapService-wUwhiCd_.js";import"./index-CKSsnL6G.js";class c{constructor(){this.app=document.querySelector("#app"),this.maps=new Map}showLoading(){this.app.innerHTML=`
      <div class="loading-state" role="alert" aria-busy="true">
        <div class="loading-spinner"></div>
        <p>Memuat cerita favorit...</p>
      </div>
    `}showError(a){this.app.innerHTML=`
      <div class="error-state" role="alert">
        <h2>Error</h2>
        <p>${a}</p>
        <button class="button retry-button">Coba Lagi</button>
      </div>
    `}render(a=[]){if(a.length===0){this.app.innerHTML=`
        <div class="empty-state">
          <h2>Tidak Ada Cerita Favorit</h2>
          <p>Tambahkan cerita ke favorit untuk melihatnya di sini.</p>
          <a href="#/" class="button">Lihat Semua Cerita</a>
        </div>
      `;return}this.app.innerHTML=`
      <style>
        .favorites-description {
          margin-bottom: 20px;
          color: #555;
          line-height: 1.5;
        }
        
        .story-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          margin-top: 10px;
        }
        
        .story-detail-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 42px;
          text-align: center;
          font-weight: bold;
          padding: 10px 16px;
          margin: 5px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .back-link-container {
          margin: 30px 0;
          text-align: center;
        }

        .back-link {
          padding: 12px 24px;
          font-size: 1.1rem;
        }
        
        @media (min-width: 768px) {
          .story-actions {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          
          .story-detail-button {
            min-width: 180px;
            width: auto;
          }
        }
      </style>
      <div id="favorite-stories" class="stories-container">
        <h1>Cerita Favorit</h1>
        <p class="favorites-description">Berikut adalah cerita-cerita yang telah Anda tambahkan ke favorit. Klik tombol "Hapus dari favorit" untuk menghapus cerita dari daftar favorit.</p>
        <div class="stories-grid">
          ${a.map(t=>this.createStoryCard(t)).join("")}
        </div>
        <div class="back-link-container">
          <a href="#/" class="button back-link">Kembali ke Halaman Utama</a>
        </div>
      </div>
    `,this.setupEventListeners(),this.initializeMaps(a)}createStoryCard(a){return`
      <article class="story-card" data-story-id="${a.id}">
        <div class="story-image-container">
          <img src="${a.photoUrl}" alt="${a.description}" class="story-image">
        </div>
        ${a.lat&&a.lon?`
          <div class="story-map-container">
            <div id="map-${a.id}" class="story-map"></div>
            <p id="address-${a.id}" class="story-address" aria-live="polite">Memuat lokasi...</p>
          </div>
        `:""}
        <div class="story-content">
          <h2>${a.name}</h2>
          <p>${a.description}</p>
          <div class="story-meta">
            <span class="story-date">${new Date(a.createdAt).toLocaleDateString()}</span>
            <div class="story-actions">
              <a href="#/stories/${a.id}" class="button story-detail-button">Lihat Detail</a>
              <favorite-button 
                story-id="${a.id}" 
                story-data='${JSON.stringify(a).replace(/'/g,"&#39;")}'>
              </favorite-button>
            </div>
          </div>
        </div>
      </article>
    `}async initializeMaps(a){for(const t of a)if(t.lat&&t.lon)try{if(document.getElementById(`map-${t.id}`)){const i=await r.initSmallMap(`map-${t.id}`,{center:[t.lon,t.lat],zoom:14,interactive:!1});if(i){await r.addMarker(i,t.lat,t.lon,t.name),this.maps.set(t.id,i);try{const s=await r.getAddress(t.lat,t.lon);this.updateAddress(t.id,s)}catch(s){console.error(`Failed to get address for story ${t.id}:`,s),this.updateAddress(t.id,`Lokasi: ${t.lat.toFixed(4)}, ${t.lon.toFixed(4)}`)}}}}catch(e){console.error(`Failed to load map for story ${t.id}:`,e),this.showMapError(`map-${t.id}`,t.lat,t.lon)}}updateAddress(a,t){const e=document.getElementById(`address-${a}`);e&&(e.textContent=t)}showMapError(a,t,e){const i=document.getElementById(a);i&&(i.innerHTML=`
        <div class="map-fallback">
          ${t&&e?`<p>Lokasi: ${t.toFixed(4)}, ${e.toFixed(4)}</p>`:"<p>Gagal memuat peta</p>"}
        </div>
      `)}setupEventListeners(){this.app.querySelectorAll(".story-detail-button").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const i=t.getAttribute("href");window.location.hash=i})}),this.app.addEventListener("favorite-changed",t=>{const{storyId:e,isFavorite:i}=t.detail;if(!i){this.showNotification("Cerita berhasil dihapus dari favorit");const s=this.app.querySelector(`.story-card[data-story-id="${e}"]`);s&&(s.style.transition="opacity 0.5s, transform 0.5s",s.style.opacity="0",s.style.transform="scale(0.8)",setTimeout(()=>{s.remove(),this.app.querySelectorAll(".story-card").length===0&&this.render([])},500))}})}showNotification(a){let t=document.getElementById("global-notification");t||(t=document.createElement("div"),t.id="global-notification",t.style.position="fixed",t.style.bottom="20px",t.style.left="50%",t.style.transform="translateX(-50%) translateY(100px)",t.style.backgroundColor="#2ecc71",t.style.color="white",t.style.padding="15px 20px",t.style.borderRadius="5px",t.style.boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)",t.style.zIndex="1000",t.style.opacity="0",t.style.transition="transform 0.3s, opacity 0.3s",document.body.appendChild(t)),t.textContent=a,setTimeout(()=>{t.style.opacity="1",t.style.transform="translateX(-50%) translateY(0)"},10),setTimeout(()=>{t.style.opacity="0",t.style.transform="translateX(-50%) translateY(100px)"},3e3)}onRetry(a){const t=this.app.querySelector(".retry-button");t&&t.addEventListener("click",a)}cleanup(){this.maps.forEach(a=>{a&&a.remove()}),this.maps.clear()}}export{c as FavoriteStoriesView};
