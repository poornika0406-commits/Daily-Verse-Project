const API = "http://localhost:5000";

const container = document.getElementById("blogsContainer");

/* ==========================
   LOAD BLOGS
========================== */

async function loadBlogs() {

    const search = document.getElementById("search").value.trim();

    const category = document.getElementById("categoryFilter").value;

    let url = `${API}/blogs?search=${encodeURIComponent(search)}`;

    if(category !== ""){
        url += `&category=${encodeURIComponent(category)}`;
    }

    try{

        const response = await fetch(url);

        const blogs = await response.json();

        displayBlogs(blogs);

    }
    catch(error){

        console.error(error);

        container.innerHTML="<h2>Unable to load blogs.</h2>";

    }

}

/* ==========================
   DISPLAY BLOGS
========================== */

function displayBlogs(blogs){

    container.innerHTML="";

    document.getElementById("totalBlogs").innerText =
    `Total Blogs : ${blogs.length}`;

    if(blogs.length===0){

        container.innerHTML="<h2>No Blogs Found</h2>";

        return;

    }

    blogs.forEach(blog=>{

        const card=document.createElement("div");

        card.className="blog-card";

        const date = new Date(blog.createdAt).toLocaleDateString();

        card.innerHTML=`

            <span class="category">
                ${blog.category}
            </span>

            <h2>${blog.title}</h2>

            <p>

            ${blog.content.length>150
            ?blog.content.substring(0,150)+"..."
            :blog.content}

            </p>

            <div class="author">

                ✍️ ${blog.author ? blog.author.email : "Unknown"}

            </div>

            <div class="date">

                📅 ${date}

            </div>

            <div class="buttons">

                <button
                class="read-btn"
                onclick="readMore(\`${blog.content.replace(/`/g,"\\`")}\`)">

                Read More

                </button>

                <button
                class="delete-btn"
                onclick="deleteBlog('${blog._id}')">

                Delete

                </button>

            </div>

        `;

        container.appendChild(card);

    });

}

/* ==========================
   READ MORE
========================== */

function readMore(content){

    showToast(content);

}

/* ==========================
   DELETE BLOG
========================== */

async function deleteBlog(id){

    const token = localStorage.getItem("token");

    if(!token){

        alert("Please login first.");

        window.location.href="login.html";

        return;

    }

    const answer = confirm("Are you sure you want to delete this blog?");

    if(!answer) return;

    try{

        const response = await fetch(`${API}/blogs/${id}`,{

            method:"DELETE",

            headers:{

                "Authorization":`Bearer ${token}`

            }

        });

        const data = await response.json();

        showToast(data.message);

        loadBlogs();

    }

    catch(error){

        console.error(error);

        alert("Delete Failed");

    }

}

/* ==========================
   TOAST
========================== */

function showToast(message){

    const toast=document.getElementById("toast");

    toast.innerText=message;

    toast.style.display="block";

    setTimeout(()=>{

        toast.style.display="none";

    },2500);

}

/* ==========================
   DARK MODE
========================== */

const themeBtn=document.getElementById("themeBtn");

function loadTheme(){

    const theme=localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add("dark");

        themeBtn.innerHTML="☀️";

    }

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML="☀️";

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML="🌙";

    }

});

/* ==========================
   INITIAL LOAD
========================== */

loadTheme();

loadBlogs();