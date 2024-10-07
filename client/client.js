
const handleResponse = (response) => {
    const content = document.querySelector("#display");
    console.log(response);

    switch(response.status) {
        case 200: //Success
          content.innerHTML = `<b>${JSON.stringify(response)}</b>`;
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
}

window.onload = init;  