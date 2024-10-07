
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
    const nameField = document.querySelector("#nameField");
    const type = document.querySelector("#type");
    const effective = document.querySelector("#effective");

    const addBTN = document.querySelector("#addPokemon");

    let url = "";
    const options = { };

    searchBTN.onclick = () => {
      options.method = "GET";
      url = "/search?"

      if (nameField.value.trim() != "") {
        url += `name=${nameField.value.trim()}&`;
      }
      if (type.value != "null") {
        url += `type=${type.value}&`;
      }
      if (effective.value != "null") {
        url += `effective=${effective.value}&`;
      }

      sendFetch(url, options);
    };

    addBTN.onclick = () => {
      options.method = "POST";
      url = addBTN.action;

      // TODO
    }
}

window.onload = init;  