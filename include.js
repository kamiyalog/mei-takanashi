async function include(id, file){

const response = await fetch(file);

const html = await response.text();

document.getElementById(id).innerHTML = html;

}

include("header","header.html");

include("footer","footer.html");

include("profile","profile.html");