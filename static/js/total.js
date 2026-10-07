async function reports() {
    const response = await fetch("/api/reports");// GET the total of all item...

    const Products = await response.json();

    const list = document.getElementById("reportListed");
    const hideButton = document.getElementById("hideReports");
    const showReports = document.getElementById("showReports");
    
    console.log(Products.totals);
    
    list.innerHTML = "";
    const item = document.createElement("li");
    item.innerHTML =
        `<h2>Total_Sales: ${Products.totals}</h2>`;

    list.appendChild(item);
    hideButton.addEventListener("click", () => {
        list.style.display = "none";
        hideButton.textContent = "Hide Reports";
});
    showReports.addEventListener("click", () => {
        list.style.display = "block";
        hideButton.textContent = "Hide Reports";
});
     // Tell the next page load nga button ang nag-trigger sa reload
 //   localStorage.setItem("openModalAfterReload", "true");
  //  localStorage.setItem("totalSales", Products.totals);
  //  location.reload();
}
