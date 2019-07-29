from django.contrib import admin
from django.conf.urls import url
from dashboard import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    #url(r'^$', views.home, name='home'),
    url(r'^dashboard/', views.dashboard, name='dashboard'),
    url(r'^ajax_dashboard/', views.ajax_dashboard, name='ajax_dashboard'),
]
