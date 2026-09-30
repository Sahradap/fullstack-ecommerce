from django.db import models

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    image_url = models.ImageField(upload_to='product_images/',null=True,blank=True)
    category = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    brand = models.CharField(max_length=100,blank=True,default="")


    def __str__(self):
        return self.name
