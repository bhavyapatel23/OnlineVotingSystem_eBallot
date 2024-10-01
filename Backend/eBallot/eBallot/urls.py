from django.contrib import admin
from django.urls import path, include
from eBallotapp.views import PartyViewSet, PollViewSet,VoteViewSet,ObtainAuthToken,UserViewSet,UserTokenView,UserVotesViewSet
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token



router = DefaultRouter()
router.register('partys', PartyViewSet, basename='partys')
router.register('polls', PollViewSet, basename='polls')
router.register('votes',VoteViewSet,basename='votes')
router.register('users',UserViewSet)
router.register('user_votes',UserVotesViewSet)
# router.register('uservotes',UserVotesList,basename='uservotes')


urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include(router.urls)),
    path('auth/',ObtainAuthToken.as_view()),
    path('token_user/',UserTokenView.as_view()),
    path('parties_by_poll/<int:poll_id>/', PartyViewSet.as_view({'get': 'list'}), name='parties-by-poll'),
        
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
