from django.conf.urls import url, include
from kordebooking import views

urlpatterns = [
    url(r'^bookings$', views.BookingList.as_view(), name='booking-list'),
    url(r'^bookings/(?P<pk>\d+)$', views.BookingDetail.as_view(), name='booking-detail'),

    url(r'^bookingitem$', views.BookingItemList.as_view(), name='booking-item-list'),
    url(r'^bookingitem/(?P<pk>\d+)$', views.BookingItemDetail.as_view(), name='booking-item-detail'),
]
