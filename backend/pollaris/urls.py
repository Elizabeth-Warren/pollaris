"""pollaris URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path

from pollaris.app.views import search_logging, search_views, side_effects
from pollaris.app.views.search_views import AddressComponentSearch, AddressStringSearch

urlpatterns = [
    path("", search_views.index, name="index"),
    path("api/v1/search/address", AddressComponentSearch.as_view()),
    path("api/v1/search/string", AddressStringSearch.as_view()),
    path("api/v1/search/log", search_logging.log_failed_search),
    path("api/v1/forms/after_search", side_effects.after_search),
]
