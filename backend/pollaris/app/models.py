from django.contrib.postgres.fields import JSONField
from django.core.validators import RegexValidator
from django.db import models

from model_utils import FieldTracker


class LocationBase(models.Model):
    location_id = models.BigIntegerField(primary_key=True)
    location_name = models.CharField(max_length=1024)
    address = models.CharField(max_length=1024)
    city = models.CharField(max_length=1024)
    state_code = models.CharField(
        max_length=2, validators=[RegexValidator("^[A-Z]{2}$")]
    )
    zip = models.CharField(max_length=5, validators=[RegexValidator("^[0-9]{5}$")])
    dates_hours = models.CharField(max_length=1024, blank=True)
    # Lat and Long stored as DecimalField to replicate BigQuery's "numeric" data type
    latitude = models.DecimalField(
        max_digits=38, decimal_places=9, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=38, decimal_places=9, null=True, blank=True
    )

    def __str__(self):
        return f"ID: {self.location_id}, Name: {self.location_name}, Address: {self.address}, {self.city}"

    class Meta:
        abstract = True


class PollingLocation(LocationBase):
    tracker = FieldTracker(fields=["location_name", "address", "city"])


class EarlyVoteLocation(LocationBase):
    tracker = FieldTracker(fields=["location_name", "address", "city"])


class DropboxLocation(LocationBase):
    tracker = FieldTracker(fields=["location_name", "address", "city"])


class Precinct(models.Model):
    van_precinct_id = models.PositiveIntegerField(primary_key=True)
    state_code = models.CharField(max_length=2)
    county = models.CharField(max_length=1024)
    fips = models.CharField(max_length=1024, blank=True)
    precinct_code = models.CharField(max_length=1024, blank=True)

    def __str__(self):
        return f"ID: {self.van_precinct_id}, Code: {self.precinct_code}"


class PrecinctToLocationBase(models.Model):
    precinct = models.ForeignKey(
        Precinct,
        db_column="van_precinct_id",
        on_delete=models.CASCADE,
        db_constraint=False,
    )
    state_code = models.CharField(max_length=2)
    distance = models.FloatField(blank=True, null=True)

    class Meta:
        abstract = True


class PrecinctToPollingLocation(PrecinctToLocationBase):
    location = models.ForeignKey(
        PollingLocation,
        on_delete=models.CASCADE,
        db_constraint=False,
        db_column="polling_location_id",
    )

    def __str__(self):
        return f"Precinct: {self.precinct}. Location: {self.location.location_name}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["location", "precinct"], name="unique_precinct_polling_location"
            )
        ]


class PrecinctToDropboxLocation(PrecinctToLocationBase):
    location = models.ForeignKey(
        DropboxLocation,
        on_delete=models.CASCADE,
        db_constraint=False,
        db_column="dropbox_location_id",
    )

    def __str__(self):
        return f"Precinct: {self.precinct}. Location: {self.location.location_name}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["location", "precinct"], name="unique_precinct_dropbox_location"
            )
        ]


class PrecinctToEVLocation(PrecinctToLocationBase):
    location = models.ForeignKey(
        EarlyVoteLocation,
        on_delete=models.CASCADE,
        db_constraint=False,
        db_column="early_vote_location_id",
    )

    def __str__(self):
        return f"Precinct: {self.precinct}. Location: {self.location.location_name}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["location", "precinct"], name="unique_precinct_ev_location"
            )
        ]


class CountyToEVLocation(models.Model):
    location = models.ForeignKey(
        EarlyVoteLocation,
        on_delete=models.CASCADE,
        db_constraint=False,
        db_column="early_vote_location_id",
    )
    county = models.CharField(max_length=1024)
    state_code = models.CharField(max_length=2)

    def __str__(self):
        return f"County: {self.county}, Location: {self.location}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["location", "county"],
                name="countytoev_unique_county_ev_location",
            )
        ]


class Zip9ToPrecinct(models.Model):
    precinct = models.ForeignKey(
        Precinct,
        db_column="van_precinct_id",
        on_delete=models.CASCADE,
        db_constraint=False,
    )
    zip9 = models.CharField(max_length=9, unique=True)
    state_code = models.CharField(max_length=2)
    confidence_score = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"Zip: {self.zip9}. Precinct: {self.precinct}"


class StreetSegment(models.Model):
    precinct = models.ForeignKey(
        Precinct,
        db_column="van_precinct_id",
        on_delete=models.CASCADE,
        db_constraint=False,
    )
    address = models.CharField(max_length=1024)
    street_number = models.CharField(max_length=1024)
    street_pre_dir = models.CharField(max_length=1024, blank=True)
    street_name = models.CharField(max_length=1024)
    street_type = models.CharField(max_length=1024, blank=True)
    street_post_dir = models.CharField(max_length=1024, blank=True)
    city = models.CharField(max_length=1024)
    state_code = models.CharField(max_length=2)
    zip = models.CharField(max_length=9)
    confidence_score = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.address}, {self.city} {self.state_code} {self.zip}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["address", "city", "state_code", "zip"],
                name="unique_addr_city_state_zip",
            )
        ]


class SearchLog(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    # ID representing this search, used to link searches across frontend, backend, and BSD
    search_id = models.CharField(max_length=1024, blank=True, null=True)
    # Whether we successfully returned a polling location
    success = models.BooleanField()
    # If successful, how we found the match (address or zip). If failed, the reason why.
    search_status = models.CharField(max_length=1024)
    autocomplete_selected = models.BooleanField(null=True)
    heap_id = models.CharField(max_length=1024, null=True)
    # Address information from the search
    street_number = models.CharField(max_length=1024, blank=True, null=True)
    street = models.CharField(max_length=1024, blank=True, null=True)
    county = models.CharField(max_length=1024, blank=True, null=True)
    city = models.CharField(max_length=1024, blank=True, null=True)
    state_code = models.CharField(max_length=1024, blank=True, null=True)
    zip5 = models.CharField(max_length=1024, blank=True, null=True)
    zip9 = models.CharField(max_length=1024, blank=True, null=True)
    # If address couldn't be parsed into components, we store the search string the user entered
    search_string = models.CharField(max_length=1024, blank=True, null=True)
    precinct = models.ForeignKey(
        Precinct,
        db_column="van_precinct_id",
        db_constraint=False,
        on_delete=models.DO_NOTHING,
        blank=True,
        null=True,
    )
    # Source of the search -- e.g. web, shortcode, QC, etc
    source = models.CharField(max_length=1024, blank=True, null=True)
    # Referrer for web searches
    referrer = models.CharField(max_length=1024, blank=True, null=True)
    # Holds any other data we want to store, e.g. lat/long, whether smartystreets was queried, etc
    other_data = JSONField(blank=True, null=True)
