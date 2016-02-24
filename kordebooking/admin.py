from django.contrib import admin
from kordebooking.models import BookingItem, Booking


# Register your models here.

class BookingAdmin(admin.ModelAdmin):
    model = Booking


admin.register(Booking, BookingAdmin)


class BookingItemAdmin(admin.ModelAdmin):
    model = BookingItem


admin.register(BookingItem, BookingItemAdmin)
