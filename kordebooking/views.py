from kordebooking.models import BookingItem, Booking
from kordebooking.serializers import BookingSerializer, BookingItemSerializer
from rest_framework import permissions, generics


class BookingMixin(object):
    model = Booking
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]


class BookingList(BookingMixin, generics.ListCreateAPIView):
    pass


class BookingDetail(BookingMixin, generics.RetrieveUpdateDestroyAPIView):
    pass


class BookingItemMixin(object):
    model = BookingItem
    queryset = BookingItem.objects.all()
    serializer_class = BookingItemSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]


class BookingItemList(BookingItemMixin, generics.ListCreateAPIView):
    pass


class BookingItemDetail(BookingItemMixin, generics.RetrieveUpdateDestroyAPIView):
    pass
