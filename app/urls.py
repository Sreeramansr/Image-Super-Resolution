from django.urls import path
from . import views

app_name = 'app'

urlpatterns = [
 path('', views.index, name='index'),
 path('image_resolution', views.super_resolution, name='image_resolution'),
]