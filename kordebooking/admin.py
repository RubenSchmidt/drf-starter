from django.contrib import admin
from kordebooking.models import BookingItem, Booking


# Register your models here.

class BookingAdmin(admin.ModelAdmin):
    model = Booking


admin.site.register(Booking, BookingAdmin)


class BookingItemAdmin(admin.ModelAdmin):
    model = BookingItem


admin.site.register(BookingItem, BookingItemAdmin)
