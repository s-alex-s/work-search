from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField
from djmoney.models.fields import MoneyField
from phonenumber_field.modelfields import PhoneNumberField


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

    def __str__(self):
        return f'ID: {self.pk}, Username: {self.username}'


class Resume(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    phone_number = PhoneNumberField(blank=True)
    additional_contacts = models.TextField(blank=True, max_length=2000)
    profession = models.CharField(max_length=250)
    busyness = models.CharField(max_length=250, blank=True)
    languages = models.TextField(blank=True, max_length=2000)
    education = models.TextField(blank=True, max_length=2000)
    country = CountryField(blank=True)
    work_experience = models.TextField(blank=True, max_length=2000)

    class Meta:
        verbose_name = 'Резюме'
        verbose_name_plural = 'Резюме'
        ordering = ['user__username']

    def __str__(self):
        return self.user.username


class Vacancy(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    title = models.CharField(max_length=100)
    salary = MoneyField(max_digits=10, decimal_places=0, blank=True, null=True)
    company = models.CharField(max_length=250)
    country = CountryField()
    requirements = models.TextField(blank=True, max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, max_length=2000)

    class Meta:
        verbose_name = 'Вакансия'
        verbose_name_plural = 'Вакансии'
        ordering = ['-created_at']

    def __str__(self):
        return f'ID: {self.pk}, {self.title}'


class Feedback(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Отклик'
        verbose_name_plural = 'Отклики'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.resume.user.username} - {self.vacancy.title}'
