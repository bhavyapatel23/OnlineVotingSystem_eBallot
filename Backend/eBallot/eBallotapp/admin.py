from django.contrib import admin
from .models import Party,Poll,Vote,CustomeUser,User_Votes


admin.site.register(Party)
admin.site.register(Poll)
# admin.site.register(User_Votes)


@admin.register(CustomeUser)
class CustomeUserModel(admin.ModelAdmin):
    list_filter=('election_id','mobile_no')
    list_display=('election_id','mobile_no','is_staff','is_active')


@admin.register(Vote)
class VoteModel(admin.ModelAdmin):
    list_filter=('candidatename','partyname','poll_title')
    list_display=('candidatename','partyname','poll_title')

@admin.register(User_Votes)
class User_VotesModel(admin.ModelAdmin):
    list_filter=('userID','pollTitle')
    list_display=('userID','pollTitle')