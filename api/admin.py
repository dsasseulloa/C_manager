from django.contrib import admin
from .models import Connection


class ConnectionAdmin(admin.ModelAdmin):
    list = ('name',
            'type',
            'ninterface',
            'description',
            'ipv4mode',
            'ipv4IpAddress',
            'ipv4BitMask',
            'ipv4Gateway',
            'ipv4Dns',
            'ipv6mode',
            'ipv6IpAddress',
            'ipv6Prefix',
            'ipv6Gateway',
            'ipv6Dns',
            'automaticConection',
            'primaryConection')

    admin.site.register(Connection)
