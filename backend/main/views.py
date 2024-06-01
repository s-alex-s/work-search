from django.core.mail import send_mail
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import status, serializers
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, DestroyAPIView, ListAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from main.models import CustomUser, Vacancy, Resume, Feedback
from main.serializers import ForgotUsernameSerializer, ResumeSerializer, UpdateResumeSerializer, VacancySerializer, \
    UpdateVacancySerializer, FeedbackSerializer, SearchVacancyResultSerializer, SearchVacancySerializer


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
    permission_classes = (IsAuthenticated,)
    serializer_class = ResumeSerializer
    queryset = Resume.objects.all()


@extend_schema(
    tags=['Resume']
)
class GetUpdateResumeView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateResumeSerializer
    queryset = Resume.objects.all()

    def get_object(self):
        return get_object_or_404(Resume, user=self.request.user)


@extend_schema(
    tags=['Vacancy']
)
class CreateVacancyView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = VacancySerializer
    queryset = Vacancy.objects.all()


@extend_schema(
    tags=['Vacancy']
)
class GetUpdateVacancyView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateVacancySerializer
    queryset = Vacancy.objects.all()

    def patch(self, request, *args, **kwargs):
        if self.get_object().user.pk == self.request.user.pk:
            return self.partial_update(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request, *args, **kwargs):
        if self.get_object().user.pk == self.request.user.pk:
            return self.update(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)


class SearchVacancyView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    http_method_names = ['post']

    @extend_schema(
        tags=['Vacancy'],
        request=SearchVacancySerializer,
        responses={
            status.HTTP_200_OK: SearchVacancyResultSerializer(many=True)
        }
    )
    def post(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        return Vacancy.objects.filter(title__icontains=self.request.data['title'])


@extend_schema(
    tags=['Feedback']
)
class CreateFeedbackView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()


@extend_schema(
    tags=['Feedback']
)
class DeleteFeedbackView(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer


@extend_schema(
    tags=['Feedback'],
    request=inline_serializer('GetFeedbacksSerializer', fields={'user': serializers.IntegerField()}),
    responses={
        status.HTTP_200_OK: FeedbackSerializer(many=True)
    }
)
class GetFeedbacksView(ListAPIView):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Feedback.objects.filter(vacancy__user=self.request.user)
