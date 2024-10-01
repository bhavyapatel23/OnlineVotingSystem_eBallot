from rest_framework import serializers
from .models import Party,Poll,Vote,User_Votes
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomeUser
from rest_framework.authtoken.views import Token

class CustomAuthTokenSerializer(serializers.Serializer):
    election_id = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        election_id = data.get('election_id')
        password = data.get('password')

        if not election_id or not password:
            raise serializers.ValidationError('Both fields are required.')

        user = authenticate(election_id=election_id, password=password)
        if not user:
            raise serializers.ValidationError('Invalid credentials.')
        
        return {'user': user}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomeUser
        fields=['id','election_id','mobile_no','password','is_superuser']


        extra_kwargs={'password':
        {   
            'write_only':True,
            'required':True
        }}
    def create(self,validated_data):
        user=CustomeUser.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user

class PollSerializer(serializers.ModelSerializer):
    class Meta:
        model=Poll
        fields=['id','poll_title','poll_start_date','poll_start_time','poll_end_date','poll_end_time','is_published']
        extra_kwargs = {
            'is_published': {'required': False},  # Make it optional for updates
        }


class PartySerializer(serializers.ModelSerializer):
    class Meta:
        model=Party
        fields=['id','poll','partyname','candidatename','sign']


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Vote
        fields=['candidatename','partyname','poll_title']


class UserVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Votes
        fields = ['userID', 'pollTitle']














