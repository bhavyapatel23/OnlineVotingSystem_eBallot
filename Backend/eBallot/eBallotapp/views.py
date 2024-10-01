from django.shortcuts import render
from .models import Party, Poll, Vote,CustomeUser,User_Votes
from .serializer import PartySerializer, PollSerializer, VoteSerializer,UserSerializer,UserVotesSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework import generics


from rest_framework import parsers, renderers

from rest_framework.views import APIView
from rest_framework.schemas import ManualSchema
from rest_framework.schemas import coreapi as coreapi_schema
from .serializer import CustomAuthTokenSerializer


class ObtainAuthToken(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = CustomAuthTokenSerializer

    if coreapi_schema.is_enabled():
        schema = ManualSchema(
            fields=[
                coreapi.Field(
                    name="election_id",
                    required=True,
                    location='form',
                    schema=coreschema.String(
                        title="Election ID",
                        description="Valid Election ID for authentication",
                    ),
                ),
                coreapi.Field(
                    name="password",
                    required=True,
                    location='form',
                    schema=coreschema.String(
                        title="Password",
                        description="Valid password for authentication",
                    ),
                ),
            ],
            encoding="application/json",
        )

    def get_serializer_context(self):
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self
        }

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return self.serializer_class(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})




class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomeUser.objects.all()
    serializer_class = UserSerializer

class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer

    @action(detail=False, methods=['get'], url_path='published')
    def published(self, request):
        # Filter queryset to only include published polls
        published_polls = Poll.objects.filter(is_published=True)
        serializer = self.get_serializer(published_polls, many=True)
        return Response(serializer.data)

class PartyViewSet(viewsets.ModelViewSet):
    serializer_class = PartySerializer

    def get_queryset(self):
        queryset=Party.objects.all()
        poll_id = self.kwargs.get('poll_id')  # Get 'poll_id' from URL
        if poll_id is not None:
            queryset = Party.objects.filter(poll=poll_id)  # Use 'poll_id' to filter
        return queryset

class UserVotesViewSet(viewsets.ModelViewSet):
    queryset = User_Votes.objects.all()
    serializer_class = UserVotesSerializer




class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

class UserTokenView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # The user associated with the token can be accessed directly
        user = request.user
    
        # Return user information
        return Response({
            'userID':user.id,
            'election_id': getattr(user, 'election_id', None),  # Example for a custom field
            'is_superuser': user.is_superuser,
            
        })
