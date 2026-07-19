from django.urls import path
from .views import generate_post_view

urlpatterns = [
    path('generate-post/', generate_post_view, name='generate_post'),
]
