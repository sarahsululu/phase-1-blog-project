document.addEventListener('DOMContentLoaded', main);

const postList = document.getElementById('post-list'); 
const postDetail = document.getElementById('post-detail'); 
const newPostForm = document.getElementById('new-post-form'); 
const newPostTitleInput = document.getElementById('new-post-title');
const newPostContentInput = document.getElementById('new-post-content');
const newPostAuthorInput = document.getElementById('new-post-author');
const editPostForm = document.getElementById('edit-post-form');
const editTitleInput = document.getElementById('edit-title'); 
const editContentInput = document.getElementById('edit-content'); 
const cancelEditButton = document.getElementById('cancel-edit'); 
const detailActions = document.getElementById('detail-actions'); 
const editPostButton = document.getElementById('edit-post-btn'); 
const deletePostButton = document.getElementById('delete-post-btn'); 


const API_BASE_URL = 'http://localhost:3000';

let currentSelectedPostId = null; 
let allFetchedPosts = []; 


async function displayPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json(); 

        allFetchedPosts = posts;

        postList.innerHTML = '';

        posts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.classList.add('post-list-item'); 

            if (post.imageUrl) { 
                const postImage = document.createElement('img');
                postImage.src = post.imageUrl;
                postImage.alt = post.title;
                postImage.classList.add('post-list-image'); 
                postImage.style.width = '50px'; 
                postImage.style.height = '50px';
                postImage.style.borderRadius = '5px';
                postImage.style.marginRight = '10px';
                listItem.appendChild(postImage);
            }

            const postTitleSpan = document.createElement('span');
            postTitleSpan.textContent = post.title;
            listItem.appendChild(postTitleSpan);

            listItem.dataset.postId = post.id;

            listItem.addEventListener('click', () => {
                const currentlySelected = document.querySelector('.post-list-item.selected');
                if (currentlySelected) {
                    currentlySelected.classList.remove('selected');
                }
                listItem.classList.add('selected');

                handlePostClick(post.id);
            });

            postList.appendChild(listItem);
        });

        if (posts.length > 0) {
            handlePostClick(posts[0].id);

            const firstListItem = postList.querySelector(`[data-post-id="${posts[0].id}"]`);
            if (firstListItem) {
                firstListItem.classList.add('selected');
            }
        }

    } catch (error) {
        console.error("Error fetching posts:", error);
        postList.innerHTML = '<li class="loading-message">Failed to load posts. Please ensure JSON Server is running.</li>';
    }
}


async function handlePostClick(postId) {
    editPostForm.classList.add('hidden');
    detailActions.classList.add('hidden');


    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const post = await response.json();

        currentSelectedPostId = post.id;

        postDetail.innerHTML = '';

        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;

        const authorElement = document.createElement('p');
        authorElement.classList.add('author'); 
        authorElement.textContent = `By: ${post.author}`;

        const contentElement = document.createElement('p');
        contentElement.textContent = post.content;

        postDetail.appendChild(titleElement);
        postDetail.appendChild(authorElement);
        postDetail.appendChild(contentElement);

        detailActions.classList.remove('hidden');

    } catch (error) {
        console.error("Error fetching post details:", error);
        postDetail.innerHTML = '<p class="initial-message">Failed to load post details.</p>';
        detailActions.classList.add('hidden'); 
    }
}



function addNewPostListener() {
    newPostForm.addEventListener('submit', async function (e) {
        e.preventDefault(); 

        const title = newPostTitleInput.value.trim();
        const content = newPostContentInput.value.trim();
        const author = newPostAuthorInput.value.trim();
        

        if (!title || !content || !author) {
            alert('Please fill in all fields for the new post.');
            return;
        }

        const newPostData = {
            title: title,
            content: content,
            author: author,
        };

        
        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPostData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const createdPost = await response.json(); 

            
            await displayPosts(); 
            handlePostClick(createdPost.id); 

            newPostForm.reset(); 
            alert('Post created successfully!');

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Check console for details.");
        }
    });
}

function setupEditPostListener() {
    editPostButton.addEventListener('click', function() {
        if (currentSelectedPostId === null) return; 

        const postToEdit = allFetchedPosts.find(post => post.id === currentSelectedPostId);

        if (postToEdit) {

            editTitleInput.value = postToEdit.title;
            editContentInput.value = postToEdit.content;

            postDetail.classList.add('hidden');
            detailActions.classList.add('hidden')

            editPostForm.classList.remove('hidden');
        }
    });

    editPostForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const updatedTitle = editTitleInput.value.trim();
        const updatedContent = editContentInput.value.trim();

        if (!updatedTitle || !updatedContent) {
            alert('Title and content cannot be empty.');
            return;
        }

        const updatedPostData = {
            title: updatedTitle,
            content: updatedContent,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/posts/${currentSelectedPostId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPostData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await displayPosts(); 
            handlePostClick(currentSelectedPostId);
            alert('Post updated successfully!');

        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post. Check console for details.");
        } finally {

            editPostForm.classList.add('hidden');
            postDetail.classList.remove('hidden');
            detailActions.classList.remove('hidden'); 
        }
    });

    cancelEditButton.addEventListener('click', function() {
        editPostForm.classList.add('hidden'); 
        postDetail.classList.remove('hidden'); 
        detailActions.classList.remove('hidden'); 
    });
}

function setupDeletePostListener() {
    deletePostButton.addEventListener('click', async function() {
        if (currentSelectedPostId === null) return; 

        if (!confirm('Are you sure you want to delete this post?')) {
            return; 
        }
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${currentSelectedPostId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Post deleted successfully!');
            await displayPosts(); 
            postDetail.innerHTML = '<p class="initial-message">Select a post from the list to view details.</p>'; 
            detailActions.classList.add('hidden'); 
            currentSelectedPostId = null; 
    
            const currentlySelected = document.querySelector('.post-list-item.selected');
            if (currentlySelected) {
                currentlySelected.classList.remove('selected');
            }

        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Check console for details.");
        }
    });
}

function main() {
    displayPosts();

    addNewPostListener();

    setupEditPostListener();
    setupDeletePostListener();
}



     

