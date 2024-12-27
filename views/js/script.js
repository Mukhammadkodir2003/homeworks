// async function getAuthor() {
//     const accessToken = localStorage.getItem("accessToken")
//     fetch("http://localhost:3030/api/author/all", {
//         method:"GET",
//         headers:{
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json"
//         },
//         mode:"cors"
//     })
//     .then((response) => {
//         if(response.ok){
//             return response.json()
//         }else{
//             console.log("failed response")
//         }
//     })
//     .then((author) => {
//         console.log(author.data)
//         displayAuythor(author.data)
//     })
//     .catch((error) => {
//         console.error("Error", error)
//     })
// }

// function displayAuythor(author){
//     const author_list = document.getElementById("author_list");
//     author.forEach(author => {
//         const listItem = document.createElement("li")
//         listItem.textContent = `${author.author_first_name} ${author.author_last_name} - ${author.author_email}}`
        
//     });

// }