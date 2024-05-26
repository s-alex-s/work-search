from django.core.mail import send_mail
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from main.models import CustomUser
from main.serializers import ForgotUsernameSerializer


class ForgotUsernameView(APIView):
    @extend_schema(
        request=ForgotUsernameSerializer,
        responses={
            status.HTTP_200_OK: ForgotUsernameSerializer,
        }
    )
    def post(self, request):
        serializer = ForgotUsernameSerializer(data=request.data)

        if serializer.is_valid():
            try:
                send_mail(
                    subject='Имя пользователя',
                    message=f'Ваш логин: '
                            f'{CustomUser.objects.get(email=serializer.data['email']).username}\n\nWork Search',
                    recipient_list=[serializer.data['email']],
                    from_email=None
                )

                return Response(status=status.HTTP_204_NO_CONTENT)
            except CustomUser.DoesNotExist:
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
