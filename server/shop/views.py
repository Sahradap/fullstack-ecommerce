from decimal import Decimal

from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from products.models import Product
from .models import CartItem, Order, OrderItem
from .serializers import CartItemSerializer, OrderSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def cart_list_create(request):
    if request.method == "GET":
        cart_items = (
            CartItem.objects.filter(user=request.user)
            .select_related("product")
            .order_by("id")
        )

        serializer = CartItemSerializer(cart_items, many=True)

        cart_total = sum(
            (item.product.price * item.quantity for item in cart_items),
            Decimal("0.00"),
        )

        return Response({
            "items": serializer.data,
            "cart_total": cart_total,
        })

    # POST: add a product to the cart.
    serializer = CartItemSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    product = serializer.validated_data["product"]
    quantity = serializer.validated_data["quantity"]

    if quantity > product.quantity:
        return Response(
            {"error": f"Only {product.quantity} item(s) are available."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_item, created = CartItem.objects.get_or_create(
        user=request.user,
        product=product,
        defaults={"quantity": quantity},
    )

    if not created:
        new_quantity = cart_item.quantity + quantity

        if new_quantity > product.quantity:
            return Response(
                {"error": f"Only {product.quantity} item(s) are available."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.quantity = new_quantity
        cart_item.save(update_fields=["quantity"])

    return Response(
        CartItemSerializer(cart_item).data,
        status=(
            status.HTTP_201_CREATED
            if created
            else status.HTTP_200_OK
        ),
    )


@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def cart_item_detail(request, pk):
    try:
        cart_item = (
            CartItem.objects.select_related("product")
            .get(id=pk, user=request.user)
        )
    except CartItem.DoesNotExist:
        return Response(
            {"error": "Cart item not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "PUT":
        try:
            quantity = int(request.data.get("quantity"))
        except (TypeError, ValueError):
            return Response(
                {"error": "Quantity must be a valid number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity > cart_item.product.quantity:
            return Response(
                {
                    "error": (
                        f"Only {cart_item.product.quantity} "
                        "item(s) are available."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.quantity = quantity
        cart_item.save(update_fields=["quantity"])

        return Response(CartItemSerializer(cart_item).data)

    # DELETE: remove the cart item.
    cart_item.delete()

    return Response(
        {"message": "Product removed from cart."},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    shipping_address = request.data.get("shipping_address", "")

    if not isinstance(shipping_address, str) or not shipping_address.strip():
        return Response(
            {"error": "Shipping address is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    with transaction.atomic():
        # Lock the user's cart items for this checkout.
        cart_items = list(
            CartItem.objects.select_for_update()
            .filter(user=request.user)
            .order_by("id")
        )

        if not cart_items:
            return Response(
                {"error": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Lock product rows, then check their current stock and prices.
        products = {
            product.id: product
            for product in Product.objects.select_for_update()
            .filter(id__in=[item.product_id for item in cart_items])
            .order_by("id")
        }

        for item in cart_items:
            product = products[item.product_id]

            if item.quantity > product.quantity:
                return Response(
                    {"error": f"Not enough stock for {product.name}."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        total_amount = sum(
            (
                products[item.product_id].price * item.quantity
                for item in cart_items
            ),
            Decimal("0.00"),
        )

        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            shipping_address=shipping_address.strip(),
        )

        for item in cart_items:
            product = products[item.product_id]

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item.quantity,
                price=product.price,
            )

            product.quantity -= item.quantity
            product.save(update_fields=["quantity"])

        CartItem.objects.filter(
            id__in=[item.id for item in cart_items]
        ).delete()

    return Response(
        OrderSerializer(order).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_orders(request):
    orders = (
        Order.objects.filter(user=request.user)
        .prefetch_related("items__product")
        .order_by("-created_at")
    )

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)