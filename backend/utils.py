def suggest_category(description: str):
    description = description.lower()
    
    categories = {
        "Food": ["biryani", "pizza", "zomato", "swiggy", "hotel", "tea"],
        "Travel": ["uber", "ola", "petrol", "bus", "train", "flight"],
        "Shopping": ["amazon", "flipkart", "dress", "shirt", "shoes"],
        "Bills": ["recharge", "electricity", "eb", "rent", "water"]
    }
    
    for category, keywords in categories.items():
        if any(keyword in description for keyword in keywords):
            return category
    
    return "Others"