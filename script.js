const FEEDS = 'feeds';
const FEED_ID = 'feed_id';
const EDIT_FEED = 'EDIT_FEED';
const REPLY_TO_FEED = 'REPLY_TO_FEED';

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

function getEditFeedId() {
    let value = localStorage.getItem(EDIT_FEED);
    if(value){
        return parseInt(value);
    } else {
        return undefined;
    }
}
function setEditFeed(value) {
    localStorage.setItem(EDIT_FEED, value);
}
function getReplyFeedId() {
    let value = localStorage.getItem(REPLY_TO_FEED);
    if(value){
        return parseInt(value);
    } else {
        return undefined;
    }
}
function setReplyFeed(value) {
    const id =  getReplyFeedId();
    if(id === value){
        localStorage.setItem(REPLY_TO_FEED, -1);
    } else {
        localStorage.setItem(REPLY_TO_FEED, value);
    }
}

const addFeed = (value) => {

  const feeds = getFeedList();
  
  if(!value.key){
    const key = parseInt(localStorage.getItem(FEED_ID));
    localStorage.setItem(FEED_ID, key+1);

    value.key = key;
  }
  feeds[value.key] = value;

  localStorage.setItem(FEEDS, JSON.stringify(feeds));
  
};

const deleteFeed = (key) => {
    let feeds = getFeedList();
    delete feeds[key];
    localStorage.setItem(FEEDS, JSON.stringify(feeds));
}

const updateFeedUI = () => {
    const event = new Event('updateFeed');
    document.dispatchEvent(event);
}

const updateFeed = (feed) => {
    let feeds = getFeedList();
    feeds[feed.key] = feed;
    localStorage.setItem(FEEDS, JSON.stringify(feeds));
}

function likeImgLinkByValue(value) {
    if(value){
        return 'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/025/original/state_clicked.png?1706888455';
    } else {
        return 'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/029/original/heart.png?1706888679';
    }
}

