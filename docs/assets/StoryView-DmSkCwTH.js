import{M as n}from"./MapView-BIYUnBjD.js";import{M as o}from"./MapService-wUwhiCd_.js";import"./index-CKSsnL6G.js";class h{constructor(){this.app=document.querySelector("#app"),this.mapView=new n,this.markers=[],this.maps=new Map}showLoading(){this.app.innerHTML=`
      <div class="loading-state" role="alert" aria-busy="true">
        <div class="loading-spinner"></div>
        <p>Loading stories...</p>
      </div>
    `}showError(e){this.app.innerHTML=`
      <div class="error-state" role="alert">
        <h2>Error</h2>
        <p>${e}</p>
        <button class="button retry-button">Try Again</button>
      </div>
    `}render(e=[]){if(e.length===0){this.app.innerHTML=`
        <div class="empty-state">
          <h2>No Stories Found</h2>
          <p>Be the first to share your story!</p>
          <a href="#/add-story" class="button">Add Story</a>
        </div>
      `;return}this.app.innerHTML=`
      <style>
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

        .favorites-link-container {
          margin: 20px 0;
          text-align: center;
        }

        .favorites-link {
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
      <div id="stories" class="stories-container">
        <h1>Stories</h1>
        <div class="stories-grid">
          ${e.map(t=>this.createStoryCard(t)).join("")}
        </div>
        <div class="favorites-link-container">
          <a href="#/favorites" class="button favorites-link">Lihat Cerita Favorit</a>
        </div>
      </div>
      <div class="stories-location-container">
        <h2>Stories Location</h2>
        <div id="stories-map" class="stories-map"></div>
      </div>
    `,this.setupEventListeners(),this.initializeMaps(e)}createStoryCard(e){return`
      <article class="story-card" data-story-id="${e.id}">
        <div class="story-image-container">
          <img src="${e.photoUrl}" alt="${e.description}" class="story-image">
        </div>
        ${e.lat&&e.lon?`
          <div class="story-map-container">
            <div id="map-${e.id}" class="story-map"></div>
            <p id="address-${e.id}" class="story-address" aria-live="polite">Loading location...</p>
          </div>
        `:""}
        <div class="story-content">
          <h2>${e.name}</h2>
          <p>${e.description}</p>
          <div class="story-meta">
            <span class="story-date">${new Date(e.createdAt).toLocaleDateString()}</span>
            <div class="story-actions">
              <a href="#/stories/${e.id}" class="button story-detail-button">View Detail</a>
              <favorite-button 
                story-id="${e.id}" 
                story-data='${JSON.stringify(e).replace(/'/g,"&#39;")}'>
              </favorite-button>
            </div>
          </div>
        </div>
      </article>
    `}async initializeMaps(e){try{const t=await o.initMap("stories-map",{center:[106.8456,-6.2088],zoom:10,interactive:!0});t&&e.forEach(i=>{i.lat&&i.lon&&o.addMarker(t,i.lat,i.lon,i.name)})}catch(t){console.error("Failed to initialize main map:",t),this.showMapError("stories-map")}for(const t of e)if(t.lat&&t.lon)try{if(document.getElementById(`map-${t.id}`)){const a=await o.initSmallMap(`map-${t.id}`,{center:[t.lon,t.lat],zoom:14,interactive:!1});if(a){await o.addMarker(a,t.lat,t.lon,t.name),this.maps.set(t.id,a);try{const s=await o.getAddress(t.lat,t.lon);this.updateAddress(t.id,s)}catch(s){console.error(`Failed to get address for story ${t.id}:`,s),this.updateAddress(t.id,`Location: ${t.lat.toFixed(4)}, ${t.lon.toFixed(4)}`)}}}}catch(i){console.error(`Failed to load map for story ${t.id}:`,i),this.showMapError(`map-${t.id}`,t.lat,t.lon)}}updateAddress(e,t){const i=document.getElementById(`address-${e}`);i&&(i.textContent=t)}showMapError(e,t,i){const a=document.getElementById(e);a&&(a.innerHTML=`
        <div class="map-fallback">
          ${t&&i?`<p>Location: ${t.toFixed(4)}, ${i.toFixed(4)}</p>`:"<p>Failed to load map</p>"}
        </div>
      `)}setupEventListeners(){this.app.querySelectorAll(".story-detail-button").forEach(t=>{t.addEventListener("click",i=>{i.preventDefault();const a=t.getAttribute("href");window.location.hash=a})}),this.app.addEventListener("favorite-changed",t=>{const{storyId:i,isFavorite:a}=t.detail;if(this.app.querySelector(`.story-card[data-story-id="${i}"] favorite-button`)){const r=a?"Cerita berhasil ditambahkan ke favorit":"Cerita berhasil dihapus dari favorit";this.showNotification(r)}})}showNotification(e){let t=document.getElementById("global-notification");t||(t=document.createElement("div"),t.id="global-notification",t.style.position="fixed",t.style.bottom="20px",t.style.left="50%",t.style.transform="translateX(-50%) translateY(100px)",t.style.backgroundColor="#2ecc71",t.style.color="white",t.style.padding="15px 20px",t.style.borderRadius="5px",t.style.boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)",t.style.zIndex="1000",t.style.opacity="0",t.style.transition="transform 0.3s, opacity 0.3s",document.body.appendChild(t)),t.textContent=e,setTimeout(()=>{t.style.opacity="1",t.style.transform="translateX(-50%) translateY(0)"},10),setTimeout(()=>{t.style.opacity="0",t.style.transform="translateX(-50%) translateY(100px)"},3e3)}onRetry(e){const t=this.app.querySelector(".retry-button");t&&t.addEventListener("click",e)}cleanup(){this.maps.forEach(e=>{e&&e.remove()}),this.maps.clear()}}export{h as StoryView};
