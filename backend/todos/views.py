# -*- coding: utf-8 -*-
from __future__ import unicode_literals


from dateutil.relativedelta import relativedelta
from django.utils import timezone
from .models import Projects, Todos, Habits, Wishlist

from rest_framework import viewsets
from .serializers import TodoSerializer, ProjectSerializer, HabitSerializer, WishlistSerializer 
        
def refreshTodos():
    print("refresh todos")
    habits_list = Habits.objects.all()
    Todos_list = Todos.objects.all()
    completed_list = Todos_list.filter(completedate__isnull=False).order_by('completedate')
    inprogress_list = Todos_list.filter(completedate__isnull=True).order_by('startdate','duedate')
    for habit in habits_list:
        exist = 0
        prevstartdate = timezone.now()
        prevduedate = timezone.now()
        for inprogress in inprogress_list:
            count = 0
            if habit == inprogress.habit:
                exist = exist +1
            for completed in completed_list:
                if habit == completed.habit:
                    count = count + 1
                    prevduedate = completed.duedate 
                    prevstartdate = completed.startdate
            frequency = habit.frequency
        if exist == 0: #if it does not exist, create new Todo with new duedate
            if frequency == 'Daily':
                duedate = prevduedate + relativedelta(days = 1)
                startdate = prevstartdate  + relativedelta(days = 1)
            elif frequency == 'Weekly':
                duedate = prevduedate + relativedelta(weeks = 1)
                startdate = prevstartdate  + relativedelta(weeks = 1)
            elif frequency == 'Monthly':
                duedate = prevduedate+ relativedelta(months = 1)
                startdate = prevstartdate  + relativedelta(months = 1)
            elif frequency == 'Quarterly':
                duedate = prevduedate + relativedelta(months = 3)
                startdate = prevstartdate  + relativedelta(months = 3)
            elif frequency == 'Yearly':
                duedate = prevduedate + relativedelta(years = 1)
                startdate = prevstartdate  + relativedelta(years = 1)
            todo = Todos(
                    title=habit.title,
                    description = habit.description,
                    effort = habit.effort,
                    reward = habit.reward,
                    habit = habit,
                    startdate = startdate.strftime("%Y-%m-%d"),
                    duedate=duedate.strftime("%Y-%m-%d"))
            todo.save()
            habit.save()

# Create your views here.
class ProjectView(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Projects.objects.all()
    def perform_create(self, serializer):
        serializer.save()
    def perform_update(self, serializer):
        serializer.save()

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todos.objects.all()
    def perform_create(self, serializer):
        serializer.save()
    def perform_update(self, serializer):
        serializer.save()
        print(serializer)
        refreshTodos()

class HabitView(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    queryset = Habits.objects.all()
    def perform_create(self, serializer):
        serializer.save()
        refreshTodos()
    def perform_update(self, serializer):
        serializer.save()

class WishlistView(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    queryset = Wishlist.objects.all() 
    def perform_create(self, serializer):
        serializer.save()
    def perform_update(self, serializer):
        serializer.save()

