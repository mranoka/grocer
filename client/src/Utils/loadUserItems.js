import fetch from "isomorphic-fetch";

const getUserItems = function(userId) {
    fetch(`/items/all/${userId}`)
    .then((res) => res.json())
    .then(
      (response) => {
          console.log(response)
        return response
      },
      (err) => console.log(err)
    );
}

export default getUserItems; 


 // fetchData() {
  //   fetch("/items/all")
  //     .then((res) => res.json())
  //     .then(
  //       (response) => {
  //         this.setState({
  //           itemsArray: response.items,
  //         });
  //       },
  //       (err) => console.log(err)
  //     );
  // }