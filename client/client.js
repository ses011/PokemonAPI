
const handleResponse = (response) => {
    const content = document.querySelector("#display");
    console.log(response);

    switch(response.status) {
        case 200: //Success
          content.innerHTML = `<b>${JSON.stringify(response)}</b>`;
          break;
        case 204:
          content.innerHTML = `<b>No data fits those search parameters- try a less specific search<b/>`;
          break;
        case 400: //Bad Request
          content.innerHTML = `<b>Bad Request</b>`;
          break;
        case 404: //Not Found
          content.innerHTML = `<b>Not Found</b>`;
          break;
        default: //Anything Else
          content.innerHTML = `<p>Status Code not Implemented By Client</p>`;
          break;
    }
}

const sendFetch = async (url, options) => {
    console.log(url);
    const fetchPromise = fetch(url, options);
    fetchPromise.then((response) => handleResponse(response));
}

const init = () => {
    const searchBTN = document.querySelector("#search");
    const addBTN = document.querySelector("#addPokemon");
    const editBTN = document.querySelector("#editPokemon");

    let url = "";
    const options = { };

    searchBTN.onclick = () => {
      const nameField = document.querySelector("#nameField").value.trim();
      const type = document.querySelector("#type").value;
      const effective = document.querySelector("#effective").value;

      options.method = "GET";
      url = "/search?"

      if (nameField != "") {
        url += `name=${nameField}&`;
      }
      if (type != "null") {
        url += `type=${type}&`;
      }
      if (effective != "null") {
        url += `effective=${effective}&`;
      }

      sendFetch(url, options);
    };

    addBTN.onclick = () => {
      const nameField = document.querySelector("#addNameField").value.trim();
      const heightField = document.querySelector("#addHeightField").value;
      const weightField = document.querySelector("#addWeightField").value;
      const type1 = document.querySelector("#addType1").value;
      const type2 = document.querySelector("#addType2").value;
      
      options.method = "POST";
      url = addBTN.action;

      if (nameField != "") {
        url += `name=${nameField}&`;
      }
      if (heightField != "") {
        url += `height=${heightField}&`;
      }
      if (weightField != "") {
        url += `weight=${weightField}&`;
      }
      if (type1 != "null") {
        url += `type1=${type1}&`;
      }
      if (type2 != "null") {
        url += `type2=${type2}&`;
      }

      sendFetch(url, options);
    }

    editBTN.onclick = () => {
      options.method = "POST";
      url = editBTN.action;

      // TODO
    }
}

window.onload = init;  