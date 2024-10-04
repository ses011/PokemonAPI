
const handleResponse = (response) => {
    const content = document.querySelector("#display");
    
    switch(response.status) {
        case 200: //Success
          content.innerHTML = `<b>Success</b>`;
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

const sendFetch = async (data) => {
    response = await fetch(data);
    handleResponse(response);
}

const init = () => {
    const searchBTN = document.querySelector("#search");


    searchBTN.onclick = () => {

    };
}

window.onload = init;  