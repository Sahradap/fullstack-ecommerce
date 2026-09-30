from django.urls import path

from . import views


urlpatterns = [
    path('cart/', views.cart_list_create, name='cart_list_create'),
    path(
        'cart/<int:pk>/',
        views.cart_item_detail,
        name='cart_item_detail'
    ),
    path('orders/', views.get_orders, name='get_orders'),
    path(
        'orders/create/',
        views.create_order,
        name='create_order'
    ),
]