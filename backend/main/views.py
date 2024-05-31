from django.core.mail import send_mail
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, RetrieveDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from main.models import CustomUser, Vacancy
from main.serializers import ForgotUsernameSerializer, ResumeSerializer, UpdateResumeSerializer, VacancySerializer, \
    UpdateVacancySerializer, SearchVacancySerializer, FeedbackSerializer


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


@extend_schema(
    tags=['Resume']
)
class CreateResumeView(CreateAPIView):
    serializer_class = ResumeSerializer


@extend_schema(
    tags=['Resume']
)
class ResumeView(RetrieveUpdateAPIView):
    serializer_class = UpdateResumeSerializer
    lookup_field = 'user'


@extend_schema(
    tags=['Vacancy']
)
class CreateVacancyView(CreateAPIView):
    serializer_class = VacancySerializer


@extend_schema(
    tags=['Vacancy']
)
class VacancyView(RetrieveUpdateAPIView):
    serializer_class = UpdateVacancySerializer
    lookup_field = 'user'


class SearchVacancyView(APIView):
    @extend_schema(
        tags=['Vacancy'],
        request=SearchVacancySerializer,
        responses={
            status.HTTP_200_OK: VacancySerializer(many=True)
        }
    )
    def post(self, request):
        serializer = SearchVacancySerializer(data=request.data)

        if serializer.is_valid():
            return Vacancy.objects.filter(title__search=serializer.data['title'])
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Feedback']
)
class CreateFeedbackView(CreateAPIView):
    serializer_class = FeedbackSerializer


@extend_schema(
    tags=['Feedback']
)
class UpdateFeedbackView(RetrieveDestroyAPIView):
    serializer_class = FeedbackSerializer
