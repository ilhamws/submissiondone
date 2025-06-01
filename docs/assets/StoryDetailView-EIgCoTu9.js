import{M as a}from"./MapService-wUwhiCd_.js";import"./index-CKSsnL6G.js";class d{constructor(){this.map=null,this.marker=null}render(e){return`
      <style>
        .story-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          margin-top: 20px;
        }
        
        .story-actions .button {
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
        
        @media (min-width: 768px) {
          .story-actions {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
          }
          
          .story-actions .button,
          .story-actions favorite-button {
            width: auto;
            min-width: 200px;
            max-width: 300px;
          }
        }
      </style>
      <section class="story-detail view-transition" aria-labelledby="story-heading">
        <h1 id="story-heading">${e.name}</h1>
        <img src="${e.photoUrl}" alt="${e.name}'s story" loading="lazy" class="story-image">
        <p class="story-description">${e.description}</p>
        <time datetime="${e.createdAt}">${new Date(e.createdAt).toLocaleDateString()}</time>
        <div id="story-map" style="height: 400px; width: 100%; border-radius: 8px; margin: 20px 0;"></div>
        <p id="story-address" aria-live="polite">Loading location...</p>
        <div class="story-actions">
          <a href="#/stories" class="button secondary">Back to Stories</a>
          <favorite-button 
            story-id="${e.id}" 
            story-data='${JSON.stringify(e).replace(/'/g,"&#39;")}'>
          </favorite-button>
        </div>
      </section>
    `}renderStory(e){const t=document.getElementById("app");t&&(t.innerHTML=this.render(e),this.setupEventListeners())}setupEventListeners(){const e=document.getElementById("app");e&&e.addEventListener("favorite-changed",t=>{const{isFavorite:i}=t.detail,o=i?"Cerita berhasil ditambahkan ke favorit":"Cerita berhasil dihapus dari favorit";this.showNotification(o)})}showNotification(e){let t=document.getElementById("global-notification");t||(t=document.createElement("div"),t.id="global-notification",t.style.position="fixed",t.style.bottom="20px",t.style.left="50%",t.style.transform="translateX(-50%) translateY(100px)",t.style.backgroundColor="#2ecc71",t.style.color="white",t.style.padding="15px 20px",t.style.borderRadius="5px",t.style.boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)",t.style.zIndex="1000",t.style.opacity="0",t.style.transition="transform 0.3s, opacity 0.3s",document.body.appendChild(t)),t.textContent=e,setTimeout(()=>{t.style.opacity="1",t.style.transform="translateX(-50%) translateY(0)"},10),setTimeout(()=>{t.style.opacity="0",t.style.transform="translateX(-50%) translateY(100px)"},3e3)}async initMap(e,t){if(this.map=await a.initMap("story-map",{center:[t,e],zoom:14,interactive:!0}),!this.map)throw new Error("Map initialization failed")}async addMarker(e,t,i){this.marker=await a.addMarker(this.map,e,t,i)}async getAddress(e,t){return await a.getAddress(e,t)}updateAddress(e){const t=document.getElementById("story-address");t&&(t.textContent=e)}showMapError(e,t){const i=document.getElementById("story-map");i&&(i.innerHTML=`
        <div class="map-fallback">
          <p>Location: ${e.toFixed(4)}, ${t.toFixed(4)}</p>
        </div>
      `)}showError(e){const t=document.getElementById("app");t&&(t.innerHTML=`
        <div class="error-state">
          <h1>Failed to Load Story</h1>
          <p>${e}</p>
          <a href="#/stories" class="button">Back to Stories</a>
        </div>
      `)}}export{d as StoryDetailView};
