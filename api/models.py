from django.db import models


class Connection(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    ninterface = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    ipv4mode = models.CharField(max_length=50)
    ipv4IpAddress = models.CharField(max_length=50, blank=True)
    ipv4BitMask = models.CharField(max_length=50, blank=True)
    ipv4Gateway = models.CharField(max_length=50, blank=True)
    ipv4Dns = models.CharField(max_length=100, blank=True)
    ipv6mode = models.CharField(max_length=50)
    ipv6IpAddress = models.CharField(max_length=50, blank=True)
    ipv6Prefix = models.CharField(max_length=50, blank=True)
    ipv6Gateway = models.CharField(max_length=50, blank=True)
    ipv6Dns = models.CharField(max_length=100, blank=True)
    automaticConection = models.BooleanField(null=False, default=True)
    primaryConection = models.BooleanField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
