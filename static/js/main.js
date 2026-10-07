//GET - kuha tanan products
async function getProducts() {
    const response = await fetch("/api/products");//automatically by default GET method api

    const products = await response.json();

    const list = document.getElementById("productList");
    console.log(products);

    list.innerHTML = "";

    products.forEach((product, index) => {
        console.log(index)
        const item = document.createElement("li");

        item.innerHTML =
            `${product.product} - ${product.price}
            <p class="total">₱${0}</p>
            <p class="identity">0</p>
            <input class="quantity" placeholder="quantity" required>
            <br></br>
             <button class="hideButton">
             Delete
              </button>
            <button class="adding">
                adds
            </button>
            <button class="deduction">
                deduct
            </button>`;

        const hideButton = item.querySelector(".hideButton");
        hideButton.addEventListener("click", () => {
            fetch(
                    `/api/sales/${encodeURIComponent(product.product)}`,
                    {
                        method: "DELETE"
                     }
            )
            .then(response => response.json())
            .then(data => {
                console.log(data);
            item.remove();

    });
});

        list.appendChild(item);
        let count = 0;
        const deduct = item.querySelector(".deduction");
        const total = item.querySelector(".total");
        const identity = item.querySelector(".identity");
      //  counting = ""; //

    //for recording the letter that inputted on user input!!!!
     const quantity = item.querySelector(".quantity");
        quantity.addEventListener("input", () => {
            if (quantity.value.trim() === "") {// trim is like strip() method in python to omit the spaces
                counting = 0;
                identity.textContent = "0";
                total.textContent = "0";
                console.log("Input empty, counting:", counting);
                return;
            }
            counting = Number(quantity.value);
            if (Number.isNaN(counting)) {
                quantity.value = quantity.value.replace(/\D/g, "");//replace "" the input if letters...
                alert("Please enter numbers only!");
                return;
            };

            identity.textContent = `${counting}`;
            total.textContent = `₱${counting * product.price}`;
         //   console.log("my value issssss", counting
        //    );
            
            Calculate(
              product.product,
              counting,
              product.price,
              index
        );
        });
        // for addings individually buttons
        const addings = item.querySelector(".adding");
        addings.addEventListener("click", () => {
        count++;
        identity.textContent = `${Number(quantity.value) + 1}`;
        countez = identity.textContent;
        quantity.value = countez;
        total.textContent = `₱${countez * product.price}`;

        totals_me = total.textContent;
        Calculate(
              product.product,
              countez,
              product.price,
              index
        );
     });

    //for subtracting each invidual value including its display...
    deduct.addEventListener("click", async() => {
    if(quantity.value <= 0){
           return;
       };
    quantity.value -= 1;
    force = Number(quantity.value);
    identity.textContent = `${force}`;
    total.textContent = `₱${quantity.value * product.price}`;

    const response = await fetch("/api/deducting", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            product: product.product
        })
    });
    
    const Products = await response.json();

    });
});

}

document.addEventListener("DOMContentLoaded", () => {
getProducts();

});//para ingnon display directly ang products sa frontend...

const modal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
closeModal.addEventListener("click", () => {   
        modal.style.display = "none";
    });


function openModalAndReload() {
    modal.style.display = "flex";

    // Tell the next page load nga button ang nag-trigger sa reload
    localStorage.setItem("openModalAfterReload", "true");

    location.reload();
}

window.addEventListener("DOMContentLoaded", () => {

    const shouldOpen = localStorage.getItem("openModalAfterReload");

    if (shouldOpen === "true") {
        modal.style.display = "flex";

        // IMPORTANT: consume/remove the flag
        localStorage.removeItem("openModalAfterReload");
    } else {
        modal.style.display = "none";
    }

});

