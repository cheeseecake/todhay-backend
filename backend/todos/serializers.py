from rest_framework import serializers
from .models import Todos, Habits, Projects, Wishlist
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from django.db.models import Count, Sum

class HabitSerializer(serializers.ModelSerializer):
    total_rewards = serializers.SerializerMethodField()
    total_effort = serializers.SerializerMethodField()
    class Meta:
        model = Habits
        fields = "__all__"
    def get_total_rewards(self, obj):
        return (obj.count * obj.reward)
    def get_total_effort(self, obj):
        return (obj.count * obj.effort)

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = "__all__"

class ProjectSerializer(serializers.ModelSerializer):
    total_rewards  = serializers.SerializerMethodField()
    total_todos  = serializers.SerializerMethodField()
    total_effort  = serializers.SerializerMethodField()
    class Meta:
        model = Projects
        fields = ('id','type', 'title', 'description', 'startdate', 'duedate', 'completedate', 'total_rewards', 'total_todos', 'total_effort')
    def get_total_rewards(self, obj):
        return list(Todos.objects.values_list().filter(project=obj,completedate__isnull=False).aggregate(Sum('reward')).values())[0]
    def get_total_todos(self, obj):
        return list(Todos.objects.values_list().filter(project=obj).aggregate(Count('title')).values())[0]
    def get_total_effort(self, obj):
        return list(Todos.objects.values_list().filter(project=obj,completedate__isnull=False).aggregate(Sum('effort')).values())[0]

class TodoSerializer(serializers.ModelSerializer):
    projecthabit_name = serializers.SerializerMethodField()
    frequency = serializers.SerializerMethodField()
    days_to_due = serializers.SerializerMethodField()
    days_to_start = serializers.SerializerMethodField()
    class Meta:
        model = Todos
        fields =   "__all__"
    def get_days_to_due(self, obj):
        return (obj.duedate - timezone.now().date() ).days
    def get_days_to_start(self, obj):
        return (obj.startdate - timezone.now().date() ).days
    def get_projecthabit_name(self, obj):
        try:
            projecthabit_name = obj.project.title
        except: 
            try: 
                projecthabit_name = obj.habit.title
            except:
                return (None)
        return (projecthabit_name)
    def get_frequency(self, obj):
        try: 
            frequency = obj.habit.frequency
        except:
            return (None)
        return(frequency)

