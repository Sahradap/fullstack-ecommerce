from django.shortcuts import render
from rest_framework.decorators import api_view
from .serializers import ProductSerializer
from .models import Product
from rest_framework.response import Response

# Create your views here.


@api_view(['GET'])
def get_products(request):
    products = Product.objects.all().order_by('id')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product_detail(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    serializer = ProductSerializer(product)
    return Response(serializer.data)