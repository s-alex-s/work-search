from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from main.models import CustomUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['name'] = user.username

        return token


class ForgotUsernameSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email']
        extra_kwargs = {'email': {'validators': []}}
