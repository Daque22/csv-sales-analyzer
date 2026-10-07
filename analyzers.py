from flask import Flask, request, jsonify, render_template
import csv

app = Flask(__name__)

# Frontend page
@app.route("/")
def home():
    return render_template("index.html")

#display products to front end
@app.route("/api/products", methods=["GET"])
def read_sales():
    
    rows = []
    with open("sales.csv", "r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            rows.append(row)
    print(rows)
    return jsonify(rows)

@app.route("/add_products", methods=["POST"])
def add_products():
    data = request.get_json()
    product = data["product"]
    price = data["price"]

    with open("sales.csv", "a", newline="") as file:
        writer = csv.writer(file)

        writer.writerow([
            product,
            price
        ])
   
    return jsonify({
        "message": "Product added successfully"
    })

@app.route("/api/calculate", methods=["POST"])
def calculate_sales():
    data = request.get_json()
    convert = [data]
    print(convert)

    for c in convert:
        print("jhvhfffvnbvyfbngcgfbnhgf", c)
        if c["product"] != "moggos":
            product = c["product"]
            quantity = c["quantity"]
            price = c["price"]
            index = c["index"]
            with open("calculate_sales.csv", "a", newline="") as file:
                writer = csv.writer(file)
                writer.writerow([
                   index,
                   product,
                   quantity,
                   price
                ])
            with open("calculate_sales.csv", "r") as file:
                reader = csv.DictReader(file)
                for row in reader:
                    print(row)

    with open("calculate_sales.csv", "r") as file:
        reader = csv.DictReader(file)
        products = {} # binding the overall item of calculatexd sales as one....
        for row in reader:
            products[row["product"]] = row

        result = list(products.values())
        print(result) #debugginggg


    with open("clean_sales.csv", "w", newline="", encoding="utf-8") as file:# pag write sa bagong data from to our claculatesales.csv
                
        fieldnames = ["index", "product", "quantity", "price"]
                
        writer = csv.DictWriter(
                file,
                fieldnames=fieldnames
            )
                
        writer.writeheader()
        writer.writerows(result)

    with open("clean_sales.csv", "r") as file:
            reader = csv.DictReader(file)
            resulted = []
            for r in reader:
                resulted.append(r)
       
    return jsonify(resulted)

@app.route("/api/deducting", methods=["POST", "GET"])
def deducting():
    if request.method == "POST":
        data = request.get_json()
        product = data["product"]
        
        with open("clean_sales.csv", "r", newline="") as file:
            reader = csv.DictReader(file)
            rows = list(reader)

        for row in rows:
            if row["product"] == product:
                row["quantity"] = int(row["quantity"]) - 1
                print("new quantity:", row["quantity"])
                if not row["quantity"]:
                    continue

        with open("clean_sales.csv", "w", newline="", encoding="utf-8") as file:# pag write sa bagong data from to our claculatesales.csv
                        
            fieldnames = ["index", "product", "quantity", "price"]
                        
            writer = csv.DictWriter(
                        file,
                        fieldnames=fieldnames
                    )
                        
            writer.writeheader()
            writer.writerows(rows)

        with open("calculate_sales.csv", "r", newline="") as file:
            reader = csv.DictReader(file)
            rowd = list(reader)
        
            for row in rowd:
                if row["product"] == product:
                    row["quantity"] = int(row["quantity"]) - 1
                    print("new quantity:", row["quantity"])
        
            with open("calculate_sales.csv", "w", newline="", encoding="utf-8") as file:# pag write sa bagong data from to our claculatesales.csv
                                
                fieldnames = ["index", "product", "quantity", "price"]
                                
                writer = csv.DictWriter(
                                file,
                                fieldnames=fieldnames
                            )
                                
                writer.writeheader()
                writer.writerows(rowd)

    return jsonify("okkkkkkkkkkkk.....")

@app.route("/api/reports", methods=["GET"])
def generate_report():
    sales = [] 
    total = 0
    with open("clean_sales.csv", "r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            product = row["product"]
            quantity = int(row["quantity"])
            price = float(row["price"])
            sale = {"product_sale": f"{product}: {quantity*price}"}
            sales.append(sale)

    for i in sales:
        splitted = i["product_sale"].split(":")
        price = float(splitted[int(1)].strip())
        total += price

    
    print(total)
    print(sales)

    return jsonify({"sales": sales,
                    "totals": total
                    })

@app.route("/api/sales/<product_name>", methods=["DELETE"])
def delete_product(product_name):

    products = []

    # Read CSV
    with open("sales.csv", "r", newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Keep everything EXCEPT the product we want to delete
            if row["product"] != product_name:
                products.append(row)

    # Rewrite CSV
    with open("sales.csv", "w", newline="", encoding="utf-8") as file:

        fieldnames = ["product", "quantity", "price"]

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()
        writer.writerows(products)

    return jsonify({
        "message": f"{product_name} deleted successfully"
    })


@app.route("/api/calculate_products/<product_name>", methods=["DELETE"])
def delete_calc_product(product_name):
    data = request.get_json()
    prices = float(data["price"])
    totals = float(data["totals"])
    new_total = totals - prices
    print("tour totals are:", new_total)
    products = []

    # Read CSV
    with open("calculate_sales.csv", "r", newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Keep everything EXCEPT the product we want to delete
            if row["product"] != product_name:
                products.append(row)

    # Rewrite CSV
    with open("calculate_sales.csv", "w", newline="", encoding="utf-8") as file:

        fieldnames = ["index", "product", "quantity", "price"]

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )
        
        writer.writeheader()
        writer.writerows(products)

    return jsonify({
        "message": f"{product_name} deleted successfully"
    })


#c:/csv_sales_analyzer/analyzer.py

if __name__ == "__main__":
    app.run(debug=True)