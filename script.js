const FEEDS = 'feeds';
const originalSetItem = localStorage.setItem;

const postButton = document.querySelector('#post-button');
const feedText = document.querySelector('#feed-text');
const postLength = document.querySelector('#post-length');


const getFeedList = () => {
    let feedList = localStorage.getItem(FEEDS);
    if(!feedList){
        feedList = {};
    } else {
        feedList = JSON.parse(feedList);
    }
    return feedList
};

const addFeed = (value) => {
  const event = new Event('addFeed');

  const feeds = getFeedList();
  
  if(!value.key){
    value.key = Object.keys(feeds).length;
    event.key = value.key;
  }
  event.value = value;
  feeds[value.key] = value;

  localStorage.setItem(FEEDS, JSON.stringify(feeds));
  
  document.dispatchEvent(event);
};

const localStorageSetHandler = (e) => {
    const feeds = getFeedList();

    const feedContainer = document.querySelector("#feed-container");

    feedContainer.innerHTML = "";

    for(let feedKey of Object.keys(feeds)){
        const feed = feeds[feedKey];

        const componentHtml = `
        <div class="feed">
        <div>
            <img src="${feed['img']}"
                alt="person" />
        </div>
        <div style="flex-grow: 1;">
            <div class="flex">
                <div><strong>${feed['name']}</strong> <span>@${feed['handle']}</span></div>
                <div><img
                        src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/028/original/edit.png?1706888661"
                        alt="edit">
                    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/027/original/delete.png?1706888643"
                        alt="delete">
                </div>
            </div>
            <textarea name="" id="" cols="30">${feed['body']}</textarea>
            <div>
                <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/026/original/comment.png?1706888619"
                    alt="comment">
                <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/029/original/heart.png?1706888679"
                    alt="heart">
            </div>
        </div>
    </div>
        `;
        
        feedContainer.insertAdjacentHTML("beforeend", componentHtml);
        
    }
};

document.addEventListener("addFeed", localStorageSetHandler, false);

feedText.onkeypress= (e) => {
    const value = e.target.value;
    
    if(value.length > 99){
        e.target.value = value.substring(0, 99);
    }
    postLength.innerText = `${value.length} / 100`;
    
};
postButton.onclick = (event) => {
    const feed = {
        "name": "Joanne Graham",
        "handle": "joannegraham",
        "body": feedText.value,
        "comments": [],
        "img": "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739"
    };
    
    addFeed(feed);
};


// localStorageSetHandler({});