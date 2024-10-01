from django.contrib.auth.backends import BaseBackend
from .models import CustomeUser

class ElectionIDBackend(BaseBackend):
    def authenticate(self, request, election_id=None, password=None, **kwargs):
        try:
            user = CustomeUser.objects.get(election_id=election_id)
            if user.check_password(password):
                return user
        except CustomeUser.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return CustomeUser.objects.get(pk=user_id)
        except CustomeUser.DoesNotExist:
            return None
