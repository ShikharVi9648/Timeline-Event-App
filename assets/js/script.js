document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".mySwiper", {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // breakpoints: {
    //   320: { slidesPerView: 1, spaceBetween: 10 },
    //   640: { slidesPerView: 1, spaceBetween: 20 },
    //   1024: { slidesPerView: 1, spaceBetween: 30 },
    // },
  });

  const apiKey = "Enter Your Api KEy";
  const artistName = "Paris";
  const swiperWrapper = document.getElementById("swiper-wrapper");
  const mainProfileImage = document.getElementById("main-profile-image");

  // Fetch data
  async function getLiveConcertData(artist) {
    const now = new Date().toISOString().slice(0, 19) + "Z";
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=${encodeURIComponent(
      artist
    )}&countryCode=FR&size=6&sort=date,asc&startDateTime=${now}`;

    try {
      const response = await fetch(apiUrl);
      // FIX 1: Wrap error message in backticks
      if (!response.ok)
        throw new Error(`API error (Status: ${response.status})`);
      const data = await response.json();

      const events = data._embedded?.events || [];
      if (events.length === 0) {
        // FIX 2: Wrap HTML in backticks to create a string
        swiperWrapper.innerHTML = `<p style="text-align:center; color:#fff">No concerts found for "${artist}".</p>`;
        return;
      }

      swiperWrapper.innerHTML = "";

      // Add events to swiper
      events.slice(0, 6).forEach((event) => {
        swiperWrapper.insertAdjacentHTML("beforeend", createSlideHTML(event));
      });

      // Set main image from first event
      const firstEventImage = events[0].images?.[0]?.url;
      if (firstEventImage) mainProfileImage.src = firstEventImage;

      swiper.update();
    } catch (error) {
      console.error("API fetch error:", error);
      // FIX 3: Wrap HTML in backticks to create a string
      swiperWrapper.innerHTML = `<p style="text-align:center; color:#fff">Error loading concerts.</p>`;
    }
  }
  // Create Slide
  function createSlideHTML(event) {
    const artist = event._embedded?.attractions?.[0]?.name || "Unknown Artist";
    const venue = event._embedded?.venues?.[0]?.name || "Unknown Venue";
    const city = event._embedded?.venues?.[0]?.city?.name || "City";
    const country = event._embedded?.venues?.[0]?.country?.name || "Country";
    const image = event.images?.[0]?.url || "assets/img/default-artist.jpg";
    const bookingUrl = event.url || "#";

    return `
          <div class="swiper-slide">
            <div class="profile-card">
              <figure class="profile-image-container">
                <img src="${image}" alt="${artist}" class="profile-image"/>
              </figure>
              <div class="profile-details">
                <h2 class="profile-name">${artist}</h2>
                <p class="profile-title">Live at ${venue}</p>
                <p class="profile-bio">Join ${artist} for an unforgettable performance.</p>
                <div class="host"><span class="h">Host:</span><span>${artist}</span></div>
                <div class="location">
                  <img src="assets/img/location.png" class="location-icon" />
                  <span>${city}, ${country}</span>
                </div>
                <div class="book-now"><a href="${bookingUrl}" target="_blank">Book Now</a></div>
              </div>
            </div>
          </div>`;
  }

  // Call API
  getLiveConcertData(artistName);
});

