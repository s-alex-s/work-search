from django.urls import path

from main.views import ForgotUsernameView, CreateResumeView, GetUpdateResumeView, GetUpdateVacancyView, \
    CreateVacancyView, SearchVacancyView, CreateFeedbackView, DeleteFeedbackView, GetFeedbacksView

urlpatterns = [
    path('auth/users/forgot_username/', ForgotUsernameView.as_view(), name='forgot_username'),

    path('resume/create/', CreateResumeView.as_view(), name='create_resume'),
    path('resume/', GetUpdateResumeView.as_view(), name='edit_resume'),

    path('vacancy/create/', CreateVacancyView.as_view(), name='create_vacancy'),
    path('vacancy/<int:pk>/', GetUpdateVacancyView.as_view(), name='edit_vacancy'),
    path('vacancy/search/', SearchVacancyView.as_view(), name='search_vacancy'),

    path('feedback/create/', CreateFeedbackView.as_view(), name='create_feedback'),
    path('feedback/get/', GetFeedbacksView.as_view(), name='get_feedback'),
    path('feedback/delete/<int:pk>/', DeleteFeedbackView.as_view(), name='delete_feedback'),
]
