let postsArray = []
fetch('../data.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(post => postsArray.push(post));
    renderPosts(4);
    createButton();
  })
  .catch(error => console.error(error));

const preview = document.querySelector('.preview');
const layout = document.querySelector('.layout');
const loadMoreBtn = document.createElement('button');
loadMoreBtn.textContent = 'LOAD MORE'
loadMoreBtn.id = "load-more-button";
let index = 4;
let postLikesMap = new Map();

function createCard(post, postId) {
  let dateString = post.date;
  let tempDate = new Date(dateString);
  let formattedDate = tempDate.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  let sourceTypeIconPath = (post.source_type === 'facebook') ? '../icons/facebook.svg' : '../icons/instagram-logo.svg';
  const cardElement = document.createElement('div');

  cardElement.classList.add('card');
  const profileImg = document.createElement('img');
  profileImg.src = post.profile_image;
  profileImg.alt = post.name;
  profileImg.classList.add("profile-picture");
  const name = document.createElement('h2');
  name.textContent = post.name;
  name.classList.add('name-h2');
  const date = document.createElement('p');
  date.textContent = formattedDate;
  date.classList.add("date-paragraph");
  const linkTag = document.createElement('a');
  linkTag.href = post.source_link;
  const sourceTypeImg = document.createElement('img');
  sourceTypeImg.src = sourceTypeIconPath;
  sourceTypeImg.alt = 'Source';
  sourceTypeImg.classList.add("source-image");
  linkTag.appendChild(sourceTypeImg);
  const postImg = document.createElement('img');
  postImg.src = post.image;
  postImg.alt = 'Content'
  postImg.classList.add("post-image");
  const caption = document.createElement('p');
  caption.textContent = post.caption;
  caption.classList.add("caption");
  const likeIcon = document.createElement('img');
  likeIcon.src = '../icons/heart.svg';
  likeIcon.alt = 'Like';
  likeIcon.style.height = "25px";
  if (postLikesMap.get(postId)) {
    linkTag.classList.add('liked');
  }
  likeIcon.addEventListener('click', () => {
    likeIcon.classList.toggle('liked');
    postLikesMap.set(postId, !postLikesMap.get(postId));
    if (!postLikesMap.get(postId)) {
      likesCount.textContent = post.likes;
    } else {
      likesCount.textContent = parseInt(post.likes) + 1;
    }
  });
  likeIcon.classList.add("like-icon");
  const likesCount = document.createElement('p');
  likesCount.textContent = post.likes;
  likesCount.classList.add('likes-count')
  cardElement.appendChild(profileImg);
  cardElement.appendChild(name);
  cardElement.appendChild(date);
  cardElement.appendChild(linkTag);
  cardElement.appendChild(postImg);
  cardElement.appendChild(caption);
  cardElement.appendChild(likeIcon);
  cardElement.appendChild(likesCount);

  return cardElement;
}

function renderPosts(numPosts) {
  for (let i = 0; i < numPosts && i < postsArray.length; i++) {
    layout.appendChild(createCard(postsArray[i], i));
  }
  if (numPosts >= postsArray.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
  for (let i = 0; i < postsArray.length; i++) {
    postLikesMap.set(i, false);
  }
}

function createButton() {
  loadMoreBtn.addEventListener('click', () => {
    for (let i = index; i < index + 4 && i < postsArray.length; i++) {
      layout.appendChild(createCard(postsArray[i], i));
    }
    index += 4;
    if (index === postsArray.length) {
      loadMoreBtn.style.display = 'none';
    }
    const sourceRadioButtons = document.getElementsByName('filterBySource');
    let selectedOptionValue;

    for (let i = 0; i < sourceRadioButtons.length; i++) {
      if (sourceRadioButtons[i].checked) {
        selectedOptionValue = sourceRadioButtons[i].value;
        break;
      }
    }
    handleSourceChange(selectedOptionValue);
  });
  loadMoreBtn.classList.add("load-more-button");
  preview.appendChild(loadMoreBtn);
}

const backgroundColorField = document.querySelector("#cardBackgroundColor");
backgroundColorField.addEventListener('input', (event) => {
  const cards = document.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    let newColor = event.target.value;
    if (newColor[0] !== "#") {
      newColor = "#" + newColor;
    }
    if (newColor === "#") {
      newColor = "";
    }
    cards[i].style.backgroundColor = newColor;
  }
})

const lightThemeRadio = document.querySelector('#lightTheme');
const darkThemeRadio = document.querySelector('#darkTheme');

lightThemeRadio.addEventListener('change', handleThemeChange);
darkThemeRadio.addEventListener('change', handleThemeChange);

function handleThemeChange(event) {
  const theme = event.target.value;
  const cards = document.getElementsByClassName("card");
  if (theme === "lightTheme") {
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.backgroundColor = "#ffffff";
      cards[i].style.color = "#000000";
    }
  }
  else if (theme === "darkTheme") {
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.backgroundColor = "#000000";
      cards[i].style.color = "#ffffff";
    }
  }
}

const cardSpaceBetweenField = document.querySelector("#cardSpaceBetween");
cardSpaceBetweenField.addEventListener('input', (event) => {
  const cards = document.getElementsByClassName("card");
  let value = event.target.value;
  if (value === "") {
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.margin = "10px";
    }
  } else {
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.margin = `${parseInt(value) / 2}px`;
    }
  }
})

const numberOfColumnsField = document.querySelector("#numberOfColumns");
numberOfColumnsField.addEventListener('change', updateLayout);
function updateLayout() {
  let columns = 2;
  if (numberOfColumnsField.value !== "dynamic") {
    columns = parseInt(numberOfColumnsField.value);
  }
  const cards = document.getElementsByClassName("card");
  const flexBasis = `calc(${100 / columns}% - 64px)`;
  console.log(flexBasis)
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.flexBasis = flexBasis;
  }
}

const all = document.querySelector("#all");
const facebook = document.querySelector('#facebook');
const twitter = document.querySelector('#twitter');
const instagram = document.querySelector('#instagram');

all.addEventListener('change', handleSourceChangeFromEvent);
facebook.addEventListener('change', handleSourceChangeFromEvent);
twitter.addEventListener('change', handleSourceChangeFromEvent);
instagram.addEventListener('change', handleSourceChangeFromEvent);

function handleSourceChangeFromEvent(event) {
  const source = event.target.value;
  handleSourceChange(source);
}

function handleSourceChange(sourceString) {
  const cards = document.getElementsByClassName("card");
  if (sourceString !== "all") {
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].querySelector('a>img').src.includes(sourceString)) {
        cards[i].style.display = "flex";
      }
      else {
        cards[i].style.display = "none";
      }
    }
  }
  else {
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.display = "flex"
    }
  }
}