const localStorageSetHandler = (e) => {
    const feeds = getFeedList();

    const feedContainer = document.querySelector("#feed-container");

    feedContainer.innerHTML = "";
    const editFeedId = getEditFeedId();

    for(let feedKey of Object.keys(feeds)){
        const feed = feeds[feedKey];
        if(feed['type'] !== 'feed')continue;

        let componentHtml = `
            <div class="feed-with-comment-container" data-feed-id="${feed.key}">
                <div class="feed">
                    <div>
                        <img src="${feed['img']}"
                            alt="person" />
                    </div>
                    <div style="flex-grow: 1;">
                        <div class="flex space-between">
                            <div><strong>${feed['name']}</strong> <span>@${feed['handle']}</span></div>
                            <div><img
                                    src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/028/original/edit.png?1706888661"
                                    alt="edit" onclick="handleEdit(${feed.key})">
                                <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/027/original/delete.png?1706888643"
                                    alt="delete" onclick="handleDelete(${feed.key})">
                            </div>
                        </div>
                        <textarea ${(feed.key === editFeedId)?"":"readonly"} >${feed['body']}</textarea>
                        ${
                            (feed.key === editFeedId)?(
                                `
                                <div class="flex justify-end">
                                    <button class="escape" onclick="onEditPostCancel(${feed.key})">Cancel</button>
                                    <button class="primary" onclick="onEditPostSave(${feed.key})">Post</button>
                                </div>`
                            ):(
                                `
                                <div>
                                    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/026/original/comment.png?1706888619"
                                        alt="comment" onclick="handleComment(${feed.key})">
                                    <img src="${likeImgLinkByValue(feed.like)}"
                                        alt="heart" onclick="handleLike(${feed.key})">
                                </div>
                                `
                            )
                        }
                    </div>
                </div>
                
        `;

        if(feed.key === getReplyFeedId()){
            componentHtml += `
                <div class="feed-editor comment">
                    <div>
                        <div class="flex flex-start">
                            <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739"
                                alt="person" />
                            <textarea name="" id="reply-text" placeholder="Type your thoughts here..."
                                rows="6"></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button class="escape" onclick="handleReplyPostCancel(${feed.key})">Cancel</button>
                            <button class="primary" onclick="handleReplyPostSave(${feed.key})">Comment</button>
                        </div>
                        
                    </div>
                </div>
            `;
        }

        for(let commentKey of feed.comments){
            const comment = feeds[commentKey];
            componentHtml += `
                    <div class="feed comment" data-feed-id="${commentKey}">
                    <div>
                        <img src="${comment['img']}"
                            alt="person" />
                    </div>
                    <div style="flex-grow: 1;">
                        <div class="flex space-between">
                            <div><strong>${comment['name']}</strong> <span>@${comment['handle']}</span></div>
                            <div><img
                                    src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/028/original/edit.png?1706888661"
                                    alt="edit" onclick="handleEdit(${comment.key})">
                                <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/027/original/delete.png?1706888643"
                                    alt="delete" onclick="handleDelete(${comment.key})">
                            </div>
                        </div>
                        <textarea ${(comment.key === editFeedId)?"":"readonly"} >${comment['body']}</textarea>
                        ${
                            (comment.key === editFeedId)?(
                                `
                                <div class="flex justify-end">
                                    <button class="escape" onclick="onEditPostCancel()">Cancel</button>
                                    <button class="primary" onclick="onEditPostSave(${comment.key})">Post</button>
                                </div>`
                            ):(
                                `
                                <div>
                                    <img src="${likeImgLinkByValue(comment.like)}"
                                        alt="heart" onclick="handleLike(${comment.key})">
                                </div>
                                `
                            )
                        }
                    </div>
                </div>
            `;
        }

        componentHtml += '</div>';


        feedContainer.insertAdjacentHTML("beforeend", componentHtml);
        
    }
};
function handleReplyPostCancel(key) {
    setReplyFeed(-1);
    updateFeedUI();
}
function handleReplyPostSave(key) {
    const commentText = document.querySelector('#reply-text');
    const comment = {
        "name": "Joanne Graham",
        "handle": "joannegraham",
        "body": commentText.value,
        "img": "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739",
        "like": false,
        "type": 'comment',
        "parent": key,
    };
    commentText.value = "";

    addFeed(comment);

    const feed = getFeedList()[key];
    feed.comments = [comment.key, ...feed.comments];

    setReplyFeed(-1);
    updateFeed(feed);
    updateFeedUI();
}

function onEditPostSave(key) {
    const textarea = document.querySelector(`*[data-feed-id="${key}"] textarea`);
    const text = textarea.value;

    const feed = getFeedList()[key];
    feed['body'] = text;
    setEditFeed(-1);
    updateFeed(feed);
    updateFeedUI();
}
function onEditPostCancel() {
    setEditFeed(-1);
    updateFeedUI();
}
function handleEdit(key) {
    setEditFeed(key);
    updateFeedUI();
}
function handleDelete(key) {
    const feed = getFeedList()[key];
    if(!feed)return;
    deleteFeed(key);

    if(feed.comments){
        for(let comment of feed.comments){
            deleteFeed(comment);
        }
    }

    if(feed.parent){
        const parent = getFeedList()[feed.parent];
        parent.comments = parent.comments.filter((k) => k !== key);
        updateFeed(parent);
    }

    updateFeedUI();
}
function handleComment(key) {
    setReplyFeed(key);
    updateFeedUI();
}
function handleLike(key){
    const feed = getFeedList()[key];
    feed['like'] = !feed['like'];
    updateFeed(feed);
    updateFeedUI();
}


document.addEventListener("updateFeed", localStorageSetHandler, false);

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
        "img": "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739",
        "like": false,
        "type": 'feed',
    };
    
    addFeed(feed);
    updateFeedUI();
};


(function initDB() {
    function setValue(key, initValue) {
        let value = localStorage.getItem(key);
        if(!value){
            localStorage.setItem(key, initValue);
        }
    }
    setValue(FEED_ID, 1);
    setValue(FEEDS, '{}');
    setValue(REPLY_TO_FEED, -1);
    updateFeed(-1, {
        "name": "Joanne Graham",
        "handle": "joannegraham",
        "body": "",
        "comments": [],
        "img": "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739",
        "like": false,
        "type": 'feed',
    });
}());
localStorageSetHandler({});