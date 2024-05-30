from rest_framework.serializers import ModelSerializer
from main.models import CustomUser


class ForgotUsernameSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email']
        extra_kwargs = {'email': {'validators': []}}
