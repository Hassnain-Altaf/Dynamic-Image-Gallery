// class photoGallery {
//   constructor() {
//     this.divimages = document.querySelector(".images");
//     this.apiKey = "ffPJdmU2s-KeYWsCgOIxmAPW35eXJxWGKUzLodKlY3w";
//     this.currentFilter = "all"; // Default filter
//   }

//   async fetchImages(img_cnt, filter) {
//     // Fetch images based on filter type
//     let url = `https://api.unsplash.com/photos/random?client_id=${this.apiKey}&count=${img_cnt}`;
//     if (filter !== "all") {
//       // Add filter-specific logic if needed
//       url += `&query=${filter}`;
//     }

//     const response = await fetch(url);
//     const imgData = await response.json();
//     return imgData;
//   }

//   async get_images(img_cnt) {
//     // Fetch and add images based on current filter
//     const imgData = await this.fetchImages(img_cnt, this.currentFilter);
//     this.add_imgs_to_DOM(imgData);
//   }

//   add_imgs_to_DOM(img_data) {
//     // Add new images to DOM
//     let divs = "";
//     img_data.forEach(
//       (img) => (divs += `<img src="${img.urls.regular}" alt="">`)
//     );
//     this.divimages.innerHTML += divs;
//   }
// }

// // Loading handlers
// const loader = document.querySelector(".loader");
// const loadingDots = document.querySelector(".loading-dots");
// const navLinks = document.querySelectorAll(".nav-menu a");

// // Fetch images on page load
// const init_gallery = new photoGallery();
// window.onload = () => {
//   init_gallery
//     .get_images(10)
//     .then(() => {
//       loader.classList.add("hidden");
//     })
//     .catch((err) => {
//       alert("OOPS! Try Again Later");
//       console.log(err);
//     });
// };

// // Show Loading dots and fetch images on scroll
// window.addEventListener("scroll", () => {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   if (clientHeight + scrollTop >= scrollHeight) {
//     loadingDots.classList.remove("hide");
//     init_gallery
//       .get_images(10)
//       .then(() => {
//         loadingDots.classList.add("hide");
//       })
//       .catch((err) => alert("OOPS! Please Try Again Later"));
//   }
// });

// // Handle filter clicks
// navLinks.forEach((link) => {
//   link.addEventListener("click", (e) => {
//     e.preventDefault();
//     const filterType = e.target.getAttribute("data-type");
//     init_gallery.currentFilter = filterType; // Set the new filter
//     init_gallery.divimages.innerHTML = ""; // Clear existing images
//     init_gallery.get_images(10); // Fetch images based on new filter
//   });
// });


// // New code for nav bg :



class PhotoGallery {
  constructor() {
    this.divImages = document.querySelector(".images");
    this.apiKey = "ffPJdmU2s-KeYWsCgOIxmAPW35eXJxWGKUzLodKlY3w";
    this.currentFilter = "all";
    this.loadedImages = {};
  }

  async fetchImages(imgCount, filter) {
    let url = `https://api.unsplash.com/photos/random?client_id=${this.apiKey}&count=${imgCount}`;
    if (filter !== "all") {
      url += `&query=${filter}`;
    }

    const response = await fetch(url);
    const imgData = await response.json();
    return imgData;
  }

  async getImages(imgCount) {
    const imgData = await this.fetchImages(imgCount, this.currentFilter);
    this.addImgsToDOM(imgData);
    if (!this.loadedImages[this.currentFilter]) {
      this.loadedImages[this.currentFilter] = [];
    }
    this.loadedImages[this.currentFilter].push(...imgData);
  }

  addImgsToDOM(imgData) {
    const imgElements = imgData.map(
      (img) => `<img src="${img.urls.regular}" alt="" loading="lazy">`
    ).join('');
    this.divImages.innerHTML += imgElements;
  }
}

const loader = document.querySelector(".loader");
const loadingDots = document.querySelector(".loading-dots");
const navLinks = document.querySelectorAll(".nav-menu a");

const allLink = document.querySelector('a[data-type="all"]');
allLink.classList.add("active");

const initGallery = new PhotoGallery();

window.onload = () => {
  initGallery.getImages(10)
    .then(() => {
      loader.classList.add("hidden");
    })
    .catch((err) => {
      alert("OOPS! Try Again Later");
      console.error(err);
    });
};

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight) {
    loadingDots.classList.remove("hide");
    initGallery.getImages(10)
      .then(() => {
        loadingDots.classList.add("hide");
      })
      .catch((err) => alert("OOPS! Please Try Again Later"));
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    const filterType = e.target.getAttribute("data-type");

    navLinks.forEach((lnk) => lnk.classList.remove("active"));
    e.target.classList.add("active");

    initGallery.currentFilter = filterType;
    initGallery.divImages.innerHTML = "";

    if (filterType === "all") {
      for (const filter in initGallery.loadedImages) {
        initGallery.loadedImages[filter].forEach(
          (img) => (initGallery.divImages.innerHTML += `<img src="${img.urls.regular}" alt="" loading="lazy">`)
        );
      }
    } else {
      if (initGallery.loadedImages[filterType]) {
        initGallery.loadedImages[filterType].forEach(
          (img) => (initGallery.divImages.innerHTML += `<img src="${img.urls.regular}" alt="" loading="lazy">`)
        );
      } else {
        await initGallery.getImages(10);
      }
    }
  });
});
