from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)

    REQUIRED_FIELDS = ['first_name',
                       'last_name',
                       'email',
                       ]
