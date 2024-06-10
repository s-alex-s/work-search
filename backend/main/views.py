from django.core.mail import send_mail
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, DestroyAPIView, ListAPIView, \
    get_object_or_404, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from main.models import CustomUser, Vacancy, Resume, Feedback
from main.serializers import ForgotUsernameSerializer, ResumeSerializer, UpdateResumeSerializer, VacancySerializer, \
    UpdateVacancySerializer, FeedbackSerializer, SearchVacancyResultSerializer, SearchVacancySerializer, \
    ResumeCreateSerializer, VacancyCreateSerializer, FeedbackCreateSerializer, UserResumeSerializer


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

    def create(self, request, *args, **kwargs):
        request.data['user'] = self.request.user.pk
        serializer = ResumeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@extend_schema(
    tags=['Resume']
)
class GetUpdateDeleteResumeView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateResumeSerializer
    queryset = Resume.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        data = dict(serializer.data)
        data['user_info'] = UserResumeSerializer(instance.user).data

        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        data = dict(serializer.data)
        data['user_info'] = UserResumeSerializer(instance.user).data

        return Response(data)

    def get_object(self):
        return get_object_or_404(Resume, user=self.request.user)


@extend_schema(
    tags=['Resume']
)
class GetResumeView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ResumeSerializer
    queryset = Resume.objects.all()

    def get(self, request, *args, **kwargs):
        if Feedback.objects.filter(vacancy__user=self.request.user, resume=kwargs['pk']):
            return self.retrieve(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        data = dict(serializer.data)
        data['user_info'] = UserResumeSerializer(instance.user).data

        return Response(data)


@extend_schema(
    tags=['Vacancy']
)
class CreateVacancyView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = VacancyCreateSerializer
    queryset = Vacancy.objects.all()

    def create(self, request, *args, **kwargs):
        request.data['user'] = self.request.user.pk
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@extend_schema(
    tags=['Vacancy']
)
class GetUpdateDeleteVacancyView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateVacancySerializer
    queryset = Vacancy.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        data = dict(serializer.data)
        data['feedback'] = bool(Feedback.objects.filter(
            resume=self.request.user.resume,
            vacancy=instance
        ))

        return Response(data)

    def patch(self, request, *args, **kwargs):
        if self.get_object().user == self.request.user:
            return self.partial_update(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request, *args, **kwargs):
        if self.get_object().user == self.request.user:
            return self.update(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, *args, **kwargs):
        if self.get_object().user == self.request.user:
            return self.destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)


@extend_schema(
    tags=['Vacancy']
)
class GetVacancies(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = VacancySerializer

    def get_queryset(self):
        return Vacancy.objects.filter(user=self.request.user)


class SearchVacancyView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    http_method_names = ['post']
    serializer_class = SearchVacancySerializer

    @extend_schema(
        tags=['Vacancy'],
        request=SearchVacancySerializer,
        responses={
            status.HTTP_200_OK: SearchVacancyResultSerializer(many=True)
        }
    )
    def post(self, request, *args, **kwargs):
        if self.request.user.has_resume():
            return self.list(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = SearchVacancyResultSerializer(page, many=True)

            feedbacks = Feedback.objects.filter(resume=self.request.user.resume)
            for n, vacancy in enumerate(serializer.data):
                if feedbacks.filter(vacancy=vacancy['id']):
                    serializer.data[n]['feedback'] = True
                else:
                    serializer.data[n]['feedback'] = False

            return self.get_paginated_response(serializer.data)

        serializer = SearchVacancyResultSerializer(queryset, many=True)

        feedbacks = Feedback.objects.filter(resume=self.request.user.resume)
        for n, vacancy in enumerate(serializer.data):
            if feedbacks.filter(vacancy=vacancy['id']):
                serializer.data[n]['feedback'] = True
            else:
                serializer.data[n]['feedback'] = False

        return Response(serializer.data)

    def get_queryset(self):
        return Vacancy.objects.exclude(user=self.request.user).filter(title__icontains=self.request.data['title'])


@extend_schema(
    tags=['Feedback']
)
class CreateFeedbackView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FeedbackCreateSerializer
    queryset = Feedback.objects.all()

    def post(self, request, *args, **kwargs):
        vacancy = Vacancy.objects.get(pk=self.request.data['vacancy'])
        if vacancy.user != self.request.user and not Feedback.objects.filter(
                vacancy=vacancy,
                resume=self.request.user.resume
        ) and self.request.user.has_resume():
            return self.create(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def create(self, request, *args, **kwargs):
        request.data['resume'] = self.request.user.resume.pk
        serializer = FeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@extend_schema(
    tags=['Feedback']
)
class DeleteFeedbackView(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def delete(self, request, *args, **kwargs):
        if not self.request.user.has_resume():
            return Response(status=status.HTTP_403_FORBIDDEN)
        if self.get_object().vacancy.user == self.request.user or \
                self.get_object().resume == self.request.user.resume:
            return self.destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)


@extend_schema(
    tags=['Feedback'],
    responses={
        status.HTTP_200_OK: FeedbackSerializer(many=True)
    }
)
class GetFeedbacksView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FeedbackSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)

            for n, feedback in enumerate(serializer.data):
                serializer.data[n]['vacancy'] = {
                    'id': feedback['vacancy'],
                    'title': Vacancy.objects.get(pk=feedback['vacancy']).title
                }

                resume = Resume.objects.get(pk=serializer.data[n]['resume'])
                serializer.data[n]['resume'] = {
                    'id': serializer.data[n]['resume'],
                    'name': f'{resume.user.first_name} {resume.user.last_name}'
                }

            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        return Feedback.objects.filter(vacancy__user=self.request.user)


@extend_schema(
    tags=['Feedback'],
    responses={
        status.HTTP_200_OK: FeedbackSerializer(many=True)
    }
)
class GetUserFeedbacksView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FeedbackSerializer

    def get(self, request, *args, **kwargs):
        if self.request.user.has_resume():
            return self.list(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)

            for n, feedback in enumerate(serializer.data):
                serializer.data[n]['vacancy'] = {
                    'id': feedback['vacancy'],
                    'title': Vacancy.objects.get(pk=feedback['vacancy']).title
                }

            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        return Feedback.objects.filter(resume=self.request.user.resume)
