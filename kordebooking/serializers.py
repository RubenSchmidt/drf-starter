from rest_framework import serializers
from kordebooking.models import Booking, BookingItem


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking


class BookingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingItem


