pizza_slices = 8
eaten = 3

if pizza_slices > 5:
      print("Plenty of pizza!")
else:
      print("Need more pizza")

for slice in range(eaten):
      print(f"Eating slice {slice + 1}")

def order_pizza(size):
      return f"Ordered {size} pizza"

my_order = order_pizza("large")
print(my_order)