from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    birth_date = models.DateField(_("дата рождения"))
    gender = models.CharField(_('пол'), choices=[
        ('m', 'Мужской'),
        ('f', 'Женский')
    ])

    REQUIRED_FIELDS = ['first_name',
                       'last_name',
                       'email',
                       'birth_date',
                       'gender'
                       ]
