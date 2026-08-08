const API = "http://localhost:5000";

// Character Counter
function updateCount() {
  const content = document.getElementById("content").value;
  document.getElementById("counter").innerText = content.length + " / 500";
}

// Create Blog
async function createBlog(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const content = document.getElementById("content").value.trim();

  const token = localStorage.getItem("token");
  const btn = document.getElementById("btn");

  if (!token) {
    alert("Login required ❌");
    window.location.href = "login.html";
    return;
  }

  if (!title || !category || !content) {
    alert("Please fill all fields.");
    return;
  }

  try {

    btn.innerText = "Posting...";
    btn.disabled = true;

    const res = await fetch(`${API}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({
        title,
        category,
        content
      })
    });

    const data = await res.json();

    if (res.ok) {

      alert("Blog created successfully ✅");

      document.getElementById("title").value = "";
      document.getElementById("category").value = "";
      document.getElementById("content").value = "";

      updateCount();

    } else {

      alert(data.error || data.message || "Failed to create blog ❌");

    }

  } catch (err) {

    console.error(err);
    alert("Server Error ❌");

  }

  btn.innerText = "Post Blog";
  btn.disabled = false;
}

async function deleteBlog(id){

    const answer = confirm("Are you sure you want to delete this blog?");

    if(!answer){
        return;
    }

    try{

        await fetch(API + "/blogs/" + id,{
            method:"DELETE"
        });

        showToast("Blog Deleted Successfully!");

        loadBlogs();

    }
    catch(error){

        alert("Unable to delete blog.");

    }

}