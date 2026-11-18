products = [
    {
        "name": "Whole milk",
        "category": "Dairy",
        "quantity": 8,
        "expiry_date": "2026-11-20"
    },
    {
        "name": "Baby spinach",
        "category": "Produce",
        "quantity": 5,
        "expiry_date": "2026-11-18"
    }
]

for product in products:
    print(product["name"], "-", product["expiry_date"])
    from datetime import date

def get_status(expiry_date):
    expiry = date.fromisoformat(expiry_date)
    today = date.today()
    days_left = (expiry - today).days

    if days_left < 0:
        return "Expired"
    elif days_left <= 7:
        return "Expiring soon"
    else:
        return "Fresh"


for product in products:
    status = get_status(product["expiry_date"])
while True:
    answer = input("Add a product? (yes/no): ").lower()

    if answer == "no":
        break

    name = input("Product name: ")
    category = input("Category: ")
    quantity = int(input("Quantity: "))
    expiry_date = input("Expiry date (YYYY-MM-DD): ")

    new_product = {
        "name": name,
        "category": category,
        "quantity": quantity,
        "expiry_date": expiry_date
    }

    products.append(new_product)

    print("Product added!")
    print("Status:", get_status(expiry_date))
from datetime import date
import json

products = [
    {
        "name": "Whole milk",
        "category": "Dairy",
        "quantity": 8,
        "expiry_date": "2026-11-20"
    },
    {
        "name": "Baby spinach",
        "category": "Produce",
        "quantity": 5,
        "expiry_date": "2026-11-18"
    }
]


def get_status(expiry_date):
    expiry = date.fromisoformat(expiry_date)
    today = date.today()
    days_left = (expiry - today).days

    if days_left < 0:
        return "Expired"
    elif days_left <= 7:
        return "Expiring soon"
    else:
        return "Fresh"


try:
    with open("products.json", "r", encoding="utf-8") as file:
        products = json.load(file)
except FileNotFoundError:
    pass


def save_products():
    with open("products.json", "w", encoding="utf-8") as file:
        json.dump(products, file, indent=4)


def show_products():
    if not products:
        print("There are no products in the inventory.")
        return

    for product in products:
        status = get_status(product["expiry_date"])

        print("-------------------------")
        print("Product:", product["name"])
        print("Category:", product["category"])
        print("Quantity:", product["quantity"])
        print("Expiry date:", product["expiry_date"])
        print("Status:", status)


def add_product():
    name = input("Product name: ")
    category = input("Category: ")
    quantity = int(input("Quantity: "))
    expiry_date = input("Expiry date (YYYY-MM-DD): ")

    new_product = {
        "name": name,
        "category": category,
        "quantity": quantity,
        "expiry_date": expiry_date
    }

    products.append(new_product)
    save_products()

    print("Product added!")


while True:
    print()
    print("Product Expiration Monitor")
    print("1. Show products")
    print("2. Add a product")
    print("3. Exit")

    choice = input("Choose an option: ")

    if choice == "1":
        show_products()
    elif choice == "2":
        add_product()
    elif choice == "3":
        print("Goodbye!")
        break
    else:
        print("Invalid option. Please choose 1, 2, or 3.")