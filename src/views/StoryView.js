import { MapView } from '@/views/MapView';
import { MapService } from '@/services/MapService';

export class StoryView {
  constructor() {
    this.app = document.querySelector('#app');
    this.mapView = new MapView();
    this.markers = [];
    this.maps = new Map();
  }

  showLoading() {
    this.app.innerHTML = `
      <div class="loading-state" role="alert" aria-busy="true">
        <div class="loading-spinner"></div>
        <p>Loading stories...</p>
      </div>
    `;
  }

  showError(message) {
    this.app.innerHTML = `
      <div class="error-state" role="alert">
        <h2>Error</h2>
        <p>${message}</p>
        <button class="button retry-button">Try Again</button>
      </div>
    `;
  }

  render(stories = []) {
    if (stories.length === 0) {
      this.app.innerHTML = `
        <div class="empty-state">
          <h2>No Stories Found</h2>
          <p>Be the first to share your story!</p>
          <a href="#/add-story" class="button">Add Story</a>
        </div>
      `;
      return;
    }

    this.app.innerHTML = `
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
          ${stories.map(story => this.createStoryCard(story)).join('')}
        </div>
        <div class="favorites-link-container">
          <a href="#/favorites" class="button favorites-link">Lihat Cerita Favorit</a>
        </div>
      </div>
      <div class="stories-location-container">
        <h2>Stories Location</h2>
        <div id="stories-map" class="stories-map"></div>
      </div>
    `;

    this.setupEventListeners();
    this.initializeMaps(stories);
  }

  createStoryCard(story) {
    return `
      <article class="story-card" data-story-id="${story.id}">
        <div class="story-image-container">
          <img src="${story.photoUrl}" alt="${story.description}" class="story-image">
        </div>
        ${story.lat && story.lon ? `
          <div class="story-map-container">
            <div id="map-${story.id}" class="story-map"></div>
            <p id="address-${story.id}" class="story-address" aria-live="polite">Loading location...</p>
          </div>
        ` : ''}
        <div class="story-content">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <div class="story-meta">
            <span class="story-date">${new Date(story.createdAt).toLocaleDateString()}</span>
            <div class="story-actions">
              <a href="#/stories/${story.id}" class="button story-detail-button">View Detail</a>
              <favorite-button 
                story-id="${story.id}" 
                story-data='${JSON.stringify(story).replace(/'/g, "&#39;")}'>
              </favorite-button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  async initializeMaps(stories) {
    try {
      const mainMap = await MapService.initMap('stories-map', {
        center: [106.8456, -6.2088],
        zoom: 10,
        interactive: true
      });

      if (mainMap) {
        stories.forEach(story => {
          if (story.lat && story.lon) {
            MapService.addMarker(mainMap, story.lat, story.lon, story.name);
          }
        });
      }
    } catch (error) {
      console.error('Failed to initialize main map:', error);
      this.showMapError('stories-map');
    }

    for (const story of stories) {
      if (story.lat && story.lon) {
        try {
          const mapElement = document.getElementById(`map-${story.id}`);
          if (mapElement) {
            const storyMap = await MapService.initSmallMap(`map-${story.id}`, {
              center: [story.lon, story.lat],
              zoom: 14,
              interactive: false
            });
            
            if (storyMap) {
              await MapService.addMarker(storyMap, story.lat, story.lon, story.name);
              this.maps.set(story.id, storyMap);
              
              try {
                const address = await MapService.getAddress(story.lat, story.lon);
                this.updateAddress(story.id, address);
              } catch (error) {
                console.error(`Failed to get address for story ${story.id}:`, error);
                this.updateAddress(story.id, `Location: ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}`);
              }
            }
          }
        } catch (error) {
          console.error(`Failed to load map for story ${story.id}:`, error);
          this.showMapError(`map-${story.id}`, story.lat, story.lon);
        }
      }
    }
  }

  updateAddress(storyId, address) {
    const addressElement = document.getElementById(`address-${storyId}`);
    if (addressElement) {
      addressElement.textContent = address;
    }
  }

  showMapError(elementId, lat, lon) {
    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = `
        <div class="map-fallback">
          ${lat && lon ? 
            `<p>Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}</p>` :
            `<p>Failed to load map</p>`
          }
        </div>
      `;
    }
  }

  setupEventListeners() {
    const detailButtons = this.app.querySelectorAll('.story-detail-button');
    detailButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const href = button.getAttribute('href');
        window.location.hash = href;
      });
    });

    // Listen for favorite-changed events
    this.app.addEventListener('favorite-changed', (event) => {
      const { storyId, isFavorite } = event.detail;
      
      // Update the UI to reflect the new favorite status
      const favoriteButton = this.app.querySelector(`.story-card[data-story-id="${storyId}"] favorite-button`);
      if (favoriteButton) {
        // The component will update itself, we just need to show a notification
        const message = isFavorite ? 
          'Cerita berhasil ditambahkan ke favorit' : 
          'Cerita berhasil dihapus dari favorit';
        
        // Show a temporary notification
        this.showNotification(message);
      }
    });
  }

  showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('global-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'global-notification';
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%) translateY(100px)';
      notification.style.backgroundColor = '#2ecc71';
      notification.style.color = 'white';
      notification.style.padding = '15px 20px';
      notification.style.borderRadius = '5px';
      notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      notification.style.zIndex = '1000';
      notification.style.opacity = '0';
      notification.style.transition = 'transform 0.3s, opacity 0.3s';
      document.body.appendChild(notification);
    }
    
    // Update message and show
    notification.textContent = message;
    
    // Show notification
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(-50%) translateY(100px)';
    }, 3000);
  }

  onRetry(callback) {
    const retryButton = this.app.querySelector('.retry-button');
    if (retryButton) {
      retryButton.addEventListener('click', callback);
    }
  }

  cleanup() {
    this.maps.forEach(map => {
      if (map) {
        map.remove();
      }
    });
    this.maps.clear();
  }
}