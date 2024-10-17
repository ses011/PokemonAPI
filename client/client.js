
const handleResponse = (response) => {
  const content = document.querySelector("#display");
  console.log(response);

  response.text().then((resText) => {

    switch (response.status) {
      case 200: //Success
        if (response.headers.get('content-type') === "application/json") {
          const parsedRes = JSON.parse(resText);
          content.innerHTML = ''
          for (let poke of parsedRes) {
            content.innerHTML += `<div class="pokeResponses"><h3>#${poke.id}- ${poke.name}</h3><br><img src="${poke.img}"</img></div>`;
          }
        }

        break;
      case 204:
        content.innerHTML = `<b>${resText}<b/>`;
        break;
      case 400: //Bad Request
        content.innerHTML = `<b>${resText}</b>`;
        break;
      case 404: //Not Found
        content.innerHTML = `<b>Not Found</b>`;
        break;
      default: //Anything Else
        content.innerHTML = `<p>Status Code not Implemented By Client</p>`;
        break;
    }
  })
}

const sendFetch = async (url, options) => {
  console.log(url);
  const fetchPromise = fetch(url, options);
  fetchPromise.then((response) => handleResponse(response));
}

const init = () => {
  const postOptions = {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application.json'
    }
  }

  const searchName = document.querySelector("#searchName");
  const searchType = document.querySelector("#searchType");
  const searchEffective = document.querySelector("#searchEffective");
  const getAll = document.querySelector("#searchAll");
  const addBTN = document.querySelector("#addPokemon");
  const editBTN = document.querySelector("#editPokemon");

  searchName.onclick = () => {
    let url = "/searchName?";
    let options = {};
    const nameField = document.querySelector("#nameField").value.trim();
    url += `name=${nameField}`;
    sendFetch(url, options);
  }

  searchType.onclick = () => {
    let url = "/searchType?";
    let options = {};
    const type = document.querySelector("#type").value;
    url += `type=${type}`;
    sendFetch(url, options);
  }

  searchEffective.onclick = () => {
    let url = "/searchEffective?";
    let options = {};
    const effective = document.querySelector("#effective").value;
    url += `effective=${effective}`;
    sendFetch(url, options);
  }

  getAll.onclick = () => {
    let url = "/getAll";
    let options = {};
    sendFetch(url, options);
  }

  addBTN.onclick = (e) => {
    let options = {};
    const url = "/addPokemon";
    let body = "";

    const nameField = document.querySelector("#addNameField").value.trim();
    const heightField = document.querySelector("#addHeightField").value;
    const weightField = document.querySelector("#addWeightField").value;
    const type1 = document.querySelector("#addType1").value;
    const type2 = document.querySelector("#addType2").value;

    
    if (nameField != "") {
      body += `name=${nameField}&`;
    }
    if (heightField != "") {
      body += `height=${heightField}&`;
    }
    if (weightField != "") {
      body += `weight=${weightField}&`;
    }
    if (type1 != "null") {
      body += `type1=${type1}&`;
    }
    if (type2 != "null") {
      body += `type2=${type2}&`;
    }
    options = postOptions;
    options.body = body;

    sendFetch(url, options);
  }

  editBTN.onclick = (e) => {
    const url = "/editPokemon";
    let body = "";
    let options = {};

    const idField = document.querySelector("#editIdField").value;
    const nameField = document.querySelector("#editNameField").value.trim();
    const heightField = document.querySelector("#editHeightField").value;
    const weightField = document.querySelector("#editWeightField").value;
    const type1 = document.querySelector("#editType1").value;
    const type2 = document.querySelector("#editType2").value;

    if (idField != "") {
      body += `id=${idField}&`
    }
    if (nameField != "") {
      body += `name=${nameField}&`;
    }
    if (heightField != "") {
      body += `height=${heightField}&`;
    }
    if (weightField != "") {
      body += `weight=${weightField}&`;
    }
    if (type1 != "null") {
      body += `type1=${type1}&`;
    }
    if (type2 != "null") {
      body += `type2=${type2}&`;
    }
    options = postOptions;
    options.body = body;

    sendFetch(url, options);
  }

  
}

window.onload = init;  