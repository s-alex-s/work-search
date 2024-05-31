from django.urls import path

from main.views import ForgotUsernameView, CreateResumeView, ResumeView, VacancyView, CreateVacancyView, \
    SearchVacancyView, CreateFeedbackView, UpdateFeedbackView

urlpatterns = [
    path('auth/users/forgot_username/', ForgotUsernameView.as_view(), name='forgot_username'),

    path('resume/create/', CreateResumeView.as_view(), name='create_resume'),
    path('resume/', ResumeView.as_view(), name='edit_resume'),

    path('vacancy/create/', CreateVacancyView.as_view(), name='create_vacancy'),
    path('vacancy/', VacancyView.as_view(), name='edit_vacancy'),
    path('vacancy/search/', SearchVacancyView.as_view(), name='search_vacancy'),

    path('feedback/create/', CreateFeedbackView.as_view(), name='create_feedback'),
    path('feedback/update/', UpdateFeedbackView.as_view(), name='update_feedback'),
]
