//POST - add product
async function addProduct(){

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    const response = await fetch("/add_products", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            product: name,
            price: Number(price)
        })
    });

    const product = await response.json();

    console.log("Added:", product);

    getProducts();
}


async function Calculate(product_name,quantity,price,index) {

    const response = await fetch("/api/calculate", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            product: product_name,
            quantity:quantity,
            price: price,
            index: index
        })
    });
    const Products = await response.json();

    console.log(Products)
    Products.forEach((product, index) => {
        const list = document.getElementById("productListed");
       // console.log("my lsited items: ", list)
        const item = document.createElement("li");

                item.innerHTML =
                `${index} - ${product.product} - ${product.quantity} - ₱${product.price} = ₱${product.quantity * product.price}
                 <button class="hideButton" >delete</button>`;
                 
            list.appendChild(item);

        const hideButton = item.querySelector(".hideButton");
        hideButton.addEventListener("click", async () => {
            const response = await fetch("/api/reports");
            const Products = await response.json();
 //           Products.totals -= product.price;

            fetch(
                    `/api/calculate_products/${encodeURIComponent(product.product)}`,
                    {
                        method: "DELETE",
                        headers: {"Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            price: product.quantity * product.price,
                            totals: Products.totals
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            item.remove();
            modal.style.display = "flex";
            // Tell the next page load nga button ang nag-trigger sa reload
            localStorage.setItem("openModalAfterReload", "true");
            location.reload();

        });
    });
        
   });
   console.log("Added:", Products);

}

document.addEventListener("DOMContentLoaded", () => {
Calculate("moggos",10, 10);
});


