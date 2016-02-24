from django.db import models
from django.contrib.auth.models import User
from kordebooking.enums import countries, currencies
from django.utils.translation import ugettext_lazy as _


class Booking(models.Model):
    """
    Model to contain information about a booking.
    Note, that on the model itself, most of the attributes are blank=True.
    We need this behaviour to be able to create empty temporary bookings.
    You will have to take care of the field being required or not in a
    ModelForm yourself.
    :user (optional): Connection to Django's User model. Only used if it is a registered user
    :gender (optional): Gender of the user.
    :title (optional): Title of the user.
    :forename (optional): First name of the user.
    :surname (optional): Last name of the user.
    :nationality (optional): The nationality of the user.
    :street1 (optional): Street address of the user.
    :street2 (optional): Additional street address of the user.
    :city (optional): City of the user's address.
    :zip_code (optional): ZIP of the user's address.
    :country (optional): Country of the user's address.
    :phone (optional): Phone number of the user.
    :email: Email of the user.
    :special_request (optional): A special request of the customer.
    :date_from (optional): From when the booking is active.
    :date_until (optional): Until when the booking is active.
    :time_period (optional): How long the period from date_from will be.
      e.g.: 10 (days).
    :creation_date: Date of the booking.
    :booking_id (optional): Custom unique booking identifier.
    :booking_status: Current status of the booking.
    :notes (optional): Staff notes.
    :total (optional): Field for storing a total of all items.
    :currency (optional): If total is uses, we usually also need a currency.
    """
    user = models.ForeignKey(
        User,
        verbose_name=_('User'),
        related_name='bookings',
        blank=True, null=True,
    )

    gender = models.CharField(
        max_length=10,
        verbose_name=_('Gender'),
        choices=(
            ('mrs', _('Mrs')),
            ('mr', _('Mr')),
        ),
        blank=True,
    )

    title = models.CharField(
        max_length=10,
        verbose_name=_('Title'),
        choices=(
            ('dr', _('Dr.')),
            ('prof', _('Prof.')),
        ),
        blank=True,
    )

    forename = models.CharField(
        verbose_name=_('First name'),
        max_length=20,
        blank=True,
    )

    surname = models.CharField(
        verbose_name=_('Last name'),
        max_length=20,
        blank=True,
    )

    nationality = models.CharField(
        max_length=2,
        verbose_name=_('Nationality'),
        choices=countries,
        blank=True,
    )

    street1 = models.CharField(
        verbose_name=_('Street 1'),
        max_length=256,
        blank=True,
    )

    street2 = models.CharField(
        verbose_name=_('Street 2'),
        max_length=256,
        blank=True,
    )

    city = models.CharField(
        verbose_name=_('City'),
        max_length=256,
        blank=True,
    )

    zip_code = models.CharField(
        verbose_name=_('ZIP/Postal code'),
        max_length=256,
        blank=True,
    )

    country = models.CharField(
        max_length=2,
        verbose_name=_('Country'),
        choices=countries,
        blank=True,
    )

    email = models.EmailField(
        verbose_name=_('Email'),
        blank=True,
    )

    phone = models.CharField(
        verbose_name=_('Phone'),
        max_length=256,
        blank=True,
    )

    special_request = models.TextField(
        max_length=1024,
        verbose_name=_('Special request'),
        blank=True,
    )

    date_from = models.DateTimeField(
        verbose_name=_('From'),
        blank=True, null=True,
    )

    date_until = models.DateTimeField(
        verbose_name=_('Until'),
        blank=True, null=True,
    )

    creation_date = models.DateTimeField(
        verbose_name=_('Creation date'),
        auto_now_add=True,
    )

    notes = models.TextField(
        max_length=1024,
        verbose_name=_('Notes'),
        blank=True,
    )

    time_period = models.PositiveIntegerField(
        verbose_name=_('Time period'),
        blank=True, null=True,
    )

    currency = models.CharField(
        verbose_name=_('Currency'),
        max_length=128,
        blank=True,
        choices=currencies
    )

    class Meta:
        ordering = ['-creation_date']

    def __str__(self):
        return '#{} ({})'.format(self.pk,
                                 self.creation_date)


class BookingItem(models.Model):
    """
    Model to connect a booking with a related object.
    :quantity: Quantity of booked items.
    :persons (optional): Quantity of persons, who are involved in this booking.
    :subtotal (optional): Field for storing the price of each individual item.
    :booked_item: Connection to related booked item.
    :booking: Connection to related booking.
    properties:
    :price: Returns the full price for subtotal * quantity.
    """
    quantity = models.PositiveIntegerField(
        default=1,
        verbose_name=_('Quantity'),
    )

    persons = models.PositiveIntegerField(
        verbose_name=_('Persons'),
        blank=True, null=True,
    )

    subtotal = models.DecimalField(
        max_digits=36,
        decimal_places=2,
        verbose_name=_('Subtotal'),
        blank=True, null=True,
    )

    booking = models.ForeignKey(
        Booking,
        verbose_name=_('Booking'),
    )

    class Meta:
        ordering = ['-booking__creation_date']

    def __str__(self):
        return '{} ({})'.format(self.booking, self.booked_item)

    @property
    def price(self):
        return self.quantity * self.subtotal
