console.log("Hello World!");

const form = document.querySelector("form"); // grabbing an element on the page
const errorElement = document.querySelector(".error-message");
const loadingElement = document.querySelector(".loading");
const mewsElement = document.querySelector(".mews");
const loadMoreElement = document.querySelector("#loadMore");
// const API_URL =
//   window.location.hostname === "127.0.0.1"
//     ? "http://localhost:5000/v2/mews"
//     : "https://meower-api.now.sh/v2/mews";
const API_URL = "http://localhost:5000/mews";

let skip = 0;
let limit = 5;
let loading = false;
let finished = false;

errorElement.style.display ='none';
loadingElement.style.display = '';


form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form); // create new object and put form data inside of content
  const name = formData.get("name"); 
  const content = formData.get("content");
  const mew = {
      name,
      content
    };
    form.style.display = 'none';
    loadingElement.style.display ='';

    fetch(API_URL,{  //fetch is a way to request with server
      method: 'POST',
      body:JSON.stringify(mew),
      headers:{
        'content-type':'application/json'
      }
    }).then(response => response.json()) //define res as json
    .then(createdMew => {
    form.reset();
    setTimeout(() =>{
      form.style.display = '';
    },3000);
    listAllMews();
    loadingElement.style.display ='none';
    });
});
 
listAllMews = () =>{
  mewsElement.innerHTML = "";
  fetch(API_URL).then(response => response.json()) //define res as json
  .then(mews => {
  mews.reverse();
  console.log(mews);
  mews.forEach(mew =>{
    // for each mew add name and content to h3 and p tag and them in div and then .mewsclass
     const div = document.createElement('div');
     const header = document.createElement('h3');
     header.textContent = mew.name;
     const contents = document.createElement('p');
     contents.textContent = mew.content;
     const date = document.createElement('small');
     date.textContent = new Date(mew.created);

     div.appendChild(header);
     div.appendChild(contents);
     div.appendChild(date);
     mewsElement.appendChild(div);
   });
   loadingElement.style.display ='none';
  });
}
document.onload = listAllMews();

