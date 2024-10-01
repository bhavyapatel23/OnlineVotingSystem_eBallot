from django.contrib.auth.models import BaseUserManager

class CustomManager(BaseUserManager):
    def create_user(self, election_id, mobile_no, password=None, **extra_fields):
        if not election_id:
            raise ValueError('The Election ID must be set')
        user = self.model(election_id=election_id, mobile_no=mobile_no, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, election_id, mobile_no, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(election_id, mobile_no, password, **extra_fields)
