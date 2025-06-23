document.addEventListener('DOMContentLoaded', main);

function main() {
    displayPosts();
    addNewPostListener();
}

function displayPosts() {
    fetch("http://localhost:3000/posts")
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById("post-list");
            postList.innerHTML = "";

            posts.forEach(post => {
                const listItem = document.createElement('li');
                listItem.className = 'post-list-item';

                const image = document.createElement('img');
                image.src = post.image;
                image.alt = post.title;
                image.style.width = '100px';
                image.style.display = 'block';
                image.style.marginBottom = '10px';

                const title = document.createElement('span');
                title.textContent = post.title;

                listItem.appendChild(image);
                listItem.appendChild(title);

                listItem.addEventListener('click', () => {
                    handlePostClick(post.id);
                });

                postList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading posts:', error));
}

function handlePostClick(postId) {
    fetch(`http://localhost:3000/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const postDetail = document.getElementById("post-detail");
            postDetail.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <p class="author">By ${post.author}</p>
            `;
        })
        .catch(error => console.error('Error loading post details:', error));
}

function addNewPostListener() {
    const form = document.getElementById("new-post-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("new-post-title").value;
        const author = document.getElementById("new-post-author").value;
        const content = document.getElementById("new-post-content").value;
        const image = document.getElementById("new-post-image").value;

        const newPost = {
            title,
            author,
            content,
            image
        };

        addPostToList(newPost);
        form.reset();
    });
}

function addPostToList(post) {
    const postList = document.getElementById("post-list");

    const listItem = document.createElement("li");
    listItem.className = "post-list-item";

    const image = document.createElement("img");
    image.src = post.image;
    image.alt = post.title;
    image.style.width = '100px';
    image.style.display = 'block';
    image.style.marginBottom = '10px';

    const title = document.createElement("span");
    title.textContent = post.title;

    listItem.appendChild(image);
    listItem.appendChild(title);

    listItem.addEventListener("click", () => {
        const postDetail = document.getElementById("post-detail");
        postDetail.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <p class="author">By ${post.author}</p>
        `;
    });

    postList.appendChild(listItem);
}


