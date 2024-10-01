from django.db import models
from django.contrib.auth.models import AbstractUser,Group, Permission
from .managers import CustomManager
from django.conf import settings





class Poll(models.Model):
    poll_title=models.CharField(max_length=100)
    poll_start_date=models.DateField()
    poll_start_time=models.TimeField()
    poll_end_date=models.DateField()
    poll_end_time=models.TimeField()
    is_published=models.BooleanField(default=False)

    def __str__(self):
        return self.poll_title

class Party(models.Model):
    poll = models.ForeignKey(Poll, related_name='parties', on_delete=models.CASCADE,default='pollxyz')
    partyname=models.CharField(max_length=100)
    candidatename=models.CharField(max_length=100)
    sign=models.ImageField(upload_to='uploads/')

    def __str__(self):
        return self.partyname


class Vote(models.Model):

    candidatename=models.CharField(max_length=100)
    partyname=models.CharField(max_length=100)
    poll_title=models.CharField(max_length=100)

    def __str__(self):
        return self.candidatename

class CustomeUser(AbstractUser):
    username = None  # Exclude the default username field
    mobile_no = models.CharField(max_length=12)
    election_id = models.CharField(max_length=10, unique=True)
    USERNAME_FIELD = 'election_id'
    REQUIRED_FIELDS = ['mobile_no']

    # Define unique related_name values to avoid conflicts
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',  # Ensure this name is unique
        blank=True,
        help_text='Groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',  # Ensure this name is unique
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    objects = CustomManager()  # Ensure CustomManager is defined

    def __str__(self):
        return self.election_id


class User_Votes(models.Model):
    userID=models.IntegerField()
    pollTitle=models.CharField(max_length=100)

    def __str__(self):
        return self.pollTitle






