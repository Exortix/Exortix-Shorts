let shortVideosData = []
let currentIndex = (Number(localStorage.getItem("shortsId")) != 0 && !isNaN(localStorage.getItem("shortsId"))) 
? Number(localStorage.getItem("shortsId")) : 0 

getShorts("json/videos.json")


async function getShorts(url) {
  shortVideosData = await fetch(url)
  .then(response => response.json())
  .then(data => {
    displayVideos(data)
    setCurrentIndex(data)
    createSwipe(document.querySelector("#shorts"), currentIndex);
    return data
  })
  .catch(error => console.error(error));
}
function displayVideos(data) {
  document.querySelector(".shorts .shorts-wrap").innerHTML = data.map((video, index) => {
    let videoElement = ""
    switch (video.type) {
      case "file":
          videoElement = `
          <div class="video-wrapper">
          <div class="video">
            <video src="${video.src}" index="${index}" onclick="playpause(this)"  loop="loop"></video>
          </div>
          <div class="details">
            <h2>${video.title}</h2>
            <p>${video.description}</p>
          </div>
          </div>`
        break;
      case "vimeo":
        videoElement = `
        <div class="video-wrapper">
        <div class="video">
          <iframe class="thevideo" src="${video.src}?title=0&portrait=0&byline=0&autoplay=0&loop=1&controls=0" frameborder="0"></iframe>
        </div>
        <div class="details">
          <h2>${video.title}</h2>
          <p>${video.description}</p>
        </div>
        </div>`
        break;
      case "youtube":
        videoElement = `
        <div class="video-wrapper">
        <div class="video">
          <iframe style="z-index:1000" width="360" height="558"  index="${index}" src="${video.src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay; modestbranding;" controls = "disabled" allowfullscreen></iframe>
        </div>
        <div class="details">
          <h2>${video.title}</h2>
          <p>${video.description}</p>
        </div>
        </div>`
        break;
      default:
        videoElement = ``
        break;
    }
    return videoElement;
  });
}
function playpause(ref) {
  if (ref.getAttribute("index") != currentIndex) return;
  ref.paused ? ref.play() : ref.pause();  
}
function setPlay(index) {
  try {
    let videos = document.querySelectorAll(".shorts .shorts-wrap .active");
    for (let index = 0; index < videos.length; index++) {
      const element = videos[index];
      element.classList.remove("active");
      element.pause();
    }
  } catch (error) {
    console.error(error);
  }
  let videoWrapper = document.querySelectorAll(".shorts .shorts-wrap .video-wrapper")[index];
  let video = videoWrapper.querySelector("video");
  video.classList.add("active");
  currentIndex = index
  localStorage.setItem("shortsId", currentIndex)
  video.play();
}
function createSwipe(swipeElement, currentIndex) {
  new Swipe(swipeElement, {
    startSlide: currentIndex,
    draggable: true,
    autoRestart: false,
    continuous: false,
    disableScroll: true,
    stopPropogation: true,
    callback: (index, element) => {
      setPlay(index);
    }
  });
}
function setCurrentIndex(data) {
  if (currentIndex > data.length-1 || currentIndex < 0)
    currentIndex = 0
  if (currentIndex != null)
    localStorage.setItem("shortsId", currentIndex)
}