from django_countries.serializers import CountryFieldMixin
from rest_framework.serializers import ModelSerializer

from main.models import CustomUser, Resume, Vacancy, Feedback


class ForgotUsernameSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email']
        extra_kwargs = {'email': {'validators': []}}


class SearchVacancySerializer(ModelSerializer):
    class Meta:
        model = Vacancy
        fields = ['title']


class SearchVacancyResultSerializer(ModelSerializer):
    class Meta:
        model = Vacancy
        exclude = ['requirements', 'created_at', 'description', 'user']


class ResumeSerializer(CountryFieldMixin, ModelSerializer):
    class Meta:
        model = Resume
        exclude = ['user']


class ResumeCreateSerializer(CountryFieldMixin, ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'


class UpdateResumeSerializer(CountryFieldMixin, ModelSerializer):
    class Meta:
        model = Resume
        exclude = ['user']


class VacancySerializer(ModelSerializer):
    class Meta:
        model = Vacancy
        exclude = ['user']


class UpdateVacancySerializer(ModelSerializer):
    class Meta:
        model = Vacancy
        exclude = ['user']


class FeedbackSerializer(ModelSerializer):
    class Meta:
        model = Feedback
        exclude = ['resume']
